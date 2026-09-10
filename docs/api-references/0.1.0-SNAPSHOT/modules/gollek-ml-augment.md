---
layout: default
title: gollek-ml-augment
parent: API REferences
nav_order: 150
---

# gollek-ml-augment

The `gollek-ml-augment` module provides a library of data augmentation transforms designed to improve model robustness and generalization. It is specifically optimized for vision-based tensors.

## 🌟 Overview

Data augmentation is a critical technique in deep learning to artificially expand the training dataset by applying random transformations. This module provides a set of efficient, randomized transforms that can be easily integrated into training pipelines.

## 🚀 Key Features

- **Standard Vision Augmentations**: Includes flips, crops, and color jittering.
- **Advanced Regularization**: Built-in support for `RandomErasing` (Cutout/Random Erasing) to prevent overfitting.
- **Efficient Processing**: All transforms operate directly on `GradTensor` objects, ensuring compatibility with the Autograd engine and hardware backends.
- **Reproducible Pipelines**: Uses a thread-safe `Random` source for consistent augmentation across epochs when a seed is provided.
- **Pipeline Abstraction**: The `AugmentationPipeline` class allows for easy definition of complex augmentation strategies.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-augment</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Creating an Augmentation Pipeline

```java
import tech.kayys.gollek.ml.augment.Augmentation;
import tech.kayys.gollek.ml.augment.AugmentationPipeline;

// Define a robust augmentation strategy
AugmentationPipeline pipeline = AugmentationPipeline.builder()
    .add(Augmentation.RandomHorizontalFlip.of(0.5))
    .add(Augmentation.RandomCrop.of(224, 4)) // size 224 with 4px padding
    .add(Augmentation.ColorJitter.of(0.2, 0.2, 0.2))
    .add(Augmentation.RandomErasing.of(0.25))
    .build();

// Apply to input batch during training
GradTensor augmented = pipeline.apply(inputBatch);
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.augment.Augmentation`

The base interface for all augmentation transforms.

| Inner Class | Description |
|:-------|:------------|
| `RandomHorizontalFlip` | Randomly flips the image horizontally. |
| `RandomVerticalFlip` | Randomly flips the image vertically. |
| `RandomCrop` | Pads the image and then extracts a random crop. |
| `ColorJitter` | Randomly adjusts brightness, contrast, and saturation. |
| `RandomErasing` | Randomly masks a rectangular region with zero-values. |
| `RandomGrayscale` | Randomly converts RGB images to grayscale. |

### `tech.kayys.gollek.ml.augment.AugmentationPipeline`

A container for multiple augmentations.

- `builder()`: Returns a builder for configuring the pipeline.
- `apply(GradTensor tensor)`: Iteratively applies all registered augmentations to the input.

---

[Back to API Hub](../)
