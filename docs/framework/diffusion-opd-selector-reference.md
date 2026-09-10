---
layout: default
title: DiffusionOPD Selector Reference
---

# DiffusionOPD Selector Reference

This page is the quick lookup companion for the DiffusionOPD report inspector.

Use it when you already know the workflow and just need to remember:

- which selector family to use
- which output formats and projection presets are supported
- how bundle export syntax works
- how bundle summary and health filters are shaped

For guided walkthroughs, see:

- [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)
- [DiffusionOPD JBang Inspector Workflow](/docs/tutorials/advanced/diffusion-opd-jbang-inspector)
- [DiffusionOPD Reporting Glossary](/docs/framework/diffusion-opd-glossary)

---

## Base command shape

From `gollek/examples/jbang`:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java <report-or-bundle-path> [section] [format] [projection] [output-path]
```

The same entrypoint can read:

- a `diffusion-opd-report.json`
- a materialized bundle directory
- a bundle `manifest.json`

Common formats:

- `text`
- `json`
- `table`
- `csv`

If you provide an output path, the inspector can also infer format from file
extensions such as `.json`, `.csv`, `.table`, `.md`, `.txt`, or `.log`.

---

## Quick cheat sheet

The commands below cover the most common day-to-day inspector tasks:

```bash
# open the overview
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json overview

# inspect one task's latest row
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json roundHistory:task=ocr:last json

# inspect one task's mean loss
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json roundHistory:task=ocr:meanLoss

# rank the worst task summaries
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json taskSummaries:sort=-meanLoss:top=5 table

# export a standard bundle
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json bundle=standard json /tmp/opd-standard-bundle

# run a compact CI-style health check on that bundle
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle bundleHealth:ci

# load one generated artifact back from the bundle
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle loadfile:overview.json
```

Use the rest of this page as the detailed grammar for variations on those
patterns.

---

## Top-level report sections

Use these when the input is a normalized report:

| Selector | Meaning |
|----------|---------|
| `all` | Full report payload |
| `overview` | Compact report overview |
| `run` | Run metadata section |
| `artifacts` | Artifact metadata section |
| `teachers` | Teacher diagnostics section |
| `stages` | Stage diagnostics section |
| `tasks` | Task diagnostics section |
| `conditioning` | Conditioning diagnostics section |
| `adaptive` | Adaptive-weighting section |
| `bindings` | Teacher-binding section |
| `roundHistory` | Full round-history list |
| `roundHistoryCount` | Count of round-history rows |

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json overview
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json conditioning json
```

---

## Round-history selectors

### Direct slices

| Selector | Meaning |
|----------|---------|
| `roundHistory:last` | Latest row |
| `roundHistory:3` | Row by positional index |
| `roundHistory:task=ocr` | All rows for one task |
| `roundHistory:teacher=ocr-early` | All rows for one teacher |
| `roundHistory:stage=early` | All rows for one stage |
| `roundHistory:round=2` | All rows for one round number |

### Chained selectors

| Selector | Meaning |
|----------|---------|
| `roundHistory:task=ocr:last` | Latest row for a task |
| `roundHistory:teacher=ocr-early:last` | Latest row for a teacher |
| `roundHistory:task=ocr:meanLoss` | Mean loss for a filtered slice |
| `roundHistory:teacher=ocr-early:lastLoss` | Last loss scalar for a filtered slice |
| `roundHistory:task=ocr:summary` | Compact summary object for a filtered slice |

### Ranked selectors

| Selector | Meaning |
|----------|---------|
| `roundHistory:task=ocr:sort=-averageLoss:top=3` | Top three worst-loss rows |
| `roundHistory:teacher=ocr-early:sort=round:top=5` | Earliest or lowest-round few rows |

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json roundHistory:task=ocr:last json
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json roundHistory:task=ocr:meanLoss
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json roundHistory:task=ocr:sort=-averageLoss:top=3 json
```

---

## Summary selectors

### Single-dimension summary presets

| Selector | Meaning |
|----------|---------|
| `taskSummary=ocr` | One task summary |
| `teacherSummary=ocr-early` | One teacher summary |
| `stageSummary=early` | One stage summary |

### Grouped rollups

| Selector | Meaning |
|----------|---------|
| `taskSummaries` | Grouped task summaries |
| `teacherSummaries` | Grouped teacher summaries |
| `stageSummaries` | Grouped stage summaries |

### Paired summaries

| Selector | Meaning |
|----------|---------|
| `taskTeacherSummary=ocr,ocr-early` | One task/teacher paired summary |
| `taskStageSummary=ocr,early` | One task/stage paired summary |
| `teacherStageSummary=ocr-early,early` | One teacher/stage paired summary |
| `taskTeacherSummaries` | Grouped task/teacher rollups |
| `taskStageSummaries` | Grouped task/stage rollups |
| `teacherStageSummaries` | Grouped teacher/stage rollups |

### Ranked summary views

| Selector | Meaning |
|----------|---------|
| `taskSummaries:sort=-meanLoss:top=5` | Worst-loss task summaries |
| `teacherSummaries:sort=-count:top=3` | Most-active teacher summaries |
| `taskTeacherSummaries:sort=-meanLoss:top=10` | Worst paired task/teacher slices |

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json taskSummaries:sort=-meanLoss:top=5 table
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json taskTeacherSummaries:sort=-meanLoss:top=10 csv
```

---

## Projection and column options

Projection is mainly useful for `table` and `csv`.

### Explicit columns

Examples:

- `value,count,meanLoss`
- `pair,count,meanLoss`
- `value,count,loss,latestRound,latestLoss`

### Friendly aliases

Available aliases include:

- `loss`
- `latestRound`
- `latestLoss`
- `latestTeacher`
- `latestTask`
- `latestStage`
- `top1Round`
- `top1Loss`
- `first1Round`
- `first1Loss`

### Presets

Supported presets:

- `minimal`
- `compact`
- `latest`
- `leaderboard`
- `details`
- `compare`

Notes:

- grouped single-dimension rollups usually center on `value`
- paired rollups usually center on `pair`
- `compact` is the default grouped rollup projection for table/csv bundle
  exports
- `compare` is the default pair-rollup projection for table/csv bundle exports

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json taskSummaries:sort=-meanLoss:top=5 table compact
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json taskTeacherSummaries:sort=-meanLoss:top=10 csv compare
```

---

## Direct file export

You can write one rendered selector result straight to disk:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  report.json \
  taskSummaries:sort=-meanLoss:top=5 \
  csv \
  compact \
  /tmp/opd-task-summaries.csv
```

If you want to skip explicit format, use a filename with a recognized
extension:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java \
  report.json \
  taskSummary=ocr \
  /tmp/opd-task-summary-ocr.json
```

---

## Bundle export selectors

### Built-in bundle modes

| Selector | Meaning |
|----------|---------|
| `bundle=standard` | Standard mixed report pack |
| `bundle=rollups` | Rollup-oriented export pack |

### Custom bundles

Use:

```text
bundle=custom:<entry>,<entry>,...
```

Each entry supports:

- section name
- optional alias with `@alias`
- optional projection with `#projection`
- optional per-entry format with `!json|csv|table|text`

Examples:

| Selector | Meaning |
|----------|---------|
| `bundle=custom:overview,taskSummaries,taskTeacherSummaries` | Basic custom pack |
| `bundle=custom:overview@run-overview,taskTeacherSummaries@teacher-pairs` | Aliased entries |
| `bundle=custom:taskSummaries@tasks#compact,taskTeacherSummaries@pairs#compare` | Entry-specific projections |
| `bundle=custom:overview@run-overview!json,taskTeacherSummaries@teacher-pairs#compare!csv` | Mixed per-entry formats |

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json bundle=standard json /tmp/opd-standard-bundle
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json bundle=rollups csv /tmp/opd-rollups-bundle
jbang trainer/trainer_diffusion_opd_report_inspector.java report.json bundle=custom:overview,taskSummaries,taskTeacherSummaries csv /tmp/opd-custom-bundle
```

---

## Bundle directory selectors

Once a bundle exists, point the inspector at the bundle directory or its
`manifest.json`.

### Basic bundle views

| Selector | Meaning |
|----------|---------|
| `manifest` | Raw bundle manifest |
| `bundleSummary` | Human-facing bundle overview |
| `bundleHealth` | Integrity and validation status |
| `files` | Generated file list |
| `file:<name>` | One manifest-advertised file entry |

### File list filters

| Selector | Meaning |
|----------|---------|
| `files:format=csv` | Only CSV files |
| `files:section=taskTeacherSummaries` | Only one section |
| `files:section=taskTeacherSummaries:sort=name` | Same, ordered |

### Grouped file summaries

| Selector | Meaning |
|----------|---------|
| `filesSummary:by=section` | Counts grouped by section |
| `filesSummary:by=format:sort=-count` | Counts grouped by format, descending |
| `filesSummary:by=section:sort=-count:top=3` | Top section counts |

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle bundleSummary json
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle files:section=taskTeacherSummaries json
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle filesSummary:by=section json
```

---

## Bundle summary options

`bundleSummary` supports a few compact rollup options:

| Selector | Meaning |
|----------|---------|
| `bundleSummary:top=3` | Trim embedded rollups |
| `bundleSummary:focus=sections:top=3` | Emphasize section counts |
| `bundleSummary:focus=formats` | Emphasize format counts |
| `bundleSummary:dominant=true` | Headline-only output |

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle bundleSummary:top=3 json
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle bundleSummary:focus=sections:top=3 json
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle bundleSummary:dominant=true json
```

---

## Bundle health options

### One-line CI form

| Selector | Meaning |
|----------|---------|
| `bundleHealth:ci` | Compact machine-friendly health summary |

### Focus modes

| Selector | Meaning |
|----------|---------|
| `bundleHealth:focus=files` | File-level failures |
| `bundleHealth:focus=sections` | Section-level grouped failures |
| `bundleHealth:focus=formats` | Format-level grouped failures |
| `bundleHealth:focus=all` | Full health view |

### Common combinations

| Selector | Meaning |
|----------|---------|
| `bundleHealth:focus=files:top=5` | Top few problematic files |
| `bundleHealth:focus=files:section=runs:sort=status json` | Section-filtered file health |
| `bundleHealth:focus=files:status=missing:top=3 json` | Missing files only |
| `bundleHealth:focus=sections:format=json json` | Section health filtered by format |
| `bundleHealth:focus=formats:section=runs json` | Format health filtered by section |
| `bundleHealth:focus=sections:sort=-missingCount json` | Worst sections first |

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle bundleHealth json
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle bundleHealth:ci
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle bundleHealth:focus=files:top=5 json
```

---

## Loading generated bundle files

Use `loadfile:` when you want the actual generated content rather than just
manifest metadata.

### Exact-name load

| Selector | Meaning |
|----------|---------|
| `loadfile:overview.json` | Load one named file |

### Filtered load

| Selector | Meaning |
|----------|---------|
| `loadfile:format=csv:section=taskTeacherSummaries` | Match by section and format |
| `loadfile:format=csv:section=taskTeacherSummaries:pick=last` | Pick last among matches |
| `loadfile:format=csv:section=taskTeacherSummaries:sort=-name:pick=first` | Sorted pick |
| `loadfile:format=csv:index=1` | Positional selection |

Examples:

```bash
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle loadfile:overview.json
jbang trainer/trainer_diffusion_opd_report_inspector.java /tmp/opd-standard-bundle loadfile:format=csv:section=taskTeacherSummaries
```

---

## Suggested quick paths

### Fast report diagnosis

1. `overview`
2. `roundHistory:task=ocr:meanLoss`
3. `taskSummaries:sort=-meanLoss:top=5 table`

### Fast export pack

1. `bundle=standard json /tmp/opd-standard-bundle`
2. `bundleHealth:ci`
3. `filesSummary:by=section json`
4. `loadfile:overview.json`

### Spreadsheet-focused export

1. `taskTeacherSummaries:sort=-meanLoss:top=10 csv compare /tmp/opd-task-teacher-compare.csv`
2. `bundle=rollups csv /tmp/opd-rollups-bundle`

---

## Related docs

- [DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting)
- [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)
- [DiffusionOPD JBang Inspector Workflow](/docs/tutorials/advanced/diffusion-opd-jbang-inspector)
- [DiffusionOPD Reporting Glossary](/docs/framework/diffusion-opd-glossary)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
