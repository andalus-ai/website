---
layout: default
title: ML Framework Guide
---

<section class="hero hero-compact">
  <p class="eyebrow">PyTorch-like API for Java</p>
  <h1>Gollek ML Framework Guide</h1>
  <p class="lead">Build and train neural networks with a comprehensive PyTorch-like API in pure Java. Tensors, autograd, 36+ modules, optimizers, and the full toolkit for ML research and development.</p>
</section>

<section class="quick-grid">
  <a class="quick-card" href="#tensors">
    <h3>📊 Tensors & Autograd</h3>
    <p>GradTensor with automatic differentiation and dynamic computational graphs.</p>
  </a>
  <a class="quick-card" href="#nn-modules">
    <h3>🧠 NN Modules</h3>
    <p>36+ components: Linear, Conv2d, Attention, Transformers, and more.</p>
  </a>
  <a class="quick-card" href="#training">
    <h3>🏋️ Training</h3>
    <p>Complete training loops with optimizers, schedulers, and early stopping.</p>
  </a>
  <a class="quick-card" href="#examples">
    <h3>💡 Examples</h3>
    <p>23+ ready-to-run scripts from Hello World to Transformer classifiers.</p>
  </a>
</section>

---

## Overview

Gollek ML SDK provides a **PyTorch-like development experience** for Java developers, with:

- **Tensor Operations**: Multi-dimensional arrays with hardware-accelerated dispatch
- **Automatic Differentiation**: Tape-based autograd engine with dynamic computational graphs
- **Neural Network Modules**: 36+ production-ready components with 100% JavaDoc coverage
- **Training Support**: Complete ecosystem for model development and experimentation
- **Interactive Development**: JBang scripting and Jupyter notebook support
- **Hardware Acceleration**: CUDA, Metal, ROCm kernels with FlashAttention 2/3/4

---

## GradTensor & Autograd {#tensors}

### Creating Tensors

```java
// Create tensors
GradTensor x = GradTensor.rand(new long[]{32, 64});  // Random [32, 64]
GradTensor y = GradTensor.zeros(new long[]{64, 10}); // Zeros [64, 10]
GradTensor z = GradTensor.of(new float[]{1.0f, 2.0f, 3.0f}, 3); // From data

// Enable gradient tracking
GradTensor w = GradTensor.rand(new long[]{64, 128})
    .requiresGrad(true);
```

### Automatic Differentiation

```java
// Build computational graph
GradTensor w = GradTensor.rand(new long[]{64, 128}).requiresGrad(true);
GradTensor x = GradTensor.rand(new long[]{128, 64});

// Forward pass
GradTensor out = Functions.Matmul.apply(w, x);
GradTensor loss = Functions.Sum.apply(out);

// Backward pass (autograd)
loss.backward();

// Access gradients
GradTensor wGrad = w.grad();
```

### Hardware-Accelerated Dispatch

Tensors automatically dispatch to available hardware kernels:

```java
// CPU fallback
GradTensor cpu = GradTensor.rand(new long[]{32, 64});

// GPU acceleration (if available)
// Metal (Apple Silicon), CUDA (NVIDIA), ROCm (AMD)
// Transparent to user - SDK handles device selection
```

---

## Neural Network Modules {#nn-modules}

### Basic Layers

```java
// Linear (fully connected) layer
Linear linear = new Linear(784, 256);

// Embedding layer for NLP
Embedding embedding = new Embedding(vocabSize=30000, dim=512);

// Normalization layers
LayerNorm layerNorm = new LayerNorm(256);
BatchNorm1d batchNorm = new BatchNorm1d(256);
```

### Attention & Transformers

```java
// Multi-head self-attention
MultiHeadAttention attention = new MultiHeadAttention(
    dim=512, numHeads=8, dropout=0.1f
);

// Transformer encoder layer
TransformerEncoderLayer encoder = new TransformerEncoderLayer(
    dim=512, numHeads=8, ffnDim=2048, dropout=0.1f
);

// Transformer decoder layer
TransformerDecoderLayer decoder = new TransformerDecoderLayer(
    dim=512, numHeads=8, ffnDim=2048, dropout=0.1f
);
```

### Activation Functions

```java
// Standard activations
ReLU relu = new ReLU();
Sigmoid sigmoid = new Sigmoid();
Tanh tanh = new Tanh();

// Modern activations
GELU gelu = new GELU();
SiLU silu = new SiLU();
Mish mish = new Mish();

// Advanced
LeakyReLU leaky = new LeakyReLU(0.01f);
ELU elu = new ELU(1.0f);
```

### Building Models

```java
// Sequential model (like PyTorch nn.Sequential)
Module model = new Sequential(
    new Linear(784, 256),
    new ReLU(),
    new Dropout(0.2f),
    new Linear(256, 128),
    new ReLU(),
    new Dropout(0.2f),
    new Linear(128, 10)
);

// Forward pass
GradTensor input = GradTensor.rand(new long[]{32, 784});
GradTensor output = model.forward(input);
```

### Custom Modules

```java
// Create custom module
public class ResidualBlock extends Module {
    private final Linear fc1;
    private final Linear fc2;
    private final ReLU relu;
    private final LayerNorm norm;
    
    public ResidualBlock(int dim) {
        this.fc1 = register("fc1", new Linear(dim, dim));
        this.fc2 = register("fc2", new Linear(dim, dim));
        this.relu = register("relu", new ReLU());
        this.norm = register("norm", new LayerNorm(dim));
    }
    
    @Override
    public GradTensor forward(GradTensor x) {
        GradTensor h = relu.forward(fc1.forward(x));
        h = fc2.forward(h);
        return norm.forward(Functions.Add.apply(x, h)); // Skip connection
    }
}
```

---

## Loss Functions

```java
// Classification
CrossEntropyLoss ceLoss = new CrossEntropyLoss();
BCEWithLogitsLoss bceLoss = new BCEWithLogitsLoss();

// Regression
MSELoss mseLoss = new MSELoss();
L1Loss l1Loss = new L1Loss();
SmoothL1Loss huberLoss = new SmoothL1Loss();

// Embedding
CosineEmbeddingLoss cosineLoss = new CosineEmbeddingLoss();

// Usage
GradTensor output = model.forward(input);
GradTensor loss = ceLoss.compute(output, target);
```

---

## Optimizers

```java
// Adam optimizer
Adam optimizer = new Adam(model.parameters(), learningRate=0.001f);

// SGD with momentum
SGD sgd = new SGD(model.parameters(), learningRate=0.01f, momentum=0.9f);

// Training step
loss.backward();
optimizer.step();
optimizer.zeroGrad();
```

---

## Learning Rate Schedulers

```java
// Step decay
StepLR scheduler = new StepLR(optimizer, stepSize=10, gamma=0.1f);

// Cosine annealing
CosineAnnealingLR cosineScheduler = new CosineAnnealingLR(
    optimizer, maxEpochs=100
);

// Update after each epoch
scheduler.step();
```

---

## Training Loop {#training}

### Basic Training

```java
// Setup
Module model = new Sequential(
    new Linear(784, 256), new ReLU(),
    new Dropout(0.2f),
    new Linear(256, 10)
);

var optimizer = new Adam(model.parameters(), 0.001f);
var scheduler = new StepLR(optimizer, 10, 0.1f);
var loss = new CrossEntropyLoss();

// Training loop
for (int epoch = 0; epoch < 100; epoch++) {
    // Forward pass
    var output = model.forward(input);
    var lossVal = loss.compute(output, target);
    
    // Backward pass
    lossVal.backward();
    
    // Optimizer step
    optimizer.step();
    optimizer.zeroGrad();
    
    // Update learning rate
    scheduler.step();
    
    // Log progress
    if ((epoch + 1) % 10 == 0) {
        System.out.println("Epoch " + (epoch + 1) + 
            ", Loss: " + lossVal.item());
    }
}
```

### Advanced Training with Early Stopping

```java
// Early stopping callback
EarlyStopping earlyStopping = new EarlyStopping(
    patience=5,
    minDelta=0.001f,
    restoreBestWeights=true
);

for (int epoch = 0; epoch < 1000; epoch++) {
    var output = model.forward(trainInput);
    var lossVal = loss.compute(output, trainTarget);
    
    lossVal.backward();
    optimizer.step();
    optimizer.zeroGrad();
    
    // Check early stopping
    var valOutput = model.forward(valInput);
    var valLoss = loss.compute(valOutput, valTarget);
    
    if (earlyStopping.step(valLoss.item())) {
        System.out.println("Early stopping at epoch " + epoch);
        break;
    }
}
```

### Train/Eval Modes

```java
// Training mode (enables dropout, batch norm updates)
model.train();

// Evaluation mode (disables dropout, uses running stats)
model.eval();

// Make predictions
model.eval();
GradTensor predictions = model.forward(testInput);
```

---

## Data Loading

```java
// Dataset abstraction
Dataset<InputStruct> ds = new MultiModalDataset("/opt/data");

// DataLoader with batching and shuffling
DataLoader<InputStruct> loader = new DataLoader<>(ds, 64, true, false);

// Iterate over batches
for (List<InputStruct> batch : loader) {
    var tensors = collateInputs(batch);
    var targets = collateTargets(batch);
    var output = model.forward(tensors);
    var loss = lossFn.compute(output, targets);
    // ... training step
}
```

For tensor-ready examples, see [Building Efficient Data Pipelines](/docs/tutorials/intermediate/data-pipelines).

---

## Model Persistence

### Saving Models

```java
// Save model weights (SafeTensors format)
model.saveWeights("my_model.safetensors");

// Save entire model state
model.save("my_model.gollek");
```

### Loading Models

```java
// Create model architecture
Module model = new Sequential(
    new Linear(784, 256),
    new ReLU(),
    new Linear(256, 10)
);

// Load pre-trained weights
model.loadWeights("my_model.safetensors");

// Use for inference
model.eval();
GradTensor output = model.forward(input);
```

---

## JBang Examples {#examples}

Gollek SDK includes **23+ ready-to-run examples** that demonstrate all framework capabilities:

### Beginner Examples
- **Hello Gollek**: Basic tensor operations
- **My Script**: Template for experiments
- **Error Handling**: Production-ready patterns

### Neural Networks
- **XOR Training**: Complete training loop
- **MNIST Setup**: Image classification
- **Custom Modules**: Residual blocks
- **Model Persistence**: Save/load weights

### NLP & Text
- **Sentiment Analysis**: Real movie reviews
- **Transformer Classifier**: Multi-head attention
- **Chat with Qwen**: GGUF model loading

### ML Integrations
- **Deeplearning4j**: Tensor conversion, ensemble
- **Stanford NLP**: Linguistic features
- **Smile ML**: Feature selection, ensembles
- **Oracle Tribuo**: XGBoost integration

**Run any example**:
```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/hello_gollek.java
```

[View All Examples](/docs/setup/jbang-examples)

---

## LangChain4j Integration

```java
// Create Gollek instance
Gollek gnk = Gollek.builder()
    .model("Llama-3.2-3B-Instruct")
    .device("METAL")
    .build();

// Use with LangChain4j
ChatLanguageModel model = new GollekChatModel(gnk);
String answer = model.generate("Hi, how are you?");

// Streaming
StreamingChatLanguageModel streaming = 
    new GollekStreamingChatModel(gnk);
streaming.generate("Tell me a story", 
    token -> System.out.print(token));
```

---

## GPU Acceleration

Gollek automatically detects and uses available GPU hardware:

### Apple Silicon (Metal)
```bash
# Automatic on M1-M4 chips
# Supports: FA4, unified memory, BF16, AMX GEMM
```

### NVIDIA (CUDA)
```bash
# Automatic on NVIDIA GPUs
# Supports: FlashAttention 2/3/4, FP8/FP4, paged KV cache
```

### AMD (ROCm)
```bash
# Automatic on AMD GPUs
# Supports: ROCm acceleration, unified memory
```

### Check Device Selection
```java
// SDK logs device detection on startup
// Look for: "Metal device detected" or "CUDA device detected"
```

---

## Next Steps

1. **Start with Examples**: Run the JBang examples to see the API in action
2. **Build Your First Model**: Follow the training loop patterns above
3. **Explore Advanced Features**: Try custom modules, attention, transformers
4. **Integrate with Ecosystem**: Use LangChain4j, Deeplearning4j, Stanford NLP
5. **Deploy to Production**: Switch to inference runtime for serving

---

## Resources

- [JBang Examples Catalog](/docs/setup/jbang-examples) - 23+ ready-to-run scripts
- [Jupyter & JBang Integration](/docs/dev-log/jupyter-jbang-integration) - Interactive development
- [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs) - Hardware acceleration details
- [Model Formats](/docs/runtime/gguf-enhancements) - GGUF, SafeTensors, ONNX support
- [Plugin System](/docs/plugins/plugin-system-v2) - Extending the framework

---

[Back to Documentation](/docs/) · [CLI Guide](/docs/setup/cli-installation) · [Runtime Guide](/docs/runtime/core-api)
