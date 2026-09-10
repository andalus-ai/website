---
layout: default
title: DiffusionOPD Baseline Strategy
---

# DiffusionOPD Baseline Strategy

Two-report DiffusionOPD analysis only works well when the baseline is
deliberate and stable.

This page explains the practical baseline strategy for Gollek’s OPD reporting
lane:

- how to create a baseline run
- where to store it
- when to refresh it
- how to use it in campaign, release, and delivery queries

---

## What is a baseline?

A baseline is the `DiffusionOpdReport` you treat as the expected or accepted
reference point for later comparisons.

In practice, that usually means a report from:

- a previously accepted training configuration
- a last-known-good checkpoint line
- a release candidate that passed review
- a model/task setup whose diagnostics are considered healthy

The baseline is not just “an older run.” It is the run you want future runs to
be judged against.

---

## Minimal baseline directory layout

A simple and durable convention is:

```text
artifacts/
  opd-baseline/
    diffusion-opd-summary.json
    diffusion-opd-history.csv
    diffusion-opd-report.json
  opd-run/
    diffusion-opd-summary.json
    diffusion-opd-history.csv
    diffusion-opd-report.json
```

That makes the comparison path obvious in both code and terminal workflows.

---

## How to create the first baseline

1. Run one training session that you consider healthy or acceptable.
2. Keep its emitted artifacts in a dedicated baseline directory.
3. Do not overwrite that directory on every new run.

In Java terms, the baseline is just a persisted report you keep stable:

```java
DiffusionOpdReport baselineReport =
    DiffusionOpdReports.load(Path.of("artifacts/opd-baseline/diffusion-opd-report.json"));
```

The important part is not the loading call. It is the discipline around which
run earns the right to live in `opd-baseline/`.

---

## When to refresh the baseline

Refresh the baseline only when the newer run is intentionally accepted as the
new reference.

Good reasons to refresh:

- a model or routing change is explicitly approved
- a trainer configuration change becomes the new standard
- an intentional quality improvement should stop looking like a regression

Bad reasons to refresh:

- every run completed successfully
- one noisy metric moved a little
- you want a failing comparison to disappear

If you refresh too often, the campaign and release lanes lose most of their
value because there is no stable point of comparison left.

---

## Suggested comparison cadence

Use a simple rule:

- compare every candidate run against the current baseline
- review campaign/release/export views
- promote the candidate to the new baseline only after acceptance

That keeps the OPD reporting lane aligned with an approval workflow instead of
turning it into a stream of ad hoc pairwise comparisons.

---

## Minimal Java comparison path

Once you have both reports, the shortest useful path is:

```java
DiffusionOpdReport baselineReport =
    DiffusionOpdReports.load(Path.of("artifacts/opd-baseline/diffusion-opd-report.json"));

DiffusionOpdReport currentReport =
    DiffusionOpdReports.load(Path.of("artifacts/opd-run/diffusion-opd-report.json"));

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

That gives you:

- whether the current run should be gated
- the release-side decision posture
- the downstream delivery/export posture

---

## What to review before promoting a new baseline

At minimum, review:

- task or teacher summaries for worst-loss slices
- the approval packet
- the release decision
- the export-delivery report

That helps ensure the new baseline reflects an intentional acceptance decision,
not just the most recent run on disk.

---

## Recommended naming and storage rules

For local iteration, keep a stable directory name like:

- `artifacts/opd-baseline/`

For team workflows, add metadata outside the report file itself, such as:

- date promoted
- training configuration label
- model/checkpoint identifier
- reviewer or acceptance note

You do not need to encode all of that into the report path. A small adjacent
README or metadata file is usually enough.

---

## Common mistakes

### Reusing the same directory for baseline and current

If both paths point to the same report, the comparison lane becomes meaningless.

### Promoting every successful run

This removes the idea of an accepted reference and weakens campaign/release
signals.

### Comparing against a stale but unknown baseline

If nobody remembers why the baseline was chosen, the comparison output becomes
harder to interpret. Keep a short note about why it was promoted.

---

## Related docs

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)
- [DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting)
