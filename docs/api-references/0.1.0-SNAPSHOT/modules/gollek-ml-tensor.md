---
layout: default
title: gollek-ml-tensor
parent: API REferences
nav_order: 20
---

# gollek-ml-tensor

The `gollek-ml-tensor` module is the high-performance foundation of the Gollek ML framework. It provides the core `Tensor` abstraction and the low-level operators required for multi-dimensional array manipulation with hardware acceleration.

## 🌟 Overview

Tensors are the fundamental data structures used in deep learning. This module provides a Python-like API (similar to NumPy or PyTorch) for Java, with automatic memory management and native performance.

## 🚀 Key Features

- **Multi-dimensional Arrays**: Support for tensors of any rank (scalars to N-D).
- **Native Acceleration**: Leverages CPU SIMD (AVX/NEON), NVIDIA CUDA, and Apple Metal.
- **Operator Overloading**: Intuitive mathematical operations via method chaining.
- **NoGrad Context**: Efficient inference-only mode that skips tracking for performance.
- **Memory Management**: Sophisticated tracking to prevent native memory leaks.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-tensor</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Creating Tensors

```java
import tech.kayys.gollek.ml.tensor.Tensor;

// Create from array
Tensor a = Tensor.of(new float[]{1, 2, 3, 4}, 2, 2);

// Fill with zeros or ones
Tensor b = Tensor.zeros(2, 2);
Tensor c = Tensor.ones(2, 2);

// Random initialization
Tensor d = Tensor.randn(3, 224, 224);
```

### Basic Operations

```java
Tensor x = Tensor.randn(10, 10);
Tensor y = Tensor.randn(10, 10);

// Matrix multiplication
Tensor result = x.matmul(y);

// Element-wise operations
Tensor sum = x.add(y);
Tensor relu = x.relu();
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.tensor.Tensor`

The core data structure.

| Method | Description |
|:-------|:------------|
| `of(float[] data, int... shape)` | Creates a tensor from raw data and shape. |
| `randn(int... shape)` | Creates a tensor with values drawn from a normal distribution. |
| `to(Device device)` | Moves the tensor to the specified hardware device. |
| `reshape(int... newShape)` | Returns a view of the tensor with a different shape. |
| `data()` | Returns the raw float array (may trigger host sync). |

### `tech.kayys.gollek.ml.tensor.Device`

Represents a hardware backend.

| Constant | Description |
|:-------|:------------|
| `CPU` | Standard host processing. |
| `CUDA` | NVIDIA GPU acceleration. |
| `METAL` | Apple Silicon GPU acceleration. |

---

[Back to API Hub](../)
