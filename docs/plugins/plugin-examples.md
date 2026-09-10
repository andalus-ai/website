# Plugin System v2.0 - Real-World Examples

**Date**: 2026-03-25  
**Version**: 2.0.0  
**Status**: ✅ **COMPLETE**

---

## Overview

This guide provides real-world examples of using the manifest-based plugin system v2.0 in various deployment scenarios.

---

## Example 1: Minimal Local Inference Setup

**Use Case**: Run Llama-3-8B locally with GPU acceleration

### Required Plugins

```bash
# Install minimal plugins
gollek install gguf-runner cuda-kernel
# OR for Apple Silicon
gollek install gguf-runner metal-kernel
```

### Plugin Manifest Verification

```bash
# Verify GGUF runner capabilities
jar xf gollek-plugin-runner-gguf-2.0.0.jar META-INF/MANIFEST.MF
cat META-INF/MANIFEST.MF | grep Plugin-Capabilities

# Output:
# Plugin-Capabilities: gguf-inference, llama-architecture, mistral-architecture, ...
```

### Usage Example

```java
@Inject
GollekSdk sdk;

@Inject
PluginAvailabilityChecker pluginChecker;

public void runInference() {
    // Check capabilities
    if (!pluginChecker.hasCapability("gguf-inference")) {
        System.err.println(pluginChecker.getCapabilityNotAvailableError("gguf-inference"));
        System.exit(1);
    }
    
    if (!pluginChecker.hasCapability("cuda-acceleration") &&
        !pluginChecker.hasCapability("metal-acceleration")) {
        System.out.println("⚠️  No GPU acceleration available, using CPU");
    }
    
    // Run inference
    InferenceRequest request = InferenceRequest.builder()
        .model("llama-3-8b")
        .prompt("Explain quantum computing")
        .maxTokens(512)
        .build();
    
    InferenceResponse response = sdk.createCompletion(request);
    System.out.println(response.getContent());
}
```

### Expected Performance

- **Startup**: ~2-3 seconds
- **Memory**: ~500 MB base
- **Speedup**: 5-10x (with GPU)

---

## Example 2: Full Performance Setup

**Use Case**: Maximum performance for Llama-3-70B with all optimizations

### Required Plugins

```bash
# Install all performance plugins
gollek install gguf-runner safetensor-runner cuda-kernel flash-attention-3 paged-attention
```

### Capability Check

```java
public void checkCapabilities() {
    List<String> requiredCapabilities = List.of(
        "gguf-inference",
        "cuda-acceleration",
        "flash-attention-3",
        "paged-attention"
    );
    
    for (String capability : requiredCapabilities) {
        if (!pluginChecker.hasCapability(capability)) {
            System.err.println(pluginChecker.getCapabilityNotAvailableError(capability));
        }
    }
}
```

### Usage with Optimizations

```java
public void runOptimizedInference() {
    // Check all optimizations are available
    checkCapabilities();
    
    // Configure with optimizations
    InferenceRequest request = InferenceRequest.builder()
        .model("llama-3-70b")
        .prompt("Long context question...")
        .maxTokens(2048)
        .parameter("flash_attention", true)
        .parameter("paged_attention", true)
        .parameter("gpu_layers", -1)  // All layers on GPU
        .build();
    
    InferenceResponse response = sdk.createCompletion(request);
    System.out.println(response.getContent());
}
```

### Expected Performance

- **Startup**: ~4-5 seconds
- **Memory**: ~800 MB base
- **Speedup**: 15-40x (vs CPU baseline)

---

## Example 3: Cloud-Only Setup

**Use Case**: Use cloud providers only, no local models

### Required Plugins

```bash
# Install cloud providers
gollek install openai-provider gemini-provider anthropic-provider
```

### Plugin Configuration

```yaml
# ~/.gollek/config.yaml
providers:
  openai:
    api_key: ${OPENAI_API_KEY}
    default_model: gpt-4-turbo
  gemini:
    api_key: ${GOOGLE_API_KEY}
    default_model: gemini-pro
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
    default_model: claude-3-opus
```

### Usage Example

```java
public void runCloudInference() {
    // Check provider availability
    if (!pluginChecker.hasProvider("openai")) {
        System.err.println(pluginChecker.getProviderNotFoundError("openai"));
        System.exit(1);
    }
    
    // Run with cloud provider
    InferenceRequest request = InferenceRequest.builder()
        .model("gpt-4-turbo")
        .preferredProvider("openai")
        .prompt("Explain quantum computing")
        .maxTokens(512)
        .build();
    
    InferenceResponse response = sdk.createCompletion(request);
    System.out.println(response.getContent());
}
```

### Expected Performance

- **Startup**: ~1-2 seconds
- **Memory**: ~300 MB base
- **Latency**: Network dependent (100-500ms)

---

## Example 4: Hybrid Setup (Local + Cloud)

**Use Case**: Local models with cloud fallback

### Required Plugins

```bash
# Install hybrid setup
gollek install gguf-runner cuda-kernel openai-provider
```

### Fallback Configuration

```java
public class InferenceService {
    
    @Inject
    GollekSdk sdk;
    
    @Inject
    PluginAvailabilityChecker pluginChecker;
    
    public InferenceResponse inferWithFallback(String prompt) {
        // Try local first
        if (pluginChecker.hasCapability("gguf-inference")) {
            try {
                InferenceRequest localRequest = InferenceRequest.builder()
                    .model("llama-3-8b")
                    .preferredProvider("gguf")
                    .prompt(prompt)
                    .build();
                
                return sdk.createCompletion(localRequest);
            } catch (Exception e) {
                System.out.println("⚠️  Local inference failed, falling back to cloud");
            }
        }
        
        // Fallback to cloud
        InferenceRequest cloudRequest = InferenceRequest.builder()
            .model("gpt-4-turbo")
            .preferredProvider("openai")
            .prompt(prompt)
            .build();
        
        return sdk.createCompletion(cloudRequest);
    }
}
```

### Expected Performance

- **Startup**: ~3 seconds
- **Memory**: ~600 MB base
- **Flexibility**: Maximum (local + cloud)

---

## Example 5: Multimodal Inference

**Use Case**: Image + text analysis with Safetensor runner

### Required Plugins

```bash
# Install multimodal plugins
gollek install safetensor-runner cuda-kernel
```

### Usage Example

```java
public void runMultimodalInference() {
    // Check multimodal capability
    if (!pluginChecker.hasCapability("multimodal")) {
        System.err.println(pluginChecker.getCapabilityNotAvailableError("multimodal"));
        System.exit(1);
    }
    
    // Create multimodal request
    InferenceRequest request = InferenceRequest.builder()
        .model("llava-1.5")
        .preferredProvider("safetensor")
        .prompt("What's in this image?")
        .parameter("image_url", "https://example.com/image.jpg")
        .maxTokens(512)
        .build();
    
    InferenceResponse response = sdk.createCompletion(request);
    System.out.println(response.getContent());
}
```

### Expected Performance

- **Startup**: ~3-4 seconds
- **Memory**: ~700 MB base
- **Speedup**: 3-5x (with GPU)

---

## Example 6: Long Context with PagedAttention

**Use Case**: Process 100K+ token documents

### Required Plugins

```bash
# Install long context plugins
gollek install safetensor-runner cuda-kernel paged-attention
```

### Usage Example

```java
public void processLongDocument() {
    // Check paged attention capability
    if (!pluginChecker.hasCapability("paged-attention")) {
        System.err.println(pluginChecker.getCapabilityNotAvailableError("paged-attention"));
        System.exit(1);
    }
    
    // Read long document
    String longDocument = Files.readString(Path.of("document.txt"));
    
    // Create request with paged attention
    InferenceRequest request = InferenceRequest.builder()
        .model("llama-3-70b")
        .preferredProvider("safetensor")
        .prompt("Summarize this document: " + longDocument)
        .maxTokens(2048)
        .parameter("paged_attention", true)
        .parameter("block_size", 16)
        .build();
    
    InferenceResponse response = sdk.createCompletion(request);
    System.out.println(response.getContent());
}
```

### Expected Performance

- **Startup**: ~4-5 seconds
- **Memory**: ~1-2 GB (depending on context)
- **Context**: 100K+ tokens supported
- **Speedup**: 2-4x (vs standard KV cache)

---

## Example 7: Plugin Discovery and Listing

**Use Case**: List all available plugins and capabilities

### Discovery Example

```java
public class PluginDiscovery {
    
    @Inject
    PluginAvailabilityChecker pluginChecker;
    
    public void listAllPlugins() {
        Collection<PluginDescriptor> plugins = pluginChecker.getDiscoveredPlugins();
        
        System.out.println("╔═══════════════════════════════════════════════════════════╗");
        System.out.println("║  DISCOVERED PLUGINS                                      ║");
        System.out.println("╚═══════════════════════════════════════════════════════════╝\n");
        
        for (PluginDescriptor plugin : plugins) {
            System.out.printf("Plugin: %s\n", plugin.getId());
            System.out.printf("  Type: %s\n", plugin.getType());
            System.out.printf("  Version: %s\n", plugin.getVersion());
            System.out.printf("  Name: %s\n", plugin.getName());
            System.out.printf("  Capabilities: %s\n", plugin.getCapabilities());
            System.out.printf("  Deployment: %s\n", plugin.getSupportedDeployments());
            
            if (!plugin.getMetadata().isEmpty()) {
                System.out.println("  Metadata:");
                plugin.getMetadata().forEach((k, v) -> 
                    System.out.printf("    %s: %s\n", k, v));
            }
            System.out.println();
        }
    }
    
    public void listAllCapabilities() {
        Set<String> capabilities = pluginChecker.getAvailableCapabilities();
        
        System.out.println("╔═══════════════════════════════════════════════════════════╗");
        System.out.println("║  AVAILABLE CAPABILITIES                                  ║");
        System.out.println("╚═══════════════════════════════════════════════════════════╝\n");
        
        for (String capability : capabilities) {
            List<PluginDescriptor> plugins = pluginChecker.getPluginsForCapability(capability);
            System.out.printf("%s:\n", capability);
            for (PluginDescriptor plugin : plugins) {
                System.out.printf("  • %s (%s)\n", plugin.getId(), plugin.getVersion());
            }
        }
    }
}
```

### Sample Output

```
╔═══════════════════════════════════════════════════════════╗
║  DISCOVERED PLUGINS                                      ║
╚═══════════════════════════════════════════════════════════╝

Plugin: gguf-runner
  Type: runner
  Version: 2.0.0
  Name: GGUF Runner
  Capabilities: [gguf-inference, llama-architecture, mistral-architecture]
  Deployment: [STANDALONE, MICROSERVICE, HYBRID]
  Metadata:
    speedup: 1x (baseline)
    memory_overhead: 50-100MB

Plugin: cuda-kernel
  Type: kernel
  Version: 2.0.0
  Name: CUDA Kernel
  Capabilities: [cuda-acceleration, flash-attention-2, flash-attention-3]
  Deployment: [MICROSERVICE, HYBRID]
  Metadata:
    gpu_requirement: NVIDIA GPU, CUDA 11.0+
    min_compute_capability: 6.0
    speedup: 5-10x (vs CPU)
```

---

## Example 8: Plugin Installation Script

**Use Case**: Automated plugin installation for CI/CD

### Installation Script

```bash
#!/bin/bash
# install-plugins.sh

set -e

PLUGIN_DIR="${HOME}/.gollek/plugins"
PLUGIN_REPO="https://gollek.ai/plugins"

# Create plugin directory
mkdir -p "${PLUGIN_DIR}"

# Function to download plugin
download_plugin() {
    local plugin=$1
    local version=${2:-2.0.0}
    local filename="gollek-plugin-${plugin}-${version}.jar"
    
    echo "Downloading ${plugin}..."
    curl -L -o "${PLUGIN_DIR}/${filename}" "${PLUGIN_REPO}/${filename}"
    
    # Verify download
    if [ -f "${PLUGIN_DIR}/${filename}" ]; then
        echo "✓ ${plugin} installed successfully"
    else
        echo "✗ Failed to install ${plugin}"
        exit 1
    fi
}

# Install minimal setup
echo "Installing minimal local inference setup..."
download_plugin "runner-gguf"
download_plugin "kernel-cuda"

# Install optimizations (optional)
if [ "$1" == "--full" ]; then
    echo "Installing full performance setup..."
    download_plugin "runner-safetensor"
    download_plugin "optimization-fa3"
    download_plugin "optimization-paged-attention"
fi

# Install cloud providers (optional)
if [ "$1" == "--cloud" ]; then
    echo "Installing cloud providers..."
    download_plugin "provider-openai"
    download_plugin "provider-gemini"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  Plugin Installation Complete                            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Plugin directory: ${PLUGIN_DIR}"
echo "Installed plugins:"
ls -1 "${PLUGIN_DIR}"/*.jar
echo ""
echo "Restart the application to use newly installed plugins."
```

### Usage

```bash
# Install minimal setup
./install-plugins.sh

# Install full setup with all optimizations
./install-plugins.sh --full

# Install cloud providers
./install-plugins.sh --cloud

# Install everything
./install-plugins.sh --full --cloud
```

---

## Example 9: Plugin Compatibility Check

**Use Case**: Verify plugin compatibility before deployment

### Compatibility Checker

```java
public class PluginCompatibilityChecker {
    
    @Inject
    PluginAvailabilityChecker pluginChecker;
    
    public CompatibilityReport checkCompatibility() {
        CompatibilityReport report = new CompatibilityReport();
        
        // Check deployment mode
        DeploymentMode mode = pluginChecker.getDeploymentMode();
        report.setDeploymentMode(mode);
        
        // Check required plugins
        List<String> requiredPlugins = getRequiredPlugins();
        for (String pluginId : requiredPlugins) {
            Optional<PluginDescriptor> plugin = pluginChecker.getPlugin(pluginId);
            if (plugin.isPresent()) {
                if (!plugin.get().supportsDeployment(mode)) {
                    report.addIncompatibility(
                        String.format("Plugin %s does not support %s mode", 
                            pluginId, mode));
                }
            } else {
                report.addMissingPlugin(pluginId);
            }
        }
        
        // Check dependencies
        for (PluginDescriptor plugin : pluginChecker.getDiscoveredPlugins()) {
            for (String dep : plugin.getDependencies()) {
                if (!pluginChecker.hasPlugin(dep)) {
                    report.addMissingDependency(plugin.getId(), dep);
                }
            }
        }
        
        // Check GPU requirements
        for (PluginDescriptor plugin : pluginChecker.getDiscoveredPlugins()) {
            if (plugin.getMetadata().containsKey("gpu_requirement")) {
                if (!checkGpuRequirements(plugin)) {
                    report.addGpuRequirementNotMet(plugin.getId(), 
                        plugin.getMetadata("gpu_requirement"));
                }
            }
        }
        
        return report;
    }
    
    private boolean checkGpuRequirements(PluginDescriptor plugin) {
        // Check if GPU meets requirements
        String gpuRequirement = plugin.getMetadata("gpu_requirement");
        int minComputeCap = Integer.parseInt(
            plugin.getMetadata().getOrDefault("min_compute_capability", "0"));
        
        // Get actual GPU info (implementation depends on platform)
        int actualComputeCap = getGpuComputeCapability();
        
        return actualComputeCap >= minComputeCap;
    }
}
```

### Sample Report

```
╔═══════════════════════════════════════════════════════════╗
║  PLUGIN COMPATIBILITY REPORT                             ║
╚═══════════════════════════════════════════════════════════╝

Deployment Mode: HYBRID

✓ All required plugins present
✓ All dependencies satisfied
✓ GPU requirements met

Compatible: YES

Plugins:
  • gguf-runner (2.0.0) - Compatible
  • cuda-kernel (2.0.0) - Compatible
  • flash-attention-3 (2.0.0) - Compatible
```

---

## Resources

- **[Plugin System v2.0 Documentation](/docs/plugins/plugin-system-v2)** - Complete guide
- **[Manifest-Based Plugin System](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/MANIFEST_BASED_PLUGIN_SYSTEM.md)** - Technical details
- **[Plugin Repository](https://gollek.ai/plugins)** - Download plugins

---

[Back to Plugin System v2.0](/docs/plugins/plugin-system-v2) &nbsp; [Setup Docs](/docs/setup/) &nbsp; [Migration Guide](/docs/plugins/plugin-migration)
