---
layout: default
title: Jupyter Integration
parent: Platform Integrations
grand_parent: Tutorials
nav_order: 2
---

# Jupyter: Interactive Gollek Development

The Gollek Jupyter integration is a standalone Java kernel built on JShell. It
preloads the common Gollek ML classes, renders rich notebook outputs, and adds a
small magic-command layer so notebook users can inspect artifacts without
dropping into a terminal.

Use this path when you want a notebook workflow that feels close to Python
Jupyter, but keeps the implementation in Java/Gollek.

## 1. Prerequisites

- Java 25 or the Java version used by your local Gollek checkout.
- Python 3 with Jupyter Notebook or JupyterLab installed.
- A local Gollek repository checkout.

You do not need to install IJava separately. The Gollek kernel ships its own
kernel spec and launcher.

## 2. Build, Doctor, And Install

Run the kernel build from the Gollek repository:

```bash
cd gollek/integration/jupyter/gollek-jupyter-kernel
./rebuild_kernel.sh local-fat
python3 install.py --dry-run --user
python3 doctor.py
python3 install.py --user
```

Then start Jupyter:

```bash
jupyter lab
```

Create a notebook with the `Gollek (Java 25 + AI/ML)` kernel.

## 3. First Notebook Cells

The kernel starts with common imports and helper functions already loaded:

```java
gollekHelp()
```

```java
gollekTensorDemo()
```

```java
gollekPreviewTensorDemo()
```

```java
gollekModelSummary()
```

For a simple model cell:

```java
var model = new Sequential(new Linear(2, 3), new ReLU());
model
```

## 4. Notebook Magics

Discover the available notebook commands from inside the notebook:

```java
%magics
%help %du
%pwd
%tree
%du .
```

Useful day-to-day commands:

| Group | Commands | Use |
|:------|:---------|:----|
| Discovery | `%magics`, `%help <magic>` | Learn the kernel surface from the notebook. |
| Session | `%reset`, `%time <expr>`, `%timeit [-n N] <expr>` | Recover state and benchmark cells. |
| Workspace | `%pwd`, `%cd <PATH>`, `%ls`, `%tree [PATH]`, `%du [PATH]` | Navigate and inspect project folders. |
| Files | `%cat`, `%head`, `%tail`, `%grep`, `%findfile`, `%wc`, `%diff`, `%sha256` | Preview, search, compare, and verify artifacts. |
| Formats | `%json`, `%csv [-n N] [--profile]`, `%tsv [-n N] [--profile]`, `%sample [--tsv] [-n N] [--seed S]`, `%sort [--tsv] [-n N] [--desc]`, `%filter [--tsv] [-n N]`, `%describe [--tsv]`, `%schema [--tsv]`, `%missing [--tsv]`, `%valuecounts [--tsv] [--top N]`, `%groupby [--tsv]`, `%corr [--tsv] [--heatmap]`, `%scatter [--tsv]`, `%lineplot [--tsv]`, `%hist [--tsv] [--bins N]`, `%md`, `%html`, `%yaml`, `%toml`, `%xml`, `%ini`, `%properties`, `%envfile` | Render common data/config formats, random samples, sorted and filtered row previews, numeric summaries, schema inference, missingness checks, categorical counts, grouped summaries, correlation matrices, and quick plots in notebook output. |
| Archives | `%zipls`, `%zipcat`, `%tarls`, `%tarcat`, `%extract` | Inspect and extract selected bundle entries. |
| Dependencies | `%classpath`, `%addjar`, `%maven`, `%deps`, `%whichclass`, `%env` | Inspect and extend the live notebook runtime. |

## 5. Artifact Inspection Example

This workflow is useful for generated reports, model bundles, and downloaded
datasets:

```java
%zipls bundle.zip
%zipcat bundle.zip nested/report.txt
%tarls bundle.tar.gz
%tarcat bundle.tar.gz nested/report.txt
%extract --dry-run bundle.tar.gz nested/report.txt extracted/report.txt
%extract bundle.tar.gz nested/report.txt extracted/report.txt
%sha256 bundle.tar.gz
%du extracted
```

`%extract` writes only one selected archive entry into the notebook working
directory, refuses overwrites, and supports `--dry-run` so the path can be
checked before writing.

## 6. Dataframe-Style Preview Example

Use `-n` to control preview rows and `--profile` to add lightweight column
stats:

```java
%csv -n 20 --profile metrics.csv
%tsv -n 20 --profile features.tsv
%sample -n 5 --seed 42 metrics.csv
%sample --tsv -n 5 features.tsv
%sort -n 10 --desc metrics.csv score
%sort --tsv -n 10 features.tsv latency
%filter -n 10 metrics.csv score >= 0.8
%filter --tsv features.tsv status == ok
%describe metrics.csv
%describe --tsv features.tsv
%schema metrics.csv
%schema --tsv features.tsv
%missing metrics.csv
%missing --tsv features.tsv
%valuecounts metrics.csv label
%valuecounts --tsv --top 10 features.tsv status
%groupby metrics.csv label
%groupby metrics.csv label score mean
%groupby --tsv features.tsv status latency sum
%corr metrics.csv
%corr --tsv features.tsv
%corr --heatmap metrics.csv
%scatter metrics.csv weight height
%scatter --tsv features.tsv step accuracy
%lineplot metrics.csv epoch loss
%lineplot --tsv features.tsv step accuracy
%hist --bins 12 metrics.csv loss
%hist --tsv --bins 12 features.tsv accuracy
```

The preview reports total rows, visible preview rows, column count, truncation,
and optional non-empty, missing, numeric, min, max, and mean stats per column.
`%sample` adds random row sampling for quick spot checks, with `--seed` support
for reproducible notebook output.
`%sort` adds top/bottom row previews by one CSV or TSV column. Numeric columns
sort numerically when possible, and blank values stay at the end.
`%filter` adds quick row subsets by one CSV or TSV column, including equality,
numeric comparisons, text predicates, and `blank`/`notblank` checks.
`%describe` adds pandas-style numeric summaries: count, missing, mean, standard
deviation, min, p25, median, p75, and max.
`%schema` adds dtype-style inference for empty, boolean, integer, decimal,
date, datetime, and text columns, plus examples and missing counts.
`%missing` adds a pandas-style missingness check with missing counts, present
counts, percentages, and an inline SVG bar chart by column.
`%valuecounts` adds pandas-style categorical counts with percentages, an
inline SVG bar chart, and explicit `(blank)` handling for missing values.
`%groupby` adds pandas-style grouped summaries: counts by group, or numeric
`sum`, `mean`, `min`, and `max` over a selected value column.
`%corr` adds a Pearson correlation matrix for numeric columns and computes each
cell pairwise from rows where both columns are numeric. Add `--heatmap` for a
blue-to-red inline SVG heatmap above the matrix table.
`%scatter` turns paired numeric columns into an inline SVG relationship check
and reports rows skipped because either axis was blank or non-numeric.
`%lineplot` turns one numeric Y column into an inline SVG trend chart with the X
column used as point labels.
`%hist` turns one numeric column into an inline SVG distribution view and
reports skipped non-numeric or blank values.

## 7. API Specification

The public notebook surface is documented in the
[gollek-integration-jupyter API reference](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-integration-jupyter).
Use that page as the command contract for helpers, magics, MIME outputs,
dependency loading, and archive/artifact behavior.

---

[Back to Integrations Overview](./)
