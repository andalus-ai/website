---
layout: default
title: Recursive Reasoning Docs
---

# Recursive Reasoning Docs

This section groups the current Gollek recursive-reasoning materials into one
reader path.

It is the best entrypoint if you are trying to answer one of these questions:

- where the new GRAM-style recursive-reasoning family fits in Gollek
- how to run the small in-memory recursive-reasoning demo
- how to inspect one `recursive-reasoning-report.json`
- how to compare two recursive-reasoning reports and reopen saved compare artifacts

See also:

- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)
- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
- [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary)
- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)
- [gollek-ml-recursive-reasoning API Reference](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-recursive-reasoning)
- [JBang Examples Catalog](/docs/setup/jbang-examples)

## Which Page Should I Read?

If you want the module and training-family placement, start with the repository
integration note in
[`GENERATIVE_RECURSIVE_REASONING_INTEGRATION_PLAN.md`](https://github.com/bhangun/gollek/blob/main/gollek/docs/GENERATIVE_RECURSIVE_REASONING_INTEGRATION_PLAN.md).

If you want the implementation package and starter contracts, go to:

- `gollek/training/gollek-train-recursive-reasoning/`

If you want the fastest practical terminal path, start with:

- `gollek/examples/jbang/trainer/run_recursive_reasoning_workflow.sh`

If you want one guided end-to-end walkthrough, use:

- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)

If you want trainer-facing dataset planning for structured reasoning examples,
use:

- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)

If you want a quick vocabulary reference for report, rollout, compare-result,
and compare-bundle terms, use:

- [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary)

If you want to see the current JSON shapes before running the tools, use:

- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)

If you want one-report inspection, use:

- `trainer_recursive_reasoning_inspector.java`

If you want trainer checkpoint restore inspection, use:

- `trainer_recursive_reasoning_checkpoint_demo.java`
- `trainer_recursive_reasoning_checkpoint_inspector.java`

Use the inspector `restore` section when a script needs the typed restore-plan
payload, including checkpoint paths, run identity, selected policy, resume
report status, and nested checkpoint metadata.
Use `lineage` when a script needs only the selected checkpoint ancestry:
origin run, parent run/step/fingerprint when present, relation, generation, and
lineage attributes.
Use `lineageChain` when that script needs the selected checkpoint's resolved
root-to-leaf ancestry, including missing-parent, ambiguous-parent, parent
identity mismatch, or cycle flags.
Use `lineageGraph` when dashboards or CI jobs need to inspect every checkpoint
lineage node under the root and catch duplicate run ids, broken parent links,
parent identity mismatches, or cycles.
Use `lineageHealth` for a compact pass/fail payload that lists issue types and
affected run ids without returning every graph node. Its `issueDetails` array
adds stable issue codes, severity, blocking status, affected checkpoint paths,
issue-specific reasons, and remediation actions for CI logs. Use its top-level
`kind` and `schemaVersion` fields to pin the health payload contract in CI or
dashboard parsers. Java consumers can use
`DiscreteTokenDatasetCheckpointLineageHealthSnapshot` to rehydrate and validate
that payload without raw map parsing, and `jsonSchemaMetadata()` exposes the
bundled JSON Schema for external validators. Use
`DiscreteTokenDatasetCheckpointLineageHealthValidationReport` or the inspector
`lineageHealthValidation` section when CI needs a compact valid/invalid report.
Use `lineageHealthSchema`, `lineageHealthValidationSchema`,
`lineageHealthSchemaCatalog`, or the full `lineageHealthSchemas` catalog when
external tooling needs to discover the lineage-health contracts from the
inspector. Use `lineageHealthSchemaCatalogSchema` when that catalog shape also
needs to be pinned. Use `lineageHealthSchemaLock` when CI wants the smallest
stable lock payload for that bundle, and `lineageHealthSchemaLockSchema` to
validate the lock shape. Use `lineageHealthSchemaLockValidation` with
`schemaLock=/path/to/lock.json` when CI should compare a saved lock against the
current contracts, add `requireSchemaLockValid=true` when that comparison should
fail the command on drift, and use `lineageHealthSchemaLockValidationSchema`
when that valid/invalid report shape should be pinned too. The validation report
includes its own schema id/resource plus expected and actual lock-schema ids, so
logs are self-describing. The catalog and lock include a single
`schemaSetSha256`, plus per-schema SHA-256 digests and byte counts, so CI can
detect schema drift without embedding the full schemas. Java consumers can use
`DiscreteTokenDatasetCheckpointLineageHealthSchemaCatalog.catalogMetadata()` or
`DiscreteTokenDatasetCheckpointLineageHealthValidationReport.jsonSchemaMetadata()`
when external dashboards need those schema contracts directly. Future trainer
artifacts can reuse `DiscreteTokenDatasetSchemaBundle` to expose the same
catalog, lock, and lock-validation mechanics for their own schema groups. Use
its builder for new schema groups so duplicate contract names are rejected
before lock comparisons become ambiguous.
Use `issueCodes`, `issueDetailCount`, and `blockingIssueCount` when automation
needs compact concrete-failure aggregates, and `primaryIssueCode` /
`primaryIssueAction` for the headline failure. Use `healthScore`, `alertLevel`,
and `healthBadge` when trainer dashboards need a compact status pill, and
`checks`, `failingChecks`, and `checkSummary` when they need category-level
lineage invariant status, primary failing-check identity, type, action, full
check payload, or severity rollups; those priority-aware primary failing-check
fields are also mirrored at the top level of `lineageHealth`.
Add `requireLineageHealthy=true` when selection itself should fail on duplicate
run ids, missing parents, ambiguous parents, parent identity mismatches, or
cycles.
Use `preflight currentReport=...` when that script also needs to revalidate the
selected checkpoint against a current dataset plan report before loading state.
Use `explain currentReport=...` when CI logs or trainer UIs need categorized
finding codes, categories, and next steps for the same restore decision.
Add `resumeMode=compatible` to accept warning-only current-plan gates, or
`resumeMode=force` for explicit research/debug resumes that continue through
fingerprint or current-plan mismatches while surfacing compatibility warnings.

If you want two-report comparison, saved compare results, or compare bundles,
use:

- `trainer_recursive_reasoning_compare_inspector.java`

## Do You Have One Report, Two Reports, Or Do You Want The Full Workflow?

If you have one recursive-reasoning report and want status, summary, or
selected-state inspection, start with:

- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow#step-2-inspect-one-report)
- `trainer_recursive_reasoning_inspector.java`

If you have two reports and want baseline-vs-current comparison, start with:

- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow#step-3-compare-two-reports-directly)
- `trainer_recursive_reasoning_compare_inspector.java`
- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)

If you want the whole demo plus compare plus saved-artifact flow in one go,
start with:

- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow#step-6-run-the-one-command-workflow)
- `run_recursive_reasoning_workflow.sh`

Rule of thumb:

- one report means single-run rollout inspection
- two reports mean delta, compare-result, and compare-bundle work
- full workflow means “generate everything and print the next commands for me”

## Main Surfaces

- `gollek-ml-recursive-reasoning`
  is the new recursive-reasoning family for GRAM-style stochastic latent
  rollout work.
- `trainer_recursive_reasoning_demo.java`
  runs the tiny in-memory recursive-reasoning demo and writes
  `recursive-reasoning-report.json`.
- `trainer_recursive_reasoning_inspector.java`
  reads one recursive-reasoning report and supports overview, status, config,
  summary, and selected-state selectors.
- `trainer_recursive_reasoning_compare_inspector.java`
  compares two recursive-reasoning reports, exports saved compare results,
  exports compare bundles, and reopens those saved artifacts later.
- `run_recursive_reasoning_workflow.sh`
  is the one-command smoke path for baseline, current, compare result, and
  compare bundle generation.
- [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary)
  defines the main artifact, rollout, and comparison vocabulary used across
  the new recursive-reasoning docs set.
- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)
  shows abbreviated shapes for the single-report artifact, saved compare
  result, and compare-bundle manifest.
- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)
  is the guided path for demo run, one-report inspection, direct comparison,
  saved compare result reopening, compare bundle reopening, and one-command workflow usage.
- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)
  is the guided path for token examples, profiling, deterministic splits,
  length-sorted epochs, padded batches, and trainer handoff.
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
  is the API guide for dataset examples, profiles, splits, epochs, batches,
  masks, padding metrics, and validation invariants.

## Starter Commands

```bash
cd gollek/examples/jbang

jbang trainer/trainer_recursive_reasoning_demo.java

jbang trainer/trainer_recursive_reasoning_inspector.java \
  trainer_checkpoints/recursive_reasoning_demo \
  overview

jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  /tmp/recursive-reasoning-demo-a \
  /tmp/recursive-reasoning-demo-b \
  comparison:ci

./trainer/run_recursive_reasoning_workflow.sh full /tmp/recursive-reasoning
```

That sequence gives you:

- one demo report
- one compact single-report inspection
- one baseline-vs-current comparison
- one end-to-end workflow that also materializes a compare result and bundle

## Where Does This Live In The Repo?

| Path | Role |
|------|------|
| `gollek/training/gollek-train-recursive-reasoning/` | Main Java recursive-reasoning contracts, rollout executor, session, and report types |
| `gollek/examples/jbang/trainer/` | JBang demo, inspectors, and workflow script |
| `gollek/docs/GENERATIVE_RECURSIVE_REASONING_INTEGRATION_PLAN.md` | High-level placement note for the GRAM-style family |

Fast practical entrypoints:

- `gollek/training/gollek-train-recursive-reasoning/README.md`
- `gollek/examples/jbang/trainer/trainer_recursive_reasoning_demo.java`
- `gollek/examples/jbang/trainer/trainer_recursive_reasoning_inspector.java`
- `gollek/examples/jbang/trainer/trainer_recursive_reasoning_compare_inspector.java`
- `gollek/examples/jbang/trainer/run_recursive_reasoning_workflow.sh`

## What’s Stable Vs Evolving?

The current stable-enough surfaces for readers and downstream scripts are:

- the persisted report name:
  - `recursive-reasoning-report.json`
- the JBang entrypoints:
  - `trainer_recursive_reasoning_demo.java`
  - `trainer_recursive_reasoning_inspector.java`
  - `trainer_recursive_reasoning_compare_inspector.java`
  - `run_recursive_reasoning_workflow.sh`
- the current single-report, compare-result, and compare-bundle selector families

The more likely-to-evolve areas are:

- richer trainer/session strategy beyond the current in-memory reference path
- larger bundle/export vocabularies
- future rollout-policy, checkpoint, or campaign-style higher-order reporting

Rule of thumb:
anchor first on the report artifact and the documented inspector/workflow
entrypoints, then treat future higher-order reporting layers as the more
changeable part of the family.

## Docs Status

Current recursive-reasoning docs coverage includes:

- training-family placement
- repo entrypoints
- trainer-facing token dataset API
- token dataset profiling, split, epoch, batch, and padding-efficiency examples
- single-report demo/report flow
- one-report inspection
- two-report comparison
- saved compare result reopening
- compare bundle export and reopening
- one-command workflow automation
- glossary coverage
- artifact-shape examples
- API reference coverage for `gollek-ml-recursive-reasoning`
- top-level workflow chooser

Recent additions:

- dataset API reference
- dataset workflow tutorial
- `gollek-ml-recursive-reasoning` API reference page
- recursive-reasoning JBang demo
- single-report inspector
- compare inspector
- compare result export
- compare bundle export
- workflow shell script
- workflow tutorial
- glossary
- artifact examples
- top-level chooser

Fastest follow-up pages:

- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)
- [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary)
- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)

If this docs cluster still is not enough, the fastest next places to look are:

- `gollek/training/gollek-train-recursive-reasoning/README.md`
- `gollek/examples/jbang/trainer/README.md`
- `gollek/docs/GENERATIVE_RECURSIVE_REASONING_INTEGRATION_PLAN.md`

## Related Docs

- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)
- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
- [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary)
- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)
- [gollek-ml-recursive-reasoning API Reference](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-recursive-reasoning)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
