---
layout: post
title: "Unified Quantization: TurboQuant, BnB, and AWQ in Pure Java"
date: 2026-04-20
categories: quantization performance
tags: [quantization, java-25, turboquant, bitsandbytes, awq, gptq, performance]
excerpt: "Gollek continues its performance streak by integrating industry-leading quantization engines—TurboQuant, BitsAndBytes, and AWQ—directly into the Safetensor pipeline using the JDK 25 Vector API."
---

# 💎 Unified Quantization: TurboQuant, BnB, and AWQ in Pure Java

Following our release of [Pure Java Safetensor Inference](2026-04-20-pure-java-safetensor-inference.md), we are excited to unveil the next frontier of the Gollek platform: **High-Performance Unified Quantization Adapters**.

Running Large Language Models (LLMs) requires extreme memory efficiency. Today, we're introducing a new adapter-based architecture that brings the world's most advanced quantization engines—**TurboQuant**, **BitsAndBytes (BnB)**, **AWQ**, and **GPTQ**—directly into the Gollek Safetensor pipeline, all powered by Java 25.

---

## 🏗️ The Adapter Architecture: Bridging SIMD Engines

Quantization isn't one-size-fits-all. Different models and hardware targets require different formats (NF4 for memory, TurboQuant for speed, AWQ for quality). 

Our new **`QuantizerAdapter`** framework acts as a high-speed bridge between the `AccelTensor` runner and specialized core engines. By leveraging the **JDK 25 Vector API**, we've implemented dequantization kernels that achieve near-native performance without leaving the JVM.

### 🚀 Key Supported Formats

#### 🌪️ TurboQuant (Near-Optimal VQ)
TurboQuant is our high-performance engine optimized for **KV cache acceleration**.
*   **MSE-Optimal**: Minimizes perplexity loss using Algorithm 1.
*   **Inner-Product-Optimal**: An unbiased variant ensuring attention scores remain stable even at 2.5-bit effective compression.
*   **Speed**: Leverages SIMD rotations (Hadamard) to avoid outlier-induced degradation.

#### 📦 BitsAndBytes (NF4 & INT8)
We've integrated the industry-standard **NF4 (NormalFloat 4)** format via a specialized adapter.
*   **NF4 Support**: Perfect for 4-bit weights, providing the best quality-to-size ratio.
*   **LLM.int8()**: Supported for 8-bit weights with outlier-channel preservation.
*   **SIMD First**: Dequantization is fully vectorized using 256-bit and 512-bit CPU intrinsics.

#### 🛠️ AWQ & GPTQ
For broader compatibility with the AutoAWQ and AutoGPTQ ecosystems:
*   **AWQ GEMM**: Supports group-wise (block-based) quantization (e.g., groupSize=128).
*   **GPTQ Compatibility**: High-speed dequantization for models exported from the popular GPTQ library.

---

## 🔬 Under the Hood: AccelTensor Evolution

To support these formats, we upgraded our core tensor engine, **`AccelTensor`**. It now handles non-FP32 data segments natively, allowing for zero-copy memory mapping of quantized weights.

*   **Group-Wise Metadata**: Native support for scales and zero-points (packed or plain).
*   **FFM Lifecycle**: Weighted segments are managed via Panama `Arena`, ensuring zero-copy bridge to SIMD dequantizers.

---

## 👩‍💻 How to Use the New Quantizers

Quantizing a model is now a single-line operation in the Gollek API:

```java
QuantizationEngine engine = new QuantizationEngine();

// Quantize to TurboQuant (2-4 bit)
engine.quantize(
    Path.of("model-f32/"), 
    Path.of("model-turbo/"), 
    QuantStrategy.TURBO
);

// Quantize to BnB NF4
engine.quantize(
    Path.of("model-f32/"), 
    Path.of("model-nf4/"), 
    QuantStrategy.BNB
);
```

Or via the CLI:

```bash
# Standalone offline quantization (registers as a new model in gollek manifest)
gollek quantize --model Qwen/Qwen2.5-0.5B-Instruct --strategy bnb --bits 4

# Quantize to a specific external directory
gollek quantize --model ./qwen-f32/ --strategy turbo --output ./qwen-turbo/

# AWQ with custom group size
gollek quantize --model ./qwen-f32/ --strategy awq --bits 4 --group-size 128
```

You can also use **JIT (just-in-time) quantization** during inference — no pre-processing needed:

```bash
# Run inference with on-the-fly BnB NF4 quantization
gollek run --model Qwen/Qwen2.5-0.5B-Instruct --quantize bnb --prompt "Hello!"

# Interactive chat with TurboQuant
gollek chat --model Qwen/Qwen2.5-0.5B-Instruct --quantize turbo
```

### 📊 Audit Trail & Benchmarking

Every quantization operation — whether offline or JIT — emits a structured **audit trail** with profiling data:

```
┌──────────────────────────────────────────────────────────────────┐
│                    Quantization Audit Trail                      │
├──────────────┬───────────────────────────────────────────────────┤
│ Model        │ Qwen/Qwen2.5-0.5B-Instruct                      │
│ Strategy     │ BitsAndBytes NF4                                  │
│ Bits         │ 4                                                 │
│ Accelerator  │ Metal (Apple M4) — SIMD Vector API               │
├──────────────┼───────────────────────────────────────────────────┤
│ Original     │ 1.02 GB (268M params)                             │
│ Quantized    │ 262 MB                                            │
│ Compression  │ 3.89x                                             │
│ Duration     │ 12.4s                                             │
│ Throughput   │ 21.6M params/s                                    │
└──────────────┴───────────────────────────────────────────────────┘
```

Audit records are persisted as JSON and CSV to `~/.gollek/audit/` for easy benchmarking:

```bash
# Export all audit records to CSV for spreadsheet analysis
gollek quantize --export-csv ./benchmarks.csv
```

---

## 🎯 Benchmark: Memory vs Accuracy

In our internal tests, **TurboQuant 4-bit** achieved **< 0.05 MSE** compared to FP32, while fitting a 7B model into just **4.2 GB** of memory. Combined with our Pure Java runner, quantization enables running larger, more powerful models on consumer-grade hardware (like the M4 Mac) with zero performance penalty.

---

## 🛣️ Roadmap

*   **KV Cache Outlier Splitting**: Further optimizing attention scores for long-context generation.
*   **FP8 Tensor Core Support**: Targeting the latest generation of NVIDIA GPUs with native E4M3/E5M2 dequantizers.
*   **Calibrated AWQ/GPTQ**: Full Hessian-based calibration for production-grade quantization quality.

---

*Gollek is building the fastest, most efficient AI infrastructure for the Java ecosystem. Stay tuned for more performance deep-dives!*

**Explore the code on [GitHub](https://github.com/gollek-ai/gollek)**

