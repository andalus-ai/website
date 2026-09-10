---
layout: default
title: Extension Features
---

# Extension Features

Current Gollek naming uses **extensions** for installable external packages and **plugins** for low-level runtime or built-in modules. This page is kept as historical plugin architecture background; for the current extension workflow, start with [Gollek Extensions](/docs/extensions/).

Domain-specific features can be exposed by extensions or plugins, enabling modular deployment of capabilities like audio, vision, OCR, training, quantization, and text processing.

---

## Overview

The Feature Plugin system provides a **two-level plugin architecture**:

```
Level 1: Runner Plugin (GGUF, Safetensor, ONNX, etc.)
    ↓
Level 2: Feature Plugins (Audio, Vision, Text, etc.)
```

This enables:
- **Selective Deployment**: Deploy only needed features
- **Fine-grained Control**: Enable/disable specific capabilities
- **Resource Optimization**: Load only required models
- **Independent Updates**: Update features independently

---

## Available Feature Plugins

### Safetensor Feature Plugins

| Feature | Capabilities | Models | Size |
|---------|-------------|--------|------|
| **Audio** | STT, TTS, Audio Processing | Whisper, SpeechT5, Wav2Vec2 | ~52 MB |
| **Vision** | Classification, Detection, VQA | CLIP, ViT, DETR, LLaVA | ~800 MB |
| **Text** | LLM, Classification, NER | Llama, Mistral, BERT | ~15 GB |

### GGUF Feature Plugins

| Feature | Capabilities | Models | Size |
|---------|-------------|--------|------|
| **Text** | Completion, Chat, Code | Llama, Mistral, Mixtral | 4-16 GB |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Runner Plugin                              │
│  (SafetensorRunner, GGUFRunner, etc.)                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         Feature Plugin Manager                          │
│  - Feature discovery                                    │
│  - Enable/disable control                               │
│  - Request routing                                      │
│  - Health monitoring                                    │
└─────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ AudioFeature     │ │ VisionFeature    │ │ TextFeature      │
│ Plugin           │ │ Plugin           │ │ Plugin           │
│                  │ │                  │ │                  │
│ Whisper          │ │ CLIP             │ │ Llama            │
│ SpeechT5         │ │ ViT              │ │ Mistral          │
│ Audio Processing │ │ DETR             │ │ BERT             │
└──────────────────┘ └──────────────────┘ └──────────────────┘
        ↓                   ↓                   ↓
┌─────────────────────────────────────────────────────────┐
│           Existing Engine Modules                       │
│  (WhisperEngine, LlamaCppRunner, etc.)                  │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Installation

#### Step 1: Build Feature Plugins

```bash
# Safetensor feature plugins
cd inference-gollek/plugins/runner/safetensor
mvn clean install -Pinstall-plugin

# GGUF feature plugins
cd inference-gollek/plugins/runner/gguf
mvn clean install -Pinstall-plugin
```

This installs feature plugins to `~/.gollek/plugins/runners/`

#### Step 2: Configure Features

Create `~/.gollek/plugins/runners/runner-config.json`:

```json
{
  "safetensor-runner": {
    "features": {
      "audio": {
        "enabled": true,
        "default_model": "whisper-large-v3",
        "language": "en",
        "task": "transcribe"
      },
      "vision": {
        "enabled": false
      },
      "text": {
        "enabled": true,
        "default_model": "llama-3-8b"
      }
    }
  },
  "gguf-runner": {
    "features": {
      "text": {
        "enabled": true,
        "default_model": "llama-3-8b",
        "temperature": 0.7
      }
    }
  }
}
```

---

## Usage Examples

### Example 1: Direct Feature Usage

```java
@Inject
AudioFeaturePlugin audioFeature;

// Transcribe audio
byte[] audio = loadAudio("speech.wav");
Uni<String> transcription = (Uni<String>) audioFeature.process(audio);

transcription.subscribe().with(
    text -> System.out.println("Transcription: " + text),
    error -> error.printStackTrace()
);
```

### Example 2: Via Feature Manager

```java
@Inject
FeaturePluginManager featureManager;

// Process through specific feature
byte[] audio = loadAudio("speech.wav");
Object result = featureManager.process("audio-feature", audio);

// Auto-select feature based on input type
Object result2 = featureManager.processAuto(imageData, "image/png");
```

### Example 3: Via Runner Plugin Registry

```java
@Inject
RunnerPluginRegistry runnerRegistry;

// Create session with specific features enabled
Map<String, Object> config = Map.of(
    "features", Map.of(
        "audio", Map.of("enabled", true),
        "vision", Map.of("enabled", false),
        "text", Map.of("enabled", true)
    )
);

Optional<RunnerSession> session = runnerRegistry.createSession(
    "whisper-large-v3.safetensors",
    config
);

// Execute inference
InferenceResponse response = session.get()
    .infer(request)
    .await()
    .atMost(Duration.ofSeconds(30));
```

### Example 4: Multi-Modal (LLaVA)

```java
// Enable both vision and text features for LLaVA
Map<String, Object> config = Map.of(
    "features", Map.of(
        "vision", Map.of("enabled", true),
        "text", Map.of("enabled", true)
    )
);

Optional<RunnerSession> session = runnerRegistry.createSession(
    "llava-13b.safetensors",
    config
);

// Visual question answering
byte[] image = loadImage("diagram.png");
String question = "What does this diagram show?";

VQAInput input = new VQAInput(image, question);
Object result = session.get().infer(input).await();
```

---

## Configuration Reference

### Safetensor Feature Configuration

```yaml
gollek:
  runners:
    safetensor-runner:
      enabled: true
      backend: direct
      device: cuda
      dtype: f16
      
      features:
        audio:
          enabled: true
          default_model: whisper-large-v3
          language: en
          task: transcribe  # or translate
          whisper:
            beam_size: 5
            temperature: 0.0
            vad_enabled: true
          speecht5:
            voice: alloy
            speed: 1.0
        
        vision:
          enabled: true
          default_model: clip-vit-large
          max_image_size: 2048
          clip:
            projection_dim: 768
          detr:
            score_threshold: 0.5
        
        text:
          enabled: true
          default_model: llama-3-8b
          max_context: 4096
          temperature: 0.7
          top_p: 0.9
```

### GGUF Feature Configuration

```yaml
gollek:
  runners:
    gguf-runner:
      enabled: true
      n_gpu_layers: -1
      n_ctx: 4096
      flash_attention: true
      
      features:
        text:
          enabled: true
          default_model: llama-3-8b
          temperature: 0.7
          max_tokens: 2048
          top_p: 0.9
          frequency_penalty: 0.0
          presence_penalty: 0.0
```

---

## Deployment Scenarios

### Scenario 1: Audio-Only Service (Safetensor)

**Use Case**: Speech transcription service

**Configuration**:
```yaml
gollek:
  runners:
    safetensor-runner:
      enabled: true
      features:
        audio:
          enabled: true
        vision:
          enabled: false
        text:
          enabled: false
```

**Size**: ~52 MB (97.5% reduction vs full deployment)

**Components**: WhisperEngine + SpeechT5Engine + AudioFeaturePlugin

---

### Scenario 2: LLM Service (GGUF)

**Use Case**: Text generation service

**Configuration**:
```yaml
gollek:
  runners:
    gguf-runner:
      enabled: true
      features:
        text:
          enabled: true
          default_model: llama-3-8b
          quantization: q4_k_m
```

**Size**: ~6 GB (Llama-3-8B Q4_K_M)

**Components**: LlamaCppRunner + TextFeaturePlugin

---

### Scenario 3: Multi-Modal Service (LLaVA)

**Use Case**: Visual question answering

**Configuration**:
```yaml
gollek:
  runners:
    safetensor-runner:
      enabled: true
      features:
        audio:
          enabled: false
        vision:
          enabled: true
        text:
          enabled: true  # For LLM component
```

**Size**: ~15 GB

**Components**: VisionFeaturePlugin + TextFeaturePlugin + LLaVA

---

### Scenario 4: Full-Featured Development

**Use Case**: Development/testing environment

**Configuration**:
```yaml
gollek:
  runners:
    safetensor-runner:
      enabled: true
      features:
        audio:
          enabled: true
        vision:
          enabled: true
        text:
          enabled: true
```

**Size**: ~20 GB

**Components**: All features

---

## Feature Plugin SPI

### Creating a Custom Feature Plugin

```java
public class CustomFeaturePlugin implements SafetensorFeaturePlugin {
    
    @Override
    public String id() {
        return "custom-feature";
    }
    
    @Override
    public String name() {
        return "Custom Processing";
    }
    
    @Override
    public String description() {
        return "Custom feature for specialized processing";
    }
    
    @Override
    public Set<String> supportedModels() {
        return Set.of("custom-model-v1", "custom-model-v2");
    }
    
    @Override
    public boolean isAvailable() {
        // Check if required resources are available
        return customEngine != null && customEngine.isHealthy();
    }
    
    @Override
    public Object process(Object input) {
        // Custom processing logic
        return processCustom(input);
    }
    
    // ... other methods
}
```

### Feature Plugin Interface Methods

```java
public interface SafetensorFeaturePlugin {
    String id();
    String name();
    String version();
    String description();
    void initialize(Map<String, Object> config);
    boolean isAvailable();
    int priority();
    Set<String> supportedModels();
    Set<String> supportedInputTypes();
    Set<String> supportedOutputTypes();
    Object process(Object input);
    Map<String, Object> metadata();
    void shutdown();
    boolean isHealthy();
}
```

---

## Monitoring

### Health Checks

```bash
# Get feature health status
curl http://localhost:8080/api/v1/runners/safetensor-runner/features/health

# Response:
{
  "audio-feature": {
    "healthy": true,
    "whisper_available": true,
    "speecht5_available": true
  },
  "vision-feature": {
    "healthy": true,
    "clip_available": true
  },
  "text-feature": {
    "healthy": true,
    "llama_available": true
  }
}
```

### Metrics

```bash
# Get feature statistics
curl http://localhost:8080/api/v1/runners/safetensor-runner/features/stats

# Response:
{
  "initialized": true,
  "total_features": 3,
  "enabled_features": 2,
  "available_features": 3,
  "features": [
    {
      "id": "audio-feature",
      "name": "Audio Processing",
      "version": "1.0.0",
      "enabled": true,
      "available": true,
      "healthy": true,
      "models": ["whisper-large-v3", "speecht5-tts"]
    }
  ]
}
```

---

## Performance

### Safetensor Feature Performance

| Feature | Task | Latency | Memory |
|---------|------|---------|--------|
| Audio | STT (30s audio) | 2-5s | 2 GB |
| Audio | TTS (100 chars) | 500ms | 1 GB |
| Vision | Classification | 100ms | 1.5 GB |
| Vision | VQA | 2-3s | 3 GB |
| Text | Generation | 50ms/token | 8-16 GB |

### GGUF Feature Performance

| Model | Quantization | Tokens/s | VRAM |
|-------|--------------|----------|------|
| Llama-3-8B | Q4_K_M | 220 | 6 GB |
| Llama-3-8B | Q8_0 | 180 | 10 GB |
| Llama-3-8B | FP16 | 150 | 16 GB |
| Mixtral-8x7B | Q4_K_M | 120 | 28 GB |

---

## Troubleshooting

### Feature Not Available

```
Error: Audio feature is not available
```

**Solution**:
1. Check if feature is enabled in configuration
2. Verify model files exist: `ls ~/.gollek/models/`
3. Check backend health: `curl /api/v1/runners/safetensor-runner/features/health`
4. Check logs: `tail -f ~/.gollek/logs/gollek.log | grep audio`

### Feature Plugin Not Found

```
Error: No producer found for AudioFeaturePlugin
```

**Solution**:
1. Ensure feature plugin JAR is in `~/.gollek/plugins/runners/`
2. Check CDI bean discovery mode in `beans.xml`
3. Verify `FeaturePluginProducer` is in classpath
4. Restart the engine

### Model Not Found

```
Error: Model whisper-large-v3 not found
```

**Solution**:
1. Download model: `gollek-cli model download whisper-large-v3`
2. Verify model path in configuration
3. Check model file permissions: `ls -la ~/.gollek/models/`

### Out of Memory

```
Error: CUDA out of memory
```

**Solution**:
1. Disable unused features in configuration
2. Reduce model size or use quantization
3. Reduce `max_context` or batch size
4. Enable memory-efficient attention

---

## Creating Feature Plugins

### Step 1: Create Plugin Structure

```bash
mkdir -p gollek-plugin-feature-custom/src/main/java/tech/kayys/gollek/plugin/runner/safetensor/feature/custom
```

### Step 2: Implement Feature Plugin

```java
package tech.kayys.gollek.plugin.runner.safetensor.feature.custom;

public class CustomFeaturePlugin implements SafetensorFeaturePlugin {
    // Implement interface methods
}
```

### Step 3: Create POM

```xml
<project>
    <artifactId>gollek-plugin-feature-custom</artifactId>
    
    <dependencies>
        <dependency>
            <groupId>tech.kayys.gollek</groupId>
            <artifactId>gollek-plugin-runner-safetensor</artifactId>
        </dependency>
    </dependencies>
</project>
```

### Step 4: Build and Deploy

```bash
mvn clean install -Pinstall-plugin
```

---

## Resources

- **Safetensor Feature Plugins**: `plugins/runner/safetensor/gollek-plugin-feature-*/`
- **GGUF Feature Plugins**: `plugins/runner/gguf/gollek-plugin-feature-*/`
- **Feature Plugin SPI**: `plugins/runner/safetensor/gollek-plugin-runner-safetensor/.../SafetensorFeaturePlugin.java`
- [Safetensor Feature Plugin System](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/plugins/runner/safetensor/FEATURE_PLUGIN_SYSTEM.md)
- [GGUF Feature Plugin System](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/plugins/runner/gguf/GGUF_FEATURE_PLUGIN_SYSTEM.md)
- [Runner Plugin System](/docs/plugins/runner-plugins)

---

[Back to Runner Plugins](/docs/plugins/runner-plugins) &nbsp; [View Architecture](/docs/runtime/architecture) &nbsp; [Optimization Plugins](/docs/plugins/optimization-plugins)
