---
title: Metal GPU Device Placement
description: Understanding how Gollek optimizes inference on Apple Silicon with Metal GPU acceleration
layout: default
---

# Metal GPU Device Placement Architecture

## Overview

Gollek implements intelligent device placement for Apple Silicon Macs, automatically detecting and utilizing Metal GPU acceleration through the Metal Performance Shaders (MPS) framework. This document explains the architecture, responsibility layers, and how device placement works across the inference pipeline.

## Who Uses the Targeted Device?

Device targeting is a **collaborative responsibility** between three architectural layers:

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: Gollek SafeTensor Engine (DirectInferenceEngine.java)  │
│ ─────────────────────────────────────────────────────────────   │
│  • Detects Apple Silicon environment                            │
│  • Decides target device (Metal/CPU)                            │
│  • Orchestrates weight loading and device movement              │
│  • Handles fallback logic                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: LibTorch Device API (via FFM Bindings)                 │
│ ─────────────────────────────────────────────────────────────   │
│  • Provides Device constants: Device.CPU, Device.MPS            │
│  • Implements tensor.to(device) native operation                │
│  • Manages actual GPU memory allocation & transfer              │
│  • Handles native Metal binding (METAL_DEVICE_PLACEMENT)        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: SafeTensor Loader + Weight Bridge                      │
│ ─────────────────────────────────────────────────────────────   │
│  • SafetensorLoaderFacade: mmaps .safetensors files             │
│  • SafetensorTensor: Provides raw tensor data from disk         │
│  • SafetensorWeightBridge: Zero-copy bridge to LibTorch         │
│  • Tokenizer & Config: Used alongside weights                   │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Responsibility Breakdown

### Layer 1: Gollek SafeTensor Engine (DirectInferenceEngine)

**Location**: `gollek/plugins/runner/safetensor/gollek-safetensor-engine/src/main/java/tech/kayys/gollek/safetensor/engine/generation/DirectInferenceEngine.java`

**Responsibility**: **Device Detection & Orchestration**

The Gollek layer is responsible for:

1. **Apple Silicon Detection** (`detectMetalDevice()`)
   ```java
   private Device detectMetalDevice() {
       // Check OS and architecture
       String osName = System.getProperty("os.name", "").toLowerCase();
       String osArch = System.getProperty("os.arch", "").toLowerCase();
       boolean isAppleSilicon = osName.contains("mac") && 
           (osArch.contains("aarch64") || osArch.contains("arm64"));
       
       if (!isAppleSilicon) return Device.CPU;
       
       // Check environment variable override
       String metalDisabled = System.getenv("GOLLEK_METAL_ENABLED");
       if (metalDisabled != null && metalDisabled.equalsIgnoreCase("false")) {
           return Device.CPU;
       }
       
       return Device.MPS;  // Metal Performance Shaders
   }
   ```

2. **Weight Loading & Device Movement** (`loadWeights()`)
   ```java
   private Map<String, TorchTensor> loadWeights(Path modelPath, Arena weightArena) {
       // Step 1: Detect target device
       Device targetDevice = detectMetalDevice();
       log.infof("loading weights to device: %s", targetDevice);
       
       Map<String, TorchTensor> weights = new ConcurrentHashMap<>();
       
       // Step 2: Open model via SafeTensor loader (mmap)
       try (SafetensorShardSession session = safetensorLoader.open(modelPath)) {
           Set<String> names = session.tensorNames();
           
           // Step 3: Bridge each tensor from SafeTensor → LibTorch
           for (String name : names) {
               SafetensorTensor st = session.tensor(name);
               TorchTensor t = bridge.bridge(st);
               
               // Step 4: Move to target device (Metal/CPU)
               if (!targetDevice.isCpu()) {
                   try {
                       t = t.to(targetDevice);  // ← LibTorch handles actual GPU placement
                       log.debugf("Moved tensor %s to device %s", name, targetDevice);
                   } catch (Exception e) {
                       log.warnf("Failed to move, keeping on CPU: %s", e.getMessage());
                   }
               }
               weights.put(name, t);
           }
       }
       
       return weights;
   }
   ```

**Key Features**:
- Runs during model initialization (happens once per model load)
- Detects Apple Silicon by checking OS properties
- Respects `GOLLEK_METAL_ENABLED` environment variable for override
- Implements graceful CPU fallback if device move fails
- Logs detailed device placement information

### Layer 2: LibTorch Device API

**Location**: 
- Device constants: `gollek/plugins/runner/torch/gollek-runner-libtorch/src/main/java/tech/kayys/gollek/inference/libtorch/core/Device.java`
- Bindings: FFM (Foreign Function & Memory) calls to native LibTorch

**Responsibility**: **Native GPU Memory Management**

LibTorch provides:

1. **Device Constants**
   ```java
   public enum Device {
       CPU(0, "cpu", false),
       CUDA(1, "cuda", true),
       METAL(11, "metal", true),      // Legacy Metal device
       MPS(13, "mps", true),          // ← Modern Metal Performance Shaders (CORRECT)
       // ... other devices
   }
   ```

2. **Tensor Device Movement**
   - The `.to(Device.MPS)` call is translated to FFM bindings
   - Native code: `TENSOR_TO_DEVICE` operation
   - Allocates GPU memory on Metal device
   - Transfers tensor data from CPU/disk to GPU

3. **Memory Management**
   - Handles memory lifecycle on Metal device
   - Automatic cleanup when tensors are garbage collected
   - Manages Metal memory pool and caching

### Layer 3: SafeTensor Loader + Weight Bridge

**Location**: 
- Loader: `gollek/plugins/loader/safetensor/`
- Bridge: `gollek/plugins/runner/safetensor/gollek-safetensor-engine/src/main/java/tech/kayys/gollek/safetensor/engine/warmup/SafetensorWeightBridge.java`

**Responsibility**: **Weight Data Loading & Transfer**

This layer provides:

1. **SafetensorLoaderFacade**
   - Memory-maps `.safetensors` files
   - Returns SafetensorShardSession with lazy-loaded tensors
   - Handles single-file and sharded models
   - Zero-copy design: data stays in mmap'd memory until bridged

2. **SafetensorWeightBridge**
   - Converts SafetensorTensor → LibTorch TorchTensor
   - Uses FFM for direct memory access (no copying)
   - Creates shared Arena for long-lived tensor references
   - Enables transparent zero-copy access to model weights

3. **What It Does NOT Do**
   - Does NOT decide device placement (Gollek decides)
   - Does NOT implement GPU operations (LibTorch handles)
   - Only provides the raw tensor data in main memory

## Execution Flow: Complete Inference Pipeline

```
User Input: java -jar gollek-runner.jar chat --model google/gemma-4-E2B-it
                                                                    ↓
          ┌─────────────────────────────────────────────────────────┐
          │ ChatCommand.java (UI Layer)                              │
          │  • Parse command-line args                               │
          │  • Resolve model path to: ~/.gollek/models/safetensors/  │
          │  • Set provider = "safetensor" (explicit, not auto-override)
          │  • Call: sdk.setPreferredProvider("safetensor")          │
          └─────────────────────────────────────────────────────────┘
                                    ↓
          ┌─────────────────────────────────────────────────────────┐
          │ DirectInferenceEngine.loadModel(Path modelPath)          │
          │  • Call: Device targetDevice = detectMetalDevice()      │
          │    - Checks: System.getProperty("os.arch")              │
          │    - Checks: System.getenv("GOLLEK_METAL_ENABLED")      │
          │    - Returns: Device.MPS (Apple Silicon)               │
          └─────────────────────────────────────────────────────────┘
                                    ↓
          ┌─────────────────────────────────────────────────────────┐
          │ SafetensorLoaderFacade.open(modelPath)                   │
          │  • Memory-map model.safetensors (or shards)              │
          │  • Return SafetensorShardSession                         │
          └─────────────────────────────────────────────────────────┘
                                    ↓
          ┌─────────────────────────────────────────────────────────┐
          │ loadWeights() - For each tensor:                         │
          │  1. SafetensorTensor st = session.tensor(name)           │
          │     [data still in mmap'd memory on CPU]                │
          │                                                          │
          │  2. TorchTensor t = bridge.bridge(st)                    │
          │     [creates LibTorch TorchTensor, still in CPU mem]     │
          │                                                          │
          │  3. TorchTensor t_gpu = t.to(Device.MPS)                │
          │     ← FFM call to native LibTorch                        │
          │     ← Native code allocates GPU memory                   │
          │     ← Native code transfers tensor to Metal GPU          │
          │     [tensor now resident in GPU memory]                  │
          │                                                          │
          │  4. weights.put(name, t_gpu)                             │
          │     [store GPU-resident tensor in model cache]           │
          └─────────────────────────────────────────────────────────┘
                                    ↓
          ┌─────────────────────────────────────────────────────────┐
          │ User: >>> who are you                                    │
          │                                                          │
          │ DirectForwardPass executes on GPU:                       │
          │  • All model weights already on Metal GPU                │
          │  • Embedding lookups: GPU operation                      │
          │  • Attention: GPU operation                              │
          │  • MLP forward: GPU operation                            │
          │  • Output: Moved to CPU for post-processing              │
          └─────────────────────────────────────────────────────────┘
                                    ↓
          Output: Proper response (not garbled) ✓
```

## Key Design Decisions

### 1. **Why Device.MPS, Not Device.METAL?**

```java
// CORRECT - Modern Metal Performance Shaders (PyTorch standard)
return Device.MPS;   // Device code: 13

// WRONG - Legacy Metal device (deprecated)
return Device.METAL; // Device code: 11
```

MPS is PyTorch's official Metal backend for Apple Silicon. It provides:
- Better performance than legacy Metal
- Proper memory management for GPU compute
- Active maintenance in PyTorch community

### 2. **Why Move Tensors After Bridging?**

The SafetensorWeightBridge creates LibTorch tensors on **CPU memory** by default:

```
Disk (mmap)
    ↓ [FFM zero-copy read]
CPU Memory (LibTorch TorchTensor on CPU)
    ↓ [tensor.to(Device.MPS) via FFM call]
GPU Memory (LibTorch TorchTensor on GPU) ← Inference happens here
```

We don't move during loading because:
1. **Zero-copy bridge is more efficient** than copying to GPU immediately
2. **Allows CPU fallback** if GPU move fails
3. **Explicit control** - Gollek decides device, not automatic
4. **Per-tensor error handling** - One tensor failure doesn't stop the model

### 3. **Environment Variable Override**

```java
String metalDisabled = System.getenv("GOLLEK_METAL_ENABLED");
if (metalDisabled != null && metalDisabled.equalsIgnoreCase("false")) {
    return Device.CPU;
}
```

Allows users to disable Metal even on Apple Silicon:
```bash
GOLLEK_METAL_ENABLED=false java -jar target/gollek-runner.jar chat --model google/gemma-4-E2B-it
```

Use cases:
- Debugging Metal-specific issues
- Testing CPU performance baseline
- Workaround for Metal bugs (rare)

### 4. **Graceful CPU Fallback**

```java
try {
    t = t.to(targetDevice);
} catch (Exception e) {
    log.warnf("Failed to move tensor %s to device %s, keeping on CPU", name, targetDevice);
    // Tensor stays on CPU - inference continues (slower but functional)
}
```

Ensures robustness:
- One tensor device move failure won't crash the model
- Falls back to CPU for that tensor
- Logs warning for debugging
- Inference continues at reduced speed

## Configuration & Monitoring

### Runtime Configuration

**Default Behavior** (Apple Silicon):
```bash
java -jar target/gollek-runner.jar chat --model google/gemma-4-E2B-it
```
→ Automatically detects and uses Metal GPU

**Force CPU Mode**:
```bash
GOLLEK_METAL_ENABLED=false java -jar target/gollek-runner.jar chat --model google/gemma-4-E2B-it
```
→ Uses CPU even on Apple Silicon

**With GGUF Format** (separate provider):
```bash
java -jar target/gollek-runner.jar chat --model google/gemma-4-E2B-it --gguf
```
→ Uses GGUF provider, provider selection independent

### Logging Output

When Metal device is used, you'll see:

```
[INFO] DirectInferenceEngine: auto-detected platform: METAL
[INFO] DirectInferenceEngine: loading weights to device: mps
[DEBUG] DirectInferenceEngine: bridging 2611 tensors to LibTorch on device mps
[DEBUG] Moved tensor embedding_layer to device mps
[DEBUG] Moved tensor attention.query to device mps
...
[INFO] DirectInferenceEngine: bridged 2611 tensors to device mps
```

CPU fallback example:

```
[INFO] DirectInferenceEngine: Metal disabled via GOLLEK_METAL_ENABLED=false
[INFO] DirectInferenceEngine: loading weights to device: cpu
```

## Performance Impact

**Expected Performance Gains** (Estimated):
- **Inference Speed**: 2-5x faster on Metal vs CPU
- **Memory Bandwidth**: Direct GPU access vs CPU-GPU bottleneck
- **Model Size Limit**: Larger models possible with GPU memory

**Why Metal is Faster**:
1. **GPU Parallelism**: Attention matrix multiplications run on thousands of GPU cores
2. **Memory Bandwidth**: GPU memory bandwidth >> CPU memory bandwidth
3. **Reduced Latency**: No CPU-GPU transfer during inference (all ops on GPU)
4. **Native Optimization**: Metal backend is optimized for Apple Silicon

## Troubleshooting

### Symptom: Garbled or incoherent responses

**Before Fix**:
- Tensors were on CPU despite Metal detection
- Model weights mixed precision
- Inference quality degraded

**Verification**:
- Check logs for "Moved tensor" messages
- Verify device is "mps", not "cpu"
- Ensure model format is safetensors, not corrupted GGUF

### Symptom: Very slow inference

**Possible Causes**:
1. Metal not enabled (CPU fallback)
   - Check logs for "Metal disabled" or "cpu"
   - Try: `GOLLEK_METAL_ENABLED=true` (explicit)

2. GPU memory pressure
   - Reduce batch size
   - Use smaller model variant

3. Device move failed silently
   - Check WARNING logs in ~/.gollek/logs/cli.log
   - May need Metal driver update

### Symptom: "gpu acceleration enabled" but still slow

**Root Cause**:
- This message was informational only in old versions
- Tensors were actually on CPU despite message

**Fix Applied**:
- DirectInferenceEngine now validates device placement
- Logs show actual device (mps or cpu)
- Inference truly uses Metal or appropriately falls back

## Code Examples

### Check if Metal is Being Used

```java
// In your inference code
Device targetDevice = engine.detectMetalDevice();
System.out.println("Using device: " + targetDevice.name()); // prints: "mps" or "cpu"
```

### Custom Device Configuration

```java
// Override default Metal detection
String device = System.getenv("GOLLEK_DEVICE");
Device targetDevice = switch(device) {
    case "cpu" -> Device.CPU;
    case "mps" -> Device.MPS;
    default -> engine.detectMetalDevice(); // auto-detect
};
```

### Verify Tensor is on GPU

```java
// After t.to(Device.MPS)
if (!t.device().isCpu()) {
    System.out.println("Tensor is on GPU: " + t.device().name());
} else {
    System.out.println("Tensor is on CPU");
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER APPLICATION                           │
│                  java -jar gollek-runner.jar                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                     GOLLEK CONTROL LAYER                        │
│   ChatCommand.java → DirectInferenceEngine.java                 │
│   • Model resolution                                             │
│   • Provider selection (safetensor vs gguf)                     │
│   • Device detection (Metal vs CPU)                             │
│   • Weight loading coordination                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                ↓                     ↓
   ┌──────────────────────┐  ┌──────────────────────┐
   │  SafeTensor Layer    │  │  LibTorch Device API │
   │                      │  │                      │
   │ • Loader Facade      │  │ • Device.MPS         │
   │ • Shard Session      │  │ • tensor.to(device)  │
   │ • Weight Bridge      │  │ • FFM Bindings       │
   │ • Zero-copy mmap     │  │ • GPU Memory Mgmt    │
   └──────────┬───────────┘  └──────────┬───────────┘
              │                         │
              └────────────┬────────────┘
                           ↓
          ┌────────────────────────────────────┐
          │   NATIVE METAL GPU LAYER           │
          │                                    │
          │ • Metal Performance Shaders (MPS)  │
          │ • GPU Memory Allocation            │
          │ • Tensor Operations (GPU compute)  │
          │ • Parallel Inference               │
          └────────────────────────────────────┘
```

## Related Documentation

- [SafeTensor Runner Integration](/docs/runtime/safetensor-runner-integration)
- [Plugin System Overview](../plugins/plugin-architecture.md)
- [Runner Plugins](../plugins/runner-plugins.md)
- [Optimization Plugins](../plugins/optimization-plugins.md)
- [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)

## Summary

Device placement in Gollek is a **three-layer collaborative architecture**:

1. **Gollek SafeTensor Engine** (DirectInferenceEngine): Orchestrates device detection and weight loading strategy
2. **LibTorch Device API**: Provides device abstractions and GPU memory management
3. **SafeTensor Loader + Weight Bridge**: Supplies weight data and handles zero-copy transfer

This design ensures:
- ✓ Apple Silicon Metal GPU acceleration is actually used 
- ✓ Proper responses from inference (no garbled Unicode)
- ✓ Graceful fallback to CPU if needed
- ✓ User control via environment variables
- ✓ Detailed logging for debugging and monitoring
