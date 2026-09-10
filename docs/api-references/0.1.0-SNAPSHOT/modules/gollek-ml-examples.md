---
layout: default
title: gollek-ml-examples
parent: API REferences
nav_order: 330
---

# gollek-ml-examples

The `gollek-ml-examples` module provides a comprehensive suite of reference implementations and runnable examples. It demonstrates how to integrate the various modules of the Gollek framework to build, train, and deploy real-world AI applications.

## 🌟 Overview

Documentation is most effective when paired with working code. This module contains end-to-end examples ranging from simple linear regression to complex multimodal inference, serving as both a learning resource and a foundation for new projects.

## 🚀 Key Features

- **End-to-End Training Scripts**: Complete workflows for data loading, model definition, optimization, and evaluation.
- **Architecture Templates**: Working implementations of standard architectures (CNN, Transformer, FFN).
- **Inference Demos**: Examples of loading and running pre-trained models from HuggingFace and local files.
- **Multimodal Integration**: Demonstrations of vision-language and audio-text processing.
- **CLI & JBang Integration**: All examples are designed to be run directly via the command line or as JBang scripts.

## 📦 Installation

Add the following dependency to your `pom.xml` to access example utilities:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-examples</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Featured Examples

### Image Classification (MNIST)

`MNISTCNNExample`: Demonstrates building a 2D-CNN for handwriting recognition.

- **Key Concepts**: `Conv2d`, `MaxPool2d`, `Linear`, `CrossEntropyLoss`, `Adam`.
- **Location**: `tech.kayys.gollek.train.examples.MNISTCNNExample`

### Transformer Training

`TransformerEncoderExample`: A walkthrough of training a small transformer block for sequence modeling.

- **Key Concepts**: `MultiHeadAttention`, `LayerNorm`, `PositionalEncoding`, `LRScheduler`.
- **Location**: `tech.kayys.gollek.train.examples.TransformerEncoderExample`

### Simple Feed-Forward Network (FFN)

`SimpleFFNExample`: The "Hello World" of deep learning, training a multi-layer perceptron.

- **Key Concepts**: `NNModule`, `ReLU`, `GradTensor`, `SGD`.
- **Location**: `tech.kayys.gollek.train.examples.SimpleFFNExample`

## 📖 How to Run

Most examples can be executed directly from the terminal if you have the Gollek CLI installed:

```bash
# Run the MNIST training example
gollek run MNISTCNNExample --gpu

# Run a text generation demo
gollek run TextGenDemo --model qwen-0.5b
```

Alternatively, you can use JBang for zero-installation execution:

```bash
jbang MNISTCNNExample.java
```

---

[Back to API Hub](../)
