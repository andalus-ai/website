---
layout: default
title: "Gollek ML SDK: Bringing PyTorch-like DX to the Java Ecosystem"
date: 2026-03-31
categories: release
tags: ml-sdk, autograd, nn, pytorch, java
---

# Gollek ML SDK: Bringing PyTorch-like DX to the Java Ecosystem

**Published**: March 31, 2026  
**Categories**: Release, ML SDK  
**Tags**: ml-sdk, autograd, nn, pytorch, java

---

## Overview

Today we are thrilled to announce the alpha release of the **Gollek ML SDK**—a native, embeddable deep learning framework for Java developers. 

For too long, Java developers have had to jump through hoops or bridge into Python to build and train custom neural networks. With the Gollek ML SDK, we are bringing a first-class, "define-by-run" experience directly to the JVM, powered by the same high-performance runtime that drives our universal inference engine.

## Why a New ML SDK for Java?

While Java is a powerhouse for enterprise backend systems, the AI/ML landscape has been dominated by Python's dynamic frameworks like PyTorch. Existing Java ML libraries often feel overly verbose or rely on rigid, pre-defined computation graphs.

The Gollek ML SDK changes that by providing:
1.  **Dynamic Computation Graphs**: Build your model logic using standard Java flow control.
2.  **Native Performance**: Tensors are backed by native memory and accelerated by CUDA, Metal, and ROCm.
3.  **PyTorch-like DX**: If you know PyTorch, you already know Gollek ML.

## Key Features

### Autograd Engine
Our autograd system tracks operations on `GradTensor` objects automatically. Just call `.backward()` on your loss tensor, and Gollek computes the gradients for every parameter in your network.

```java
GradTensor x = GradTensor.scalar(2.0f).requiresGrad(true);
GradTensor w = GradTensor.scalar(3.0f).requiresGrad(true);
GradTensor y = w.mul(x);

y.backward(); // dy/dw = 2.0, dy/dx = 3.0
```

### Modular Neural Networks
The `nn` module provides all the standard building blocks: `Linear`, `MultiHeadAttention`, `LayerNorm`, and full `Transformer` blocks. These are all pure Java implementations that run on our native runtime.

```java
public class MyModel extends Module {
    private final Linear fc = register(new Linear(512, 10));
    
    @Override
    public GradTensor forward(GradTensor input) {
        return fc.forward(input).relu();
    }
}
```

### NLP Pipelines
We've also included high-level pipelines for common tasks, making it easy to integrate state-of-the-art models into your apps with just a few lines of code.

## Getting Started

The ML SDK is available as a set of Maven modules. You can start building today by adding the following to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-sdk-ml</artifactId>
    <version>0.1.0</version>
</dependency>
```

Check out our new [Getting Started Guide](/docs/ml-sdk) for a full tutorial on building and training your first model.

## What's Next?

This is just the beginning. In the coming months, we'll be adding:
- **Distributed Training Support**: Train models across clusters using our Distributed Fabric.
- **Enhanced Model Import**: Direct support for importing weights from ONNX and SafeTensors.
- **More Layers & Optimizers**: Expanding the `nn` and `optim` libraries based on community feedback.

We can't wait to see what you build with Gollek ML!

---

**Ready to build?** [Get Started Now](/docs/ml-sdk)
