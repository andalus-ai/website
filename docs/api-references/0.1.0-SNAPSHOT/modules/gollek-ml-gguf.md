---
layout: default
title: gollek-ml-gguf
parent: API REferences
nav_order: 320
---

# gollek-ml-gguf

The `gollek-ml-gguf` module provides full support for the GGUF (GPT-Generated Unified Format) binary container. It enables interoperability with models optimized for `llama.cpp` and other high-performance inference engines.

## 🌟 Overview

GGUF is a modern binary format designed for high-performance inference, particularly on edge devices and CPUs. It replaces the legacy GGML format with better support for metadata, multi-modal components, and various quantization schemes (Q4, Q5, Q8, etc.). This module provides a native Java implementation for reading and writing GGUF files.

## 🚀 Key Features

- **Standard Implementation**: Full compatibility with the GGUF v2 and v3 specifications.
- **Quantization Support**: Support for reading models with complex bit-depths (e.g., Q4_K_M, IQ4_XS).
- **Rich Metadata Handling**: High-level API for querying model hyper-parameters, tokenizer settings, and architecture versioning stored in the GGUF header.
- **Unified Tensor Access**: Seamless mapping of GGUF tensors to Gollek's internal `Tensor` API.
- **Fast I/O**: Optimized for large files with block-based reading and memory mapping support.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-gguf</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Reading a GGUF Model

```java
import tech.kayys.gollek.ml.gguf.GgufReader;
import tech.kayys.gollek.ml.tensor.Tensor;

try (GgufReader reader = new GgufReader(Path.of("llama-7b.Q4_K_M.gguf"))) {
    // Access metadata
    String architecture = reader.getMetadata("general.architecture");
    int contextLength = reader.getMetadataInt("llama.context_length");
    
    // Load specific tensor
    Tensor weight = reader.loadTensor("blk.0.attn_q.weight");
    System.out.println("Loaded " + architecture + " weight with shape: " + weight.shape());
}
```

### Inspecting All Tensors in a File

```java
reader.getTensorInfos().forEach(info -> {
    System.out.printf("Name: %s, Shape: %s, Type: %s%n", 
        info.getName(), 
        Arrays.toString(info.getShape()), 
        info.getType());
});
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.gguf.GgufReader`

The main entry point for loading GGUF model assets.

| Method | Description |
|:-------|:------------|
| `getMetadata(key)` | Returns the string value for a metadata key. |
| `loadTensor(name)` | Dequantizes (if necessary) and loads a tensor. |
| `getTensorInfos()` | Returns a list of all tensor descriptions in the file. |

### Data Types & Metadata

- **`GgmlType`**: Enum representing the internal GGUF quantization types (F32, F16, Q4_0, etc.).
- **`GgufMetaValue`**: Wrapper for different metadata types (String, Int, Float, Array).
- **`GgufWriter`**: Utility for programmatically creating GGUF files from raw tensors and metadata.

---

[Back to API Hub](../)
