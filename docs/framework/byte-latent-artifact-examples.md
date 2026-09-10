---
layout: default
title: Byte-Latent Artifact Examples
---

# Byte-Latent Artifact Examples

This page shows abbreviated example shapes for the main Byte-Latent persisted
artifacts.

Use it when you want to recognize the output families before wiring them into
shell automation, CI checks, or downstream tooling.

See also:

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Byte-Latent Glossary](/docs/framework/byte-latent-glossary)
- [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference)
- [Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow)

## `byte-latent-report.json`

Abbreviated example:

```json
{
  "schema": "gollek.byte-latent.report.v1",
  "summary": {
    "epochsCompleted": 3,
    "bestTrainLoss": 0.42,
    "globalStep": 96
  },
  "history": [
    {
      "epoch": 1,
      "trainLoss": 0.81,
      "bestLossSoFar": 0.81
    },
    {
      "epoch": 2,
      "trainLoss": 0.55,
      "bestLossSoFar": 0.55
    }
  ],
  "artifacts": {
    "historyFile": "byte-latent-history.csv",
    "summaryFile": "byte-latent-summary.json",
    "manifestFile": "byte-latent-checkpoint.metadata"
  }
}
```

What to notice:

- one top-level schema marker
- a compact trainer summary block
- embedded history rows for quick reopen logic
- explicit artifact paths for the rest of the checkpoint family

## `train-infer-report.json`

Abbreviated example:

```json
{
  "reportVersion": "gollek.byte-latent.train-infer.v1",
  "overview": {
    "checkpointDir": "trainer_checkpoints/byte_latent_demo",
    "status": "ok"
  },
  "training": {
    "latestTrainLoss": 0.55,
    "historyRows": 3
  },
  "inference": {
    "nextToken": 32,
    "nextTokensPreview": "[' ', 't', 'e']",
    "combinedText": "hello there"
  },
  "commands": {
    "overview": "jbang ... overview",
    "status": "jbang ... status"
  },
  "selectors": {
    "overview": "overview",
    "nextTokens": "nextTokens",
    "health": "health"
  },
  "statusSummary": "ok | historyRows=3 | nextToken=32",
  "artifactSummaryLine": "checkpoint ok, inference available"
}
```

What to notice:

- this is the stable one-run train+infer artifact
- training and inference stay separate at the top level
- `commands`, `selectors`, and status-oriented summary fields are persisted for
  direct reuse by humans and scripts

## Workflow `manifest.json`

Abbreviated example:

```json
{
  "workflow": "byte-latent",
  "mode": "full",
  "workflowBundleDir": "/tmp/byte-latent-workflow-bundle",
  "runs": [
    {
      "name": "fresh",
      "checkpointDir": "/tmp/gollek-byte-latent/fresh",
      "historyRows": 3,
      "inspectRunCommands": "jbang ... runcommands:fresh"
    },
    {
      "name": "resume",
      "checkpointDir": "/tmp/gollek-byte-latent/resume",
      "historyRows": 5,
      "inspectRunCommands": "jbang ... runcommands:resume"
    }
  ],
  "inspectWorkflowStatus": "jbang ... status",
  "inspectWorkflowHealth": "jbang ... health"
}
```

What to notice:

- the workflow manifest is the multi-run orchestration artifact
- it records fresh/resume run metadata in one place
- it persists follow-up commands and bundle location instead of making callers
  reconstruct them

## Compare Bundle `manifest.json`

Abbreviated example:

```json
{
  "bundleType": "byte-latent-train-infer-compare",
  "reportVersion": "gollek.byte-latent.compare.v1",
  "leftReportVersion": "gollek.byte-latent.train-infer.v1",
  "rightReportVersion": "gollek.byte-latent.train-infer.v1",
  "status": {
    "healthStatus": "ok",
    "missingFileCount": 0,
    "okFileCount": 8
  },
  "commands": {
    "bundleSummary": "jbang ... bundleSummary",
    "bundleHealth": "jbang ... bundleHealth:ci"
  },
  "files": [
    {
      "section": "overview",
      "name": "overview.json",
      "format": "json",
      "status": "ok"
    },
    {
      "section": "runs",
      "name": "runs.json",
      "format": "json",
      "status": "ok"
    }
  ]
}
```

What to notice:

- compare bundles are reusable exported artifacts, not just live terminal views
- health/status and follow-up commands are embedded into the manifest
- file metadata is explicit enough for `files`, `filesSummary`, and `loadfile:`
  reopen flows

## Suggested Companions

After this page, the most useful follow-ups are:

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Byte-Latent Glossary](/docs/framework/byte-latent-glossary)
- [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference)
- [Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow)
