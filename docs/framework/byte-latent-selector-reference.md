---
layout: default
title: Byte-Latent Inspector Reference
---

# Byte-Latent Inspector Reference

This page is the compact lookup guide for the Byte-Latent JBang inspector
family.

Use it when you already know the workflow and just need the right selector,
bundle mode, or follow-up command shape.

If you need terminology help first, start with
[Byte-Latent Glossary](/docs/framework/byte-latent-glossary).

See also:

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow)
- [Byte-Latent Artifact Examples](/docs/framework/byte-latent-artifact-examples)

## Quick Cheat Sheet

```bash
jbang trainer/trainer_byte_latent_history_inspector.java \
  trainer_checkpoints/byte_latent_demo \
  status

jbang trainer/trainer_byte_latent_history_inspector.java \
  trainer_checkpoints/byte_latent_demo \
  history:sort=-trainLoss:top=3 json

jbang trainer/trainer_byte_latent_workflow_inspector.java \
  trainer_checkpoints/byte_latent_workflow_manifest.json \
  commands:ci

jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  /tmp/byte-latent-a/train-infer-report.json \
  /tmp/byte-latent-b/train-infer-report.json \
  compareSummary

jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  /tmp/byte-latent-a/train-infer-report.json \
  /tmp/byte-latent-b/train-infer-report.json \
  bundle=standard json /tmp/byte-latent-train-infer-compare-bundle

jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java \
  /tmp/byte-latent-train-infer-compare-bundle \
  bundleHealth:ci
```

## Inspector Families

| Inspector | Main input | Use it for |
|----------|------------|------------|
| `trainer_byte_latent_history_inspector.java` | checkpoint dir or report path | One-run history, summary, status, health, and epoch-level slices |
| `trainer_byte_latent_workflow_inspector.java` | workflow manifest or workflow bundle dir | Fresh/resume/full workflow summaries, run discovery, bundle inspection |
| `trainer_byte_latent_train_infer_inspector.java` | `train-infer-report.json` or checkpoint dir | Single persisted train+infer artifact inspection |
| `trainer_byte_latent_train_infer_compare_inspector.java` | two train+infer reports or compare bundle dir | Baseline-vs-current compare views, delta selectors, compare bundle export and reopen |

## History Inspector

Common top-level selectors:

- `overview`
- `summary`
- `status`
- `health`
- `ci`

History selectors:

- `history:summary`
- `history:lastLoss`
- `history:epoch=<n>`
- `history:sort=-trainLoss:top=3`

Use this inspector when you only have one checkpoint run and want the
training-side artifact status plus compact epoch rollups.

## Workflow Inspector

Common workflow selectors:

- `overview`
- `status`
- `health`
- `commands`
- `commands:summary`
- `commands:ci`
- `commands:ci:mode=fresh`
- `inspectfields`
- `inspectfields:summary`
- `inspectfields:ci`
- `runcommands`
- `runcommands:all`
- `runcommands:summary`
- `runcommands:ci`
- `runcommands:fresh`
- `runfields`
- `runfields:summary`
- `runfields:ci`
- `delta:historyRows`

Bundle export:

- `bundle=standard json /tmp/byte-latent-workflow-bundle`

Bundle reopen selectors:

- `bundleSummary`
- `bundleHealth`
- `bundleHealth:ci`
- `filesSummary:by=section`
- `filesSummary:by=format`
- `files:section=runs`
- `files:name=overview.json`
- `file:overview.json`
- `loadfile:section=runs`
- `loadfile:section=runs:pick=last`
- `loadfile:section=runs:index=0`

Use this inspector when you are working at the fresh/resume/full workflow
level rather than one checkpoint directory.

## Train+Infer Inspector

Common selectors:

- `reportVersion`
- `overview`
- `overview:ci`
- `training`
- `inference`
- `nextToken`
- `nextTokens`
- `nextTokensPreview`
- `generatedText`
- `combinedText`
- `commands`
- `commands:ci`
- `selectors`
- `selectors:ci`
- `inspectfields`
- `inspectfields:ci`
- `statusSummary`
- `status`
- `health`
- `ci`
- `artifactSummary`
- `artifactSummaryLine`

Use this inspector when you want the stable persisted train+infer report for
one run, without moving into baseline-vs-current comparison yet.

## Compare Inspector

Common live compare selectors:

- `overview`
- `runs`
- `status`
- `health`
- `ci`
- `left`
- `right`
- `comparison`
- `compareSummary`
- `compareSummaryLine`

Common delta selectors:

- `delta:latestTrainLoss`
- `delta:nextToken`
- `delta:nextTokens`
- `delta:nextTokensPreview`
- `delta:nextTokensCount`
- `delta:combinedText`

Discovery selectors:

- `commands`
- `commands:ci`
- `selectors`
- `selectors:ci`
- `inspectfields`
- `inspectfields:ci`

Use this inspector when you have two train+infer reports and need one direct
comparison before exporting anything.

## Compare Bundle Grammar

Export:

- `bundle=standard json /tmp/byte-latent-train-infer-compare-bundle`

Bundle summary and health:

- `bundleSummary`
- `comparisonSummary`
- `bundleStatus`
- `bundleHealth`
- `bundleHealth:ci`

Grouped file rollups:

- `filesSummary:by=section`
- `filesSummary:by=format`
- `filesSummary:by=section:sort=-count:top=3`

Filtered file listing:

- `files:section=runs`
- `files:name=overview.json`
- `files:format=json`

File reopen:

- `file:overview.json`
- `loadfile:overview`
- `loadfile:section=runs`
- `loadfile:section=runs:pick=last`
- `loadfile:section=runs:index=0`

Filtered bundle health:

- `bundleHealth:focus=files:top=5`
- `bundleHealth:focus=files:section=runs:sort=status json`
- `bundleHealth:focus=files:status=missing:top=3 json`
- `bundleHealth:focus=sections:sort=-missingCount json`
- `bundleHealth:focus=formats:section=runs json`

Reopened compare-result aliases:

- `resultSummary`
- `resultSummaryLine`
- `resultOverview`
- `resultHealth`
- `resultStatus`
- `resultManifest`
- `resultComparison`
- `resultPayloads`
- `resultSources`

Use this path when you want a reusable compare artifact instead of a transient
terminal comparison.

## Recommended Reading

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Byte-Latent Modeling](/docs/framework/byte-latent)
- [Byte-Latent Glossary](/docs/framework/byte-latent-glossary)
- [Byte-Latent Artifact Examples](/docs/framework/byte-latent-artifact-examples)
- [Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow)
