---
layout: default
title: gollek-ml-transformer
parent: API REferences
nav_order: 220
---

# gollek-ml-transformer

The `gollek-ml-transformer` module provides the foundations for modern Attention-based architectures. It includes highly optimized implementations of Self-Attention, Multi-Head Attention, and full Transformer Encoder/Decoder layers.

## 🌟 Overview

Transformers have revolutionized NLP, Vision, and Multimodal AI. This module implements these patterns with a focus on performance and numerical stability, featuring support for Flash Attention and various positional encoding schemes.

## 🚀 Key Features

- **Multi-Head Attention (MHA)**: Versatile implementation supporting cross-attention, causal masking, and relative positional bias.
- **Optimized Attention Kernels**: Built-in support for **Flash Attention** to reduce memory complexity from $O(n^2)$ to $O(n)$ during inference.
- **Transformer Layers**: Complete `TransformerEncoderLayer` and `TransformerDecoderLayer` implementations with customizable normalization (Pre-norm/Post-norm).
- **Positional Encoding**: Support for Sinusoidal embeddings and Rotary Positional Embeddings (RoPE).
- **Scaling & Normalization**: Integrated with LayerNorm and advanced scaling factors for improved convergence in deep models.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-transformer</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Building a Transformer Block

```java
import tech.kayys.gollek.ml.transformer.TransformerBlock;
import tech.kayys.gollek.ml.tensor.Tensor;

// Create a 768-dim transformer block with 12 attention heads
TransformerBlock block = new TransformerBlock(768, 12)
    .dropout(0.1f)
    .ffnHiddenDim(3072);

// Forward pass for [Batch, SeqLen, Dim]
Tensor input = Tensor.randn(32, 512, 768);
Tensor output = block.forward(input);
```

### Using Multi-Head Attention Directly

```java
import tech.kayys.gollek.ml.transformer.MultiHeadAttention;

MultiHeadAttention mha = new MultiHeadAttention(512, 8); // dim, heads

// Self-attention
Tensor context = mha.forward(query, key, value, mask);
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.transformer.MultiHeadAttention`

The core attention mechanism.

| Method | Description |
|:-------|:------------|
| `forward(q, k, v, mask)` | Computes the scaled dot-product attention. |
| `useFlashAttention(bool)` | Enables/disables optimized kernel execution. |
| `setBias(bool)` | Configures whether to use learnable biases for QKV projections. |

### Layers & Components

- **`TransformerEncoder`**: A stack of N transformer encoder layers.
- **`TransformerDecoderLayer`**: Layer including self-attention and cross-attention blocks.
- **`PositionalEncoding`**: Adds sinusoidal temporal information to the input embeddings.
- **`RotaryEmbedding`**: Implementation of RoPE, commonly used in models like LLaMA and Mistral.

---

[Back to API Hub](../)
