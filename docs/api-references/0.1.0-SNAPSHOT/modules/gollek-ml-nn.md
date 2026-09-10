---
layout: default
title: gollek-ml-nn
parent: API REferences
nav_order: 40
---

# gollek-ml-nn

The `gollek-ml-nn` module provides an object-oriented API for building neural networks. It is inspired by PyTorch's `nn` package and built on top of the `gollek-ml-autograd` engine.

## 🌟 Overview

Neural networks in Gollek are built using the `Module` (or `NNModule`) abstraction. Modules can contain other modules, allowing for deep, hierarchical architectures. This module includes dozens of predefined layers and loss functions used in modern deep learning.

## 🚀 Key Features

- **Module Base Class**: Hierarchical organization of network parameters.
- **Rich Layer Collection**: Includes Linear, Convolutional (via vision module), Recurrent (via rnn module), and specialized layers like `RotaryEmbedding`.
- **Comprehensive Loss Functions**: 15+ built-in loss functions including CrossEntropy, MSE, FocalLoss, and TripletLoss.
- **Sequential Container**: Easy stacking of layers for simple feed-forward architectures.
- **Backend Registry**: Support for pluggable execution backends (CPU, Native, etc.).

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-nn</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Defining a Custom Model

```java
import tech.kayys.gollek.ml.nn.NNModule;
import tech.kayys.gollek.ml.nn.layer.*;
import tech.kayys.gollek.ml.autograd.GradTensor;

public class SimpleClassifier extends NNModule {
    private final Linear fc1;
    private final Linear fc2;
    private final ReLU relu;

    public SimpleClassifier(int inputDim, int hiddenDim, int outputDim) {
        this.fc1 = register(new Linear(inputDim, hiddenDim));
        this.relu = register(new ReLU());
        this.fc2 = register(new Linear(hiddenDim, outputDim));
    }

    @Override
    public GradTensor forward(GradTensor input) {
        GradTensor x = fc1.forward(input);
        x = relu.forward(x);
        return fc2.forward(x);
    }
}
```

### Using Sequential

```java
import tech.kayys.gollek.ml.nn.layer.Sequential;

Sequential model = new Sequential(
    new Linear(784, 128),
    new ReLU(),
    new Dropout(0.2f),
    new Linear(128, 10)
);
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.nn.NNModule`

The base class for all neural network components.

| Method | Description |
|:-------|:------------|
| `register(Module m)` | Registers a sub-module so its parameters are tracked. |
| `forward(GradTensor input)` | Abstract method defining the forward pass logic. |
| `parameters()` | Returns a list of all trainable parameters in the module. |
| `train()` / `eval()` | Sets the module to training or evaluation mode (affects Dropout/BatchNorm). |

### Built-in Layers (Sampling)

- **Linear**: Affine transformation $y = xW^T + b$.
- **Embedding**: Dense representation for categorical indices.
- **LayerNorm / GroupNorm**: Normalization layers for stable training.
- **SiLU / GELU / Mish**: Modern activation functions.

### Built-in Loss Functions (Sampling)

- **CrossEntropyLoss**: Standard for multi-class classification.
- **MSELoss**: Mean Squared Error for regression.
- **BCEWithLogitsLoss**: Binary Cross Entropy with integrated sigmoid.
- **FocalLoss**: For imbalanced classification tasks.

---

[Back to API Hub](../)
