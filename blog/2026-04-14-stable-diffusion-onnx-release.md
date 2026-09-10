---
layout: post
title: "Stable Diffusion ONNX - Production-Ready Image Generation in Java"
date: 2026-04-14
categories: release multimodal
tags: [stable-diffusion, onnx, image-generation, multimodal, java-ai]
excerpt: "Gollek now supports production-ready Stable Diffusion image generation with full parameter control, auto-open preview, and cross-platform support — all in pure Java with ONNX Runtime."
---

# 🎨 Stable Diffusion ONNX - Production-Ready Image Generation in Java

We're excited to announce that **Gollek now supports full Stable Diffusion image generation** with ONNX Runtime, complete with seed control, step management, guidance scaling, and automatic image preview.

This is a **Java-first implementation** — no Python, no external services, just pure Java 25 with Project Panama FFM bindings to ONNX Runtime.

## ✨ What's New

### Complete CLI Control

Generate images with a single command:

```bash
java -jar gollek-runner.jar run \
  --model CompVis/stable-diffusion-v1-4 \
  --branch onnx \
  --prompt "a cyberpunk cat with neon lights, digital art" \
  --seed 12345 \
  --steps 30 \
  --guidance-scale 7.5 \
  --output cyberpunk-cat.png
```

### New Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--seed` | Random seed for reproducible generation | 42 |
| `--steps` | Number of denoising iterations | 20 |
| `--guidance-scale` / `--cfg` | Classifier-free guidance scale | 7.5 |
| `--output` / `-o` | Output image file path | `output.png` |
| `--width` | Image width in pixels (multiple of 64) | 512 |
| `--height` | Image height in pixels (multiple of 64) | 512 |

### Premium UX Features

- **Auto-Open Preview**: Generated images automatically open in your system's default viewer (Preview.app on macOS, xdg-open on Linux, default app on Windows)
- **Real-Time Progress**: Watch generation progress step-by-step with percentage completion
- **Cross-Platform**: Works on Apple Silicon (CoreML + CPU), x86_64 (CPU), and NVIDIA GPUs (CUDA - upcoming)

## 🏗️ Architecture

The SD pipeline follows the classic three-stage approach:

```
Prompt → CLIP Text Encoder → Text Embeddings
       → UNet (×N steps)   → Denoised Latents
       → VAE Decoder       → RGB Image → PNG
```

### Implementation Details

- **CLIP Text Encoder**: CoreML-accelerated on Apple Silicon, converts prompts to 768-dim embeddings
- **UNet Denoiser**: CPU-optimized for stability, runs classifier-free guidance with DDIM scheduler
- **VAE Decoder**: CoreML-accelerated, converts 4×64×64 latents to 3×512×512 RGB images
- **Memory Model**: All intermediates use Panama FFM `MemorySegment` buffers with arena-based lifecycle management

## 📊 Performance

| Platform | Steps | Time | Notes |
|----------|-------|------|-------|
| Apple M2 Pro | 20 | ~3-5 min | CoreML (TE/VAE) + CPU (UNet) |
| Apple M2 Pro | 50 | ~8-12 min | High quality |
| x86_64 (8-core) | 20 | ~8-15 min | CPU only |
| x86_64 (8-core) | 50 | ~20-35 min | CPU only |

## 🚀 Getting Started

### Prerequisites

1. **Java 25** with preview features enabled
2. **ONNX Runtime** installed (`brew install onnxruntime` on macOS)
3. **Model downloaded** (first run auto-downloads ~7GB ONNX conversion)

### Quick Start

```bash
# 1. Install ONNX Runtime (macOS)
brew install onnxruntime

# 2. Run your first generation
java -jar gollek-runner.jar run \
  --model CompVis/stable-diffusion-v1-4 \
  --branch onnx \
  --prompt "a cat playing ball" \
  --steps 10 \
  --output cat.png
```

### Advanced Usage

```bash
# Batch generation with different seeds
for seed in 100 200 300 400 500; do
  java -jar gollek-runner.jar run \
    --model CompVis/stable-diffusion-v1-4 \
    --branch onnx \
    --prompt "a cat playing ball, digital art" \
    --seed $seed \
    --steps 30 \
    --output "cat-seed-${seed}.png"
done
```

## 🎯 Parameter Guidelines

### Seed Control

Use the same seed for reproducible results:

```bash
# Reproducible generation
--seed 42

# Different results each time
--seed $(shuf -i 1-999999 -n1)
```

**Tip**: Same seed + same prompt + same settings = identical image

### Step Count

| Steps | Quality | Speed | Use Case |
|-------|---------|-------|----------|
| 10-15 | Low | Fast | Quick previews |
| 20-30 | Good | Medium | Normal use |
| 40-50 | High | Slow | Final renders |

### Guidance Scale (CFG)

| CFG | Behavior | Use Case |
|-----|----------|----------|
| 3-5 | Creative, loose | Abstract art |
| 7-8 | Balanced | Default recommendation |
| 10-15 | Strict prompt following | Precise control |
| 15+ | Oversaturated, artifacts | Experimental |

## 🔧 Programmatic API

Use Gollek's SDK for image generation in your Java applications:

```java
// Create inference request
InferenceRequest request = InferenceRequest.builder()
    .model("CompVis/stable-diffusion-v1-4")
    .prompt("a cyberpunk cat with neon lights")
    .parameter("seed", 12345L)
    .parameter("steps", 30)
    .parameter("guidance_scale", 7.5f)
    .streaming(true)
    .build();

// Stream with progress
sdk.streamCompletion(request)
    .subscribe().with(
        chunk -> {
            if (chunk.modality() == ModalityType.IMAGE) {
                byte[] pngData = Base64.getDecoder()
                    .decode(chunk.imageDeltaBase64());
                Files.write(Path.of("output.png"), pngData);
            }
        },
        error -> System.err.println("Failed: " + error.getMessage()),
        () -> System.out.println("Generation complete!")
    );
```

## 📚 Resources

- [SD Usage Guide](https://github.com/gollek-ai/gollek/blob/main/SD_USAGE.md)
- [SD Implementation Notes](https://github.com/gollek-ai/gollek/blob/main/SD_ONNX_NOTES.md)
- [JBang Examples](https://github.com/gollek-ai/gollek/tree/main/examples/jbang/multimodal)
- [Jupyter Notebook](https://github.com/gollek-ai/gollek/tree/main/examples/jupyter)

## 🎬 What's Next

- [ ] CUDA execution provider for NVIDIA GPUs
- [ ] Dynamic resolution support (beyond 512×512)
- [ ] Image-to-image (img2img) mode
- [ ] Inpainting support
- [ ] Advanced schedulers (Euler, DPM++, etc.)
- [ ] Negative prompt support
- [ ] SDXL model support

---

*Stable Diffusion ONNX is now production-ready in Gollek. Generate images from text prompts with full control over seed, quality, and guidance — all in pure Java.*

**Try it today**: `java -jar gollek-runner.jar run --model CompVis/stable-diffusion-v1-4 --branch onnx --prompt "your prompt here"`
