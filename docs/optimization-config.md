---
layout: default
title: Optimization Plugins Configuration
---

# ⚙️ Optimization Plugins Configuration

All 15 optimization plugins in Gollek are individually configurable with enable/disable support, priority control, device filtering, and custom properties.

---

## 🎯 Overview

Gollek's optimization plugins provide a modular way to enhance inference performance. Each plugin can be enabled or disabled independently, with sensible defaults for maximum performance out of the box.

```java
// Check if optimization is active
OptimizationRegistry registry = OptimizationRegistry.getInstance();

if (registry.isActive("paged-attention", "cuda")) {
    // Apply paged attention optimization for CUDA
}

// Enable/disable at runtime
registry.setEnabled("flash-attention", false);  // Disable
registry.setEnabled("flash-attention", true);   // Re-enable

// Get plugin configuration
OptimizationConfig config = registry.getConfig("kv-cache");
int maxSeqLen = config.getCustomPropertyAsInt("maxSequenceLength", 32768);
```

---

## 📋 All Optimization Plugins

### Core Optimizations (Highest Impact)

| Plugin | Default | Purpose | Config Key |
|--------|---------|---------|------------|
| **PagedAttention** | ✅ | VLLM-style paged KV cache (10-24x throughput) | `paged-attention` |
| **KV Cache** | ✅ | Multi-turn conversation support | `kv-cache` |
| **Continuous Batching** | ✅ | Dynamic batch sizing | `continuous-batching` |

### Attention Optimizations

| Plugin | Default | Purpose | Config Key |
|--------|---------|---------|------------|
| **FlashAttention** | ✅ | Memory-efficient attention | `flash-attention` |
| **FlashAttention-3** | ✅ | Hopper+ GPUs only (2-3x faster) | `fa3` |
| **FlashAttention-4** | ✅ | Next-gen GPUs (Blackwell/Metal) | `fa4` |
| **Hybrid Attention** | ✅ | Mix of strategies | `hybrid-attention` |

### Memory Optimizations

| Plugin | Default | Purpose | Config Key |
|--------|---------|---------|------------|
| **Prompt Cache** | ✅ | Cache system prompts (5-10x speedup) | `prompt-cache` |
| **EvicPress** | ✅ | KV cache compression | `evicpress` |
| **Weight Offload** | ❌ | Offload weights to CPU | `weight-offload` |

### Performance Modes

| Plugin | Default | Purpose | Config Key |
|--------|---------|---------|------------|
| **Perf Mode** | ✅ | Tune for latency/throughput | `perf-mode` |
| **Prefill-Decode** | ✅ | Separate kernels | `prefill-decode` |

### Scheduling Optimizations

| Plugin | Default | Purpose | Config Key |
|--------|---------|---------|------------|
| **Wait Scheduler** | ✅ | Async scheduling | `wait-scheduler` |

### Training/Fine-tuning

| Plugin | Default | Purpose | Config Key |
|--------|---------|---------|------------|
| **QLoRA** | ❌ | Quantized fine-tuning | `qlora` |
| **Elastic EP** | ❌ | Distributed training | `elastic-ep` |

---

## 🔧 Configuration Options

### Standard Options

Every optimization plugin supports these standard options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| **enabled** | boolean | `true` | Whether the optimization is active |
| **priority** | int | `100` | Execution order (lower = earlier) |
| **deviceFilter** | list | `[]` (all) | GPU architectures to target |
| **minSequenceLength** | int | `0` | Min seq length to activate |
| **maxMemoryOverheadMB** | long | `0` (unlimited) | Max memory overhead |

### Custom Properties

Each plugin has plugin-specific properties:

```properties
# PagedAttention custom properties
gollek.optimizations.paged-attention.blockSize=16
gollek.optimizations.paged-attention.totalBlocks=2048

# KV Cache custom properties
gollek.optimizations.kv-cache.evictionPolicy=LRU
gollek.optimizations.kv-cache.maxSequenceLength=32768

# Continuous Batching custom properties
gollek.optimizations.continuous-batching.maxBatchSize=256
gollek.optimizations.continuous-batching.scheduleIntervalMs=10
```

---

## 📝 Complete Configuration Example

```properties
# ============================================================================
# Gollek Optimization Plugins Configuration
# ============================================================================

# ── Core Optimizations ──
gollek.optimizations.paged-attention.enabled=true
gollek.optimizations.paged-attention.blockSize=16
gollek.optimizations.paged-attention.totalBlocks=2048

gollek.optimizations.kv-cache.enabled=true
gollek.optimizations.kv-cache.evictionPolicy=LRU
gollek.optimizations.kv-cache.maxSequenceLength=32768

gollek.optimizations.continuous-batching.enabled=true
gollek.optimizations.continuous-batching.maxBatchSize=256

# ── Attention Optimizations ──
gollek.optimizations.flash-attention.enabled=true
gollek.optimizations.flash-attention.deviceFilter=cuda,metal,rocm
gollek.optimizations.flash-attention.minSeqLen=512

gollek.optimizations.fa3.enabled=true
gollek.optimizations.fa3.deviceFilter=cuda
gollek.optimizations.fa3.minComputeCapability=90

# ── Memory Optimizations ──
gollek.optimizations.prompt-cache.enabled=true
gollek.optimizations.prompt-cache.maxPrompts=1000
gollek.optimizations.prompt-cache.ttlMinutes=60

# ── Training (Disabled by Default) ──
gollek.optimizations.qlora.enabled=false
gollek.optimizations.qlora.rank=16
gollek.optimizations.qlora.alpha=32
```

---

## 🚀 Programmatic API

### Build Configuration

```java
OptimizationConfig config = OptimizationConfig.builder("paged-attention")
    .enabled(true)
    .priority(10)
    .addDeviceFilter("cuda")
    .addDeviceFilter("hopper")
    .minSequenceLength(512)
    .customProperty("blockSize", "16")
    .customProperty("totalBlocks", "2048")
    .build();

// Register with registry
OptimizationRegistry.getInstance().register(config);
```

### Runtime Toggling

```java
OptimizationRegistry registry = OptimizationRegistry.getInstance();

// Disable optimization
registry.setEnabled("flash-attention", false);

// Check status
boolean isActive = registry.isActive("flash-attention", "cuda");

// Get configuration
OptimizationConfig config = registry.getConfig("paged-attention");
int blockSize = config.getCustomPropertyAsInt("blockSize", 16);
```

### State Change Listeners

```java
registry.addListener(new OptimizationStateListener() {
    @Override
    public void onStateChanged(String pluginId, boolean enabled) {
        System.out.println(pluginId + " is now " + (enabled ? "ENABLED" : "DISABLED"));
    }
});

// This will trigger the listener
registry.setEnabled("paged-attention", false);
```

---

## 📊 Default Priority Order

Plugins execute in priority order (lower number = earlier):

| Priority | Plugin | Category |
|----------|--------|----------|
| 2 | FA4 | Attention |
| 3 | FA3 | Attention |
| 5 | FlashAttention | Attention |
| 10 | PagedAttention | Core |
| 15 | Continuous Batching | Core |
| 20 | KV Cache | Core |
| 25 | Prompt Cache | Memory |
| 30 | Hybrid Attention | Attention |
| 35 | EvicPress | Memory |
| 40 | Perf Mode | Performance |
| 45 | Prefill-Decode | Performance |
| 50 | Wait Scheduler | Scheduling |
| 55 | Weight Offload | Memory |
| 60 | QLoRA | Training |
| 65 | Elastic EP | Training |

---

## 🎯 Use Cases

### Maximum Performance (All Enabled)

```properties
# This is the default - all optimizations enabled
gollek.optimizations.*.enabled=true
```

### Minimal Memory Footprint

```properties
# Disable memory-heavy optimizations
gollek.optimizations.paged-attention.totalBlocks=512
gollek.optimizations.kv-cache.maxSequenceLength=4096
gollek.optimizations.prompt-cache.maxPrompts=100
gollek.optimizations.weight-offload.enabled=true
```

### CPU-Only Deployment

```properties
# Disable all GPU optimizations
gollek.optimizations.flash-attention.enabled=false
gollek.optimizations.fa3.enabled=false
gollek.optimizations.fa4.enabled=false
gollek.optimizations.hybrid-attention.enabled=false
gollek.optimizations.evicpress.enabled=false
gollek.optimizations.prefill-decode.enabled=false
gollek.optimizations.elastic-ep.enabled=false
```

### Development Mode

```properties
# Disable all optimizations for fast iteration
gollek.optimizations.paged-attention.enabled=false
gollek.optimizations.kv-cache.enabled=false
gollek.optimizations.continuous-batching.enabled=false
gollek.optimizations.flash-attention.enabled=false
```

---

## 📈 Performance Impact

| Optimization | Throughput | Memory | Latency | When to Disable |
|--------------|------------|--------|---------|-----------------|
| PagedAttention | **+10-24x** | -60% | -30% | Short sequences (<256 tokens) |
| FlashAttention | **+2-3x** | -50% | -20% | Short sequences |
| Continuous Batching | **+5-10x** | -20% | -15% | Single request |
| Prompt Cache | **+5-10x** | +100MB | -80% | No repeated prompts |
| KV Cache | Required | -40% | -20% | Single-turn only |

---

## 🚀 Getting Started

1. **[Review Default Config](#-default-priority-order)** - Understand defaults
2. **[Configure for Your Use Case](#-use-cases)** - Enable/disable as needed
3. **[Monitor Performance](/docs/runtime/inference-serving#-monitoring--metrics)** - Track impact

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--subtle-bg); border-radius: 12px;">
  <h3>Ready to Optimize?</h3>
  <p>Start with <strong><a href="/docs/runtime/inference-serving">Inference Serving</a></strong> or explore <strong><a href="/docs/gpu-acceleration/">GPU Backends</a></strong></p>
</div>
