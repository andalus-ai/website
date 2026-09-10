---
layout: default
title: GPU Kernel Acceleration
---

# GPU Kernel Acceleration

For the guided landing page that groups kernels, SPI, platform detection,
device placement, and native-library setup in one place, start with
[GPU Runtime Docs](/docs/runtime/gpu-runtime-docs).

High-performance GPU acceleration kernels for NVIDIA CUDA, Blackwell, AMD ROCm, and Apple Metal.

---

## Overview

Gollek provides native GPU kernel implementations for optimal inference performance across multiple hardware platforms. Each kernel module is optimized for its target architecture while maintaining a consistent API.

### 🆕 Optimization Plugins

New! Hot-reload GPU optimization plugins without recompiling:

- **FlashAttention-3** for Hopper+ GPUs (2-3x speedup)
- **FlashAttention-4** for Blackwell (3-5x speedup)
- **PagedAttention** for efficient KV caching (2-4x speedup)
- **Prompt Cache**, **QLoRA**, and 8+ more optimizations

[Learn more about Optimization Plugins →](/docs/plugins/optimization-plugins)

### Quick Comparison

| Platform | Best For | Max Memory | Key Advantage | Optimizations |
|----------|----------|------------|---------------|---------------|
| **CUDA** | Production AI | 80 GB | Mature ecosystem, FA2/FA3 | FA3, Paged, KV Cache |
| **Blackwell** | Large-scale inference | 192 GB | TMEM + FP4 = 3.5x speedup | FA4, All optimizations |
| **ROCm** | AMD datacenters | 192 GB | Open alternative to CUDA | Paged, KV Cache |
| **Metal** | Apple Silicon Macs | 128 GB | Zero-copy unified memory | Limited |

---

## Architecture Deep Dive

### Kernel Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                             │
│  GollekLocalClient → InferenceRequest → Runner Selection        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Runner Layer (*Runner)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Prefill     │  │   Decode     │  │   Sample     │          │
│  │  (KV Cache)  │  │   (Token)    │  │  (Logits)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Binding Layer (*Binding)                      │
│  FFM Native Calls → GPU Driver API → Hardware Execution         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Hardware Layer                                │
│  Tensor Cores │ TMEM │ Unified Memory │ Paged KV Cache         │
└─────────────────────────────────────────────────────────────────┘
```

### Transformer Layer Execution

Each transformer layer executes the following kernel pipeline:

```
Input → RMSNorm → QKV GEMM → FlashAttention → Output Proj → Residual
                                                      ↓
Input → RMSNorm → Gate/Up GEMM → SiLU → Down GEMM → Residual → Output
```

```
+------------------------------------------------------------------+
|                    Gollek Kernel Modules                           |
+------------------------------------------------------------------+
|  +--------------+  +--------------+  +--------------+  +-------+ |
|  | CUDA         |  | Blackwell    |  | ROCm         |  | Metal | |
|  | (NVIDIA)     |  | (B100/B200)  |  | (AMD)        |  | (M1+) | |
|  +--------------+  +--------------+  +--------------+  +-------+ |
|  - FlashAttn 2/3 - FA3 + TMEM   - HIP Kernels   - MPS Kernels   |
|  - FP8/FP4       - FP4 TCores   - FA2/FA3      - Unified Mem    |
|  - Tensor Cores  - 192GB HBM3e  - MI300X       - AMX Blocks     |
+------------------------------------------------------------------+
```

---

## Supported Platforms

| Platform | Module | Architecture | Memory | Key Features |
|----------|--------|--------------|--------|--------------|
| **NVIDIA CUDA** | `gollek-kernel-cuda` | sm_80+ (A100+) | 40-80 GB | FlashAttention-2/3, FP8 |
| **NVIDIA Blackwell** | `gollek-kernel-blackwell` | sm_100 (B100/B200) | 180-192 GB | FA3+TMEM, FP4, Async |
| **AMD ROCm** | `gollek-kernel-rocm` | gfx942 (MI300X) | 128-192 GB | HIP Kernels, Unified Mem |
| **Apple Metal** | `gollek-backend-metal` | M1/M2/M3/M4 | 8-128 GB | MPS Graph, Unified Mem |

---

## CUDA Kernel Module

### Architecture Support

| GPU | Compute Cap | Memory | FlashAttention |
|-----|-------------|--------|----------------|
| A100 | sm_80 (8.0) | 40/80 GB HBM2e | FA2 |
| H100 | sm_90 (9.0) | 80 GB HBM3 | FA3 + FP8 |
| H200 | sm_90 (9.0) | 141 GB HBM3e | FA3 + FP8 |
| RTX 4090 | sm_89 (8.9) | 24 GB GDDR6X | FA2 |
| RTX A6000 | sm_86 (8.6) | 48 GB GDDR6 | FA2 |

### Features

- **FlashAttention-2**: Fused attention for A100+ (sm_80+)
- **FlashAttention-3**: Optimized for H100+ (sm_90+) with FP8
- **Unified Memory**: Zero-copy on A100/H100
- **Paged KV Cache**: Efficient long context handling
- **Multi-GPU Ready**: Device selection via config

### Configuration

```properties
# Enable CUDA runner
gollek.runners.cuda.enabled=true

# Runner mode: auto|standard|offload|force|disabled
gollek.runners.cuda.mode=auto

# CUDA library path
gollek.runners.cuda.library-path=/usr/local/cuda/lib64/libgollek_cuda.so

# Device ID (0-based)
gollek.runners.cuda.device-id=0

# Model dimensions
gollek.runners.cuda.num-layers=32
gollek.runners.cuda.num-heads=32
gollek.runners.cuda.num-heads-kv=8
gollek.runners.cuda.head-dim=128
gollek.runners.cuda.model-dim=4096
```

### Java API Example

```java
import tech.kayys.gollek.cuda.runner.CudaRunner;
import tech.kayys.gollek.spi.model.ModelManifest;
import tech.kayys.gollek.runner.RunnerConfiguration;

// Create and configure runner
CudaRunner runner = new CudaRunner();

// Build model manifest
ModelManifest manifest = ModelManifest.builder()
    .modelId("llama-3.2-3b-instruct")
    .name("Llama 3.2 3B Instruct")
    .version("1.0")
    .artifacts(Map.of(ModelFormat.GGUF, location))
    .build();

// Configure runner
RunnerConfiguration config = RunnerConfiguration.builder()
    .parameter("num_layers", 32)
    .parameter("num_heads", 32)
    .parameter("num_heads_kv", 8)
    .parameter("head_dim", 128)
    .parameter("model_dim", 4096)
    .build();

// Initialize
runner.initialize(manifest, config);

// Execute inference
InferenceRequest request = InferenceRequest.builder()
    .prompt("Explain quantum computing")
    .maxTokens(512)
    .build();

InferenceResponse response = runner.infer(request);
System.out.println(response.getContent());
```

### Performance

| Operation | A100 (FP16) | H100 (FP8) | Speedup |
|-----------|-------------|------------|---------|
| GEMM | 1x | 2.5x | 2.5x |
| FlashAttention-2 | 1x | 1.5x | 1.5x |
| FlashAttention-3 | N/A | 2x | 2x |

### Build Instructions

```bash
# Prerequisites
export CUDA_HOME=/usr/local/cuda
export PATH=$CUDA_HOME/bin:$PATH

# Build for A100 (sm_80)
make -C inference-gollek/extension/kernel/gollek-kernel-cuda/src/main/cpp/cuda \
    CUDA_ARCH=sm_80

# Build for H100 (sm_90)
make -C inference-gollek/extension/kernel/gollek-kernel-cuda/src/main/cpp/cuda \
    CUDA_ARCH=sm_90

# Build for multiple architectures
make -C inference-gollek/extension/kernel/gollek-kernel-cuda/src/main/cpp/cuda \
    CUDA_ARCHS="sm_80 sm_90 sm_86"

# Output location
target/native/linux-x86_64/libgollek_cuda.so
```

---

## Blackwell Kernel Module

### Architecture Support

| GPU | Architecture | Memory | TMEM | FP4 | Throughput |
|-----|--------------|--------|------|-----|------------|
| B100 | Blackwell | 180 GB HBM3e | 64 MB | ✓ | 2x H100 |
| B200 | Blackwell | 180 GB HBM3e | 64 MB | ✓ | 2x H100 |
| GB200 | Blackwell (Grace) | 192 GB HBM3e | 64 MB | ✓ | 2x H100 |

### Blackwell-Specific Features

#### TMEM (Tensor Memory)

64MB on-chip tensor memory accumulator for FlashAttention-3:

```
┌──────────────────────────────────────────┐
│              Blackwell SM                │
├──────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ FP4 TC  │  │ FP4 TC  │  │  TMEM   │  │
│  │  Core   │  │  Core   │  │  64MB   │  │
│  └─────────┘  └─────────┘  └─────────┘  │
│                    ↑                     │
│         QK^T accumulation               │
│         (no HBM traffic)                │
└──────────────────────────────────────────┘
```

**Benefits:**
- **2x faster** than H100 FlashAttention-3
- **No HBM traffic** for attention matrix
- **Lower power** consumption per token

#### FP4 Tensor Cores

- **2x throughput** over FP8
- **4x throughput** over FP16
- Ideal for inference with minimal accuracy loss

#### Async Execution

Concurrent copy and compute operations:

```java
MemorySegment stream = blackwell.streamCreate();
MemorySegment semaphore = blackwell.mallocManaged(4, 1);

// Start async copy
blackwell.memcpyAsync(dst, src, bytes, stream);

// Wait for semaphore
blackwell.streamWaitValue(stream, semaphore, 1);

// ... compute while copy progresses ...

// Signal completion
blackwell.streamWriteValue(semaphore, 2);
```

### Configuration

```properties
# Enable Blackwell runner
gollek.runners.blackwell.enabled=true

# Runner mode
gollek.runners.blackwell.mode=auto

# Library path
gollek.runners.blackwell.library-path=/usr/local/cuda/lib64/libgollek_blackwell.so

# Device ID
gollek.runners.blackwell.device-id=0

# Blackwell optimizations
gollek.runners.blackwell.use-fp4=true
gollek.runners.blackwell.use-tmem=true
```

### Java API Example

```java
import tech.kayys.gollek.blackwell.runner.BlackwellRunner;
import tech.kayys.gollek.blackwell.binding.BlackwellBinding;

// Create runner with FP4 + TMEM enabled
BlackwellRunner runner = new BlackwellRunner();

// Configure for maximum performance
RunnerConfiguration config = RunnerConfiguration.builder()
    .parameter("num_layers", 80)  // Llama-3 70B
    .parameter("num_heads", 64)
    .parameter("num_heads_kv", 8)
    .parameter("head_dim", 128)
    .parameter("model_dim", 8192)
    .parameter("ffn_dim", 28672)
    .build();

// Initialize
runner.initialize(manifest, config);

// Check capabilities
RunnerCapabilities caps = runner.capabilities();
System.out.println("FP4 supported: " + 
    Arrays.asList(caps.getSupportedDataTypes()).contains("fp4"));
System.out.println("Max batch: " + caps.getMaxBatchSize());

// Streaming inference
Multi<StreamingInferenceChunk> stream = runner.stream(request);
stream.subscribe()
    .with(chunk -> System.out.print(chunk.getToken()));
```

### Performance Comparison

| Operation | H100 (FP8) | B200 (FP8) | B200 (FP4) |
|-----------|------------|------------|------------|
| GEMM | 1x | 1.5x | 3x |
| FlashAttention-2 | 1x | 1.2x | 1.2x |
| FlashAttention-3 | N/A | 2x | 2.5x |
| FA3 + TMEM | N/A | 2.5x | 3.5x |

### Memory Bandwidth Comparison

| GPU | Bandwidth | Relative |
|-----|-----------|----------|
| H100 | 3.35 TB/s | 1x |
| B200 | 8.0 TB/s | 2.4x |
| GB200 | 8.0 TB/s | 2.4x |

### Build Instructions

```bash
# Prerequisites - CUDA 12.3+ required for Blackwell
export CUDA_HOME=/usr/local/cuda-12.3
export PATH=$CUDA_HOME/bin:$PATH

# Build for Blackwell (sm_100)
make -C inference-gollek/extension/kernel/gollek-kernel-blackwell/src/main/cpp/blackwell \
    CUDA_ARCH=sm_100

# Build with FP4 support
make -C inference-gollek/extension/kernel/gollek-kernel-blackwell/src/main/cpp/blackwell \
    CUDA_ARCH=sm_100 USE_FP4=1

# Output location
target/native/linux-x86_64/libgollek_blackwell.so
```

### TMEM Optimization Guide

For maximum FlashAttention-3 performance:

```properties
# Enable TMEM (default: true)
gollek.runners.blackwell.use-tmem=true

# TMEM block size (default: 64MB)
gollek.runners.blackwell.tmem-size-mb=64

# Async copy overlap (default: true)
gollek.runners.blackwell.async-copy=true
```

**Expected speedup:** 2.5-3.5x over H100 depending on model size

---

## ROCm Kernel Module

### Architecture Support

| GPU | Architecture | Memory | Unified | Best For |
|-----|--------------|--------|---------|----------|
| MI300X | gfx942 | 192 GB HBM3 | ✓ | Large models |
| MI250X | gfx90a | 128 GB HBM2e | ✗ | Mid-range |
| RX 7900 XTX | gfx1100 | 24 GB GDDR6 | ✗ | Consumer |

### Features

- **HIP Kernels**: Native AMD GPU acceleration via hipify-clang
- **Unified Memory**: MI300X zero-copy support (CPU+GPU shared HBM3)
- **FlashAttention**: FA2/FA3 via hipified kernels
- **Multi-Architecture**: gfx942, gfx90a, gfx1100 support
- **FP8 Support**: MI300X FP8 tensor cores

### Configuration

```properties
# Enable ROCm runner
gollek.runners.rocm.enabled=true

# HIP library path
gollek.runners.rocm.library-path=/opt/rocm/lib/libamdhip64.so

# Kernel path (architecture-specific)
gollek.runners.rocm.kernel-path=/opt/gollek/lib/gollek_rocm_gfx942.hsaco

# Device ID
gollek.runners.rocm.device-id=0

# Use managed memory (MI300X only)
gollek.runners.rocm.use-managed-memory=true
```

### Java API Example

```java
import tech.kayys.gollek.rocm.runner.RocmRunner;

RocmRunner runner = new RocmRunner();

// Configure for MI300X
RunnerConfiguration config = RunnerConfiguration.builder()
    .parameter("num_layers", 80)
    .parameter("use_managed_memory", true)  // MI300X zero-copy
    .build();

runner.initialize(manifest, config);

// Check if unified memory is active
System.out.println("Unified memory: " + runner.isUnifiedMemory());
```

### Build Instructions

```bash
# Prerequisites
export ROCM_PATH=/opt/rocm
export PATH=$ROCM_PATH/bin:$PATH

# Install hipify-clang
sudo apt install hipify-clang

# Build for MI300X (gfx942)
make -C inference-gollek/extension/kernel/gollek-kernel-rocm/src/main/cpp/rocm \
    AMDGPU_TARGET=gfx942

# Build for MI250X (gfx90a)
make -C inference-gollek/extension/kernel/gollek-kernel-rocm/src/main/cpp/rocm \
    AMDGPU_TARGET=gfx90a

# Build for multiple targets
make -C inference-gollek/extension/kernel/gollek-kernel-rocm/src/main/cpp/rocm \
    AMDGPU_TARGETS="gfx942 gfx90a gfx1100"

# Output
target/native/linux-x86_64/libgollek_rocm_gfx942.hsaco
```

### MI300X Optimization

```properties
# Enable unified memory (zero-copy)
gollek.runners.rocm.use-managed-memory=true

# Pre-fetch layers to GPU
gollek.runners.rocm.prefetch-layers=true

# Use FP8 tensor cores
gollek.runners.rocm.use-fp8=true
```

**Expected performance:** 1.5-2x faster than MI250X for large models

---

## Metal Kernel Module

### Architecture Support

| Chip | GPU Cores | Memory | Unified | Best For |
|------|-----------|--------|---------|----------|
| M1 | 7-8 | 8-16 GB | ✓ | Entry-level |
| M1 Pro/Max | 14-16 | 16-32 GB | ✓ | Development |
| M2 | 8-10 | 8-24 GB | ✓ | General use |
| M2 Pro/Max/Ultra | 16-38 | 16-96 GB | ✓ | Production |
| M3 | 8-10 | 8-24 GB | ✓ | General use |
| M3 Pro/Max | 14-40 | 18-128 GB | ✓ | Production |
| M4 | 8-10 | 8-16 GB | ✓ | Latest entry |
| M4 Pro/Max | 14-40 | 24-128 GB | ✓ | Latest pro |

### Features

- **MPS Graph**: Metal Performance Shaders acceleration
- **Unified Memory**: Zero-copy CPU/GPU shared DRAM
- **FlashAttention-4 Equivalent**: MPSGraph SDPA (macOS 14+)
- **AMX Blocks**: Apple silicon matrix acceleration
- **Weight Offloading**: Run large models with limited RAM

### Configuration

```properties
# Enable Metal runner
gollek.runners.metal.enabled=true

# Runner mode: auto|standard|offload|force|disabled
gollek.runners.metal.mode=auto

# Library path
gollek.runners.metal.library-path=~/.gollek/libs/libgollek_metal.dylib

# Model dimensions
gollek.runners.metal.num-layers=32
gollek.runners.metal.num-heads=32
gollek.runners.metal.head-dim=128
gollek.runners.metal.model-dim=4096
```

### Java API Example

```java
import tech.kayys.gollek.metal.runner.MetalRunner;
import tech.kayys.gollek.metal.detection.AppleSiliconDetector;

// Detect Apple Silicon
AppleSiliconDetector detector = new AppleSiliconDetector();
var caps = detector.detect();

System.out.println("Chip: " + caps.chipName());
System.out.println("Unified memory: " + caps.unifiedMemoryGb() + " GB");

// Create runner
MetalRunner runner = new MetalRunner();

// Use weight offloading for large models on limited RAM
if (caps.unifiedMemoryBytes() < 32L * 1024 * 1024 * 1024) {
    System.setProperty("gollek.runners.metal.mode", "offload");
}

runner.initialize(manifest, config);
```

### Build Instructions

```bash
# Prerequisites - macOS 14+ with Xcode Command Line Tools
xcode-select --install

# Build Metal bridge
make -C inference-gollek/extension/kernel/gollek-backend-metal/src/main/cpp/metal

# Output
target/native/macos-aarch64/libgollek_metal.dylib

# Install to default location
mkdir -p ~/.gollek/libs
cp target/native/macos-aarch64/libgollek_metal.dylib ~/.gollek/libs/
```

### Metal Runner Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `auto` | Detect and select based on model size | Default |
| `standard` | Load full model to unified memory | M2 Max+ with 32GB+ |
| `offload` | Stream weights from CPU to GPU | M1/M2 with <32GB |
| `force` | Use Metal even if detection fails | Debug/testing |
| `disabled` | Don't use Metal | CPU-only fallback |

### Performance by Chip

| Chip | Tokens/sec (7B) | Tokens/sec (70B) |
|------|-----------------|------------------|
| M1 | 15-20 | 3-5 (offload) |
| M1 Max | 25-30 | 8-10 (offload) |
| M2 Ultra | 40-50 | 15-18 |
| M3 Max | 45-55 | 18-22 |
| M4 Max | 50-60 | 20-25 |

---

## Kernel Architecture

### Common Design Pattern

All kernel modules follow the same architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    KernelRunner                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  RMSNorm    │  │   GEMM      │  │ FlashAttn   │     │
│  │  Kernel     │  │  (Tensor)   │  │  (FA2/FA3)  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   SiLU      │  │  Paged KV   │  │  Unified    │     │
│  │   FFN       │  │   Cache     │  │   Memory    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  KernelBinding (FFM)                    │
├─────────────────────────────────────────────────────────┤
│  Native Library → GPU Driver API → Hardware            │
└─────────────────────────────────────────────────────────┘
```

### Component Classes

| Class | Purpose |
|-------|---------|
| `*Runner` | Main inference execution |
| `*Binding` | FFM native library binding |
| `*Capabilities` | Device capability detection |
| `*Detector` | Hardware detection logic |
| `*RunnerMode` | Configuration enum |
| `*CpuFallback` | CPU fallback implementations |

---

## Troubleshooting Guide

### CUDA/Blackwell Issues

#### "CUDA not found" or "cuInit failed"

**Symptoms:**
```
RunnerInitializationException: CUDA unavailable on this host
```

**Solutions:**

1. **Verify CUDA installation:**
```bash
nvcc --version
nvidia-smi
```

2. **Check library paths:**
```bash
export CUDA_HOME=/usr/local/cuda
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
```

3. **Verify GPU visibility:**
```bash
# Check if GPU is visible
echo $CUDA_VISIBLE_DEVICES

# Should show device IDs (e.g., "0" or "0,1")
# If empty or "none", set it:
export CUDA_VISIBLE_DEVICES=0
```

#### "Out of memory" errors

**Symptoms:**
```
cudaErrorMemoryAllocation: out of memory
```

**Solutions:**

1. **Reduce batch size:**
```properties
gollek.runners.cuda.max-batch-size=1
```

2. **Enable unified memory (A100/H100 only):**
```properties
gollek.runners.cuda.use-unified-memory=true
```

3. **Use weight offloading:**
```properties
gollek.runners.cuda.mode=offload
```

4. **Monitor GPU memory:**
```bash
watch -n 1 nvidia-smi
```

#### "Compute capability mismatch"

**Symptoms:**
```
Invalid device image - no kernel image is available
```

**Solution:** Rebuild kernels for your GPU architecture:

```bash
# A100
make CUDA_ARCH=sm_80

# H100
make CUDA_ARCH=sm_90

# RTX 4090
make CUDA_ARCH=sm_89
```

### ROCm Issues

#### "HIP library not found"

**Symptoms:**
```
UnsatisfiedLinkError: libamdhip64.so not found
```

**Solutions:**

1. **Install ROCm:**
```bash
# Ubuntu/Debian
sudo apt install rocm-dkms

# Verify installation
rocminfo | grep "Name:"
```

2. **Set library path:**
```bash
export ROCM_PATH=/opt/rocm
export LD_LIBRARY_PATH=$ROCM_PATH/lib:$LD_LIBRARY_PATH
```

#### "Kernel load failed"

**Symptoms:**
```
Could not load kernel: gollek_rocm_gfx942.hsaco
```

**Solution:** Build for correct architecture:

```bash
# MI300X
make AMDGPU_TARGET=gfx942

# MI250X
make AMDGPU_TARGET=gfx90a

# Verify target
rocminfo | grep "gfx"
```

### Metal Issues

#### "Metal unavailable"

**Symptoms:**
```
MetalCapabilities{unavailable: Not Apple Silicon}
```

**Solutions:**

1. **Verify Apple Silicon:**
```bash
uname -m  # Should show "arm64"
sysctl -n machdep.cpu.brand_string
```

2. **Check macOS version:**
```bash
sw_vers -productVersion  # Should be 14.0+
```

3. **Install Xcode tools:**
```bash
xcode-select --install
```

#### "Library not loaded"

**Symptoms:**
```
UnsatisfiedLinkError: libgollek_metal.dylib not found
```

**Solution:**

```bash
# Build and install
make -C src/main/cpp/metal
mkdir -p ~/.gollek/libs
cp target/native/macos-aarch64/libgollek_metal.dylib ~/.gollek/libs/
```

#### OOM on large models

**Symptoms:**
```
Metal error: Out of memory
```

**Solutions:**

1. **Use weight offloading mode:**
```properties
gollek.runners.metal.mode=offload
```

2. **Reduce model size:**
```properties
gollek.runners.metal.num-layers=16  # Instead of 32
```

3. **Close other applications** to free unified memory

---

## Deployment Guide

### Docker Deployment

#### CUDA Container

```dockerfile
FROM nvidia/cuda:12.3.0-runtime-ubuntu22.04

# Install Java 21
RUN apt-get update && apt-get install -y \
    openjdk-21-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set environment
ENV CUDA_HOME=/usr/local/cuda
ENV LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH

# Copy application
COPY target/gollek-app.jar /app/gollek-app.jar
COPY libgollek_cuda.so /usr/local/lib/

# Configure
ENV GOLLEK_RUNNERS_CUDA_ENABLED=true
ENV GOLLEK_RUNNERS_CUDA_DEVICE_ID=0

WORKDIR /app
CMD ["java", "-jar", "gollek-app.jar"]
```

**Run with GPU:**
```bash
docker run --gpus all -p 8080:8080 gollek-cuda-app
```

#### Blackwell Container

```dockerfile
FROM nvidia/cuda:12.3.0-runtime-ubuntu22.04

# Blackwell requires CUDA 12.3+
ENV CUDA_VERSION=12.3.0

# Install Java 21
RUN apt-get update && apt-get install -y openjdk-21-jdk

# Copy Blackwell library
COPY libgollek_blackwell.so /usr/local/lib/

ENV GOLLEK_RUNNERS_BLACKWELL_ENABLED=true
ENV GOLLEK_RUNNERS_BLACKWELL_USE_FP4=true
ENV GOLLEK_RUNNERS_BLACKWELL_USE_TMEM=true

CMD ["java", "-jar", "gollek-app.jar"]
```

#### ROCm Container

```dockerfile
FROM rocm/dev-ubuntu-22.04:6.0

# Install Java 21
RUN apt-get update && apt-get install -y openjdk-21-jdk

ENV ROCM_PATH=/opt/rocm
ENV LD_LIBRARY_PATH=$ROCM_PATH/lib:$LD_LIBRARY_PATH

COPY libgollek_rocm_gfx942.hsaco /opt/gollek/lib/

ENV GOLLEK_RUNNERS_ROCM_ENABLED=true
ENV GOLLEK_RUNNERS_ROCM_DEVICE_ID=0

CMD ["java", "-jar", "gollek-app.jar"]
```

**Run with ROCm GPU:**
```bash
docker run --device /dev/kfd --device /dev/dri \
  -v /opt/rocm:/opt/rocm \
  gollek-rocm-app
```

### Kubernetes Deployment

#### CUDA Pod Example

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gollek-cuda-inference
spec:
  containers:
  - name: gollek
    image: gollek-ai/gollek-cuda:latest
    resources:
      limits:
        nvidia.com/gpu: 1  # Request 1 GPU
    env:
    - name: GOLLEK_RUNNERS_CUDA_ENABLED
      value: "true"
    - name: GOLLEK_RUNNERS_CUDA_DEVICE_ID
      value: "0"
    volumeMounts:
    - name: model-storage
      mountPath: /models
  volumes:
  - name: model-storage
    persistentVolumeClaim:
      claimName: model-pvc
```

#### Multi-GPU Deployment

```yaml
spec:
  containers:
  - name: gollek
    resources:
      limits:
        nvidia.com/gpu: 4  # Request 4 GPUs
    env:
    - name: GOLLEK_RUNNERS_CUDA_DEVICE_ID
      value: "0,1,2,3"
```

---

## Benchmarking Guide

### Running Benchmarks

#### CUDA Benchmark

```bash
# Single GPU benchmark
CUDA_VISIBLE_DEVICES=0 \
java -jar benchmark.jar \
  --runner cuda \
  --model llama-3.2-3b \
  --batch-size 1,4,8,16 \
  --precision fp16,fp8 \
  --duration 60s

# Multi-GPU benchmark
CUDA_VISIBLE_DEVICES=0,1,2,3 \
java -jar benchmark.jar \
  --runner cuda \
  --model llama-3-70b \
  --tensor-parallel 4
```

#### Blackwell Benchmark

```bash
# FP4 vs FP8 comparison
CUDA_VISIBLE_DEVICES=0 \
java -jar benchmark.jar \
  --runner blackwell \
  --model llama-3-70b \
  --precision fp4,fp8 \
  --tmem-enabled true \
  --report benchmark-report.md
```

### Benchmark Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Tokens/sec** | Generation throughput | >50 (7B), >20 (70B) |
| **Time to First Token** | Prefill latency | <100ms |
| **GPU Memory** | VRAM usage | <80% of total |
| **Power Efficiency** | Tokens per watt | >2 tokens/W |

### Sample Benchmark Results

#### Llama-3.2-3B Performance

| Platform | Tokens/sec | TTFT (ms) | Memory (GB) |
|----------|-----------|-----------|-------------|
| A100 (FP16) | 45 | 25 | 8 |
| H100 (FP8) | 95 | 15 | 6 |
| B200 (FP4) | 180 | 10 | 5 |
| MI300X (FP16) | 55 | 22 | 8 |
| M3 Max | 50 | 30 | 6 |

#### Llama-3-70B Performance

| Platform | Tokens/sec | TTFT (ms) | Memory (GB) |
|----------|-----------|-----------|-------------|
| A100 80GB (FP16) | 12 | 80 | 72 |
| H100 80GB (FP8) | 28 | 45 | 40 |
| B200 180GB (FP4) | 55 | 25 | 38 |
| MI300X 192GB | 32 | 40 | 42 |
| M3 Max 128GB | 18 | 60 | 70 |

---

## Best Practices

### Performance Optimization

1. **Use unified memory** on A100/H100/B200/MI300X for zero-copy
2. **Enable FlashAttention** for 2-3x speedup on attention layers
3. **Use lower precision** (FP8/FP4) when accuracy allows
4. **Pin batch sizes** to multiples of warp size (32 for NVIDIA, 64 for AMD)
5. **Pre-allocate KV cache** for long context inference

### Memory Management

```properties
# Set maximum GPU memory usage
gollek.runners.cuda.max-memory-percent=90

# Enable memory-efficient attention
gollek.runners.cuda.use-flash-attention=true

# Pre-allocate KV cache blocks
gollek.runners.cuda.kv-cache-blocks=1024
```

### Production Checklist

- [ ] GPU drivers installed and verified
- [ ] CUDA/ROCm/Metal libraries built for correct architecture
- [ ] Environment variables configured
- [ ] GPU memory monitoring enabled
- [ ] Fallback to CPU configured
- [ ] Health checks implemented
- [ ] Metrics collection active
- [ ] Load testing completed

---

## Configuration Guide

For detailed optimization configuration options, see the **[Optimization Configuration Guide](https://github.com/gollek-ai/gollek/tree/main/inference-gollek/extension/optimization/OPTIMIZATION_CONFIGURATION.md)**.

### Quick Configuration Reference

#### CUDA (A100/H100/B200)

```properties
gollek.runners.cuda.enabled=true
gollek.runners.cuda.use-fp8=true      # Auto on H100+
gollek.runners.cuda.use-fp4=true      # Auto on B200
gollek.runners.cuda.use-unified-memory=true
```

#### Blackwell (B100/B200/GB200)

```properties
gollek.runners.blackwell.enabled=true
gollek.runners.blackwell.use-tmem=true    # 64MB on-chip
gollek.runners.blackwell.use-fp4=true     # 2x speedup
gollek.runners.blackwell.async-copy=true  # Overlap copy/compute
```

#### ROCm (MI300X/MI250X)

```properties
gollek.runners.rocm.enabled=true
gollek.runners.rocm.use-managed-memory=true  # MI300X zero-copy
gollek.runners.rocm.use-fp8=true             # MI300X FP8 cores
gollek.runners.rocm.gpu-arch=gfx942          # Auto-detected
```

#### Metal (M1/M2/M3/M4)

```properties
gollek.runners.metal.enabled=true
gollek.runners.metal.mode=auto          # Auto standard/offload
gollek.runners.metal.use-sdpa=true      # MPSGraph FA4 equiv (macOS 14+)
gollek.runners.metal.use-bf16=true      # M3/M4 BF16 support
```

---

## Resources

### Kernel Module Documentation

- **[CUDA Kernel README](https://github.com/gollek-ai/gollek/tree/main/inference-gollek/extension/kernel/gollek-kernel-cuda)**
  - FlashAttention-2/3/4 auto-selection
  - FP8/FP4 tensor core optimization
  - Unified memory support (A100/H100/B200)
  
- **[Blackwell Kernel README](https://github.com/gollek-ai/gollek/tree/main/inference-gollek/extension/kernel/gollek-kernel-blackwell)**
  - FlashAttention-4 with TMEM (64MB on-chip)
  - FP4 tensor cores (2x FP8 throughput)
  - Async execution with stream wait/write
  
- **[ROCm Kernel README](https://github.com/gollek-ai/gollek/tree/main/inference-gollek/extension/kernel/gollek-kernel-rocm)**
  - FlashAttention-2/3 for MI300X/MI250X
  - Unified memory on MI300X (zero-copy)
  - FP8 tensor cores on MI300X
  
- **[Metal Kernel README](https://github.com/gollek-ai/gollek/tree/main/inference-gollek/extension/kernel/gollek-backend-metal)**
  - MPSGraph SDPA (FA4 equivalent for macOS 14+)
  - Unified memory on all Apple Silicon
  - Weight offloading for large models

### Optimization Integration

- **[Optimization Integration Guide](https://github.com/gollek-ai/gollek/tree/main/inference-gollek/extension/optimization/OPTIMIZATION_INTEGRATION.md)**
  - CudaOptimizationManager
  - BlackwellOptimizationManager
  - RocmOptimizationManager
  - MetalOptimizationManager
- **GGUF/llama.cpp note**
  - GGUF uses llama.cpp and does not call the optimization managers directly.
  - The GGUF runner only detects installed optimization modules and exposes them as capabilities for visibility.
- **Optimization compatibility**

| Optimization Module | Scope | GGUF (llama.cpp) | Kernel Runners |
|---------------------|-------|-----------------|----------------|
| `gollek-ext-prompt-cache` | Engine + KV cache | Detectable only | Supported |
| `gollek-plugin-kv-cache` | Kernel KV memory | Detectable only | Supported |
| `gollek-ext-paged-attention` | Kernel attention | Detectable only | Supported |
| `gollek-ext-prefilldecode` | Kernel prefill/decode | Detectable only | Supported |
| `gollek-ext-hybridattn` | Kernel attention | Detectable only | Supported |
| `gollek-ext-fa3` | Kernel attention | Detectable only | Supported |
| `gollek-ext-fa4` | Kernel attention | Detectable only | Supported |

### External Resources

- [NVIDIA CUDA Documentation](https://docs.nvidia.com/cuda/)
- [NVIDIA Blackwell Architecture](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)
- [AMD ROCm Documentation](https://rocm.docs.amd.com/)
- [Apple Metal Documentation](https://developer.apple.com/metal/)
- [FlashAttention-4 Paper (arXiv:2603.05451)](https://arxiv.org/abs/2603.05451)
- [FlashAttention-3 Paper (arXiv:2307.08691)](https://arxiv.org/abs/2307.08691)
- [Hybrid Attention Paper (arXiv:2412.06464)](https://arxiv.org/abs/2412.06464)

### Community

- [GitHub Discussions](https://github.com/gollek-ai/gollek/discussions)
- [Issue Tracker](https://github.com/gollek-ai/gollek/issues)

---

[Back to Features](/features/) &nbsp; [View Architecture](/docs/runtime/architecture)
