---
layout: default
title: Quantization Docs
---

# Quantization Docs

This page groups the main Gollek quantization materials into one reader path.

It is the best entrypoint if you are trying to answer one of these questions:

- which quantization strategy to use
- how to quantize a model programmatically
- how to drive quantization through the REST API
- when to choose INT4, INT8, or FP8

See also:

- [Model Quantization](/docs/framework/quantization)
- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
- [Quantization Glossary](/docs/framework/quantization-glossary)
- [Quantization Config Examples](/docs/framework/quantization-config-examples)

## Do You Want The Safest Default, Maximum Compression, Or FP8?

If you want the safest default path, start with:

- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
- `QuantConfig.int8()`

If you want maximum compression first, start with:

- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
- `QuantConfig.int4Gptq()`
- the INT4 strategy section in [Model Quantization](/docs/framework/quantization)

If you want the GPU-oriented FP8 path, start with:

- the FP8 strategy section in [Model Quantization](/docs/framework/quantization)
- [Quantization Config Examples](/docs/framework/quantization-config-examples)

Rule of thumb:

- safest default usually means INT8
- maximum compression usually means INT4/GPTQ
- FP8 is the specialized path when the deployment target is built for it

## Which Page Should I Read?

If you want the full quantization guide, start with
[Model Quantization](/docs/framework/quantization).

If you want to choose a strategy first, jump to the strategy-selection sections
inside [Model Quantization](/docs/framework/quantization).

If you want the programmatic Java path first, start with the quick-start code
in [Model Quantization](/docs/framework/quantization).

If you want the REST path first, start with the REST API section in
[Model Quantization](/docs/framework/quantization).

## Main Surfaces

- [Model Quantization](/docs/framework/quantization)
  explains strategy types, Java APIs, progress streaming, selection guidance,
  and REST endpoints.
- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
  gives the shortest first-run path from strategy choice to one output
  artifact.
- [Quantization Glossary](/docs/framework/quantization-glossary)
  defines the core strategy, configuration, calibration, and output terms.
- [Quantization Config Examples](/docs/framework/quantization-config-examples)
  shows abbreviated Java configs, REST payloads, and output-directory
  conventions.

## Starter Paths

### I want the safest default path

1. start with
   [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
2. start with `QuantConfig.int4Gptq()` or `QuantConfig.int8()`
3. use the strategy-selection tables there before tuning advanced fields

### I want to integrate quantization into Java code

1. start with
   [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
2. use the programmatic quick start in
   [Model Quantization](/docs/framework/quantization)
3. move to advanced configuration only after the baseline path works

### I want to call quantization remotely

1. start with
   [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
2. use the REST API section in
   [Model Quantization](/docs/framework/quantization)
3. mirror the same strategy choice in the request payload

## Where Does This Live In The Repo?

| Path | Role |
|------|------|
| `docs/framework/quantization.md` | Main quantization guide |
| `gollek-safetensor-quantization` | Quantization module referenced by the docs |

## What’s Stable Vs Evolving?

The current stable-enough surfaces for readers and downstream users are:

- the documented INT4, INT8, and FP8 strategy families
- the programmatic quick-start path
- the REST API entrypoints described in the docs

The more likely-to-evolve areas are:

- detailed tuning defaults and recommended combinations
- performance/quality guidance for specific model families
- some advanced configuration fields as the engine evolves

Rule of thumb:
anchor integrations first on the main strategy families and the documented Java
or REST entrypoint, then treat deeper tuning guidance as a higher-churn layer.

## Docs Status

Current quantization docs coverage includes:

- landing page and starter-path routing
- top-level strategy chooser
- guided quick-start tutorial
- glossary coverage
- config/examples coverage
- overview of supported strategies
- Java quick-start path
- advanced configuration
- streaming progress path
- strategy-selection tables
- REST API examples

Recent additions:

- landing page
- quick-start tutorial
- glossary
- config/examples page
- cross-navigation pass
- top-level strategy chooser

If the hub still is not enough, the fastest follow-up pages are:

- [Model Quantization](/docs/framework/quantization)
- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
- [Quantization Config Examples](/docs/framework/quantization-config-examples)

## Related Docs

- [Model Quantization](/docs/framework/quantization)
- [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)
- [Quantization Glossary](/docs/framework/quantization-glossary)
- [Quantization Config Examples](/docs/framework/quantization-config-examples)
