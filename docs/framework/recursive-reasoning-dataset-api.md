---
layout: default
title: Recursive Reasoning Dataset API
---

# Recursive Reasoning Dataset API

This page documents the trainer-facing dataset utilities in
`gollek-ml-recursive-reasoning`.

Use this API when a structured reasoning benchmark needs to produce examples,
split them into train/validation/test partitions, profile the data, and hand
backend-neutral padded mini-batches to a trainer.

See also:

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)
- [gollek-ml-recursive-reasoning API Reference](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-recursive-reasoning)

## Data Flow

```text
benchmark adapter
  -> DiscreteTokenDatasetExample
  -> DiscreteTokenDatasetPlanner
  -> DiscreteTokenDatasetProfiler
  -> DiscreteTokenDatasetSplitter
  -> DiscreteTokenDatasetEpochBatcher
  -> DiscreteTokenDatasetBatch
  -> trainer/model backend
```

The data flow is intentionally independent of ONNX, SafeTensor, GGUF, LiteRT,
Metal, CUDA, or any tensor implementation. Tensor conversion happens after the
batch is built.

## One-Call Dataset Plan

`DiscreteTokenDatasetPlanner` composes the common trainer-data flow from one
config:

```java
DiscreteTokenDatasetPlanConfig config =
    DiscreteTokenDatasetPlanConfig.stratifiedLengthSorted(
        0.10,   // validation fraction
        0.10,   // test fraction
        2026L,  // split seed
        32,     // train batch size
        64,     // validation/test batch size
        -1      // input and target pad token
    );

DiscreteTokenDatasetPlan plan =
    DiscreteTokenDatasetPlanner.plan(examples, config);
```

The plan includes:

| Field | API |
|-------|-----|
| Full profile | `plan.profile()` |
| Train/validation/test split | `plan.split()` |
| Training epoch | `plan.trainEpoch()` |
| Validation epoch | `plan.validationEpoch()` |
| Test epoch | `plan.testEpoch()` |
| Training padding rate | `plan.trainPaddingRate()` |
| Pre-training diagnostics | `plan.diagnostics()` |
| Policy-driven diagnostics | `plan.diagnostics(policy)` |
| Readiness report | `plan.readiness(gate)` |
| Plan fingerprint | `plan.fingerprint()` |
| Preflight report | `plan.report(gate)` |

Use the planner for the standard path. Use the lower-level profiler, splitter,
and epoch batcher directly when a research experiment needs custom control.

`DiscreteTokenDatasetPlanDiagnostics` reports:

| Metric | API |
|--------|-----|
| Split sizes | `trainCount()`, `validationCount()`, `testCount()` |
| Batch counts | `trainBatchCount()`, `validationBatchCount()`, `testBatchCount()` |
| Training examples | `emittedTrainingExamples()`, `droppedTrainingExamples()` |
| Known-solution coverage | `knownSolutionCoverageRate()` |
| Training padding | `trainPaddingRate()`, `trainPaddingTokenCount()` |
| Per-task split coverage | `taskSplits()` |
| Warnings | `warnings()`, `hasWarnings()` |
| Readiness | `isReadyForTraining()` |
| Compact status | `status()` returning `ready`, `warning`, or `blocked` |
| Report export | `toMetadata()` |

Warnings cover empty datasets, empty train/validation/test splits, dropped
training examples, missing or partial known-solution coverage, and high training
padding rate. For mixed-task datasets, diagnostics also warn when a task is
missing from train, validation, or test while that global split exists.

Use `DiscreteTokenDatasetPlanDiagnosticsPolicy` when warning expectations differ
by environment. `defaults()` preserves the normal pre-training checks,
`lenient()` keeps only hard blockers such as empty datasets or empty train
splits, and custom policies can tune the high-padding threshold or disable
specific optional warnings.

Use `DiscreteTokenDatasetPlanReadinessGate` to convert diagnostics into a
trainer decision. `training()` accepts warning-bearing plans that are still
trainable, `strict()` blocks warnings for CI or production runs, and `lenient()`
uses the lenient diagnostics policy before evaluating readiness.

Use `DiscreteTokenDatasetFingerprint` to stamp checkpoints or CI reports with a
stable SHA-256 digest. `fromExamples(...)` hashes ordered examples, while
`plan.fingerprint()` hashes the planning config, split partitions, example
tokens/metadata, and epoch batch layout. `fromMetadata(...)` recreates a stored
fingerprint from direct checkpoint metadata, and `fromMetadataSection(...)`
extracts it from a larger report/checkpoint map.

Use `DiscreteTokenDatasetFingerprintMatch` before resuming from a checkpoint.
`plan.verifyFingerprint(expected)`, `plan.verifyFingerprintMetadata(metadata)`,
`plan.verifyFingerprintMetadataSection(reportMetadata)`,
`report.verifyFingerprint(expected)`, `report.verifyFingerprintMetadata(metadata)`,
and `report.verifyFingerprintMetadataSection(reportMetadata)`
return a match report with mismatch reasons and `requireMatch()` for fail-fast
resume guards.

Use `DiscreteTokenDatasetPlanReport` when a trainer wants the whole preflight
bundle in one place: fingerprint, diagnostics, readiness decision, summary, and
metadata export.
`DiscreteTokenDatasetPlanReport.fromMetadata(...)` rehydrates that payload from
JSON metadata so CI tools and checkpoint inspectors can re-run resume preflight
checks without rematerializing the full dataset.

Use `DiscreteTokenDatasetCheckpointManifest` when checkpoint metadata should
also carry experiment/run identity, model family, seed, checkpoint step,
creator, timestamp, and custom attributes alongside the dataset preflight
report.
Use `DiscreteTokenDatasetCheckpointLineage` when that manifest should also
carry experiment ancestry. New manifests default to a root lineage, while
`lineageFrom(parentSnapshot)` records the parent run id, parent step, parent
dataset fingerprint, relation, generation, and optional lineage attributes.
Use `DiscreteTokenDatasetCheckpointLineageGraph` when a checkpoint root should
resolve that ancestry across multiple sidecars, expose the selected
root-to-leaf lineage chain, and flag duplicate run ids, missing parents, or
ambiguous parent references. It also verifies that the recorded parent step and
dataset fingerprint match the resolved parent checkpoint. Its health metadata
reports parent identity mismatches and lineage cycles, and exposes a compact
CI-oriented issue summary with `issueDetails` entries for affected checkpoint
paths, stable issue codes, severity, blocking status, issue-specific reasons,
and remediation actions. The health metadata also includes `issueCodes`,
`issueDetailCount`, `blockingIssueCount`, `primaryIssueCode`, and
`primaryIssueAction` for compact automation gates, plus top-level `kind` and
`schemaVersion` fields that identify the stable health payload contract.
Use `healthSnapshot()` or
`DiscreteTokenDatasetCheckpointLineageHealthSnapshot.fromMetadata(...)` when
extensions, CI jobs, or dashboards need a typed read-side contract instead of
raw map parsing. Use `jsonSchemaMetadata()` when those consumers need the
bundled `checkpoint-lineage-health.v1.schema.json` contract for validation or
schema registry publishing. Use
`DiscreteTokenDatasetCheckpointLineageHealthValidationReport` or
`validateMetadata(...)`, `validateJson(...)`, and `validatePath(...)` when a CI
job or extension needs a compact valid/invalid report with stable codes instead
of throwing on malformed payloads. Use
`DiscreteTokenDatasetCheckpointLineageHealthValidationReport.jsonSchemaMetadata()`
when consumers also need the stable validation-report schema, or
`DiscreteTokenDatasetCheckpointLineageHealthSchemaCatalog.catalogMetadata(true)`
when they need to discover both health contracts together with embedded schemas.
Use `DiscreteTokenDatasetCheckpointLineageHealthSchemaCatalog.jsonSchemaMetadata()`
when consumers need to pin the schema-catalog contract itself. The catalog
includes a bundle-level `schemaSetSha256`, per-schema SHA-256 digests, and byte
counts for drift checks. Use `catalogSnapshot(...)` when Java consumers need
typed accessors such as `schemaSetSha256()`, `schemaSetIdentity()`,
`matchesSchemaSet(...)`, `requireSchemaSet(...)`, `contractNames()`,
`contractDetails()`, `contractsByName()`, `contractDetail(...)`,
`requireContractDetail(...)`, `contractsByPayloadKind()`,
`contractsByJsonSchemaId()`, `contractForJsonSchemaId(...)`,
`requireContractForJsonSchemaId(...)`,
`contractForPayloadSchema(...)`, `requireContractForPayloadSchema(...)`,
`hasEmbeddedSchemas()`, and `requireCurrentSchema(...)` for compact or
embedded-schema catalog payloads. The
typed contract entries expose `name()`, `payloadKind()`,
`payloadSchemaVersion()`, `jsonSchemaId()`, `jsonSchemaSha256()`,
`jsonSchemaByteCount()`, optional catalog-only metadata such as
`jsonSchemaResource()` and `inspectorSections()`, plus `schemaMetadata()` when
schemas are embedded. `DiscreteTokenDatasetSchemaContract` is the reusable
descriptor behind each schema resource, digest, byte count, and embedded schema
metadata entry. `DiscreteTokenDatasetSchemaBundle` composes those contracts into
a catalog, compact lock payload, and valid/invalid lock-validation report so
future trainer artifacts can publish the same drift-check surface without
copying lineage-health-specific catalog logic. Prefer
`DiscreteTokenDatasetSchemaBundle.builder(...)` for new bundles; it keeps the
catalog, lock, validator, label, code, and contract sections explicit and
rejects duplicate contract names before they can produce ambiguous lock
comparisons. Use
`DiscreteTokenDatasetCheckpointLineageHealthSchemaCatalog.lockMetadata()` when
CI needs a compact lock payload without embedded schemas, or `lockSnapshot()`
when Java consumers need typed accessors such as `schemaSetSha256()`,
`schemaSetIdentity()`, `matchesSchemaSet(...)`, `requireSchemaSet(...)`,
`schemaCount()`, `contractNames()`, `contractDetails()`, `contractsByName()`,
`contractDetail(...)`, `requireContractDetail(...)`, `contractsByPayloadKind()`,
`contractsByJsonSchemaId()`, `contractForJsonSchemaId(...)`,
`requireContractForJsonSchemaId(...)`,
`contractForPayloadSchema(...)`, `requireContractForPayloadSchema(...)`, and
`requireCurrentSchema(...)` for that same payload. Use
`lockJsonSchemaMetadata()` to validate that lock payload. Use
`validateLockMetadata(...)` or `validateCurrentLock()` when CI needs a stable
valid/invalid report comparing a saved lock with the current schema bundle, and
`validateLockJson(...)` or `validateLockPath(...)` when that saved lock is still
JSON text or a file. Use `validateLockSnapshot(...)` when the saved lock has
already been rehydrated as a `DiscreteTokenDatasetSchemaLockSnapshot`. Use
`requireValidLockMetadata(...)`,
`requireValidLockJson(...)`, `requireValidLockPath(...)`, or
`requireCurrentLockValid()` when the same check should fail fast on drift. Use
the `...Report(...)` variants when Java consumers want a
`DiscreteTokenDatasetSchemaLockValidationReport` with typed accessors such as
`valid()`, `mismatchCount()`, `expectedSchemaSetIdentity()`,
`actualSchemaSetIdentity()`, `schemaSetIdentityMatch()`,
`requireSchemaSetIdentityMatch()`, `mismatchPaths()`, `mismatchDetails()`,
`firstMismatch()`, `hasMismatchAtPath(...)`, `mismatchesForType(...)`,
`mismatchesByPath()`, and `requireValid()`. `mismatchDetails()` returns typed
`DiscreteTokenDatasetSchemaLockMismatch` entries with `type()`, `path()`,
`expected()`, `actual()`, and `summary()` while preserving the raw JSON-shaped
map through `toMetadata()`. Use
`lockValidationJsonSchemaMetadata()` when the validation report shape must be
pinned by external tooling. The report includes its validation schema
id/resource and the expected/actual lock-schema ids so persisted CI logs can be
interpreted without extra context. Use
`healthScore`, `alertLevel`, and `healthBadge` for UI status rendering. Use
`checks`, `failingChecks`, and `checkSummary` for category-level lineage
invariant rows, primary failing-check identity, type, action, full check
payload, and severity rollups; those priority-aware primary failing-check
fields are also mirrored at the top level of `healthMetadata()`.

Use `DiscreteTokenDatasetCheckpointManifestSnapshot` on resume paths to rehydrate
persisted manifest metadata, verify schema/fingerprint/readiness consistency,
and compare the checkpoint dataset fingerprint with a freshly materialized plan.

Use `DiscreteTokenDatasetCheckpointResumeReport` when the trainer wants one
checkpoint-resume preflight object that combines schema compatibility, stored
dataset readiness, and fingerprint matching before opening checkpoint state.
When constructed from a current `DiscreteTokenDatasetPlanReport`, it also blocks
resume if the freshly materialized report is not accepted by the current gate.
Call `gateSummary()`, `gates()`, `gateAccepted(...)`,
`requireGateAccepted(...)`, `requireAllGatesAccepted()`, `blockedGates()`, or
`warningGates()` when extensions need a stable automation view of each resume
guard: manifest schema, checkpoint dataset readiness, dataset fingerprint,
resume expectation, and current dataset plan readiness. The summary exposes
counts, blocked/warning ids, grouped gate ids and counts by status, severity,
per-category rollups, category status lists, primary blocked or warning gate
ids/categories, primary headline gate fields, highest severity, and compact
attention/action flags plus a render-ready badge for dashboards or CI logs.
Each gate also carries a stable `actionCode()` and human `actionHint()`; the
summary and badge expose the primary action so automation can branch on the code
while UI surfaces can show the hint directly. Use `nextActions()` when a report
has multiple blockers or warnings: it returns blocked actions first, warning
actions second, and a single `continue` action only for a fully ready resume
decision. `actionCodes()`, `requiredActionCodes()`, and `warningActionCodes()`
are compact shortcuts for CI rules. Prefer `actionPlan()` when an extension or
dashboard wants the full handoff in one object, including ready flags, counts,
primary action, ordered actions, and compact metadata. Resume reports and
read-side snapshots expose `actionPlan()`, `readinessBadge()`, and the action
shortcut lists directly, and `toMetadata()` includes top-level `actionPlan` and
`readinessBadge` aliases for tools that do not want to traverse `gateSummary`.
`DiscreteTokenDatasetCheckpointResumeActionPlan.fromMetadata(...)`,
`DiscreteTokenDatasetCheckpointResumeAction.fromMetadata(...)`, and
`DiscreteTokenDatasetCheckpointResumeReadinessBadge.fromMetadata(...)`
rehydrate those handoff payloads for extensions that receive only JSON.
`DiscreteTokenDatasetCheckpointResumeGateCategorySummary.fromMetadata(...)`
validates a single category rollup against the detailed resume gates when a
dashboard wants category-level rows without trusting stale derived counts.
Call `explanation()` on the resume report when a trainer, extension, or CI job
needs stable finding codes such as `dataset-fingerprint-mismatch`,
`checkpoint-schema-mismatch`, or `current-plan-rejected` plus suggested next
steps. `DiscreteTokenDatasetCheckpointResumeExplanation.fromMetadata(...)`
rehydrates that payload from JSON and verifies its derived primary code,
primary category, and finding count.

Use `DiscreteTokenDatasetCheckpointResumeExpectation` when that preflight should
also require a specific experiment name, run id, model family, seed, exact
checkpoint step, or minimum checkpoint step.

Use `DiscreteTokenDatasetCheckpointResumePolicy` when trainer resume code wants
one reusable object that chooses the current readiness gate, applies optional
resume compatibility, and enforces optional identity expectations.
Use `DiscreteTokenDatasetCheckpointResumeCompatibilityMode.STRICT` for exact
resume safety, `COMPATIBLE` for warning-only current-plan compatibility, and
`FORCE` only when a research/debug workflow intentionally continues through
dataset fingerprint or current-plan mismatches with warnings.
`DiscreteTokenDatasetCheckpointResumePolicy.fromMetadata(...)` rehydrates that
policy from persisted trainer config or CI metadata.
Reports produced through a policy include `policyTracked()` and
`policyMetadata()` so trainer audit payloads can show the exact gate and
expectation settings used for the decision.

Use `DiscreteTokenDatasetCheckpointResumeReportSnapshot` when dashboards, CI,
or extensions need to read a persisted resume-report sidecar without
materializing the dataset plan again. It preserves the resume status, rejection
reasons, gate summary, gate list, policy metadata, checkpoint identity, and
current-plan report payload. Snapshot loading validates a persisted
`gateSummary`, top-level `actionPlan`, and top-level `readinessBadge` against
the detailed gates when present, validates derived grouped gate indexes when
present, and synthesizes gates, summary, and grouped indexes for older sidecars
that predate those fields.

Use `DiscreteTokenDatasetTrainerCheckpointSnapshot` when those tools need the
whole checkpoint-directory sidecar state in one read. It loads the manifest,
detects whether a resume report exists, reports manifest-only versus ready or
blocked states, and exposes a compact `trainingReportMetadata()` payload.

Use `DiscreteTokenDatasetTrainerCheckpointInventory` when tools need to scan a
root directory of checkpoint runs. It reports ready, blocked, manifest-only, and
failed sidecar reads, and can select the latest ready checkpoint by manifest
creation time.

Use `DiscreteTokenDatasetTrainerCheckpointSelectionPolicy` when those tools need
the same restore choice everywhere. `latestReady()` allows manifest-only
checkpoints, `latestResumeReady()` requires a persisted ready resume report, and
the strict variants fail if the inventory contains corrupt sidecars. Add
`withFailOnLineageIssues(true)` when a resume path should also reject checkpoint
roots with duplicate run ids, missing parents, ambiguous parents, parent
identity mismatches, or cycles before selecting a checkpoint.

Use `DiscreteTokenDatasetTrainerCheckpointInspectionReport` when tools need to
show why a checkpoint was or was not selected. It keeps accepted and rejected
candidate decisions, selected checkpoint metadata, strict inventory failure
details, and a JSON-friendly `toMetadata()` payload together.

Use `DiscreteTokenDatasetTrainerCheckpointRestorePlan` when trainer resume code
needs the selected checkpoint as a typed handoff. It keeps the root directory,
checkpoint directory, manifest path, resume-report path, policy, checkpoint
identity, resume readiness, and JSON-friendly `toMetadata()` payload together.
Create one with `inspection.requireRestorePlan()`,
`inventory.requireRestorePlan(policy)`, or
`DiscreteTokenDatasetTrainerCheckpointBridge.requireRestorePlan(root, policy)`.

Use `DiscreteTokenDatasetTrainerCheckpointRestorePreflight` as the final guard
before opening checkpoint state. It combines the selected restore plan with a
fresh current-plan `DiscreteTokenDatasetCheckpointResumeReport`, so a checkpoint
can be selected by identity and persisted readiness but still be blocked if the
current dataset plan fingerprint, gate, or expectation no longer matches. It
also exposes `gateSummary()`, `nextActions()`, `actionPlan()`,
`readinessBadge()`, `requireAllGatesAccepted()`, `requireNoRequiredActions()`,
and `requireMetadataMatch(...)` directly, and its metadata includes top-level
`actionPlan` and `readinessBadge` aliases for CLI and CI consumers.

Use `DiscreteTokenDatasetCheckpointMetadataJson` when checkpoint metadata needs
dependency-free JSON persistence. It provides deterministic `toJson(...)` /
`toPrettyJson(...)`, immutable `fromJson(...)`, file `write(...)` / `read(...)`,
`readSnapshot(...)`, `readPlanReport(...)`, and
`readResumeReportSnapshot(...)` helpers for checkpoint manifest, dataset plan
report, and resume-report files.

Use `DiscreteTokenDatasetTrainerProvenanceSpec` as the normal trainer-facing
entry point. It builds the plan report, manifest, resume policy, sidecar paths,
bridge helpers, restore-selection policy, restore-plan helpers, and lifecycle
listener from one immutable setup object, which keeps extensions from
hand-wiring the same checkpoint provenance flow.

Use `DiscreteTokenDatasetTrainerCheckpointBridge` when that metadata should live
beside canonical trainer checkpoints. It writes stable
`discrete-token-dataset-manifest.json` and
`discrete-token-dataset-resume-report.json` sidecars, runs resume preflight from
the checkpoint directory, applies checkpoint selection policies across a root of
runs, returns typed restore plans for selected checkpoints, and can attach a
`recursiveReasoningDataset` section to trainer summary metadata.

Use `DiscreteTokenDatasetTrainerProvenanceListener` when the trainer should
perform that sidecar workflow from lifecycle callbacks. It writes the manifest at
training start, validates an existing manifest before overwriting it when a
current plan is supplied, and keeps the enriched `TrainingSummary` available
through `lastEnrichedSummary()`.

`toMetadata()` returns an immutable `Map<String, Object>` with nested `split`,
`batches`, `trainingExamples`, `trainPadding`, and `taskSplits` sections. Use it
when writing checkpoint metadata, JBang inspector payloads, or CI summaries.

Each `DiscreteTokenDatasetTaskSplitDiagnostics` entry reports:

| Field | Meaning |
|-------|---------|
| `taskId()` | Benchmark/task label |
| `exampleCount()` | Total examples for that task |
| `trainCount()` | Examples in train |
| `validationCount()` | Examples in validation |
| `testCount()` | Examples in test |
| `trainRate()` | Train share for that task |
| `validationRate()` | Validation share for that task |
| `testRate()` | Test share for that task |

## Token Example

`DiscreteTokenDatasetExample` is the canonical single-example record for
structured reasoning datasets.

Required fields:

| Field | Type | Meaning |
|-------|------|---------|
| `taskId` | `String` | Stable benchmark label such as `nqueens`, `graph-coloring`, or `arc-grid` |
| `exampleIndex` | `int` | Non-negative source index |
| `inputTokens` | `int[]` | Non-empty input token sequence |
| `targetTokens` | `int[]` | Non-empty target token sequence |
| `knownSolutionCount` | `int` | `-1` when unknown, otherwise `>= 1` |
| `metadata` | `Map<String, Object>` | Optional immutable per-example metadata |

Example:

```java
DiscreteTokenDatasetExample example = new DiscreteTokenDatasetExample(
    "graph-coloring",
    0,
    new int[] {0, -1, -1, 1},
    new int[] {0, 2, 1, 1},
    3,
    Map.of("nodeCount", 4, "colorCount", 3)
);
```

Benchmark-specific examples can adapt into this shape:

```java
DiscreteTokenDatasetExample nQueens = nQueensExample.toTokenExample();
DiscreteTokenDatasetExample coloring = graphColoringExample.toTokenExample();
```

## Dataset Profile

`DiscreteTokenDatasetProfiler.profile(examples)` returns a
`DiscreteTokenDatasetProfile`.

It reports:

| Metric | API |
|--------|-----|
| Example count | `exampleCount()` |
| Task mix | `taskExampleCounts()` |
| Input length stats | `inputLengths()` |
| Target length stats | `targetLengths()` |
| Observed token count | `observedTokenCount()` |
| Distinct token count | `distinctTokenCount()` |
| Token range | `minToken()`, `maxToken()` |
| Known-solution coverage | `knownSolutionExampleCount()`, `knownSolutionCoverageRate()` |

Example:

```java
DiscreteTokenDatasetProfile profile =
    DiscreteTokenDatasetProfiler.profile(examples);

System.out.println(profile.taskExampleCounts());
System.out.println(profile.inputLengths().maxLength());
System.out.println(profile.knownSolutionCoverageRate());
```

`DiscreteTokenLengthStats` stores compact min/max/total/mean length stats for
input or target sequences.

## Train/Validation/Test Split

`DiscreteTokenDatasetSplitter` provides deterministic split policies.

Exact-count splits:

```java
DiscreteTokenDatasetSplit split =
    DiscreteTokenDatasetSplitter.sequentialByCounts(
        examples,
        100,  // validation examples
        100   // test examples
    );
```

Fraction splits:

```java
DiscreteTokenDatasetSplit split =
    DiscreteTokenDatasetSplitter.shuffledByFractions(
        examples,
        0.10,
        0.10,
        42L
    );
```

Task-stratified fraction splits:

```java
DiscreteTokenDatasetSplit split =
    DiscreteTokenDatasetSplitter.stratifiedShuffledByFractions(
        examples,
        0.10,
        0.10,
        42L
    );
```

Use stratified splits when one dataset mixes several benchmark families. The
splitter groups examples by `taskId`, applies the same floor-fraction policy
inside each task group, then concatenates train, validation, and test
partitions.

Convenience profile methods:

```java
DiscreteTokenDatasetProfile allProfile = split.profile();
DiscreteTokenDatasetProfile trainProfile = split.trainProfile();
DiscreteTokenDatasetProfile validProfile = split.validationProfile();
DiscreteTokenDatasetProfile testProfile = split.testProfile();
```

## Epoch Builder

`DiscreteTokenDatasetEpochBatcher` materializes padded mini-batches for one
epoch.

Sequential:

```java
DiscreteTokenDatasetEpoch epoch =
    DiscreteTokenDatasetEpochBatcher.sequential(
        split.trainExamples(),
        32,
        -1,
        -1,
        false
    );
```

Seeded shuffle:

```java
DiscreteTokenDatasetEpoch epoch =
    DiscreteTokenDatasetEpochBatcher.shuffled(
        split.trainExamples(),
        32,
        -1,
        2026L,
        false
    );
```

Length sorted:

```java
DiscreteTokenDatasetEpoch epoch =
    DiscreteTokenDatasetEpochBatcher.lengthSorted(
        split.trainExamples(),
        32,
        -1,
        false
    );
```

Length sorting groups shorter examples together before batching. It is useful
when input or target lengths vary, because it reduces padding capacity without
coupling the dataset layer to a tensor backend.

`DiscreteTokenDatasetEpoch` reports:

| Metric | API |
|--------|-----|
| Number of mini-batches | `batchCount()` |
| Emitted examples | `emittedExampleCount()` |
| Dropped examples | `droppedExampleCount()` |
| Observed tokens | `observedTokenCount()` |
| Padded capacity | `paddedTokenCapacity()` |
| Padding tokens | `paddingTokenCount()` |
| Padding rate | `paddingRate()` |

## Padded Batch

`DiscreteTokenDatasetBatcher.batch(...)` pads a list of examples into one
`DiscreteTokenDatasetBatch`.

```java
DiscreteTokenDatasetBatch batch =
    DiscreteTokenDatasetBatcher.batch(examples, -1, -1);
```

The batch includes:

| Field | Shape | Meaning |
|-------|-------|---------|
| `inputTokens()` | `[batch, maxInputLength]` | Padded input tokens |
| `targetTokens()` | `[batch, maxTargetLength]` | Padded target tokens |
| `inputMask()` | `[batch, maxInputLength]` | `1` for real tokens, `0` for padding |
| `targetMask()` | `[batch, maxTargetLength]` | `1` for real tokens, `0` for padding |
| `inputLengths()` | `[batch]` | Original input lengths |
| `targetLengths()` | `[batch]` | Original target lengths |
| `knownSolutionCounts()` | `[batch]` | `-1` or known solution count |
| `metadata()` | list | Per-example metadata |

All public array accessors return defensive copies.

## Practical Defaults

Recommended starter policy:

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

DiscreteTokenDatasetPlanDiagnostics diagnostics = plan.diagnostics();
if (diagnostics.hasWarnings()) {
    System.out.println(diagnostics.warnings());
}

DiscreteTokenDatasetPlanDiagnostics ciDiagnostics = plan.diagnostics(
    DiscreteTokenDatasetPlanDiagnosticsPolicy.defaults()
        .withHighPaddingRateThreshold(0.25)
);

DiscreteTokenDatasetPlanReadinessReport readiness = plan.readiness(
    DiscreteTokenDatasetPlanReadinessGate.strict()
);
readiness.requireAccepted();

DiscreteTokenDatasetFingerprint fingerprint = plan.fingerprint();
Map<String, Object> checkpointFingerprintMetadata = fingerprint.toMetadata();
DiscreteTokenDatasetFingerprint expectedFingerprint =
    DiscreteTokenDatasetFingerprint.fromMetadata(checkpointFingerprintMetadata);
DiscreteTokenDatasetFingerprintMatch resumeMatch =
    plan.verifyFingerprint(expectedFingerprint);
resumeMatch.requireMatch();

DiscreteTokenDatasetPlanReport report = plan.report(
    DiscreteTokenDatasetPlanReadinessGate.strict()
);
Map<String, Object> reportMetadata = report.toMetadata();
report.verifyFingerprintMetadataSection(reportMetadata).requireMatch();

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
DiscreteTokenDatasetTrainerCheckpointInspectionReport checkpointInspection =
    DiscreteTokenDatasetTrainerCheckpointBridge.inspectCheckpoints(
        checkpointDir.getParent(),
        checkpointSelection);
checkpointInspection.requireSelectedCheckpoint();
DiscreteTokenDatasetTrainerCheckpointRestorePlan restorePlan =
    checkpointInspection.requireRestorePlan();
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

```

Use this when:

- the dataset mixes multiple structured reasoning tasks
- sequence lengths vary
- training wants deterministic repeatability
- the backend tensor conversion layer should stay separate from data planning

## Invariants

The dataset API validates aggressively:

- examples must have non-empty input and target token sequences
- `knownSolutionCount` must be `-1` or `>= 1`
- batches are rectangular after padding
- masks must exactly match sequence lengths
- split fractions must be finite and in `[0.0, 1.0]`
- validation plus test fraction must not exceed `1.0`
- batch size must be greater than zero

These checks are meant to fail early before a trainer or backend sees malformed
data.
