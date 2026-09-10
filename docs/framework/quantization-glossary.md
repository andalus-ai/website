---
layout: default
title: Quantization Glossary
---

# Quantization Glossary

This page defines the main terms used across Gollek's quantization docs.

See also:

- [Quantization Docs](/docs/framework/quantization-docs)
- [Model Quantization](/docs/framework/quantization)
- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
- [Quantization Config Examples](/docs/framework/quantization-config-examples)

## Core Terms

**quantization**
: Converting higher-precision model weights into a smaller numerical format so
  the model uses less storage and memory.

**quantized model**
: The output model directory produced after running the quantization engine.

**source model**
: The original model directory used as the input to quantization.

**output directory**
: The destination path where the quantized model is written. It should be
  different from the source path.

## Strategy Terms

**INT4**
: A 4-bit integer quantization path focused on the strongest compression and
  lower memory use.

**GPTQ**
: The INT4-oriented quantization method used in Gollek's default
  `QuantConfig.int4Gptq()` path.

**INT8**
: An 8-bit integer quantization path that usually gives a safer
  quality-versus-compression balance than INT4.

**FP8**
: An 8-bit floating-point quantization path aimed at runtimes and accelerators
  that benefit from FP8 execution.

## Configuration Terms

**QuantConfig**
: The main Java configuration object used to select strategy defaults or
  customize advanced quantization settings.

**group size**
: The number of weights processed together in grouped quantization. In practice,
  this is one of the main tuning knobs for INT4/GPTQ behavior.

**per-channel scaling**
: A scaling mode where each channel gets its own scale instead of sharing a
  single wider scale across the whole tensor or block.

**symmetric quantization**
: A mode that uses a zero-centered numeric range.

**asymmetric quantization**
: A mode that allows an offset so the numeric range does not have to stay
  centered on zero.

**activation ordering**
: An optional GPTQ-related setting that changes ordering behavior during
  quantization.

**damp percent**
: A stabilizing parameter used in GPTQ-style quantization flows.

## Calibration Terms

**calibration**
: The process of using representative data or settings to help the quantizer
  choose useful numeric scales and ranges.

**calibration samples**
: The number of samples used during calibration-oriented quantization work.

**sequence length**
: The sequence size used for calibration-oriented flows in text-model
  quantization.

## Integration Terms

**programmatic quantization**
: Running quantization directly from Java code through `QuantizationEngine`.

**REST quantization**
: Running quantization through the HTTP API instead of calling the Java API
  directly.

**streaming progress**
: Receiving progress events while quantization is still running instead of only
  waiting for the final result.

**QuantResult**
: The result object returned by the Java quantization path, including success
  state and output statistics.

## Operational Terms

**compression ratio**
: The size reduction factor between the original model and the quantized model.

**quality loss**
: The accuracy or behavior change introduced by quantization compared with the
  original model.

**strategy family**
: One of the documented top-level quantization choices such as INT4, INT8, or
  FP8.

**baseline path**
: The simplest recommended starting configuration before advanced tuning.
