---
layout: default
title: Model Quantization - GPTQ, INT8, FP8
---

# Model Quantization

For the guided landing page that groups strategy selection, Java integration,
and REST usage in one place, start with
[Quantization Docs](/docs/framework/quantization-docs).

Reduce model size by 4-8x with minimal quality loss using Gollek's quantization engine supporting GPTQ (INT4), INT8, and FP8 strategies.

---

## Overview

The `gollek-safetensor-quantization` module provides production-ready model quantization with:

- **GPTQ (INT4)**: 4-bit quantization with 8x compression
- **INT8**: 8-bit integer quantization with 4x compression
- **FP8**: 8-bit floating point for GPU tensor cores
- **SafeTensors Format**: Secure, fast, memory-mappable storage
- **REST API**: HTTP endpoints for quantization operations

---

## Quick Start

### Programmatic Quantization

```java
@Inject
QuantizationEngine quantizationEngine;

public void quantizeModel() {
    Path inputPath = Paths.get("/models/llama3-8b-fp16");
    Path outputPath = Paths.get("/models/llama3-8b-int4");
    
    // Use default INT4 GPTQ configuration
    QuantConfig config = QuantConfig.int4Gptq();
    
    QuantResult result = quantizationEngine.quantize(
        inputPath, 
        outputPath, 
        QuantizationEngine.QuantStrategy.INT4,
        config
    );
    
    if (result.isSuccess()) {
        System.out.println("Original size: " + 
            QuantStats.formatSize(result.getStats().getOriginalSizeBytes()));
        System.out.println("Quantized size: " + 
            QuantStats.formatSize(result.getStats().getQuantizedSizeBytes()));
        System.out.println("Compression ratio: " + 
            result.getStats().getCompressionRatio() + "x");
    }
}
```

### Advanced Configuration

```java
QuantConfig config = QuantConfig.builder()
    .strategy(QuantizationEngine.QuantStrategy.INT4)
    .groupSize(128)           // Group size for GPTQ
    .bits(4)                  // Target bit width
    .symmetric(false)         // Asymmetric quantization
    .perChannel(true)         // Per-channel scaling
    .actOrder(false)          // Static ordering
    .dampPercent(0.01)        // Hessian dampening
    .numSamples(128)          // Calibration samples
    .seqLen(2048)             // Sequence length
    .build();
```

### Streaming Progress

```java
public void quantizeWithProgress() {
    Path inputPath = Paths.get("/models/llama3-8b");
    Path outputPath = Paths.get("/models/llama3-8b-int4");
    
    QuantConfig config = QuantConfig.int4Gptq();
    
    quantizationEngine.quantizeWithProgress(
        inputPath, 
        outputPath, 
        QuantizationEngine.QuantStrategy.INT4,
        config
    ).subscribe().with(
        event -> {
            if (event instanceof QuantizationEngine.QuantProgress progress) {
                System.out.printf("Progress: %s (%.1f%%)%n", 
                    progress.message(), progress.percentComplete());
            } else if (event instanceof QuantResult result) {
                System.out.println("Complete: " + result.isSuccess());
            }
        },
        error -> System.err.println("Failed: " + error.getMessage())
    );
}
```

---

## Quantization Strategies

### INT4 (GPTQ)

**Best for**: Maximum compression, CPU inference

| Parameter | Default | Description |
|-----------|---------|-------------|
| **bits** | 4 | Bit width |
| **groupSize** | 128 | Group size for quantization |
| **symmetric** | false | Asymmetric quantization |
| **perChannel** | true | Per-channel scaling |
| **actOrder** | false | Activation ordering |
| **dampPercent** | 0.01 | Hessian dampening |

**Compression**: ~8x
**Quality Loss**: Low-Medium
**Best Use Case**: Large models (7B+ parameters)

```java
QuantConfig config = QuantConfig.int4Gptq();
```

### INT8

**Best for**: Balanced compression/quality

| Parameter | Default | Description |
|-----------|---------|-------------|
| **bits** | 8 | Bit width |
| **perChannel** | true | Per-channel scaling |
| **symmetric** | false | Asymmetric quantization |

**Compression**: ~4x
**Quality Loss**: Very Low
**Best Use Case**: Production inference

```java
QuantConfig config = QuantConfig.int8();
```

### FP8

**Best for**: GPU with FP8 tensor cores (H100, MI300)

| Parameter | Default | Description |
|-----------|---------|-------------|
| **bits** | 8 | Bit width |
| **symmetric** | true | Symmetric quantization |
| **format** | E4M3 | FP8 format (E4M3 or E5M2) |

**Compression**: ~4x
**Quality Loss**: Minimal
**Best Use Case**: GPU inference on H100/MI300

```java
QuantConfig config = QuantConfig.fp8();
```

---

## Strategy Selection Guide

### By Model Size

| Model Size | Recommended | Alternative |
|------------|-------------|-------------|
| **< 3B** | INT8 | INT4 |
| **3B - 7B** | INT4 | INT8 |
| **7B - 13B** | INT4 | FP8 (GPU) |
| **13B - 70B** | INT4 | INT4 + VAD |
| **> 70B** | INT4 | Split quantization |

### By Use Case

| Use Case | Recommended | Reason |
|----------|-------------|--------|
| **CPU Inference** | INT4 | Maximum compression |
| **GPU (H100)** | FP8 | Tensor core acceleration |
| **GPU (A100)** | INT8 | Good balance |
| **Edge Devices** | INT4 | Minimal memory |
| **Production** | INT8 | Best quality/speed |
| **Testing** | INT8 | Fast quantization |

### By Quality Requirement

| Quality Need | Strategy | Compression |
|--------------|----------|-------------|
| **Maximum** | FP8 | 4x |
| **High** | INT8 | 4x |
| **Medium** | INT4 (group=128) | 8x |
| **Low** | INT4 (group=64) | 10x |

---

## REST API

### Quantize Model

```bash
curl -X POST http://localhost:8080/api/v1/quantization/quantize \
  -H "Content-Type: application/json" \
  -d '{
    "input_path": "/models/llama3-8b-fp16",
    "output_path": "/models/llama3-8b-int4",
    "strategy": "INT4",
    "bits": 4,
    "group_size": 128,
    "symmetric": false,
    "per_channel": true,
    "act_order": false,
    "damp_percent": 0.01,
    "num_samples": 128,
    "seq_len": 2048
  }'
```

**Response:**
```json
{
  "success": true,
  "output_path": "/models/llama3-8b-int4",
  "original_size": "16.00 GB",
  "quantized_size": "4.00 GB",
  "compression_ratio": 4.0,
  "duration_ms": 125000,
  "tensor_count": 256,
  "param_count": 8000000000,
  "avg_quant_error_mse": 0.0001,
  "strategy": "INT4"
}
```

### Streaming Quantization

```bash
curl -X POST http://localhost:8080/api/v1/quantization/quantize/stream \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "input_path": "/models/llama3-8b",
    "output_path": "/models/llama3-8b-int4",
    "strategy": "INT4"
  }'
```

**SSE Events:**
```
data: {"type":"progress","tensor_name":"model.layers.0.self_attn.q_proj.weight","current_tensor":1,"total_tensors":256,"percent_complete":0.39,"phase":"QUANTIZING","message":"Quantizing tensor 1/256"}

data: {"type":"progress","tensor_name":"model.layers.1.mlp.gate_proj.weight","current_tensor":45,"total_tensors":256,"percent_complete":17.58,"phase":"QUANTIZING"}

data: {"type":"complete","success":true,"output_path":"/models/llama3-8b-int4","stats":{"original_size":"16.00 GB","quantized_size":"4.00 GB","compression_ratio":4.0}}
```

### Get Recommendation

```bash
curl "http://localhost:8080/api/v1/quantization/recommend?model_size_gb=7&prioritize_quality=false"
```

**Response:**
```json
{
  "recommended_strategy": "INT4",
  "description": "Best for large models requiring maximum compression with acceptable quality loss",
  "model_size_gb": 7.0,
  "prioritize_quality": false
}
```

### List Strategies

```bash
curl http://localhost:8080/api/v1/quantization/strategies
```

**Response:**
```json
{
  "strategies": [
    {
      "name": "INT4",
      "description": "4-bit integer quantization using GPTQ",
      "bits": 4,
      "best_for": "CPU inference with maximum compression",
      "compression_ratio": "~8x",
      "quality_loss": "Low to Medium"
    },
    {
      "name": "INT8",
      "description": "8-bit integer quantization with per-channel scaling",
      "bits": 8,
      "best_for": "Balanced CPU/GPU inference",
      "compression_ratio": "~4x",
      "quality_loss": "Very Low"
    },
    {
      "name": "FP8",
      "description": "8-bit floating point quantization (E4M3/E5M2)",
      "bits": 8,
      "best_for": "GPU inference with FP8 tensor cores (H100, MI300)",
      "compression_ratio": "~4x",
      "quality_loss": "Minimal"
    }
  ]
}
```

---

## Loading Quantized Models

### Load in Inference Engine

```java
@Inject
DirectInferenceEngine engine;

public void loadQuantizedModel() {
    Path quantizedPath = Paths.get("/models/llama3-8b-int4");
    
    String modelKey = engine.loadQuantizedModel(
        quantizedPath, 
        QuantizationEngine.QuantStrategy.INT4
    );
    
    System.out.println("Loaded quantized model: " + modelKey);
}
```

### Hot-Swap Quantized Model

```java
@Inject
ModelHotSwapManager hotSwapManager;

public void upgradeToQuantized() {
    Path oldPath = Paths.get("/models/llama3-8b-fp16");
    Path newPath = Paths.get("/models/llama3-8b-int4");
    
    hotSwapManager.beginSwap("llama3-8b", oldPath, newPath, null)
        .subscribe().with(
            event -> System.out.println("Swap: " + event.message()),
            error -> System.err.println("Swap failed: " + error)
        );
}
```

---

## Performance Benchmarks

### Quantization Time

| Model Size | INT4 | INT8 | FP8 |
|------------|------|------|-----|
| **3B** | ~30s | ~15s | ~20s |
| **7B** | ~90s | ~45s | ~60s |
| **13B** | ~180s | ~90s | ~120s |
| **70B** | ~900s | ~450s | ~600s |

*Times approximate on NVIDIA A100 GPU*

### Memory Requirements

| Strategy | Memory During Quantization |
|----------|---------------------------|
| **INT4** | ~1.5x model size |
| **INT8** | ~1.3x model size |
| **FP8** | ~1.4x model size |

### Inference Performance

| Strategy | CPU Speedup | GPU Speedup | Memory Reduction |
|----------|-------------|-------------|------------------|
| **INT4** | 2-3x | 1.5-2x | 75% |
| **INT8** | 1.5-2x | 1.3-1.8x | 50% |
| **FP8** | N/A | 2-3x (H100) | 50% |

---

## Configuration Reference

### QuantConfig Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **strategy** | QuantStrategy | INT4 | Quantization strategy |
| **bits** | int | 4 | Target bit width (1-8) |
| **groupSize** | int | 128 | Group size for group-wise quantization |
| **symmetric** | boolean | false | Use symmetric quantization |
| **perChannel** | boolean | true | Per-channel vs per-tensor scaling |
| **actOrder** | boolean | false | Use activation ordering (GPTQ) |
| **dampPercent** | double | 0.01 | Hessian dampening for stability |
| **numSamples** | int | 128 | Number of calibration samples |
| **seqLen** | int | 2048 | Sequence length for calibration |
| **descAct** | boolean | false | Use descending activation order |

### Application Properties

```properties
# Quantization defaults
gollek.quantization.strategy=INT4
gollek.quantization.group-size=128
gollek.quantization.bits=4
gollek.quantization.num-samples=128
gollek.quantization.seq-len=2048
```

---

## Troubleshooting

### Common Issues

**Out of Memory During Quantization**
- Reduce `numSamples` in configuration
- Use smaller `seqLen`
- Ensure sufficient GPU memory
- Process model in smaller chunks

**Poor Quality After Quantization**
- Try INT8 instead of INT4
- Increase `groupSize` for INT4
- Enable `actOrder` for better accuracy
- Use FP8 if hardware supports it

**Slow Quantization**
- Use GPU acceleration when available
- Reduce `numSamples` for faster calibration
- Consider INT8 for faster processing
- Check thermal throttling

**Model Won't Load After Quantization**
- Verify SafeTensors format is correct
- Check quantization strategy matches loading code
- Ensure all weight files are present
- Validate model integrity with checksum

---

## Examples

### Quantize Llama 3 8B

```java
public void quantizeLlama3() {
    Path inputPath = Paths.get("/models/Llama-3-8B-Instruct");
    Path outputPath = Paths.get("/models/Llama-3-8B-Instruct-INT4");
    
    QuantConfig config = QuantConfig.builder()
        .strategy(QuantizationEngine.QuantStrategy.INT4)
        .groupSize(128)
        .bits(4)
        .actOrder(true)
        .dampPercent(0.01)
        .build();
    
    QuantResult result = quantizationEngine.quantize(
        inputPath, 
        outputPath, 
        QuantizationEngine.QuantStrategy.INT4,
        config
    ).await().indefinitely();
    
    if (result.isSuccess()) {
        System.out.println("✓ Quantization complete");
        System.out.println("Compression: " + 
            result.getStats().getCompressionRatio() + "x");
    }
}
```

### Batch Quantization

```java
public void quantizeMultipleModels() {
    List<ModelConfig> models = List.of(
        new ModelConfig("llama3-8b", "INT4"),
        new ModelConfig("mistral-7b", "INT8"),
        new ModelConfig("phi3-mini", "FP8")
    );
    
    for (ModelConfig model : models) {
        Path inputPath = Paths.get("/models/" + model.name);
        Path outputPath = Paths.get("/models/" + model.name + "-" + model.strategy);
        
        QuantConfig config = getConfigForStrategy(model.strategy);
        QuantizationEngine.QuantStrategy strategy = 
            QuantizationEngine.QuantStrategy.valueOf(model.strategy);
        
        QuantResult result = quantizationEngine.quantize(
            inputPath, 
            outputPath, 
            strategy,
            config
        ).await().indefinitely();
        
        System.out.printf("%s: %s%n", 
            model.name, 
            result.isSuccess() ? "✓ Success" : "✗ Failed");
    }
}

private QuantConfig getConfigForStrategy(String strategy) {
    return switch (strategy) {
        case "INT4" -> QuantConfig.int4Gptq();
        case "INT8" -> QuantConfig.int8();
        case "FP8" -> QuantConfig.fp8();
        default -> new QuantConfig();
    };
}

record ModelConfig(String name, String strategy) {}
```

---

## Next Steps

- [Audio Processing Docs](/docs/framework/audio-processing-docs) - Whisper STT and SpeechT5 TTS
- [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs) - Hardware acceleration
- [Developer Guidance](/docs/dev-log/developer-guidance) - Best practices
- [Examples Docs](/docs/setup/examples-docs) - More example routes and runnable entrypoints

---

[Back to Docs](/docs/) &nbsp; [Runtime Core API](/docs/runtime/core-api)
