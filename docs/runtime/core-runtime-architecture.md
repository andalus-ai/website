---
layout: default
title: Core Runtime Architecture
parent: Documentation
nav_order: 6
---

# Gollek Core Runtime Architecture

The Gollek runtime is built as a layered, modular engine that evolves from
basic tensor operations to production-grade LLM inference with continuous
batching, prefix caching, and multi-tenant scheduling.

## Module Structure

```
gollek/core/
├── gollek-runtime-tensor     ← Foundation: Tensor SPI, Backend, Pool
├── gollek-runtime-graph      ← Computation Graph, Fusion, Memory Planner
└── gollek-runtime-inference  ← KV Cache, Batching, Scheduling, Speculative Decoding
```

---

## Phase 1 — Tensor SPI & Backend Abstraction

### Universal Tensor Interface

All inference engines (LibTorch, GGML, ONNX, LiteRT) produce tensors through
a single interface:

```java
public interface Tensor extends AutoCloseable {
    long[] shape();
    DType dtype();
    Device device();
    BackendType backend();

    Tensor add(Tensor other, ExecutionContext ctx);
    Tensor matmul(Tensor other, ExecutionContext ctx);
    Tensor relu(ExecutionContext ctx);

    Tensor reshape(long... newShape);      // zero-copy
    Tensor slice(int dim, long s, long e); // zero-copy
}
```

### Supported Data Types (`DType`)

| Type | Bytes | Use |
|------|-------|-----|
| FLOAT32 | 4 | Standard precision |
| FLOAT16 | 2 | GPU inference |
| BFLOAT16 | 2 | Training |
| INT8 | 1 | Quantized inference |
| INT4 | ~0.5 | GGML-style quantization |
| QINT8 | 1 | Per-tensor quantized |
| QINT4 | 1 | Per-group quantized |

### Pluggable Backends

Backends register at startup and operations dispatch transparently:

```java
// Register
BackendRegistry.register(new LibTorchBackend());

// Use — backend selected automatically
Tensor c = a.add(b, ctx);  // → dispatches to LibTorch
```

### Memory Pooling (`TensorPool`)

Eliminates malloc/free overhead during graph execution:

```java
TensorPool pool = new TensorPool();
MemorySegment seg = pool.acquire(key, backend, ctx);
// ... use tensor ...
pool.release(key, seg);  // returns to pool, not freed

pool.hitRate();  // e.g. 0.85 (85% reuse)
```

### Execution Context

Scoped lifecycle for temporary tensors:

```java
try (var ctx = new ExecutionContext()) {
    Tensor a = backend.createTensor(shape, DType.FLOAT16, Device.CUDA, ctx);
    Tensor b = a.add(other, ctx);
    // all temps cleaned up here
}
```

---

## Phase 2 — Computation Graph Engine

### Lazy Execution

Record operations without executing, then optimize the full graph:

```java
ComputationGraph graph = new ComputationGraph();
LazyTensor a = LazyTensor.input(graph, "a", shape, dtype, device, backend);
LazyTensor b = LazyTensor.input(graph, "b", shape, dtype, device, backend);
Tensor c = a.add(b, null).relu(null);
// Nothing executed — graph recorded
```

### Operator Fusion

The `FusionOptimizer` merges adjacent operations:

| Pattern | Fused Op | Benefit |
|---------|----------|---------|
| `add` + `relu` | `add_relu` | 1 kernel launch instead of 2 |
| `matmul` + `relu` | `matmul_relu` | Reduced memory traffic |
| `matmul` + `add` | `matmul_add` | Bias fusion |

### Lifetime-Based Memory Planning

The `LifetimeAnalyzer` computes when tensors are produced and last used.
The `GraphMemoryPlanner` reuses memory blocks whose lifetimes don't overlap:

```
Before: O(n_nodes) memory allocations
After:  O(max_concurrent_tensors) — typically 3-5x reduction
```

### Full Pipeline

```java
Tensor result = GraphExecutor.execute(graph, backend, pool, ctx);
// 1. Topological sort (GraphPlanner)
// 2. Operator fusion (FusionOptimizer)
// 3. Lifetime analysis (LifetimeAnalyzer)
// 4. Memory-planned execution (GraphMemoryPlanner)
```

---

## Phase 3 — LLM Inference Runtime

### Multi-Backend Routing

The `HeuristicRouter` selects backends per-operation:

```java
// Large matmul → GPU (LibTorch)
// Small attention → CPU quantized (GGML)
// Softmax → GPU for FP precision
```

### Paged KV Cache

vLLM-style paged memory for transformer attention:

```java
PagedKVCache cache = new PagedKVCache(128); // 128 tokens per page
cache.append(layer, k, v);                  // auto-allocates new pages
cache.getPages(layer);                      // for PagedAttention kernel
```

### Continuous Batching

Dynamic request scheduling (vLLM-style):

```java
ContinuousBatchScheduler scheduler = new ContinuousBatchScheduler(32);
scheduler.submit(new BatchRequest(tokens, cache, streamer, 512));
scheduler.start(batch -> {
    // Execute one decode step for all active requests
});
```

Requests enter and leave the batch dynamically:
```
t0: [A, B]        — 2 requests
t1: [A, B, C]     — C joins mid-flight
t2: [B, C]        — A finishes
t3: [B, C, D, E]  — D, E join
```

### Prefix Cache

Reuses KV cache state for shared prompt prefixes (30-90% compute savings):

```java
PrefixCache prefixCache = PrefixCache.createDefault();
KVCache cached = prefixCache.findLongestPrefix(tokens);
if (cached != null) {
    // Skip prefill for shared prefix — massive speedup
}
```

### Speculative Decoding

Draft+verify for 2x-5x inference speedup:

```java
SpeculativeDecoder decoder = new SpeculativeDecoder(
    draftModel,   // small, fast
    targetModel,  // large, accurate
    4             // 4 speculative steps
);
decoder.generate(tokens, cache, 512, eosToken, streamer);
```

---

## Phase 4 — Multi-Tenant Production Scheduling

### Tenant Tiers

| Tier | DRR Quantum | Description |
|------|------------|-------------|
| FREE | 1 | Community access |
| PRO | 3 | 3x compute priority |
| ENTERPRISE | 10 | 10x compute, dedicated quotas |

### DRR Fair Scheduler

```java
MultiTenantScheduler scheduler = new MultiTenantScheduler();
scheduler.registerTenant(new TenantContext(
    "tenant-1", TenantTier.ENTERPRISE,
    50,   // max concurrent requests
    1000, // max KV blocks
    1000  // max tokens/sec
));

scheduler.submitDecode(batchRequest);
List<BatchRequest> batch = scheduler.nextDecodeBatch(32);
```

### KV Quota Enforcement

```java
KVQuotaManager quotas = new KVQuotaManager(scheduler);
if (quotas.tryAllocate("tenant-1", 10)) {
    // Allocate 10 KV blocks
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│              Multi-Tenant Scheduler             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│   │  FREE    │  │   PRO    │  │ENTERPRISE│    │
│   │ quantum=1│  │ quantum=3│  │quantum=10│    │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│        └──────────────┼─────────────┘          │
│                       ▼                         │
│         ┌──────────────────────┐                │
│         │ ContinuousBatchScheduler │            │
│         └──────────┬───────────┘                │
│                    ▼                            │
│        ┌───────────────────────┐                │
│        │    GraphExecutor      │                │
│        │  ┌─────────────────┐  │                │
│        │  │ FusionOptimizer │  │                │
│        │  │ MemoryPlanner   │  │                │
│        │  └─────────────────┘  │                │
│        └──────────┬────────────┘                │
│                   ▼                             │
│   ┌────────┬──────────┬──────────┬────────┐    │
│   │LibTorch│   GGML   │   ONNX   │ LiteRT │    │
│   │Backend │ Backend  │ Backend  │Backend │    │
│   └────────┴──────────┴──────────┴────────┘    │
│                                                 │
│   ┌─────────────────────────────────────────┐  │
│   │          TensorPool + NativeMemory       │  │
│   └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```
