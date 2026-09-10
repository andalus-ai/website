---
layout: default
title: gollek-ml-optimize
parent: API REferences
nav_order: 60
---

# gollek-ml-optimize

The `gollek-ml-optimize` module provides a comprehensive suite of optimization algorithms and training stability tools. It includes classic and state-of-the-art optimizers, learning rate schedulers, and techniques for model compression and mixed precision training.

## 🌟 Overview

Optimization is the process of updating model parameters to minimize the loss function. This module offers highly optimized implementations of various algorithms, along with advanced utilities like Sharpness-Aware Minimization (SAM), Lookahead, and Gradient Scaling.

## 🚀 Key Features

- **Extensive Optimizer Suite**: Support for Adam, AdamW, SGD, RMSprop, Lion, LAMB, and more.
- **Dynamic LR Scheduling**: Support for StepLR, Cosine Annealing, and Warmup-based schedulers.
- **Advanced Optimization Techniques**: Sharpness-Aware Minimization (SAM) and Lookahead wrappers.
- **Mixed Precision Support**: `GradScaler` for automated FP16 loss scaling.
- **Model Optimization**: Tools for Knowledge Distillation, Structured Pruning, and Quantization-Aware Training (QAT).
- **Inference Optimization**: Post-Training Quantization (PTQ) and FP16 conversion tools.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-optimize</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Using the AdamW Optimizer

```java
import tech.kayys.gollek.ml.optim.AdamW;
import tech.kayys.gollek.ml.optim.Optimizer;

Optimizer optimizer = AdamW.builder(model.parameters(), 0.001f)
    .betas(0.9f, 0.999f)
    .weightDecay(0.01f)
    .build();

// Inside training loop:
optimizer.zeroGrad();
loss.backward();
optimizer.step();
```

### Sharpness-Aware Minimization (SAM)

```java
import tech.kayys.gollek.ml.optim.SAM;

// SAM wraps an existing optimizer
Optimizer baseOptim = new SGD(model.parameters(), 0.1f);
SAM sam = new SAM(model.parameters(), baseOptim, 0.05f);

// SAM requires a two-step closure or manual two-pass update
sam.step(() -> {
    // compute loss for first step
    return loss;
});
```

### Learning Rate Scheduling

```java
import tech.kayys.gollek.ml.optim.CosineAnnealingLR;

CosineAnnealingLR scheduler = new CosineAnnealingLR(optimizer, 100, 1e-5f);

for (int epoch = 0; epoch < 100; epoch++) {
    train();
    scheduler.step();
}
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.optim.Optimizer`

The base interface for all optimization algorithms.

| Method | Description |
|:-------|:------------|
| `step()` | Updates parameters based on current gradients. |
| `zeroGrad()` | Resets all parameter gradients to zero. |
| `parameters()` | Returns the list of `Parameter` objects being optimized. |

### `tech.kayys.gollek.ml.optim.LRScheduler`

Base class for automated learning rate updates.

- `step()`: Updates the learning rate of the associated optimizer.
- `getLR()`: Returns the current learning rate.

### `tech.kayys.gollek.ml.optim.GradScaler`

Manages loss scaling for mixed precision training to prevent underflow in FP16 gradients.

---

[Back to API Hub](../)
