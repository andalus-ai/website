---
layout: default
title: Byte-Latent Workflow
parent: Advanced Tutorials
nav_order: 35
---

# Byte-Latent Workflow

This tutorial walks through the shortest useful Byte-Latent terminal workflow:

1. run a checkpoint-producing demo
2. inspect one run's history and status
3. inspect a workflow manifest and workflow bundle
4. compare two train+infer reports
5. export and reopen a reusable compare bundle

See also:

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Byte-Latent Modeling](/docs/framework/byte-latent)
- [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference)
- [Byte-Latent Glossary](/docs/framework/byte-latent-glossary)
- [Byte-Latent Artifact Examples](/docs/framework/byte-latent-artifact-examples)

## Recommended Local Layout

Keep one-report and two-report artifacts in predictable directories:

```text
artifacts/
  byte-latent-demo/
  byte-latent-workflow/
  byte-latent-baseline/
  byte-latent-current/
  byte-latent-compare-bundle/
```

That layout makes it easier to keep single-run inspection separate from
baseline-vs-current compare work.

## Step 1: Produce One Checkpoint Run

Start with the smallest runnable checkpoint flow:

```bash
jbang trainer/trainer_byte_latent_demo.java
```

That demo materializes the main one-run artifacts:

- `byte-latent-summary.json`
- `byte-latent-history.csv`
- `byte-latent-report.json`

If you want a resumable trainer flow instead, use:

```bash
jbang trainer/trainer_byte_latent_resume_demo.java
```

## Step 2: Inspect One Run

Use the history inspector first, because it is the smallest stable entrypoint
for one checkpoint directory.

Status and health:

```bash
jbang trainer/trainer_byte_latent_history_inspector.java \
  trainer_checkpoints/byte_latent_demo \
  status

jbang trainer/trainer_byte_latent_history_inspector.java \
  trainer_checkpoints/byte_latent_demo \
  health
```

Compact history rollups:

```bash
jbang trainer/trainer_byte_latent_history_inspector.java \
  trainer_checkpoints/byte_latent_demo \
  history:summary

jbang trainer/trainer_byte_latent_history_inspector.java \
  trainer_checkpoints/byte_latent_demo \
  history:sort=-trainLoss:top=3 json
```

Use this phase when you only care about one run's checkpoint state and epoch
history.

## Step 3: Inspect A Workflow Manifest

The workflow runner is useful when you want the fresh/resume/full view rather
than a single checkpoint directory.

Run the unified launcher:

```bash
./trainer/run_byte_latent_workflow.sh full /tmp/gollek-byte-latent
```

Then inspect the workflow manifest:

```bash
jbang trainer/trainer_byte_latent_workflow_inspector.java \
  /tmp/gollek-byte-latent/byte_latent_workflow_manifest.json \
  overview

jbang trainer/trainer_byte_latent_workflow_inspector.java \
  /tmp/gollek-byte-latent/byte_latent_workflow_manifest.json \
  commands:ci

jbang trainer/trainer_byte_latent_workflow_inspector.java \
  /tmp/gollek-byte-latent/byte_latent_workflow_manifest.json \
  delta:historyRows
```

Those selectors answer three different questions:

- what this workflow contains
- what the best follow-up commands are
- how the fresh and resumed runs differ at a compact level

## Step 4: Inspect A Workflow Bundle

The same workflow inspector can export and reopen a bundle:

```bash
jbang trainer/trainer_byte_latent_workflow_inspector.java \
  /tmp/gollek-byte-latent/byte_latent_workflow_manifest.json \
  bundle=standard json /tmp/byte-latent-workflow-bundle
```

Then reopen it:

```bash
jbang trainer/trainer_byte_latent_workflow_inspector.java \
  /tmp/byte-latent-workflow-bundle \
  bundleHealth:ci

jbang trainer/trainer_byte_latent_workflow_inspector.java \
  /tmp/byte-latent-workflow-bundle \
  filesSummary:by=section json

jbang trainer/trainer_byte_latent_workflow_inspector.java \
  /tmp/byte-latent-workflow-bundle \
  loadfile:section=runs:pick=last json
```

This is the reusable artifact path for workflow-level inspection and sharing.

## Step 5: Produce Two Train+Infer Reports

For baseline-vs-current work, create two persisted train+infer reports.

One practical pattern is:

- run one report into `artifacts/byte-latent-baseline/`
- run another into `artifacts/byte-latent-current/`

The exact report producer can be your local train+infer demo or another
existing automation, as long as both sides emit `train-infer-report.json`.

## Step 6: Compare Two Reports Directly

The compare inspector is the shortest direct two-report path.

```bash
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  artifacts/byte-latent-baseline/train-infer-report.json \
  artifacts/byte-latent-current/train-infer-report.json \
  compareSummary

jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  artifacts/byte-latent-baseline/train-infer-report.json \
  artifacts/byte-latent-current/train-infer-report.json \
  delta:latestTrainLoss

jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  artifacts/byte-latent-baseline/train-infer-report.json \
  artifacts/byte-latent-current/train-infer-report.json \
  delta:combinedText
```

That gives you:

- one compact compare summary
- one training-side scalar delta
- one inference/output-side text delta

## Step 7: Export And Reopen A Compare Bundle

Once the direct compare looks useful, export a reusable bundle:

```bash
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  artifacts/byte-latent-baseline/train-infer-report.json \
  artifacts/byte-latent-current/train-infer-report.json \
  bundle=standard json artifacts/byte-latent-compare-bundle
```

Then reopen it with compact selectors:

```bash
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  artifacts/byte-latent-compare-bundle \
  bundleHealth:ci

jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  artifacts/byte-latent-compare-bundle \
  filesSummary:by=section:sort=-count:top=3

jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  artifacts/byte-latent-compare-bundle \
  loadfile:section=runs:index=0 json
```

This is the best path when you want a shareable artifact for repeated
follow-up inspection instead of rerunning the live compare command every time.

## Fast Decision Tree

Use:

- `trainer_byte_latent_history_inspector.java`
  when you have one checkpoint directory
- `trainer_byte_latent_workflow_inspector.java`
  when you have a workflow manifest or workflow bundle
- `trainer_byte_latent_train_infer_compare_inspector.java`
  when you have baseline and current train+infer reports

## Related Docs

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference)
- [Byte-Latent Glossary](/docs/framework/byte-latent-glossary)
- [Byte-Latent Artifact Examples](/docs/framework/byte-latent-artifact-examples)
- [Byte-Latent Modeling](/docs/framework/byte-latent)
