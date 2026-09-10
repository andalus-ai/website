---
layout: default
title: Recursive Reasoning Artifact Examples
---

# Recursive Reasoning Artifact Examples

This page shows abbreviated shapes for the current recursive-reasoning
artifacts.

Use it when you want to recognize the persisted JSON layouts before wiring the
demo, inspectors, or workflow script into local automation.

See also:

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary)
- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)

## `recursive-reasoning-report.json`

```json
{
  "reportVersion": "1",
  "familyId": "generative-recursive-reasoning",
  "taskId": "sudoku-demo",
  "config": {
    "transitionsPerSupervisionStep": 2,
    "supervisionSteps": 2,
    "parallelSamples": 3,
    "seed": 2026
  },
  "summary": {
    "exploredTrajectoryCount": 3,
    "completedTrajectoryCount": 3,
    "selectedStateId": "state-s2-e1-t2"
  },
  "selectedTrajectoryIndex": 2,
  "selectedCumulativeLogProbability": -2.0,
  "selectedRewardScore": 1.25
}
```

What to notice:

- the current family writes one compact report artifact
- `config` captures rollout depth and width
- `summary` carries compact explored/completed counts plus the selected state id
- selected trajectory, reward, and cumulative log-probability stay top-level for fast inspection

## `recursive-reasoning-compare-result.json`

```json
{
  "resultVersion": "1",
  "manifest": {
    "resultVersion": "1",
    "resultType": "recursive-reasoning-compare",
    "baselineReportFile": "/tmp/recursive-reasoning-baseline/recursive-reasoning-report.json",
    "currentReportFile": "/tmp/recursive-reasoning-current/recursive-reasoning-report.json",
    "baselineTaskId": "sudoku-demo",
    "currentTaskId": "sudoku-demo-b"
  },
  "overview": {
    "summary": "full",
    "comparison": {
      "rewardDelta": -0.5,
      "cumulativeLogProbabilityDelta": -0.5
    },
    "health": {
      "familyMatch": true,
      "reportVersionMatch": true
    }
  },
  "comparison": {
    "baselineSelectedStateId": "state-s2-e1-t2",
    "currentSelectedStateId": "state-s1-e1-t2",
    "rewardDelta": -0.5
  },
  "health": {
    "familyMatch": true,
    "reportVersionMatch": true
  },
  "summary": {
    "rewardDelta": -0.5,
    "cumulativeLogProbabilityDelta": -0.5,
    "familyMatch": true,
    "reportVersionMatch": true
  }
}
```

What to notice:

- the saved compare result is a single-file artifact
- it keeps `manifest`, `overview`, `comparison`, `health`, and `summary` together
- `summary` is the compact reopen path when you only want the highest-signal deltas

## Compare Bundle `manifest.json`

```json
{
  "bundleVersion": "1",
  "bundleType": "recursive-reasoning-compare",
  "baselineReportFile": "/tmp/recursive-reasoning-baseline/recursive-reasoning-report.json",
  "currentReportFile": "/tmp/recursive-reasoning-current/recursive-reasoning-report.json",
  "files": {
    "manifest": "manifest.json",
    "result": "recursive-reasoning-compare-result.json",
    "overview": "overview.json",
    "comparison": "comparison.json",
    "health": "health.json",
    "summary": "summary.json"
  }
}
```

What to notice:

- the compare bundle is intentionally small and JSON-only right now
- `manifest.json` is the index for the rest of the bundle
- the current stable bundle payloads are:
  - `recursive-reasoning-compare-result.json`
  - `overview.json`
  - `comparison.json`
  - `health.json`
  - `summary.json`

## Suggested Companions

After this page, the most useful follow-ups are:

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary)
- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)
- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
