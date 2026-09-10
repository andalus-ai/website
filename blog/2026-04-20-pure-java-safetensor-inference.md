---
layout: post
title: "Pure Java Safetensor Inference: Native Speed without LibTorch"
date: 2026-04-20
categories: runtime performance
tags: [safetensor, java-25, ffm, metal, performance, qwen2.5]
excerpt: "Gollek's Safetensor engine is now fully native to Java. By leveraging the FFM API and Apple Accelerate, we've eliminated LibTorch dependencies while achieving 29.66 t/s on Qwen2.5."
---

# 🚀 Pure Java Safetensor Inference: Native Speed without LibTorch

We are thrilled to announce a major architectural milestone for Gollek: the **Safetensor inference engine is now 100% pure Java**. 

By moving away from heavy external C++ wrappers like LibTorch and transitioning to Java 25's **Foreign Function & Memory (FFM) API**, we have simplified the deployment stack while maintaining—and in many cases, exceeding—native performance levels.

## 🏗️ The Architectural Shift: Why Pure Java?

Historically, running high-performance LLMs in Java required bridging to C++ libraries like LibTorch or ONNX Runtime. While effective, this added complexity to builds, deployments, and memory management.

Our new **`DirectInferenceEngine`** changes the game:

1.  **Zero-Overhead Weight Loading**: Using `MemorySegment` and FFM `FileChannel.map`, we memory-map `.safetensors` weight files directly into off-heap memory. There is no copying between the JVM and native layers.
2.  **Native Hardware Acceleration**: We've implemented a high-performance linear algebra bridge (**`AccelTensor`**) that calls directly into the **Apple Accelerate framework** (Metal/Accelerate) via native FFM stubs.
3.  **Simplified Lifecycle**: Memory management is handled via Panama `Arena` lifecycles, ensuring deterministic cleanup and avoiding the dreaded "memory leaks" often associated with JNI wrappers.

## ⛸️ Stability and UX Polish

Beyond the core engine, we've spent the last few days stabilizing the end-to-end generation experience.

*   **EOS Token Precision**: We fixed a subtle "leakage" issue where control tokens like `<|im_end|>` would appear in the terminal. The engine now queries the tokenizer for all potential sequence terminators, ensuring generation stops exactly when the model intends.
*   **Trust-Based Decoding**: We've removed aggressive "corruption detection" heuristics that occasionally flagged valid text as corrupted. By trusting the underlying tokenizer's raw output, the generation flow is now much smoother.

## 📊 Performance Benchmark

On a standard M4 Mac, the results of this pure Java stack speak for themselves. Running **Qwen2.5-0.5B-Instruct** in 16-bit precision:

```bash
./gollek run --model Qwen/Qwen2.5-0.5B-Instruct --prompt "who are you"
```

**Results:**
*   **Tokens generated**: 107
*   **Speed**: **29.66 t/s**
*   **Platform**: Metal (Apple Silicon)
*   **Provider**: `safetensor` (Pure Java)

## 🚀 How to Try It

If you're already using Gollek, simply update to the latest build and run any model with the `--format safetensors` flag. The CLI will automatically detect the hardware and enable Metal acceleration where available.

```bash
# Verify your installation
./gollek run --model Qwen/Qwen2.5-0.5B-Instruct --prompt "Hello!" --format safetensors
```

## 🎯 What's Next?

With the foundation of a pure Java inference engine, we are now looking at:
*   **Quantization Support**: Native INT4/INT8 dequantization kernels within the FFM layer.
*   **Flash Attention 3**: A pure Java implementation of FA3 kernels using the latest JDK vector intrinsics.
*   **CUDA Integration**: Bringing the same pure Java approach to NVIDIA hardware.

---

*Gollek is proving that Java is a first-class citizen for the next generation of AI infrastructure. No Python, no heavy wrappers—just clean, high-performance Java.*

**Join the conversation on [GitHub](https://github.com/gollek-ai/gollek)**
