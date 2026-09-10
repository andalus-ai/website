---
layout: default
title: gollek-ml-multimodal
parent: API REferences
nav_order: 130
---

# gollek-ml-multimodal

The `gollek-ml-multimodal` module provides architectures and orchestration logic for models that process multiple types of data simultaneously (e.g., Vision + Text, Audio + Video).

## 🌟 Overview

Multi-modal AI is the frontier of modern deep learning. This module provides specialized building blocks like **Cross-Attention** and **Modality Fusion** layers, along with a fluent builder API for constructing multi-modal input sequences.

## 🚀 Key Features

- **Modality Fusion Layers**: Dedicated modules for combining embeddings from different encoders (Early Fusion, Late Fusion, Mid-level Fusion).
- **Cross-Attention Mechanisms**: Implementation of multi-head cross-attention for relating information across modalities (e.g., grounding text in image regions).
- **Consolidated Builder API**: The `MultimodalBuilder` allows easily attaching images, audio clips, and text prompts into a single model request.
- **Support for Specialized Modalities**: Dedicated builders for `Vision`, `Video`, and `Audio` modal parts.
- **Unified Result Handling**: `MultimodalResult` encapsulates disparate outputs into a queryable structure.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-multimodal</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Building a Multimodal Request

```java
import tech.kayys.gollek.ml.multimodal.MultimodalBuilder;
import tech.kayys.gollek.ml.multimodal.VisionBuilder;

// Create a request with an image and a text question
var result = MultimodalBuilder.create()
    .part(VisionBuilder.fromFile("kitchen.jpg"))
    .part("What items are on the table?")
    .buildAndExecute(multimodalModel);

System.out.println("AI Response: " + result.getTextResponse());
```

### Implementing Cross-Attention

```java
import tech.kayys.gollek.ml.multimodal.CrossAttention;

// Create cross-attention layer to relate 512-dim visual features 
// with 768-dim text embeddings
CrossAttention attention = new CrossAttention(512, 768, 8); // dimensionQuery, dimensionKey, heads

GradTensor crossOutput = attention.forward(visualInput, textInput);
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.multimodal.MultimodalBuilder`

The primary utility for assembling inputs for multimodal models.

| Method | Description |
|:-------|:------------|
| `create()` | Returns a new multimodal builder. |
| `part(ContentPart p)` | Attaches a modality part (Image, Audio, etc.). |
| `part(String text)` | Convenience method for attaching a text part. |
| `execute(Model m)` | Sends the assembled input to the model for inference. |

### Fusion & Attention Components

- **`ModalityFusion`**: Abstract base for different fusion strategies.
- **`CrossAttention`**: Standard multi-head cross-attention block.
- **`ContentPart`**: Wrapper for different data types (TextPart, VisualPart, AudioPart).

---

[Back to API Hub](../)
