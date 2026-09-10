---
layout: default
title: Byte-Latent Glossary
---

# Byte-Latent Glossary

This page defines the core terms used across Gollek’s Byte-Latent modeling,
inspection, workflow, and compare docs.

Use it when you understand the general flow but want a fast vocabulary
reference for artifact names and inspector language.

## Terms

### baseline report

The earlier `train-infer-report.json` artifact used as the left-hand or
comparison-anchor side in a Byte-Latent train+infer compare flow.

### bundle

A generated directory of inspection artifacts exported by one of the
Byte-Latent inspectors. A bundle usually includes multiple rendered files and a
`manifest.json`.

### bundle health

A compact integrity view over a bundle that answers whether the bundle is
complete, which files are missing, and whether any grouped section or format
rollups show gaps.

### checkpoint directory

The trainer output directory that contains one run’s persisted Byte-Latent
artifacts, such as `byte-latent-summary.json`, `byte-latent-history.csv`, and
`byte-latent-report.json`.

### commands:ci

A compact inspector selector that returns the shortest high-signal follow-up
commands for CI or terminal-first usage.

### compare bundle

A reusable exported artifact directory written by
`trainer_byte_latent_train_infer_compare_inspector.java` from two
`train-infer-report.json` inputs.

### compare inspector

The JBang entrypoint
`trainer_byte_latent_train_infer_compare_inspector.java`, used for direct
baseline-vs-current comparisons and compare bundle reopen flows.

### compare summary

A compact comparison view that summarizes the highest-signal baseline-vs-current
differences without reopening the whole structured compare payload.

### current report

The newer `train-infer-report.json` artifact being compared against a baseline
report.

### delta selector

A compare-oriented selector of the form `delta:<field>`, used to extract one
focused baseline-vs-current difference such as `delta:latestTrainLoss` or
`delta:combinedText`.

### files summary

A grouped rollup over generated bundle files, typically keyed by section or
format through selectors such as `filesSummary:by=section`.

### history inspector

The JBang entrypoint `trainer_byte_latent_history_inspector.java`, used for
one-run checkpoint status, health, summary, and epoch-history queries.

### history row

One persisted epoch-level row in `byte-latent-history.csv`, representing a
single observed step in the training timeline.

### inspectfields

A selector family that advertises the stable machine-readable fields exposed by
an inspector or exported artifact.

### loadfile

A selector family for reopening one generated file from a bundle, optionally by
section, index, or pick mode such as first/last.

### nextTokensPreview

A compact preview-oriented representation of the ranked next-token output used
in train+infer artifacts and compare flows.

### one-run inspection

The checkpoint-oriented path where you inspect one trainer output directory
without comparing it against another report.

### report version

The schema marker persisted into train+infer or compare artifacts so downstream
tools can tell which stable artifact contract they are reading.

### runcommands

A workflow-manifest selector family that advertises the most useful follow-up
commands for one fresh/resume run or for the whole multi-run manifest.

### runfields

A workflow-manifest selector family that advertises the machine-readable field
surface for one run or the compact run-discovery view.

### selector

A compact terminal grammar string passed to a Byte-Latent inspector to choose
one summary, one filtered slice, one artifact view, or one bundle operation.

### train+infer inspector

The JBang entrypoint `trainer_byte_latent_train_infer_inspector.java`, used for
reading one persisted `train-infer-report.json` artifact.

### train-infer report

The persisted artifact `train-infer-report.json` that combines training-side
and inference-side output for one Byte-Latent run.

### two-report comparison

The workflow where a baseline report and a current report are compared either
directly in the terminal or through an exported compare bundle.

### workflow bundle

A reusable artifact directory exported from a workflow manifest through the
workflow inspector.

### workflow inspector

The JBang entrypoint `trainer_byte_latent_workflow_inspector.java`, used for
fresh/resume/full workflow manifest inspection and workflow bundle reopen flows.

### workflow manifest

The JSON artifact written by the unified workflow launcher that records the
fresh/resume/full run layout, follow-up commands, bundle location, and compact
workflow metadata.

## Suggested Companions

After this glossary, the most useful follow-ups are:

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Byte-Latent Modeling](/docs/framework/byte-latent)
- [Byte-Latent Artifact Examples](/docs/framework/byte-latent-artifact-examples)
- [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference)
- [Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow)
