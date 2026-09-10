---
layout: default
title: gollek-ml-models
parent: API REferences
nav_order: 230
---

# gollek-ml-models

The `gollek-ml-models` module is a collection of industry-standard model architectures and specialized pipelines. It provides pre-defined, production-ready implementations of popular models across Vision, NLP, and Multimodal domains.

## 🌟 Overview

Rather than building complex architectures from scratch, this module allows developers to instantiate established models with a single line of code. It includes both the architectural code and the orchestration logic (pipelines) required to run these models end-to-end.

## 🚀 Key Features

- **Generative AI Foundations**: Full implementations of **LLaMA**, **GPT-2**, and **Stable Diffusion**.
- **Vision Backbones**: Optimized versions of **ResNet**, **VGG**, **ViT** (Vision Transformer), and **EfficientNet**.
- **NLP Powerhouses**: Native implementations of **BERT**, **T5**, and **Whisper** (for speech-to-text).
- **Diffusion Pipelines**: Integrated support for Denoising Diffusion Probabilistic Models (**DDPM**) and **UNet2DConditional** foundations.
- **Specialized Architectures**: Includes Variational Autoencoders (**VAE**), Generative Adversarial Networks (**GAN**), and Contrastive Language-Image Pre-training (**CLIP**).
- **Fine-Tuning Utilities**: Support for **LoRA** (Low-Rank Adaptation) via `LoRALinear` layers.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-models</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Instantiating a LLaMA Model

```java
import tech.kayys.gollek.ml.models.LLaMA;
import tech.kayys.gollek.ml.registry.ModelRegistry;

// Load a specific configuration (e.g., Llama-3-8B equivalent architecture)
LLaMA model = ModelRegistry.llama8b();

// Load weights into the model architecture
model.loadState(ModelRegistry.loadWeights("path/to/llama3.safetensors"));

// Run inference
GradTensor output = model.forward(inputIds);
```

### Running Stable Diffusion

```java
import tech.kayys.gollek.ml.models.StableDiffusionPipeline;

StableDiffusionPipeline sd = new StableDiffusionPipeline("runwayml/stable-diffusion-v1-5");
Tensor image = sd.textToImage("A futuristic city in the style of cyberpunk", 512, 512);
```

### Vision Transformer (ViT)

```java
import tech.kayys.gollek.ml.models.ViT;

ViT vit = ViT.builder()
    .imageSize(224)
    .patchSize(16)
    .numClasses(1000)
    .dim(768)
    .depth(12)
    .heads(12)
    .build();
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.registry.ModelRegistry`

The central hub for accessing pre-defined model configurations and loading weights.

| Method | Description |
|:-------|:------------|
| `loadWeights(path)` | Efficiently loads weights from Safetensors/GGUF/NPZ. |
| `bertBase()` | Returns a standard BERT-base architecture. |
| `resnet50()` | Returns a standard ResNet-50 architecture. |

### Pipelines

- **`WhisperPipeline`**: Orchestrates audio preprocessing, speech-to-text inference, and decoding.
- **`StableDiffusionPipeline`**: Manages the interaction between the Text Encoder, VAE, and UNet for image generation.

### Tuning & Fine-Tuning

- **`LoRALinear`**: A drop-in replacement for standard Linear layers that enables parameter-efficient fine-tuning (PEFT).

---

[Back to API Hub](../)
