---
layout: default
title: "Stable Diffusion Image Generation Tutorial"
permalink: /docs/tutorials/intermediate/stable-diffusion/
---

# 🎨 Stable Diffusion Image Generation

This tutorial walks you through generating images from text prompts using Gollek's ONNX-based Stable Diffusion implementation.

## Overview

Stable Diffusion is a latent text-to-image diffusion model that can generate photorealistic images from text prompts. Gollek implements the full SD v1 pipeline using ONNX Runtime with support for:

- **CLIP Text Encoder** - Converts prompts to embeddings
- **UNet Denoiser** - Iteratively refines latent representations
- **VAE Decoder** - Converts latents to RGB images
- **DDIM Scheduler** - Controls the denoising process

## Prerequisites

1. **Java 25** with preview features
2. **ONNX Runtime** installed
3. **Stable Diffusion model** downloaded (ONNX format)

### Installing ONNX Runtime

**macOS:**
```bash
brew install onnxruntime
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install libonnxruntime-dev
```

**Windows:**
```powershell
choco install onnxruntime
```

### Downloading the Model

The model will auto-download on first run (~7GB for ONNX conversion):

```bash
java -jar gollek-runner.jar pull CompVis/stable-diffusion-v1-4 --branch onnx
```

Or let the first generation handle it automatically.

## Quick Start: Your First Image

### Using CLI

```bash
java -jar gollek-runner.jar run \
  --model CompVis/stable-diffusion-v1-4 \
  --branch onnx \
  --prompt "a cat playing ball" \
  --steps 10 \
  --output cat.png
```

**Expected output:**
```
Platform: Apple Silicon M2 Pro
✓ GPU acceleration enabled

Model: CompVis/stable-diffusion-v1-4
Provider: onnx
--------------------------------------------------
[0/12] Encoding prompt...  
[1/12] Initializing latents (seed=42)...  
[2/12] Denoising step 1/10 (10%)...  
[3/12] Denoising step 2/10 (20%)...  
...
[11/12] Denoising step 10/10 (100%)...  
[12/12] Decoding image to PNG...  
✓ Image saved to: /path/to/cat.png
```

The image will automatically open in Preview.app (macOS) or your default image viewer.

## Understanding the Parameters

### Seed Control

The seed controls the initial random noise. Same seed + same prompt = identical image.

```bash
# Reproducible result
--seed 42

# Try different seeds for variety
--seed 12345
--seed 999
```

**Pro Tip**: Generate multiple variations:
```bash
for seed in 100 200 300; do
  java -jar gollek-runner.jar run \
    --model CompVis/stable-diffusion-v1-4 \
    --branch onnx \
    --prompt "a cat playing ball" \
    --seed $seed \
    --output "cat-v${seed}.png"
done
```

### Step Count

More steps = better quality but slower.

| Steps | Time (M2 Pro) | Quality | Use Case |
|-------|---------------|---------|----------|
| 5-10 | ~1-2 min | Low | Quick test |
| 20 | ~3-5 min | Good | Default |
| 30-50 | ~8-15 min | High | Final render |

```bash
# Quick preview
--steps 10

# Production quality
--steps 30
```

### Guidance Scale (CFG)

Controls how strictly the model follows your prompt.

| CFG | Behavior | Example |
|-----|----------|---------|
| 3-5 | Creative, loose | Abstract art |
| 7-8 | Balanced | Default |
| 10-15 | Strict | Precise control |

```bash
# More creative freedom
--guidance-scale 5.0

# Strict prompt following
--cfg 12.0
```

### Resolution

**Note**: Current ONNX models are optimized for 512×512. Custom resolutions may produce artifacts.

```bash
# Standard (recommended)
--width 512 --height 512

# Widescreen (experimental)
--width 768 --height 512

# Portrait (experimental)
--width 512 --height 768
```

## Writing Effective Prompts

### Basic Structure

```
[subject] + [action/context] + [style/medium] + [lighting/mood] + [quality tags]
```

### Examples

**Photorealistic:**
```
"a cat playing with a ball in a sunny garden, photorealistic, 4k, detailed fur"
```

**Digital Art:**
```
"cyberpunk cat with neon lights, digital art, synthwave aesthetic, vibrant colors"
```

**Oil Painting:**
```
"a cat sitting on a windowsill, oil painting style, impressionist, warm lighting"
```

**Fantasy:**
```
"majestic dragon perched on a mountain peak, fantasy art, epic lighting, 8k resolution"
```

### Negative Prompts (Workaround)

While not natively supported, you can guide away from unwanted elements:

```
"a beautiful landscape, no text, no watermark, no signature, high quality"
```

## Using the Java SDK

### Basic Example

```java
import tech.kayys.gollek.sdk.core.GollekSdk;
import tech.kayys.gollek.spi.inference.InferenceRequest;
import tech.kayys.gollek.spi.inference.StreamingInferenceChunk;
import tech.kayys.gollek.spi.model.ModalityType;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

public class SDExample {
    public static void main(String[] args) throws Exception {
        GollekSdk sdk = GollekSdk.builder().local().build();
        
        InferenceRequest request = InferenceRequest.builder()
            .model("CompVis/stable-diffusion-v1-4")
            .prompt("a cat playing ball")
            .parameter("seed", 42L)
            .parameter("steps", 20)
            .parameter("guidance_scale", 7.5f)
            .streaming(true)
            .build();
        
        sdk.streamCompletion(request)
            .subscribe().with(
                chunk -> {
                    if (chunk.modality() == ModalityType.IMAGE) {
                        try {
                            byte[] png = Base64.getDecoder()
                                .decode(chunk.imageDeltaBase64());
                            Files.write(Path.of("output.png"), png);
                            System.out.println("✓ Image saved!");
                        } catch (Exception e) {
                            System.err.println("Failed: " + e.getMessage());
                        }
                    }
                },
                error -> System.err.println("Error: " + error.getMessage()),
                () -> System.out.println("Generation complete!")
            );
    }
}
```

### Advanced SDK Example

```java
// Batch generation with different seeds
List<Long> seeds = List.of(100L, 200L, 300L, 400L, 500L);

for (int i = 0; i < seeds.size(); i++) {
    final long seed = seeds.get(i);
    
    InferenceRequest request = InferenceRequest.builder()
        .model("CompVis/stable-diffusion-v1-4")
        .prompt("a cyberpunk cat with neon lights")
        .parameter("seed", seed)
        .parameter("steps", 30)
        .parameter("guidance_scale", 8.0f)
        .streaming(true)
        .build();
    
    String outputFile = String.format("cat-seed-%d.png", seed);
    CountDownLatch latch = new CountDownLatch(1);
    
    sdk.streamCompletion(request)
        .subscribe().with(
            chunk -> {
                if (chunk.modality() == ModalityType.IMAGE) {
                    byte[] png = Base64.getDecoder()
                        .decode(chunk.imageDeltaBase64());
                    Files.write(Path.of(outputFile), png);
                    System.out.printf("✓ Generated: %s%n", outputFile);
                }
            },
            error -> System.err.printf("✗ Failed (seed %d): %s%n", seed, error.getMessage()),
            latch::countDown
        );
    
    latch.await(); // Wait for completion
}
```

## Troubleshooting

### Model Not Found

```
Checking model: CompVis/stable-diffusion-v1-4... not found locally.
Downloading: [████████████████████] 100% (7234/7234 MB)
```

**Solution**: First run downloads ~7GB. Subsequent runs use cached model at `~/.gollek/models/`.

### Slow Generation

```
[Denoising step 5/20 (25%)...]  ← takes ~10-30 seconds per step
```

**Solutions**:
- Use fewer steps for previews: `--steps 10`
- Apple Silicon: UNet runs on CPU (intentional for stability)
- x86_64: All on CPU, expect slower performance

### VAE Decode Warning

```
[SD-ONNX] VAE decode failed: ... Returning gradient placeholder.
```

**Solution**: Image shows gradient pattern instead of proper output. Check:
- Model files are not corrupted
- Sufficient memory available
- Try default settings: `--steps 20`

### Out of Memory

**Solution**:
- Close other applications
- Use fewer steps
- Ensure swap space is available

## Next Steps

- [Advanced Multimodal AI Pipelines](/docs/tutorials/advanced/multimodal)
- [DiffusionOPD Concepts](/docs/framework/diffusion-opd)
- [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)
- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
- Planned follow-ups: image-to-image, inpainting, ControlNet, and SDXL-specific walkthroughs.

## Resources

- [CLI Reference](/docs/setup/cli-reference)
- [Multimodal SDK Guide](/docs/framework/multimodal-sdk)
- [JBang Examples](https://github.com/gollek-ai/gollek/tree/main/examples/jbang)
- [API Reference](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-multimodal)

---

*Ready to create? Try: `java -jar gollek-runner.jar run --model CompVis/stable-diffusion-v1-4 --branch onnx --prompt "your imagination here"`*
