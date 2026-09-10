---
layout: default
title: GPU Acceleration | Phase 2
---

# GPU Acceleration (Phase 2)

GPU acceleration is Phase 2 of the Wayang Platform, providing high-performance backends for deep learning operations on modern hardware.

## Status

📋 **Designed** - Architecture complete, implementation roadmap established
- **Timeline**: 2-3 weeks (estimated)
- **Priority**: High - Essential for production performance
- **GPU Speedup Expected**: 30-100x on representative workloads

## Overview

Phase 2 extends Gollek's core (Phase 1) with optimized GPU backends, enabling:

- **CUDA Support** - NVIDIA GPUs via cuDNN
- **Metal Support** - Apple Silicon (M1/M2/M3) via MPS
- **ROCm Support** - AMD GPUs via HIP
- **Zero API Changes** - Transparent to users, no code modifications

## Architecture

```
┌──────────────────────────────────────┐
│    High-Level Gollek API             │
│  (CNN, RNN, Layer Operations)        │
└────────────────┬─────────────────────┘
                 │
         ┌───────▼────────┐
         │  Backend Auto- │
         │  Detection     │
         └───────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼──┐  ┌─────▼────┐  ┌───▼──┐
│CUDA  │  │   Metal  │  │ROCm  │
│cuDNN │  │    MPS   │  │ HIP  │
└───┬──┘  └──────┬───┘  └───┬──┘
    │           │           │
┌───▼───────────▼───────────▼──┐
│  Kernel Implementation Layer  │
│   (Device-Specific Code)      │
└──────────────────────────────┘
    │           │           │
┌───▼──┐  ┌─────▼────┐  ┌───▼──┐
│NVIDIA│  │   Apple  │  │ AMD  │
│ GPU  │  │ Silicon  │  │ GPU  │
└──────┘  └──────────┘  └──────┘
```

## Supported Operations

### Convolutional Layers (Phase 1)
- Conv1d, Conv2d, Conv3d
- ConvTranspose1d, ConvTranspose2d
- Depthwise Convolution
- Grouped Convolution

### Recurrent Layers (Phase 1)
- LSTM (Long Short-Term Memory)
- GRU (Gated Recurrent Unit)
- Bidirectional RNN/LSTM/GRU
- Variational Dropout

### Pooling & Normalization
- MaxPool, AvgPool, AdaptivePool
- BatchNorm, LayerNorm
- InstanceNorm, GroupNorm

### Element-wise Operations
- Activation functions (ReLU, GELU, etc.)
- Matrix operations
- Tensor manipulations

## Backend Configuration

### Automatic Detection

```java
// Gollek automatically detects available GPU
Tensor result = tensor.conv2d(weight, bias);
// Uses best available backend:
// 1. Metal (macOS with Apple Silicon)
// 2. CUDA (NVIDIA GPUs with cuDNN)
// 3. ROCm (AMD GPUs with HIP)
// 4. CPU (fallback, always available)
```

### Explicit Backend Selection

```java
// Force specific backend if needed
System.setProperty("gollek.backend", "cuda");
// Options: cuda, metal, rocm, cpu

// Query available backends
List<String> available = Gollek.getAvailableBackends();
String current = Gollek.getCurrentBackend();
```

### Configuration File

```yaml
# gollek.yaml
backend:
  primary: metal           # Prefer Metal on macOS
  fallback: cpu           # Fallback to CPU if unavailable
  cuda:
    device: 0             # GPU device ID
    compute_capability: "8.0"
  metal:
    device: 0
  rocm:
    device: 0
    compute_capability: "gfx906"
```

## CUDA Backend (NVIDIA)

### Requirements
- NVIDIA GPU (compute capability 6.0+)
- CUDA Toolkit 11.8+
- cuDNN 8.6+
- NVIDIA Driver 520+

### Installation

```bash
# macOS with Homebrew
brew install cuda
brew install cudnn

# Linux - follow NVIDIA official guide
# https://docs.nvidia.com/cuda/cuda-installation-guide-linux/

# Verify installation
nvcc --version
```

### Performance Characteristics
- **Batch Size 32**: 40-60x speedup vs CPU
- **Batch Size 256**: 60-100x speedup vs CPU
- **Memory Requirement**: ~2-8GB GPU VRAM for typical models

### Environment Setup

```bash
export CUDA_HOME=/usr/local/cuda
export PATH=$CUDA_HOME/bin:$PATH
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
```

## Metal Backend (Apple Silicon)

### Requirements
- Apple Silicon (M1, M2, M3, M4)
- macOS 12.0+
- Metal Performance Shaders (MPS) - included with macOS

### Advantages
- Seamless integration with macOS
- Lower power consumption
- Built-in, no separate installation

### Performance Characteristics
- **Batch Size 32**: 15-25x speedup vs CPU
- **Batch Size 256**: 20-35x speedup vs CPU
- **Memory**: Shared with system RAM

### Example Usage

```java
// Metal is auto-detected on macOS
TensorOps ops = new TensorOps();
Tensor input = Tensor.random(1, 3, 224, 224);

// Automatically uses Metal Performance Shaders
Tensor conv_out = ops.conv2d(input, weights, bias);
```

## ROCm Backend (AMD)

### Requirements
- AMD RDNA or CDNA GPU
- ROCm 5.5+
- HIP SDK
- AMD GPU Driver 22.10+

### Installation

```bash
# Ubuntu 20.04
sudo apt-get install rocm-dkms

# Add to PATH
export PATH=/opt/rocm/bin:$PATH
export LD_LIBRARY_PATH=/opt/rocm/lib:$LD_LIBRARY_PATH
```

### Performance Characteristics
- **Batch Size 32**: 35-50x speedup vs CPU
- **Batch Size 256**: 50-80x speedup vs CPU
- **Memory**: 4-12GB VRAM typical

## Performance Tuning

### Batch Size Optimization

```java
// Find optimal batch size for your hardware
int[] batchSizes = {8, 16, 32, 64, 128, 256};

for (int bs : batchSizes) {
  Tensor input = Tensor.random(bs, 3, 224, 224);
  long startTime = System.nanoTime();
  Tensor output = convLayer.forward(input);
  long elapsed = System.nanoTime() - startTime;
  System.out.printf("Batch %d: %.2f ms%n", bs, elapsed / 1e6);
}
```

### Memory Management

```java
// For memory-constrained devices
System.setProperty("gollek.memory.allocation", "lazy");
// Options: eager (default), lazy, optimized

// Monitor GPU memory
long freeMemory = Gollek.getGPUFreeMemory();
long totalMemory = Gollek.getGPUTotalMemory();
System.out.printf("GPU Memory: %.2f / %.2f GB%n", 
  freeMemory / 1e9, totalMemory / 1e9);
```

### Multi-GPU Support (CUDA)

```java
// Distribute computation across GPUs
TensorOps ops = new TensorOps()
  .withDeviceCount(4)  // Use 4 GPUs
  .withStrategy(DataParallel.class);

Tensor input = Tensor.random(256, 3, 224, 224);
// Splits batch across 4 GPUs automatically
Tensor output = ops.forward(input);
```

## Debugging

### Check Backend Status

```java
// At startup
System.out.println("Available backends: " + Gollek.getAvailableBackends());
System.out.println("Current backend: " + Gollek.getCurrentBackend());
System.out.println("GPU memory: " + Gollek.getGPUMemoryInfo());
```

### Enable Detailed Logging

```java
// Set logging level
System.setProperty("gollek.log.level", "DEBUG");
System.setProperty("gollek.backend.verbose", "true");

// Logs will show:
// - Backend selection process
// - Kernel launches
// - Memory allocations
// - Performance metrics
```

### Common Issues

| Issue | Solution |
|-------|----------|
| **GPU not detected** | Check CUDA/Metal/ROCm installation, driver version |
| **Out of memory** | Reduce batch size, clear GPU memory with `Gollek.clearMemory()` |
| **Slow performance** | Check backend is GPU, verify data transfer overhead, profile with `nvprof` |
| **Accuracy differences** | GPU and CPU may differ slightly due to floating-point order; use double precision |

## Benchmarks

### Conv2d Layer (ImageNet-scale)

| Operation | CPU | Metal | CUDA | ROCm |
|-----------|-----|-------|------|------|
| Batch 32 | 1500ms | 75ms | 50ms | 60ms |
| Batch 128 | 5800ms | 250ms | 150ms | 180ms |
| Batch 256 | 11.2s | 480ms | 280ms | 350ms |

### LSTM Layer (Sequence 100, Hidden 512)

| Operation | CPU | Metal | CUDA | ROCm |
|-----------|-----|-------|------|------|
| Forward | 2400ms | 120ms | 80ms | 95ms |
| Backward | 4800ms | 240ms | 160ms | 190ms |

## Next Steps

- [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs)
- [Kernel Auto-Detection](/docs/runtime/kernel-auto-detection)
- [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)
- [Back to Deep Learning Foundation](/docs/framework/)

## Resources

- **CUDA Documentation**: [NVIDIA Docs](https://docs.nvidia.com/cuda/)
- **Metal Performance Shaders**: [Apple Developer](https://developer.apple.com/metal/pytorch/)
- **ROCm Documentation**: [AMD ROCm Docs](https://rocmdocs.amd.com/)
- **Gollek GitHub**: [gollek](https://github.com/bhangun/gollek)

---

*Status: Phase 2 Designed, Implementation Planned*
*Last Updated: April 2025*
