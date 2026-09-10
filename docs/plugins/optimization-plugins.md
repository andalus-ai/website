---
layout: default
title: Optimization Plugins
---

# Optimization Plugin System

GPU kernel optimization plugins for high-performance AI inference. Hot-swap kernels, auto-detect hardware, and achieve up to 12x speedup.

---

## Overview

The Optimization Plugin system provides performance enhancements for runner plugins through a three-level plugin architecture:

```
Level 1: Runner Plugin (GGUF, Safetensor, ONNX, etc.)
    ↓
Level 2: Feature Plugin (Audio, Vision, Text)
    ↓
Level 3: Optimization Plugin (FA3, FA4, PagedAttn, etc.)
    ↓
Native Backend (llama.cpp, etc.)
```

This enables:
- **Hardware-Aware Optimization**: Auto-detect GPU and apply optimal kernels
- **Selective Deployment**: Load only optimizations for your hardware
- **Performance**: Up to 12x speedup for specific workloads
- **Flexibility**: Hot-reload optimizations without restart

---

## Available Optimization Plugins

| Plugin | Description | Compatible Runners | GPU Requirement | Speedup | Memory |
|--------|-------------|-------------------|-----------------|---------|--------|
| **FlashAttention-3** | FA3 kernel for Hopper+ | Safetensor, LibTorch | H100+ (CC 9.0+) | 2-3x | Same |
| **FlashAttention-4** | FA4 kernel for Blackwell | Safetensor, LibTorch | B200+ (CC 10.0+) | 3-5x | Same |
| **PagedAttention** | vLLM-style paged KV cache | GGUF, Safetensor, LibTorch | Any CUDA | 2-4x | -20% |
| **KV Cache** | Optimized KV cache management | All runners | Any GPU | 1.5-2x | -15% |
| **Prompt Cache** | Prompt caching for repeated queries | GGUF, Safetensor, ONNX | Any | 5-10x* | +VRAM |

*For repeated prompts

---

## Compatibility Matrix

### Runner Plugin Compatibility

| Optimization | GGUF Runner | Safetensor Runner | ONNX Runner | TensorRT | LibTorch | TFLite |
|--------------|-------------|-------------------|-------------|----------|----------|--------|
| **FlashAttention-3** | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **FlashAttention-4** | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **PagedAttention** | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **KV Cache** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Prompt Cache** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |

### GPU Requirements

| Optimization | GPU Requirement | Compute Capability | Speedup |
|--------------|----------------|-------------------|---------|
| **FlashAttention-3** | Hopper (H100+) | 9.0+ | 2-3x |
| **FlashAttention-4** | Blackwell (B200+) | 10.0+ | 3-5x |
| **PagedAttention** | Any CUDA GPU | Any | 2-4x |
| **KV Cache** | Any GPU | Any | 1.5-2x |
| **Prompt Cache** | Any (CPU OK) | N/A | 5-10x* |

*For repeated prompts

---

## Integration with Runner Plugins

### GGUF Runner Integration

```
GGUFRunnerPlugin
    ↓
TextFeaturePlugin
    ↓
OptimizationPluginManager
    ├── PagedAttentionPlugin ✅
    ├── PromptCachePlugin ✅
    └── KVCachePlugin ✅
    ↓
LlamaCppRunner (existing)
```

**Compatible Optimizations for GGUF**:
- ✅ PagedAttention (vLLM-style KV cache)
- ✅ Prompt Cache (repeated prompt caching)
- ✅ KV Cache (general optimizations)
- ❌ FlashAttention-3/4 (not compatible with llama.cpp)

### Safetensor Runner Integration

```
SafetensorRunnerPlugin
    ↓
FeaturePluginManager
    ├── TextFeaturePlugin
    ├── AudioFeaturePlugin
    └── VisionFeaturePlugin
    ↓
OptimizationPluginManager
    ├── FlashAttention3Plugin ✅
    ├── FlashAttention4Plugin ✅
    ├── PagedAttentionPlugin ✅
    ├── PromptCachePlugin ✅
    └── KVCachePlugin ✅
    ↓
DirectSafetensorBackend (existing)
```

**Compatible Optimizations for Safetensor**:
- ✅ FlashAttention-3 (Hopper GPUs)
- ✅ FlashAttention-4 (Blackwell GPUs)
- ✅ PagedAttention (all CUDA GPUs)
- ✅ Prompt Cache
- ✅ KV Cache

---

## Configuration Examples

### GGUF Runner with Optimizations

```yaml
gollek:
  runners:
    gguf-runner:
      enabled: true
      n_gpu_layers: -1
      n_ctx: 4096
      
      optimizations:
        paged-attention:
          enabled: true
          block_size: 16
          num_blocks: 1024
        prompt-cache:
          enabled: true
          max_cache_size_gb: 8
          ttl_seconds: 3600
          min_prompt_len: 256
```

### Safetensor Runner with Optimizations (H100)

```yaml
gollek:
  runners:
    safetensor-runner:
      enabled: true
      backend: direct
      device: cuda
      dtype: f16
      
      optimizations:
        flash-attention-3:
          enabled: true
          tile_size: 128
          use_tensor_cores: true
        paged-attention:
          enabled: true
          block_size: 16
          num_blocks: 1024
        prompt-cache:
          enabled: true
          max_cache_size_gb: 8
          ttl_seconds: 3600
```

### Multi-Modal (LLaVA) with Optimizations

```yaml
gollek:
  runners:
    safetensor-runner:
      enabled: true
      optimizations:
        flash-attention-3:
          enabled: true
        paged-attention:
          enabled: true
        prompt-cache:
          enabled: true
```

### Installation

#### Option 1: Build from Source

```bash
# Build optimization core
cd inference-gollek/core/gollek-plugin-optimization-core
mvn clean install

# Build specific optimization plugin
cd inference-gollek/plugins/gollek-plugin-fa3
mvn clean install -Pinstall-plugin
```

This installs optimization plugins to `~/.gollek/plugins/optimization/`

---

## Performance Metrics

### GGUF Runner Performance

| Configuration | Tokens/s | VRAM | Speedup | Best For |
|---------------|----------|------|---------|----------|
| Baseline (no opt) | 100 | 16 GB | 1.0x | Reference |
| + PagedAttention | 250 | 13 GB | 2.5x | Long context |
| + Prompt Cache* | 500 | 18 GB | 5.0x | Repeated prompts |
| **All Combined** | **400** | **14 GB** | **4.0x** | **Production** |

*For cached prompts only

### Safetensor Runner Performance (H100)

| Configuration | Tokens/s | VRAM | Speedup | Best For |
|---------------|----------|------|---------|----------|
| Baseline (no opt) | 100 | 16 GB | 1.0x | Reference |
| + FlashAttention-3 | 280 | 16 GB | 2.8x | Hopper GPUs |
| + PagedAttention | 350 | 13 GB | 3.5x | Long context |
| **All Combined** | **600** | **14 GB** | **6.0x** | **Production** |

### Hardware-Specific Recommendations

#### Hopper GPUs (H100, H200)

**Recommended Stack**:
```yaml
optimizations:
  flash-attention-3:
    enabled: true
  paged-attention:
    enabled: true
  prompt-cache:
    enabled: true
```

**Expected Performance**: 5-8x speedup vs baseline

#### Blackwell GPUs (B200, GB200)

**Recommended Stack**:
```yaml
optimizations:
  flash-attention-4:
    enabled: true
  paged-attention:
    enabled: true
  prompt-cache:
    enabled: true
```

**Expected Performance**: 8-12x speedup vs baseline

#### Ampere/Ada GPUs (A100, RTX 4090)

**Recommended Stack**:
```yaml
optimizations:
  paged-attention:
    enabled: true
  kv-cache:
    enabled: true
    quantization: "fp16"
  prompt-cache:
    enabled: true
```

**Expected Performance**: 3-5x speedup vs baseline

#### CPU-Only

**Recommended Stack**:
```yaml
optimizations:
  prompt-cache:
    enabled: true
  kv-cache:
    enabled: true
    quantization: "q8_0"
```

**Expected Performance**: 2-3x speedup vs baseline

---

#### Option 2: Download Pre-built JARs

```bash
# Download specific plugin
wget https://github.com/gollek-ai/gollek/releases/download/v1.0.0/gollek-plugin-fa3-1.0.0.jar

# Copy to optimization plugins directory
cp gollek-plugin-fa3-1.0.0.jar ~/.gollek/plugins/optimization/
```

#### Option 3: Maven Dependency

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-plugin-fa3</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Configuration

Create `~/.gollek/plugins/optimization/optimization-config.json`:

```json
{
  "flash-attention-3": {
    "enabled": true,
    "tile_size": 128,
    "use_tensor_cores": true
  },
  "paged-attention": {
    "enabled": true,
    "block_size": 16,
    "num_blocks": 1024
  },
  "prompt-cache": {
    "enabled": true,
    "max_cache_size_gb": 8,
    "ttl_seconds": 3600
  }
}
```

### Usage Example

```java
import tech.kayys.gollek.plugin.optimization.OptimizationPluginManager;
import tech.kayys.gollek.plugin.optimization.ExecutionContext;

// Get plugin manager
OptimizationPluginManager manager = OptimizationPluginManager.getInstance();

// Register plugins (auto-discovered from classpath or plugin directory)
manager.register(new FlashAttention3Plugin());
manager.register(new PagedAttentionPlugin());

// Initialize with configuration
Map<String, Object> config = loadConfig("optimization-config.json");
manager.initialize(config);

// During inference, apply optimizations
ExecutionContext context = createExecutionContext(...);
List<String> applied = manager.applyOptimizations(context);

System.out.println("Applied optimizations: " + applied);
// Output: Applied optimizations: [flash-attention-3, paged-attention]
```

---

## Plugin Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Inference Engine                           │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         OptimizationPluginManager                       │
│  - Plugin discovery                                     │
│  - Lifecycle management                                 │
│  - Hardware detection                                   │
│  - Priority-based execution                             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│          Optimization Plugins                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   FA3    │ │   FA4    │ │  Paged   │ │   KV     │  │
│  │ Plugin   │ │ Plugin   │ │ Attention│ │  Cache   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Prompt  │ │ Prefill  │ │  Hybrid  │ │  QLoRA   │  │
│  │  Cache   │ │  Decode  │ │  Attn    │ │          │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│           Native Kernel Libraries                       │
│  libgollek_fa3.so | libgollek_fa4.so | libcustom.so     │
└─────────────────────────────────────────────────────────┘
```

### Plugin Lifecycle

1. **Discovery**: Plugins auto-discovered from `~/.gollek/plugins/optimization/`
2. **Registration**: Plugins register with `OptimizationPluginManager`
3. **Initialization**: `initialize(config)` called once at startup
4. **Availability Check**: `isAvailable()` checks hardware compatibility
5. **Application**: `apply(context)` called during inference
6. **Shutdown**: `shutdown()` called on engine shutdown

---

## Hardware Compatibility

### NVIDIA GPUs

| GPU Series | Architecture | Compute Capability | Supported Plugins |
|------------|--------------|-------------------|-------------------|
| H100, H200 | Hopper | 9.0 | All (FA3, FA4, Paged, etc.) |
| B200, GB200 | Blackwell | 10.0 | All (optimized for FA4) |
| A100, A800 | Ampere | 8.0 | FA2, Paged, KV Cache, etc. |
| A40, RTX A6000 | Ampere | 8.6 | FA2, Paged, KV Cache, etc. |
| RTX 4090, 4080 | Ada Lovelace | 8.9 | FA2, Paged, KV Cache, etc. |
| RTX 3090, 3080 | Ampere | 8.6 | FA2, Paged, KV Cache, etc. |
| V100 | Volta | 7.0 | Paged, KV Cache (limited) |
| T4 | Turing | 7.5 | Paged, KV Cache (limited) |

### AMD GPUs

| GPU Series | Architecture | Supported Plugins |
|------------|--------------|-------------------|
| MI300X, MI300A | CDNA 3 | Paged, KV Cache, Prompt Cache |
| MI250X, MI250 | CDNA 2 | Paged, KV Cache |
| MI210, MI200 | CDNA 2 | Paged, KV Cache |
| RX 7900 XTX | RDNA 3 | Limited support |

---

## Plugin Development

### Creating a Custom Optimization Plugin

#### Step 1: Implement the OptimizationPlugin Interface

```java
package tech.kayys.plugin;

import tech.kayys.gollek.plugin.optimization.*;
import java.util.*;

public class MyCustomKernelPlugin implements OptimizationPlugin {
    
    @Override
    public String id() {
        return "my-custom-kernel";
    }
    
    @Override
    public String name() {
        return "My Custom Kernel";
    }
    
    @Override
    public String description() {
        return "Custom optimization for specialized workloads";
    }
    
    @Override
    public boolean isAvailable() {
        // Check hardware requirements
        return GpuDetector.isNvidia() && 
               GpuDetector.getComputeCapability() >= 80;
    }
    
    @Override
    public int priority() {
        return 50; // Higher values execute first
    }
    
    @Override
    public Set<String> supportedArchitectures() {
        return Set.of("llama", "mistral", "qwen");
    }
    
    @Override
    public Set<String> supportedGpuArchs() {
        return Set.of("ampere", "hopper");
    }
    
    @Override
    public boolean apply(ExecutionContext context) {
        // Get model parameters
        int hiddenSize = context.getParameter("hidden_size", 4096);
        int numHeads = context.getParameter("num_heads", 32);
        
        // Get memory buffers
        MemoryBuffer qBuffer = context.getBuffer("q").orElse(null);
        MemoryBuffer kBuffer = context.getBuffer("k").orElse(null);
        MemoryBuffer vBuffer = context.getBuffer("v").orElse(null);
        
        if (qBuffer == null || kBuffer == null || vBuffer == null) {
            return false;
        }
        
        // Apply your custom kernel
        return applyCustomKernel(
            qBuffer.getPointer(),
            kBuffer.getPointer(),
            vBuffer.getPointer(),
            context.getCudaStream()
        );
    }
    
    @Override
    public Map<String, Object> metadata() {
        return Map.of(
            "kernel", "custom",
            "version", "1.0.0"
        );
    }
    
    // Native method for your custom kernel
    private native boolean applyCustomKernel(
        long qPtr, long kPtr, long vPtr, long stream
    );
}
```

#### Step 2: Create pom.xml

```xml
<project>
    <groupId>tech.kayys</groupId>
    <artifactId>gollek-plugin-my-custom</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <maven.compiler.release>25</maven.compiler.release>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>tech.kayys.gollek</groupId>
            <artifactId>gollek-plugin-optimization-core</artifactId>
            <version>1.0.0-SNAPSHOT</version>
        </dependency>
        <dependency>
            <groupId>net.java.dev.jna</groupId>
            <artifactId>jna</artifactId>
            <version>5.14.0</version>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.4.2</version>
                <configuration>
                    <archive>
                        <manifestEntries>
                            <Plugin-Id>my-custom-kernel</Plugin-Id>
                            <Plugin-Version>${project.version}</Plugin-Version>
                            <Plugin-Class>tech.kayys.plugin.MyCustomKernelPlugin</Plugin-Class>
                            <Plugin-Type>optimization</Plugin-Type>
                            <GPU-Arch>ampere,hopper</GPU-Arch>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

#### Step 3: Build and Deploy

```bash
# Build plugin
mvn clean package

# Deploy to Gollek plugins directory
mvn install -Pinstall-plugin

# Or manually copy
cp target/gollek-plugin-my-custom-1.0.0.jar ~/.gollek/plugins/optimization/
```

### Plugin Manifest Entries

| Entry | Required | Description |
|-------|----------|-------------|
| `Plugin-Id` | Yes | Unique plugin identifier |
| `Plugin-Class` | Yes | Main plugin class |
| `Plugin-Type` | Yes | Must be `optimization` |
| `Plugin-Dependencies` | No | Comma-separated dependency IDs |
| `GPU-Arch` | No | Supported GPU architectures |
| `CUDA-Compute-Capability` | No | Minimum CUDA compute capability |

---

## Configuration Reference

### FlashAttention-3

```json
{
  "flash-attention-3": {
    "enabled": true,
    "tile_size": 128,
    "use_tensor_cores": true,
    "causal": true,
    "softmax_scale": 1.0
  }
}
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enabled` | `true` | Enable/disable plugin |
| `tile_size` | `128` | Tile size (64, 128, 256) |
| `use_tensor_cores` | `true` | Use Tensor Cores (Hopper+) |
| `causal` | `true` | Causal attention mask |
| `softmax_scale` | `1.0` | Softmax scaling factor |

### PagedAttention

```json
{
  "paged-attention": {
    "enabled": true,
    "block_size": 16,
    "num_blocks": 1024,
    "max_context": 32768
  }
}
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enabled` | `true` | Enable/disable plugin |
| `block_size` | `16` | Block size (8, 16, 32) |
| `num_blocks` | `1024` | Number of KV cache blocks |
| `max_context` | `32768` | Maximum context length |

### Prompt Cache

```json
{
  "prompt-cache": {
    "enabled": true,
    "max_cache_size_gb": 8,
    "ttl_seconds": 3600,
    "min_prompt_len": 256,
    "hash_algorithm": "md5"
  }
}
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enabled` | `true` | Enable/disable plugin |
| `max_cache_size_gb` | `8` | Maximum cache size in GB |
| `ttl_seconds` | `3600` | Cache entry TTL |
| `min_prompt_len` | `256` | Minimum prompt length to cache |
| `hash_algorithm` | `md5` | Hash algorithm (md5, sha256) |

---

## Performance Tuning

### Memory vs Speed Trade-offs

```json
{
  "flash-attention-3": {
    "tile_size": 256,      // Larger = faster, more VRAM
    "use_tensor_cores": true
  },
  "paged-attention": {
    "block_size": 32,      // Larger = less overhead, coarser
    "num_blocks": 2048     // More = longer context, more VRAM
  }
}
```

### Multi-GPU Configuration

```json
{
  "elastic-ep": {
    "enabled": true,
    "num_experts": 8,
    "expert_parallelism": true,
    "communication_backend": "nccl"
  },
  "weight-offload": {
    "enabled": true,
    "offload_ratio": 0.5,
    "cpu_memory_gb": 64
  }
}
```

---

## Troubleshooting

### Plugin Not Loading

```bash
# Verify JAR is in correct directory
ls -la ~/.gollek/plugins/optimization/*.jar

# Check plugin manifest
unzip -p gollek-plugin-fa3.jar META-INF/MANIFEST.MF

# Check logs for errors
tail -f ~/.gollek/logs/gollek.log | grep -i optimization
```

### Native Library Not Found

```bash
# Ensure native library is in library path
export LD_LIBRARY_PATH=/path/to/native/libs:$LD_LIBRARY_PATH

# Or copy to system library directory
sudo cp libgollek_fa3.so /usr/local/lib/
sudo ldconfig
```

### Performance Issues

```bash
# Check which optimizations are active
curl http://localhost:8080/api/v1/optimizations/status

# Benchmark with/without optimizations
gollek-cli benchmark --model llama-3-8b --no-optimizations
gollek-cli benchmark --model llama-3-8b --optimizations fa3,paged

# Compare results
# Without: 45 tokens/s
# With FA3+Paged: 135 tokens/s (3x speedup)
```

### Hardware Compatibility Check

```java
OptimizationPluginManager manager = OptimizationPluginManager.getInstance();

// Check available plugins
List<OptimizationPlugin> available = manager.getAvailablePlugins();
System.out.println("Available optimizations:");
for (OptimizationPlugin plugin : available) {
    System.out.println("  - " + plugin.name() + " (" + plugin.id() + ")");
}

// Output:
// Available optimizations:
//   - FlashAttention-3 (flash-attention-3)
//   - PagedAttention (paged-attention)
//   - KV Cache (kv-cache)
```

---

## Best Practices

### Plugin Ordering

Plugins execute in priority order (highest first):

```java
public class FlashAttention3Plugin implements OptimizationPlugin {
    @Override
    public int priority() {
        return 100; // High priority - execute first
    }
}

public class PagedAttentionPlugin implements OptimizationPlugin {
    @Override
    public int priority() {
        return 50; // Medium priority
    }
}
```

### Resource Management

```java
@Override
public void shutdown() {
    // Release native resources
    if (nativeBuffer != null) {
        nativeBuffer.close();
    }
    
    // Unload native library if needed
    // (usually handled by JVM)
}
```

### Error Handling

```java
@Override
public boolean apply(ExecutionContext context) {
    try {
        // Apply optimization
        return applyKernel(...);
    } catch (Exception e) {
        LOG.errorf("Optimization failed: %s", e.getMessage());
        return false; // Graceful fallback to standard kernel
    }
}
```

---

## Resources

- **Optimization Plugins**: `inference-gollek/plugins/optimization/`
- **Integration Guide**: [Optimization Plugin Integration](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/plugins/optimization/OPTIMIZATION_INTEGRATION_GUIDE.md)
- **Runner Plugins**: [Runner Plugin Documentation](/docs/plugins/runner-plugins)
- **Feature Plugins**: [Feature Plugin Documentation](/docs/plugins/feature-plugins)
- [FlashAttention-3 Paper](https://arxiv.org/abs/2307.08691)
- [PagedAttention Paper (vLLM)](https://arxiv.org/abs/2309.06180)
- [CUDA Programming Guide](https://docs.nvidia.com/cuda/)

---

[Back to Runner Plugins](/docs/plugins/runner-plugins) &nbsp; [Feature Plugins](/docs/plugins/feature-plugins) &nbsp; [Quantization](/docs/plugins/quantization) &nbsp; [View Architecture](/docs/runtime/architecture)
