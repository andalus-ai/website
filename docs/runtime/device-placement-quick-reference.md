---
title: Device Placement Quick Reference
description: Quick guide for device placement in Gollek inference
layout: default
---

# Device Placement Quick Reference

## TL;DR - Three Layers Responsible

| Layer | Component | Responsibility | Code Location |
|-------|-----------|-----------------|----------------|
| **Gollek Control** | DirectInferenceEngine.java | Detects platform, decides device, orchestrates weight loading | `gollek/plugins/runner/safetensor/gollek-safetensor-engine/.../DirectInferenceEngine.java` |
| **GPU API** | LibTorch Device API | Provides Device constants, implements tensor.to(device) | `gollek/plugins/runner/torch/gollek-runner-libtorch/.../Device.java` |
| **Data Layer** | SafeTensor Loader + Bridge | Loads weights from disk, bridges to LibTorch (zero-copy) | `gollek/plugins/loader/safetensor/` |

## Device Detection Flow

```
detectMetalDevice()
├─ Check OS: System.getProperty("os.name") contains "mac"
├─ Check Architecture: System.getProperty("os.arch") contains "arm64"
├─ Check Override: System.getenv("GOLLEK_METAL_ENABLED")
└─ Return: Device.MPS (Apple Silicon) or Device.CPU (fallback)
```

## Key Code Snippets

### Gollek Decision Point
```java
// DirectInferenceEngine.java:573-574
Device targetDevice = detectMetalDevice();
log.infof("loading weights to device: %s", targetDevice);
```

### LibTorch GPU Movement
```java
// DirectInferenceEngine.java:588
t = t.to(targetDevice);  // ← FFM call to native LibTorch
// This allocates GPU memory and transfers tensor data
```

### SafeTensor Data Supply
```java
// DirectInferenceEngine.java:581-583
SafetensorTensor st = session.tensor(name);  // Data from disk
TorchTensor t = bridge.bridge(st);            // Zero-copy bridge to CPU tensor
```

## Command Line Usage

### Default (Auto-detect Metal)
```bash
java -jar target/gollek-runner.jar chat --model google/gemma-4-E2B-it
# Output: Platform: Metal ✓ GPU acceleration enabled
#         Provider: safetensor
#         Device logs show: "mps"
```

### Force CPU
```bash
GOLLEK_METAL_ENABLED=false java -jar target/gollek-runner.jar chat --model google/gemma-4-E2B-it
# Output: Loading weights to device: cpu
```

### With GGUF (Different Provider)
```bash
java -jar target/gollek-runner.jar chat --model google/gemma-4-E2B-it --gguf
# Provider: gguf (device placement handled separately)
```

## Expected Log Output

### Metal GPU (Correct)
```
[INFO] DirectInferenceEngine: loading weights to device: mps
[DEBUG] bridging 2611 tensors to LibTorch on device mps
[DEBUG] Moved tensor model.layers.0.self_attn.q_proj to device mps
[DEBUG] Moved tensor model.layers.0.self_attn.k_proj to device mps
...
[INFO] bridged 2611 tensors to device mps
```

### CPU Fallback (Slow)
```
[INFO] DirectInferenceEngine: loading weights to device: cpu
[DEBUG] bridging 2611 tensors to LibTorch on device cpu
```

### Metal Disabled
```
[INFO] DirectInferenceEngine: Metal disabled via GOLLEK_METAL_ENABLED=false
[INFO] DirectInferenceEngine: loading weights to device: cpu
```

## Device Constants

```java
// In LibTorch Device class
Device.CPU   // CPU device - always available
Device.MPS   // Metal Performance Shaders - Apple Silicon only
Device.CUDA  // NVIDIA CUDA - Linux/Windows only
Device.METAL // Legacy Metal (don't use)
```

## Responsibility Matrix

```
┌──────────────────┬────────────────┬──────────────┬──────────────────┐
│ Task             │ Gollek         │ LibTorch     │ SafeTensor       │
├──────────────────┼────────────────┼──────────────┼──────────────────┤
│ Detect OS        │ ✓ (decides)    │              │                  │
│ Provide Device   │                │ ✓ (constants)│                  │
│ Load from Disk   │                │              │ ✓ (mmap)         │
│ Bridge to Tensor │                │              │ ✓ (zero-copy)    │
│ Move to GPU      │ ✓ (calls)      │ ✓ (executes) │                  │
│ Allocate GPU Mem │                │ ✓ (native)   │                  │
│ Error Handling   │ ✓ (fallback)   │              │                  │
│ Log Progress     │ ✓ (Gollek)     │              │                  │
└──────────────────┴────────────────┴──────────────┴──────────────────┘
```

## Troubleshooting Checklist

- [ ] **Slow inference**: Check logs show "mps" not "cpu"
- [ ] **Garbled responses**: Ensure provider is "safetensor", device is "mps"
- [ ] **Device move failed**: Check WARNING logs in ~/.gollek/logs/cli.log
- [ ] **Not detecting Metal**: Verify `uname -m` shows "arm64"
- [ ] **GPU memory error**: Reduce model size or increase available GPU memory

## Files Modified

| File | Change | Lines |
|------|--------|-------|
| ChatCommand.java | Fixed provider selection logic | 179-207 |
| DirectInferenceEngine.java | Added detectMetalDevice() + device movement | 32-81, 568-629 |

## Environment Variables

| Variable | Values | Effect |
|----------|--------|--------|
| `GOLLEK_METAL_ENABLED` | `true` / `false` | Enable/disable Metal GPU (default: auto-detect) |
| `GOLLEK_DEVICE` | `cpu` / `mps` / `auto` | Override device selection (if implemented) |

## Performance Baseline

| Configuration | Relative Speed | Notes |
|---------------|----------------|-------|
| CPU Inference | 1x | Baseline (slow) |
| Metal GPU | 2-5x faster | Expected on Apple Silicon |
| Larger Models | GPU only | Some models need GPU memory |

## See Also

- Full documentation: [Metal GPU Device Placement](./metal-gpu-device-placement.md)
- SafeTensor Engine: [SafeTensor Runner Integration](/docs/runtime/safetensor-runner-integration)
- Runner Plugins: [Plugin Architecture](../plugins/runner-plugins.md)
