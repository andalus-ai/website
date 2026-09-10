---
layout: default
title: Recursive Reasoning Glossary
---

# Recursive Reasoning Glossary

This page defines the core terms used across Gollek’s recursive-reasoning
module, report, compare, and workflow docs.

Use it when you understand the general flow but want a fast vocabulary
reference for artifact names, rollout language, and inspector selectors.

See also:

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)
- [JBang Examples Catalog](/docs/setup/jbang-examples)

## Terms

### baseline report

The earlier `recursive-reasoning-report.json` artifact used as the left-hand or
comparison-anchor side in a recursive-reasoning compare flow.

### bundle

A generated directory of comparison artifacts exported by
`trainer_recursive_reasoning_compare_inspector.java`. A bundle includes several
JSON files plus a `manifest.json`.

### bundle health

A compact integrity view over a recursive-reasoning compare bundle that answers
whether the expected files were written and whether the saved bundle is
reopenable through the inspector.

### compare bundle

The reusable directory written by the recursive-reasoning compare inspector
through `bundle=standard`.

### compare inspector

The JBang entrypoint `trainer_recursive_reasoning_compare_inspector.java`, used
for direct two-report comparisons, saved compare result reopening, and compare
bundle reopening.

### compare result

The compact saved single-file artifact written by the recursive-reasoning
compare inspector through `result=standard`.

### current report

The newer `recursive-reasoning-report.json` artifact being compared against a
baseline report.

### delta selector

A compare-oriented selector of the form `delta:<field>`, used to extract one
focused baseline-vs-current difference such as
`delta:selectedRewardScore` or `delta:completedTrajectoryCount`.

### family id

The stable model-family label persisted into recursive-reasoning reports. In
the current starter lane it is `generative-recursive-reasoning`.

### in-memory session

The current reference training/session path implemented by
`InMemoryRecursiveReasoningSession`. It is the lightweight starter lane for
running recursive rollouts without a larger external trainer runtime.

### length-sorted epoch

A `DiscreteTokenDatasetEpoch` built after sorting examples by combined input
and target token length. This reduces padding capacity for variable-length
structured reasoning datasets before tensor conversion.

### one-report inspection

The workflow where one recursive-reasoning run is inspected on its own without
being compared against another report.

### parallel sample

One sampled reasoning branch inside a recursive rollout. Multiple parallel
samples let the rollout explore more than one latent path before selecting the
best trajectory.

### padded token batch

A `DiscreteTokenDatasetBatch` containing rectangular input and target token
arrays, masks, original sequence lengths, known solution counts, and metadata.
It is still backend-neutral and can be converted later into Gollek tensors,
ONNX tensors, LiteRT inputs, GGUF runner inputs, or research tensors.

### recursive reasoning report

The persisted artifact `recursive-reasoning-report.json` that captures the
current recursive-reasoning session’s selected trajectory, reward, and compact
rollout summary.

### stratified dataset split

A train/validation/test split that groups examples by `taskId` before applying
validation and test fractions. Use it when a dataset mixes N-Queens, Graph
Coloring, Sudoku, ARC-style grids, or other structured reasoning benchmarks.

### report version

The schema marker persisted into recursive-reasoning reports and saved compare
artifacts so downstream tools can identify which stable artifact contract they
are reading.

### rollout summary

The compact count-oriented summary describing how many trajectories were
explored, how many completed, and which state ended up selected.

### selected state

The final chosen latent state for the winning trajectory after the rollout
selection rule has been applied.

### selected trajectory

The chosen reasoning path among the sampled trajectories. It is typically
identified by the selected trajectory index plus the selected state id.

### stochastic latent transition

The transition contract that advances one latent reasoning state to the next
while also providing per-step reward and log-probability information.

### supervision step

The outer rollout stage in the recursive reasoning process. Each supervision
step can contain one or more inner transitions.

### transition index

The per-trajectory inner-step counter inside one supervision step sequence.

### two-report comparison

The workflow where a baseline report and a current report are compared either
directly in the terminal or through a saved compare result or compare bundle.

### workflow script

The shell wrapper `run_recursive_reasoning_workflow.sh`, which runs the demo,
synthesizes a changed current report, exports a compare result, exports a
compare bundle, and prints follow-up inspector commands.

## Suggested Companions

After this glossary, the most useful follow-ups are:

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)
- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
