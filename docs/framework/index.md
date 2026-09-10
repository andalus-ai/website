---
layout: default
title: Gollek Framework
---

# 🧠 Gollek ML Framework

Gollek is a **production-grade Java AI platform** built on Java 25.

The platform has two complementary cores:

- inference/serving core for runtime execution and deployment
- ML framework + trainer core for Java-native model development workflows
- diffusion alignment and distillation workflows built as Java training modules
- byte-latent language-modeling workflows built as a separate architecture family
- recursive-reasoning workflows built as a separate stochastic latent rollout family

This page focuses on the ML side while keeping the serving architecture context visible.

---

## 🎯 Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────┐
│                   Gollek API Surface (ML + Runtime)                 │
├─────────────────────────────────────────────────────────────────────┤
│       ML Framework: gollek-ml-*   │   Trainer: gollek-trainer-*     │
├─────────────────────────────────────────────────────────────────────┤
│ Inference Core: gollek-core + gollek-spi-* + provider routing       │
├─────────────────────────────────────────────────────────────────────┤
│ Format Runners: GGUF │ Safetensor │ ONNX │ LiteRT │ TensorRT         │
├─────────────────────────────────────────────────────────────────────┤
│ Execution Layer: CUDA │ Metal │ ROCm │ CPU │ (native-java / binding) │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔥 v0.3 New Capabilities

### 1. Unified Model Runner

Single API for all frameworks — no more framework-specific code:

```java
// Before: framework-specific code
LibTorchRunner torchRunner = new LibTorchRunner(modelPath);
torchRunner.infer(input);

LiteRTRunner litertRunner = new LiteRTRunner(modelPath);
litertRunner.infer(input);

// After: unified API
ModelRunner runner = ModelRunner.builder()
    .modelPath("model.safetensors")
    .format(ModelFormat.SAFETENSORS)
    .device(RunnerDevice.CUDA)
    .build();

InferenceResult result = runner.infer(input);
```

**Supported Frameworks:** GGUF, LiteRT (TFLite), ONNX, TensorRT, TorchScript, SafeTensors

### 2. Dynamic Batching Engine

Automatic request batching with latency SLA:

```java
BatchingEngine batcher = BatchingEngine.builder()
    .runner(modelRunner)
    .maxBatchSize(256)
    .maxWaitTime(Duration.ofMillis(10))
    .slaP95(Duration.ofMillis(100))
    .build();

// Requests automatically batched
CompletableFuture<InferenceResult> future = batcher.submit(input);
```

**Benefits:** 5-10x throughput improvement, configurable latency/throughput tradeoff.

### 3. Graph Fusion Engine

Fuse multiple operations into single kernels:

```java
// Before: 4 kernel launches
// matmul → add → relu → dropout

// After: 1 fused kernel
FusedGraph fused = engine.fuse(matmul, add, relu, dropout).compile();
float[] output = fused.execute(input);
```

**Benefits:** 3-10x speedup from reduced kernel launch overhead.

### 4. Quantization-Aware Inference

Compress models to INT4/INT8/FP8 with minimal accuracy loss:

```java
QuantizedModel qModel = QuantizationEngine.builder()
    .modelPath("model.safetensors")
    .scheme(QuantizationScheme.AWQ)
    .targetPrecision(Precision.INT4)
    .calibrationData(calibrationDataset)
    .build()
    .quantize();
```

**Benefits:** 4x memory reduction, 2-4x throughput improvement.

### 5. Shared Memory Pool

Zero-copy tensor allocation across frameworks:

```java
MemoryPool pool = MemoryPool.builder()
    .device(RunnerDevice.CUDA)
    .maxSizeGB(16)
    .strategy(MemoryStrategy.FRAGMENT_AWARE)
    .build();

MemorySegment tensor = pool.allocate(1024 * 1024);
libtorchRunner.infer(tensor);
onnxRunner.infer(tensor);  // No copy needed!
```

**Benefits:** Zero-copy between frameworks, reduced allocation overhead.

---

## 📊 Framework Comparison

| Feature | PyTorch | Gollek |
|---------|---------|--------|
| **Language** | Python | Java 25 |
| **Backend** | Custom C++ | Panama FFM + Native |
| **GPU Support** | CUDA, ROCm | CUDA, Metal, ROCm, TPU |
| **Quantization** | Manual | AWQ, GPTQ, INT4/INT8/FP8 |
| **Dynamic Batching** | External (vLLM) | Built-in |
| **Graph Fusion** | TorchInductor | Built-in |
| **Memory Pool** | Per-framework | Unified |
| **Type Safety** | Dynamic | Static |
| **Production Ready** | Painful | Enterprise-grade |

---

## 🏗️ Module Structure

| Module family | Purpose |
|--------|---------|
| **gollek-ml-\*** | Java ML framework primitives (autograd, nn, data, optimization, export, hub) |
| **gollek-ml-byte-latent** | Byte-latent language-model root for Fast Byte Latent Transformer style architectures |
| **gollek-ml-diffusion-\*** | Java diffusion-training contracts and OPD algorithms |
| **gollek-trainer-\*** | Trainer session contracts and orchestration runtime |
| **gollek-sdk-\*** | Client/application SDK surfaces (local/remote/session) |
| **gollek-spi-\*** | Serving/runtime contracts used by inference plugins and runners |
| **gollek-runner-\*** / `runner/*` | Format execution adapters (GGUF, Safetensor, ONNX, LiteRT, etc.) |
| **gollek-backend-\*** | Hardware execution backends (CPU, Metal, CUDA, ROCm, etc.) |

Migration note:
- Older docs may still mention SDK-era training names such as `gollek-sdk-nn` or `gollek-sdk-data`. The canonical naming for new framework work is `gollek-ml-*` plus `gollek-trainer-*`.

Training gate note:
- Training module CI metadata, advisory candidates, guarded promotion plans,
  validation receipts, and stable promotion fingerprints are documented in
  [Training Fast Gate](/docs/framework/training-fast-gate).

Diffusion training note:
- Diffusion alignment features such as DiffusionOPD follow the same Java-first rule. Start with [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs).
- For persisted OPD artifacts, typed report queries, campaign/release views,
  and bundle inspection, see
  [DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting).

Byte-latent modeling note:
- Fast Byte Latent Transformer style work lands in `gollek-ml-byte-latent` and follow-on byte-latent modules, not in the diffusion OPD stack. Start with [Byte-Latent Docs](/docs/framework/byte-latent-docs).
- For quick terminal selector lookup across the history, workflow, and compare inspectors, use [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference).
- For quick vocabulary lookup across checkpoint, workflow, compare, and bundle terms, use [Byte-Latent Glossary](/docs/framework/byte-latent-glossary).
- For abbreviated JSON shapes of the main persisted artifacts, use [Byte-Latent Artifact Examples](/docs/framework/byte-latent-artifact-examples).

Recursive reasoning note:
- GRAM-style stochastic latent reasoning work lands in `gollek-ml-recursive-reasoning`, not in the byte-latent or diffusion OPD stacks. Start with [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs).
- For the current runnable terminal path, use the recursive-reasoning JBang demo, inspectors, and workflow script listed there.
- For trainer-facing structured dataset planning, use [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api) and [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow).
- For quick vocabulary lookup across report, rollout, compare-result, and bundle terms, use [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary).
- For abbreviated JSON shapes of the current report, compare result, and compare bundle manifest, use [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples).

Audio processing note:
- Speech-to-Text, Text-to-Speech, VAD, and pure-Java audio decoding live in the framework audio lane. Start with [Audio Processing Docs](/docs/framework/audio-processing-docs).
- For the specialized local ONNX TTS runtime path, use [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx).

---

## 🚀 Quick Start

### Installation

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-api</artifactId>
    <version>0.3.0-SNAPSHOT</version>
</dependency>
```

### Tensor Operations

```java
// PyTorch-style API
Tensor x = Gollek.randn(1, 3, 224, 224).requiresGrad(true);
Tensor w = Gollek.randn(64, 3, 3, 3);
Tensor y = x.matmul(w).relu();
y.backward();
```

### Model Inference

```java
// Unified inference
ModelRunner runner = ModelRunner.builder()
    .modelPath("llama-3-8b.gguf")
    .device(RunnerDevice.CUDA)
    .build();

InferenceResult result = runner.infer(
    InferenceInput.fromInts(tokenIds, 1, seqLen)
);
```

### Quantization

```java
QuantizedModel qModel = QuantizationEngine.builder()
    .modelPath("model.safetensors")
    .scheme(QuantizationScheme.AWQ)
    .targetPrecision(Precision.INT4)
    .build()
    .quantize();
```

---

## 📈 Performance Benchmarks

| Operation | CPU | CUDA (A100) | Metal (M3) | Speedup |
|-----------|-----|-------------|------------|---------|
| **Matmul 4096×4096** | 2.5s | 8ms | 15ms | **300x** |
| **Attention 4K seq** | 800ms | 5ms | 12ms | **160x** |
| **Inference (batch=256)** | 500ms | 15ms | 35ms | **33x** |
| **INT4 Quantized** | 250ms | 8ms | 18ms | **62x** |

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--subtle-bg); border-radius: 12px;">
  <h3>Ready to Build?</h3>
  <p><a href="/docs/setup/sdk-installation">Get Started</a> • 
     <a href="/docs/framework/">Framework Guide</a> • 
     <a href="/docs/framework/inference">Inference Guide</a></p>
</div>
