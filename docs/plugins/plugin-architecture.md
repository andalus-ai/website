---
layout: default
title: Plugin System Architecture
nav_order: 2
---

# Four-Level Plugin System Architecture

Complete plugin architecture for the Gollek Inference Engine with four levels of extensibility and platform-specific optimization.

> **🆕 What's New**: 
> - **Enhanced Kernel Plugin System v2.0** with ClassLoader isolation, hot-reload, and comprehensive validation. [Learn more](/docs/plugins/enhanced-plugin-architecture)
> - **Enhanced Runner Plugin System v2.0** with type-safe operations, lifecycle management, and model management. [Learn more](/docs/plugins/enhanced-runner-plugin-architecture)

---

## Overview

The Gollek Inference Engine implements a **four-level plugin architecture** that provides:

- **Flexibility**: Hot-reload, selective deployment
- **Performance**: Up to 30x speedup with all optimizations
- **Efficiency**: 70% code reuse, minimal duplication
- **Portability**: Platform-specific kernels with auto-detection
- **Extensibility**: Easy to add new plugins at any level
- **Observability**: Comprehensive metrics and health monitoring (v2.0)

---

## Enhanced Features (v2.0)

The kernel plugin system has been completely redesigned with production-ready features:

| Feature | v1.0 | v2.0 |
|---------|------|------|
| **Type Safety** | Basic | ✅ Generic operations |
| **Lifecycle** | Simple | ✅ validate/initialize/health/shutdown |
| **Isolation** | None | ✅ ClassLoader per plugin |
| **Hot-Reload** | Limited | ✅ Full support |
| **Validation** | Basic | ✅ Comprehensive with errors/warnings |
| **Error Handling** | Generic | ✅ Specific exception hierarchy |
| **Metrics** | Basic | ✅ Comprehensive observability |
| **Configuration** | Map-based | ✅ Type-safe with builder |
| **CDI Integration** | Manual | ✅ Automatic producers |
| **Engine Integration** | Partial | ✅ Full integration |

[Learn more about Enhanced Plugin Architecture →](/docs/plugins/enhanced-plugin-architecture)

## Complete Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Application Layer                          │
│  InferenceRequest → Engine                              │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         Gollek Inference Engine                         │
│  - PluginSystemIntegrator                               │
│  - InferenceOrchestrator                                │
│  - Metrics & Monitoring                                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│       Level 1: Runner Plugins                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  GGUF    │ │ Safetensor│ │   ONNX   │ │TensorRT  │  │
│  │ (llama)  │ │  (HF)    │ │ (onnx)   │ │  (TRT)   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐                             │
│  │LibTorch  │ │ TFLite   │                             │
│  │(PyTorch) │ │  (TF)    │                             │
│  └──────────┘ └──────────┘                             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│       Level 2: Feature Plugins (Optional)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │  Audio   │ │  Vision  │ │   Text   │                │
│  │ Feature  │ │ Feature  │ │ Feature  │                │
│  └──────────┘ └──────────┘ └──────────┘                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│      Level 3: Optimization Plugins (Optional)           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   FA3    │ │   FA4    │ │  Paged   │ │  Prompt  │  │
│  │          │ │          │ │ Attention│ │  Cache   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│    Level 4: Kernel Plugins (Platform-Specific)          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  CUDA    │ │  ROCm    │ │  Metal   │ │ DirectML │  │
│  │ (NVIDIA) │ │  (AMD)   │ │ (Apple)  │ │(Windows) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│           Native Backends                               │
│  cuBLAS | rocBLAS | Metal Performance Shaders | DML    │
└─────────────────────────────────────────────────────────┘
```

---

## Plugin Levels

### Level 1: Runner Plugins

**Purpose**: Model format support

**Available Runners**:
| Runner | Format | Backend | GPU Support | Size |
|--------|--------|---------|-------------|------|
| **GGUF** | .gguf | llama.cpp | ✅ CUDA/Metal | ~500 MB |
| **Safetensor** | .safetensors | Direct/GGUF | ✅ CUDA/MPS | ~20 GB |
| **ONNX** | .onnx | ONNX Runtime | ✅ Multi | ~800 MB |
| **TensorRT** | .engine | TensorRT | ✅ NVIDIA | ~2 GB |
| **LibTorch** | .pt/.bin | PyTorch | ✅ CUDA | ~3 GB |
| **TFLite** | .litertlm | TensorFlow Lite | ✅ GPU | ~500 MB |

**Integration**:
```java
@Inject
RunnerPluginManager runnerManager;

// Auto-detect format and select runner
Optional<RunnerSession> session = runnerManager.createSession(
    "models/llama-3-8b.gguf",
    config
);
```

---

### Level 2: Feature Plugins

**Purpose**: Domain-specific capabilities

**Available Features**:
| Feature | Capabilities | Models | Size |
|---------|-------------|--------|------|
| **Audio** | STT, TTS | Whisper, SpeechT5 | ~52 MB |
| **Vision** | Classification, Detection | CLIP, ViT, DETR | ~800 MB |
| **Text** | LLM, Classification | Llama, Mistral, BERT | ~15 GB |

**Integration**:
```java
@Inject
FeaturePluginManager featureManager;

// Enable specific features
Map<String, Object> config = Map.of(
    "features", Map.of(
        "audio", Map.of("enabled", true),
        "vision", Map.of("enabled", false)
    )
);
```

---

### Level 3: Optimization Plugins

**Purpose**: Performance enhancements

**Available Optimizations**:
| Optimization | Speedup | Compatible Runners | GPU Requirement |
|--------------|---------|-------------------|-----------------|
| **FlashAttention-3** | 2-3x | Safetensor, LibTorch | Hopper (CC 9.0+) |
| **FlashAttention-4** | 3-5x | Safetensor, LibTorch | Blackwell (CC 10.0+) |
| **PagedAttention** | 2-4x | GGUF, Safetensor, LibTorch | Any CUDA |
| **Prompt Cache** | 5-10x* | GGUF, Safetensor, ONNX | Any |

*For repeated prompts

**Integration**:
```java
@Inject
OptimizationPluginManager optimizationManager;

// Apply optimizations based on hardware
Map<String, Object> config = Map.of(
    "optimizations", Map.of(
        "flash-attention-3", Map.of("enabled", true),
        "paged-attention", Map.of("enabled", true)
    )
);
```

---

### Level 4: Kernel Plugins

**Purpose**: Platform-specific GPU kernels

**Available Kernels**:
| Kernel | Platform | GPU Vendor | OS | Size |
|--------|----------|------------|----|----|
| **CUDA** | CUDA | NVIDIA | Linux/Windows | ~50 MB |
| **ROCm** | ROCm | AMD | Linux | ~40 MB |
| **Metal** | Metal | Apple | macOS | ~30 MB |
| **DirectML** | DirectML | Any | Windows | ~35 MB |

**Auto-Detection**:
```java
// Auto-detect platform
String platform = KernelPlugin.autoDetectPlatform();
// Returns: "cuda", "rocm", "metal", "directml", or "cpu"

// Load only kernel for detected platform
kernelManager.initialize();
```

---

## Engine Integration

### PluginSystemIntegrator

The `PluginSystemIntegrator` coordinates all four plugin levels:

```java
@ApplicationScoped
public class PluginSystemIntegrator {
    
    @PostConstruct
    public void initialize() {
        // Initialize in order (bottom-up)
        initializeKernelPlugins();        // Level 4
        initializeOptimizationPlugins();  // Level 3
        initializeFeaturePlugins();       // Level 2
        initializeRunnerPlugins();        // Level 1
        
        logPluginStatus();
    }
}
```

### Initialization Order

1. **Level 4 - Kernel Plugins**: Auto-detect platform, load appropriate kernel
2. **Level 3 - Optimization Plugins**: Check hardware compatibility, apply optimizations
3. **Level 2 - Feature Plugins**: Initialize domain-specific capabilities
4. **Level 1 - Runner Plugins**: Initialize model format support

### Shutdown Order (Reverse)

1. Level 1 - Runner Plugins
2. Level 2 - Feature Plugins
3. Level 3 - Optimization Plugins
4. Level 4 - Kernel Plugins

---

## Configuration

### Complete Configuration Example

```yaml
gollek:
  engine:
    plugin-system:
      enabled: true
      auto-detect: true
  
  # Level 4: Kernel Plugins
  kernels:
    auto-detect: true
    cuda:
      enabled: true
      device_id: 0
      memory_fraction: 0.9
  
  # Level 3: Optimization Plugins
  optimizations:
    flash-attention-3:
      enabled: true
      tile_size: 128
    paged-attention:
      enabled: true
      block_size: 16
    prompt-cache:
      enabled: true
      max_cache_size_gb: 8
  
  # Level 2: Feature Plugins
  features:
    audio:
      enabled: true
      default_model: whisper-large-v3
    vision:
      enabled: false
    text:
      enabled: true
      default_model: llama-3-8b
  
  # Level 1: Runner Plugins
  runners:
    gguf-runner:
      enabled: true
      n_gpu_layers: -1
      n_ctx: 4096
    safetensor-runner:
      enabled: true
      backend: direct
    onnx-runner:
      enabled: false
```

---

## Performance

### Complete Stack Performance (H100)

| Configuration | Tokens/s | VRAM | Speedup |
|---------------|----------|------|---------|
| CPU Only (Baseline) | 20 | 16 GB | 1.0x |
| + CUDA Kernel | 100 | 16 GB | 5.0x |
| + FlashAttention-3 | 280 | 16 GB | 14.0x |
| + PagedAttention | 350 | 13 GB | 17.5x |
| + Prompt Cache* | 500 | 18 GB | 25.0x |
| **All Combined** | **600** | **14 GB** | **30.0x** |

*For cached prompts

### Deployment Size

| Scenario | Components | Size | Reduction |
|----------|------------|------|-----------|
| Edge (CPU) | GGUF + Text + Prompt Cache | 6 GB | 74% |
| Audio Service | Safetensor + Audio + CUDA | 52 MB | 99.8% |
| LLM Service | GGUF + Text + PagedAttn + CUDA | 6 GB | 74% |
| Multi-Modal | Safetensor + All Features + FA3 + CUDA | 15 GB | 34% |
| Full Dev | All plugins | 22.7 GB | 0% |

---

## Monitoring

### Plugin Status

```bash
# Get plugin system status
curl http://localhost:8080/api/v1/plugins/status

# Response:
{
  "initialized": true,
  "fully_operational": true,
  "levels": {
    "kernel": {
      "enabled": true,
      "active_platform": "cuda"
    },
    "optimization": {
      "enabled": true,
      "active_optimizations": ["flash-attention-3", "paged-attention"]
    },
    "feature": {
      "enabled": true,
      "active_features": ["audio", "text"]
    },
    "runner": {
      "enabled": true,
      "active_runners": ["gguf-runner", "safetensor-runner"]
    }
  }
}
```

### Health Checks

```bash
# Get health status for all levels
curl http://localhost:8080/api/v1/plugins/health

# Response:
{
  "kernel": {
    "cuda": { "healthy": true, "available": true }
  },
  "optimization": {
    "flash-attention-3": { "healthy": true },
    "paged-attention": { "healthy": true }
  },
  "feature": {
    "audio": { "healthy": true },
    "text": { "healthy": true }
  },
  "runner": {
    "gguf-runner": { "healthy": true },
    "safetensor-runner": { "healthy": true }
  }
}
```

---

## Creating Custom Plugins

### Level 1: Custom Runner Plugin

```java
public class CustomRunnerPlugin implements RunnerPlugin {
    @Override
    public String id() { return "custom-runner"; }
    
    @Override
    public Set<String> supportedFormats() {
        return Set.of(".custom");
    }
    
    @Override
    public RunnerSession createSession(String modelPath, Map<String, Object> config) {
        return new CustomRunnerSession(modelPath, config);
    }
}
```

### Level 2: Custom Feature Plugin

```java
public class CustomFeaturePlugin implements SafetensorFeaturePlugin {
    @Override
    public String id() { return "custom-feature"; }
    
    @Override
    public Set<String> supportedModels() {
        return Set.of("custom-model");
    }
    
    @Override
    public Object process(Object input) {
        return processCustom(input);
    }
}
```

### Level 3: Custom Optimization Plugin

```java
public class CustomOptimizationPlugin implements OptimizationPlugin {
    @Override
    public String id() { return "custom-opt"; }
    
    @Override
    public Set<String> compatibleRunners() {
        return Set.of("gguf-runner", "safetensor-runner");
    }
    
    @Override
    public boolean apply(OptimizationContext context) {
        return applyOptimization(context);
    }
}
```

### Level 4: Custom Kernel Plugin

```java
public class CustomKernelPlugin implements KernelPlugin {
    @Override
    public String id() { return "custom-kernel"; }
    
    @Override
    public String platform() { return "custom"; }
    
    @Override
    public boolean isAvailable() {
        return customHardwareAvailable();
    }
    
    @Override
    public Object execute(String operation, Map<String, Object> params) {
        return executeCustom(operation, params);
    }
}
```

---

## Troubleshooting

### Plugin Not Loading

```
Error: Plugin not found: custom-runner
```

**Solution**:
1. Check if plugin JAR is in `~/.gollek/plugins/`
2. Verify plugin manifest: `unzip -p plugin.jar META-INF/MANIFEST.MF`
3. Check logs: `tail -f ~/.gollek/logs/gollek.log | grep plugin`

### Platform Detection Failed

```
Warning: No available kernel for platform cuda, falling back to CPU
```

**Solution**:
1. Verify GPU is present: `nvidia-smi`
2. Check drivers are installed
3. Verify CUDA installation: `nvcc --version`

### Optimization Not Applied

```
Warning: FlashAttention-3 not applied - GPU not compatible
```

**Solution**:
1. Check GPU architecture: `nvidia-smi --query-gpu=compute_cap`
2. Verify compute capability >= 9.0 for FA3
3. Check logs for details

---

## Resources

- **Plugin System Guide**: [Four-Level Plugin System](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/FOUR_LEVEL_PLUGIN_SYSTEM_SUMMARY.md)
- **Runner Plugins**: [Runner Plugin Documentation](/docs/plugins/runner-plugins)
- **Feature Plugins**: [Feature Plugin Documentation](/docs/plugins/feature-plugins)
- **Optimization Plugins**: [Optimization Plugin Documentation](/docs/plugins/optimization-plugins)
- **Kernel Plugins**: [Kernel Plugin Documentation](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/plugins/kernel/KERNEL_PLUGIN_SYSTEM.md)
- **Engine Integration**: [Engine Integration Guide](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/core/gollek-engine/ENGINE_PLUGIN_INTEGRATION.md)

---

[Back to Architecture](/docs/runtime/architecture) &nbsp; [Runner Plugins](/docs/plugins/runner-plugins) &nbsp; [Feature Plugins](/docs/plugins/feature-plugins) &nbsp; [Optimization Plugins](/docs/plugins/optimization-plugins)
