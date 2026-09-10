---
layout: default
title: On-Device Inference with LiteRT
parent: Advanced Tutorials
grand_parent: Tutorials
nav_order: 2
---

# 📱 On-Device Inference with LiteRT

Bringing your Gollek models to mobile and edge devices requires the `gollek-ml-litert` module.

## 1. Exporting for Performance

First, convert your `NNModule` into an optimized LiteRT format:

```java
import tech.kayys.gollek.ml.export.LiteRTExporter;

Sequential model = ... // Your trained model
LiteRTExporter exporter = new LiteRTExporter();

// Quantize to INT8 for extreme efficiency
exporter.quantize(true);
exporter.save(model, "model_v1.tflite");
```

## 2. Running Inference on Mobile

Using the LiteRT runner to execute predictions on device hardware (including NPU):

```java
import tech.kayys.gollek.litert.LiteRTRunner;

LiteRTRunner runner = LiteRTRunner.load("model_v1.tflite");
runner.useNpu(true); // Enable Apple Neural Engine or Linux NPU

Tensor input = Tensor.randn(1, 224, 224, 3);
Tensor output = runner.run(input);
```

## 3. Best Practices

- **Model Pruning**: Remove redundant weights before export.
- **Selective Quantization**: Keep sensitive layers in FP16 if needed.
- **Hardware Acceleration**: Always check for NPU/GPU delegates before fallback to CPU.

## SafeTensor & GGUF

Use SafeTensor when you want fast, safe, zero-copy weight loading for model checkpoints. It is the best fit for Java-side model inspection, training artifacts, and direct tensor-backed runners.

Use GGUF when the target is a local LLM runtime optimized for quantized inference. GGUF is usually the deployment-friendly choice for llama.cpp-style serving, CPU fallback, and compact model delivery.

Fast decision rule:

- choose SafeTensor for framework-native weights, training flows, and direct tensor loading
- choose GGUF for quantized local LLM inference and llama.cpp-compatible runtimes
- keep conversion outputs separate from original checkpoints so you can rerun quantization safely

## Custom GPU Kernels

Custom kernels are the right tool when a hot tensor operation is stable, heavily repeated, and not fast enough through the default backend. Start with the built-in tensor and runner paths first, then add a kernel only after profiling shows a clear bottleneck.

Typical workflow:

1. measure the operation with the default runtime
2. isolate the smallest tensor operation that needs acceleration
3. implement the kernel behind the Gollek backend boundary
4. keep a CPU implementation as the correctness reference
5. compare output values and latency before enabling it by default

---

[Back to Tutorials Overview](../)
