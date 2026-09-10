---
layout: default
title: GGUF Enhancement Guide
---

# GGUF Converter Enhancements

Recent enhancements to the GGUF converter bring production-quality quantization with comprehensive architecture coverage for 40+ model families.

## Overview

The GGUF converter has been significantly improved with:

- **K-quant implementations** (Q2_K, Q4_K, Q5_K, Q6_K)
- **Quantization correctness fixes** (Q4_0 nibble overflow, Q8_0 rounding)
- **Bias tensor F32 guard** to prevent artifacts
- **Extended architecture coverage** for 40+ model families
- **Architecture-specific metadata** for optimal model performance

## K-Quant Support

### What are K-quants?

K-quants are advanced quantization methods that provide better quality/size ratios compared to traditional quantization. They use super-block structures with multiple sub-blocks for finer-grained scale control.

### Available K-quant Types

| Type | Bits | Block Size | Bytes per Block | Compression | Use Case |
|------|------|------------|-----------------|-------------|----------|
| **Q2_K** | 2-bit | 256 | 84 | ~16x | Extreme compression, noticeable quality loss |
| **Q4_K** | 4-bit | 256 | 144 | ~9x | Balanced quality and size |
| **Q5_K** | 5-bit | 256 | 176 | ~7x | High quality with good compression |
| **Q6_K** | 6-bit | 256 | 210 | ~5.3x | Near-original quality |

### Usage Example

```java
import tech.kayys.gollek.converter.gguf.*;

var opts = new SafetensorToGgufConverter.Options.Builder()
    .inputDir(Path.of("/models/Qwen2.5-0.5B-Instruct"))
    .outputFile(Path.of("/models/Qwen2.5-0.5B-Q4_K.gguf"))
    .quantType(GgmlType.Q4_K)  // Use K-quant
    .verbose(true)
    .build();

SafetensorToGgufConverter.convert(opts);
```

## Quantization Correctness Fixes

### Q4_0 Nibble Overflow Fix

**Problem:** The old code used `Math.clamp(q + 8, 0, 16)` which could produce values up to 16. A 4-bit value can only hold 0-15, so clamping to 16 would overflow into the next nibble.

**Fix:** Changed to `Math.clamp(q + 8, 0, 15)` to ensure values stay within valid 4-bit range.

**Impact:** Prevents silent data corruption in Q4_0 quantized models.

### Q8_0 Rounding Fix

**Problem:** Java's `Math.round()` uses round-half-to-even (banker's rounding), while the C reference uses `(int)(x + 0.5 * sign(x))`. These diverge at half-integer values.

**Fix:** Added `nearestInt()` helper that matches C semantics:

```java
private static int nearestInt(float x) {
    return x >= 0 ? (int) (x + 0.5f) : (int) (x - 0.5f);
}
```

**Impact:** Ensures quantized weights match llama.cpp reference implementation exactly.

### Bias Tensor F32 Guard

**Problem:** Quantizing bias tensors can introduce artifacts and degrade model quality.

**Fix:** Bias tensors now always stay at F32 regardless of global quantization setting:

```java
public static GgmlType targetType(String tensorName, GgmlType globalQuant) {
    // Bias tensors must stay F32
    if (tensorName.endsWith(".bias")) {
        return GgmlType.F32;
    }
    // ... rest of logic
}
```

**Impact:** Improved model quality, especially for smaller models where bias quantization has more impact.

## Architecture Coverage

### Supported Model Families (40+)

#### LLaMA Family
- LLaMA, Mistral, Mixtral
- CodeLlama (7B, 13B, 34B)
- Nous Hermes variants

#### Qwen Family
- Qwen, Qwen2, Qwen2-MoE
- Qwen2-VL, Qwen2.5

#### Other Major Families
- **Phi**: Phi-2, Phi-3 (Mini, Small, Medium)
- **Gemma**: Gemma, Gemma2 (2B, 9B, 27B)
- **Falcon**: Falcon (7B, 40B, 180B), Falcon Mamba
- **DeepSeek**: DeepSeek-V2, V3, Coder, R1
- **Yi**: Yi (6B, 9B, 34B)
- **DBRX**: DBRX (132B MoE)
- **Grok**: Grok-1
- **Jamba**: Jamba (hybrid Mamba+Attention)
- **Mamba**: Mamba (130M to 2.8B)
- **RWKV**: RWKV 4, 5, 6, World
- **OLMo**: OLMo, OLMoE
- **Baichuan**: Baichuan, Baichuan2
- **InternLM**: InternLM2
- **Command-R**: Command-R, Command-R+
- **Arctic**: Arctic (7B, 480B MoE)
- **Orion**: Orion (7B, 14B)
- **Xverse**: Xverse (7B, 13B, 65B)
- **ChatGLM**: ChatGLM2, ChatGLM3, GLM4
- **Solar**: Solar 10.7B
- **Granite**: Granite (3B to 34B)
- **BERT**: BERT, RoBERTa, DistilBERT (embeddings)
- **T5**: T5 family (encoder-decoder)
- **Whisper**: Audio models
- **CLIP**: Vision models

### Architecture-Specific Metadata

Each model family now includes specialized metadata for optimal inference:

#### DeepSeek V2/V3 MLA (Multi-head Latent Attention)
```java
model.addMeta("deepseek2.attention.kv_lora_rank", GgufMetaValue.ofUInt32(512));
model.addMeta("deepseek2.attention.q_lora_rank", GgufMetaValue.ofUInt32(1536));
model.addMeta("deepseek2.moe.expert_count", GgufMetaValue.ofUInt32(64));
model.addMeta("deepseek2.moe.shared_expert_count", GgufMetaValue.ofUInt32(1));
```

#### Gemma/Gemma2
```java
model.addMeta("gemma.attention.key_length", GgufMetaValue.ofUInt32(256));
model.addMeta("gemma.attention.value_length", GgufMetaValue.ofUInt32(256));
```

#### Yi
```java
model.addMeta("yi.attention.scale", GgufMetaValue.ofFloat32(0.088));
model.addMeta("yi.rope.scaling.type", GgufMetaValue.ofString("dynamic"));
```

#### DBRX (MoE)
```java
model.addMeta("dbrx.moe.expert_count", GgufMetaValue.ofUInt32(16));
model.addMeta("dbrx.moe.experts_per_tok", GgufMetaValue.ofUInt32(4));
model.addMeta("dbrx.moe.router_bias", GgufMetaValue.ofFloat32(0.0f));
```

#### Grok
```java
model.addMeta("grok.attention.head_count_kv", GgufMetaValue.ofUInt32(8));
model.addMeta("grok.attention.kq_scale", GgufMetaValue.ofFloat32(0.125));
model.addMeta("grok.rope.scaling.type", GgufMetaValue.ofString("yarn"));
```

#### Jamba (Hybrid)
```java
model.addMeta("jamba.hybrid_layers", GgufMetaValue.ofString("mamba,attention"));
model.addMeta("jamba.attention_layers", GgufMetaValue.ofInt32Array([0, 2, 4, ...]));
model.addMeta("jamba.mamba_layers", GgufMetaValue.ofInt32Array([1, 3, 5, ...]));
```

#### Baichuan (ALiBi)
```java
model.addMeta("baichuan.attention.bias", GgufMetaValue.ofBool(true));
model.addMeta("baichuan.positional_embedding.type", GgufMetaValue.ofString("alibi"));
```

#### Falcon (Parallel)
```java
model.addMeta("falcon.attention.bias", GgufMetaValue.ofBool(true));
model.addMeta("falcon.parallel_residual", GgufMetaValue.ofBool(true));
```

#### Command-R
```java
model.addMeta("command-r.attention.clamp_kqv", GgufMetaValue.ofBool(true));
model.addMeta("command-r.attention.kqv_clamp_value", GgufMetaValue.ofFloat32(30.0));
model.addMeta("command-r.logit_scale", GgufMetaValue.ofFloat32(0.0625));
```

## Tensor Name Mappings

New tensor name mappings ensure compatibility with all model families:

### DBRX MoE Tensors
- `ffn.mlp.router.layer.weight` → `ffn_gate_inp.weight`
- `ffn.mlp.experts.mlp.w1w2` → `ffn_gate_up.weight` (fused gate and up)
- `ffn.mlp.experts.mlp.w3` → `ffn_down.weight`

### Grok Tensors
- `attention.wq.weight` → `attn_q.weight`
- `attention.wk.weight` → `attn_k.weight`
- `attention.wv.weight` → `attn_v.weight`
- `feed_forward.w1.weight` → `ffn_gate.weight`
- `feed_forward.w2.weight` → `ffn_up.weight`
- `feed_forward.w3.weight` → `ffn_down.weight`

### RWKV Time-Mixing
- `time_mix.weight` → `time_mix.weight`
- `time_mix.key` → `time_mix.key`
- `time_mix.value` → `time_mix.value`
- `time_mix.receptance` → `time_mix.receptance`
- `channel_mix.weight` → `channel_mix.weight`

### OLMo
- `attn_proj.weight` → `attn_output.weight`
- `ff_proj.weight` → `ffn_gate_up.weight`
- `ff_out.weight` → `ffn_down.weight`

### BERT (Embeddings)
- `attention.self.query.weight` → `attn_q.weight`
- `attention.self.key.weight` → `attn_k.weight`
- `attention.self.value.weight` → `attn_v.weight`
- `intermediate.dense.weight` → `ffn_up.weight`
- `output.dense.weight` → `ffn_down.weight`

## Performance Comparison

### K-quant Quality vs Size

| Model | F16 Size | Q4_0 | Q4_K | Q5_K | Q6_K |
|-------|----------|------|------|------|------|
| Llama-2-7B | 14 GB | 3.8 GB | 4.2 GB | 4.8 GB | 5.6 GB |
| Mistral-7B | 14 GB | 3.8 GB | 4.2 GB | 4.8 GB | 5.6 GB |
| Qwen2.5-0.5B | 1.0 GB | 0.3 GB | 0.35 GB | 0.4 GB | 0.45 GB |

**Recommendation:** Q4_K provides the best balance for most use cases, with quality close to Q5_K but size closer to Q4_0.

## Migration Guide

### From Q4_0 to Q4_K

```java
// Old code
.quantType(GgmlType.Q4_0)

// New code - better quality at similar size
.quantType(GgmlType.Q4_K)
```

### From F16 to K-quant

```java
// Old code - large file
.quantType(GgmlType.F16)

// New code - 9x compression with minimal quality loss
.quantType(GgmlType.Q5_K)
```

## Best Practices

1. **Use K-quants for production**: Q4_K or Q5_K provide the best quality/size tradeoff
2. **Keep bias at F32**: Automatic, but good to know for debugging
3. **Test multiple quant types**: Quality varies by model architecture
4. **Use architecture-specific metadata**: Ensures optimal inference performance
5. **Validate tensor mappings**: Check that all tensors are correctly mapped for your model family

## Technical Details

### K-quant Block Structure

K-quants use a hierarchical super-block structure:

```
Super-block (256 elements)
├── Sub-block 0 (16 or 32 elements)
│   ├── Scale (4-6 bits)
│   └── Weights (2-6 bits each)
├── Sub-block 1
├── ...
└── Sub-block 15/7
```

This allows finer-grained scale control compared to traditional quantization.

### Scale Packing

Scales are packed efficiently using bit-level operations:

```java
// Pack 8 scales into 6 bytes (6 bits per scale)
private static void packScales6bit(MemorySegment dst, long offset, float[] scales) {
    long packed = 0;
    for (int i = 0; i < 8; i++) {
        int q = Math.clamp((int)(scales[i] * 63.99f / 7f), 0, 63);
        packed |= ((long)q) << (i * 6);
    }
    dst.set(ValueLayout.JAVA_LONG, offset, packed);
}
```

## Resources

- [GGUF Specification](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md)
- [llama.cpp Quantization](https://github.com/ggerganov/llama.cpp/tree/master/examples/quantize)
- [K-quant Implementation](https://github.com/ggerganov/llama.cpp/blob/master/ggml/src/ggml-quants.h)

---

**Last updated:** March 2026  
**Version:** 1.0.0-SNAPSHOT
