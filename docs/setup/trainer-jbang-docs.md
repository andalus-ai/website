---
layout: default
title: Trainer JBang Docs
---

# Trainer JBang Docs

This page is the best entrypoint for Gollek’s terminal-first trainer lane.

Use it when you are trying to answer one of these questions:

- which JBang trainer example should I start with
- whether I need generic trainer runtime, Byte-Latent, DiffusionOPD, or Recursive Reasoning
- how to move from one trainer demo into report inspection and bundle workflows

See also:

- [Training Docs](/docs/framework/training)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
- [Advanced Tutorials](/docs/tutorials/advanced/)
- [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow)

## Which Page Should I Read?

If you want the full JBang catalog across all categories, start with:

- [JBang Examples Catalog](/docs/setup/jbang-examples)

If you want one guided terminal-first walkthrough, use:

- [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow)

If you want the generic trainer runtime entrypoint, start with:

- `trainer_runtime_bootstrap.java`

If you want a Byte-Latent trainer workflow, start with:

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow)

If you want a DiffusionOPD trainer workflow, start with:

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)

If you want the new recursive-reasoning trainer workflow, start with:

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)

## Do You Want Generic Trainer Runtime, Byte-Latent, DiffusionOPD, Or Recursive Reasoning?

If you want the generic trainer-runtime shell first, start with:

- `trainer_runtime_bootstrap.java`
- [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow)

If you want Byte-Latent checkpoint, workflow, and compare flows, start with:

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- `run_byte_latent_workflow.sh`

If you want diffusion-alignment and report-query flows, start with:

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- `trainer_diffusion_opd_report_inspector.java`

If you want GRAM-style recursive rollout experimentation, start with:

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- `run_recursive_reasoning_workflow.sh`
- `trainer_recursive_reasoning_checkpoint_demo.java`
- `trainer_recursive_reasoning_checkpoint_inspector.java`

Rule of thumb:

- generic trainer runtime means “show me the trainer shell and session shape”
- Byte-Latent means checkpoint and train+infer inspection workflows
- DiffusionOPD means report, campaign, and bundle-oriented diffusion training workflows
- Recursive Reasoning means stochastic latent rollout reports, compare results, and compare bundles

## Main Surfaces

- `trainer_runtime_bootstrap.java`
  is the smallest generic trainer-runtime entrypoint.
- `gollek/examples/jbang/trainer/`
  is the repo home for trainer-focused JBang demos, inspectors, and workflow
  wrappers.
- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
  cover the strongest current checkpoint/workflow/compare trainer lane.
- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
  cover the diffusion-specific trainer/report/query lane.
- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
  cover the new GRAM-style recursive rollout trainer lane.
- [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow)
  is the guided terminal-first path across the generic runtime and the current
  stronger specialized training families.

## Starter Commands

```bash
cd gollek/examples/jbang

jbang trainer/trainer_runtime_bootstrap.java

./trainer/run_byte_latent_workflow.sh full /tmp/gollek-byte-latent

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json \
  overview

./trainer/run_recursive_reasoning_workflow.sh full /tmp/recursive-reasoning

jbang trainer/trainer_recursive_reasoning_checkpoint_demo.java \
  /tmp/recursive-reasoning-checkpoints

jbang trainer/trainer_recursive_reasoning_checkpoint_demo.java \
  /tmp/recursive-reasoning-checkpoints-unhealthy \
  clean \
  lineage-unhealthy

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  restore \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineage \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageChain \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageGraph \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealth \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthSchema \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthValidation \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthValidationSchema \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthSchemaCatalog \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthSchemas \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthSchemaCatalogSchema \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthSchemaLock \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthSchemaLockSchema \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthSchemaLockValidation \
  schemaLock=/tmp/lineage-health-schema-lock.json \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthSchemaLockValidation \
  schemaLock=/tmp/lineage-health-schema-lock.json \
  requireSchemaLockValid=true \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  lineageHealthSchemaLockValidationSchema \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  overview \
  requireLineageHealthy=true

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  preflight \
  currentReport=/tmp/current-plan-report.json \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  explain \
  currentReport=/tmp/current-plan-report.json \
  json

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  explain \
  currentReport=/tmp/current-plan-report.json \
  resumeMode=force \
  json
```

That sequence gives you:

- one generic trainer-runtime bootstrap
- one Byte-Latent full workflow
- one DiffusionOPD report inspection entrypoint
- one Recursive Reasoning full workflow
- one Recursive Reasoning checkpoint sidecar fixture
- one Recursive Reasoning checkpoint restore/preflight inspection command for
  directories that contain recursive-reasoning dataset checkpoint sidecars

## Where Does This Live In The Repo?

| Path | Role |
|------|------|
| `gollek/examples/jbang/trainer/` | Main terminal-first trainer lane |
| `gollek/trainer/` | Generic trainer runtime modules |
| `gollek/training/` | Specialized training-family implementations |

Fast practical entrypoints:

- `gollek/examples/jbang/trainer/README.md`
- `gollek/examples/jbang/trainer/trainer_runtime_bootstrap.java`
- `gollek/examples/jbang/trainer/run_byte_latent_workflow.sh`
- `gollek/examples/jbang/trainer/run_recursive_reasoning_workflow.sh`
- `gollek/examples/jbang/trainer/trainer_recursive_reasoning_checkpoint_demo.java`
- `gollek/examples/jbang/trainer/trainer_recursive_reasoning_checkpoint_inspector.java`

## What’s Stable Vs Evolving?

The current stable-enough surfaces are:

- the documented trainer JBang entrypoints
- the Byte-Latent, DiffusionOPD, and Recursive Reasoning docs hubs
- the existing report/compare/bundle inspector entrypoints already documented there

The more likely-to-evolve areas are:

- newer family-specific workflow wrappers
- richer result and bundle grammars
- some older generic trainer examples that are still less structured than the newer family hubs

Rule of thumb:
use this page to choose the right trainer family first, then move into the
family-specific hub for the detailed workflow.

## Docs Status

Current trainer-JBang docs coverage includes:

- generic trainer runtime routing
- Byte-Latent trainer workflow routing
- DiffusionOPD trainer/report routing
- Recursive Reasoning trainer/report routing
- repo entrypoint guidance
- top-level family chooser
- guided trainer-JBang workflow tutorial

Recent additions:

- dedicated training docs hub
- dedicated recursive-reasoning docs cluster
- stronger terminal-first trainer workflow coverage
- trainer-JBang workflow tutorial
- top-level family chooser

Fastest follow-up pages:

- [JBang Examples Catalog](/docs/setup/jbang-examples)
- [Training Docs](/docs/framework/training)
- [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow)
- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
