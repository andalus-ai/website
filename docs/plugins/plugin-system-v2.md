---
layout: default
title: Plugin System Architecture v2.0
nav_order: 1
---

# Plugin System Architecture v2.0

Flexible, agnostic, and portable plugin system with manifest-based discovery, modular deployment, and comprehensive SDK integration.

---

## Overview

The Gollek platform v2.0 features a **manifest-based plugin system** that is:

- ✅ **Flexible** - Plug in any plugin needed without hardcoded mappings
- ✅ **Portable** - Deploy as standalone (all-in-one JAR) or microservice
- ✅ **Agnostic** - No hardcoded plugin IDs or capabilities
- ✅ **Extensible** - Add new plugins without modifying core code
- ✅ **Discoverable** - Capability-based routing and discovery

For detachable Hugging Face style architecture and tokenizer metadata, see [Model Family Plugins](/docs/plugins/model-family-plugins). Model-family plugins use the same core plugin contract but keep model knowledge separate from runner, kernel, and provider plugins.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Application Layer                          │
│  CLI / Microservice / SDK                               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Gollek SDK Core                            │
│  - PluginAvailabilityChecker                            │
│  - PluginDescriptor (manifest parsing)                  │
│  - Capability Index                                     │
│  - Exceptions                                           │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Plugin Discovery                           │
│  - ServiceLoader (built-in)                             │
│  - Manifest Parsing (dynamic)                           │
│  - Capability Indexing                                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Plugin Layers                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Runners  │ │ Kernels  │ │Providers │ │  Opt.    │  │
│  │  v2.0    │ │  v2.0    │ │  v2.0    │ │  v2.0    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Modes

### STANDALONE Mode

**Description**: All plugins built-in, compiled in one JAR

**Use Case**: Simple deployment, no dynamic loading

**Configuration**:
```bash
-Dgollek.deployment.mode=standalone
```

**Characteristics**:
- Only ServiceLoader discovery
- No plugin directory scanning
- All plugins included at build time
- Fastest startup
- Largest JAR size

### MICROSERVICE Mode

**Description**: Dynamic plugin loading from plugin directory

**Use Case**: Flexible deployment, hot-reload support

**Configuration**:
```bash
-Dgollek.deployment.mode=microservice
-Dgollek.plugin.directory=~/.gollek/plugins
```

**Characteristics**:
- ServiceLoader + directory scanning
- Hot-reload support
- Minimal base JAR
- Slower startup (plugin loading)
- Maximum flexibility

### HYBRID Mode (Default)

**Description**: Built-in + dynamic plugins

**Use Case**: Best of both worlds

**Configuration**:
```bash
-Dgollek.deployment.mode=hybrid
```

**Characteristics**:
- ServiceLoader (built-in plugins)
- Directory scanning (dynamic plugins)
- Balanced startup time
- Flexible deployment

---

## Plugin Manifest Format

### Required Entries

```manifest
Plugin-Id: gguf-runner
Plugin-Type: runner
Plugin-Version: 2.0.0
Plugin-Name: GGUF Runner
Plugin-Provider: tech.kayys.gollek.plugin.runner.gguf.GGUFRunnerPlugin
```

### Optional Entries

```manifest
# Capabilities provided
Plugin-Capabilities: gguf-inference, llama-architecture, mistral-architecture

# Dependencies
Plugin-Dependencies: kernel-plugin

# Supported deployment modes
Plugin-Deployment: standalone,microservice

# Metadata
Plugin-Author: Gollek Team
Plugin-Vendor: Kayys.tech
Plugin-License: MIT
Plugin-GPU-Requirement: CUDA 11.0+
Plugin-Performance-Speedup: 2-3x
```

---

## Plugin Layers

### Level 1: Runner Plugins

**Purpose**: Model format support

| Runner | Formats | Capabilities | Deployment |
|--------|---------|--------------|------------|
| **GGUF** | `.gguf` | gguf-inference, llama-arch, mistral-arch | All |
| **Safetensor** | `.safetensors` | safetensor-inference, multimodal | All |
| **ONNX** | `.onnx` | onnx-inference, cpu-inference | All |
| **LibTorch** | `.pt`, `.pth` | libtorch-inference, pytorch-support | All |
| **TensorRT** | `.engine` | tensorrt-inference, nvidia-optimized | Microservice |
| **TFLite** | `.litertlm` | litert-inference, mobile-optimized | All |

### Level 2: Kernel Plugins

**Purpose**: Platform-specific GPU acceleration

| Kernel | Platform | Capabilities | Requirements |
|--------|----------|--------------|--------------|
| **CUDA** | NVIDIA | cuda-acceleration, flash-attn-2, flash-attn-3 | CUDA 11.0+, CC 6.0+ |
| **Metal** | Apple | metal-acceleration, unified-memory | macOS, Apple Silicon |
| **ROCm** | AMD | rocm-acceleration, amd-gpu | ROCm 5.0+, MI250+ |
| **DirectML** | Windows | directml-acceleration, directx-12 | Windows 10+ |
| **Blackwell** | NVIDIA B100/B200 | blackwell-accel, fp4, tmem | CUDA 12.3+, CC 10.0+ |

### Level 3: Provider Plugins

**Purpose**: Cloud API integration

| Provider | Models | Capabilities | Deployment |
|----------|--------|--------------|------------|
| **OpenAI** | GPT-4, GPT-3.5 | openai-api, gpt-4, embeddings | All |
| **Gemini** | Gemini Pro/Ultra | gemini-api, multimodal | All |
| **Anthropic** | Claude 3 | anthropic-api, claude-3 | All |
| **Cerebras** | Llama 3.1 | cerebras-api, fast-inference | All |
| **Mistral** | Mistral, Mixtral | mistral-api, mixtral | All |

### Level 4: Optimization Plugins

**Purpose**: Performance enhancements

| Optimization | Speedup | Requirements | Capabilities |
|--------------|---------|--------------|--------------|
| **FlashAttention-3** | 2-3x | Hopper+ (CC 9.0+) | flash-attn-3, optimized-attn |
| **FlashAttention-4** | 3-5x | Blackwell (CC 10.0+) | flash-attn-4, tmem-accel |
| **PagedAttention** | 2-4x | Any CUDA | paged-attn, kv-cache-opt |
| **Prompt Cache** | 5-10x* | Any | prompt-cache, repeated-prompts |
| **QLoRA** | 2-3x | 16GB+ VRAM | qlora, lora-adapters |

*For repeated prompts

---

## Capability-Based Discovery

### How It Works

1. **Plugin Loading**: Plugins loaded via ServiceLoader or directory
2. **Manifest Parsing**: Extract PluginDescriptor from JAR manifest
3. **Capability Indexing**: Build index of capabilities → plugins
4. **Capability Checking**: Applications check capabilities, not plugin IDs

### Usage Example

```java
@Inject
PluginAvailabilityChecker pluginChecker;

// Check capability
if (pluginChecker.hasCapability("gguf-inference")) {
    System.out.println("GGUF inference available");
}

// Get plugins for capability
List<PluginDescriptor> plugins = 
    pluginChecker.getPluginsForCapability("cuda-acceleration");

// Get required plugins
String required = pluginChecker.getRequiredPluginsForCapability(
    "flash-attention-3");

// List all capabilities
Set<String> capabilities = pluginChecker.getAvailableCapabilities();
```

---

## Installation

### Option 1: Download Plugins

```bash
# Create plugin directory
mkdir -p ~/.gollek/plugins

# Download plugins
wget https://gollek.ai/plugins/gollek-plugin-runner-gguf-2.0.0.jar
wget https://gollek.ai/plugins/gollek-plugin-kernel-cuda-2.0.0.jar

# Place in directory
mv *.jar ~/.gollek/plugins/

# Restart application
gollek run --model llama3-8b --prompt "Hello"
```

### Option 2: CLI Package Manager

```bash
# Install all plugins
gollek install --all

# Install specific plugin
gollek install gguf-runner

# Install multiple
gollek install gguf-runner cuda-kernel fa3

# List available
gollek plugin list

# Check status
gollek plugin status
```

### Option 3: Build from Source

```bash
# Build all plugins
cd inference-gollek
mvn clean install -DskipTests

# Copy to plugin directory
find . -name "*.jar" -path "*/target/*" | \
  grep -E "(runner|kernel|provider)" | \
  xargs -I {} cp {} ~/.gollek/plugins/
```

---

## Recommended Setups

### Minimal Local Inference

**Use Case**: Run local models with GPU acceleration

**Required Plugins**:
- `gguf-runner` - GGUF format support
- `cuda-kernel` OR `metal-kernel` - GPU acceleration

**Installation**:
```bash
gollek install gguf-runner cuda-kernel
# OR for Apple Silicon
gollek install gguf-runner metal-kernel
```

**Performance**:
- Startup: ~2-3 seconds
- Memory: ~500 MB base
- Speedup: 5-10x (vs CPU)

### Full Local Inference

**Use Case**: Maximum performance for local models

**Required Plugins**:
- `gguf-runner` - GGUF format
- `safetensor-runner` - Safetensor format
- `cuda-kernel` - CUDA acceleration
- `flash-attention-3` - FA3 (Hopper+)
- `paged-attention` - PagedAttention

**Installation**:
```bash
gollek install gguf-runner safetensor-runner cuda-kernel fa3 paged-attention
```

**Performance**:
- Startup: ~4-5 seconds
- Memory: ~800 MB base
- Speedup: 15-30x (vs CPU baseline)

### Cloud Inference

**Use Case**: Cloud provider only

**Required Plugins**:
- `openai-provider` OR `gemini-provider`

**Installation**:
```bash
gollek install openai-provider
# OR
gollek install gemini-provider
```

**Performance**:
- Startup: ~1-2 seconds
- Memory: ~300 MB base
- Latency: Network dependent

### Hybrid (Local + Cloud)

**Use Case**: Local with cloud fallback

**Required Plugins**:
- `gguf-runner` - Local GGUF models
- `cuda-kernel` - GPU acceleration
- `openai-provider` - Cloud fallback

**Installation**:
```bash
gollek install gguf-runner cuda-kernel openai-provider
```

**Performance**:
- Startup: ~3 seconds
- Memory: ~600 MB base
- Flexibility: Maximum

---

## Error Handling

### No Plugins Available

```
╔═══════════════════════════════════════════════════════════╗
║  ⚠️  NO PLUGINS AVAILABLE                                ║
╚═══════════════════════════════════════════════════════════╝

📦 INSTALLATION OPTIONS:

   Option 1: Download Plugins
   ────────────────────────────
   1. Visit: https://gollek.ai/plugins
   2. Download plugins you need
   3. Place in: ~/.gollek/plugins
   4. Restart application

   Option 2: Use Package Manager
   ──────────────────────────────
   gollek install --all
   gollek install <plugin-id>

📁 PLUGIN DIRECTORY: ~/.gollek/plugins
   Status: ✓ Exists

🔍 AVAILABLE CAPABILITIES:
   • gguf-inference
   • cuda-acceleration
   • metal-acceleration

💡 TIP: Plugins declare capabilities in manifest.
   Check JAR manifest for Plugin-Capabilities entry.
```

### Plugin Not Found

```
❌ Provider 'openai' is not available.

📦 Plugin directory: ~/.gollek/plugins

🔍 Available providers:
   - gemini (Gemini Provider)
   - anthropic (Anthropic Provider)
```

### Capability Not Available

```
❌ Capability 'flash-attention-3' is not available.

📦 Required plugins:
   • flash-attention-3
     Requires: NVIDIA Hopper+ (H100), CUDA 12.0+
     Minimum compute capability: 9.0

📦 To install:
   1. Download from: https://gollek.ai/plugins
   2. Place in: ~/.gollek/plugins
   3. Restart application
```

---

## Performance Comparison

### Startup Time

| Setup | Plugins | Startup | Memory |
|-------|---------|---------|--------|
| **Minimal Local** | GGUF + CUDA | ~2-3s | ~500 MB |
| **Full Local** | GGUF + Safetensor + CUDA + FA3 + PagedAttn | ~4-5s | ~800 MB |
| **Cloud Only** | OpenAI Provider | ~1-2s | ~300 MB |
| **Hybrid** | GGUF + CUDA + OpenAI | ~3s | ~600 MB |
| **All Plugins** | Everything | ~8-10s | ~1.5 GB |

### Inference Performance (Llama-3-8B, A100)

| Configuration | Tokens/s | VRAM | Speedup |
|---------------|----------|------|---------|
| CPU Only | 20 | 16 GB | 1.0x |
| + CUDA Kernel | 100 | 16 GB | 5.0x |
| + FlashAttention-3 | 280 | 16 GB | 14.0x |
| + PagedAttention | 350 | 13 GB | 17.5x |
| + Prompt Cache* | 500 | 18 GB | 25.0x |
| **All Combined** | **600** | **14 GB** | **30.0x** |

*For cached prompts

---

## Building Plugins

### Maven POM Configuration

```xml
<project>
    ...
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.5.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
                        </manifest>
                        <manifestEntries>
                            <!-- Required -->
                            <Plugin-Id>gguf-runner</Plugin-Id>
                            <Plugin-Type>runner</Plugin-Type>
                            <Plugin-Version>${project.version}</Plugin-Version>
                            <Plugin-Name>GGUF Runner</Plugin-Name>
                            <Plugin-Provider>tech.kayys.gollek.plugin.runner.gguf.GGUFRunnerPlugin</Plugin-Provider>
                            
                            <!-- Optional -->
                            <Plugin-Capabilities>gguf-inference, llama-architecture</Plugin-Capabilities>
                            <Plugin-Deployment>standalone,microservice,hybrid</Plugin-Deployment>
                            <Plugin-Performance-Speedup>1x (baseline)</Plugin-Performance-Speedup>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## Testing

### Plugin Availability Test

```java
@QuarkusTest
public class PluginAvailabilityTest {
    
    @Inject
    PluginAvailabilityChecker pluginChecker;
    
    @Test
    public void testCapabilities() {
        // Check capability
        assertTrue(pluginChecker.hasCapability("gguf-inference"));
        
        // Get plugins for capability
        List<PluginDescriptor> plugins = 
            pluginChecker.getPluginsForCapability("cuda-acceleration");
        assertFalse(plugins.isEmpty());
        
        // List all capabilities
        Set<String> capabilities = pluginChecker.getAvailableCapabilities();
        assertFalse(capabilities.isEmpty());
    }
    
    @Test
    public void testDeploymentMode() {
        // Check deployment mode
        assertEquals(
            DeploymentMode.HYBRID,
            pluginChecker.getDeploymentMode());
        
        // Check plugin directory
        assertNotNull(pluginChecker.getPluginDirectory());
    }
}
```

---

## Resources

- **[Manifest-Based Plugin System Guide](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/MANIFEST_BASED_PLUGIN_SYSTEM.md)** - Complete guide
- **[Modular Deployment Strategy](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/MODULAR_PLUGIN_DEPLOYMENT.md)** - Deployment guide
- **[Enhanced Plugin System v2.0](/docs/plugins/enhanced-plugin-system-v2)** - v2.0 features
- **[Safetensor Integration](/docs/runtime/safetensor-runner-integration)** - Safetensor runner
- **[Plugin Repository](https://gollek.ai/plugins)** - Download plugins

---

[Back to Architecture](/docs/runtime/architecture) &nbsp; [Enhanced Plugin System](/docs/plugins/enhanced-plugin-system-v2) &nbsp; [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs) &nbsp; [Runner Plugins](/docs/plugins/runner-plugins)
