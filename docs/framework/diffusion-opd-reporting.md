---
layout: default
title: DiffusionOPD Reporting and Inspection
---

# DiffusionOPD Reporting and Inspection

DiffusionOPD in Gollek is more than a trainer loop. The Java-first lane now
includes:

- normalized persisted artifacts for every run
- typed Java loaders for those artifacts
- query helpers that turn raw round history into status, recommendation,
  campaign, release, and delivery views
- bundle inspection APIs for exported report packs

This page explains how those pieces fit together for application code,
terminal workflows, and downstream tooling.

---

## What gets written

When `checkpointDir(...)` is configured on the trainer, the current OPD lane
can emit three core artifacts:

| Artifact | Purpose |
|----------|---------|
| `diffusion-opd-summary.json` | Compact run metadata and high-level diagnostics |
| `diffusion-opd-history.csv` | Flat round-by-round history for spreadsheet and notebook workflows |
| `diffusion-opd-report.json` | Normalized structured report used by the typed query and inspection APIs |

The normalized report is the most important boundary for Java integrations. It
preserves:

- run metadata
- artifact paths
- teacher, task, stage, and conditioning diagnostics
- adaptive-weighting details
- round-history rows

That means downstream tools no longer need to scrape ad hoc maps or rebuild
derived views from the CSV alone.

---

## Core Java entrypoints

The main reader-facing APIs are:

- `DiffusionOpdReports`
- `DiffusionOpdReportQueries`
- `DiffusionOpdBundleManifests`
- `DiffusionOpdBundleInspector`

Their roles are intentionally different:

| API | Role |
|-----|------|
| `DiffusionOpdReports` | Load and normalize `diffusion-opd-report.json` |
| `DiffusionOpdReportQueries` | Compute typed summaries, trends, campaign decisions, release packets, and delivery/export views |
| `DiffusionOpdBundleManifests` | Load a generated bundle manifest from disk or adapt one from a map |
| `DiffusionOpdBundleInspector` | Inspect bundle sections, health, summaries, files, and loaded generated artifacts |

For a command-oriented lookup of selector forms, bundle modes, projections,
and bundle-health filters, see
[DiffusionOPD Selector Reference](/docs/framework/diffusion-opd-selector-reference).
For quick vocabulary help, see
[DiffusionOPD Reporting Glossary](/docs/framework/diffusion-opd-glossary).

---

## Loading a report

```java
Path reportPath = Path.of("checkpoints/diffusion-opd-report.json");

DiffusionOpdReport report = DiffusionOpdReports.load(reportPath);
```

If you already have parsed JSON, you can also adapt it directly:

```java
JsonNode root = objectMapper.readTree(reportPath.toFile());
DiffusionOpdReport report = DiffusionOpdReports.fromJson(root);
```

For compact terminal-style selectors, `DiffusionOpdReports.select(...)`
supports the same normalized report model:

```java
Object latestOcrLoss = DiffusionOpdReports.select(
    report,
    "roundHistory:task=ocr:lastLoss"
);
```

That is useful for small scripts, but application code usually becomes easier
to maintain once it moves to the typed query layer.

---

## Query layers

`DiffusionOpdReportQueries` is the typed analysis surface built on top of the
normalized report. It is organized as a staged progression instead of one
large unstructured helper set.

### 1. Round-history slices and aggregates

Use these when you want direct history analysis:

- `roundHistoryForTask(...)`
- `summarizeTaskHistory(...)`
- `taskTrend(...)`
- `taskStability(...)`
- `taskStatus(...)`
- `taskRecommendation(...)`
- `taskPlaybook(...)`
- `taskSnapshot(...)`

Example:

```java
var ocrStatus = DiffusionOpdReportQueries.taskStatus(report, "ocr", 5);
var ocrPlaybook = DiffusionOpdReportQueries.taskPlaybook(report, "ocr", 5);
```

Equivalent teacher- and stage-oriented helpers exist too, along with paired
task/teacher, task/stage, and teacher/stage variants.

### 2. Portfolio summaries and comparisons

Use these when you want grouped or paired rollups instead of one filtered
slice:

- `taskPortfolio(...)`
- `teacherPortfolio(...)`
- `stagePortfolio(...)`
- `taskTeacherPortfolio(...)`
- `taskStagePortfolio(...)`
- `teacherStagePortfolio(...)`
- `compareTaskSnapshots(...)`
- `compareTaskPortfolios(...)`
- `taskPortfolioDeltaDashboard(...)`
- `taskPortfolioDriftDashboard(...)`

These are the right layer for dashboards, ranked review queues, and
regression-vs-baseline views.

### 3. Workflow and campaign planning

Use these when you want operator-facing orchestration artifacts built from a
baseline and a current report:

- `taskPortfolioWorkflowActionPacket(...)`
- `taskPortfolioWorkflowExecutionPlan(...)`
- `taskPortfolioWorkflowDispatchEnvelope(...)`
- `taskPortfolioWorkflowBatchManifest(...)`
- `taskCampaignSummary(...)`
- `taskCampaignRolloutPack(...)`
- `taskCampaignApprovalPacket(...)`
- `taskCampaignDecisionLog(...)`
- `taskCampaignIncidentReport(...)`

Example:

```java
DiffusionOpdCampaignApprovalPacket approval =
    DiffusionOpdReportQueries.taskCampaignApprovalPacket(
        baselineReport,
        currentReport,
        1,
        2,
        3,
        5
    );
```

This is the layer that turns portfolio analysis into explicit rollout and
operator-decision artifacts.

### 4. Release and delivery pipeline

The workflow lane continues into explicit release and downstream delivery
artifacts:

- `taskCampaignExecutionReview(...)`
- `taskCampaignReleaseDecision(...)`
- `taskCampaignReleasePacket(...)`
- `taskCampaignReleaseLedger(...)`
- `taskCampaignReleaseExportManifest(...)`
- `taskCampaignReleaseDeliveryReport(...)`
- `taskCampaignReleaseDeliveryLedger(...)`
- `taskCampaignReleaseDeliveryExportManifest(...)`
- `taskCampaignReleaseDeliveryExportReport(...)`
- `taskCampaignReleaseDeliveryExportHandoffBundles(...)`

This matters if your OPD workflow needs to move beyond “should we act?” into
“what exactly gets handed off, acknowledged, reviewed, and closed?”

---

## Canonical export lane vs compatibility lane

The release-delivery side has two public shapes:

- compatibility delivery views such as
  `taskCampaignReleaseDeliveryReport(...)`
- canonical export-delivery views such as
  `taskCampaignReleaseDeliveryExportReport(...)`

The canonical export lane is the newer internal source of truth. The
compatibility lane still exists for callers that want the older aggregate
delivery-shaped records.

When you are starting fresh:

- prefer the `...Export...` APIs for new downstream integrations
- use the compatibility `taskCampaignReleaseDelivery...` APIs only when you
  need the older aggregate record family

---

## Bundle export and inspection

For repeated analysis workflows, the inspector can export bundles of JSON,
CSV, table, or text artifacts together with a manifest. Those manifests can be
loaded and inspected through typed APIs.

### Load a manifest

```java
Path manifestPath = Path.of("artifacts/report-bundle/manifest.json");
DiffusionOpdBundleManifest manifest = DiffusionOpdBundleManifests.load(manifestPath);
```

### Inspect the bundle

```java
DiffusionOpdBundleSummary summary = DiffusionOpdBundleInspector.summary(manifest);
DiffusionOpdBundleHealth health = DiffusionOpdBundleInspector.health(manifest);
List<DiffusionOpdBundleGeneratedFile> files = DiffusionOpdBundleInspector.files(manifest);
```

### Load one generated file

```java
DiffusionOpdBundleLoadedFile loaded =
    DiffusionOpdBundleInspector.loadFile(
        manifest,
        "loadfile:format=csv:section=taskTeacherSummaries"
    );
```

This is especially useful for:

- CI checks over exported report packs
- dashboards that want one generated file plus bundle health
- support tooling that needs to confirm whether a report pack is complete

---

## Artifact examples

The exact payloads keep evolving, but the abbreviated shapes below show what
the main boundaries look like in practice.

### Example: `diffusion-opd-report.json`

```json
{
  "run": {
    "roundsCompleted": 12,
    "samplerType": "ODE",
    "checkpointDir": "artifacts/opd-run"
  },
  "artifacts": {
    "summaryPath": "artifacts/opd-run/diffusion-opd-summary.json",
    "historyPath": "artifacts/opd-run/diffusion-opd-history.csv",
    "reportPath": "artifacts/opd-run/diffusion-opd-report.json"
  },
  "teachers": {
    "values": [
      {
        "teacher": "ocr-early",
        "count": 12,
        "meanLoss": 0.184
      }
    ]
  },
  "conditioning": {
    "values": [
      {
        "task": "ocr",
        "resolveCount": 12,
        "meanLoss": 0.173
      }
    ]
  },
  "roundHistory": [
    {
      "round": 1,
      "task": "ocr",
      "teacher": "ocr-early",
      "stage": "early",
      "averageLoss": 0.221
    }
  ]
}
```

The important thing to notice is the separation between:

- top-level named sections
- compact diagnostics blocks
- the flat `roundHistory` array used by selectors and typed query helpers

### Example: bundle `manifest.json`

```json
{
  "bundleType": "standard",
  "outputFormat": "json",
  "sourceReportPath": "artifacts/opd-run/diffusion-opd-report.json",
  "createdAt": "2026-05-20T12:34:56Z",
  "generatedFiles": [
    {
      "name": "overview.json",
      "section": "overview",
      "format": "json",
      "path": "overview.json"
    },
    {
      "name": "taskSummaries.json",
      "section": "taskSummaries",
      "format": "json",
      "path": "taskSummaries.json"
    }
  ]
}
```

The manifest is the index that makes bundle reopening and validation possible.

### Example: `bundleHealth`

```json
{
  "healthy": true,
  "status": "healthy",
  "healthScore": 1.0,
  "alertLevel": "info",
  "summaryMessage": "All advertised bundle files are present.",
  "recommendedAction": "None.",
  "missingFileCount": 0,
  "missingFiles": [],
  "issueCodes": [],
  "healthBadge": {
    "variant": "success",
    "label": "Healthy",
    "token": "healthy",
    "checkStatus": "passed"
  },
  "checkSummary": {
    "total": 2,
    "passed": 2,
    "failed": 0,
    "status": "healthy"
  }
}
```

This is the compact integrity boundary you would typically feed into CI,
support tooling, or a small operations dashboard.

---

## Practical integration patterns

### Training service

Use:

- `DefaultDiffusionOpdTrainer`
- `DiffusionOpdDiagnosticsPacks.standardTaskDiagnostics(...)`
- `DiffusionOpdReports.load(...)`

This gives you a Java-native training loop plus stable persisted artifacts.

### CLI or terminal inspector

Use:

- `DiffusionOpdReports.select(...)` for compact selectors
- the JBang inspector example for terminal-first workflows

This is the fastest path when you want to inspect one run locally.

### Dashboard or review application

Use:

- `DiffusionOpdReportQueries`
- `DiffusionOpdBundleInspector`

This is the right layer when you need typed status, recommendations,
campaign/release artifacts, and exported bundle health in application code.

---

## Suggested reading order

If you are new to this lane, the most useful order is:

1. [DiffusionOPD in Gollek](/docs/framework/diffusion-opd)
2. this reporting/inspection guide
3. [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)
4. [DiffusionOPD JBang Inspector Workflow](/docs/tutorials/advanced/diffusion-opd-jbang-inspector)
5. [Gollek Framework](/docs/framework/)
6. [Runtime Architecture](/docs/runtime/architecture)

That order takes you from trainer shape, to artifact model, to the larger
framework/runtime context.

---

## Related docs

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [DiffusionOPD in Gollek](/docs/framework/diffusion-opd)
- [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)
- [DiffusionOPD JBang Inspector Workflow](/docs/tutorials/advanced/diffusion-opd-jbang-inspector)
- [DiffusionOPD Selector Reference](/docs/framework/diffusion-opd-selector-reference)
- [DiffusionOPD Reporting Glossary](/docs/framework/diffusion-opd-glossary)
- [Gollek Framework](/docs/framework/)
- [Runtime Architecture](/docs/runtime/architecture)
- [SDK Modules](/docs/sdk-modules)
