---
layout: default
title: Quantization Config Examples
---

# Quantization Config Examples

This page shows the main operational shapes used across Gollek quantization
workflows.

See also:

- [Quantization Docs](/docs/framework/quantization-docs)
- [Model Quantization](/docs/framework/quantization)
- [Quantization Glossary](/docs/framework/quantization-glossary)
- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)

## Source And Output Directory Convention

Keep the source model and quantized output in different directories:

```text
/models/
  llama3-8b-fp16/
  llama3-8b-int8/
```

What to notice:

- the source path stays unchanged
- the output path clearly reflects the target strategy
- the quantized output is treated as a new artifact, not an in-place mutation

## Minimal Java INT8 Example

```java
Path inputPath = Paths.get("/models/llama3-8b-fp16");
Path outputPath = Paths.get("/models/llama3-8b-int8");

QuantConfig config = QuantConfig.int8();

QuantResult result = quantizationEngine.quantize(
    inputPath,
    outputPath,
    QuantizationEngine.QuantStrategy.INT8,
    config
);
```

Use this shape when:

- you want the safest baseline production path
- Java application code is the orchestration boundary

## Minimal Java INT4 Example

```java
Path inputPath = Paths.get("/models/llama3-8b-fp16");
Path outputPath = Paths.get("/models/llama3-8b-int4");

QuantConfig config = QuantConfig.int4Gptq();

QuantResult result = quantizationEngine.quantize(
    inputPath,
    outputPath,
    QuantizationEngine.QuantStrategy.INT4,
    config
);
```

Use this shape when:

- compression matters more than keeping the highest-quality baseline
- CPU or memory-bound deployment is the main target

## Advanced Java Builder Shape

```java
QuantConfig config = QuantConfig.builder()
    .strategy(QuantizationEngine.QuantStrategy.INT4)
    .groupSize(128)
    .bits(4)
    .symmetric(false)
    .perChannel(true)
    .actOrder(false)
    .dampPercent(0.01)
    .numSamples(128)
    .seqLen(2048)
    .build();
```

What to notice:

- `groupSize`, `numSamples`, and `seqLen` belong to the advanced-tuning layer
- this is not the first-run path
- start from a preset like `QuantConfig.int8()` or `QuantConfig.int4Gptq()`
  before moving here

## Minimal REST Request

```json
{
  "input_path": "/models/llama3-8b-fp16",
  "output_path": "/models/llama3-8b-int8",
  "strategy": "INT8",
  "bits": 8,
  "symmetric": false,
  "per_channel": true
}
```

Use this shape when:

- a remote service or operator path owns the quantization request
- you want the REST payload to mirror the same strategy decision as the Java
  path

## REST Request With INT4 Tuning

```json
{
  "input_path": "/models/llama3-8b-fp16",
  "output_path": "/models/llama3-8b-int4",
  "strategy": "INT4",
  "bits": 4,
  "group_size": 128,
  "symmetric": false,
  "per_channel": true,
  "act_order": false,
  "damp_percent": 0.01,
  "num_samples": 128,
  "seq_len": 2048
}
```

What to notice:

- the REST field names follow payload conventions like `group_size`
  and `per_channel`
- the advanced INT4 path mirrors the same tuning concepts as the Java builder

## Minimal Success Response Shape

```json
{
  "success": true,
  "output_path": "/models/llama3-8b-int8",
  "original_size": "16.00 GB",
  "quantized_size": "4.00 GB",
  "compression_ratio": 4.0,
  "strategy": "INT8"
}
```

This is the smallest useful success boundary to look for:

- success state
- output path
- size change
- compression ratio
- chosen strategy

## Fast Operational Checklist

- input path and output path are different
- the output directory name reflects the target strategy
- the first run uses a preset before advanced tuning
- Java and REST paths carry the same strategy decision
- success is validated from the returned result or response before follow-on use

## Related Docs

- [Quantization Docs](/docs/framework/quantization-docs)
- [Model Quantization](/docs/framework/quantization)
- [Quantization Glossary](/docs/framework/quantization-glossary)
- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
