---
layout: default
title: gollek-ml-cnn
parent: API REferences
nav_order: 200
---

# gollek-ml-cnn

The `gollek-ml-cnn` module provides a comprehensive suite of layers for building Convolutional Neural Networks. It supports 1D, 2D, and 3D convolutions, along with various pooling and normalization techniques optimized for spatial and temporal data.

## 🌟 Overview

Convolutional layers are the core of modern computer vision and signal processing models. This module provides highly optimized implementations of these layers, with support for various padding strategies, dilated convolutions, and depthwise separable convolutions.

## 🚀 Key Features

- **Multi-dimensional Convolutions**: Full support for `Conv1d`, `Conv2d`, and `Conv3d`.
- **Normalization Layers**: Includes `BatchNorm2d` and `BatchNorm1d` for improving training stability and speed.
- **Pooling Operations**: Support for `MaxPool2d`, `AvgPool2d`, and `AdaptiveAvgPool2d` (fixed-size output regardless of input dimensions).
- **Upsampling**: `Upsample2d` and `ConvTranspose2d` for generative models and segmentation.
- **Advanced Convolutions**: Support for Graph Convolutional Networks through the `GCNConv` layer.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-cnn</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Building a Simple CNN

```java
import tech.kayys.gollek.ml.cnn.*;
import tech.kayys.gollek.ml.nn.layer.Sequential;
import tech.kayys.gollek.ml.nn.layer.ReLU;
import tech.kayys.gollek.ml.nn.layer.Flatten;
import tech.kayys.gollek.ml.nn.layer.Linear;

Sequential cnn = new Sequential(
    // 3 input channels, 32 output channels, 3x3 kernel
    new Conv2d(3, 32, 3).padding(1), 
    new BatchNorm2d(32),
    new ReLU(),
    new MaxPool2d(2), // 2x2 pooling
    
    new Conv2d(32, 64, 3),
    new ReLU(),
    new AdaptiveAvgPool2d(7, 7), // Output always [64, 7, 7]
    
    new Flatten(),
    new Linear(64 * 7 * 7, 10)
);
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.cnn.Conv2d`

Standard 2D convolution layer.

| Method | Description |
|:-------|:------------|
| `stride(int s)` | Sets the convolution stride. |
| `padding(int p)` | Sets the zero-padding. |
| `dilation(int d)` | Sets the spacing between kernel elements (atrous convolution). |
| `groups(int g)` | Controls the connections between inputs and outputs (e.g., depthwise). |

### Pooling & Normalization

- **`AdaptiveAvgPool2d(h, w)`**: Automatically calculates stride and kernel size to produce a fixed output size.
- **`BatchNorm2d(features)`**: Normalizes the input over the batch and spatial dimensions.
- **`ConvTranspose2d`**: Also known as Deconvolution, used for increasing spatial resolution.

---

[Back to API Hub](../)
