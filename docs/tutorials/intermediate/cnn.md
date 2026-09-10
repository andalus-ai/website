---
layout: default
title: Convolutional Neural Networks (CNN)
parent: Intermediate Tutorials
grand_parent: Tutorials
nav_order: 1
---

# 🖼️ Convolutional Neural Networks (CNN)

This tutorial explores the `gollek-ml-cnn` module and how to build models for image recognition.

## 1. Core CNN Layers

Gollek provides standard layers for vision tasks:
- `Conv2d`: 2D convolution.
- `MaxPool2d`: Spatial downsampling.
- `BatchNorm2d`: Scale and shift normalization.

## 2. Building a LeNet-5 Architecture

A classic example for MNIST classification:

```java
import tech.kayys.gollek.ml.nn.layer.*;
import tech.kayys.gollek.ml.nn.layer.Sequential;

Sequential lenet = new Sequential(
    // Input: 1 x 28 x 28
    new Conv2d(1, 6, 5),    // 6 features, 5x5 kernel
    new ReLU(),
    new MaxPool2d(2, 2),    // 14 x 14
    
    new Conv2d(6, 16, 5),   // 16 features, 5x5 kernel
    new ReLU(),
    new MaxPool2d(2, 2),    // 5 x 5
    
    new Flatten(),
    new Linear(16 * 5 * 5, 120),
    new ReLU(),
    new Linear(120, 84),
    new ReLU(),
    new Linear(84, 10)      // 10 output classes
);
```

## 3. Working with Image Data

To train this model, you'll need the `gollek-ml-vision` module for preprocessing:

```java
import tech.kayys.gollek.ml.vision.transform.*;

Transform pipeline = new Compose(
    new Resize(32, 32),
    new ToTensor(),
    new Normalize(0.5f, 0.5f)
);
```

## 🎯 Next Steps

Learn how to batch and split image inputs in [Building Efficient Data Pipelines](/docs/tutorials/intermediate/data-pipelines), then handle sequential data in [LSTMs & Sequences](/docs/tutorials/intermediate/rnn).
