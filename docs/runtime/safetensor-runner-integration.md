---
layout: default
title: Safetensor Runner Integration
nav_order: 5
---

# Safetensor Runner Integration

Comprehensive Safetensor format support with v2.0 plugin system, multimodal processing, and LibTorch integration.

---

## Overview

The Safetensor runner has been enhanced with v2.0 plugin system features and integrated with multimodal processing capabilities, providing:

- **Type-Safe Operations** - Generic `RunnerResult<T>` with compile-time safety
- **Comprehensive Validation** - Backend health, device check, memory validation
- **Multimodal Processing** - Text, Image, Audio support
- **LibTorch Integration** - Direct Safetensor model loading for LibTorch runner
- **Multi-Device Support** - CPU, CUDA, MPS acceleration
- **Flash Attention** - Optimized attention mechanisms

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              SafetensorRunnerPlugin                     │
│  - RunnerPlugin SPI v2.0                                │
│  - DirectSafetensorBackend                              │
│  - Multimodal Processor                                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         SafetensorMultimodalProcessor                   │
│  - Text processing                                      │
│  - Vision processing (images)                           │
│  - Audio processing                                     │
│  - Streaming support                                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              DirectSafetensorBackend                    │
│  - FFM-based loading                                    │
│  - Sharded model support                                │
│  - LRU caching                                          │
│  - GPU acceleration                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Safetensor Runner Plugin (v2.0)

### Features

- ✅ Comprehensive validation (backend health, device, memory)
- ✅ Lifecycle management (initialize/health/shutdown)
- ✅ Type-safe operations (INFER, EMBED, CLASSIFY)
- ✅ Error handling with specific exceptions
- ✅ Health monitoring with backend details
- ✅ Support for 17+ architectures
- ✅ Multi-device support (CPU, CUDA, MPS)
- ✅ Flash attention support
- ✅ Multimodal processing integration

### Supported Formats

- `.safetensors` - Safetensor format (Hugging Face)
- `.safetensor` - Alternative extension
- `.gguf` - GGUF format (via conversion)
- `.bin` - PyTorch bin format

### Supported Architectures

**Language Models** (14 architectures):
- Llama 2/3/3.1
- Mistral/Mixtral
- Qwen/Qwen2
- Gemma/Gemma2
- Phi/Phi2/Phi3
- Falcon
- BERT

**Vision Models** (3 architectures):
- ViT (Vision Transformer)
- CLIP
- LLaVA

**Audio Models** (1 architecture):
- Whisper

### Usage

```java
@Inject
SafetensorRunnerPlugin runnerPlugin;

// Initialize
RunnerContext context = RunnerContext.empty();
runnerPlugin.initialize(context);

// Validate
RunnerValidationResult validation = runnerPlugin.validate();
if (!validation.isValid()) {
    System.out.println("Validation failed: " + validation.getErrors());
}

// Create request
RunnerRequest request = RunnerRequest.builder()
    .type(RequestType.INFER)
    .inferenceRequest(inferenceRequest)
    .build();

// Execute
RunnerResult<InferenceResponse> result = 
    runnerPlugin.execute(request, context);

if (result.isSuccess()) {
    InferenceResponse response = result.getData();
    System.out.println("Generated: " + response.getContent());
}
```

---

## Multimodal Processing

### SafetensorMultimodalProcessor

**File**: `plugins/runner/safetensor/gollek-plugin-runner-safetensor/.../multimodal/SafetensorMultimodalProcessor.java`

**Features**:
- ✅ Text-only inference
- ✅ Text + Image inference (Vision-Language)
- ✅ Text + Audio inference
- ✅ Multi-image inference
- ✅ Streaming multimodal responses
- ✅ Input validation
- ✅ Capability reporting

### Supported Modalities

| Modality | Support | Description |
|----------|---------|-------------|
| **TEXT** | ✅ Always | Text prompts and responses |
| **IMAGE** | ✅ Vision enabled | Image analysis, VQA, captioning |
| **AUDIO** | ✅ Audio enabled | Speech recognition, audio analysis |

### Usage

```java
@Inject
SafetensorMultimodalProcessor processor;

// Create multimodal request with text and image
MultimodalRequest request = MultimodalRequest.builder()
    .model("llava-1.5")
    .addInput(MultimodalContent.ofText("What's in this image?"))
    .addInput(MultimodalContent.ofImageUri(
        "http://example.com/image.jpg", 
        "image/jpeg"))
    .build();

// Process
Uni<MultimodalResponse> response = processor.process(request);

// Subscribe
response.subscribe().with(r -> {
    System.out.println(r.getChoices().get(0)
        .getMessage().getContent());
});
```

### Streaming Multimodal

```java
@Inject
SafetensorMultimodalProcessor processor;

MultimodalRequest request = MultimodalRequest.builder()
    .model("llava-1.5")
    .addInput(MultimodalContent.ofText("Describe this image"))
    .addInput(MultimodalContent.ofImageUri(
        "http://example.com/image.jpg", 
        "image/jpeg"))
    .outputConfig(MultimodalRequest.OutputConfig.builder()
        .stream(true)
        .build())
    .build();

// Process with streaming
Multi<MultimodalResponse> stream = processor.processStream(request);

// Subscribe to stream
stream.subscribe().with(chunk -> {
    System.out.print(chunk.getChoices().get(0)
        .getDelta().getContent());
});
```

---

## LibTorch-Safetensor Integration

### Overview

The LibTorch runner can now load and execute Safetensor models directly, providing seamless integration between Safetensor format and LibTorch backend.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│              LibTorchRunnerPlugin                       │
│  - @Inject LibTorchSafetensorIntegration                │
│  - supportsFormat(".safetensors")                       │
│  - loadSafetensorModel(Path)                            │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         LibTorchSafetensorIntegration                   │
│  - @Inject SafetensorLoaderFacade                       │
│  - @Inject SafetensorShardLoader                        │
│  - convertToLibTorch()                                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Safetensor Loader                          │
│  - SafetensorFFMLoader (FFM API)                        │
│  - SafetensorShardLoader (sharded models)               │
│  - SafetensorLoadCache (LRU caching)                    │
└─────────────────────────────────────────────────────────┘
```

### Features

- ✅ Load Safetensor models directly
- ✅ Convert Safetensor weights to LibTorch tensors
- ✅ Execute inference using LibTorch backend
- ✅ Support sharded Safetensor models
- ✅ Model metadata extraction
- ✅ Format detection

### Usage

```java
@Inject
LibTorchRunnerPlugin runner;

// Load Safetensor model
Path modelPath = Path.of("/models/llama3-8b.safetensors");

// Check if Safetensor model
if (runner.isSafetensorModel(modelPath)) {
    // Load Safetensor model
    LibTorchModule module = runner.loadSafetensorModel(modelPath);
    
    System.out.println("Loaded " + module.getTensorCount() + " tensors");
    System.out.println("Total size: " + 
        module.totalWeightSizeBytes() + " bytes");
    
    // Get specific weight
    LibTorchTensor weight = module.getWeight("lm_head.weight");
    System.out.println("Weight shape: " + 
        Arrays.toString(weight.getShape()));
    System.out.println("Weight dtype: " + weight.getDtype());
}
```

### Sharded Model Support

```java
@Inject
LibTorchSafetensorIntegration integration;

public void loadShardedModel() {
    Path modelDir = Path.of("/models/llama3-70b");
    
    // Load sharded Safetensor model
    LibTorchModule module = 
        integration.loadShardedSafetensorModel(modelDir);
    
    System.out.println("Loaded sharded model");
    System.out.println("Tensors: " + module.getTensorCount());
    System.out.println("Size: " + module.totalWeightSizeBytes() + " bytes");
}
```

### Model Metadata

```java
@Inject
LibTorchSafetensorIntegration integration;

public void getModelMetadata() {
    Path modelPath = Path.of("/models/llama3-8b.safetensors");
    
    Map<String, Object> metadata = 
        integration.getSafetensorMetadata(modelPath);
    
    System.out.println("Format: " + metadata.get("format"));
    System.out.println("Sharded: " + metadata.get("sharded"));
    System.out.println("Tensor count: " + metadata.get("tensor_count"));
    System.out.println("Valid: " + metadata.get("valid"));
}
```

---

## Configuration

### Safetensor Runner Config

```yaml
gollek:
  runners:
    safetensor-runner:
      enabled: true
      backend: direct  # or "gguf-conversion"
      device: cuda     # or "cpu", "mps"
      dtype: f16       # or "f32", "int8"
      max_context: 4096
      flash_attention: true
```

### Multimodal Processor Config

```yaml
gollek:
  multimodal:
    safetensor:
      vision_enabled: true
      audio_enabled: true
      max_images: 4
      max_audio_duration_sec: 300
```

### LibTorch-Safetensor Config

```yaml
gollek:
  runners:
    libtorch:
      safetensor:
        enabled: true
        cache_enabled: true
        cache_size: 100
```

---

## Health Monitoring

### Runner Health

```java
@Inject
SafetensorRunnerPlugin runnerPlugin;

public void checkHealth() {
    RunnerHealth health = runnerPlugin.health();
    
    if (health.isHealthy()) {
        Map<String, Object> details = health.getDetails();
        System.out.println("Backend: " + details.get("backend"));
        System.out.println("Device: " + details.get("device"));
        System.out.println("Dtype: " + details.get("dtype"));
        System.out.println("Flash Attention: " + 
            details.get("flash_attention"));
        System.out.println("Active Sessions: " + 
            details.get("active_sessions"));
    } else {
        System.out.println("Unhealthy: " + health.getMessage());
    }
}
```

### Multimodal Capabilities

```java
@Inject
SafetensorMultimodalProcessor processor;

public void checkCapabilities() {
    Map<String, Object> capabilities = processor.getCapabilities();
    
    System.out.println("Processor: " + 
        capabilities.get("processor_id"));
    System.out.println("Vision Enabled: " + 
        capabilities.get("vision_enabled"));
    System.out.println("Audio Enabled: " + 
        capabilities.get("audio_enabled"));
    System.out.println("Available: " + 
        capabilities.get("available"));
}
```

---

## Performance

### Load Times

| Model | Format | Size | Load Time |
|-------|--------|------|-----------|
| Llama-3-8B | Safetensor | 16 GB | ~2s (mmap) |
| Llama-3-70B | Safetensor (sharded) | 140 GB | ~10s (mmap) |
| LLaVA-1.5 | Safetensor | 8 GB | ~1s (mmap) |

### Memory Usage

| Feature | Memory Overhead |
|---------|----------------|
| Single model load | Base size |
| Sharded model | Base size + index |
| LRU cache (100 models) | ~10x base size |
| Multimodal processing | +100-500 MB |

---

## Testing

### Unit Test

```java
@QuarkusTest
public class SafetensorRunnerPluginTest {
    
    @Inject
    SafetensorRunnerPlugin runnerPlugin;
    
    @Test
    public void testValidation() {
        RunnerValidationResult result = runnerPlugin.validate();
        assertTrue(result.isValid());
    }
    
    @Test
    public void testHealth() {
        RunnerHealth health = runnerPlugin.health();
        assertTrue(health.isHealthy());
    }
    
    @Test
    public void testInference() {
        RunnerRequest request = RunnerRequest.builder()
            .type(RequestType.INFER)
            .inferenceRequest(inferenceRequest)
            .build();
        
        RunnerResult<InferenceResponse> result = 
            runnerPlugin.execute(request, RunnerContext.empty());
        
        assertTrue(result.isSuccess());
    }
}
```

### Multimodal Test

```java
@QuarkusTest
public class SafetensorMultimodalTest {
    
    @Inject
    SafetensorMultimodalProcessor processor;
    
    @Test
    public void testMultimodalInference() {
        MultimodalRequest request = MultimodalRequest.builder()
            .model("llava-1.5")
            .addInput(MultimodalContent.ofText("What's in this image?"))
            .addInput(MultimodalContent.ofImageUri(
                "http://example.com/image.jpg", 
                "image/jpeg"))
            .build();
        
        Uni<MultimodalResponse> response = processor.process(request);
        
        assertNotNull(response);
        response.subscribe().with(r -> {
            assertNotNull(r.getChoices());
            assertFalse(r.getChoices().isEmpty());
        });
    }
}
```

### LibTorch-Safetensor Test

```java
@QuarkusTest
public class LibTorchSafetensorIntegrationTest {
    
    @Inject
    LibTorchSafetensorIntegration integration;
    
    @Test
    public void testLoadSafetensorModel() {
        Path modelPath = Path.of("/test/models/test.safetensors");
        
        LibTorchModule module = 
            integration.loadSafetensorModel(modelPath);
        
        assertNotNull(module);
        assertTrue(module.getTensorCount() > 0);
    }
    
    @Test
    public void testIsSafetensorModel() {
        Path safetensorPath = Path.of("/test/models/test.safetensors");
        Path torchPath = Path.of("/test/models/test.pt");
        
        assertTrue(integration.isSafetensorModel(safetensorPath));
        assertFalse(integration.isSafetensorModel(torchPath));
    }
}
```

---

## Resources

- **[Enhanced Plugin System v2.0](/docs/plugins/enhanced-plugin-system-v2)** - Complete v2.0 documentation
- **[Enhanced Runner Plugins](/docs/plugins/enhanced-runner-plugin-architecture)** - Runner plugin v2.0
- **[Multimodal Core](/docs/framework/multimodal-sdk)** - Multimodal inference guide
- **[LibTorch Runner](/docs/plugins/runner-plugins#libtorch-runner)** - LibTorch runner documentation

---

[Back to Plugin System](/docs/plugins/enhanced-plugin-system-v2) &nbsp; [Runner Plugins](/docs/plugins/runner-plugins) &nbsp; [Multimodal](/docs/framework/multimodal-sdk)
