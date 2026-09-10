---
layout: default
title: Inference Guide
---

# 🚀 Inference Guide

Gollek provides a **unified inference API** that works across all frameworks (GGUF, ONNX, LiteRT, TensorRT, TorchScript).

---

## Unified Model Runner

### Basic Usage

```java
ModelRunner runner = ModelRunner.builder()
    .modelPath("model.onnx")
    .device(RunnerDevice.CUDA)
    .build();

InferenceResult result = runner.infer(
    InferenceInput.fromFloats(inputData, 1, 3, 224, 224)
);

float[] output = result.primaryOutput().asFloats();
```

### Framework-Specific Configuration

```java
// GGUF with quantization
ModelRunner gguf = ModelRunner.builder()
    .modelPath("llama-3-8b.Q4_0.gguf")
    .format(ModelFormat.GGUF)
    .device(RunnerDevice.CUDA)
    .option("n_threads", 8)
    .option("n_gpu_layers", 35)
    .build();

// ONNX with TensorRT
ModelRunner onnx = ModelRunner.builder()
    .modelPath("model.onnx")
    .device(RunnerDevice.CUDA)
    .option("trt.workspace_size", 1L << 30)  // 1GB
    .option("trt.fp16", true)
    .build();
```

---

## Dynamic Batching

### Automatic Request Batching

```java
BatchingEngine batcher = BatchingEngine.builder()
    .runner(modelRunner)
    .maxBatchSize(256)
    .maxWaitTime(Duration.ofMillis(10))
    .slaP95(Duration.ofMillis(100))
    .build();

// Submit requests (automatically batched)
var future1 = batcher.submit(input1);
var future2 = batcher.submit(input2);
// Both processed in single batch

InferenceResult result1 = future1.get();
InferenceResult result2 = future2.get();
```

### Batch Statistics

```java
BatchingEngine.BatchStats stats = batcher.stats();
System.out.println("Avg batch size: " + stats.avgBatchSize());
System.out.println("Total batches: " + stats.totalBatches());
System.out.println("Queue size: " + stats.currentQueueSize());
```

---

## Graph Fusion

### Fusing Operations

```java
FusionEngine engine = FusionEngine.builder()
    .device(FusionEngine.FusionDevice.CUDA)
    .enableFusion(FusionEngine.FusionType.ELEMENTWISE)
    .enableFusion(FusionEngine.FusionType.ACTIVATION)
    .build();

// Register operations
Operation matmul = engine.registerOp("matmul", input, weight);
Operation add = engine.registerOp("add", matmul, bias);
Operation relu = engine.registerOp("relu", add);

// Fuse and compile
FusedGraph fused = engine.fuse(matmul, add, relu).compile();

// Execute as single kernel
float[] output = fused.execute(input);
```

### Supported Fusion Patterns

| Pattern | Operations | Speedup |
|---------|-----------|---------|
| **Linear + Bias + Activation** | matmul → add → relu/gelu | 2-3x |
| **Layer Norm + Dropout** | layer_norm → dropout | 1.5x |
| **Attention** | qkv_matmul → scale → softmax → v_matmul | 3-5x |

---

## Quantization

### INT8 Quantization

```java
QuantizedModel qModel = QuantizationEngine.builder()
    .modelPath("model.safetensors")
    .scheme(QuantizationEngine.QuantizationScheme.INT8)
    .build()
    .quantize();

System.out.println("Compression: " + qModel.compressionRatio() + "x");
```

### INT4 with AWQ

```java
QuantizedModel qModel = QuantizationEngine.builder()
    .modelPath("llama-3-70b.safetensors")
    .scheme(QuantizationEngine.QuantizationScheme.AWQ)
    .targetPrecision(QuantizationEngine.Precision.INT4)
    .calibrationData(calibrationDataset)
    .build()
    .quantize();

// INT4 inference: 4x faster, 4x less memory
ModelRunner qRunner = ModelRunner.builder()
    .modelPath(qModel.quantizedPath())
    .build();
```

### Quantization Comparison

| Scheme | Compression | Accuracy Loss | Speedup |
|--------|-------------|---------------|---------|
| **FP16** | 2x | 0% | 1x (baseline) |
| **INT8** | 4x | <1% | 1.5-2x |
| **INT4 (AWQ)** | 8x | 1-3% | 2-4x |
| **FP8** | 4x | <0.5% | 1.5-2x |

---

## Shared Memory Pool {#shared-memory-pool}

### Shared Memory Allocation

```java
MemoryPool pool = MemoryPool.builder()
    .device(RunnerDevice.CUDA)
    .maxSizeGB(16)
    .strategy(MemoryPool.MemoryStrategy.FRAGMENT_AWARE)
    .build();

// Allocate from pool (zero-copy between frameworks)
MemorySegment tensor = pool.allocate(1024 * 1024);

// Use with any framework
libtorchRunner.infer(tensor);
onnxRunner.infer(tensor);  // No copy needed!

// Free when done
pool.free(tensor);
```

### Memory Statistics

```java
MemoryPool.PoolStats stats = pool.stats();
System.out.println("Allocated: " + stats.formattedAllocated());
System.out.println("Max: " + stats.formattedMax());
System.out.println("Utilization: " + stats.utilizationPercent() + "%");
```

---

## Multi-Device Inference

### Device Selection

```java
// Auto-select best device
RunnerDevice device = Gollek.defaultDevice();

// Explicit device
ModelRunner cuda = ModelRunner.builder()
    .modelPath("model.onnx")
    .device(RunnerDevice.CUDA)
    .build();

ModelRunner metal = ModelRunner.builder()
    .modelPath("model.onnx")
    .device(RunnerDevice.METAL)
    .build();
```

### Device Availability

```java
boolean cudaAvailable = Gollek.isCudaAvailable();
boolean metalAvailable = Gollek.isMetalAvailable();

System.out.println("CUDA: " + (cudaAvailable ? "Available" : "Not available"));
System.out.println("Metal: " + (metalAvailable ? "Available" : "Not available"));
```

---

## Performance Monitoring

### Inference Statistics

```java
PerformanceStats stats = runner.performanceStats();
System.out.println("Total calls: " + stats.totalCalls());
System.out.println("Avg latency: " + stats.avgLatencyMs() + "ms");
System.out.println("P95 latency: " + stats.p95LatencyMs() + "ms");
System.out.println("Tokens/sec: " + stats.tokensPerSecond());
System.out.println("Success rate: " + stats.successRate() + "%");
```

---

## 📚 Examples

### JBang Examples

```bash
# Comprehensive v0.3 demo
jbang examples/jbang/sdk/unified_framework_demo.java --demo all

# Graph fusion benchmark
jbang examples/jbang/sdk/graph_fusion_example.java --size 8192
```

### Jupyter Notebooks

- [01-getting-started.ipynb](/examples/jupyter/01-getting-started.ipynb) - SDK basics
- [06-llm-integration.ipynb](/examples/jupyter/06-llm-integration.ipynb) - LLM integration

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--subtle-bg); border-radius: 12px;">
  <h3>Next Steps</h3>
  <p><a href="/docs/framework/">Framework Guide</a> • 
     <a href="/docs/framework/quantization">Quantization Guide</a> • 
     <a href="/docs/framework/inference#graph-fusion">Graph Fusion</a></p>
</div>
