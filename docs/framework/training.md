---
layout: default
title: Training Docs
---

# Training Docs

This page is the best entrypoint for Gollek’s Java-native training lane.

Use it when you are trying to answer one of these questions:

- how to build a normal training loop in the core framework
- where the trainer runtime and JBang training entrypoints live
- when to use the generic training path versus a specialized family like
  DiffusionOPD, Byte-Latent, or Recursive Reasoning

See also:

- [Gollek Framework](/docs/framework/framework)
- [Training Fast Gate](/docs/framework/training-fast-gate)
- [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
- [Advanced Tutorials](/docs/tutorials/advanced/)

## Which Page Should I Read?

If you want the core framework-side training story, start with:

- [ML SDK Guide](/docs/framework/ml-sdk)
- [Framework Architecture](/docs/framework/framework)

If you want an end-to-end example of a standard supervised workflow, start
with:

- [Examples Docs](/docs/setup/examples-docs)

If you want terminal-first trainer entrypoints, start with:

- [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
- `gollek/examples/jbang/trainer/`
- [JBang Examples Catalog](/docs/setup/jbang-examples)

If you want specialized training families instead of the generic trainer lane,
start with:

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)

## Main Surfaces

- [ML SDK Guide](/docs/framework/ml-sdk)
  is the core framework-side entrypoint for building and training models in
  Java.
- [Framework Architecture](/docs/framework/framework)
  explains the broader module and ML/runtime structure around the training lane.
- `gollek-trainer-*`
  is the trainer runtime family for training sessions, orchestration, and
  trainer-facing execution contracts.
- `gollek/examples/jbang/trainer/`
  is the terminal-first lane for runnable trainer demos, inspectors, and
  workflow wrappers.
- [Training Fast Gate](/docs/framework/training-fast-gate)
  documents the CI metadata gate, advisory training candidates, guarded
  promotion plans, validation reports, and promotion fingerprints.
- [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
  is the setup-side landing page for choosing the right trainer JBang family.
- [Examples Docs](/docs/setup/examples-docs)
  is the most obvious standard supervised training example in the docs set.
- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
  cover Java-first diffusion on-policy distillation and its report/query flow.
- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
  cover byte-latent checkpoint, workflow, and compare inspection flows.
- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
  cover the new GRAM-style recursive rollout family, reports, comparisons, and
  workflow automation.

## Starter Paths

If you want the normal framework training path:

1. Read [ML SDK Guide](/docs/framework/ml-sdk).
2. Follow [Examples Docs](/docs/setup/examples-docs) for the current supervised-example routes.
3. Move to [Advanced Tutorials](/docs/tutorials/advanced/) when you need
   family-specific workflows.

If you want the terminal-first trainer path:

1. Open [JBang Examples Catalog](/docs/setup/jbang-examples).
2. Start in `gollek/examples/jbang/trainer/`.
3. Pick the family-specific workflow you actually need.

Or start with [Trainer JBang Docs](/docs/setup/trainer-jbang-docs) if you want
the family chooser first.

If you want a specialized family immediately:

1. Use [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs) for diffusion
   alignment and reporting lanes.
2. Use [Byte-Latent Docs](/docs/framework/byte-latent-docs) for checkpoint,
   workflow, and train+infer compare lanes.
3. Use [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
   for GRAM-style recursive rollout experimentation.

## Where Does This Live In The Repo?

| Path | Role |
|------|------|
| `gollek/ml/` | Core ML framework modules used by training code |
| `gollek/trainer/` | Trainer runtime modules and orchestration contracts |
| `gollek/training/` | Specialized training-family modules such as diffusion and recursive reasoning |
| `gollek/examples/jbang/trainer/` | Runnable trainer demos, inspectors, and workflow scripts |

Fast practical entrypoints:

- `gollek/examples/jbang/trainer/README.md`
- `gollek/training/README.md`
- `gollek/ml/`
- `gollek/trainer/`

## What’s Stable Vs Evolving?

The current stable-enough surfaces for readers are:

- the core framework training path through `gollek-ml-*`
- the trainer runtime family in `gollek-trainer-*`
- the documented JBang trainer entrypoints
- the family-specific docs hubs for DiffusionOPD, Byte-Latent, and Recursive
  Reasoning

The more likely-to-evolve areas are:

- newer family-specific workflow wrappers and bundle grammars
- newer trainer-side automation around specialized reports
- some of the older general framework prose that predates the newer docs hubs

Rule of thumb:
use this page to choose the right training lane first, then move into the
family-specific docs hub once you know whether your work is generic,
diffusion-specific, byte-latent, or recursive-reasoning.

## Docs Status

Current training docs coverage includes:

- core framework training guidance
- trainer runtime and JBang entrypoint routing
- standard supervised example routing
- specialized-family routing for DiffusionOPD, Byte-Latent, and Recursive
  Reasoning

Recent additions:

- dedicated recursive-reasoning family docs
- stronger family-specific docs hubs
- more terminal-first JBang training coverage

Fastest follow-up pages:

- [ML SDK Guide](/docs/framework/ml-sdk)
- [Training Fast Gate](/docs/framework/training-fast-gate)
- [Examples Docs](/docs/setup/examples-docs)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
- [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
