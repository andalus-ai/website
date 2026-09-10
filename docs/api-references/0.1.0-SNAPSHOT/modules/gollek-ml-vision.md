---
layout: default
title: gollek-ml-vision
parent: API REferences
nav_order: 100
---

# gollek-ml-vision

The `gollek-ml-vision` module provides specialized layers, transforms, and pre-trained architectures for Computer Vision tasks. It is designed to handle common vision workflows like image classification, object detection, and segmentation.

## 🌟 Overview

Working with image data requires specific operations like convolutions, pooling, and specialized data augmentation. This module implements these foundations, along with high-performance vision transforms similar to PyTorch's `torchvision`.

## 🚀 Key Features

- **Pre-trained Architectures**: Includes industry-standard models like ResNet (18, 34, 50).
- **Comprehensive Transforms**: Complete preprocessing pipeline including Resize, CenterCrop, RandomCrop, and Normalize.
- **Vision-specific Augmentation**: Support for RandomHorizontalFlip, RandomVerticalFlip, and ColorJitter.
- **Composable Pipelines**: The `Compose` class allows stacking multiple transforms into a single reusable pipeline.
- **Optimized Vision Ops**: Hardware-accelerated element-wise operations and kernels optimized for 4D image tensors (NCHW).

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-vision</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Creating a Preprocessing Pipeline

```java
import tech.kayys.gollek.ml.vision.transforms.VisionTransforms;
import tech.kayys.gollek.ml.tensor.Tensor;

// Define preprocessing pipeline
VisionTransforms.Compose pipeline = new VisionTransforms.Compose(
    new VisionTransforms.Resize(256, 256),
    new VisionTransforms.CenterCrop(224, 224),
    new VisionTransforms.ToTensor(),
    new VisionTransforms.Normalize(
        new float[] { 0.485f, 0.456f, 0.406f }, // ImageNet mean
        new float[] { 0.229f, 0.224f, 0.225f } // ImageNet std
    )
);

// Apply to image tensor
Tensor rawImage = Tensor.randn(3, 300, 300);
Tensor processed = pipeline.apply(rawImage);
```

### Loading a ResNet Model

```java
import tech.kayys.gollek.ml.vision.models.ResNet;

// Create a ResNet-18 model for 1000-class classification
ResNet model = ResNet.resnet18(1000);

// Run inference
Tensor output = model.forward(processed);
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.vision.transforms.VisionTransforms`

The primary container for image processing operations.

| Class | Description |
|:-------|:------------|
| `Resize(h, w)` | Resizes image using bilinear interpolation. |
| `CenterCrop(h, w)` | Crops the center of the image. |
| `RandomCrop(h, w)` | Randomly crops a region from the image. |
| `Normalize(mean, std)` | Normalizes pixel values using channel-wise mean and std. |
| `Compose(transforms...)` | Chinas multiple transforms into a pipeline. |

### `tech.kayys.gollek.ml.vision.models.ResNet`

Implementation of the Residual Network architecture.

- `resnet18(numClasses)`
- `resnet34(numClasses)`
- `resnet50(numClasses)`

---

[Back to API Hub](../)
