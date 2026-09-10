---
layout: default
title: Multimodal SDK
---

# Multimodal SDK

Process text, images, audio, and video with unified multimodal inference through Gollek.

---

## Overview

The Gollek multimodal surface provides a **fluent, unified API** for processing multiple input modalities. It automatically handles device dispatch (CPU/GPU), quantization, and model-specific content mapping.

**Supported Modalities:**
- 🖼️ **Vision**: LLaVA, CLIP, Stable Diffusion, Vit.
- 🔊 **Audio**: Whisper STT, MelSpectrogram, Conv1d.
- 🎞️ **Video**: Frame extraction, Temporal attention.
- 📝 **Cross-Modal**: Text-to-Image, Vision-to-Text.

---

## Fluent API

The recommended way to use the Multimodal SDK is through the `Gollek` facade.

### Vision (Image-to-Text)

Ask questions about images using vision-language models:

```java
import tech.kayys.gollek.ml.Gollek;

var result = Gollek.vision()
    .model("llava-v1.6-7b")
    .image(Path.of("invoice.jpg"))
    .prompt("Extract the total amount and date")
    .maxTokens(128)
    .generate();

System.out.println("Extracted: " + result.text());
```

### Audio (Speech-to-Text)

Transcribe audio files using Whisper or similar providers:

```java
var transcription = Gollek.audio()
    .model("whisper-large-v3")
    .audio(Path.of("meeting.wav"))
    .language("en")
    .generate();

System.out.println("Transcript: " + transcription.text());
```

### Multimodal Chat

Combine multiple inputs (Text + Image + Audio) in a single request:

```java
var response = Gollek.multimodal()
    .model("gemini-1.5-pro")
    .addText("Analyze this image and the accompanying audio note.")
    .addImage(imageBytes)
    .addAudio(audioBytes)
    .generate();
```

---

## Neural Network Layers (P1)

For developers building custom architectures, Gollek provides specialized multimodal layers:

| Layer | Modality | Purpose |
|-------|----------|---------|
| `Conv2d` | Vision | 2D Convolution for image features |
| `MaxPool2d` | Vision | Spatial downsampling |
| `MelSpectrogram` | Audio | Converting waveform to frequency domain |
| `Conv1d` | Audio | 1D Convolution for temporal features |
| `CrossAttention`| Multi | Aligning features across modalities |
| `ModalityFusion`| Multi | Latent space concatenation/fusion |

### Example: Custom Vision Encoder
```java
Module visionEncoder = new Sequential(
    new Conv2d(3, 32, 5), new ReLU(),
    new MaxPool2d(2),
    new Conv2d(32, 64, 3), new ReLU(),
    new GlobalAveragePool()
);
```

---

## Dataset Abstractions

The `gollek-ml-data` module is the canonical data layer. Some multimodal dataset utilities are still available through compatibility packages while migration continues:

- **`ImageDataset`**: Directory-based image loading with on-the-fly resizing.
- **`AudioDataset`**: Waveform streaming and resampling.
- **`ImageTextDataset`**: Pairs of images and JSON metadata/captions.
- **`StreamingDataset`**: Interface for real-time video/audio streams.

```java
Dataset dataset = ImageDataset.builder()
    .directory("path/to/train")
    .targetSize(224, 224)
    .build();

for (GradTensor batch : dataset) {
    // Training loop...
}
```

---

## LangChain4j Integration

Gollek provides a seamless adapter for [LangChain4j](https://github.com/langchain4j/langchain4j).

```java
GollekChatModel model = GollekChatModel.builder()
    .endpoint("http://localhost:8080")
    .modelName("llava-v1.6")
    .build();

Response<AiMessage> response = model.generate(
    UserMessage.from(
        TextContent.from("What's in this image?"),
        ImageContent.from("path/to/image.png")
    )
);
```

---

## Hardware Acceleration

Vision and Audio tasks leverage Gollek's **MetalComputeBackend** and **CudaBackend** for:
- ⚡ **FlashAttention-2**: For high-resolution image processing.
- 🚀 **Zero-Copy Image Transfer**: `GradTensor.fromImage(bufferedImage)` directly maps Java memory to GPU.

---

[Getting Started Guide](/docs/setup/cli-installation) &nbsp; [Neural Network API](/docs/framework/framework) &nbsp; [Runtime Architecture](/docs/runtime/architecture)
