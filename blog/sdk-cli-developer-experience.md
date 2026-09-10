---
layout: default
title: "One API, Any Model: The Gollek SDK and CLI Experience"
date: 2026-03-31
description: Exploring how the Gollek SDK and CLI provide a unified interface for GGUF, SafeTensors, and Cloud AI, making high-performance inference accessible to every Java developer.
categories: [developer-experience, tools]
tags: [sdk, cli, java, gguf, safetensors, mcp]
cover: dashboard
---

<p class="blog-meta">Published: March 31, 2026</p>

# One API, Any Model: The Gollek SDK and CLI Experience

In our previous posts, we went deep into the [GGUF engine](./deep-dive-gguf-runner-llama-cpp.md) and the [Direct SafeTensor runner](./safetensor-libtorch-direct-inference.md). But for a developer, the most important question is: **"How do I actually use this in my code?"**

Today, we’re looking at the **Gollek SDK** (`gollek/sdk`) and the **Gollek CLI** (`gollek/ui/gollek-cli`)—the tools that turn complex native inference into a seamless developer experience.

---

## 1. The Unified SDK: Write Once, Run Anywhere

The core philosophy of the Gollek SDK is **abstraction without compromise**. Whether you are running a 4-bit quantized GGUF model on your laptop or a massive BF16 SafeTensor model on an A100, the Java code remains the same.

### Smart Initialization
With `GollekSdkFactory`, you can get up and running in a single line:

```java
// Create an SDK instance pre-configured for local GGUF models
GollekSdk sdk = GollekSdkFactory.createForGguf();

// Or for SafeTensors (LibTorch)
GollekSdk sdk = GollekSdkFactory.createForSafeTensors();
```

### The Universal Inference Interface
The `GollekSdk` interface provides a clean, reactive API (using Smallrye Mutiny) for both blocking and streaming inference:

```java
InferenceRequest request = InferenceRequest.builder()
    .model("llama-3-8b")
    .message(Message.user("Explain Project Panama in one sentence."))
    .temperature(0.7)
    .build();

// Streaming tokens reactive-style
sdk.streamCompletion(request)
   .subscribe().with(chunk -> System.out.print(chunk.getContent()));
```

---

## 2. The Gollek CLI: Your AI Swiss Army Knife

The `gollek` CLI is more than just a test tool; it’s a full-featured environment for managing the AI lifecycle. Built with **Quarkus** and **Picocli**, it’s fast, extensible, and native-ready.

### Interactive Chat with Session Persistence
The `gollek chat` command provides a rich terminal UI with syntax highlighting and real-time performance metrics (Tokens/sec, TTFT). Thanks to the SDK's session management, it supports **KV cache reuse**, making multi-turn conversations lightning-fast.

```bash
gollek chat --model Qwen2.5-7B-GGUF --provider gguf
```

### Model Management & Conversion
Need to turn that new HuggingFace model into a GGUF file? The CLI has you covered:

```bash
# Convert SafeTensors to 4-bit GGUF
gollek convert --input ./my-model --output ./my-model.gguf --quant q4_k_m
```

### MCP (Model Context Protocol) Integration
Gollek is ready for the agentic future. The CLI includes built-in support for **MCP**, allowing your local models to use tools (search, database access, filesystem) via a standardized protocol.

---

## 3. Auditing and Observability

In production, you need to know how your models are performing. The Gollek SDK and CLI include built-in auditing:

*   **`ChatSessionManager`**: Tracks detailed statistics including **TTFT** (Time To First Token), **TPOT** (Token Peak Output Throughput), and **ITL** (Inter-Token Latency).
*   **Audit Logs**: Every request is recorded with its performance profile, helping you identify bottlenecks in your inference pipeline.

---

## 4. The Version 0.1.4 Revolution

The latest release (v0.1.4) introduced "Format-Aware Inference," allowing developers to skip model detection and call format-specific methods directly:

*   `sdk.inferGguf(...)`
*   `sdk.inferSafeTensors(...)`
*   `sdk.pullGgufModel(...)`

This level of specificity combined with universal SPIs makes Gollek the most flexible AI SDK for the JVM.

---

## Conclusion

By providing a unified SDK and a powerful CLI, Gollek bridges the gap between low-level native performance and high-level application development. Whether you're building a CLI tool, a desktop app, or a massive enterprise backend, Gollek gives you the power of state-of-the-art AI with the comfort of the Java ecosystem.

**Ready to build?**
Run `brew install gollek-cli` (if available) or check out the [SDK Guide](../docs/sdk-guide.md) to get started!
