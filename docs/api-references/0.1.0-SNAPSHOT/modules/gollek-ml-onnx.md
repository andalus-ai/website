---
layout: default
title: gollek-ml-onnx
parent: API REferences
nav_order: 250
---

# gollek-ml-onnx

The `gollek-ml-onnx` module provides high-performance integration with the ONNX Runtime. It allows Gollek users to execute models trained in other frameworks (like PyTorch or TensorFlow) directly within the Gollek ecosystem.

## 🌟 Overview

ONNX (Open Neural Network Exchange) is the industry standard for model interoperability. This module wraps the ONNX Runtime Java API, providing a seamless bridge between Gollek's `Tensor` API and the ONNX execution engine.

## 🚀 Key Features

- **Standardized Inference**: Run any ONNX model (v1.0+) with minimal configuration.
- **Hardware Acceleration**: Automatic utilization of available Execution Providers (CUDA, TensorRT, DirectML, CoreML).
- **Tensor Integration**: Automatic conversion between Gollek `Tensor` objects and ONNX `OnnxTensor` instances.
- **Session Management**: Efficient handling of underlying ONNX sessions with built-in resource cleanup.
- **Metadata Inspection**: High-level API for inspecting model inputs, outputs, and internal metadata.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-onnx</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Running Inference with an ONNX Model

```java
import tech.kayys.gollek.ml.onnx.OnnxInferenceEngine;
import tech.kayys.gollek.ml.tensor.Tensor;

// Initialize engine with a model file
OnnxInferenceEngine engine = new OnnxInferenceEngine("models/resnet50.onnx");

// Prepare input tensor
Tensor input = Tensor.randn(1, 3, 224, 224);

// Run inference
Tensor output = engine.forward(input);

System.out.println("Output shape: " + output.shape());
```

### Inspecting Model Metadata

```java
var info = engine.getModelInfo();
info.getInputs().forEach(input -> {
    System.out.println("Input Name: " + input.getName());
    System.out.println("Input Shape: " + Arrays.toString(input.getShape()));
});
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.onnx.OnnxInferenceEngine`

The primary class for running ONNX models.

| Method | Description |
|:-------|:------------|
| `forward(Tensor input)` | Executes the model with a single input. |
| `forward(Map<String, Tensor> inputs)` | Executes the model with multiple named inputs. |
| `getDevice()` | Returns the device being used by the ONNX Runtime (e.g., CUDA). |
| `close()` | Releases the underlying ONNX Runtime session and environment. |

### Utilities

- **`OnnxUtils`**: Helper methods for mapping Gollek primitive types to ONNX internal types.
- **`OnnxModelInfo`**: Metadata container providing details about input/output tensors and model version.

---

[Back to API Hub](../)
