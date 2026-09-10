---
layout: default
title: GPU Kernel SPI
---

# 🎮 GPU Kernel SPI

Gollek provides a **unified ComputeKernel SPI** that normalizes hardware backends (CUDA, Metal, ROCm) into a single, hardware-agnostic interface. Write once, run on any GPU.

---

## 🎯 Overview

The ComputeKernel SPI eliminates vendor lock-in by providing a unified contract for core LLM compute operations. Each hardware backend implements this interface, allowing higher-level code to work against a single API.

```java
// Get the best available kernel automatically
ComputeKernel kernel = ComputeKernelRegistry.get().getBestAvailable();

// Use the same API regardless of hardware
MemorySegment output = kernel.allocate(M * N * Float.BYTES);
kernel.matmul(output, A, B, M, K, N);
kernel.rmsNorm(output, input, weight, hiddenSize, eps);
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Your Application Code                  │
│  ComputeKernel kernel = Registry.getBest();     │
│  kernel.matmul(C, A, B, M, K, N);               │
├─────────────────────────────────────────────────┤
│          ComputeKernel SPI (unified)             │
│  - allocate(), free(), copyH2D(), copyD2H()     │
│  - matmul(), attention(), flashAttention()      │
│  - rmsNorm(), silu(), elementwiseAdd/Mul()      │
│  - createStream(), synchronizeStream()          │
├──────────┬──────────┬──────────┬────────────────┤
│  CUDA    │  Metal   │   ROCm   │     CPU        │
│ Kernel   │ Kernel   │  Kernel  │    Kernel      │
│ Adapter  │ Adapter  │  Adapter │ (fallback)     │
├──────────┼──────────┼──────────┼────────────────┤
│ cuBLAS   │ MPS      │ rocBLAS  │   Pure Java    │
│ cuDNN    │ Metal    │ MIOpen   │   FFM APIs     │
│ FA2/FA3  │ FA4      │          │                │
└──────────┴──────────┴──────────┴────────────────┘
```

---

## 📋 SPI Contract

### Device Information

```java
DeviceType deviceType();    // CUDA, METAL, ROCM, CPU
String deviceName();        // "NVIDIA A100", "Apple M3 Pro", etc.
long totalMemory();         // Total device memory in bytes
long availableMemory();     // Available device memory in bytes
boolean isAvailable();      // Is device ready?
```

### Memory Management

```java
MemorySegment allocate(long bytes);              // Device memory
MemorySegment allocateUnified(long bytes);       // Unified memory
void free(MemorySegment ptr);                    // Free memory
void copyHostToDevice(MemorySegment dst, src, bytes);
void copyDeviceToHost(MemorySegment dst, src, bytes);
void copyDeviceToDevice(MemorySegment dst, src, bytes);
```

### Matrix Multiplication

```java
void matmul(MemorySegment C, A, B, M, K, N);     // C = A × B
void matmulAdd(MemorySegment C, A, B, M, K, N);  // C = A × B + C
```

### Attention Computation

```java
void attention(MemorySegment out, Q, K, V, seqLen, heads, headDim);
void flashAttention(MemorySegment out, Q, K, V, seqLen, heads, headDim);
```

### Normalization & Activations

```java
void rmsNorm(MemorySegment out, input, weight, hiddenSize, eps);
void silu(MemorySegment out, input, size);
void siluFfn(MemorySegment out, input, size);
void relu(MemorySegment out, input, size);
void gelu(MemorySegment out, input, size);
```

### Element-wise Operations

```java
void elementwiseAdd(MemorySegment C, A, B, size);
void elementwiseMul(MemorySegment C, A, B, size);
void elementwiseScale(MemorySegment A, scale, size);
```

### Stream Management

```java
KernelStream createStream();
void synchronizeStream(KernelStream stream);
```

---

## 🔧 Kernel Registry

The `ComputeKernelRegistry` provides automatic device detection and selection:

```java
// Automatic selection (best available device)
ComputeKernel kernel = ComputeKernelRegistry.get().getBestAvailable();

// Specific device selection
ComputeKernel cuda = ComputeKernelRegistry.get().getByDeviceType(DeviceType.CUDA);
ComputeKernel metal = ComputeKernelRegistry.get().getByDeviceType(DeviceType.METAL);

// Check availability
boolean cudaAvailable = ComputeKernelRegistry.get().isAvailable(DeviceType.CUDA);

// Set custom priority order
ComputeKernelRegistry.get().setDevicePriority(List.of(
    DeviceType.CUDA,
    DeviceType.METAL,
    DeviceType.CPU
));
```

### Device Priority (Default)

| Priority | Device | Use Case |
|----------|--------|----------|
| 1 | CUDA | NVIDIA GPUs (A100, H100, etc.) |
| 2 | Metal | Apple Silicon (M1/M2/M3) |
| 3 | ROCm | AMD GPUs (MI200, MI300) |
| 4 | CPU | Fallback (always available) |

---

## 📊 Hardware-Specific Features

### CUDA Adapter

| Feature | Support |
|---------|---------|
| **Device** | NVIDIA GPUs |
| **Memory** | malloc, mallocManaged (unified) |
| **Matmul** | cuBLAS GEMM |
| **Attention** | Paged + FA2 (A100+) + FA3 (H100+) |
| **Streams** | CUDA streams |
| **Elementwise** | Via custom kernels |

```java
// CUDA-specific: unified memory
MemorySegment unified = cudaKernel.allocateUnified(bytes);
// Zero-copy between CPU and GPU on supported architectures
```

### Metal Adapter

| Feature | Support |
|---------|---------|
| **Device** | Apple Silicon (M1/M2/M3) |
| **Memory** | Unified memory (zero-copy) |
| **Matmul** | MPSMatrixMultiplication |
| **Attention** | Paged + FA4-equivalent |
| **Elementwise** | Native add, mul, relu, sigmoid, etc. |
| **Streams** | Command queues |

```java
// Metal has rich elementwise operations
metalKernel.relu(output, input, size);
metalKernel.sigmoid(output, input, size);
metalKernel.elementwiseAdd(C, A, B, size);
```

### CPU Kernel

| Feature | Support |
|---------|---------|
| **Device** | Any CPU |
| **Memory** | Java heap arrays |
| **Matmul** | Naive O(M×K×N) |
| **Attention** | Standard implementation |
| **Elementwise** | Full support |

> ⚠️ **Note:** CPU kernel is for development/testing only. Use GPU kernels for production performance.

---

## 🚀 FlashAttention Support

### FlashAttention-2 (A100+)
```java
// Automatically selected for compute capability >= 8.0
kernel.flashAttention(output, query, key, value, seqLen, heads, headDim);
```

### FlashAttention-3 (H100+)
```java
// Automatically selected for compute capability >= 9.0
// 2-3x faster than standard attention
kernel.flashAttention(output, query, key, value, seqLen, heads, headDim);
```

### FlashAttention-4 (Metal/Blackwell)
```java
// Automatically selected for next-gen GPUs
kernel.flashAttention(output, query, key, value, seqLen, heads, headDim);
```

---

## ⚙️ Configuration

```properties
# Enable/disable GPU kernels
gollek.optimizations.flash-attention.enabled=true
gollek.optimizations.flash-attention.deviceFilter=cuda,metal,rocm
gollek.optimizations.flash-attention.minSeqLen=512

# FlashAttention-3 (Hopper+ only)
gollek.optimizations.fa3.enabled=true
gollek.optimizations.fa3.minComputeCapability=90

# FlashAttention-4 (next-gen)
gollek.optimizations.fa4.enabled=true
gollek.optimizations.fa4.minComputeCapability=100
```

---

## 📈 Performance

| Operation | CPU | CUDA (A100) | Metal (M3) | Speedup |
|-----------|-----|-------------|------------|---------|
| **Matmul 4096×4096** | 2.5s | 8ms | 15ms | **300x** |
| **Attention 4K seq** | 800ms | 5ms | 12ms | **160x** |
| **RMS Norm** | 50ms | 0.3ms | 0.8ms | **160x** |
| **SiLU Activation** | 30ms | 0.2ms | 0.5ms | **150x** |

---

## 🚀 Getting Started

1. **[Install Gollek](/docs/setup/sdk-installation)** - Set up the platform
2. **[GPU Acceleration](/docs/gpu-acceleration/)** - Configure GPU backend
3. **[Use ComputeKernel API](#-spi-contract)** - Write hardware-agnostic code

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--subtle-bg); border-radius: 12px;">
  <h3>Ready to Accelerate?</h3>
  <p>Start with the <strong><a href="/docs/setup/sdk-installation">Installation Guide</a></strong> or explore <strong><a href="/docs/gpu-acceleration/">GPU Backends</a></strong></p>
</div>
