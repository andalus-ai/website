---
layout: default
title: Byte-Latent Docs
---

# Byte-Latent Docs

This section groups the current Gollek Byte-Latent materials into one reader
path.

It is the best entrypoint if you are trying to answer one of these questions:

- what the Byte-Latent architecture family is supposed to cover
- where the trainer and checkpoint artifacts live
- how to inspect one training run from the terminal
- how to inspect a workflow manifest or compare two train+infer reports

## Which Page Should I Read?

If you want the architecture and module story, start with
[Byte-Latent Modeling](/docs/framework/byte-latent).

If you want the Java implementation roots and package locations, go to the
repository references in
[Byte-Latent Modeling](/docs/framework/byte-latent#repository-references).

If you want one-report checkpoint inspection from the terminal, use the
history and workflow inspector commands in
[Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference).

If you want one guided end-to-end terminal path, use
[Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow).

If you want two-report train+infer comparisons, go straight to the compare
inspector section in
[Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference).

If you want a quick vocabulary reference for checkpoint, workflow, and compare
terms, use
[Byte-Latent Glossary](/docs/framework/byte-latent-glossary).

If you want to see the main JSON shapes before running the tools, use
[Byte-Latent Artifact Examples](/docs/framework/byte-latent-artifact-examples).

## Do You Have One Run Or Two Reports?

If you have one checkpoint run and want status, history, or workflow inspection,
start with:

- [Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow)
- [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference)

If you have two `train-infer-report.json` artifacts and want baseline-vs-current
comparison, start with:

- [Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow#step-6-compare-two-reports-directly)
- [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference#compare-inspector)
- [Byte-Latent Artifact Examples](/docs/framework/byte-latent-artifact-examples)

Rule of thumb:

- one run means checkpoint, history, and workflow-manifest work
- two reports mean compare summary, delta selectors, and compare-bundle work

## Main Surfaces

- [Byte-Latent Modeling](/docs/framework/byte-latent)
  explains the architecture family, core contracts, checkpoint artifacts, and
  terminal inspection tools.
- [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference)
  is the quick lookup page for history, workflow, train+infer, compare, and
  compare-bundle selector families.
- [Byte-Latent Glossary](/docs/framework/byte-latent-glossary)
  defines the main artifact and selector vocabulary used across the Byte-Latent
  docs set.
- [Byte-Latent Artifact Examples](/docs/framework/byte-latent-artifact-examples)
  shows abbreviated shapes for checkpoint reports, train+infer reports,
  workflow manifests, and compare bundle manifests.
- [Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow)
  is the guided path for running a demo, inspecting one run, inspecting a
  workflow manifest, comparing two reports, and reopening a compare bundle.
- `trainer_byte_latent_history_inspector.java`
  is the compact one-run checkpoint reader for `byte-latent-history.csv` and
  `byte-latent-report.json`.
- `trainer_byte_latent_workflow_inspector.java`
  is the workflow-manifest and workflow-bundle reader for fresh/resume/full
  byte-latent runs.
- `trainer_byte_latent_train_infer_inspector.java`
  is the stable reader for persisted `train-infer-report.json` artifacts.
- `trainer_byte_latent_train_infer_compare_inspector.java`
  compares two train+infer reports and can also reopen exported compare
  bundles.

## Starter Commands

```bash
jbang trainer/trainer_byte_latent_history_inspector.java \
  trainer_checkpoints/byte_latent_demo \
  status

jbang trainer/trainer_byte_latent_history_inspector.java \
  trainer_checkpoints/byte_latent_demo \
  history:summary

jbang trainer/trainer_byte_latent_workflow_inspector.java \
  trainer_checkpoints/byte_latent_workflow_manifest.json \
  overview

jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  /tmp/byte-latent-baseline/train-infer-report.json \
  /tmp/byte-latent-current/train-infer-report.json \
  compareSummary
```

That sequence gives you:

- one checkpoint health/status view
- one compact history rollup
- one workflow-level summary
- one baseline-vs-current train+infer comparison

## Where Does This Live In The Repo?

| Path | Role |
|------|------|
| `gollek/ml/gollek-ml-byte-latent/` | Main Java Byte-Latent implementation package |
| `gollek/examples/jbang/trainer/` | JBang demos, inspectors, and workflow scripts |
| `gollek/training/gollek-train-examples/` | Training/example support modules that feed the docs and demos |

Fast practical entrypoints:

- `gollek/ml/gollek-ml-byte-latent/README.md`
- `gollek/examples/jbang/trainer/run_byte_latent_workflow.sh`
- `gollek/examples/jbang/trainer/trainer_byte_latent_history_inspector.java`
- `gollek/examples/jbang/trainer/trainer_byte_latent_workflow_inspector.java`
- `gollek/examples/jbang/trainer/trainer_byte_latent_train_infer_inspector.java`
- `gollek/examples/jbang/trainer/trainer_byte_latent_train_infer_compare_inspector.java`

## What’s Stable Vs Evolving?

The current stable-enough surfaces for readers and downstream automation are:

- checkpoint artifact names such as `byte-latent-history.csv`,
  `byte-latent-report.json`, and `train-infer-report.json`
- the main JBang inspector entrypoints:
  - `trainer_byte_latent_history_inspector.java`
  - `trainer_byte_latent_workflow_inspector.java`
  - `trainer_byte_latent_train_infer_inspector.java`
  - `trainer_byte_latent_train_infer_compare_inspector.java`
- the documented selector families already exposed by those inspectors

The more likely-to-evolve areas are:

- reference architecture internals and trainer strategy details
- newer workflow-bundle and compare-bundle alias families
- example-lane conventions and higher-level export/discovery shapes

Rule of thumb:
anchor scripts first on the persisted artifact names and the documented
inspector entrypoints, then treat newer bundle and alias layers as higher-churn
convenience surfaces.

## Docs Status

Current Byte-Latent docs coverage includes:

- architecture and module overview
- checkpoint and report artifact description
- one-run history inspection
- workflow manifest and workflow bundle inspection
- train+infer report inspection
- baseline-vs-current compare inspection
- vocabulary/glossary coverage
- artifact-shape examples

Recent additions:

- Byte-Latent docs landing page
- inspector reference
- guided workflow tutorial
- glossary
- artifact examples

If this docs cluster still is not enough, the fastest next places to look are:

- `gollek/ml/gollek-ml-byte-latent/README.md`
- `gollek/examples/jbang/trainer/`
