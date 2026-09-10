---
layout: default
title: DiffusionOPD Reporting Glossary
---

# DiffusionOPD Reporting Glossary

This page defines the core terms used across Gollek’s DiffusionOPD reporting,
query, and inspection docs.

Use it when you understand the general workflow but want a quick vocabulary
reference for the artifact and selector language.

---

## Terms

### adaptive section

The normalized report section that records adaptive stage-weighting behavior,
including the trainer’s stage-factor updates and related weighting metadata.

### baseline report

The earlier or expected `DiffusionOpdReport` used as the comparison anchor for
campaign, release, and delivery queries.

### bundle

A directory of generated inspection artifacts exported from one report through
the inspector. A bundle usually contains multiple rendered files plus a
`manifest.json`.

### bundle health

A compact integrity view over a bundle that answers whether the bundle is
complete, which files are missing, and how severe the missing or failing checks
are.

### bundle manifest

The `manifest.json` file written into a bundle directory. It describes the
bundle type, source report path, output format, creation time, and the files
advertised by the bundle.

### campaign lane

The higher-level orchestration layer that converts baseline-versus-current
report differences into approval, incident, resolution, closure, release, and
delivery artifacts.

### canonical export lane

The newer release-delivery path built around the `...Export...` public APIs.
This is the preferred downstream path for new integrations.

### compatibility lane

The older release-delivery public shape that is still available for callers who
need aggregate delivery records instead of the canonical export-delivery model.

### conditioning section

The normalized report section that captures conditioning-lane diagnostics such
as task-specific text-conditioning usage and loss aggregates.

### current report

The newer or observed `DiffusionOpdReport` being analyzed against a baseline.

### export lane

Shorthand for the canonical release-delivery export lane. It produces explicit
export-oriented report, ledger, receipt, acknowledgement, decision, resolution,
closure, and handoff views.

### generated file

One output artifact inside a bundle, such as a JSON, CSV, table, or text file
advertised by the bundle manifest.

### grouped summary

A rollup keyed by one dimension, such as task, teacher, or stage. Examples
include `taskSummaries`, `teacherSummaries`, and `stageSummaries`.

### handoff bundle

A terminal bundle-shaped artifact that groups the final artifacts in a release
or delivery lane so downstream systems can consume one packaged view rather
than reconstructing the chain themselves.

### inspector

The report/bundle inspection surface exposed through the DiffusionOPD JBang
wrapper and the underlying Java support APIs.

### latest row

The most recent round-history row after a selector filter has been applied.

### manifest

Context decides the meaning:

- for report bundles, it usually means `manifest.json` inside a bundle
- for campaign or release flows, it can also mean an export-style manifest
  record family representing a flattened downstream package

### paired summary

A rollup keyed by two dimensions, such as task/teacher, task/stage, or
teacher/stage. Examples include `taskTeacherSummaries`,
`taskStageSummaries`, and `teacherStageSummaries`.

### projection

The column or preset selection applied to `table` or `csv` output. Examples
include explicit columns like `value,count,meanLoss` and presets like
`compact` or `compare`.

### query surface

The typed Java analysis APIs exposed by `DiffusionOpdReportQueries`.

### report

Usually means the normalized `diffusion-opd-report.json` artifact or its typed
Java representation, `DiffusionOpdReport`.

### round-history row

One normalized training-history row representing one observed slice of OPD
behavior, including round index, task, teacher, stage, and loss values.

### selector

A compact string expression used by the JBang inspector to choose one report
section, one filtered history slice, one summary rollup, or one bundle view.

### selector reference

The quick-lookup document for selector syntax, bundle grammar, projections, and
bundle health filters.

### stage-aware routing

The ability to route one task’s OPD supervision through different teachers or
teacher bindings depending on denoising stage or timestep interval.

### summary preset

A shorthand selector like `taskSummary=ocr` or `teacherSummary=ocr-early` that
returns one compact pre-aggregated summary for a specific slice.

### top-level section

One first-class section inside the normalized report, such as `run`,
`artifacts`, `teachers`, `conditioning`, `adaptive`, or `roundHistory`.

### typed report

The Java record-based representation of `diffusion-opd-report.json`, loaded
through `DiffusionOpdReports`.

### workflow lane

The layer that turns report-derived analysis into operator-facing planning
artifacts such as workflow action packets, execution plans, dispatch envelopes,
and campaign approval/incident artifacts.

---

## Suggested companions

After this glossary, the most useful follow-ups are:

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting)
- [DiffusionOPD Selector Reference](/docs/framework/diffusion-opd-selector-reference)
