# Kernel Auto-Detection Guide

**Date**: 2026-03-25  
**Version**: 2.0.0  
**Status**: ✅ **COMPLETE**

---

## Overview

The Gollek platform v2.0 features automatic kernel platform detection with intelligent fallback to CPU when GPU acceleration is not available. Users can also override auto-detection to force CPU usage or select a specific platform.

---

## Auto-Detection Order

The system detects available platforms in the following priority order:

1. **Metal** (Apple Silicon M1/M2/M3/M4) - Priority: 100
2. **CUDA** (NVIDIA GPU) - Priority: 90
3. **ROCm** (AMD GPU) - Priority: 85
4. **DirectML** (Windows DirectX) - Priority: 80
5. **CPU** (Fallback) - Priority: 0

The first available platform is automatically selected.

---

## Detection Logic

### Metal (Apple Silicon)

**Requirements**:
- macOS operating system
- ARM64/aarch64 architecture (Apple Silicon)
- Metal framework available

**Detection**:
```java
String os = System.getProperty("os.name").toLowerCase();
String arch = System.getProperty("os.arch");

if (os.contains("mac") && (arch.contains("aarch64") || arch.contains("arm64"))) {
    return true; // Metal available
}
```

### CUDA (NVIDIA)

**Requirements**:
- CUDA libraries installed
- NVIDIA GPU present
- CUDA device count > 0

**Detection**:
```java
// Check CUDA class availability
if (!isClassAvailable("org.bytedeco.cuda.cudart.CUDA")) {
    return false;
}

// Check device count
int[] deviceCount = new int[1];
cudaGetDeviceCount(deviceCount);
return deviceCount[0] > 0;
```

### ROCm (AMD)

**Requirements**:
- ROCm libraries installed
- ROCM_PATH environment variable or /opt/rocm directory exists

**Detection**:
```java
if (!isClassAvailable("org.bytedeco.rocm.hipRuntime")) {
    return false;
}

String rocmPath = System.getenv("ROCM_PATH");
if (rocmPath == null) {
    rocmPath = "/opt/rocm";
}

return Files.exists(Paths.get(rocmPath));
```

### DirectML (Windows)

**Requirements**:
- Windows operating system
- DirectX 12 support
- DirectML libraries available

**Detection**:
```java
String os = System.getProperty("os.name").toLowerCase();
if (!os.contains("windows")) {
    return false;
}

return isClassAvailable("org.bytedeco.directml.DirectML");
```

### CPU (Fallback)

**Always available** - Used when no GPU platform is detected or when explicitly forced.

---

## CLI Flags

The Gollek CLI provides three intuitive flags for platform control:

### `--use-cpu` (Force CPU)

**Description**: Use CPU instead of GPU (disable GPU acceleration)

**Use Case**: Development, debugging, testing without GPU dependencies

**Example**:
```bash
gollek --use-cpu run --model llama-3-8b --prompt "Hello"

# Output:
# ⚠️  CPU usage enabled (GPU acceleration disabled)
# Platform: CPU
# ⚠️  Running on CPU (GPU acceleration not available)
```

### `--enable-cpu` (Enable CPU Fallback)

**Description**: Enable CPU fallback (auto-detect GPU, use CPU if not available)

**Use Case**: Production reliability, ensure inference always works

**Example**:
```bash
gollek --enable-cpu run --model llama-3-8b --prompt "Hello"

# Output (GPU available):
# Platform: CUDA
# ✓ GPU acceleration enabled

# Output (GPU not available):
# Platform: CPU
# ⚠️  Running on CPU (GPU acceleration not available)
```

### `--platform <platform>` (Force Platform)

**Description**: Force specific kernel platform

**Use Case**: Testing specific platform, workaround compatibility issues

**Supported Platforms**: `metal`, `cuda`, `rocm`, `directml`, `cpu`

**Example**:
```bash
gollek --platform cuda run --model llama-3-8b --prompt "Hello"

# Output:
# ⚠️  Kernel platform forced to: cuda
# Platform: CUDA
# ✓ GPU acceleration enabled
```

### SDK Usage

#### Auto-Detect (Default)

```java
@Inject
GollekSdk sdk;

public void runInference() {
    // Auto-detection happens automatically
    InferenceRequest request = InferenceRequest.builder()
        .model("llama-3-8b")
        .prompt("Hello")
        .build();
    
    InferenceResponse response = sdk.createCompletion(request);
    System.out.println(response.getContent());
}
```

#### Force CPU Usage

```java
public void runOnCpu() {
    // Force CPU via system property
    System.setProperty("gollek.kernel.force.cpu", "true");
    
    // Or use SDK configuration
    InferenceRequest request = InferenceRequest.builder()
        .model("llama-3-8b")
        .prompt("Hello")
        .parameter("force_cpu", true)
        .build();
    
    InferenceResponse response = sdk.createCompletion(request);
    System.out.println(response.getContent());
}
```

#### Force Specific Platform

```java
public void runOnSpecificPlatform() {
    // Force platform via system property
    System.setProperty("gollek.kernel.platform", "metal");
    
    InferenceRequest request = InferenceRequest.builder()
        .model("llama-3-8b")
        .prompt("Hello")
        .build();
    
    InferenceResponse response = sdk.createCompletion(request);
    System.out.println(response.getContent());
}
```

#### Check Available Platforms

```java
@Inject
PluginAvailabilityChecker pluginChecker;

public void checkAvailablePlatforms() {
    List<KernelPlatform> available = KernelPlatformDetector.getAvailablePlatforms();
    
    System.out.println("Available platforms:");
    for (KernelPlatform platform : available) {
        System.out.printf("  • %s - %s%n", 
            platform.getDisplayName(),
            platform.getDescription());
    }
}
```

#### Get Platform Metadata

```java
public void getPlatformInfo() {
    KernelPlatform platform = KernelPlatformDetector.detect();
    
    System.out.printf("Detected platform: %s%n", platform.getDisplayName());
    System.out.printf("Description: %s%n", platform.getDescription());
    System.out.printf("Is GPU: %s%n", platform.isGpu());
    System.out.printf("Is CPU: %s%n", platform.isCpu());
    
    Map<String, String> metadata = KernelPlatformDetector.getPlatformMetadata(platform);
    System.out.println("Metadata:");
    metadata.forEach((k, v) -> System.out.printf("  %s: %s%n", k, v));
}
```

---

## Configuration

### System Properties

| Property | CLI Flag | Description | Values | Default |
|----------|----------|-------------|--------|---------|
| `gollek.kernel.force.cpu` | `--use-cpu` | Force CPU usage | `true`, `false` | `false` |
| `gollek.kernel.cpu.fallback` | `--enable-cpu` | Enable CPU fallback | `true`, `false` | `false` |
| `gollek.kernel.platform` | `--platform` | Force specific platform | `metal`, `cuda`, `rocm`, `directml`, `cpu` | Auto-detect |

### CLI Options

| Option | Description | Example |
|--------|-------------|---------|
| `--use-cpu` | Use CPU instead of GPU (force CPU) | `gollek run --use-cpu ...` |
| `--enable-cpu` | Enable CPU fallback (use CPU if GPU not available) | `gollek run --enable-cpu ...` |
| `--platform <platform>` | Force specific platform | `gollek run --platform cuda ...` |

---

## Performance Comparison

### Platform Performance (Llama-3-8B)

| Platform | Tokens/s | Relative Speed | Memory |
|----------|----------|----------------|--------|
| **Metal (M2 Max)** | 45-55 | 8-10x | 16 GB |
| **CUDA (A100)** | 100-120 | 15-20x | 40 GB |
| **CUDA (RTX 4090)** | 80-100 | 12-15x | 24 GB |
| **ROCm (MI250)** | 70-90 | 10-14x | 128 GB |
| **DirectML (RTX 4090)** | 60-80 | 9-12x | 24 GB |
| **CPU (M2 Max)** | 5-7 | 1x | 16 GB |
| **CPU (Intel i9)** | 3-5 | 0.6-0.8x | 64 GB |

### When to Use CPU

**Recommended scenarios**:
- Debugging and development
- Testing without GPU dependencies
- Low-power mode
- GPU compatibility issues
- Small models (<3B parameters)

**Not recommended for**:
- Production inference
- Large models (>7B parameters)
- Real-time applications
- Batch processing

---

## Troubleshooting

### Platform Not Detected

**Symptom**: System falls back to CPU when GPU should be available

**Solutions**:
1. Check GPU drivers are installed
2. Verify libraries are in classpath
3. Check environment variables:
   ```bash
   # CUDA
   echo $CUDA_HOME
   nvcc --version
   
   # ROCm
   echo $ROCM_PATH
   rocminfo
   
   # Metal
   system_profiler SPDisplaysDataType
   ```
4. Restart application

### Force CPU Not Working

**Symptom**: `--use-cpu` flag doesn't force CPU usage

**Solutions**:
1. Verify flag is before other commands:
   ```bash
   # Correct
   gollek --use-cpu run --model llama-3-8b
   
   # May not work
   gollek run --model llama-3-8b --use-cpu
   ```
2. Use system property instead:
   ```bash
   java -Dgollek.kernel.force.cpu=true -jar gollek-cli.jar run ...
   ```

### Wrong Platform Selected

**Symptom**: System selects wrong platform

**Solutions**:
1. Force specific platform:
   ```bash
   gollek run --platform cuda --model llama-3-8b
   ```
2. Check platform priorities in logs
3. Verify other platforms are not available

---

## Examples

### Example 1: Check Available Platforms

```bash
# List all available platforms
gollek info --platforms

# Output:
# Available platforms:
#   • Metal - Apple Silicon GPU acceleration
#   • CPU - CPU-only execution
```

### Example 2: Benchmark Different Platforms

```bash
# Benchmark on Metal
gollek run --model llama-3-8b --prompt "Hello" --platform metal --stats

# Benchmark on CPU
gollek run --model llama-3-8b --prompt "Hello" --use-cpu --stats

# Compare results
```

### Example 3: Development with CPU

```bash
# Use CPU for development (faster iteration, no GPU overhead)
gollek --use-cpu run --model llama-3-8b --prompt "Debug test"

# Output:
# ⚠️  CPU usage enabled (GPU acceleration disabled)
# Platform: CPU
# ⚠️  Running on CPU (GPU acceleration not available)
```

### Example 4: Enable CPU Fallback

```bash
# Enable CPU fallback (auto-detect GPU, use CPU if not available)
gollek --enable-cpu run --model llama-3-8b --prompt "Test"

# Output (if GPU available):
# Platform: CUDA
# ✓ GPU acceleration enabled

# Output (if GPU not available):
# Platform: CPU
# ⚠️  Running on CPU (GPU acceleration not available)
```

### Example 5: Production with Auto-Detect

```bash
# Let system choose best platform for production
gollek run --model llama-3-70b --prompt "Production query"

# Output:
# Platform: CUDA
# ✓ GPU acceleration enabled
```

---

## API Reference

### KernelPlatformDetector

```java
// Detect best available platform
KernelPlatform platform = KernelPlatformDetector.detect();

// Get all available platforms
List<KernelPlatform> available = KernelPlatformDetector.getAvailablePlatforms();

// Check if platform is available
boolean isCudaAvailable = KernelPlatformDetector.isPlatformAvailable(KernelPlatform.CUDA);

// Get platform metadata
Map<String, String> metadata = KernelPlatformDetector.getPlatformMetadata(KernelPlatform.METAL);
```

### KernelPlatform

```java
// Enum values
KernelPlatform.METAL      // Apple Metal
KernelPlatform.CUDA       // NVIDIA CUDA
KernelPlatform.ROCM       // AMD ROCm
KernelPlatform.DIRECTML   // Microsoft DirectML
KernelPlatform.CPU        // CPU fallback

// Methods
platform.getDisplayName()    // Human-readable name
platform.getDescription()    // Description
platform.isGpu()            // Is GPU-based
platform.isCpu()            // Is CPU-based
```

---

## Resources

- **[Plugin System v2.0](/docs/plugins/plugin-system-v2)** - Complete plugin documentation
- **[Kernel Plugins](/docs/plugins/enhanced-plugin-architecture)** - Kernel plugin details
- **[Performance Guide](/docs/optimization-config)** - Performance optimization

---

[Back to Plugin System v2.0](/docs/plugins/plugin-system-v2) &nbsp; [Kernel Plugins](/docs/plugins/enhanced-plugin-architecture) &nbsp; [Performance Guide](/docs/optimization-config)
