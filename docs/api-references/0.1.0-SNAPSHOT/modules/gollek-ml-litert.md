---
layout: default
title: gollek-ml-litert
parent: API REferences
nav_order: 260
---

# gollek-ml-litert

The `gollek-ml-litert` module provides high-performance integration with Google's LiteRT (formerly TensorFlow Lite 2.0). it is optimized for mobile, edge, and Apple Silicon execution, enabling efficient local inference for large language models and vision tasks.

## 🌟 Overview

LiteRT is designed for "lite" execution contexts. This module allows you to load and run `.tflite` (or `.task`) models using the modern LiteRT C API wrapped in a developer-friendly Java interface. It includes specialized support for **XNNPACK** and **Metal/GPU** delegates.

## 🚀 Key Features

- **Edge-Optimized Inference**: Run models on mobile and resource-constrained environments with minimal overhead.
- **Hardware Delegation**: Seamlessly leverage Metal (macOS/iOS), NNAPI (Android), and XNNPACK (CPU) for acceleration.
- **Signature Runner Support**: Support for multi-input/multi-output models with named signatures.
- **Dynamic Tensor Allocation**: Efficiently handle variable-length inputs often found in LLM tasks.
- **Performance Benchmarking**: Integrated `LiteRTMetrics` for tracking latency, throughput, and initialization time.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-litert</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Standard LiteRT Inference

```java
import tech.kayys.gollek.litert.LiteRTSdk;
import tech.kayys.gollek.litert.config.LiteRTConfig;
import tech.kayys.gollek.ml.tensor.Tensor;

// Configure LiteRT with Metal acceleration
LiteRTConfig config = LiteRTConfig.builder()
    .useMetal(true)
    .numThreads(4)
    .build();

// Load model
LiteRTSdk engine = LiteRTSdk.load("models/gemma-2b-it.tflite", config);

// Run inference
Tensor input = Tensor.of(new float[]{...}, 1, 2048);
Tensor output = engine.execute(input);

System.out.println("Result: " + output);
```

### Async Execution with Performance Tracking

```java
import tech.kayys.gollek.litert.LiteRTMetrics;

engine.executeAsync(input)
    .thenAccept(result -> {
        LiteRTMetrics metrics = engine.getMetrics();
        System.out.println("Inference time: " + metrics.getLastInferenceTimeMs() + "ms");
    });
```

## 📖 API Highlights

### `tech.kayys.gollek.litert.LiteRTSdk`

The primary façade for the LiteRT integration.

| Method | Description |
|:-------|:------------|
| `load(path, config)` | Static method to initialize the engine with a model. |
| `execute(Tensor)` | Runs inference synchronously. |
| `executeAsync(Tensor)` | Returns a `CompletableFuture` for asynchronous inference. |
| `getMetrics()` | Returns latency and throughput statistics. |
| `unload()` | Releases native resources and delegates. |

### `tech.kayys.gollek.litert.inference.LiteRTInferenceEngine`

The underlying execution engine that manages the LiteRT interpreter and delegates.

- **`LiteRTMetrics`**: Provides detailed breakdown of initialization, warm-up, and execution times.
- **`LiteRTModelInfo`**: Inspects TFLite metadata to identify input/output nodes and quantization details.

---

[Back to API Hub](../)
