---
layout: default
title: gollek-ml-export
parent: API REferences
nav_order: 240
---

# gollek-ml-export

The `gollek-ml-export` module provides the canonical Gradle-managed export and benchmarking surface for Gollek models. It covers ONNX, GGUF, and LiteRT targets and keeps the public export API stable while the older training/runtime packages are being migrated.

## 🌟 Overview

Model portability is key for diverse deployment targets. The `ModelExporter` suite allows you to serialize both architecture and weights into formats optimized for high-performance inference, edge devices, or cross-language integration.

## 🚀 Key Features

- **Multi-format support**: ONNX, GGUF, LiteRT
- **Unified builder API**: one `ModelExporter` builder for all target formats
- **Quantization options**: `NONE`, `FP16`, `INT8`, `INT4`, `NF4`
- **Benchmark helper**: lightweight runtime benchmarking for exported models and source modules
- **Canonical umbrella access**: available directly from `Gollek.Export`

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-export</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Exporting a Model

```java
import tech.kayys.gollek.ml.export.ModelExporter;

ModelExporter exporter = ModelExporter.builder()
    .model(myResnetModel)
    .inputShape(1, 3, 224, 224)
    .build();

exporter.toONNX("resnet50.onnx");
```

### Exporting to GGUF

```java
exporter.toGGUF("llama-3-8b.gguf", ModelExporter.Quantization.INT4);
```

### Exporting to LiteRT

```java
exporter.toLiteRT("mobilenet_v2.tflite");
```

### Benchmarking

```java
import tech.kayys.gollek.ml.export.Benchmark;

Benchmark benchmark = new Benchmark(myResnetModel);
Benchmark.BenchmarkResult result = benchmark.run(new long[]{1, 3, 224, 224}, 100, 10);
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.export.ModelExporter`

The main service for model serialization.

| Method | Description |
|:-------|:------------|
| `builder()` | Creates a builder for export configuration. |
| `toONNX(path)` | Exports the configured model to ONNX. |
| `toGGUF(path, quantization)` | Exports the configured model to GGUF. |
| `toLiteRT(path)` | Exports the configured model to LiteRT. |
| `estimateSize()` | Returns a simple source-model size estimate. |

### Supporting Types

- **`Benchmark`**: lightweight benchmarking helper for forward-pass timing
- **`ModelExporter.Quantization`**: export-time quantization mode
- **`Gollek.Export`**: umbrella entrypoint from `gollek-ml-api`

---

[Back to API Hub](../)
