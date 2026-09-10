---
layout: default
title: gollek-integration-jupyter
parent: API REferences
nav_order: 340
---

# gollek-integration-jupyter

The `gollek-integration-jupyter` module provides the standalone Gollek Java
kernel for Jupyter Notebook and JupyterLab. It wraps a JShell-backed runtime,
preloads common Gollek classes, renders rich MIME outputs, and exposes notebook
magics for workspace, dependency, and artifact inspection.

## Module Location

```text
gollek/integration/jupyter/gollek-jupyter-kernel
```

## Install Surface

| Command | Description |
|:--------|:------------|
| `./rebuild_kernel.sh local-fat` | Builds the runnable local kernel artifact. |
| `python3 install.py --dry-run --user` | Prints the user-level kernel install plan. |
| `python3 doctor.py` | Checks kernel spec, Java, Jupyter, and launcher readiness. |
| `python3 install.py --user` | Installs the kernel spec for the current user. |

## Preloaded Runtime

The kernel preloads common imports and helpers so the first notebook cell can
start with Gollek objects immediately.

| Surface | Contract |
|:--------|:---------|
| `GradTensor` | Autograd tensor class for quick tensor demos. |
| `Linear`, `ReLU`, `Sequential` | Common neural-network layers for first model cells. |
| `gollekHelp()` | Lists built-in helper functions. |
| `gollekTensorDemo()` | Returns a simple tensor. |
| `gollekPreviewTensorDemo()` | Returns a small tensor suitable for rich preview checks. |
| `gollekMetricsDemo()` | Returns tabular metrics rows. |
| `gollekLossCurveDemo()` | Returns a notebook-renderable line chart. |
| `gollekImageDemo()` | Returns a small image object for MIME rendering checks. |
| `gollekAudioDemo()` | Returns a WAV audio clip wrapper. |
| `gollekModelDemo()` | Returns a small model object. |
| `gollekModelSummary()` | Returns a readable model summary. |

## Magic API

| Magic | Contract |
|:------|:---------|
| `%magics` | Lists available magic commands and short usage hints. |
| `%help <magic>` | Shows focused help for one magic. |
| `%reset` | Clears JShell state, dynamic dependencies, and reloads default helpers. |
| `%time <expr>` | Runs one Java expression or cell and reports elapsed milliseconds. |
| `%timeit [-n N] <expr>` | Runs the expression multiple times and reports run, average, min, and max timings. |
| `%classpath` | Shows the active classpath. |
| `%pwd` | Shows the notebook working directory. |
| `%cd <PATH>` | Changes the notebook working directory. |
| `%ls` | Lists entries in the current notebook working directory. |
| `%tree [PATH]` | Shows a shallow directory tree. |
| `%du [PATH]` | Summarizes file count, directory count, total bytes, human size, and scan count. |
| `%cat <PATH>` | Previews a UTF-8 text file with truncation. |
| `%head [-n N] <PATH>` | Shows the first lines of a text file. |
| `%tail [-n N] <PATH>` | Shows the last lines of a text file. |
| `%grep <TEXT> [PATH]` | Searches plain text in one file or a shallow directory tree. |
| `%findfile <TEXT> [PATH]` | Searches file and directory names. |
| `%wc <PATH>` | Shows line, word, character, and byte counts. |
| `%diff <LEFT_PATH> <RIGHT_PATH>` | Shows a lightweight line diff. |
| `%sha256 <PATH>` | Computes a SHA-256 digest for one file. |

## Format Preview API

| Magic | Contract |
|:------|:---------|
| `%json <PATH>` | Pretty-prints JSON. |
| `%csv [-n N] [--profile] <PATH>` | Previews CSV as a dataframe-style table with total rows, preview rows, truncation state, and optional column stats. |
| `%tsv [-n N] [--profile] <PATH>` | Previews TSV with the same dataframe-style table and optional profile workflow. |
| `%sample [--tsv] [-n N] [--seed S] <PATH>` | Samples random CSV or TSV rows. `-n` controls sample size and `--seed` makes sampling reproducible. |
| `%sort [--tsv] [-n N] [--desc] <PATH> <COLUMN>` | Previews rows sorted by a CSV or TSV column. Numeric columns sort numerically when possible; `--desc` shows highest values first and blanks stay at the end. |
| `%filter [--tsv] [-n N] <PATH> <COLUMN> <OP> [VALUE]` | Previews CSV or TSV rows matching a column predicate. Supports `==`, `!=`, `>`, `>=`, `<`, `<=`, `contains`, `starts`, `ends`, `blank`, and `notblank`. |
| `%describe [--tsv] <PATH>` | Summarizes numeric CSV or TSV columns with count, missing, mean, std, min, p25, median, p75, and max. |
| `%schema [--tsv] <PATH>` | Infers lightweight CSV or TSV column types: empty, boolean, integer, decimal, date, datetime, or text, with missing counts and example values. |
| `%missing [--tsv] <PATH>` | Summarizes blank cells by CSV or TSV column with missing count, present count, missing percent, and an inline SVG bar chart. |
| `%valuecounts [--tsv] [--top N] <PATH> <COLUMN>` | Counts distinct CSV or TSV column values, including blanks as `(blank)`, with counts, percentages, and an inline SVG bar chart. |
| `%groupby [--tsv] <PATH> <GROUP_COLUMN> [VALUE_COLUMN] [AGG]` | Groups CSV or TSV rows. Without a value column it counts rows; with a value column it defaults to `mean` and supports `count`, `sum`, `mean`, `min`, and `max`. |
| `%corr [--tsv] [--heatmap] <PATH>` | Shows a Pearson correlation matrix for numeric CSV or TSV columns, computed pairwise from numeric row pairs. `--heatmap` adds an inline SVG heatmap above the matrix table. |
| `%scatter [--tsv] <PATH> <X_COLUMN> <Y_COLUMN>` | Renders a quick inline SVG scatter plot from paired numeric CSV or TSV columns, with skipped-value reporting. |
| `%lineplot [--tsv] <PATH> <X_COLUMN> <Y_COLUMN>` | Renders a quick inline SVG line plot from CSV or TSV data. The X column is used for labels and the Y column must be numeric. |
| `%hist [--tsv] [--bins N] <PATH> <COLUMN>` | Renders a quick inline SVG histogram from one numeric CSV or TSV column, with skipped-value reporting. |
| `%md <PATH>` | Renders Markdown as rich notebook HTML and keeps plain text. |
| `%html <PATH>` | Renders an HTML file directly. |
| `%yaml <PATH>` | Previews YAML text with notebook-friendly formatting. |
| `%toml <PATH>` | Previews TOML text with notebook-friendly formatting. |
| `%xml <PATH>` | Previews XML text with notebook-friendly formatting. |
| `%ini <PATH>` | Previews INI text with notebook-friendly formatting. |
| `%properties <PATH>` | Previews Java `.properties` files as key/value entries. |
| `%envfile <PATH>` | Previews `.env`-style files as key/value entries. |

## Archive And Artifact API

| Magic | Contract |
|:------|:---------|
| `%zipls <PATH>` | Lists entries inside a zip archive. |
| `%zipcat <ZIP_PATH> <ENTRY_PATH>` | Previews one UTF-8 text entry from a zip archive. |
| `%tarls <PATH>` | Lists entries inside a tar, tar.gz, or tgz archive. |
| `%tarcat <TAR_PATH> <ENTRY_PATH>` | Previews one UTF-8 text entry from a tar archive. |
| `%extract [--dry-run] <ARCHIVE_PATH> <ENTRY_PATH> [OUT_PATH]` | Extracts one archive entry under the notebook working directory. |

`%extract` refuses overwrite, caps extracted entry size, keeps writes inside the
notebook working directory, and supports `--dry-run` for path verification.

## Dependency And Runtime API

| Magic | Contract |
|:------|:---------|
| `%env <NAME>` | Shows one environment variable from the kernel process. |
| `%addjar <PATH>` | Adds one local jar to the live notebook classpath. |
| `%maven [--allow-remote] [--fetch] [--explain] <G:A:V>` | Resolves a Maven artifact from local caches, with guarded remote-fetch support. |
| `%deps` | Lists dynamically added notebook dependency entries. |
| `%whichclass <FQCN>` | Shows where a class was loaded from. |

## MIME Output Contract

Most magics return `text/plain` plus rich `text/html` for notebook rendering.
Renderable Java values can also produce image, audio, SVG/chart, table, or
HTML-style outputs through the kernel display layer.

## Examples

```java
%magics
%help %du
%pwd
%tree
%du .
```

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

```java
%zipls bundle.zip
%zipcat bundle.zip nested/report.txt
%tarls bundle.tar.gz
%tarcat bundle.tar.gz nested/report.txt
%extract --dry-run bundle.tar.gz nested/report.txt extracted/report.txt
%extract bundle.tar.gz nested/report.txt extracted/report.txt
%sha256 bundle.tar.gz
```

---

[Back to API Hub](../)
