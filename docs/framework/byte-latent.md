---
layout: default
title: Byte-Latent Modeling
---

# Byte-Latent Modeling in Gollek

For the guided docs landing page that groups architecture, terminal workflow,
repo locations, and stable-vs-evolving notes in one place, start with
[Byte-Latent Docs](/docs/framework/byte-latent-docs).
For the compact terminal grammar lookup page, use
[Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference).

Gollek treats byte-latent language modeling as a separate architecture family,
not as an extension of diffusion training.

That means Fast Byte Latent Transformer style work belongs in dedicated
language-modeling modules such as `gollek-ml-byte-latent`, with reuse of
shared core/runtime pieces where appropriate.

## Why It Is Separate

- the model operates on byte-native inputs rather than token-only pipelines
- the architecture introduces byte-latent encoder/decoder concerns
- the trainer and runner paths should evolve independently from diffusion OPD

## Current Code Direction

The first concrete package root is:

- `gollek/ml/gollek-ml-byte-latent`

Initial Java contracts include:

- `ByteSequenceBatch`
- `ByteSequenceCollator`
- `ByteSequenceWindowBatch`
- `TextByteSequenceDataset`
- `ByteLatentTrainerConfig`
- `ByteLatentTrainingPlan`
- `ByteLatentTrainerSupport`
- `ByteLatentTrainer`
- `ByteLatentTrainerSession`
- `ByteLatentState`
- `ByteLatentModelSpec`
- `ByteLatentModel`
- `ByteLatentForwardPass`
- `ByteLatentGenerationResult`
- `ReferenceByteLatentModel`
- `ByteLatentEncoder`
- `ByteLatentDecoder`
- `ReferenceByteLatentMixer`
- `ReferenceByteLatentProjection`
- `ReferenceByteLatentOutputHead`
- `ByteLatentTransformerBlock`
- `ByteLatentModelFamily`

## Paper Citation

- Julie Kallini, Artidoro Pagnoni, Tomasz Limisiewicz, Gargi Ghosh, Luke
  Zettlemoyer, Christopher Potts, Xiaochuang Han, and Srinivasan Iyer.
  **Fast Byte Latent Transformer**. `arXiv:2605.08044v1`, 2026.

## Current Data Flow Primitive

The next step after raw byte batches is causal language-model packing.

`ByteSequenceCollator.causalLanguageModeling(...)` converts raw byte sequences
into:

- padded `inputIds`
- shifted `targetIds`
- attention masks

This gives Gollek a byte-native training batch shape before the heavier
trainer and runner modules arrive.

## Current Inference Primitive

`ByteLatentModel` now exposes a minimal executable inference surface:

- `predictNextToken(int[])`
- `predictNextTokens(int[], topK)`
- `generate(int[], maxNewTokens)`

`ByteLatentPreviewFormatter.nextTokensPreview(...)` provides the shared compact
preview encoding used by the current byte-latent inference demos and persisted
train-infer report artifacts.

`ReferenceByteLatentModel` provides the first deterministic implementation of
that surface. It now routes batches through a concrete reference
encode -> latent-mix -> latent-project -> latent-transform -> decode -> output-head pipeline
using `ReferenceByteLatentEncoder`, `ReferenceByteLatentMixer`,
`ReferenceByteLatentProjection`, `ReferenceByteLatentDecoder`, and
`ReferenceByteLatentOutputHead`, so the module is starting to look more like a
real byte-latent architecture instead of a purely direct token transform.

## Current Dataset Bridge

`TextByteSequenceDataset` is the first ingestion bridge for byte-latent work.
It can load UTF-8 text lines, expose them as byte sequences, and emit
`ByteSequenceBatch` slices that feed directly into
`ByteSequenceCollator.causalLanguageModeling(...)`.

## Current Trainer Prep Surface

`ByteLatentTrainerConfig` and `ByteLatentTrainerSupport.plan(...)` provide the
first trainer-facing API for this family.

That lets Gollek build deterministic trainer-ready batches from:

- raw UTF-8 text lines
- byte batches
- packed causal-LM windows

without coupling byte-latent work to the diffusion or generic trainer stacks
too early.

## Current Executable Trainer Surface

`ByteLatentTrainer.builder()` now turns that prep surface into an executable
session. The current implementation is intentionally lightweight:

- builds trainer-ready batches from the dataset/config pair
- iterates epochs and batches deterministically
- accepts a pluggable batch-loss evaluator
- exposes byte-latent lifecycle listener hooks
- writes lightweight summary and manifest artifacts when `checkpointDir` is set
- writes `byte-latent-history.csv` with one row per completed epoch
- writes `byte-latent-report.json` with summary, history, and artifact paths
- can resume epoch/best-loss/global-step state from those artifacts when
  `resumeFromCheckpoint` is enabled, including the persisted history timeline
- exposes compact `history:` selectors for terminal queries such as
  `history:summary`, `history:lastLoss`, and `history:sort=-trainLoss:top=3`
- emits a `TrainingSummary` with byte-latent metadata

That gives the byte-latent family its first runnable training session contract
without pretending the full optimization/runtime stack is already finished.

## Repository References

- `/gollek/docs/FAST_BYTE_LATENT_TRANSFORMER_INTEGRATION_PLAN.md`
- `/gollek/ml/gollek-ml-byte-latent/README.md`
- `/gollek/examples/jbang/trainer/trainer_byte_latent_history_inspector.java`

Related docs:

- [Byte-Latent Docs](/docs/framework/byte-latent-docs)
- [Byte-Latent Inspector Reference](/docs/framework/byte-latent-selector-reference)
- [Gollek Framework](/docs/framework/)

## Terminal Inspection

Gollek now has a small JBang entrypoint for byte-latent checkpoint history:

`trainer_byte_latent_history_inspector.java`

And an end-to-end checkpoint producer:

`trainer_byte_latent_demo.java`

And a matching resume walkthrough:

`trainer_byte_latent_resume_demo.java`

And a tiny inference walkthrough:

`trainer_byte_latent_infer_demo.java`

And a combined train-then-infer walkthrough:

`trainer_byte_latent_train_infer_demo.java`

It also writes `train-infer-report.json` with a stable top-level `reportVersion`
schema marker plus machine-readable training and
inference sections, including both `nextTokens` and persisted
`nextTokensPreview`, plus persisted top-level `overview`, `overviewCi`, `status`,
`statusSummary`, `commands`, `commandsCi`, `selectors`, `selectorsCi`,
`inspectfields`, `inspectfieldsCi`, `artifactSummary`, and `artifactSummaryLine`.

`trainer_byte_latent_train_infer_inspector.java` reads that report from a
checkpoint directory or direct file path and supports compact selectors such as
`reportVersion`, `artifactSummary`, `artifactSummaryLine`, `overview`, `overview:ci`, `training`, `inference`, `nextToken`, `nextTokens`,
`nextTokensPreview`,
`generatedText`, `combinedText`, `commands`, `commands:ci`, `selectors`,
`selectors:ci`, `inspectfields`, `inspectfields:ci`, `statusSummary`, `status`,
`health`, and `ci`.

`trainer_byte_latent_train_infer_compare_inspector.java` compares two of those
reports and supports workflow-style selectors such as `overview`, `runs`,
`status`, `health`, `ci`, `left`, `right`, and `delta:*` selectors like
`delta:latestTrainLoss`, `delta:nextToken`, `delta:nextTokens`,
`delta:nextTokensPreview`,
`delta:nextTokensCount`, and `delta:combinedText`.
Those direct compare outputs now also include `reportVersion` plus
`leftReportVersion` / `rightReportVersion` so live compares and exported
compare bundles expose the same schema-version signal.
Direct compare mode now also supports a compact structured `compareSummary`
object alongside the one-line `compareSummaryLine`.
Direct compare mode now also supports `comparison` as the shared full
comparison block that now matches the exported bundle manifest’s
`comparison` structure.
Direct compare mode now also supports `selectors` and `selectors:ci` so live
two-report comparisons can advertise their most useful follow-up queries.
Direct compare mode now also supports `inspectfields` and `inspectfields:ci`
so live two-report comparisons can advertise their stable machine-readable
field surface too.
Direct compare mode now also supports `artifactSummary` and
`artifactSummaryLine` so live two-report comparisons expose the same compact
dashboard shape as exported compare bundles.
Direct compare mode now also supports `commands` and `commands:ci` so live
two-report comparisons can advertise their recommended query commands too.
That standalone compare result JSON can now be reopened directly with
`resultSummary` and `resultSummaryLine` for compact artifact-level follow-up.
It also supports `resultCommands` / `resultCommands:ci`, `resultSelectors` /
`resultSelectors:ci`, and `resultFields` / `resultFields:ci` as more explicit
artifact-centric aliases for the same standalone discovery surfaces.
It also supports `resultOverview` / `resultOverview:ci` and `resultHealth` /
`resultHealth:ci` as artifact-centric overview and status aliases for
reopened standalone compare-result files.
It also supports `resultManifest` / `resultManifest:ci` as explicit
artifact-centric full-payload aliases for reopened standalone compare-result
files.
It also supports `resultComparison` / `resultComparison:ci` as explicit
artifact-centric compare-payload aliases for reopened standalone
compare-result files.
It also supports `resultPayloads` / `resultPayloads:ci` as explicit
artifact-centric source-report reference aliases for reopened standalone
compare-result files.
It also supports `resultSources` / `resultSources:ci` as a more
conversational alias family for the same reopened standalone source-report
reference surface.
It also supports `resultAliases` / `resultAliases:ci` as a compact alias
discovery surface for reopened standalone compare-result files.
`resultCommands` / `resultCommands:ci` now prefer a dedicated alias-oriented
reopened-result command surface instead of falling back to the older
live-compare command map.
`resultSelectors` / `resultSelectors:ci` now prefer a dedicated
alias-oriented reopened-result selector surface instead of falling back to
the older live-compare selector map.
`resultFields` / `resultFields:ci` now prefer a dedicated reopened-result
field-discovery surface that describes the standalone result artifact schema
directly.
Standalone `result=standard` exports now also persist top-level
`resultAliases` / `resultAliasesCi` alongside `resultCommands`,
`resultSelectors`, and `resultFields`, so the reopened-result discovery
family is explicit in the artifact contract itself.
Standalone `result=standard` exports now also persist top-level
`resultOverview` / `resultOverviewCi`, `resultManifest` /
`resultManifestCi`, and `resultComparison` / `resultComparisonCi`, so the
main reopened-result alias surfaces are explicitly present in the artifact
contract itself.
Standalone `result=standard` exports now also persist top-level
`resultStatus` / `resultStatusCi` and `resultHealth` / `resultHealthCi`, so
the artifact-centric status and health alias surfaces are explicitly present
in the artifact contract itself.
Standalone `result=standard` exports now also persist top-level
`resultDashboard` / `resultDashboardCi`, so the main reopened-result summary
surfaces are available through one explicit high-signal block.
Standalone `result=standard` exports now also persist top-level
`resultDashboardFields` / `resultDashboardFieldsCi`, so the dashboard can
advertise its embedded summary surfaces without requiring raw JSON
inspection.
Standalone `result=standard` exports now also persist top-level
`resultDashboardCommands` / `resultDashboardCommandsCi`, so the dashboard
can advertise the most useful embedded follow-up reopen commands directly.
Standalone `result=standard` exports now also persist top-level
`resultDashboardAliases` / `resultDashboardAliasesCi`, so the dashboard can
advertise the preferred alias family for each embedded summary.
Standalone `result=standard` exports now also persist top-level
`resultDashboardSelectors` / `resultDashboardSelectorsCi`, so the dashboard
can advertise the preferred selector-level follow-ups for its embedded
summaries directly.
Standalone `result=standard` exports now also persist top-level
`resultDashboardOverview` / `resultDashboardOverviewCi`, so the dashboard
has its own artifact-centric compact overview alias in addition to the
broader result-level overview surface.
Standalone `result=standard` exports now also persist top-level
`resultDashboardStatus` / `resultDashboardStatusCi`, so the dashboard has
a matching artifact-centric status alias in addition to the broader
result-level status and health surfaces.
Standalone `result=standard` exports now also persist top-level
`resultDashboardHealth` / `resultDashboardHealthCi`, so the dashboard has
the matching artifact-centric health alias that completes the dashboard
overview/status/health trio.
Standalone `result=standard` exports now also persist top-level
`resultDashboardSummary` / `resultDashboardSummaryCi`, so the dashboard
has one explicit artifact-centric summary alias that rolls overview,
status, and health together.
Standalone `result=standard` exports now also persist top-level
`resultDashboardManifest` / `resultDashboardManifestCi`, so the dashboard
family also has an explicit artifact-centric full payload alias that
complements summary, overview, status, and health.
Standalone `result=standard` exports now also persist top-level
`resultDashboardFamilyCommands` / `resultDashboardFamilyCommandsCi` and
`resultDashboardFamilySelectors` / `resultDashboardFamilySelectorsCi`, so
the dashboard subtree can be browsed without mixing in the broader
result-level entries.
Standalone `result=standard` exports now also persist top-level
`resultDashboardFamilyFields` / `resultDashboardFamilyFieldsCi`, so the
dashboard subtree has matching field discovery alongside its
dashboard-only commands and selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTree` / `resultDashboardTreeCi`, so the whole dashboard
subtree can be inspected as one compact hierarchical summary.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeFields` / `resultDashboardTreeFieldsCi`, so the
dashboard tree can advertise its embedded sections directly instead of
only returning the aggregated tree payload.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCommands` / `resultDashboardTreeCommandsCi`, so the
dashboard tree can advertise its preferred follow-up reopen commands
directly alongside its embedded-section summary.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeSelectors` / `resultDashboardTreeSelectorsCi`, so the
dashboard tree can advertise its preferred follow-up selectors directly
alongside its embedded-section and command summaries.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeManifest` / `resultDashboardTreeManifestCi`, so the
dashboard tree has an explicit full-payload alias alongside its compact
summary entrypoint.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeSummary` / `resultDashboardTreeSummaryCi`, so the
dashboard tree has an explicit compact summary alias alongside its full
manifest-style entrypoint.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeDashboard` / `resultDashboardTreeDashboardCi`, so the
embedded dashboard branch can be reopened directly instead of only through
the full tree payload.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreePaths` / `resultDashboardTreePathsCi`, so the
dashboard tree can advertise its main reopen selectors in one compact
artifact-centric navigation block.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalog` / `resultDashboardTreeCatalogCi`, so paths,
children, and counts can be reopened together through one compact tree
navigation summary.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogCommands` /
`resultDashboardTreeCatalogCommandsCi`, so the tree catalog can
advertise its main follow-up reopen commands directly.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogSelectors` /
`resultDashboardTreeCatalogSelectorsCi`, so the tree catalog can
advertise its main follow-up selectors directly.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogManifest` /
`resultDashboardTreeCatalogManifestCi`, so the tree catalog gets an
explicit full-payload alias alongside its compact summary.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogSummary` /
`resultDashboardTreeCatalogSummaryCi`, so the tree catalog gets an
explicit compact-summary alias alongside its manifest alias.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogOverview` /
`resultDashboardTreeCatalogOverviewCi`, so the tree catalog gets a
friendlier artifact-centric overview alias alongside its structural names.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummary` /
`resultDashboardTreeCatalogTreeSummaryCi`, so the tree catalog can reopen
one compact summary that rolls its path, child, and count summaries together.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryFields` /
`resultDashboardTreeCatalogTreeSummaryFieldsCi`, so the compact tree
summary can advertise its embedded `paths`, `children`, and `counts` blocks.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryCommands` /
`resultDashboardTreeCatalogTreeSummaryCommandsCi`, so the compact tree
summary can advertise its preferred follow-up commands.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummarySelectors` /
`resultDashboardTreeCatalogTreeSummarySelectorsCi`, so the compact tree
summary can advertise its preferred follow-up selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryAliases` /
`resultDashboardTreeCatalogTreeSummaryAliasesCi`, so the compact tree
summary can advertise its friendly follow-up alias names.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryDiscovery` /
`resultDashboardTreeCatalogTreeSummaryDiscoveryCi`, so the compact tree
summary can expose one tiny discovery header for its fields, commands,
selectors, and aliases.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryLineage` /
`resultDashboardTreeCatalogTreeSummaryLineageCi`, so the compact tree
summary can advertise its parent result, dashboard, tree, and catalog
ancestry.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryNavigation` /
`resultDashboardTreeCatalogTreeSummaryNavigationCi`, so the compact tree
summary can expose one combined "where am I and where can I go next"
navigation header.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryBreadcrumbs` /
`resultDashboardTreeCatalogTreeSummaryBreadcrumbsCi`, so the compact tree
summary can expose a log-friendly breadcrumb path derived from lineage.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummarySitemap` /
`resultDashboardTreeCatalogTreeSummarySitemapCi`, so the compact tree
summary family can expose a machine-readable endpoint index.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryIndex` /
`resultDashboardTreeCatalogTreeSummaryIndexCi`, so the compact tree
summary family can expose a grouped `self`, `discovery`, and `leaves`
endpoint index.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistry` /
`resultDashboardTreeCatalogTreeSummaryRegistryCi`, so the compact tree
summary family can expose one registry that combines grouped and flat
endpoint counts.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryFields` /
`resultDashboardTreeCatalogTreeSummaryRegistryFieldsCi`, so the compact
tree summary registry can advertise its `index`, `sitemap`, and
`breadcrumbs` blocks.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryCommands` /
`resultDashboardTreeCatalogTreeSummaryRegistryCommandsCi`, so the compact
tree summary registry can advertise direct commands for its registry,
fields, index, sitemap, and breadcrumbs views.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistrySelectors` /
`resultDashboardTreeCatalogTreeSummaryRegistrySelectorsCi`, so the compact
tree summary registry can advertise selector IDs for its registry, fields,
index, sitemap, and breadcrumbs views.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryAliases` /
`resultDashboardTreeCatalogTreeSummaryRegistryAliasesCi`, so the compact
tree summary registry can advertise friendly aliases for its registry,
fields, index, sitemap, and breadcrumbs views.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryDiscovery` /
`resultDashboardTreeCatalogTreeSummaryRegistryDiscoveryCi`, so the compact
tree summary registry can expose one discovery header for its fields,
commands, selectors, and aliases.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryNavigation` /
`resultDashboardTreeCatalogTreeSummaryRegistryNavigationCi`, so the compact
tree summary registry can expose its current selector, parent tree-summary
navigation, and registry discovery sections.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryBreadcrumbs` /
`resultDashboardTreeCatalogTreeSummaryRegistryBreadcrumbsCi`, so the compact
tree summary registry has its own log-friendly breadcrumb path beneath the
broader tree-summary breadcrumb.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistrySitemap` /
`resultDashboardTreeCatalogTreeSummaryRegistrySitemapCi`, so the compact tree
summary registry has its own flat endpoint list for registry-local discovery.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryIndex` /
`resultDashboardTreeCatalogTreeSummaryRegistryIndexCi`, so the compact tree
summary registry has grouped self, metadata, and discovery endpoint counts.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryOverview` /
`resultDashboardTreeCatalogTreeSummaryRegistryOverviewCi`, so the compact
tree summary registry has a one-stop summary of index, sitemap, and breadcrumb
state.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryStatus` /
`resultDashboardTreeCatalogTreeSummaryRegistryStatusCi`, so the compact tree
summary registry can report whether grouped and flat endpoint counts stay in
sync.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryHealth` /
`resultDashboardTreeCatalogTreeSummaryRegistryHealthCi`, so the compact tree
summary registry has a health-facing view over the registry status signal.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistrySummary` /
`resultDashboardTreeCatalogTreeSummaryRegistrySummaryCi`, so the compact tree
summary registry has one compact rollup over overview, status, and health.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryManifest` /
`resultDashboardTreeCatalogTreeSummaryRegistryManifestCi`, so the compact tree
summary registry has a manifest-style wrapper around summary, command, and
selector counts.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryEnvelope` /
`resultDashboardTreeCatalogTreeSummaryRegistryEnvelopeCi`, so the compact tree
summary registry has one operational envelope over manifest, discovery,
navigation, and breadcrumbs.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistrySnapshot` /
`resultDashboardTreeCatalogTreeSummaryRegistrySnapshotCi`, so the compact tree
summary registry has one stable snapshot over envelope, index, and sitemap
counts.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryAudit` /
`resultDashboardTreeCatalogTreeSummaryRegistryAuditCi`, so the compact tree
summary registry has an explicit pass/fail audit over snapshot health and
endpoint balance.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryReport` /
`resultDashboardTreeCatalogTreeSummaryRegistryReportCi`, so the compact tree
summary registry has a report-facing wrapper around audit and snapshot status.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklist` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistCi`, so the compact tree
summary registry exposes report readiness as individual checklist items.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummary` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummaryCi`, so the
compact tree summary registry has a named checklist summary alias.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistStatus` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistStatusCi`, so the compact
tree summary registry has a status-facing checklist readiness alias.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistHealth` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistHealthCi`, so the compact
tree summary registry has a health-facing checklist readiness alias.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistBadge` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistBadgeCi`, so the compact
tree summary registry has a one-line checklist badge alias for UI status
consumers.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistCard` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistCardCi`, so the compact
tree summary registry has a card-shaped checklist readiness alias for dashboard
panels.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistPanel` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistPanelCi`, so the compact
tree summary registry has a dashboard panel payload that groups card readiness,
badge status, and details navigation.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistWidget` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistWidgetCi`, so the compact
tree summary registry has a tiny embeddable checklist widget payload for status
tiles.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistTile` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistTileCi`, so the compact
tree summary registry has a display-oriented checklist tile payload with tone,
value, and action selector fields.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistMetric` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistMetricCi`, so the compact
tree summary registry has a numeric checklist readiness metric for dashboard
chart consumers.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistTrend` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistTrendCi`, so the compact
tree summary registry has a trend-ready checklist readiness series for
dashboard history consumers.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistGauge` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistGaugeCi`, so the compact
tree summary registry has a display-ready checklist readiness gauge for
dashboard widget consumers.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummaryCard` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummaryCardCi`, so the
compact tree summary registry has a one-fetch checklist readiness card for
dashboard overview consumers.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistActionBar` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistActionBarCi`, so the
compact tree summary registry has ready-made checklist action links for
dashboard button consumers.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboard` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardCi`, so the
compact tree summary registry has a one-fetch checklist dashboard section with
summary and action selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardManifest` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardManifestCi`, so
checklist dashboard clients can inspect the section schema and companion
selectors without hardcoding them.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSnapshot` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSnapshotCi`, so
checklist dashboard clients can capture manifest and dashboard state in one
compact snapshot.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardAudit` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardAuditCi`, so
checklist dashboard clients can read a compact audit verdict over the latest
dashboard snapshot.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReport` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReportCi`, so
checklist dashboard clients can fetch dashboard, manifest, snapshot, and audit
selectors through one report surface.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardEnvelope` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardEnvelopeCi`, so
checklist dashboard clients can transport the report with stable envelope
metadata.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardPackage` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardPackageCi`, so
checklist dashboard clients can deliver the envelope/report pair as one packaged
payload.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardBundle` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardBundleCi`, so
checklist dashboard clients can fetch package metadata and detail selectors as
one self-contained bundle.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDelivery` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDeliveryCi`, so
checklist dashboard clients can route the bundle through stable selector
transport metadata.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReceipt` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReceiptCi`, so
checklist dashboard clients can acknowledge the delivered bundle with a compact
receipt surface.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardArchive` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardArchiveCi`, so
checklist dashboard clients can retain a stable archived record of the delivered
receipt chain.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardLedger` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardLedgerCi`, so
checklist dashboard clients can expose the archived receipt chain as a compact
ledger entry.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardHistory` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardHistoryCi`, so
checklist dashboard clients can group ledger, archive, receipt, and delivery
pointers into one compact history surface.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTimeline` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTimelineCi`, so
checklist dashboard clients can read the delivered history chain as an ordered
compact timeline.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTrace` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTraceCi`, so
checklist dashboard clients can debug the timeline through a compact trace path.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTelemetry` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTelemetryCi`, so
checklist dashboard clients can observe the trace through a compact telemetry
summary.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardObservation` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardObservationCi`,
so checklist dashboard clients can present telemetry as a compact observed state
surface.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSignal` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSignalCi`, so CI
clients can read the observed state as a tiny continue/review signal.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardInsight` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardInsightCi`, so
CI logs can show a short human-readable signal explanation.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardRecommendation` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardRecommendationCi`,
so CI clients can consume a direct priority/action recommendation.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDecision` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDecisionCi`, so
gates can consume a final allow/block decision with a blocking reason.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGate` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateCi`, so
shell scripts can consume a tiny open/closed gate with an exit code.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateLineCi`, so
shell logs can print the gate as one compact status line.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateJson` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateJsonCi`, so
structured CI clients can read the minimal gate fields as JSON.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateEnv` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateEnvCi`, so
CI env-file steps can consume shell-friendly gate assignments.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateMarkdown` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateMarkdownCi`,
so PR comments and CI summaries can show the gate as compact Markdown.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateSummary` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateSummaryCi`,
so callers can fetch JSON, line, env, and Markdown gate renderings together.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateArtifact` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateArtifactCi`,
so CI upload steps can capture gate renderings with result metadata and selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadManifest` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadManifestCi`,
so CI upload steps can discover suggested gate artifact filenames and labels.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadScript` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadScriptCi`,
so CI jobs can generate gate artifact files from the upload manifest selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadReadme` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadReadmeCi`,
so uploaded gate artifact bundles can include a human-readable file inventory.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadBundle` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadBundleCi`,
so CI callers can fetch the gate artifact, manifest, script, and README together.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadIndex` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadIndexCi`,
so callers can discover the gate upload selectors from one compact index.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesIndex` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesIndexCi`,
so CI archive jobs can list upload filenames, content types, selectors, and commands without parsing the full manifest.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesLineCi`,
so logs and notifications can show upload filenames from one compact line.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesJsonLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesJsonLineCi`,
so structured log collectors can read upload filenames as one JSON line.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesCsvLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesCsvLineCi`,
so spreadsheet and archive jobs can read upload filenames as one CSV row.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesTsvLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesTsvLineCi`,
so spreadsheet and archive jobs can read upload filenames as one TSV row.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesEnv` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesEnvCi`,
so shell and CI jobs can source upload filenames without parsing CSV or TSV.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesMarkdown` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesMarkdownCi`,
so release comments and review pages can show upload filenames as a Markdown table.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksums` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCi`,
so archive jobs can verify upload file payloads with deterministic SHA-256 metadata.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLineCi`,
so CI logs can print upload file integrity metadata without parsing JSON.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMarkdown` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMarkdownCi`,
so release comments can show upload file integrity metadata as a Markdown table.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEnv` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEnvCi`,
so shell and CI jobs can source upload file checksum metadata directly.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsJsonLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsJsonLineCi`,
so structured log collectors can ingest upload file checksum metadata as JSONL.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCsvLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCsvLineCi`,
so spreadsheet and archive jobs can ingest upload file checksum metadata as CSV.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTsvLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTsvLineCi`,
so tab-safe reports can ingest upload file checksum metadata as TSV.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummary` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummaryCi`,
so dashboards can read upload checksum counts, byte totals, and preview filenames without parsing line formats.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsBadge` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsBadgeCi`,
so dashboards and notifications can render a tiny upload checksum status label.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCard` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCardCi`,
so UI tiles can render upload checksum badge, counts, byte totals, and drill-down selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsPanel` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsPanelCi`,
so dashboards can render a richer upload checksum panel with card data and drill-down selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsWidget` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsWidgetCi`,
so dashboards can embed a compact upload checksum widget with badge, metrics, preview filenames, and links.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTile` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTileCi`,
so dashboards can embed a tiny upload checksum tile with value, caption, and drill-down selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMetric` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMetricCi`,
so dashboards can ingest numeric upload checksum file and byte metrics with drill-down selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTrend` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTrendCi`,
so dashboards can ingest trend-ready upload checksum values with baseline, delta, and drill-down selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsGauge` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsGaugeCi`,
so dashboards can render a gauge-ready upload checksum status with ratio, percent, state, and selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummaryCard` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummaryCardCi`,
so dashboards can render a compact upload checksum card with gauge, trend, headline fields, and selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsActionBar` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsActionBarCi`,
so dashboards can render upload checksum actions for card, raw checksums, copy formats, and bundle handoff.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMenu` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMenuCi`,
so dashboards can render grouped upload checksum navigation across overview, integrity, log, and handoff selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToolbar` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToolbarCi`,
so dashboards can render compact upload checksum controls for menu, search, filter, card view, and JSONL export.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCommandPalette` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCommandPaletteCi`,
so dashboards can render searchable upload checksum commands with groups, selectors, and keywords.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchIndex` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchIndexCi`,
so dashboards can search upload checksum commands through normalized text entries, selectors, and keywords.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchResults` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchResultsCi`,
so dashboards can validate upload checksum search result rendering with a stable sample query and matches.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsFilterState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsFilterStateCi`,
so dashboards can initialize upload checksum search filters with selected status, groups, and counts.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsViewState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsViewStateCi`,
so dashboards can hydrate one upload checksum UI state with toolbar, filters, selectors, and search results.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEmptyState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEmptyStateCi`,
so dashboards can render a no-match upload checksum fallback with suggestions and recovery actions.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLoadingState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLoadingStateCi`,
so dashboards can render an in-flight upload checksum refresh state with skeleton rows and selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsErrorState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsErrorStateCi`,
so dashboards can render a recoverable upload checksum refresh error with retry and fallback actions.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToastState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToastStateCi`,
so dashboards can render compact success/loading/error checksum notifications with quick selectors.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationCenter` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationCenterCi`,
so dashboards can render grouped checksum notification history with active, unread, and error counts.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationBadge` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationBadgeCi`,
so dashboards can render a compact checksum notification badge with unread and error counts.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanel` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCi`,
so dashboards can render an expandable checksum notification panel with badge, groups, and top rows.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLineCi`,
so CI jobs can print the checksum notification panel status without expanding the full payload.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelJsonLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelJsonLineCi`,
so structured log collectors can ingest checksum notification panel status as one JSONL record.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCsvLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCsvLineCi`,
so spreadsheets can ingest checksum notification panel status as one CSV row.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelTsvLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelTsvLineCi`,
so tab-safe log consumers can ingest checksum notification panel status as one TSV row.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMarkdown` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMarkdownCi`,
so release notes and PR comments can include the checksum notification panel status and top rows.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEnv` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEnvCi`,
so shell jobs can export checksum notification panel status and selector values.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSummaryCard` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSummaryCardCi`,
so dashboards can render a compact checksum notification panel summary card.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelActionBar` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelActionBarCi`,
so dashboards can render checksum notification panel action shortcuts.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMenu` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMenuCi`,
so dashboards can render grouped checksum notification panel navigation.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToolbar` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToolbarCi`,
so dashboards can render checksum notification panel toolbar controls.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCommandPalette` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCommandPaletteCi`,
so dashboards can expose searchable checksum notification panel commands.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchIndex` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchIndexCi`,
so dashboards can index checksum notification panel commands by text, keyword, group, and selector.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchResults` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchResultsCi`,
so dashboards can consume a filtered notification-panel command result set over the search index.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelFilterState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelFilterStateCi`,
so dashboards can carry notification-panel query, group, status, and match-count filter defaults.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelViewState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelViewStateCi`,
so dashboards can render notification-panel search results with toolbar, filters, and selector links.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEmptyState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEmptyStateCi`,
so dashboards can render no-match notification-panel fallbacks with recovery actions.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLoadingState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLoadingStateCi`,
so dashboards can render in-progress notification-panel refresh fallbacks with skeleton rows.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelErrorState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelErrorStateCi`,
so dashboards can render recoverable notification-panel refresh failures with retry actions.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToastState` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToastStateCi`,
so dashboards can render notification-panel success, loading, and retry toasts from one payload.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationCenter` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationCenterCi`,
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationBadge` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationBadgeCi`,
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationLineCi`,
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationJsonLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationJsonLineCi`,
so dashboards can render grouped notification-panel toast history with unread and error counts.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatus` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatusCi`,
so CI jobs can check whether the gate upload bundle is ready from one compact status.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatusLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatusLineCi`,
so shell scripts can read the upload readiness as one stable line.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadEnv` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadEnvCi`,
so CI shells can read upload readiness as env-file variables.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadJsonLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadJsonLineCi`,
so structured log collectors can read upload readiness as one JSON line.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadCsvLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadCsvLineCi`,
so CI jobs can archive upload readiness as a compact CSV row.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadTsvLine` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadTsvLineCi`,
so CI jobs can archive upload readiness as a compact TSV row.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDetails` /
`resultDashboardTreeCatalogTreeSummaryRegistryChecklistDetailsCi`, so the
compact tree summary registry has a checklist details view with named checks.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogAliasesSummary` /
`resultDashboardTreeCatalogAliasesSummaryCi`, so the tree catalog alias
companion gets a named compact-summary alias alongside its base rows and
compact summary surface.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogChildrenSummary` /
`resultDashboardTreeCatalogChildrenSummaryCi`, so the tree catalog child
companion gets the same named compact-summary path as the catalog command,
selector, and alias companions.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogCountsSummary` /
`resultDashboardTreeCatalogCountsSummaryCi`, so the tree catalog counts
companion gets the same named compact-summary path as the catalog command,
selector, alias, and child companions.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogCommandsSummary` /
`resultDashboardTreeCatalogCommandsSummaryCi`, so the tree catalog's
command companion gets its own explicit compact-summary alias.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogSelectorsSummary` /
`resultDashboardTreeCatalogSelectorsSummaryCi`, so the tree catalog's
selector companion gets its own explicit compact-summary alias.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogAliases` /
`resultDashboardTreeCatalogAliasesCi`, so the tree catalog can
advertise its artifact-centric alias family directly.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCatalogFields` / `resultDashboardTreeCatalogFieldsCi`,
so the tree catalog can advertise its embedded summary blocks directly.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeChildren` / `resultDashboardTreeChildrenCi`, so the
dashboard tree can advertise its main child branches directly instead of
only through the broader field summary.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeCounts` / `resultDashboardTreeCountsCi`, so the
dashboard tree can expose its child and discovery totals directly in one
compact machine-friendly block.
Standalone `result=standard` exports now also persist top-level
`resultDashboardTreeAliases` / `resultDashboardTreeAliasesCi`, so the
dashboard tree can advertise its preferred alias family alongside its
field, command, and selector summaries.
It also supports `resultStatus` / `resultStatus:ci` as a matching
artifact-centric status alias family for reopened standalone compare-result
files.
It also persists top-level `commands` / `commandsCi`, `selectors` /
`selectorsCi`, and `inspectfields` / `inspectfieldsCi` so the exported compare
result has the same compact discovery vocabulary as the bundle path.
Direct compare mode now also supports `compareSummaryLine` as a one-line
shell-friendly summary to match the exported compare bundle’s
`comparisonSummary`.
It also supports `bundle=standard` to export a small compare bundle with
`overview.json`, `runs.json`, `delta-nextTokens.json`,
`delta-nextTokensPreview.json`,
`delta-nextTokensCount.json`, other key
`delta-*.json` files, and `manifest.json`.
The same inspector can reopen those exported bundle directories with
`bundleSummary`, `comparisonSummary`, `bundleFiles`, `bundleManifest`, `file:<name>`, and
`loadfile:<section>`. It also supports `commands` and `commands:ci` for
recommended compare-bundle follow-up selectors, plus `inspectfields` and
`inspectfields:ci` for machine-readable field discovery. It also supports `bundleHealth` and
`filesSummary:by=section|format` for compact compare-bundle integrity and
file-count summaries. Exported compare bundle manifests also persist those
recommendations in top-level `commands` and `commandsCi`, alongside the legacy
`inspectCommands` and `inspectCommandsCi`, plus top-level shortcuts in
`inspectBundleStatus`, `inspectBundleHealth`,
`inspectBundleOverview`, `inspectBundleFiles`, and `inspectBundleLoadfile`.
They also persist field discovery in top-level `inspectfields` and
`inspectfieldsCi`, alongside the legacy `inspectFields` and
`inspectFieldsCi`.
They also persist `artifactSummary` and `artifactSummaryLine` for a compact
bundle-dashboard block and one-line summary.
They now also carry a stable top-level `reportVersion` plus
`leftReportVersion` / `rightReportVersion` source markers for schema-aware
automation.
They now also expose `selectors` and `selectors:ci` so bundle consumers get a
compact direct-query discovery surface without deriving it from the larger
manifest fields.
They also include a compact `comparison` block plus top-level
`leftNextTokensPreview`, `rightNextTokensPreview`, and
`nextTokensPreviewChanged` fields for lightweight automation.
They also include a one-line `comparisonSummary` string for simple CI or shell
output.
They also expose top-level selector hints in
`inspectBundleSummarySelector`, `inspectBundleFilesSummarySelector`,
`inspectBundleNextTokensSelector`,
`inspectBundleNextTokensPreviewSelector`,
`inspectBundleNextTokensCountSelector`,
`inspectBundleMissingFilesSelector`, and
`inspectBundleMissingFilesTopSelector`.
They also expose a compact status block in `status`, plus mirrored top-level
scalars in `healthStatus`, `missingFileCount`, and `okFileCount`. They also
expose `statusSummary` as a human-readable one-line health/status string.
`filesSummary`
also supports `sort=-count` and `top=<n>`
for trimmed compare-bundle rollups. `bundleHealth` also supports
`focus=files|sections|formats|all`, `sort=...`, and `top=<n>` for trimmed
health diagnostics. `bundleStatus` and `bundleHealth:ci` provide one-line
compare-bundle health checks for CI or quick terminal scans. `bundleOverview`
and `bundleOverview:ci` provide a more consistent compare-bundle overview path
alongside the workflow bundle inspector. `loadfile:` also supports
`section=<section>`, `pick=first|last`, and `index=<n>` so repeated compare
bundle sections can be reopened deterministically. `bundleFiles` also supports
filtered listing through `files:section=...`, `files:name=...`,
`files:format=...`, `sort=...`, and `top=<n>`. `bundleHealth:focus=files`
also supports `section=...`, `name=...`, `format=...`, and
`status=ok|missing` for filtered per-file health diagnostics. Those same
filters also apply before grouped `bundleHealth:focus=sections|formats`
rollups.

Both scripts now print `status`, `health`, and `ci` follow-up inspector
commands automatically at the end of a run.

And a one-command smoke helper:

`run_byte_latent_smoke.sh`

And a matching one-command resume smoke helper:

`run_byte_latent_resume_smoke.sh`

Both smoke helpers now lead with `status`, `health`, and `ci` inspector checks
before the more detailed history queries.

The unified workflow launcher now does the same in its final suggested
commands, surfacing `status`, `health`, and `ci` before the longer inspector
forms, and leading with `status` and `health` across checkpoint, manifest, and
bundle checks. It now also surfaces `commands:summary` first on the
workflow-manifest side for the compact command rollup. Each fresh/resume run
summary also prints `runcommands:<run>` alongside `commands:ci:mode=<run>` for
the matching single-line manifest-driven CI follow-up. That workflow-manifest block now also includes
`runcommands`, `runcommands:ci`, `runcommands:fresh`, and `runcommands:resume`
as the shortest discovery and per-run aliases, and `runcommands:all` as the
concise multi-run alias summary. The launcher also prints `inspectfields`
there as the full machine-readable field-discovery selector, and
`inspectfields:ci` as the compact machine-readable field-discovery summary.
The launcher also prints `runfields:ci` as the compact per-run
field-discovery summary, and `runfields` as the per-run field-discovery
selector.
Each fresh/resume run summary also prints `runfields:ci` as the compact
per-run field-discovery hint.
Each fresh/resume run summary also prints `runcommands:ci` as the generic
compact discovery hint for available per-run aliases.
Each fresh/resume run summary also prints `runcommands:all` as the concise
multi-run alias overview path.

And a unified workflow launcher:

`run_byte_latent_workflow.sh`

In `full` mode it now finishes with a compact summary covering both the fresh
and resumed checkpoint runs, including history row counts and inspector-ready
commands.

The launcher also writes a small workflow manifest JSON so CI or follow-up
scripts can consume the same fresh/resume run details without parsing terminal
text.

That manifest now also records `workflowBundleDir` and
`workflowBundleStatus`, so downstream tools can discover whether the bundle was
materialized and where it lives without reconstructing the path.
It also records `inspectWorkflowStatus`, `inspectWorkflowHealth`,
`inspectBundleStatus`, and `inspectBundleHealth`, so automation can reuse the
same recommended status and health entrypoints the launcher prints for humans.
Each per-run manifest entry now also records `inspectWorkflowCommands` for the
single-line `commands:ci:mode=<run>` workflow follow-up.
Each per-run manifest entry now also records `inspectRunCommands` for the
shortest `runcommands:<run>` workflow follow-up.
Each per-run manifest entry now also records `inspectRunAll` for the concise
multi-run `runcommands:all` workflow overview path.
Each per-run manifest entry now also records `inspectRunFields` for the
compact `inspectfields:ci` machine-readable field-discovery hint.

In `full` mode it now also materializes the workflow bundle automatically, so
the printed `loadfile:` examples point at a real bundle directory immediately.

Gollek now also includes a matching workflow-manifest inspector so those JSON
artifacts can be queried from the terminal with selectors like `runs`,
`workflowBundleDir`, `run:fresh`, `historyRows`, and `delta:historyRows`.

When the manifest reports `workflowBundleStatus=materialized`, that same
inspector can also jump straight into the bundle with selectors like
`bundleManifest`, `bundleFiles`, `bundleSummary`, and
`bundleLoadfile:section=runs`.

For a compact terminal-friendly bundle check, `bundleOverview` summarizes the
bundle path, status, availability, file count, and health in one small view.
It also supports `focus=health`, `focus=files`, and `focus=all`.
Plain `text` output is optimized for terminal scanning, while `json` remains
available for automation.
For CI logs, `summary=short` collapses the text output to a single line.
`bundleOverview:ci` is the shorthand alias for the recommended CI-style
overview check.
`status` is the shortest neutral alias when you just want one concise
bundle-status line, and `bundleStatus` remains available as the explicit form.
`health` is the matching shortest direct-health alias when you want the
bundle-health view first.
`commands` renders the manifest's recommended inspector commands as a small
table, with optional filters like `scope=workflow` and `mode=fresh`.
`commands:summary` and `commands:ci` collapse that to the most important
workflow, bundle, and fresh/resume checkpoint status-health commands.
`commands:ci:mode=<run>` turns that into a single-line per-run compact command
rollup for `fresh` or `resume`.
`runcommands` lists the available per-run aliases from the manifest.
`runcommands:all` expands to the concise multi-run alias summary.
`runcommands:summary` and `runcommands:ci` collapse that discovery view into
compact manifest-level run-alias summaries.
`runcommands:<run>` is the shortest alias for that per-run manifest rollup.
`runfields` lists the per-run `inspectRunFields`, `inspectRunCommands`, and
`inspectRunAll` follow-up aliases together.
`runfields:summary` and `runfields:ci` collapse that per-run field-discovery
view into compact manifest-level summaries.
`runfields:<run>` isolates that per-run field-discovery row for one run mode.
`inspectfields` lists which machine-readable inspector-command fields are
present at the manifest and per-run levels.
`inspectfields:summary` and `inspectfields:ci` collapse that field-discovery
view into compact terminal and CI summaries.
The same one-line path is also available on `bundleHealth`, with `bundleHealth:ci`
as a shorthand alias.

The workflow launcher now prints those manifest-inspector commands directly at
the end of each run, alongside the checkpoint history inspector commands.

It also prints the workflow-bundle export and `loadfile:` commands so the
deeper bundle navigation path is visible immediately after a run completes.

For shareable artifacts, the workflow inspector also supports
`bundle=standard`, which writes overview, runs, and delta views into a single
output directory with its own bundle manifest.

Those exported workflow bundles can then be inspected directly with
`bundleSummary`, `bundleHealth`, `files`, `files:section=<section>`,
`files:name=<name>`, `file:<name>`, and `loadfile:section=<section>`,
similar to the diffusion report bundle flow.

For ordered bundle listings, `files:` also supports `sort=name`,
`sort=section`, and `sort=format`.

For compact bundle rollups, the workflow inspector also supports
`filesSummary:by=section`, `filesSummary:by=format`, `sort=-count`, and
`top=<n>`.

Example invocations:

- `jbang trainer/trainer_byte_latent_demo.java`
- `jbang trainer/trainer_byte_latent_demo.java /tmp/gollek-byte-latent-demo`
- `jbang trainer/trainer_byte_latent_resume_demo.java`
- `jbang trainer/trainer_byte_latent_resume_demo.java /tmp/gollek-byte-latent-resume-demo`
- `jbang trainer/trainer_byte_latent_infer_demo.java`
- `jbang trainer/trainer_byte_latent_infer_demo.java "hi"`
- `jbang trainer/trainer_byte_latent_infer_demo.java "gollek" 6`
- `jbang trainer/trainer_byte_latent_train_infer_demo.java`
- `jbang trainer/trainer_byte_latent_train_infer_demo.java /tmp/byte-latent-train-infer "hi" 4`
- `jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer overview`
- `jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer training`
- `jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer nextToken`
- `jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer combinedText`
- `jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer health`
- `jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer ci`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b overview`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b health`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b delta:latestTrainLoss`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b delta:combinedText`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b bundle=standard json /tmp/byte-latent-train-infer-compare-bundle`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleSummary`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleOverview`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleOverview:ci`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleStatus`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:ci`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle commands`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle commands:ci`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle inspectfields`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle inspectfields:ci`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=files:top=5`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=files:section=runs:sort=status json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=files:status=missing:top=3 json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=sections:format=json json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=formats:section=runs json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=sections:sort=-missingCount json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleFiles json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle files:section=runs:sort=name json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle files:format=json:sort=-name:top=2 json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle filesSummary:by=section:sort=-count:top=3`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle filesSummary:by=format:sort=-count json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle loadfile:overview json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle loadfile:section=runs:pick=last json`
- `jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle loadfile:section=runs:index=0 json`
- `./trainer/run_byte_latent_workflow.sh`
- `./trainer/run_byte_latent_workflow.sh fresh`
- `./trainer/run_byte_latent_workflow.sh resume`
- `./trainer/run_byte_latent_workflow.sh full /tmp/gollek-byte-latent`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json overview`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runs json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json workflowBundleDir`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json workflowBundleStatus`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleOverview`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleOverview:focus=health`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleOverview:focus=files`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleOverview:focus=health:summary=short`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json status`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json health`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleStatus`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleOverview:ci`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleHealth:ci`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleHealth:summary=short`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json commands`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json commands:summary`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json commands:ci`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json commands:ci:mode=fresh`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json inspectfields`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json inspectfields:summary`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json inspectfields:ci`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runcommands`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runcommands:all`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runcommands:summary`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runcommands:ci`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runcommands:fresh`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runfields`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runfields:summary`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runfields:ci`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json runfields:fresh`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json commands:scope=workflow`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json commands:mode=fresh`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleOverview json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleManifest json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleFiles json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleSummary json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundleLoadfile:section=runs json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json delta:historyRows`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /path/to/byte_latent_workflow_manifest.json bundle=standard json /tmp/byte-latent-workflow-bundle`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle bundleSummary json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle bundleHealth json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle files:section=runs json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle files:name=overview.json json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle filesSummary:by=section json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle filesSummary:by=format json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle file:overview.json json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle loadfile:section=runs json`
- `jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle loadfile:section=runs:index=0 json`
- `./trainer/run_byte_latent_smoke.sh`
- `./trainer/run_byte_latent_smoke.sh /tmp/gollek-byte-latent-smoke`
- `./trainer/run_byte_latent_resume_smoke.sh`
- `./trainer/run_byte_latent_resume_smoke.sh /tmp/gollek-byte-latent-resume-smoke`
- `jbang trainer/trainer_byte_latent_history_inspector.java /path/to/checkpoint-dir`
- `jbang trainer/trainer_byte_latent_history_inspector.java /path/to/checkpoint-dir status`
- `jbang trainer/trainer_byte_latent_history_inspector.java /path/to/checkpoint-dir health`
- `jbang trainer/trainer_byte_latent_history_inspector.java /path/to/checkpoint-dir ci`
- `jbang trainer/trainer_byte_latent_history_inspector.java /path/to/checkpoint-dir status:ci`
- `jbang trainer/trainer_byte_latent_history_inspector.java /path/to/checkpoint-dir summary json`
- `jbang trainer/trainer_byte_latent_history_inspector.java /path/to/checkpoint-dir summary:metadata:globalStep`
- `jbang trainer/trainer_byte_latent_history_inspector.java /path/to/checkpoint-dir history:lastLoss`
- `jbang trainer/trainer_byte_latent_history_inspector.java /path/to/checkpoint-dir history:sort=-trainLoss:top=3 json`

## Planned Follow-On Modules

- `gollek-ml-language-core`
- `gollek-ml-byte-io`
- `gollek-runner-byte-latent`
- `gollek-trainer-byte-latent`

## Boundary with DiffusionOPD

DiffusionOPD remains a diffusion-specific training path under
`gollek-train-diffusion-opd`. Byte-latent language modeling should not be
threaded through those packages just because both areas involve modern
generative modeling.
