---
layout: default
title: Tensors for Beginners
parent: Basic Tutorials
grand_parent: Tutorials
nav_order: 2
---

# 📊 Tensors for Beginners

Tensors are the fundamental data structure used in the Gollek ML framework. This tutorial covers how to create, manipulate, and synchronize tensors across hardware devices.

## 1. What is a Tensor?

A tensor is a multi-dimensional array of numerical data. In Gollek, tensors are optimized for hardware acceleration (CPU/GPU) and support automatic differentiation.

## 2. Creating Tensors

There are multiple ways to initialize a tensor:

```java
import tech.kayys.gollek.ml.tensor.Tensor;

// Create from an array
Tensor a = Tensor.of(new float[]{1, 2, 3, 4}, 2, 2);

// Standard initializers
Tensor zeros = Tensor.zeros(3, 3);
Tensor ones = Tensor.ones(10);
Tensor random = Tensor.randn(1, 3, 224, 224); // Random normal distribution
```

## 3. Basic Operations

Gollek supports element-wise and matrix operations:

```java
Tensor b = a.add(2.0f);   // Element-wise addition
Tensor c = a.mul(b);      // Element-wise multiplication
Tensor d = a.matmul(b);   // Matrix multiplication (@)
```

## 4. Hardware Management

By default, tensors are created on the **CPU**. To move them to an accelerator (like Metal on macOS):

```java
if (Tensor.isMetalAvailable()) {
    Tensor gpuTensor = a.to("metal");
}
```

## 🎯 Next Steps

Now that you understand data, learn how to build models in [My First Neural Network](/docs/tutorials/basic/first-nn).
