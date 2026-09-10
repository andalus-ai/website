---
layout: default
title: gollek-ml-byte-latent
parent: API REferences
nav_order: 225
---

# gollek-ml-byte-latent

The `gollek-ml-byte-latent` module is Gollek's initial package root for
byte-latent language modeling. It is the right home for Fast Byte Latent
Transformer style architectures and related byte-native latent pipelines.

## 🌟 Overview

This module is intentionally separate from diffusion training. It provides the
shared Java-side contracts needed before heavier byte-latent encoder, decoder,
trainer, and runner implementations land.

Current scope:

- byte-sequence batch transport
- byte-level causal LM collation and packed window batches
- UTF-8 text dataset bridge for byte-sequence ingestion
- trainer-facing config and materialized batch planning
- executable trainer session and pluggable batch-loss evaluation
- executable `ByteLatentModel` forward-pass contract and `ByteLatentForwardPass`
- deterministic `ReferenceByteLatentModel` for model-backed trainer defaults
- shared `ByteLatentPreviewFormatter` for compact ranked next-token previews
- concrete `ReferenceByteLatentEncoder` and `ReferenceByteLatentDecoder`
- concrete `ReferenceByteLatentMixer` for deterministic latent-state mixing
- concrete `ReferenceByteLatentProjection` for deterministic latent projection
- concrete `ReferenceByteLatentOutputHead` for deterministic token projection
- reference encode -> latent-mix -> latent-project -> latent-transform -> decode -> output-head pipeline inside the model
- prompt-to-next-token prediction, ranked top-k candidates, and short byte-native generation defaults
- lifecycle listeners and lightweight checkpoint summary writing
- explicit checkpoint resume support with persisted epoch history CSV
- compact history report selectors for terminal-friendly inspection
- byte-latent state transport
- model-family citation and module metadata
- encoder/decoder interfaces
- reference encoder/decoder/mixer/projection/output-head implementations
- lightweight transformer-block placeholder for architecture wiring

## 📚 Paper Alignment

The current module family is based on:

- Julie Kallini, Artidoro Pagnoni, Tomasz Limisiewicz, Gargi Ghosh, Luke
  Zettlemoyer, Christopher Potts, Xiaochuang Han, and Srinivasan Iyer.
  **Fast Byte Latent Transformer**. `arXiv:2605.08044v1`, 2026.

Repository integration note:

- `/gollek/docs/FAST_BYTE_LATENT_TRANSFORMER_INTEGRATION_PLAN.md`

## 📦 Installation

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-byte-latent</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ API Highlights

### `ByteSequenceBatch`

Holds byte-native examples as batched raw sequences:

```java
ByteSequenceBatch batch = new ByteSequenceBatch(List.of(
    "halo dunia".getBytes(StandardCharsets.UTF_8),
    "hello world".getBytes(StandardCharsets.UTF_8)
));
```

### `ByteLatentModelSpec`

Defines the minimal architecture surface for a byte-latent model:

```java
ByteLatentModelSpec spec = new ByteLatentModelSpec(
    256,   // byte vocabulary
    1024,  // latent dimension
    24,    // transformer layers
    16,    // attention heads
    8192   // max byte sequence length
);
```

### `ByteSequenceCollator`

Packs raw byte sequences into shifted causal-LM windows:

```java
ByteSequenceWindowBatch packed = ByteSequenceCollator.causalLanguageModeling(
    batch,
    1024,
    0
);
```

The packed result contains:

- `inputIds`
- `targetIds`
- `attentionMask`

### `TextByteSequenceDataset`

Loads raw text lines and emits byte batches:

```java
TextByteSequenceDataset dataset = TextByteSequenceDataset.fromLines(Path.of("train.txt"));
ByteSequenceBatch batch = dataset.batch(0, 32);
ByteSequenceWindowBatch packed = ByteSequenceCollator.causalLanguageModeling(batch, 1024, 0);
```

### `ByteLatentTrainerConfig` and `ByteLatentTrainerSupport`

Build a trainer-ready plan from text data:

```java
ByteLatentTrainerConfig config = ByteLatentTrainerConfig.builder()
    .modelSpec(spec)
    .batchSize(32)
    .windowLength(1024)
    .padTokenId(0)
    .shuffle(true)
    .seed(7L)
    .build();

ByteLatentTrainingPlan plan = ByteLatentTrainerSupport.plan(dataset, config);
```

### `ByteLatentTrainer`

Run an executable session over the planned byte-latent batches:

```java
ByteLatentTrainerSession session = ByteLatentTrainer.builder()
    .dataset(dataset)
    .config(config)
    .lossEvaluator((batch, trainerConfig, epoch, batchIndex) -> 0.25d)
    .build();

TrainingSummary summary = session.fit();
```

When `checkpointDir` is configured, the current trainer writes:

- `byte-latent-summary.json`
- `byte-latent-checkpoint.metadata`
- `byte-latent-history.csv`
- `byte-latent-report.json`

When `resumeFromCheckpoint(true)` is enabled, the trainer can restore prior
epoch, best-loss, latest-loss, duration, and global-step state from those
artifacts before continuing, while keeping the epoch timeline available as a
small terminal-friendly CSV.

`ByteLatentHistoryReports` can then answer compact selectors over that file,
for example:

- `history:summary`
- `history:lastLoss`
- `history:lastEpoch`
- `history:sort=-trainLoss:top=3`

For terminal use, Gollek also provides:

- `gollek/examples/jbang/trainer/trainer_byte_latent_history_inspector.java`
  - supports `summary`, `artifacts`, `historyCount`,
    `summary:metadata:globalStep`, `status`, `health`, `ci`, `status:ci`, and `history:*`
    selectors from one
    checkpoint entrypoint
- `gollek/examples/jbang/trainer/trainer_byte_latent_workflow_inspector.java`
  - supports `overview`, `runs`, `workflowBundleDir`,
    `workflowBundleStatus`, `run:fresh`, `historyRows`,
    `delta:historyRows`, and `delta:latestTrainLoss` over the workflow
    manifest JSON
  - supports `commands` for the manifest's recommended inspector-command table,
    with optional filters like `scope=workflow` and `mode=fresh`
  - supports `commands:summary` and `commands:ci` for the compact top-priority
    workflow, bundle, and fresh/resume checkpoint command set
  - supports `commands:ci:mode=<run>` for the single-line per-run compact
    command rollup
  - supports `runcommands` to list the available per-run aliases from the manifest
  - supports `runcommands:all` for the concise multi-run alias summary
  - supports `runcommands:summary` and `runcommands:ci` for compact
    manifest-level run-alias summaries
  - supports `runcommands:<run>` as the shortest alias for that per-run
    manifest command rollup
  - supports `runfields` to list the per-run `inspectRunFields`,
    `inspectRunCommands`, and `inspectRunAll` follow-up aliases together
  - supports `runfields:summary` and `runfields:ci` for compact manifest-level
    summaries of that per-run field-discovery surface
  - supports `runfields:<run>` to isolate the per-run field-discovery row for
    one run mode
  - supports `inspectfields` to list which machine-readable inspector-command
    fields are present at the manifest and per-run levels
  - supports `inspectfields:summary` and `inspectfields:ci` for compact
    field-discovery summaries in terminal and CI flows
  - supports `bundleOverview` plus `focus=health|files|all` for compact
    bundle path/status/health summaries
  - plain `text` output for `bundleOverview` is optimized for terminal reading
  - `summary=short` collapses `bundleOverview` text output to one line
  - `bundleOverview:ci` is the shorthand alias for that CI-style overview path
  - `status` is the shortest neutral alias for a concise bundle check
  - `health` is the matching shortest direct-health alias for workflow and bundle checks
  - `bundleStatus` remains available as the explicit equivalent
  - `bundleHealth:ci` is the shorthand alias for that one-line direct health view
  - `bundleHealth:summary=short` provides the same one-line direct health view
  - can jump directly into a materialized workflow bundle with
    `bundleManifest`, `bundleFiles`, `bundleSummary`, `bundleHealth`, and
    `bundleLoadfile:section=<section>`
  - supports `bundle=standard` to write overview, runs, and delta JSON files
    into one output directory with a bundle manifest
  - can inspect exported bundle directories with `bundleSummary`,
    `bundleHealth`, `files`, `files:section=<section>`,
    `files:name=<name>`, `file:<name>`, and `loadfile:section=<section>`
  - supports `files:...:sort=name|section|format`
  - supports `loadfile:section=<section>:pick=first|last` and `index=<n>`
  - supports `filesSummary:by=section`, `filesSummary:by=format`,
    `sort=-count`, and `top=<n>`
- `gollek/examples/jbang/trainer/trainer_byte_latent_demo.java`
  - produces a small end-to-end byte-latent checkpoint directory for trying
    the inspector workflow locally
  - prints `status`, `health`, and `ci` follow-up inspector commands automatically
- `gollek/examples/jbang/trainer/trainer_byte_latent_resume_demo.java`
  - demonstrates resume-driven checkpoint growth and continued inspector
    queries against the same byte-latent checkpoint directory
  - prints `status`, `health`, and `ci` follow-up inspector commands automatically
- `gollek/examples/jbang/trainer/trainer_byte_latent_train_infer_inspector.java`
  - reads `train-infer-report.json` from a checkpoint directory or direct file
  - the report persists top-level `reportVersion`, `overview`, `overviewCi`, `status`, `statusSummary`, and
    `commands` / `commandsCi` fields plus `selectors` / `selectorsCi` and
    `inspectfields` / `inspectfieldsCi` discovery blocks, plus `artifactSummary` and `artifactSummaryLine`, in addition to
    the nested `training` and `inference` sections
  - supports `reportVersion`, `artifactSummary`, `artifactSummaryLine`, `overview`, `overview:ci`, `training`, `inference`, `nextToken`,
    `nextTokens`, `nextTokensPreview`, `generatedText`, `combinedText`,
    `commands`, `commands:ci`, `selectors`, `selectors:ci`, `inspectfields`,
    `inspectfields:ci`, `statusSummary`, `status`, `health`, and `ci`
- `gollek/examples/jbang/trainer/trainer_byte_latent_train_infer_compare_inspector.java`
  - compares two `train-infer-report.json` artifacts from checkpoint
    directories or direct file paths
  - supports `overview`, `runs`, `status`, `health`, `ci`, `left`, `right`,
    and `delta:*` selectors such as `delta:latestTrainLoss`,
    `delta:nextToken`, `delta:nextTokens`, `delta:nextTokensPreview`,
    `delta:nextTokensCount`, and `delta:combinedText`
  - those direct compare outputs now also include `reportVersion` plus
    `leftReportVersion` / `rightReportVersion` so live compares and exported
    compare bundles expose the same schema-version signal
  - direct compare mode now also supports a compact structured
    `compareSummary` object alongside the one-line `compareSummaryLine`
  - direct compare mode now also supports `comparison` as the shared full
    comparison block that now matches the exported bundle manifest’s
    `comparison` structure
  - direct compare mode now also supports `selectors` and `selectors:ci` so
    live two-report comparisons can advertise their most useful follow-up
    queries
  - direct compare mode now also supports `inspectfields` and
    `inspectfields:ci` so live two-report comparisons can advertise their
    stable machine-readable field surface too
  - direct compare mode now also supports `artifactSummary` and
    `artifactSummaryLine` so live two-report comparisons expose the same
    compact dashboard shape as exported compare bundles
  - direct compare mode now also supports `commands` and `commands:ci` so
    live two-report comparisons can advertise their recommended query
    commands too
  - that standalone compare result JSON can now be reopened directly with
    `resultSummary` and `resultSummaryLine` for compact artifact-level
    follow-up
  - it also supports `resultCommands` / `resultCommands:ci`,
    `resultSelectors` / `resultSelectors:ci`, and `resultFields` /
    `resultFields:ci` as more explicit artifact-centric aliases for the same
    standalone discovery surfaces
  - it also supports `resultOverview` / `resultOverview:ci` and
    `resultHealth` / `resultHealth:ci` as artifact-centric overview and
    status aliases for reopened standalone compare-result files
  - it also supports `resultManifest` / `resultManifest:ci` as explicit
    artifact-centric full-payload aliases for reopened standalone
    compare-result files
  - it also supports `resultComparison` / `resultComparison:ci` as explicit
    artifact-centric compare-payload aliases for reopened standalone
    compare-result files
  - it also supports `resultPayloads` / `resultPayloads:ci` as explicit
    artifact-centric source-report reference aliases for reopened
    standalone compare-result files
  - it also supports `resultSources` / `resultSources:ci` as a more
    conversational alias family for the same reopened standalone
    source-report reference surface
  - it also supports `resultAliases` / `resultAliases:ci` as a compact alias
    discovery surface for reopened standalone compare-result files
  - `resultCommands` / `resultCommands:ci` now prefer a dedicated
    alias-oriented reopened-result command surface instead of falling back
    to the older live-compare command map
  - `resultSelectors` / `resultSelectors:ci` now prefer a dedicated
    alias-oriented reopened-result selector surface instead of falling back
    to the older live-compare selector map
  - `resultFields` / `resultFields:ci` now prefer a dedicated reopened-result
    field-discovery surface that describes the standalone result artifact
    schema directly
  - standalone `result=standard` exports now also persist top-level
    `resultAliases` / `resultAliasesCi` alongside `resultCommands`,
    `resultSelectors`, and `resultFields`, so the reopened-result discovery
    family is explicit in the artifact contract itself
  - standalone `result=standard` exports now also persist top-level
    `resultOverview` / `resultOverviewCi`, `resultManifest` /
    `resultManifestCi`, and `resultComparison` / `resultComparisonCi`, so
    the main reopened-result alias surfaces are explicitly present in the
    artifact contract itself
  - standalone `result=standard` exports now also persist top-level
    `resultStatus` / `resultStatusCi` and `resultHealth` /
    `resultHealthCi`, so the artifact-centric status and health alias
    surfaces are explicitly present in the artifact contract itself
  - standalone `result=standard` exports now also persist top-level
    `resultDashboard` / `resultDashboardCi`, so the main reopened-result
    summary surfaces are available through one explicit high-signal block
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardFields` / `resultDashboardFieldsCi`, so the dashboard
    can advertise its embedded summary surfaces without requiring raw JSON
    inspection
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardCommands` / `resultDashboardCommandsCi`, so the
    dashboard can advertise the most useful embedded follow-up reopen
    commands directly
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardAliases` / `resultDashboardAliasesCi`, so the dashboard
    can advertise the preferred alias family for each embedded summary
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardSelectors` / `resultDashboardSelectorsCi`, so the
    dashboard can advertise the preferred selector-level follow-ups for
    its embedded summaries directly
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardOverview` / `resultDashboardOverviewCi`, so the
    dashboard has its own artifact-centric compact overview alias in
    addition to the broader result-level overview surface
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardStatus` / `resultDashboardStatusCi`, so the dashboard
    has a matching artifact-centric status alias in addition to the
    broader result-level status and health surfaces
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardHealth` / `resultDashboardHealthCi`, so the dashboard
    has the matching artifact-centric health alias that completes the
    dashboard overview/status/health trio
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardSummary` / `resultDashboardSummaryCi`, so the
    dashboard has one explicit artifact-centric summary alias that rolls
    overview, status, and health together
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardManifest` / `resultDashboardManifestCi`, so the
    dashboard family also has an explicit artifact-centric full payload
    alias that complements summary, overview, status, and health
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardFamilyCommands` / `resultDashboardFamilyCommandsCi`
    and `resultDashboardFamilySelectors` /
    `resultDashboardFamilySelectorsCi`, so the dashboard subtree can be
    browsed without mixing in the broader result-level entries
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardFamilyFields` / `resultDashboardFamilyFieldsCi`, so
    the dashboard subtree has matching field discovery alongside its
    dashboard-only commands and selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTree` / `resultDashboardTreeCi`, so the whole
    dashboard subtree can be inspected as one compact hierarchical
    summary
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeFields` / `resultDashboardTreeFieldsCi`, so the
    dashboard tree can advertise its embedded sections directly instead
    of only returning the aggregated tree payload
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCommands` / `resultDashboardTreeCommandsCi`, so
    the dashboard tree can advertise its preferred follow-up reopen
    commands directly alongside its embedded-section summary
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeSelectors` / `resultDashboardTreeSelectorsCi`,
    so the dashboard tree can advertise its preferred follow-up
    selectors directly alongside its embedded-section and command
    summaries
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeManifest` / `resultDashboardTreeManifestCi`, so
    the dashboard tree has an explicit full-payload alias alongside its
    compact summary entrypoint
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeSummary` / `resultDashboardTreeSummaryCi`, so
    the dashboard tree has an explicit compact summary alias alongside
    its full manifest-style entrypoint
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeDashboard` / `resultDashboardTreeDashboardCi`,
    so the embedded dashboard branch can be reopened directly instead of
    only through the full tree payload
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreePaths` / `resultDashboardTreePathsCi`, so the
    dashboard tree can advertise its main reopen selectors in one
    compact artifact-centric navigation block
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalog` / `resultDashboardTreeCatalogCi`, so
    paths, children, and counts can be reopened together through one
    compact tree navigation summary
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogFields` /
    `resultDashboardTreeCatalogFieldsCi`, so the tree catalog can
    advertise its embedded summary blocks directly
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogCommands` /
    `resultDashboardTreeCatalogCommandsCi`, so the tree catalog can
    advertise its main follow-up reopen commands directly
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogSelectors` /
    `resultDashboardTreeCatalogSelectorsCi`, so the tree catalog can
    advertise its main follow-up selectors directly
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogManifest` /
    `resultDashboardTreeCatalogManifestCi`, so the tree catalog gets an
    explicit full-payload alias alongside its compact summary
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogSummary` /
    `resultDashboardTreeCatalogSummaryCi`, so the tree catalog gets an
    explicit compact-summary alias alongside its manifest alias
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogOverview` /
    `resultDashboardTreeCatalogOverviewCi`, so the tree catalog gets a
    friendlier artifact-centric overview alias alongside its structural names
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummary` /
    `resultDashboardTreeCatalogTreeSummaryCi`, so the tree catalog can reopen
    one compact summary that rolls its path, child, and count summaries
    together
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryFields` /
    `resultDashboardTreeCatalogTreeSummaryFieldsCi`, so the compact tree
    summary can advertise its embedded `paths`, `children`, and `counts`
    blocks
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryCommands` /
    `resultDashboardTreeCatalogTreeSummaryCommandsCi`, so the compact tree
    summary can advertise its preferred follow-up commands
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummarySelectors` /
    `resultDashboardTreeCatalogTreeSummarySelectorsCi`, so the compact tree
    summary can advertise its preferred follow-up selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryAliases` /
    `resultDashboardTreeCatalogTreeSummaryAliasesCi`, so the compact tree
    summary can advertise its friendly follow-up alias names
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryDiscovery` /
    `resultDashboardTreeCatalogTreeSummaryDiscoveryCi`, so the compact tree
    summary can expose one tiny discovery header for its fields, commands,
    selectors, and aliases
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryLineage` /
    `resultDashboardTreeCatalogTreeSummaryLineageCi`, so the compact tree
    summary can advertise its parent result, dashboard, tree, and catalog
    ancestry
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryNavigation` /
    `resultDashboardTreeCatalogTreeSummaryNavigationCi`, so the compact tree
    summary can expose one combined "where am I and where can I go next"
    navigation header
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryBreadcrumbs` /
    `resultDashboardTreeCatalogTreeSummaryBreadcrumbsCi`, so the compact tree
    summary can expose a log-friendly breadcrumb path derived from lineage
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummarySitemap` /
    `resultDashboardTreeCatalogTreeSummarySitemapCi`, so the compact tree
    summary family can expose a machine-readable endpoint index
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryIndex` /
    `resultDashboardTreeCatalogTreeSummaryIndexCi`, so the compact tree
    summary family can expose a grouped `self`, `discovery`, and `leaves`
    endpoint index
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistry` /
    `resultDashboardTreeCatalogTreeSummaryRegistryCi`, so the compact tree
    summary family can expose one registry that combines grouped and flat
    endpoint counts
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryFields` /
    `resultDashboardTreeCatalogTreeSummaryRegistryFieldsCi`, so the compact
    tree summary registry can advertise its `index`, `sitemap`, and
    `breadcrumbs` blocks
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryCommands` /
    `resultDashboardTreeCatalogTreeSummaryRegistryCommandsCi`, so the compact
    tree summary registry can advertise direct commands for its registry,
    fields, index, sitemap, and breadcrumbs views
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistrySelectors` /
    `resultDashboardTreeCatalogTreeSummaryRegistrySelectorsCi`, so the compact
    tree summary registry can advertise selector IDs for its registry, fields,
    index, sitemap, and breadcrumbs views
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryAliases` /
    `resultDashboardTreeCatalogTreeSummaryRegistryAliasesCi`, so the compact
    tree summary registry can advertise friendly aliases for its registry,
    fields, index, sitemap, and breadcrumbs views
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryDiscovery` /
    `resultDashboardTreeCatalogTreeSummaryRegistryDiscoveryCi`, so the compact
    tree summary registry can expose one discovery header for its fields,
    commands, selectors, and aliases
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryNavigation` /
    `resultDashboardTreeCatalogTreeSummaryRegistryNavigationCi`, so the compact
    tree summary registry can expose its current selector, parent tree-summary
    navigation, and registry discovery sections
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryBreadcrumbs` /
    `resultDashboardTreeCatalogTreeSummaryRegistryBreadcrumbsCi`, so the compact
    tree summary registry has its own log-friendly breadcrumb path beneath the
    broader tree-summary breadcrumb
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistrySitemap` /
    `resultDashboardTreeCatalogTreeSummaryRegistrySitemapCi`, so the compact tree
    summary registry has its own flat endpoint list for registry-local discovery
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryIndex` /
    `resultDashboardTreeCatalogTreeSummaryRegistryIndexCi`, so the compact tree
    summary registry has grouped self, metadata, and discovery endpoint counts
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryOverview` /
    `resultDashboardTreeCatalogTreeSummaryRegistryOverviewCi`, so the compact
    tree summary registry has a one-stop summary of index, sitemap, and breadcrumb
    state
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryStatus` /
    `resultDashboardTreeCatalogTreeSummaryRegistryStatusCi`, so the compact tree
    summary registry can report whether grouped and flat endpoint counts stay in
    sync
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryHealth` /
    `resultDashboardTreeCatalogTreeSummaryRegistryHealthCi`, so the compact tree
    summary registry has a health-facing view over the registry status signal
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistrySummary` /
    `resultDashboardTreeCatalogTreeSummaryRegistrySummaryCi`, so the compact tree
    summary registry has one compact rollup over overview, status, and health
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryManifest` /
    `resultDashboardTreeCatalogTreeSummaryRegistryManifestCi`, so the compact
    tree summary registry has a manifest-style wrapper around summary, command,
    and selector counts
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryEnvelope` /
    `resultDashboardTreeCatalogTreeSummaryRegistryEnvelopeCi`, so the compact
    tree summary registry has one operational envelope over manifest, discovery,
    navigation, and breadcrumbs
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistrySnapshot` /
    `resultDashboardTreeCatalogTreeSummaryRegistrySnapshotCi`, so the compact
    tree summary registry has one stable snapshot over envelope, index, and
    sitemap counts
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryAudit` /
    `resultDashboardTreeCatalogTreeSummaryRegistryAuditCi`, so the compact tree
    summary registry has an explicit pass/fail audit over snapshot health and
    endpoint balance
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryReport` /
    `resultDashboardTreeCatalogTreeSummaryRegistryReportCi`, so the compact tree
    summary registry has a report-facing wrapper around audit and snapshot status
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklist` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistCi`, so the compact
    tree summary registry exposes report readiness as individual checklist items
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummary` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummaryCi`, so the
    compact tree summary registry has a named checklist summary alias
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistStatus` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistStatusCi`, so the
    compact tree summary registry has a status-facing checklist readiness alias
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistHealth` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistHealthCi`, so the
    compact tree summary registry has a health-facing checklist readiness alias
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistBadge` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistBadgeCi`, so the
    compact tree summary registry has a one-line checklist badge alias for UI
    status consumers
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistCard` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistCardCi`, so the
    compact tree summary registry has a card-shaped checklist readiness alias
    for dashboard panels
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistPanel` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistPanelCi`, so the
    compact tree summary registry has a dashboard panel payload that groups
    card readiness, badge status, and details navigation
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistWidget` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistWidgetCi`, so the
    compact tree summary registry has a tiny embeddable checklist widget payload
    for status tiles
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistTile` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistTileCi`, so the
    compact tree summary registry has a display-oriented checklist tile payload
    with tone, value, and action selector fields
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistMetric` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistMetricCi`, so the
    compact tree summary registry has a numeric checklist readiness metric for
    dashboard chart consumers
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistTrend` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistTrendCi`, so the
    compact tree summary registry has a trend-ready checklist readiness series
    for dashboard history consumers
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistGauge` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistGaugeCi`, so the
    compact tree summary registry has a display-ready checklist readiness gauge
    for dashboard widget consumers
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummaryCard` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummaryCardCi`, so
    the compact tree summary registry has a one-fetch checklist readiness card
    for dashboard overview consumers
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistActionBar` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistActionBarCi`, so the
    compact tree summary registry has ready-made checklist action links for
    dashboard button consumers
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboard` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardCi`, so the
    compact tree summary registry has a one-fetch checklist dashboard section
    with summary and action selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardManifest` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardManifestCi`,
    so checklist dashboard clients can inspect the section schema and companion
    selectors without hardcoding them
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSnapshot` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSnapshotCi`,
    so checklist dashboard clients can capture manifest and dashboard state in
    one compact snapshot
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardAudit` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardAuditCi`,
    so checklist dashboard clients can read a compact audit verdict over the
    latest dashboard snapshot
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReport` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReportCi`,
    so checklist dashboard clients can fetch dashboard, manifest, snapshot, and
    audit selectors through one report surface
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardEnvelope` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardEnvelopeCi`,
    so checklist dashboard clients can transport the report with stable envelope
    metadata
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardPackage` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardPackageCi`,
    so checklist dashboard clients can deliver the envelope/report pair as one
    packaged payload
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardBundle` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardBundleCi`,
    so checklist dashboard clients can fetch package metadata and detail
    selectors as one self-contained bundle
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDelivery` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDeliveryCi`,
    so checklist dashboard clients can route the bundle through stable selector
    transport metadata
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReceipt` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReceiptCi`,
    so checklist dashboard clients can acknowledge the delivered bundle with a
    compact receipt surface
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardArchive` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardArchiveCi`,
    so checklist dashboard clients can retain a stable archived record of the
    delivered receipt chain
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardLedger` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardLedgerCi`,
    so checklist dashboard clients can expose the archived receipt chain as a
    compact ledger entry
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardHistory` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardHistoryCi`,
    so checklist dashboard clients can group ledger, archive, receipt, and
    delivery pointers into one compact history surface
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTimeline` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTimelineCi`,
    so checklist dashboard clients can read the delivered history chain as an
    ordered compact timeline
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTrace` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTraceCi`,
    so checklist dashboard clients can debug the timeline through a compact
    trace path
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTelemetry` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTelemetryCi`,
    so checklist dashboard clients can observe the trace through a compact
    telemetry summary
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardObservation` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardObservationCi`,
    so checklist dashboard clients can present telemetry as a compact observed
    state surface
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSignal` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSignalCi`,
    so CI clients can read the observed state as a tiny continue/review signal
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardInsight` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardInsightCi`,
    so CI logs can show a short human-readable signal explanation
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardRecommendation` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardRecommendationCi`,
    so CI clients can consume a direct priority/action recommendation
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDecision` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDecisionCi`,
    so gates can consume a final allow/block decision with a blocking reason
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGate` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateCi`,
    so shell scripts can consume a tiny open/closed gate with an exit code
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateLineCi`,
    so shell logs can print the gate as one compact status line
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateJson` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateJsonCi`,
    so structured CI clients can read the minimal gate fields as JSON
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateEnv` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateEnvCi`,
    so CI env-file steps can consume shell-friendly gate assignments
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateMarkdown` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateMarkdownCi`,
    so PR comments and CI summaries can show the gate as compact Markdown
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateSummary` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateSummaryCi`,
    so callers can fetch JSON, line, env, and Markdown gate renderings together
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateArtifact` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateArtifactCi`,
    so CI upload steps can capture gate renderings with result metadata and selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadManifest` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadManifestCi`,
    so CI upload steps can discover suggested gate artifact filenames and labels
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadScript` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadScriptCi`,
    so CI jobs can generate gate artifact files from the upload manifest selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadReadme` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadReadmeCi`,
    so uploaded gate artifact bundles can include a human-readable file inventory
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadBundle` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadBundleCi`,
    so CI callers can fetch the gate artifact, manifest, script, and README together
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadIndex` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadIndexCi`,
    so callers can discover the gate upload selectors from one compact index
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesIndex` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesIndexCi`,
    so CI archive jobs can list upload filenames, content types, selectors, and commands without parsing the full manifest
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesLineCi`,
    so logs and notifications can show upload filenames from one compact line
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesJsonLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesJsonLineCi`,
    so structured log collectors can read upload filenames as one JSON line
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesCsvLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesCsvLineCi`,
    so spreadsheet and archive jobs can read upload filenames as one CSV row
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesTsvLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesTsvLineCi`,
    so spreadsheet and archive jobs can read upload filenames as one TSV row
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesEnv` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesEnvCi`,
    so shell and CI jobs can source upload filenames without parsing CSV or TSV
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesMarkdown` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesMarkdownCi`,
    so release comments and review pages can show upload filenames as a Markdown table
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksums` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCi`,
    so archive jobs can verify upload file payloads with deterministic SHA-256 metadata
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLineCi`,
    so CI logs can print upload file integrity metadata without parsing JSON
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMarkdown` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMarkdownCi`,
    so release comments can show upload file integrity metadata as a Markdown table
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEnv` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEnvCi`,
    so shell and CI jobs can source upload file checksum metadata directly
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsJsonLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsJsonLineCi`,
    so structured log collectors can ingest upload file checksum metadata as JSONL
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCsvLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCsvLineCi`,
    so spreadsheet and archive jobs can ingest upload file checksum metadata as CSV
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTsvLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTsvLineCi`,
    so tab-safe reports can ingest upload file checksum metadata as TSV
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummary` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummaryCi`,
    so dashboards can read upload checksum counts, byte totals, and preview filenames without parsing line formats
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsBadge` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsBadgeCi`,
    so dashboards and notifications can render a tiny upload checksum status label
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCard` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCardCi`,
    so UI tiles can render upload checksum badge, counts, byte totals, and drill-down selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsPanel` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsPanelCi`,
    so dashboards can render a richer upload checksum panel with card data and drill-down selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsWidget` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsWidgetCi`,
    so dashboards can embed a compact upload checksum widget with badge, metrics, preview filenames, and links
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTile` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTileCi`,
    so dashboards can embed a tiny upload checksum tile with value, caption, and drill-down selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMetric` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMetricCi`,
    so dashboards can ingest numeric upload checksum file and byte metrics with drill-down selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTrend` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTrendCi`,
    so dashboards can ingest trend-ready upload checksum values with baseline, delta, and drill-down selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsGauge` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsGaugeCi`,
    so dashboards can render a gauge-ready upload checksum status with ratio, percent, state, and selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummaryCard` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummaryCardCi`,
    so dashboards can render a compact upload checksum card with gauge, trend, headline fields, and selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsActionBar` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsActionBarCi`,
    so dashboards can render upload checksum actions for card, raw checksums, copy formats, and bundle handoff
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMenu` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMenuCi`,
    so dashboards can render grouped upload checksum navigation across overview, integrity, log, and handoff selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToolbar` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToolbarCi`,
    so dashboards can render compact upload checksum controls for menu, search, filter, card view, and JSONL export
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCommandPalette` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCommandPaletteCi`,
    so dashboards can render searchable upload checksum commands with groups, selectors, and keywords
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchIndex` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchIndexCi`,
    so dashboards can search upload checksum commands through normalized text entries, selectors, and keywords
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchResults` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchResultsCi`,
    so dashboards can validate upload checksum search result rendering with a stable sample query and matches
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsFilterState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsFilterStateCi`,
    so dashboards can initialize upload checksum search filters with selected status, groups, and counts
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsViewState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsViewStateCi`,
    so dashboards can hydrate one upload checksum UI state with toolbar, filters, selectors, and search results
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEmptyState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEmptyStateCi`,
    so dashboards can render a no-match upload checksum fallback with suggestions and recovery actions
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLoadingState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLoadingStateCi`,
    so dashboards can render an in-flight upload checksum refresh state with skeleton rows and selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsErrorState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsErrorStateCi`,
    so dashboards can render a recoverable upload checksum refresh error with retry and fallback actions
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToastState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToastStateCi`,
    so dashboards can render compact success/loading/error checksum notifications with quick selectors
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationCenter` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationCenterCi`,
    so dashboards can render grouped checksum notification history with active, unread, and error counts
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationBadge` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationBadgeCi`,
    so dashboards can render a compact checksum notification badge with unread and error counts
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanel` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCi`,
    so dashboards can render an expandable checksum notification panel with badge, groups, and top rows
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLineCi`,
    so CI jobs can print the checksum notification panel status without expanding the full payload
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelJsonLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelJsonLineCi`,
    so structured log collectors can ingest checksum notification panel status as one JSONL record
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCsvLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCsvLineCi`,
    so spreadsheets can ingest checksum notification panel status as one CSV row
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelTsvLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelTsvLineCi`,
    so tab-safe log consumers can ingest checksum notification panel status as one TSV row
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMarkdown` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMarkdownCi`,
    so release notes and PR comments can include the checksum notification panel status and top rows
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEnv` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEnvCi`,
    so shell jobs can export checksum notification panel status and selector values
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSummaryCard` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSummaryCardCi`,
    so dashboards can render a compact checksum notification panel summary card
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelActionBar` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelActionBarCi`,
    so dashboards can render checksum notification panel action shortcuts
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMenu` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMenuCi`,
    so dashboards can render grouped checksum notification panel navigation
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToolbar` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToolbarCi`,
    so dashboards can render checksum notification panel toolbar controls
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCommandPalette` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCommandPaletteCi`,
    so dashboards can expose searchable checksum notification panel commands
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchIndex` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchIndexCi`,
    so dashboards can index checksum notification panel commands by text, keyword, group, and selector
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchResults` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchResultsCi`,
    so dashboards can consume a filtered notification-panel command result set over the search index
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelFilterState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelFilterStateCi`,
    so dashboards can carry notification-panel query, group, status, and match-count filter defaults
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelViewState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelViewStateCi`,
    so dashboards can render notification-panel search results with toolbar, filters, and selector links
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEmptyState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEmptyStateCi`,
    so dashboards can render no-match notification-panel fallbacks with recovery actions
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLoadingState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLoadingStateCi`,
    so dashboards can render in-progress notification-panel refresh fallbacks with skeleton rows
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelErrorState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelErrorStateCi`,
    so dashboards can render recoverable notification-panel refresh failures with retry actions
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToastState` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToastStateCi`,
    so dashboards can render notification-panel success, loading, and retry toasts from one payload
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationCenter` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationCenterCi`,
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationBadge` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationBadgeCi`,
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationLineCi`,
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationJsonLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationJsonLineCi`,
    so dashboards can render grouped notification-panel toast history with unread and error counts
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatus` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatusCi`,
    so CI jobs can check whether the gate upload bundle is ready from one compact status
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatusLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatusLineCi`,
    so shell scripts can read the upload readiness as one stable line
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadEnv` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadEnvCi`,
    so CI shells can read upload readiness as env-file variables
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadJsonLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadJsonLineCi`,
    so structured log collectors can read upload readiness as one JSON line
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadCsvLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadCsvLineCi`,
    so CI jobs can archive upload readiness as a compact CSV row
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadTsvLine` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadTsvLineCi`,
    so CI jobs can archive upload readiness as a compact TSV row
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDetails` /
    `resultDashboardTreeCatalogTreeSummaryRegistryChecklistDetailsCi`, so the
    compact tree summary registry has a checklist details view with named checks
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogAliasesSummary` /
    `resultDashboardTreeCatalogAliasesSummaryCi`, so the tree catalog alias
    companion gets a named compact-summary alias alongside its base rows and
    compact summary surface
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogChildrenSummary` /
    `resultDashboardTreeCatalogChildrenSummaryCi`, so the tree catalog child
    companion gets the same named compact-summary path as the catalog
    command, selector, and alias companions
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogCountsSummary` /
    `resultDashboardTreeCatalogCountsSummaryCi`, so the tree catalog counts
    companion gets the same named compact-summary path as the catalog
    command, selector, alias, and child companions
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogCommandsSummary` /
    `resultDashboardTreeCatalogCommandsSummaryCi`, so the tree catalog's
    command companion gets its own explicit compact-summary alias
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogSelectorsSummary` /
    `resultDashboardTreeCatalogSelectorsSummaryCi`, so the tree catalog's
    selector companion gets its own explicit compact-summary alias
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCatalogAliases` /
    `resultDashboardTreeCatalogAliasesCi`, so the tree catalog can
    advertise its artifact-centric alias family directly
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeChildren` / `resultDashboardTreeChildrenCi`, so
    the dashboard tree can advertise its main child branches directly
    instead of only through the broader field summary
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeCounts` / `resultDashboardTreeCountsCi`, so the
    dashboard tree can expose its child and discovery totals directly in
    one compact machine-friendly block
  - standalone `result=standard` exports now also persist top-level
    `resultDashboardTreeAliases` / `resultDashboardTreeAliasesCi`, so
    the dashboard tree can advertise its preferred alias family
    alongside its field, command, and selector summaries
  - it also supports `resultStatus` / `resultStatus:ci` as a matching
    artifact-centric status alias family for reopened standalone
    compare-result files
  - it also persists top-level `commands` / `commandsCi`, `selectors` /
    `selectorsCi`, and `inspectfields` / `inspectfieldsCi` so the exported
    compare result has the same compact discovery vocabulary as the bundle path
  - direct compare mode now also supports `compareSummaryLine` as a one-line
    shell-friendly summary to match the exported compare bundle’s
    `comparisonSummary`
  - supports `bundle=standard` to export a machine-readable compare bundle with
    `overview.json`, `runs.json`, `delta-nextTokens.json`,
    `delta-nextTokensPreview.json`,
    `delta-nextTokensCount.json`, other key
    `delta-*.json` files, and `manifest.json`
  - can reopen exported compare bundle directories with `bundleSummary`,
    `comparisonSummary`, `bundleFiles`, `bundleManifest`, `file:<name>`, and
    `loadfile:<section>`
  - supports `reportVersion` as the shortest selector for the compare-bundle
    manifest schema marker
  - exported compare bundle manifests now also carry a stable top-level
    `reportVersion` plus `leftReportVersion` / `rightReportVersion` source
    markers for schema-aware automation
  - exported compare bundle manifests now also expose `selectors` and
    `selectors:ci` so bundle consumers get a compact direct-query discovery
    surface without deriving it from the larger manifest fields
  - `commands` and `commands:ci` summarize the recommended compare-bundle
    follow-up selectors for terminal and CI use
  - `inspectfields` and `inspectfields:ci` summarize the machine-readable
    compare-bundle manifest fields for automation and quick discovery
  - exported compare bundle manifests also persist those recommendations in
    top-level `commands` and `commandsCi`, alongside the legacy
    `inspectCommands` and `inspectCommandsCi`
  - exported compare bundle manifests also persist field discovery in
    top-level `inspectfields` and `inspectfieldsCi`, alongside the legacy
    `inspectFields` and `inspectFieldsCi`
  - exported compare bundle manifests also persist `artifactSummary` and
    `artifactSummaryLine` for compact bundle-dashboard reuse
  - exported compare bundle manifests also expose top-level command shortcuts in
    `inspectBundleStatus`, `inspectBundleHealth`, `inspectBundleOverview`,
    `inspectBundleFiles`, and `inspectBundleLoadfile`
  - exported compare bundle manifests also include a compact `comparison`
    block plus top-level `leftNextTokensPreview`,
    `rightNextTokensPreview`, and `nextTokensPreviewChanged` fields for
    lightweight automation
  - exported compare bundle manifests also include a one-line
    `comparisonSummary` string for simple CI or shell output
  - exported compare bundle manifests also expose top-level selector hints in
    `inspectBundleSummarySelector`, `inspectBundleFilesSummarySelector`,
    `inspectBundleNextTokensSelector`,
    `inspectBundleNextTokensPreviewSelector`,
    `inspectBundleNextTokensCountSelector`,
    `inspectBundleMissingFilesSelector`, and
    `inspectBundleMissingFilesTopSelector`
  - exported compare bundle manifests also expose a compact status block in
    `status`, plus mirrored top-level scalars in `healthStatus`,
    `missingFileCount`, and `okFileCount`
  - exported compare bundle manifests also expose `statusSummary` as a
    human-readable one-line health/status string
  - `loadfile:` also supports `section=<section>`, `pick=first|last`, and
    `index=<n>` for deterministic compare-bundle file selection
  - `bundleFiles` also supports filtered listing through `files:section=...`,
    `files:name=...`, `files:format=...`, `sort=...`, and `top=<n>`
  - supports `bundleHealth` and `filesSummary:by=section|format` for compact
    compare-bundle integrity and file-count summaries
  - `filesSummary` also supports `sort=-count` and `top=<n>` for trimmed
    compare-bundle rollups
  - `bundleHealth` also supports `focus=files|sections|formats|all`,
    `sort=...`, and `top=<n>` for trimmed health diagnostics
  - `bundleHealth:focus=files` also supports `section=...`, `name=...`,
    `format=...`, and `status=ok|missing` for filtered per-file health views
  - those same filters also apply before grouped
    `bundleHealth:focus=sections|formats` rollups
  - supports `bundleStatus` and `bundleHealth:ci` as one-line compare-bundle
    health checks
  - supports `bundleOverview` and `bundleOverview:ci` for a more consistent
    compare-bundle overview path alongside the workflow bundle inspector
- `gollek/examples/jbang/trainer/run_byte_latent_smoke.sh`
  - runs the byte-latent demo and key inspector checks together as a single
    contributor smoke path
  - leads with `status`, `health`, and `ci` inspector checks
- `gollek/examples/jbang/trainer/run_byte_latent_workflow.sh`
  - provides one entrypoint for `fresh`, `resume`, and `full` smoke runs while
    ending `full` mode with a compact workflow summary for both checkpoint
    directories
  - summarizes checkpoint paths, history row counts, and follow-up inspector
    commands
  - leads those follow-up checkpoint commands with `status`, `health`, and `ci`
  - leads its workflow-manifest and workflow-bundle follow-up commands with
    `status` and `health`
  - prints `commands:summary` first for the workflow-manifest compact command rollup
  - prints `runcommands:fresh` and `runcommands:resume` in that
    workflow-manifest follow-up block
  - prints `runcommands:ci` there as the compact discovery summary for available per-run aliases
  - prints `runcommands` there as the discovery selector for available per-run aliases
  - prints `runcommands:all` there as the concise multi-run alias summary
  - prints `inspectfields` there as the full machine-readable field-discovery selector
  - prints `inspectfields:ci` there as the compact machine-readable field-discovery summary
  - prints `runfields:ci` there as the compact per-run field-discovery summary
  - prints `runfields` there as the per-run field-discovery selector
  - prints `runfields:ci` in each fresh/resume run summary as the compact
    per-run field-discovery hint
  - prints `runcommands:<run>` alongside `commands:ci:mode=<run>` in each
  - prints `runcommands:ci` in each fresh/resume run summary as the generic
    compact discovery hint for available per-run aliases
  - prints `runcommands:all` in each fresh/resume run summary as the concise
    multi-run alias overview path
    fresh/resume run summary for the matching single-line manifest-driven CI follow-up
  - writes a small workflow manifest JSON for downstream automation
  - records `workflowBundleDir` and `workflowBundleStatus` in that manifest
  - records `inspectWorkflowStatus`, `inspectWorkflowHealth`,
    `inspectBundleStatus`, and `inspectBundleHealth` in that manifest
  - records per-run `inspectWorkflowCommands` entries for the single-line
    `commands:ci:mode=<run>` workflow follow-up
  - records per-run `inspectRunCommands` entries for the shortest
    `runcommands:<run>` workflow follow-up
  - records per-run `inspectRunAll` entries for the concise multi-run
    `runcommands:all` workflow overview path
  - records per-run `inspectRunFields` entries for the compact
    `inspectfields:ci` machine-readable field-discovery hint
  - materializes a workflow bundle automatically in `full` mode
  - prints ready-to-run workflow-manifest inspector commands at the end
  - also prints workflow-bundle export and `loadfile:` examples at the end
  - preserves the older helper scripts for compatibility
- `gollek/examples/jbang/trainer/run_byte_latent_resume_smoke.sh`
  - runs the byte-latent resume demo and key inspector checks together as a
    single contributor resumed-run smoke path

### `ByteLatentModelFamily`

Provides the canonical family id and paper citation:

```java
String familyId = ByteLatentModelFamily.FAMILY_ID;
String citation = ByteLatentModelFamily.PAPER_CITATION;
```

## 🧭 Module Direction

Planned follow-on modules around this family:

- `gollek-ml-language-core`
- `gollek-ml-byte-io`
- `gollek-runner-byte-latent`
- `gollek-trainer-byte-latent`

## Boundary

This module does **not** replace:

- `gollek-ml-transformer` for generic attention blocks
- `gollek-ml-nlp` for token-oriented NLP utilities
- `gollek-ml-diffusion-*` for diffusion-specific training

It exists to keep byte-latent language modeling as its own architectural lane.

---

[Back to API Hub](../)
