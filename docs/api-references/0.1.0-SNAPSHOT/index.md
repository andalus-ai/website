---
layout: default
title: "API REferences :: v0.1.0-SNAPSHOT"
parent: API REferences
nav_order: 1
---

# Gollek ML/DL/NN Framework API REferences
## Version: 0.1.0-SNAPSHOT

Welcome to the comprehensive API reference for the Gollek Machine Learning, Deep Learning, and Neural Network framework. The following modules form the core of the `gollek/framework/lib` ecosystem.

---

## 🏗️ Core Framework
Essential modules for building and training neural networks.

| Module | Description |
|:-------|:------------|
| [**gollek-ml-api**](modules/gollek-ml-api) | High-level ML framework façade and unified interfaces. |
| [**gollek-ml-tensor**](modules/gollek-ml-tensor) | Core multi-dimensional array API with device acceleration support. |
| [**gollek-ml-autograd**](modules/gollek-ml-autograd) | Automatic differentiation engine for gradient-based optimization. |
| [**gollek-ml-nn**](modules/gollek-ml-nn) | Collection of 118+ neural network layers and modules. |
| [**gollek-trainer-api**](modules/gollek-trainer-api) | Canonical trainer session, config, listener, and summary contracts. |
| [**gollek-trainer**](modules/gollek-trainer) | Canonical trainer runtime bridge and future home of trainer orchestration. |
| [**gollek-ml-train**](modules/gollek-ml-train) | Legacy trainer compatibility page for the migration from `training/` to `trainer/`. |
| [**gollek-ml-optimize**](modules/gollek-ml-optimize) | Complete suite of optimizers (Adam, SGD, RMSprop, etc.). |
| [**gollek-ml-metrics**](modules/gollek-ml-metrics) | Performance and accuracy metrics for model evaluation. |

---

## 🧠 Model Architectures
Specialized layers and blocks for standard deep learning architectures.

| Module | Description |
|:-------|:------------|
| [**gollek-ml-cnn**](modules/gollek-ml-cnn) | Convolutional Neural Network layers and utilities. |
| [**gollek-ml-rnn**](modules/gollek-ml-rnn) | Recurrent Neural Network modules (LSTM, GRU, etc.). |
| [**gollek-ml-transformer**](modules/gollek-ml-transformer) | Transformer blocks, attention mechanisms, and LLM foundations. |
| [**gollek-ml-byte-latent**](modules/gollek-ml-byte-latent) | Byte-latent language-model family for Fast Byte Latent Transformer style architectures. |
| [**gollek-ml-recursive-reasoning**](modules/gollek-ml-recursive-reasoning) | GRAM-style recursive reasoning, structured benchmark adapters, and trainer-facing token dataset utilities. |
| [**gollek-ml-models**](modules/gollek-ml-models) | Pre-defined model architectures and template collections. |

---

## 📊 Data & Multi-modal Processing
Tools for data ingestion, augmentation, and specialized media processing.

| Module | Description |
|:-------|:------------|
| [**gollek-ml-data**](modules/gollek-ml-data) | Efficient data loaders and dataset abstractions. |
| [**gollek-ml-augment**](modules/gollek-ml-augment) | 8+ data augmentation transforms for robust training. |
| [**gollek-ml-vision**](modules/gollek-ml-vision) | Computer vision utilities and image preprocessing pipelines. |
| [**gollek-ml-audio**](modules/gollek-ml-audio) | Audio processing and feature extraction for sound models. |
| [**gollek-ml-nlp**](modules/gollek-ml-nlp) | Natural Language Processing pipelines and tokenizers. |
| [**gollek-ml-multimodal**](modules/gollek-ml-multimodal) | Integrated processing for vision-language and other hybrid tasks. |

---

## 🚀 Deployment & Formats
Modules for model persistence, export, and cross-platform inference.

| Module | Description |
|:-------|:------------|
| [**gollek-ml-hub**](modules/gollek-ml-hub) | Canonical model hub for HF/local repositories and weight loading. |
| [**gollek-ml-export**](modules/gollek-ml-export) | Canonical export and benchmarking surface for ONNX, GGUF, and LiteRT. |
| [**gollek-ml-onnx**](modules/gollek-ml-onnx) | ONNX Runtime integration for high-performance inference. |
| [**gollek-ml-litert**](modules/gollek-ml-litert) | Google LiteRT (TFLite) integration for edge deployment. |
| [**gollek-ml-gguf**](modules/gollek-ml-gguf) | Specialized support for GGUF format and llama.cpp compat. |
| [**gollek-ml-safetensor**](modules/gollek-ml-safetensor) | Native support for the SafeTensors weights format. |

---

## 🔬 Examples & Demos
| Module | Description |
|:-------|:------------|
| [**gollek-ml-examples**](modules/gollek-ml-examples) | End-to-end examples, from MNIST to LLM fine-tuning. |

---

## 🔌 Integrations
Adapters for notebooks, scripts, and external Java AI tooling.

| Module | Description |
|:-------|:------------|
| [**gollek-integration-jupyter**](modules/gollek-integration-jupyter) | Standalone Gollek Java kernel for Jupyter with preloaded helpers, rich outputs, magics, and artifact inspection commands. |

---

## Usage in Maven

To use the complete framework, add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-api</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

For specialized modules (e.g., Vision):

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-vision</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```
