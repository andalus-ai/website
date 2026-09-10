---
layout: default
title: Trainer JBang Workflow
parent: Advanced Tutorials
nav_order: 37
---

# Trainer JBang Workflow

This tutorial walks through the shortest useful terminal-first Gollek trainer
workflow:

1. bootstrap the generic trainer runtime
2. run one family-specific workflow
3. inspect one produced artifact
4. reopen one saved result or bundle
5. choose the next family-specific lane

See also:

- [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
- [Training Docs](/docs/framework/training)

## Step 1: Check The Generic Trainer Runtime

Start with the smallest trainer-runtime entrypoint:

```bash
cd gollek/examples/jbang

jbang trainer/trainer_runtime_bootstrap.java
```

Use this when you want to verify that the trainer-side runtime surface is
available before moving into a family-specific workflow.

## Step 2: Pick One Family Workflow

Choose one of the current stronger trainer families:

Byte-Latent:

```bash
./trainer/run_byte_latent_workflow.sh full /tmp/gollek-byte-latent
```

Recursive Reasoning:

```bash
./trainer/run_recursive_reasoning_workflow.sh full /tmp/recursive-reasoning

jbang trainer/trainer_recursive_reasoning_checkpoint_demo.java \
  /tmp/recursive-reasoning-checkpoints

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  overview

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

DiffusionOPD:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json \
  overview
```

That split gives you:

- checkpoint/workflow/compare flows for Byte-Latent
- report/compare/bundle and checkpoint restore inspection flows for Recursive Reasoning
- report/query/bundle inspection entrypoints for DiffusionOPD

## Step 3: Inspect One Produced Artifact

Once one workflow has produced artifacts, use the matching inspector.

Byte-Latent workflow manifest:

```bash
jbang trainer/trainer_byte_latent_workflow_inspector.java \
  /tmp/gollek-byte-latent-workflow-manifest.json \
  overview
```

Recursive Reasoning report:

```bash
jbang trainer/trainer_recursive_reasoning_inspector.java \
  /tmp/recursive-reasoning-baseline \
  overview
```

Recursive Reasoning checkpoint selection:

```bash
jbang trainer/trainer_recursive_reasoning_checkpoint_demo.java \
  /tmp/recursive-reasoning-checkpoints

jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java \
  /tmp/recursive-reasoning-checkpoints \
  latestResumeReady \
  restore \
  json
```

DiffusionOPD report:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json \
  taskSummaries:sort=-meanLoss:top=5 table
```

## Step 4: Reopen One Saved Result Or Bundle

The stronger current lanes already support saved artifacts:

Recursive Reasoning compare bundle:

```bash
jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  /tmp/recursive-reasoning-compare-bundle \
  bundleSummary
```

Byte-Latent workflow bundle:

```bash
jbang trainer/trainer_byte_latent_workflow_inspector.java \
  /tmp/byte-latent-workflow-bundle \
  bundleHealth:ci
```

This is the point where the terminal-first lane becomes reusable instead of
single-run only.

## Step 5: Decide The Next Family

Use this rule of thumb:

- choose Byte-Latent when you want checkpoint, workflow, and compare lanes
- choose DiffusionOPD when you want typed report, campaign, release, and bundle inspection lanes
- choose Recursive Reasoning when you want GRAM-style rollout reports, compare results, and compare bundles

## Next Step

After this tutorial, the best follow-up hubs are:

- [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
