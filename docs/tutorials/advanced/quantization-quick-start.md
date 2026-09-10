---
layout: default
title: Quantization Quick Start
parent: Advanced Tutorials
nav_order: 38
---

# Quantization Quick Start

This tutorial walks through the shortest useful Gollek quantization path:

1. choose one strategy
2. quantize one model directory to one output directory
3. verify the output artifact exists
4. choose whether the next consumer is Java code or the REST path

See also:

- [Quantization Docs](/docs/framework/quantization-docs)
- [Model Quantization](/docs/framework/quantization)
- [Quantization Glossary](/docs/framework/quantization-glossary)
- [Quantization Config Examples](/docs/framework/quantization-config-examples)

## Pick One Baseline Strategy

Use one of these defaults first:

- `QuantConfig.int4Gptq()` for the smallest output and strongest compression
- `QuantConfig.int8()` for the safest quality-first production default
- `QuantConfig.fp8()` when the target runtime is built around FP8-capable GPUs

If you are unsure, start with `QuantConfig.int8()` and only move to INT4 once
you have a working baseline.

## Path A: Quantize From Java

Use the programmatic API when your application or tooling already lives in the
Java runtime:

```java
@Inject
QuantizationEngine quantizationEngine;

public void quantizeModel() {
    Path inputPath = Paths.get("/models/llama3-8b-fp16");
    Path outputPath = Paths.get("/models/llama3-8b-int8");

    QuantConfig config = QuantConfig.int8();

    QuantResult result = quantizationEngine.quantize(
        inputPath,
        outputPath,
        QuantizationEngine.QuantStrategy.INT8,
        config
    );

    if (!result.isSuccess()) {
        throw new IllegalStateException("Quantization failed");
    }
}
```

The first useful verification step is simple:

- the call returns a successful `QuantResult`
- the output directory now exists at the path you chose

Once that works, your next move is:

- keep using the same output path from Java for local loading or follow-on
  automation
- only then start tuning group size, sample count, or other advanced fields

## Path B: Quantize Through REST

Use the REST path when quantization is being driven remotely or through an
operations boundary:

```bash
curl -X POST http://localhost:8080/api/v1/quantization/quantize \
  -H "Content-Type: application/json" \
  -d '{
    "input_path": "/models/llama3-8b-fp16",
    "output_path": "/models/llama3-8b-int8",
    "strategy": "INT8",
    "bits": 8,
    "symmetric": false,
    "per_channel": true
  }'
```

The first useful verification step is the same:

- the response returns `success: true`
- the output directory now exists at the path you chose

Use this path when the quantization request belongs to a service workflow
instead of application-local Java code.

## What To Check Right After The First Run

- the output path is different from the source path
- the quantized artifact directory exists
- the chosen strategy matches the real deployment target
- you can report the result as one of:
  - compression-first INT4
  - quality-first INT8
  - FP8 GPU-oriented path

## Fast Decision Rule

- choose Java:
  when quantization is part of application code, tests, or local tooling
- choose REST:
  when quantization belongs to a remote service, API workflow, or operator path

## Related Docs

- [Quantization Docs](/docs/framework/quantization-docs)
- [Model Quantization](/docs/framework/quantization)
- [Quantization Glossary](/docs/framework/quantization-glossary)
- [Quantization Config Examples](/docs/framework/quantization-config-examples)
