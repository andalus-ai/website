---
layout: default
title: gollek-ml-rnn
parent: API REferences
nav_order: 210
---

# gollek-ml-rnn

The `gollek-ml-rnn` module provides recurrent layers for processing sequential data. It includes support for standard RNNs, Long Short-Term Memory (LSTM), and Gated Recurrent Units (GRU), along with bidirectional wrappers.

## 🌟 Overview

Recurrent neural networks are designed to handle variable-length sequences by maintaining internal hidden states. This module provides high-performance implementations of these patterns, optimized for both CPU and GPU execution via the Gollek tensor backend.

## 🚀 Key Features

- **Standard Cell API**: Dedicated implementations for `RNNCell`, `LSTMCell`, and `GRUCell` for low-level control.
- **Multilayer Support**: Higher-level `LSTM` and `GRU` classes for easily building stacked recurrent architectures.
- **Bidirectional Wrapping**: The `Bidirectional` class allows any recurrent layer to process sequences in both forward and backward directions.
- **Hidden State Management**: Utilities for initializing and managing hidden and cell states across time steps.
- **Sequence Handling**: Efficient processing of batched sequences.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-rnn</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Using an LSTM Layer

```java
import tech.kayys.gollek.ml.rnn.LSTM;
import tech.kayys.gollek.ml.tensor.Tensor;

// Create LSTM: 512 input features, 256 hidden features, 2 layers
LSTM lstm = new LSTM(512, 256, 2);

// Forward pass for a sequence [SeqLen, BatchSize, Features]
Tensor input = Tensor.randn(10, 32, 512);
Tensor output = lstm.forward(input);

// output shape: [10, 32, 256]
```

### Building a Bidirectional GRU

```java
import tech.kayys.gollek.ml.rnn.GRU;
import tech.kayys.gollek.ml.rnn.Bidirectional;

// Wrap 128-dim GRU in Bidirectional layer
Bidirectional bigru = new Bidirectional(new GRU(64, 128));

// Output will have double the hidden dimension (256)
Tensor biOutput = bigru.forward(inputSequence);
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.rnn.LSTM`

High-level Long Short-Term Memory module.

| Constructor Parameter | Description |
|:-------|:------------|
| `inputSize` | The number of expected features in the input. |
| `hiddenSize` | The number of features in the hidden state. |
| `numLayers` | Number of recurrent layers (stacking). |
| `bias` | Whether to use bias weights (default: true). |

### `tech.kayys.gollek.ml.rnn.cells.LSTMCell`

Single-step LSTM computation.

- `forward(input, h, c)`: Computes the next hidden and cell states.
- Returns a `Pair<Tensor, Tensor>` containing `(h_next, c_next)`.

### Bidirectional Wrapper

- **`Bidirectional(Module rnn)`**: Wraps a unidirectional RNN/LSTM/GRU. The output at each step is the concatenation of the forward and backward passes.

---

[Back to API Hub](../)
