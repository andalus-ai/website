---
layout: default
title: gollek-ml-autograd
parent: API REferences
nav_order: 30
---

# gollek-ml-autograd

The `gollek-ml-autograd` module implements the engine for automatic differentiation. It provides the `GradTensor` abstraction which tracks operations to build a dynamic computation graph for backpropagation.

## 🌟 Overview

Autograd is the heart of training neural networks. In Gollek, it works via a "define-by-run" approach (like PyTorch), where the computation graph is built on-the-fly as operations are performed.

## 🚀 Key Features

- **Dynamic Computation Graph**: Builds the graph during the forward pass.
- **Efficient Backpropagation**: Implements reverse-mode automatic differentiation.
- **Gradient Tracking**: Selective tracking of gradients for specific tensors.
- **Operator Integration**: Seamlessly handles operations like matmul, convolution, and activation functions in the graph.
- **NoGrad Support**: Built-in mechanism to disable tracking for inference, saving memory and compute.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-autograd</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Basic Autograd Workflow

```java
import tech.kayys.gollek.ml.autograd.GradTensor;

// Create tensors that require gradients
GradTensor x = GradTensor.randn(2, 2).requiresGrad(true);
GradTensor w = GradTensor.randn(2, 2).requiresGrad(true);

// Forward pass
GradTensor y = x.matmul(w).sum();

// Backward pass (compute gradients)
y.backward();

// Access gradients
GradTensor w_grad = w.grad();
System.out.println(w_grad);
```

### Inference with NoGrad

```java
import tech.kayys.gollek.ml.autograd.NoGrad;

try (NoGrad context = new NoGrad()) {
    // Operations inside this block don't track gradients
    GradTensor output = model.forward(input);
    // ... use output
}
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.autograd.GradTensor`

The primary abstraction for tensors with autograd capabilities.

| Method | Description |
|:-------|:------------|
| `requiresGrad(boolean)` | Sets whether to track gradients for this tensor. |
| `backward()` | Triggers backpropagation from this tensor. |
| `grad()` | Returns the accumulated gradient for this tensor. |
| `zeroGrad()` | Resets the gradient to zero. |
| `detach()` | Returns a new tensor that shares storage but is omitted from the graph. |

### `tech.kayys.gollek.ml.autograd.Function`

The base class for all operations tracked by the autograd engine. Each `Function` implements forward and backward logic for a specific operation.

---

[Back to API Hub](../)
