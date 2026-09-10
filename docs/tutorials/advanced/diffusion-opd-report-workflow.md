---
layout: default
title: DiffusionOPD Reporting Workflow
parent: Advanced Tutorials
nav_order: 35
---

# DiffusionOPD Reporting Workflow

This tutorial walks through the full Java-side DiffusionOPD reporting lane:

1. train a run and persist artifacts
2. load `diffusion-opd-report.json`
3. inspect typed status and campaign views
4. inspect an exported bundle manifest

The goal is to show how Gollek’s OPD work is meant to be consumed after
training, not just how the trainer is configured.

---

## Prerequisites

You should already be familiar with:

- [DiffusionOPD in Gollek](/docs/framework/diffusion-opd)
- [DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting)

This tutorial assumes you already have:

- a configured DiffusionOPD trainer
- a writable checkpoint directory
- a baseline report and a current report when you want campaign comparisons

### See also

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [DiffusionOPD JBang Inspector Workflow](/docs/tutorials/advanced/diffusion-opd-jbang-inspector)
- [DiffusionOPD Selector Reference](/docs/framework/diffusion-opd-selector-reference)
- [DiffusionOPD Baseline Strategy](/docs/framework/diffusion-opd-baseline-strategy)

---

## Step 1: Persist a normalized report

Start by configuring the trainer with a checkpoint directory so the OPD lane
emits its report artifacts.

```java
var trainer = Gollek.DL.diffusionOpdTrainer()
    .student(studentDenoiser)
    .teacher("ocr-early", ocrEarlyTeacher)
    .teacher("ocr-late", ocrLateTeacher)
    .scheduler(diffusionScheduler)
    .task(ocrTask)
    .checkpointDir(Path.of("artifacts/opd-run"))
    .runtimeObservers(
        DiffusionOpdDiagnosticsPacks.standardTaskDiagnostics(
            List.of(ocrTask),
            "local-fixtures"
        )
    )
    .build();

trainer.fit();
```

After the run completes, you should have:

- `artifacts/opd-run/diffusion-opd-summary.json`
- `artifacts/opd-run/diffusion-opd-history.csv`
- `artifacts/opd-run/diffusion-opd-report.json`

The normalized report is the main artifact we will use below.

---

## Step 2: Load the report

```java
Path reportPath = Path.of("artifacts/opd-run/diffusion-opd-report.json");
DiffusionOpdReport report = DiffusionOpdReports.load(reportPath);
```

At this point you have a typed report model instead of an unstructured map.
That gives you access to both:

- compact selector-style reads through `DiffusionOpdReports.select(...)`
- richer typed analysis through `DiffusionOpdReportQueries`

For example:

```java
Object latestOcrLoss = DiffusionOpdReports.select(
    report,
    "roundHistory:task=ocr:lastLoss"
);
```

That is handy in scripts, but the typed queries are usually the better choice
 for applications.

---

## Step 3: Inspect round-history status

A small first step is to compute one task-facing status and recommendation
view.

```java
var ocrStatus = DiffusionOpdReportQueries.taskStatus(report, "ocr", 5);
var ocrRecommendation = DiffusionOpdReportQueries.taskRecommendation(report, "ocr", 5);
var ocrPlaybook = DiffusionOpdReportQueries.taskPlaybook(report, "ocr", 5);
```

This is the layer to use when you need:

- one task’s current health
- trend/stability judgments over a trailing window
- an action-oriented recommendation

If you want ranked rollups instead of one filtered slice, move up to the
portfolio helpers:

```java
var taskPortfolio = DiffusionOpdReportQueries.taskPortfolio(report, 5);
var taskSummaries = DiffusionOpdReportQueries.taskSummaries(report);
```

---

## Step 4: Compare a baseline and a regressed run

The campaign/workflow lane is built from two reports:

- `baselineReport`
- `currentReport`

```java
DiffusionOpdReport baselineReport =
    DiffusionOpdReports.load(Path.of("artifacts/opd-baseline/diffusion-opd-report.json"));

DiffusionOpdReport currentReport =
    DiffusionOpdReports.load(Path.of("artifacts/opd-run/diffusion-opd-report.json"));
```

Once you have both, you can compute higher-level operator artifacts.

### Baseline-vs-current starter

If you want the shortest useful two-report path, start with:

```java
var approval = DiffusionOpdReportQueries.taskCampaignApprovalPacket(
    baselineReport,
    currentReport,
    1,
    2,
    3,
    5
);

var releaseDecision = DiffusionOpdReportQueries.taskCampaignReleaseDecision(
    baselineReport,
    currentReport,
    1,
    2,
    3,
    5
);

var exportReport = DiffusionOpdReportQueries.taskCampaignReleaseDeliveryExportReport(
    baselineReport,
    currentReport,
    1,
    2,
    3,
    5
);
```

That sequence gives you, in order:

- whether the change should be gated
- what the release-side decision looks like
- what the downstream delivery/export posture looks like

If those three views are enough for your use case, you can stop there before
moving into the fuller campaign/release chain below.

If you have not settled how `artifacts/opd-baseline/` should be created and
promoted, read [DiffusionOPD Baseline Strategy](/docs/framework/diffusion-opd-baseline-strategy)
before relying on these comparisons operationally.

### Approval and incident views

```java
var approval = DiffusionOpdReportQueries.taskCampaignApprovalPacket(
    baselineReport,
    currentReport,
    1,
    2,
    3,
    5
);

var incident = DiffusionOpdReportQueries.taskCampaignIncidentReport(
    baselineReport,
    currentReport,
    1,
    2,
    3,
    5
);
```

Use this band when you need to answer:

- should this rollout be gated?
- what operator action is recommended?
- which campaign batches are blocked?

### Release and delivery views

```java
var releaseDecision = DiffusionOpdReportQueries.taskCampaignReleaseDecision(
    baselineReport,
    currentReport,
    1,
    2,
    3,
    5
);

var exportReport = DiffusionOpdReportQueries.taskCampaignReleaseDeliveryExportReport(
    baselineReport,
    currentReport,
    1,
    2,
    3,
    5
);
```

Use the `...Export...` delivery APIs for new integrations. They are the
canonical downstream release-delivery lane.

---

## Step 5: Export a bundle and inspect its manifest

Once report slices or summary views are exported into a bundle directory, the
manifest becomes its own typed inspection boundary.

```java
Path manifestPath = Path.of("artifacts/opd-bundle/manifest.json");
DiffusionOpdBundleManifest manifest = DiffusionOpdBundleManifests.load(manifestPath);
```

Now inspect the bundle itself:

```java
var summary = DiffusionOpdBundleInspector.summary(manifest);
var health = DiffusionOpdBundleInspector.health(manifest);
var files = DiffusionOpdBundleInspector.files(manifest);
```

This is useful when you need to confirm:

- whether the export pack is complete
- which sections and formats were generated
- whether any advertised bundle files are missing on disk

You can also load one generated file through the same API:

```java
var loaded = DiffusionOpdBundleInspector.loadFile(
    manifest,
    "loadfile:format=csv:section=taskTeacherSummaries"
);
```

---

## Step 6: Decide which layer to build against

A good rule of thumb is:

- use `DiffusionOpdReports.select(...)` for scripts and quick terminal checks
- use `DiffusionOpdReportQueries` for application logic, dashboards, campaign
  planning, and release/delivery workflows
- use `DiffusionOpdBundleInspector` when the output boundary is already a
  generated bundle directory plus `manifest.json`

That keeps each integration at the right abstraction level instead of pushing
everything through one generic selector surface.

---

## Suggested next steps

After this tutorial, the most useful follow-ups are:

1. add project-specific policy thresholds around the typed status and
   recommendation APIs
2. build a small internal review dashboard from the campaign/release query
   surfaces
3. add bundle-health checks to CI if exported report packs are part of your
   release process

---

## Related docs

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [DiffusionOPD in Gollek](/docs/framework/diffusion-opd)
- [DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting)
- [DiffusionOPD JBang Inspector Workflow](/docs/tutorials/advanced/diffusion-opd-jbang-inspector)
- [DiffusionOPD Selector Reference](/docs/framework/diffusion-opd-selector-reference)
- [DiffusionOPD Baseline Strategy](/docs/framework/diffusion-opd-baseline-strategy)
- [Gollek Framework](/docs/framework/)
