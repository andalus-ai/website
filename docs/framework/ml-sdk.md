---
layout: default
title: Getting Started with Gollek ML Framework
parent: Documentation
nav_order: 10
---

# Getting Started with Gollek ML Framework

The Gollek ML Framework is a native Java deep learning framework designed to bring the ease-of-use of PyTorch to the Java Virtual Machine. It uses Gollek tensor/runtime backends and provides a dynamic, define-by-run API for building and training neural networks.

Some docs and examples still use older "SDK" wording while migration continues. For new framework code, prefer the `gollek-ml-*` and `gollek-trainer-*` naming families.

For quick experimentation without a full Maven project, see our [JBang Examples Catalog](/docs/setup/jbang-examples).

## Core Concepts

### Tensors and GradTensors

The foundation of everything is the `GradTensor`. Unlike a standard array or a basic `Tensor`, a `GradTensor` tracks every operation performed on it, allowing for automatic differentiation (Autograd).

```java
import tech.kayys.gollek.ml.autograd.GradTensor;

// Create a tensor that requires gradients
GradTensor x = GradTensor.of(new float[]{1.0f, 2.0f}, 1, 2)
    .requiresGrad(true);

// Perform operations
GradTensor y = x.pow(2).sum();

// Backpropagate
y.backward();

// Access gradients
System.out.println(x.grad()); // Output: [2.0, 4.0]
```

### Modules and Layers

Neural networks are built by composing `Module` objects. Each module can contain parameters (trainable weights) and sub-modules.

```java
import tech.kayys.gollek.ml.nn.*;

public class SimpleNet extends Module {
    private final Linear fc1 = register(new Linear(784, 128));
    private final Linear fc2 = register(new Linear(128, 10));

    @Override
    public GradTensor forward(GradTensor input) {
        GradTensor x = fc1.forward(input).relu();
        return fc2.forward(x);
    }
}
```

## Training Workflow

Training a model in Gollek ML follows a familiar pattern:

1.  **Define the Model**: Extend `Module` and register your layers.
2.  **Choose an Optimizer**: Use `AdamW` or `SGD`.
3.  **Define a Loss Function**: Use `CrossEntropyLoss` or `MSELoss`.
4.  **Training Loop**: Iterate over your data, compute loss, backpropagate, and update weights.

### Full Training Loop Example

```java
import tech.kayys.gollek.ml.Gollek;
import tech.kayys.gollek.ml.data.*;
import tech.kayys.gollek.ml.nn.*;
import tech.kayys.gollek.ml.nn.optim.*;
import tech.kayys.gollek.ml.nn.loss.*;

// 1. Setup Data
Dataset<Map<String, String>> dataset = new CsvDataset(Path.of("train.csv"), ",", true);
DataLoader<GradTensor> loader = new DataLoader<>(dataset, 32, true, false)
    .map(row -> Gollek.tensor(parseRow(row), 1, 784));

// 2. Define Model
Sequential model = new Sequential(
    new Linear(784, 128),
    new ReLU(),
    new Linear(128, 10)
);

// 3. Optimizer & Loss
Optimizer optimizer = new AdamW(model.parameters(), 1e-3f);
Loss criterion = new CrossEntropyLoss();

// 4. Training Loop
for (int epoch = 0; epoch < 5; epoch++) {
    for (List<GradTensor> batch : loader) {
        optimizer.zeroGrad();
        
        // Stack batch and forward pass
        GradTensor input = GradTensor.cat(batch, 0); 
        GradTensor pred = model.forward(input);
        
        GradTensor loss = criterion.forward(pred, target); // targets from batch
        
        loss.backward();
        optimizer.step();
        
        System.out.printf("Epoch %d loss: %.4f%n", epoch, loss.item());
    }
}
```

## Advanced: Custom Modules & Residual Connections

You can create complex architectures by nesting modules. Here is a simple Residual block:

```java
public class ResidualBlock extends Module {
    private final Linear fc1;
    private final Linear fc2;

    public ResidualBlock(int dim) {
        this.fc1 = register(new Linear(dim, dim));
        this.fc2 = register(new Linear(dim, dim));
    }

    @Override
    public GradTensor forward(GradTensor input) {
        GradTensor shortcut = input;
        GradTensor x = fc1.forward(input).relu();
        x = fc2.forward(x);
        return x.add(shortcut).relu(); // y = f(x) + x
    }
}
```

## NLP Pipeline Example

For common tasks like text generation or classification, you can use pre-built pipelines that handle the complexity for you.

```java
import tech.kayys.gollek.ml.nlp.*;

// Create a pipeline for text generation
TextGenerationPipeline pipeline = PipelineFactory.create(
    "text-generation", 
    new PipelineConfig("gpt2")
);

String result = pipeline.generate("The future of AI in Java is");
System.out.println(result);
```

## Hardware Acceleration

The ML framework automatically leverages available hardware (CUDA, Metal, ROCm) through Gollek runtime backends. You can check availability and specify devices:

```java
import tech.kayys.gollek.ml.Gollek;
import tech.kayys.gollek.runtime.tensor.Device;

if (Gollek.isCudaAvailable()) {
    System.out.println("Running on NVIDIA GPU");
}

GradTensor x = GradTensor.scalar(1.0f).to(Device.CUDA);
```

## Next Steps

- Explore the [Runtime Core API](/docs/runtime/core-api) for a full list of layers and functions.
- Check out the [Examples Docs](/docs/setup/examples-docs) for current example hubs and runnable entrypoints.
- Join the [Discussions](https://github.com/bhangun/gollek/discussions) to share your feedback.
