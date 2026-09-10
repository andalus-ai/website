---
layout: default
title: gollek-ml-recursive-reasoning
parent: API REferences
nav_order: 226
---

# gollek-ml-recursive-reasoning

The `gollek-ml-recursive-reasoning` module is Gollek's package root for
GRAM-style recursive reasoning, stochastic latent rollouts, structured
reasoning benchmarks, and trainer-facing discrete-token dataset utilities.

## Overview

Current scope:

- recursive-reasoning family metadata
- rollout/session contracts
- stochastic latent transition interfaces
- GRAM-style objective and variational transition primitives
- reference in-memory rollout/session implementation
- discrete token projection and rollout evaluation helpers
- N-Queens and Graph Coloring benchmark adapters
- benchmark-neutral dataset examples, plans, profiles, splits, epochs, and batches

## Installation

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-recursive-reasoning</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## Dataset API

### `DiscreteTokenDatasetPlanner`

Composes profiling, splitting, and epoch construction:

```java
DiscreteTokenDatasetPlanConfig config =
    DiscreteTokenDatasetPlanConfig.stratifiedLengthSorted(
        0.10,
        0.10,
        2026L,
        32,
        64,
        -1
    );

DiscreteTokenDatasetPlan plan =
    DiscreteTokenDatasetPlanner.plan(examples, config);
```

`DiscreteTokenDatasetPlan` exposes:

- `profile()`
- `split()`
- `trainEpoch()`
- `validationEpoch()`
- `testEpoch()`
- `trainPaddingRate()`
- `diagnostics()`
- `diagnostics(DiscreteTokenDatasetPlanDiagnosticsPolicy)`
- `readiness(DiscreteTokenDatasetPlanReadinessGate)`
- `fingerprint()`
- `verifyFingerprint(DiscreteTokenDatasetFingerprint)`
- `verifyFingerprintMetadata(Map<?, ?>)`
- `verifyFingerprintMetadataSection(Map<?, ?>)`
- `verifyFingerprintMetadataSection(Map<?, ?>, String)`
- `report()`
- `report(DiscreteTokenDatasetPlanReadinessGate)`

`DiscreteTokenDatasetPlanConfig` selects:

- `DiscreteTokenDatasetSplitMode`
- `DiscreteTokenDatasetTrainEpochMode`
- split seed
- training/evaluation batch sizes
- input/target pad tokens
- train `dropLast` policy

`DiscreteTokenDatasetPlanDiagnostics` exposes:

- `isReadyForTraining()`
- `status()`
- `hasWarnings()`
- `warnings()`
- `knownSolutionCoverageRate()`
- `trainPaddingRate()`
- `trainPaddingTokenCount()`
- `droppedTrainingExamples()`
- `taskSplits()`
- `toMetadata()`

`DiscreteTokenDatasetPlanDiagnosticsPolicy` controls optional warnings:

- `defaults()` keeps the standard pre-training checks
- `lenient()` suppresses optional warnings while preserving hard blockers
- `withHighPaddingRateThreshold(...)` tunes padding sensitivity for CI or
  production trainers
- `withEvaluationSplitWarnings(...)`, `withKnownSolutionWarnings(...)`,
  `withPerTaskSplitWarnings(...)`, and `withPaddingWarning(...)` toggle common
  warning groups
- `fromMetadata(...)` and `toMetadata()` round-trip persisted trainer or CI
  warning policies

`DiscreteTokenDatasetPlanReadinessGate` converts diagnostics into run control:

- `training()` accepts trainable plans while preserving warning metadata
- `strict()` rejects trainable plans that still have warnings
- `lenient()` evaluates with lenient diagnostics first
- `evaluate(...)`, `requireReady(...)`, and `plan.readiness(...)` produce a
  `DiscreteTokenDatasetPlanReadinessReport`
- `fromMetadata(...)` and `toMetadata()` round-trip the selected diagnostics
  policy and warning-failure mode

`DiscreteTokenDatasetPlanReadinessReport` exposes `accepted()`, `gateStatus()`,
`rejectionReasons()`, `requireAccepted()`, and `toMetadata()`.

`DiscreteTokenDatasetFingerprint` provides stable SHA-256 provenance:

- `fromExamples(...)` hashes ordered token examples and metadata
- `fromPlan(...)` and `plan.fingerprint()` hash config, splits, examples, and
  materialized epoch layout
- `fromMetadata(...)`, `fromMetadataSection(...)`, `shortValue()`,
  `shortValue(length)`, and `toMetadata()` support compact reports and
  checkpoint metadata

`DiscreteTokenDatasetFingerprintMatch` verifies checkpoint/resume provenance:

- `verify(expected, actual)`, `verify(expected, plan)`, and
  `verify(expected, report)` compare stored and current fingerprints
- `plan.verifyFingerprint(expected)` and `report.verifyFingerprint(expected)`
  provide convenient resume guards
- `verifyMetadata(...)`, `plan.verifyFingerprintMetadata(...)`, and
  `report.verifyFingerprintMetadata(...)` accept stored checkpoint metadata
- `verifyMetadataSection(...)`, `plan.verifyFingerprintMetadataSection(...)`,
  and `report.verifyFingerprintMetadataSection(...)` extract nested fingerprint
  metadata from full report/checkpoint payloads
- `matches()`, `status()`, `mismatchReasons()`, `summary()`, `requireMatch()`,
  and `toMetadata()` support fail-fast resume checks and CI payloads

`DiscreteTokenDatasetPlanReport` is the combined preflight bundle:

- `from(plan)`, `from(plan, gate)`, `plan.report()`, and `plan.report(gate)`
  assemble fingerprint plus readiness metadata
- `diagnostics()`, `accepted()`, `gateStatus()`, `warnings()`, and
  `requireAccepted()` provide one-call trainer checks
- `summary()` and `toMetadata()` are designed for logs, CI payloads, and
  checkpoint provenance

`DiscreteTokenDatasetCheckpointManifest` is the trainer checkpoint wrapper:

- `builder(report)` creates a manifest with experiment, run, model family,
  seed, checkpoint step, creator, timestamp, and custom attributes
- `fingerprint()`, `datasetAccepted()`, `datasetGateStatus()`,
  `verifyPlan(...)`, `verifyReport(...)`, and `requireDatasetAccepted()`
  support resume checks around the stored dataset plan
- `toMetadata()` emits top-level checkpoint fields plus a top-level
  `fingerprint` section and nested `datasetPlanReport`

`DiscreteTokenDatasetCheckpointManifestSnapshot` is the read-side checkpoint
view:

- `fromMetadata(...)` and `fromManifest(...)` rehydrate persisted manifest
  metadata without rebuilding the original plan report
- `isCurrentSchema()`, `requireCurrentSchema()`, `datasetPlanReportFingerprint()`,
  `verifyPlan(...)`, `verifyReport(...)`, and `requireDatasetAccepted()` support
  fail-fast resume guards
- `resumeReport(plan)` and `resumeReport(report)` combine schema, readiness,
  and fingerprint checks into one checkpoint-resume report
- overloads of `resumeReport(...)` accept a
  `DiscreteTokenDatasetCheckpointResumeExpectation` for stricter experiment
  identity checks
- `toMetadata()` round-trips the manifest payload and checks that top-level
  fingerprint/readiness fields still match the nested `datasetPlanReport`

`DiscreteTokenDatasetCheckpointResumeExpectation` is the optional identity
guard for resume paths:

- `none()`, `builder()`, `exactFromManifest(...)`, and `exactFromSnapshot(...)`
  create expectations for experiment name, run id, model family, seed, exact
  checkpoint step, or minimum checkpoint step
- `active()`, `accepts(snapshot)`, `rejectionReasons(snapshot)`, and
  `toMetadata()` make expectation failures explainable in trainer reports

`DiscreteTokenDatasetCheckpointResumePolicy` is the trainer-facing resume gate:

- `training()`, `strict()`, and `lenient()` select the current plan readiness
  gate used during resume
- `withCurrentPlanGate(...)` and `withExpectation(...)` customize the policy
- `fromMetadata(...)` and `toMetadata()` round-trip persisted resume policy
  settings, including the current readiness gate and expectation
- `evaluate(...)` and `requireReady(...)` accept checkpoint metadata, a
  manifest, or a snapshot plus the freshly materialized plan, then return a
  `DiscreteTokenDatasetCheckpointResumeReport`

`DiscreteTokenDatasetCheckpointResumeReport` is the one-call resume preflight:

- `fromMetadata(...)` and `fromSnapshot(...)` compare a persisted checkpoint
  manifest with a freshly materialized plan or plan report
- `schemaAccepted()`, `datasetAccepted()`, `fingerprintMatched()`, `ready()`,
  `status()`, `rejectionReasons()`, `summary()`, and `requireReady()` make
  checkpoint resume failures reportable and fail-fast
- `gateSummary()`, `gates()`, `gatesById()`, `gate(...)`,
  `gateAccepted(...)`, `requireGateAccepted(...)`,
  `requireAllGatesAccepted()`, `blockedGates()`, and `warningGates()` expose
  stable aggregate and per-guard decisions for automation and extension
  preflights
- `actionPlan()`, `readinessBadge()`, `nextActions()`, `primaryAction()`,
  `requiredActions()`, `warningActions()`, `actionCodes()`,
  `requiredActionCodes()`, `warningActionCodes()`, and
  `requireNoRequiredActions()` provide direct access to the resume action
  handoff without traversing `gateSummary()`
- `currentPlanChecked()`, `currentPlanAccepted()`, and
  `currentPlanGateStatus()` report whether the current plan/report still passes
- `explanation()` derives stable finding codes, categories, details, and next
  steps. `DiscreteTokenDatasetCheckpointResumeExplanation.fromMetadata(...)`
  and `requireMetadataMatch(...)` rehydrate and validate that explanation
  payload for CI, dashboards, and extension consumers.
- `DiscreteTokenDatasetCheckpointResumeCompatibilityMode` supports `STRICT`,
  `COMPATIBLE`, and explicit `FORCE` resume decisions. Force decisions can
  return ready while still carrying compatibility warnings.
- `policyTracked()` and `policyMetadata()` show whether a reusable resume policy
  produced the report and expose that serialized policy for audit logs
- `toMetadata()` exports the resume decision, fingerprint match payload, and
  checkpoint snapshot, plus per-gate decisions, the current plan report, and
  policy snapshot when available, for CI and trainer reports

`DiscreteTokenDatasetCheckpointResumeGate` is the stable per-guard decision used
inside resume reports and snapshots:

- Gate ids cover checkpoint manifest schema, checkpoint dataset readiness,
  dataset fingerprint, resume expectation, and current dataset plan readiness
- `accepted()`, `blocked()`, `warning()`, `attentionRequired()`,
  `actionRequired()`, `status()`, `severity()`, `actionCode()`,
  `actionHint()`, `requireAccepted()`, `details()`, and `toMetadata()` let CI
  and extensions enforce one guard without parsing human-readable summaries

`DiscreteTokenDatasetCheckpointResumeGateSummary` is the compact aggregate used
for dashboards and CI logs:

- `status()`, `allAccepted()`, `attentionRequired()`, `actionRequired()`,
  `highestSeverity()`, `gateCount()`, `acceptedCount()`, `blockedCount()`,
  `warningCount()`, `blockedGateIds()`, `warningGateIds()`, `gatesByStatus()`,
  `gatesBySeverity()`,
  `gatesByCategory()`, `gateIdsByStatus()`, `gateIdsBySeverity()`,
  `gateIdsByCategory()`, `gateCountByStatus()`, `gateCountBySeverity()`,
  `gateCountByCategory()`, `gateCategorySummaries()`,
  `gateCategorySummaryByCategory()`, `gateCategorySummary(...)`,
  `requireGateCategorySummary(...)`, `categoryIds()`, `acceptedCategories()`,
  `blockedCategories()`, `warningCategories()`, `acceptedCategorySummaries()`,
  `blockedCategorySummaries()`, `warningCategorySummaries()`,
  `primaryBlockedCategorySummary()`, `primaryWarningCategorySummary()`,
  `primaryBlockedCategory()`, `primaryWarningCategory()`,
  `primaryBlockedGate()`, `primaryWarningGate()`, `primaryGate()`,
  `primaryGateId()`, `primaryGateCategory()`, `primaryGateStatus()`,
  `primaryGateSeverity()`, `primaryActionCode()`, `primaryActionHint()`,
  `primaryAction()`, `nextActions()`, `requiredActions()`,
  `warningActions()`, `actionCodes()`, `requiredActionCodes()`,
  `warningActionCodes()`, `actionPlan()`, `readinessBadge()`,
  `requireAllAccepted()`, and `toMetadata()`
  summarize the full gate list without losing the primary blocker, warning
  identity, category rollups, category status lists, or grouped
  machine-readable gate indexes and automation-safe next action

`DiscreteTokenDatasetCheckpointResumeActionPlan` is the one-object handoff for
resume automation and UI integrations:

- `status()`, `ready()`, `readyWithoutWarnings()`, `attentionRequired()`,
  `actionRequired()`, `actionCount()`, `requiredActionCount()`,
  `warningActionCount()`, `primaryActionCode()`, `primaryActionHint()`,
  `primaryGateId()`, `primaryCategory()`, `actionCodes()`,
  `requiredActionCodes()`, `warningActionCodes()`, `actions()`,
  `requiredActions()`, `warningActions()`, `primaryAction()`, `summary()`,
  `requireNoRequiredActions()`, `fromMetadata(...)`, and `toMetadata()` expose
  a compact action plan without requiring each consumer to combine summary
  fields by hand

`DiscreteTokenDatasetCheckpointResumeAction` is the ordered action item derived
from the resume gate summary:

- `rank()`, `code()`, `hint()`, `gateId()`, `category()`, `status()`,
  `severity()`, `primary()`, `attentionRequired()`, `actionRequired()`,
  `blocked()`, `warning()`, `gateSummary()`, `fromMetadata(...)`, and
  `toMetadata()` let CI, dashboards, and operator tools render a prioritized
  resume repair/review plan without re-sorting gates
- `nextActions()` returns blocked actions first, warning actions second, and a
  single `continue` action only when the checkpoint is already ready

`DiscreteTokenDatasetCheckpointResumeReadinessBadge` is the render-friendly
headline status for CLI, CI, and dashboards:

- `status()`, `label()`, `tone()`, `severity()`, `iconKey()`,
  `attentionRequired()`, `actionRequired()`, `primaryMessage()`,
  `actionCode()`, `actionHint()`, `primaryGateId()`, `primaryGateCategory()`,
  `primaryGateStatus()`, `primaryGateSeverity()`, `ready()`, `blocked()`,
  `warning()`, `fromMetadata(...)`, and `toMetadata()` condense the full gate
  summary into one stable UI payload. `actionCode()` is stable for automation,
  while `actionHint()` is display text for operators.

`DiscreteTokenDatasetCheckpointResumeGateCategorySummary` is the compact
per-category rollup used by the aggregate summary:

- `category()`, `status()`, `severity()`, `allAccepted()`, `gateCount()`,
  `attentionRequired()`, `actionRequired()`, `acceptedCount()`,
  `blockedCount()`, `warningCount()`, `gateIds()`,
  `blockedGateIds()`, `warningGateIds()`, `primaryGate()`,
  `primaryBlockedGate()`, `primaryWarningGate()`, `primaryActionCode()`,
  `primaryActionHint()`, `summary()`, `fromMetadata(...)`,
  `requireMetadataMatch(...)`, and `toMetadata()` let dashboards render and
  validate one stable row per resume guard category

`DiscreteTokenDatasetCheckpointResumeReportSnapshot` is the read-side resume
audit view:

- `fromReport(...)` and `fromMetadata(...)` rehydrate persisted resume-report
  JSON without needing the current dataset plan
- `requireReady()`, `summary()`, `gateSummary()`, `actionPlan()`,
  `readinessBadge()`, `gates()`, `gateAccepted(...)`,
  `requireGateAccepted(...)`, `requireAllGatesAccepted()`,
  `requireNoRequiredActions()`, `toMetadata()`, `policyMetadata()`, and
  `currentPlanReportMetadata()` support CI gates, dashboards, and extension
  tooling that inspect completed checkpoint preflights
- persisted `gateSummary`, top-level `actionPlan`, and top-level
  `readinessBadge` metadata are validated against the detailed gates when
  present, including grouped gate indexes when present, while older sidecars
  without gate fields synthesize the current gate list from the legacy resume
  booleans and fingerprint payload

`DiscreteTokenDatasetTrainerCheckpointSnapshot` is the checkpoint-directory
audit view:

- `read(checkpointDir)` loads the manifest sidecar plus the optional resume
  report sidecar in one call
- `manifestReady()`, `resumeReportPresent()`, `resumeReady()`, `ready()`, and
  `status()` distinguish manifest-only, ready, and blocked checkpoint states
- `requireReady()`, `requireResumeReport()`, `requireResumeReady()`,
  `trainingReportMetadata()`, and `toMetadata()` give dashboards and extensions
  a compact checkpoint audit payload

`DiscreteTokenDatasetTrainerCheckpointInventory` scans checkpoint roots:

- `scan(rootDir)` reads the root checkpoint, if present, plus immediate child
  checkpoint directories that contain the dataset manifest sidecar
- `checkpointCount()`, `readyCount()`, `blockedCount()`,
  `manifestOnlyCount()`, `resumeReportCount()`, and `failureCount()` summarize
  checkpoint health for dashboards and CI
- `latestCheckpoint()`, `latestReadyCheckpoint()`,
  `requireLatestReadyCheckpoint()`, `requireNoFailures()`, `summary()`, and
  `toMetadata()` expose an inventory payload while preserving corrupt sidecars
  as read failures instead of aborting the whole scan
- `selectCheckpoint(policy)` and `requireCheckpoint(policy)` delegate restore
  choice to a reusable checkpoint selection policy
- `selectRestorePlan(policy)` and `requireRestorePlan(policy)` return the same
  choice as a typed restore-plan handoff for trainer resume code
- `DiscreteTokenDatasetCheckpointLineageGraph.fromInventory(...)` resolves
  root-to-leaf checkpoint ancestry and reports duplicate run ids,
  missing-parent references, ambiguous parent links, parent identity
  mismatches, and lineage cycles
- `healthy()`, `healthMetadata()`, `healthSnapshot()`, `issueTypes()`,
  `issueDetails()`, and
  `requireHealthy()` provide a compact CI/dashboard health gate over the graph
  with stable issue codes, severity, blocking status, affected checkpoint paths,
  issue-specific reasons, remediation actions, `issueDetailCount`,
  `blockingIssueCount`, plus top-level `kind` and `schemaVersion` fields for
  the stable health payload contract
- `DiscreteTokenDatasetCheckpointLineageHealthSnapshot.fromMetadata(...)`
  rehydrates that payload for extensions, CI jobs, and dashboards that should
  not parse raw maps by hand; it also round-trips with `toMetadata()`,
  exposes primary issue/failing-check convenience accessors, and validates the
  current `gollek.checkpoint-lineage-health.v1` contract
- `DiscreteTokenDatasetCheckpointLineageHealthValidationReport.fromMetadata(...)`,
  `fromJson(...)`, and `fromPath(...)` return a dependency-free
  `checkpoint-lineage-health-validation` payload with stable valid/invalid
  status, error codes, and compact health summaries for CI or extension
  handoffs; `fromValidationMetadata(...)`, `fromValidationJson(...)`, and
  `fromValidationPath(...)` rehydrate a persisted validation report, and
  `jsonSchemaMetadata()` exposes its bundled schema contract
- `DiscreteTokenDatasetCheckpointLineageHealthSchemaCatalog.catalogMetadata(...)`
  publishes the lineage-health schema catalog, including the health payload
  contract, validation-report contract, schema ids, resources, and inspector
  section names, plus `schemaSetSha256`, per-schema SHA-256 digests, and byte
  counts for drift checks; `jsonSchemaMetadata()` exposes the schema-catalog
  contract itself, while `lockMetadata()` and `lockJsonSchemaMetadata()` expose
  a compact lock payload and its schema, `lockSnapshot()` exposes the same
  payload through typed lock accessors, and `validateLockMetadata(...)`
  returns a stable valid/invalid report for saved lock drift checks;
  `validateLockJson(...)` and `validateLockPath(...)` cover persisted lock
  text/files, `validateLockSnapshot(...)` covers rehydrated lock snapshots,
  `requireValidLockMetadata(...)`, `requireValidLockJson(...)`, and
  `requireValidLockPath(...)` fail fast on drift, while
  `lockValidationJsonSchemaMetadata()` exposes that validation report schema.
  The report carries its validation schema id/resource and expected/actual
  lock-schema ids for self-describing CI artifacts
- `DiscreteTokenDatasetSchemaCatalogSnapshot` wraps schema-catalog metadata with
  typed accessors such as `schemaSetSha256()`, `schemaSetIdentity()`,
  `matchesSchemaSet(...)`, `requireSchemaSet(...)`, `contractNames()`,
  `contract(...)`, `contractDetails()`, `contractsByName()`,
  `contractDetail(...)`, `requireContract(...)`, `requireContractDetail(...)`,
  `contractsByJsonSchemaId()`, `contractForJsonSchemaId(...)`,
  `requireContractForJsonSchemaId(...)`,
  `contractsByPayloadKind()`, `contractsForPayloadKind(...)`,
  `contractForPayloadSchema(...)`, `requireContractForPayloadSchema(...)`,
  `hasEmbeddedSchemas()`, and `requireCurrentSchema(...)`, while preserving
  compact or embedded-schema catalog metadata through `toMetadata()`
- `DiscreteTokenDatasetSchemaLockSnapshot` wraps schema-lock metadata with typed
  accessors such as `schemaSetSha256()`, `schemaCount()`,
  `schemaSetIdentity()`, `matchesSchemaSet(...)`, `requireSchemaSet(...)`,
  `contractNames()`, `contract(...)`, `contractDetails()`, `contractsByName()`,
  `contractDetail(...)`, `requireContract(...)`, `requireContractDetail(...)`,
  `contractsByJsonSchemaId()`, `contractForJsonSchemaId(...)`,
  `requireContractForJsonSchemaId(...)`,
  `contractsByPayloadKind()`, `contractsForPayloadKind(...)`,
  `contractForPayloadSchema(...)`, `requireContractForPayloadSchema(...)`,
  and `requireCurrentSchema(...)`, while preserving the original lock metadata
  through `toMetadata()`
- `DiscreteTokenDatasetSchemaContractSnapshot` wraps one schema catalog or lock
  contract entry with accessors for payload schema identity, JSON schema id,
  SHA-256 digest, byte count, optional catalog metadata, embedded schema
  metadata, and raw `toMetadata()` access
- `DiscreteTokenDatasetSchemaSetIdentity` wraps the shared schema-set SHA-256
  digest and schema count so catalogs, locks, and validation reports can compare
  schema identity through `matches(...)`, `requireMatches(...)`, and
  `toMetadata()`
- `DiscreteTokenDatasetSchemaLockValidationReport` wraps schema-lock validation
  metadata with typed accessors such as `valid()`, `mismatchCount()`,
  `expectedSchemaSetIdentity()`, `actualSchemaSetIdentity()`,
  `schemaSetIdentityMatch()`, `requireSchemaSetIdentityMatch()`,
  `mismatchPaths()`, `mismatchDetails()`, `firstMismatch()`, and
  `hasMismatchAtPath(...)`, plus `mismatchesForPath(...)`,
  `mismatchesForType(...)`, `mismatchesByPath()`, `mismatchesByType()`, and
  `requireValid()` while preserving the original validation metadata through
  `toMetadata()`
- `DiscreteTokenDatasetSchemaLockMismatch` wraps one schema-lock validation
  mismatch with `type()`, `path()`, `expected()`, `actual()`, `summary()`, and
  raw `toMetadata()` access for CI logs and extension diagnostics
- `DiscreteTokenDatasetSchemaContract` is the reusable schema descriptor used to
  load bundled JSON Schema resources, compute SHA-256 digests and byte counts,
  and render standard contract metadata with optional embedded schemas
- `DiscreteTokenDatasetSchemaBundle` composes reusable schema contracts into the
  common catalog, compact lock, and lock-validation report surface used by
  lineage-health schema drift checks, giving future trainer artifacts the same
  CI-friendly schema-lock mechanics without duplicating catalog comparison code;
  use `builder(...)` for new bundles so catalog/lock/validator fields stay
  explicit and duplicate contract names fail during bundle construction
- `DiscreteTokenDatasetCheckpointLineageHealthSnapshot.jsonSchemaMetadata()`
  exposes the bundled JSON Schema contract
  (`checkpoint-lineage-health.v1.schema.json`) for schema-aware extension
  registries, CI validators, and dashboard parsers
- `status()`, `primaryIssue()`, `primaryIssueCode()`,
  `primaryIssueType()`, and `primaryIssueAction()` expose a deterministic
  headline issue for CI summaries when the graph is unhealthy
- `healthScore()`, `alertLevel()`, `recommendedAction()`, and `healthBadge()`
  expose a UI-ready status projection for dashboards and trainer reports
- `checks()`, `failingChecks()`, `passingCheckCount()`,
  `failingCheckCount()`, `primaryFailingCheck()`,
  `primaryFailingCheckCode()`, `primaryFailingCheckType()`,
  `primaryFailingCheckAction()`, `primaryFailingCheckSeverity()`,
  `primaryFailingCheckMessage()`, and `checkSummary()` expose category-level
  invariant rows for duplicate run ids, parent resolution, parent identity,
  and cycles, including primary failing-check identity, type, action, full
  check payload, and severity rollups; `healthMetadata()` mirrors the
  priority-aware primary failing-check fields at the top level when a check
  fails

`DiscreteTokenDatasetTrainerCheckpointSelectionPolicy` chooses checkpoints from
an inventory:

- `latestReady()` selects the latest ready checkpoint and accepts manifest-only
  directories
- `latestResumeReady()` selects the latest ready checkpoint that also has a
  persisted ready resume report
- `strictLatestReady()` and `strictLatestResumeReady()` reject inventories with
  corrupt sidecar reads before selecting a checkpoint
- `withFailOnLineageIssues(true)` rejects unhealthy lineage graphs before
  selecting a checkpoint; this covers duplicate run ids, missing parents,
  ambiguous parents, parent identity mismatches, and cycles
- `withExpectation(...)`, `candidates(...)`, `rejectionReasons(...)`,
  `toMetadata()`, and `fromMetadata(...)` support trainer config, dashboards,
  and CI restore gates

`DiscreteTokenDatasetTrainerCheckpointInspectionReport` explains a selection
decision:

- `inspect(rootDir, policy)` and `inspect(inventory, policy)` scan or reuse an
  inventory and apply the selection policy
- `selectedCheckpoint()`, `selectionFailure()`, `selectionSatisfied()`,
  `acceptedCount()`, `rejectedCount()`, and `checkpointDecisions()` expose the
  restore result and all candidate decisions
- strict policies keep candidate decisions visible while recording inventory
  read failures as selection blockers
- `toMetadata()` exports a JSON-friendly payload for JBang inspectors,
  dashboards, and CI restore gates
- `selectedRestorePlan()` and `requireRestorePlan()` expose the selected
  checkpoint as a typed restore-plan handoff
- `lineageGraph()`, `selectedLineageChain()`, and
  `requireSelectedLineageChain()` expose resolved checkpoint ancestry without
  forcing tools to parse every manifest sidecar

`DiscreteTokenDatasetTrainerCheckpointRestorePlan` packages a selected
checkpoint for resume handoff:

- `fromInspectionReport(report)` and `fromCheckpoint(root, checkpoint, policy)`
  create restore plans from existing selection surfaces
- `checkpointDir()`, `manifestPath()`, `resumeReportPath()`, `manifest()`, and
  `resumeReport()` give resume code direct typed access to the selected sidecars
- `requireReady()`, `requireResumeReport()`, and `requireResumeReady()` keep
  fail-fast restore guards near the selected checkpoint
- `pathsMetadata()`, `identityMetadata()`, `summary()`, and `toMetadata()` emit
  compact CLI, dashboard, and extension handoff payloads

`DiscreteTokenDatasetTrainerCheckpointRestorePreflight` validates a selected
restore plan against the current trainer dataset plan:

- `evaluate(restorePlan, currentPlan, resumePolicy)` creates the current-plan
  preflight report for an already selected checkpoint
- `ready()`, `status()`, `rejectionReasons()`, and `requireReady()` expose the
  final resume decision before model or optimizer state is opened
- `gates()`, `gateSummary()`, `nextActions()`, `primaryAction()`,
  `requiredActions()`, `warningActions()`, `actionCodes()`,
  `requiredActionCodes()`, `warningActionCodes()`, `actionPlan()`,
  `readinessBadge()`, `requireAllGatesAccepted()`,
  `requireNoRequiredActions()`, and `requireMetadataMatch(...)` mirror the
  resume-report action handoff and validate live restore metadata
- `toMetadata()` keeps the selected restore plan, resume policy, and current
  resume report together for dashboards and CI gates, including top-level
  `actionPlan` and `readinessBadge` aliases

`DiscreteTokenDatasetCheckpointMetadataJson` persists checkpoint/resume metadata
without adding a JSON dependency:

- `toJson(...)` and `toPrettyJson(...)` emit deterministic JSON with sorted
  object keys for stable diffs and golden fixtures
- `fromJson(...)` reads metadata maps back into immutable Java maps/lists
- `write(path, manifest)`, `write(path, metadata)`, `read(path)`, and
  `readSnapshot(path)` cover trainer checkpoint manifest files
- `readPlanReport(path)` rehydrates a persisted dataset plan report from JSON
- `readResumeReportSnapshot(path)` rehydrates persisted resume-report JSON

`DiscreteTokenDatasetTrainerProvenanceSpec` is the one-object trainer setup:

- `builder(checkpointDir, plan)` materializes the plan report, checkpoint
  manifest, resume policy, sidecar paths, bridge helpers, and listener wiring
- `strict()`, `lenient()`, `gate(...)`, `resumeGate(...)`, and
  `exactResumeExpectation()` configure the write-side and resume-side checks
- `writeManifest()`, `requireResumeReadyAndWriteReport()`, `listener()`, and
  `attachToTrainingSummary(...)` expose the normal checkpoint lifecycle without
  rebuilding the manifest/policy/listener by hand
- `checkpointRootDir()`, `restoreSelectionPolicy()`,
  `inspectRestoreCandidates()`, `selectRestorePlan()`, `requireRestorePlan()`,
  `evaluateRestorePreflight()`, and `requireRestorePreflightReady()` expose the
  read-side restore target and final current-plan preflight using the same
  resume expectation carried by the spec
- `toMetadata()` exports the complete provenance setup for trainer config, CI,
  and dashboards

`DiscreteTokenDatasetTrainerCheckpointBridge` is the trainer integration helper:

- `manifestPath(checkpointDir)` and `resumeReportPath(checkpointDir)` define
  stable sidecar names inside a trainer checkpoint directory
- `writeManifest(...)`, `readManifestMetadata(...)`, and `readSnapshot(...)`
  persist and reload dataset provenance beside model/optimizer checkpoints
- `readResumeReportMetadata(...)` and `readResumeReportSnapshot(...)` reload
  the resume audit sidecar after a preflight has run
- `readCheckpointSnapshot(...)` loads the full checkpoint-directory sidecar
  state, including manifest-only directories
- `scanCheckpointInventory(...)` scans a checkpoint root and returns ready,
  blocked, manifest-only, and failed sidecar reads in one inventory object
- `selectCheckpoint(...)` and `requireCheckpoint(...)` scan a checkpoint root
  and apply a reusable checkpoint selection policy
- `inspectCheckpoints(...)` scans a checkpoint root and returns a full
  checkpoint inspection report with selected checkpoint, candidate decisions,
  and inventory read failures
- `selectRestorePlan(...)` and `requireRestorePlan(...)` scan a checkpoint root
  and return the selected checkpoint as a typed resume handoff
- `evaluateRestorePreflight(...)` and `requireRestorePreflightReady(...)`
  validate a selected restore target against the current dataset plan before
  state is loaded
- `evaluateResume(...)`, `requireResumeReady(...)`, and
  `requireResumeReadyAndWriteReport(...)` run the resume policy from persisted
  metadata and optionally write an audit JSON report
- `attachToTrainingMetadata(...)` and `attachToTrainingSummary(...)` add a
  `recursiveReasoningDataset` section to trainer-facing metadata/summary maps

`DiscreteTokenDatasetTrainerProvenanceListener` wires that bridge into trainer
lifecycle callbacks:

- `create(...)` writes the dataset manifest when training starts
- `withResumePreflight(...)` and `builder(...)` preflight an existing sidecar
  before overwriting it, failing fast on fingerprint/policy rejection by default
- `lastResumeReport()`, `lastEnrichedSummary()`, and `trainingReportMetadata()`
  expose the resume audit and summary metadata after callbacks run

`DiscreteTokenDatasetTaskSplitDiagnostics` provides per-task train,
validation, and test counts plus split rates for mixed benchmark datasets.

### `DiscreteTokenDatasetExample`

Canonical single example for structured reasoning trainers.

Constructor fields:

```java
new DiscreteTokenDatasetExample(
    String taskId,
    int exampleIndex,
    int[] inputTokens,
    int[] targetTokens,
    int knownSolutionCount,
    Map<String, Object> metadata
)
```

Validation:

- `taskId` must not be blank
- `exampleIndex >= 0`
- input and target tokens must be non-empty
- `knownSolutionCount` must be `-1` or `>= 1`
- token arrays are defensively copied

### `DiscreteTokenDatasetProfiler`

Builds compact dataset diagnostics:

```java
DiscreteTokenDatasetProfile profile =
    DiscreteTokenDatasetProfiler.profile(examples);
```

Main profile fields:

- `exampleCount()`
- `taskExampleCounts()`
- `inputLengths()`
- `targetLengths()`
- `observedTokenCount()`
- `distinctTokenCount()`
- `minToken()`
- `maxToken()`
- `knownSolutionCoverageRate()`

### `DiscreteTokenDatasetSplitter`

Deterministic train/validation/test splits:

```java
DiscreteTokenDatasetSplit split =
    DiscreteTokenDatasetSplitter.shuffledByFractions(
        examples,
        0.10,
        0.10,
        2026L
    );
```

Available split policies:

| Method | Policy |
|--------|--------|
| `sequentialByCounts` | exact validation/test counts, source order |
| `shuffledByCounts` | exact validation/test counts, seeded shuffle |
| `sequentialByFractions` | floor-fraction validation/test sizes, source order |
| `shuffledByFractions` | floor-fraction validation/test sizes, seeded shuffle |
| `stratifiedSequentialByFractions` | floor fractions inside each `taskId`, source order |
| `stratifiedShuffledByFractions` | floor fractions inside each `taskId`, seeded shuffle |

`DiscreteTokenDatasetSplit` exposes:

- `trainExamples()`
- `validationExamples()`
- `testExamples()`
- `profile()`
- `trainProfile()`
- `validationProfile()`
- `testProfile()`
- `trainEpoch(...)`
- `validationEpoch(...)`
- `testEpoch(...)`

### `DiscreteTokenDatasetEpochBatcher`

Materializes mini-batches:

```java
DiscreteTokenDatasetEpoch epoch =
    DiscreteTokenDatasetEpochBatcher.lengthSorted(
        split.trainExamples(),
        32,
        -1,
        false
    );
```

Available epoch policies:

| Method | Policy |
|--------|--------|
| `sequential` | source order mini-batches |
| `shuffled` | seeded shuffled mini-batches |
| `lengthSorted` | combined input/target length sorting to reduce padding |

`DiscreteTokenDatasetEpoch` exposes:

- `batches()`
- `batchCount()`
- `emittedExampleCount()`
- `droppedExampleCount()`
- `observedTokenCount()`
- `paddedTokenCapacity()`
- `paddingTokenCount()`
- `paddingRate()`

### `DiscreteTokenDatasetBatcher`

Pads examples into one batch:

```java
DiscreteTokenDatasetBatch batch =
    DiscreteTokenDatasetBatcher.batch(examples, -1, -1);
```

`DiscreteTokenDatasetBatch` exposes:

- `taskIds()`
- `exampleIndices()`
- `inputTokens()`
- `targetTokens()`
- `inputMask()`
- `targetMask()`
- `inputLengths()`
- `targetLengths()`
- `knownSolutionCounts()`
- `metadata()`
- `inputPadToken()`
- `targetPadToken()`

All array accessors return defensive copies.

## Structured Benchmark APIs

N-Queens:

- `NQueensProblem`
- `NQueensSolution`
- `NQueensDatasetGenerator`
- `NQueensTokenCodec`
- `NQueensTokenProjector`
- `NQueensRolloutEvaluator`

Graph Coloring:

- `GraphColoringProblem`
- `GraphColoringSolution`
- `GraphColoringDatasetGenerator`
- `GraphColoringTokenCodec`
- `GraphColoringTokenProjector`
- `GraphColoringRolloutEvaluator`

Both benchmark families can emit `DiscreteTokenDatasetExample` through their
dataset-example adapters.

## Example

```java
List<DiscreteTokenDatasetExample> examples = List.of(
    graphColoringExample.toTokenExample(),
    nQueensExample.toTokenExample()
);

DiscreteTokenDatasetPlanConfig config =
    DiscreteTokenDatasetPlanConfig.stratifiedLengthSorted(
        0.10,
        0.10,
        2026L,
        32,
        64,
        -1
    );

DiscreteTokenDatasetPlan plan =
    DiscreteTokenDatasetPlanner.plan(examples, config);

DiscreteTokenDatasetPlanDiagnostics diagnostics = plan.diagnostics();
DiscreteTokenDatasetPlanDiagnostics ciDiagnostics = plan.diagnostics(
    DiscreteTokenDatasetPlanDiagnosticsPolicy.defaults()
        .withHighPaddingRateThreshold(0.25)
);
DiscreteTokenDatasetPlanReadinessReport readiness = plan.readiness(
    DiscreteTokenDatasetPlanReadinessGate.strict()
);
DiscreteTokenDatasetFingerprint fingerprint = plan.fingerprint();
Map<String, Object> checkpointFingerprintMetadata = fingerprint.toMetadata();
DiscreteTokenDatasetFingerprint expectedFingerprint =
    DiscreteTokenDatasetFingerprint.fromMetadata(checkpointFingerprintMetadata);
DiscreteTokenDatasetFingerprintMatch resumeMatch =
    plan.verifyFingerprint(expectedFingerprint);
DiscreteTokenDatasetPlanReport report = plan.report(
    DiscreteTokenDatasetPlanReadinessGate.strict()
);
Map<String, Object> metadata = report.toMetadata();
report.verifyFingerprintMetadataSection(metadata).requireMatch();
Path checkpointDir = Path.of("checkpoints/run-001");
DiscreteTokenDatasetTrainerProvenanceSpec provenance =
    DiscreteTokenDatasetTrainerProvenanceSpec.builder(checkpointDir, plan)
        .strict()
        .experimentName("gram-structured-reasoning")
        .runId("run-001")
        .seed(2026L)
        .checkpointStep(12L)
        .exactResumeExpectation()
        .build();
DiscreteTokenDatasetCheckpointManifest manifest = provenance.manifest();
Map<String, Object> checkpointMetadata = manifest.toMetadata();
provenance.writeManifest();
Map<String, Object> loadedCheckpointMetadata = provenance.readManifestMetadata();
DiscreteTokenDatasetCheckpointManifestSnapshot snapshot =
    provenance.readSnapshot();
snapshot.requireCurrentSchema();
snapshot.verifyPlan(plan).requireMatch();
snapshot.requireDatasetAccepted();
DiscreteTokenDatasetCheckpointResumeReport resumeReport =
    snapshot.resumeReport(plan);
resumeReport.requireReady();
DiscreteTokenDatasetCheckpointResumeExpectation expectedCheckpoint =
    provenance.resumeExpectation();
snapshot.resumeReport(plan, expectedCheckpoint).requireReady();
DiscreteTokenDatasetPlanReport currentStrictReport =
    plan.report(DiscreteTokenDatasetPlanReadinessGate.strict());
snapshot.resumeReport(currentStrictReport, expectedCheckpoint).requireReady();
DiscreteTokenDatasetCheckpointResumePolicy resumePolicy =
    provenance.resumePolicy();
DiscreteTokenDatasetCheckpointResumeReport policyReport =
    provenance.requireResumeReadyAndWriteReport();
DiscreteTokenDatasetCheckpointResumeReportSnapshot persistedResumeAudit =
    provenance.readResumeReportSnapshot();
persistedResumeAudit.requireReady();
DiscreteTokenDatasetTrainerCheckpointSnapshot checkpointAudit =
    provenance.readCheckpointSnapshot();
checkpointAudit.requireReady();
DiscreteTokenDatasetTrainerCheckpointInventory checkpointInventory =
    DiscreteTokenDatasetTrainerCheckpointInventory.scan(checkpointDir.getParent());
DiscreteTokenDatasetTrainerCheckpointSnapshot latestReadyCheckpoint =
    checkpointInventory.requireLatestReadyCheckpoint();
DiscreteTokenDatasetTrainerCheckpointSelectionPolicy checkpointSelection =
    DiscreteTokenDatasetTrainerCheckpointSelectionPolicy.latestResumeReady()
        .withExpectation(provenance.resumeExpectation());
DiscreteTokenDatasetTrainerCheckpointSnapshot latestResumeReadyCheckpoint =
    checkpointSelection.require(checkpointInventory);
DiscreteTokenDatasetTrainerCheckpointSnapshot bridgeSelectedCheckpoint =
    DiscreteTokenDatasetTrainerCheckpointBridge.requireCheckpoint(
        checkpointDir.getParent(),
        checkpointSelection);
DiscreteTokenDatasetTrainerCheckpointRestorePlan restorePlan =
    DiscreteTokenDatasetTrainerCheckpointBridge.requireRestorePlan(
        checkpointDir.getParent(),
        checkpointSelection);
DiscreteTokenDatasetTrainerCheckpointRestorePreflight restorePreflight =
    DiscreteTokenDatasetTrainerCheckpointBridge.requireRestorePreflightReady(
        restorePlan,
        plan,
        provenance.resumePolicy());
DiscreteTokenDatasetTrainerCheckpointRestorePlan provenanceRestorePlan =
    provenance.requireRestorePlan();
DiscreteTokenDatasetTrainerCheckpointRestorePreflight provenanceRestorePreflight =
    provenance.requireRestorePreflightReady();
Map<String, Object> resumeAuditMetadata = policyReport.toMetadata();
Map<String, Object> trainerMetadata =
    provenance.attachToTrainingMetadata(Map.of("runId", "run-001"), policyReport);
DiscreteTokenDatasetTrainerProvenanceListener provenanceListener =
    provenance.listener();
// Pass provenanceListener to a canonical trainer via .listener(provenanceListener).
TrainingSummary enrichedSummary =
    provenanceListener.lastEnrichedSummary().orElse(null);
Map<String, Object> resumePolicyMetadata = resumePolicy.toMetadata();
DiscreteTokenDatasetCheckpointResumePolicy reloadedResumePolicy =
    DiscreteTokenDatasetCheckpointResumePolicy.fromMetadata(resumePolicyMetadata);
reloadedResumePolicy.requireReady(loadedCheckpointMetadata, plan);
String resumeAuditJson =
    DiscreteTokenDatasetCheckpointMetadataJson.toPrettyJson(resumeAuditMetadata);
List<DiscreteTokenDatasetTaskSplitDiagnostics> taskSplits =
    diagnostics.taskSplits();
DiscreteTokenDatasetBatch firstBatch = plan.trainEpoch().batches().get(0);
```

## Related Docs

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)
- [Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)
