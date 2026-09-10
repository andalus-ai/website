---
layout: default
title: My First Neural Network
parent: Basic Tutorials
grand_parent: Tutorials
nav_order: 3
---

# 🧠 My First Neural Network

In this tutorial, we will build a simple feed-forward neural network to solve a basic classification problem using the `gollek-ml-nn` module.

## 1. Defining the Architecture

In Gollek, you define a model by extending `NNModule` or using the `Sequential` wrapper.

```java
import tech.kayys.gollek.ml.nn.NNModule;
import tech.kayys.gollek.ml.nn.layer.*;
import tech.kayys.gollek.ml.nn.layer.Sequential;

Sequential model = new Sequential(
    new Linear(2, 16), // Input layer (2 features -> 16 hidden)
    new ReLU(),        // Activation function
    new Linear(16, 1)  // Output layer (16 hidden -> 1 prediction)
);
```

## 2. The Training Loop

To train the model, we need an optimizer and a loss function.

```java
import tech.kayys.gollek.ml.optim.Adam;
import tech.kayys.gollek.ml.nn.loss.MSELoss;

Adam optimizer = new Adam(model.parameters(), 0.001f);
MSELoss criterion = new MSELoss();

// Simulation of training data
Tensor inputs = Tensor.randn(10, 2);
Tensor targets = Tensor.randn(10, 1);

for (int epoch = 0; epoch < 100; epoch++) {
    // 1. Forward pass
    Tensor output = model.forward(inputs);
    Tensor loss = criterion.forward(output, targets);
    
    // 2. Backward pass
    optimizer.zeroGrad();
    loss.backward();
    
    // 3. Update weights
    optimizer.step();
    
    if (epoch % 10 == 0) {
        System.out.printf("Epoch %d, Loss: %.4f%n", epoch, loss.item());
    }
}
```

## 🎯 Next Steps

Great job! You've trained your first model. Now explore [Intermediate Tutorials](/docs/tutorials/intermediate/) to learn about vision and sequence models.
