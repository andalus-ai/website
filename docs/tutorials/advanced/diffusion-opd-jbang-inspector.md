---
layout: default
title: DiffusionOPD JBang Inspector Workflow
parent: Advanced Tutorials
nav_order: 36
---

# DiffusionOPD JBang Inspector Workflow

This tutorial shows the terminal-first path for DiffusionOPD report analysis.

Instead of writing Java application code, you will:

1. open a persisted `diffusion-opd-report.json`
2. inspect focused history and summary selectors
3. export a reusable bundle directory
4. validate the bundle with manifest health checks
5. load individual generated bundle files back from the terminal

This is the fastest workflow when you want support-style inspection, CI
checks, or spreadsheet-oriented exports.

---

## Prerequisites

You should already have:

- JBang installed
- a DiffusionOPD run that wrote `diffusion-opd-report.json`

Recommended local layout:

```text
artifacts/
  opd-baseline/
    diffusion-opd-report.json
  opd-run/
    diffusion-opd-report.json
```

That keeps the terminal inspection flow aligned with the Java-side
baseline-versus-current comparison docs.

If you need the Java-side application path instead, see:

- [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)

### See also

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting)
- [DiffusionOPD Selector Reference](/docs/framework/diffusion-opd-selector-reference)
- [DiffusionOPD Baseline Strategy](/docs/framework/diffusion-opd-baseline-strategy)

---

## Step 1: Move to the JBang examples directory

From the repository root:

```bash
cd gollek/examples/jbang
```

The terminal wrapper we use is:

```bash
trainer/trainer_diffusion_opd_report_inspector.java
```

That script delegates to the shared DiffusionOPD inspector support surface in
the OPD module.

---

## Step 2: Open a report directly

Point the inspector at your normalized report:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json
```

A few useful first reads are:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json overview

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json conditioning

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json roundHistory:last json
```

Use this layer when you want a quick sanity check before moving into exports
or deeper analysis.

---

## Step 3: Query focused slices

The inspector supports compact selectors over round history.

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json roundHistory:task=ocr json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json roundHistory:task=ocr:last json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json roundHistory:task=ocr:meanLoss

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json roundHistory:task=ocr:sort=-averageLoss:top=3 json
```

This is ideal when you need:

- one task’s trailing loss behavior
- the latest matching row
- a quick scalar like mean loss
- the worst-loss few rows from a filtered slice

---

## Step 4: Use grouped and paired summary views

For ranked rollups, move to the summary selectors:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json taskSummaries json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json taskSummaries:sort=-meanLoss:top=5 table

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json taskTeacherSummaries:sort=-meanLoss:top=10 csv
```

You can also choose explicit column sets or presets:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json \
  taskSummaries:sort=-meanLoss:top=5 table compact

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json \
  taskTeacherSummaries:sort=-meanLoss:top=10 csv compare
```

This is the right layer for:

- leaderboard views
- spreadsheet exports
- compact review tables

---

## Step 5: Write one output file directly

The inspector can also write a selected view directly to disk:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json \
  taskSummaries:sort=-meanLoss:top=5 \
  csv \
  compact \
  /tmp/opd-task-summaries.csv
```

That is helpful when a human reviewer wants one CSV or markdown/table artifact
without building a full bundle directory.

---

## Step 6: Export a standard bundle

When you want several coordinated artifacts together, use bundle export:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json \
  bundle=standard \
  json \
  /tmp/opd-standard-bundle
```

Other useful variants include:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json \
  bundle=rollups \
  csv \
  /tmp/opd-rollups-bundle

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json \
  bundle=custom:overview,taskSummaries,taskTeacherSummaries \
  csv \
  /tmp/opd-custom-bundle
```

Each bundle writes a `manifest.json` plus generated section files into the
target directory.

---

## Step 7: Inspect bundle health

Once a bundle exists, point the inspector at the bundle directory itself:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle
```

The most useful validation commands are:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle bundleSummary json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle bundleHealth json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle bundleHealth:focus=files:top=5 json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle bundleHealth:focus=sections json
```

For CI-friendly one-line checks:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle bundleHealth:ci
```

Use this when you need to confirm that:

- the bundle directory exists
- the manifest matches the files on disk
- no expected generated artifact is missing

---

## Step 8: List or load bundle files

To inspect what the bundle advertised:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle files json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle files:section=taskTeacherSummaries json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle filesSummary:by=section json
```

To load one generated artifact:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle loadfile:overview.json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle loadfile:format=csv:section=taskTeacherSummaries

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle loadfile:format=csv:section=taskTeacherSummaries:pick=last
```

This is the terminal equivalent of the typed bundle inspection APIs.

---

## Suggested workflow

For most support and analysis tasks, the sequence below works well:

1. `overview`
2. `roundHistory:task=...:meanLoss`
3. `taskSummaries:sort=-meanLoss:top=5 table`
4. `bundle=standard json /tmp/...`
5. `bundleHealth:ci`
6. `loadfile:format=csv:section=taskTeacherSummaries`

That gives you:

- a quick report sanity check
- one focused scalar
- one ranked review table
- a reusable export pack
- a machine-friendly integrity check
- one concrete artifact payload

If you are operating with both a stable baseline and a new run, keep the same
directory convention on the terminal side:

- `artifacts/opd-baseline/diffusion-opd-report.json`
- `artifacts/opd-run/diffusion-opd-report.json`

Then inspect each report independently from the terminal, while using the
Java-side comparison workflow for campaign, release, and delivery analysis.
For the baseline promotion rules themselves, see
[DiffusionOPD Baseline Strategy](/docs/framework/diffusion-opd-baseline-strategy).

---

## Common mistakes and fixes

### I passed a bundle directory when I meant to inspect a report

Symptoms:

- selectors like `overview` or `roundHistory:task=...` do not return the shape
  you expected

Fix:

- use the report file path when you want report sections and round-history
  selectors
- use the bundle directory only after you have already exported a bundle

Good examples:

```bash
# report-oriented
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /path/to/diffusion-opd-report.json overview

# bundle-oriented
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle bundleHealth json
```

### I forgot `json` and got text when I wanted structured output

Symptoms:

- the output is human-friendly text, but you wanted machine-readable JSON

Fix:

- add `json` explicitly whenever you want a structured object or array
- or write to an output file ending in `.json`

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  report.json taskSummaries json

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  report.json taskSummary=ocr /tmp/opd-task-summary-ocr.json
```

### `loadfile:` matched more than one generated file

Symptoms:

- the selector is not specific enough for the bundle contents

Fix:

- narrow the match with `section=...` or `format=...`
- add `pick=first|last` when any one matching file is acceptable
- add `index=<n>` when you want a stable positional choice
- add `sort=...` before `pick=...` if you want deterministic ordering

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle loadfile:format=csv:section=taskTeacherSummaries

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle loadfile:format=csv:section=taskTeacherSummaries:pick=last

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle loadfile:format=csv:section=taskTeacherSummaries:sort=-name:pick=first
```

### I expected CSV or table columns but used `json`

Symptoms:

- projection presets like `compact` or `compare` appear to have no effect

Fix:

- use `table` or `csv` when you want projection presets or explicit columns
- keep `json` for structured raw output instead of column-shaped output

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  report.json taskSummaries:sort=-meanLoss:top=5 table compact

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  report.json taskTeacherSummaries:sort=-meanLoss:top=10 csv compare
```

### I exported a bundle but forgot to validate it

Symptoms:

- the bundle exists, but you do not know whether every advertised file is
  really present

Fix:

- run `bundleHealth:ci` immediately after bundle export for a compact integrity
  check
- use `bundleHealth json` when you need the full structured diagnosis

Example:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  report.json bundle=standard json /tmp/opd-standard-bundle

jbang trainer/trainer_diffusion_opd_report_inspector.java \
  /tmp/opd-standard-bundle bundleHealth:ci
```

---

## When to use this vs Java APIs

Prefer the JBang inspector when:

- you want fast terminal inspection
- you are debugging a persisted run
- you need a quick export for a reviewer
- you want a lightweight CI health check for bundles

Prefer the Java APIs when:

- you are building a long-lived application integration
- you want typed campaign/release/delivery objects in code
- you need to compose report analysis directly into business logic

---

## Related docs

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)
- [DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting)
- [DiffusionOPD Selector Reference](/docs/framework/diffusion-opd-selector-reference)
- [DiffusionOPD Baseline Strategy](/docs/framework/diffusion-opd-baseline-strategy)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
