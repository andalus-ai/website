---
layout: default
title: "Beyond GGUF: Direct SafeTensor Inference with LibTorch and Project Panama"
date: 2026-03-31
description: Exploring Gollek's "Direct Engine"—a zero-copy, JNI-free inference system that runs raw SafeTensor weights using LibTorch and JDK 25.
categories: [engineering, performance]
tags: [safetensors, libtorch, project-panama, java, inference, zero-copy]
cover: laser
---

<p class="blog-meta">Published: March 31, 2026</p>

# Beyond GGUF: Direct SafeTensor Inference with LibTorch and Project Panama

While the [GGUF format](./deep-dive-gguf-runner-llama-cpp.md) is fantastic for local LLMs, the AI research world speaks a different language: **SafeTensors**. 

In this deep dive, we explore the **Gollek SafeTensor Runner** (`gollek/plugins/runner/safetensor`), a high-performance inference engine that runs raw HuggingFace weights directly in Java. No conversion required. No JNI overhead. Just pure, zero-copy performance.

---

## 1. The Zero-Copy Holy Grail: `at_from_blob`

The biggest bottleneck in cross-language AI is moving data. If you load weights into Java and then copy them to C++ for computation, you’ve already lost the performance battle.

Gollek solves this using a "Zero-Copy Bridge" (`SafetensorWeightBridge.java`). Here is the magic sequence:

1.  **Mmap**: We use JDK 25's `MemorySegment.mapFile()` to map the `.safetensors` file into off-heap memory.
2.  **Panama Address**: We extract the native address of that memory segment.
3.  **LibTorch Wrap**: We call the native LibTorch function `at_from_blob` via Project Panama.

```java
// Logic from SafetensorWeightBridge.java
public Tensor bridge(SafetensorTensor st) {
    MemorySegment segment = st.segment();
    long address = segment.address();
    long[] shape = st.shape();
    int dtype = st.dtype().toScalarType();

    // LibTorch now points to the EXACT same memory as the file on disk
    return libTorch.fromBlob(address, shape, dtype);
}
```

This means the weights are shared between the OS page cache and the compute engine. The first time a layer is used, the OS page-faults it from disk. Subsequent calls are served instantly from RAM.

---

## 2. Orchestrating the Forward Pass in Java

One of the most unique aspects of Gollek is that the **Transformer architecture is defined in Java**. 

While many engines treat the model as a "black box" C++ blob, Gollek’s `DirectForwardPass.java` implements the LLaMA/Mistral/Qwen logic using LibTorch tensor operations. This gives us incredible flexibility:

*   **Flash Attention Integration**: We call high-performance kernels (`FlashAttentionKernel`) directly from the Java loop.
*   **Custom KV Cache**: Java manages the Key-Value cache pages, allowing for advanced memory strategies like PagedAttention.
*   **MoE Support**: Mixture-of-Experts (MoE) logic like that found in Mixtral or DeepSeek is orchestrated directly in Java, routing tokens to expert tensors on the fly.

---

## 3. The Autoregressive Loop

In `TextInferenceEngine.java`, we implement the full generation cycle. Because we are in Java, we can easily integrate with enterprise features:

1.  **Prefill Phase**: Process the entire prompt in one shot to populate the KV cache.
2.  **Decode Phase**: Generate tokens one-by-one in a high-speed loop.
3.  **Streaming**: Each token is streamed back to the user via `SubmissionPublisher` (Java Flow API) as it is generated.
4.  **Sampling**: We implement Temperature, Top-P, and Penalty logic using LibTorch's accelerated math.

---

## 4. Why this matters for Java Developers

By building this "Direct Engine," we’ve removed the "Python Tax." 

You no longer need to run a separate Python microservice just to get state-of-the-art inference. You don't need to wait for a GGUF conversion of the latest model. You can simply:

1.  Download a model from HuggingFace (`safetensors` format).
2.  Point Gollek at the directory.
3.  Start inferencing at native LibTorch speeds.

---

## Conclusion

The combination of **Project Panama**, **LibTorch**, and **SafeTensors** has turned Java into a first-class citizen for AI inference. Gollek doesn't just "support" AI; it provides a high-performance, low-latency foundation for the next generation of intelligent Java applications.

Check out the code in `gollek/plugins/runner/safetensor` and see how we're redefining the boundaries of the JVM!
