---
layout: default
title: gollek-ml-safetensor
parent: API REferences
nav_order: 310
---

# gollek-ml-safetensor

The `gollek-ml-safetensor` module provides high-performance, native support for the SafeTensors format. It enables efficient loading and saving of model weights with zero-copy capabilities where possible.

## 🌟 Overview

SafeTensors is a modern format for storing tensors that is secure (no arbitrary code execution), fast (zero-copy), and supports lazy loading. This module implements the full SafeTensors specification, making it the preferred way to handle weights in the Gollek ecosystem.

## 🚀 Key Features

- **Security First**: Unlike Pickle-based formats, SafeTensors strictly contains only tensor data and JSON metadata.
- **Zero-Copy Loading**: Tensors can be mapped directly from disk into memory without additional allocations.
- **Lazy Loading**: Individual tensors can be read from large files without parsing the entire file.
- **Support for All DTypes**: Full support for FP32, FP16, BF16, and various integer types.
- **Metadata Inspection**: Easy access to the JSON header containing model dimensions and data types.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-safetensor</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Reading Weights from a Safetensors File

```java
import tech.kayys.gollek.ml.safetensors.SafetensorReader;
import tech.kayys.gollek.ml.tensor.Tensor;
import java.util.Map;

// Read all tensors from file
Map<String, Tensor> weights = SafetensorReader.read(Path.of("model.safetensors"));

Tensor embeddingWeight = weights.get("model.embed_tokens.weight");
System.out.println("Loaded weight shape: " + embeddingWeight.shape());
```

### Saving a Model's State

```java
import tech.kayys.gollek.ml.safetensors.SafetensorWriter;

// Map of tensor names to their values
Map<String, Tensor> stateDict = model.stateDict();

SafetensorWriter.write(Path.of("model.safetensors"), stateDict);
```

### Inspecting Metadata

```java
try (SafetensorReader reader = new SafetensorReader(path)) {
    String jsonHeader = reader.getHeader();
    System.out.println("Model Metadata: " + jsonHeader);
}
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.safetensors.SafetensorReader`

The primary class for loading tensors.

| Method | Description |
|:-------|:------------|
| `read(path)` | Static method for bulk reading all tensors in a file. |
| `readTensor(name)` | Reads a specific tensor lazily from the underlying file. |
| `metadata()` | Returns the parsed JSON metadata from the file header. |

### `tech.kayys.gollek.ml.safetensors.SafetensorWriter`

The primary class for serializing tensors.

- `write(path, tensors)`: Serializes a map of named tensors into the SafeTensors format.
- Supports adding custom string-based metadata to the file header.

---

[Back to API Hub](../)
