---
layout: default
title: Recursive Reasoning Dataset Workflow
parent: Advanced Tutorials
nav_order: 37
---

# Recursive Reasoning Dataset Workflow

This tutorial shows the practical dataset path for structured recursive
reasoning tasks.

Use it when you are building a benchmark adapter such as N-Queens, Graph
Coloring, Sudoku, ARC-style grids, or another discrete reasoning task.

See also:

- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [gollek-ml-recursive-reasoning API Reference](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-recursive-reasoning)

## Step 1: Emit Generic Token Examples

Start by converting benchmark-specific examples into
`DiscreteTokenDatasetExample`.

```java
List<DiscreteTokenDatasetExample> examples = List.of(
    new DiscreteTokenDatasetExample(
        "graph-coloring",
        0,
        new int[] {0, -1, -1, 1},
        new int[] {0, 2, 1, 1},
        3,
        Map.of("nodeCount", 4, "colorCount", 3)
    ),
    new DiscreteTokenDatasetExample(
        "nqueens",
        1,
        new int[] {-1, 2, -1, -1},
        new int[] {1, 2, 0, 3},
        1,
        Map.of("size", 4)
    )
);
```

The generic example record is the handoff point between benchmark adapters and
trainer utilities.

## Step 2: Profile Before Splitting

Profile the full dataset before deciding on batch size or split policy.

```java
DiscreteTokenDatasetProfile profile =
    DiscreteTokenDatasetProfiler.profile(examples);

System.out.println("examples=" + profile.exampleCount());
System.out.println("tasks=" + profile.taskExampleCounts());
System.out.println("max input length=" + profile.inputLengths().maxLength());
System.out.println("known-solution coverage=" + profile.knownSolutionCoverageRate());
```

Use the profile to check:

- whether task distribution looks balanced
- whether token ranges match the benchmark codec
- whether known solution counts are available for coverage metrics
- whether length-sorted batching is likely to reduce padding

## Step 3: Split Deterministically

For the standard path, let the planner build the split and epochs together:

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
System.out.println("status=" + diagnostics.status());
System.out.println("ready=" + diagnostics.isReadyForTraining());
System.out.println("warnings=" + diagnostics.warnings());
System.out.println("task splits=" + diagnostics.taskSplits());
Map<String, Object> datasetMetadata = diagnostics.toMetadata();

DiscreteTokenDatasetPlanDiagnosticsPolicy ciPolicy =
    DiscreteTokenDatasetPlanDiagnosticsPolicy.defaults()
        .withHighPaddingRateThreshold(0.25);
DiscreteTokenDatasetPlanDiagnostics ciDiagnostics =
    plan.diagnostics(ciPolicy);

DiscreteTokenDatasetPlanReadinessReport readiness =
    plan.readiness(DiscreteTokenDatasetPlanReadinessGate.strict());
readiness.requireAccepted();

DiscreteTokenDatasetFingerprint fingerprint = plan.fingerprint();
System.out.println("dataset plan=" + fingerprint.shortValue());

Map<String, Object> checkpointFingerprintMetadata = fingerprint.toMetadata();
DiscreteTokenDatasetFingerprint expectedFingerprint =
    DiscreteTokenDatasetFingerprint.fromMetadata(checkpointFingerprintMetadata);
DiscreteTokenDatasetFingerprintMatch resumeMatch =
    plan.verifyFingerprint(expectedFingerprint);
resumeMatch.requireMatch();

DiscreteTokenDatasetPlanReport report =
    plan.report(DiscreteTokenDatasetPlanReadinessGate.strict());
Map<String, Object> preflightMetadata = report.toMetadata();
report.verifyFingerprintMetadataSection(preflightMetadata).requireMatch();

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
DiscreteTokenDatasetTrainerCheckpointInspectionReport checkpointInspection =
    DiscreteTokenDatasetTrainerCheckpointInspectionReport.inspect(
        checkpointInventory,
        checkpointSelection);
checkpointInspection.requireSelectedCheckpoint();
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

For a mixed benchmark dataset, prefer a task-stratified split.

```java
DiscreteTokenDatasetSplit split =
    DiscreteTokenDatasetSplitter.stratifiedShuffledByFractions(
        examples,
        0.10,
        0.10,
        2026L
    );
```

For a single-task dataset, a regular shuffled split is enough:

```java
DiscreteTokenDatasetSplit split =
    DiscreteTokenDatasetSplitter.shuffledByFractions(
        examples,
        0.10,
        0.10,
        2026L
    );
```

Check each partition:

```java
System.out.println(plan.split().trainProfile().taskExampleCounts());
System.out.println(plan.split().validationProfile().taskExampleCounts());
System.out.println(plan.split().testProfile().taskExampleCounts());
```

## Step 4: Build Trainer Epochs

The planner already built the recommended epochs:

```java
DiscreteTokenDatasetEpoch trainEpoch = plan.trainEpoch();
DiscreteTokenDatasetEpoch validationEpoch = plan.validationEpoch();
DiscreteTokenDatasetEpoch testEpoch = plan.testEpoch();
```

If you are not using the planner, build epochs directly:

```java
DiscreteTokenDatasetEpoch trainEpoch =
    DiscreteTokenDatasetEpochBatcher.lengthSorted(
        split.trainExamples(),
        32,
        -1,
        false
    );
```

Track padding efficiency:

```java
System.out.println("train padding rate=" + plan.diagnostics().trainPaddingRate());
System.out.println("train padding tokens=" + plan.diagnostics().trainPaddingTokenCount());
```

Use diagnostics before a long run to catch empty validation/test splits, dropped
training examples from `dropLast`, missing known-solution counts, or a training
padding rate that is higher than expected. For mixed-task datasets, inspect
`taskSplits()` to confirm each task is represented in the expected partitions.
Use `DiscreteTokenDatasetPlanDiagnosticsPolicy.lenient()` for exploratory
datasets where validation/test or known-solution coverage is intentionally
absent, and a stricter custom threshold for CI or production trainers.
Use `DiscreteTokenDatasetPlanReadinessGate.training()` when warnings should be
reported but not fail a run, or `strict()` when warnings should block CI.
Persist `plan.fingerprint().toMetadata()` with checkpoints so resumed runs can
verify the same config, split, examples, and epoch layout were used.
Use `DiscreteTokenDatasetFingerprint.fromMetadata(...)` to recreate the stored
fingerprint, then call `plan.verifyFingerprint(expected).requireMatch()` or
`plan.verifyFingerprintMetadata(metadata).requireMatch()` before resuming.
When the checkpoint stores the full `plan.report(gate).toMetadata()` payload,
use `verifyFingerprintMetadataSection(reportMetadata)` to read the nested
`fingerprint` section directly.
Use `plan.report(gate)` when checkpoint metadata should include the fingerprint,
diagnostics, and readiness decision together.
Use `DiscreteTokenDatasetCheckpointManifest.builder(report)` when the checkpoint
also needs experiment identity, run id, seed, step, and custom attributes.
Use `DiscreteTokenDatasetCheckpointManifestSnapshot.fromMetadata(metadata)` when
resume code needs to verify a persisted checkpoint manifest before loading
weights or trainer state.
Use `snapshot.resumeReport(plan).requireReady()` when the resume path should
perform schema, dataset readiness, and fingerprint checks as one preflight gate.
Use `DiscreteTokenDatasetCheckpointResumeExpectation.builder()` when resume code
should also pin experiment identity, run id, model family, seed, or minimum
checkpoint step.
Pass `snapshot.resumeReport(currentReport, expectation)` when the current run
should also fail if its freshly materialized report is blocked by a stricter
readiness gate.
Use `DiscreteTokenDatasetCheckpointResumePolicy.strict().withExpectation(...)`
when trainer resume code wants one reusable gate that creates the current
preflight report, checks identity, and fails fast before checkpoint state loads.
Policy-evaluated resume reports include `policyTracked()` and `policyMetadata()`
so audit payloads can record the gate and expectations that made the decision.
Use `resumePolicy.toMetadata()` and
`DiscreteTokenDatasetCheckpointResumePolicy.fromMetadata(...)` when resume
policy settings come from trainer config, CI payloads, or checkpoint metadata.
Use `DiscreteTokenDatasetCheckpointMetadataJson.write(...)`, `read(...)`, and
`readSnapshot(...)` when those metadata maps should be persisted as stable JSON
checkpoint artifacts without adding a JSON runtime dependency.
Use `DiscreteTokenDatasetCheckpointResumeReportSnapshot.fromMetadata(...)` or
`DiscreteTokenDatasetTrainerCheckpointBridge.readResumeReportSnapshot(...)` when
CI, dashboards, or extensions need to inspect the persisted resume audit later
without rebuilding the dataset plan.
Use `DiscreteTokenDatasetTrainerCheckpointBridge.readCheckpointSnapshot(...)`
when those tools should inspect the manifest and optional resume report sidecars
together and distinguish manifest-only, ready, and blocked checkpoint states.
Use `DiscreteTokenDatasetTrainerCheckpointInventory.scan(rootDir)` when CI or a
dashboard should scan a parent directory of checkpoint runs and keep corrupt
sidecars as read failures while still reporting the healthy runs.
Use `DiscreteTokenDatasetTrainerCheckpointSelectionPolicy.latestReady()` when
manifest-only checkpoints are acceptable, or `latestResumeReady()` when a
restore must have an already persisted ready resume audit. Add
`withExpectation(...)` to require the selected run, model family, seed, or
checkpoint step.
Use `DiscreteTokenDatasetTrainerCheckpointInspectionReport.inspect(...)` when a
JBang inspector, CI job, or dashboard should show the selected restore target
alongside accepted and rejected checkpoint candidates.
Use `DiscreteTokenDatasetTrainerCheckpointRestorePlan` or the inspector
`restore` section when resume code needs a compact handoff payload with the
checkpoint paths, run identity, selection policy, and resume-report status.
Use `DiscreteTokenDatasetTrainerCheckpointRestorePreflight` when resume code
needs the final current-plan decision before opening checkpoint state. This
catches cases where the selected checkpoint identity is acceptable but the
fresh dataset fingerprint or readiness gate no longer matches.
For terminal/CI flows, use the checkpoint inspector `preflight` section with
`currentReport=...`; the report file can be a direct dataset plan report,
checkpoint manifest, provenance metadata payload, or prior restore preflight
JSON.
Use the sibling `explain currentReport=...` section when the workflow needs a
short, categorized decision payload with a primary finding code and suggested
next steps.
Use `lineageChain` for the selected checkpoint's resolved root-to-leaf ancestry
and `lineageGraph` when CI should fail or warn on duplicate run ids, missing
parents, ambiguous parent references, parent identity mismatches, or cycles
across the checkpoint root. Use `lineageHealth` when CI needs the same health
gate without the full node list; read `issueDetails` for the affected checkpoint
paths, stable issue codes, severity, blocking status, actions, and mismatch
reasons. Use the top-level `kind` and `schemaVersion` fields to pin the health
payload contract in CI or dashboard parsers. Java consumers can rehydrate the
same payload with `DiscreteTokenDatasetCheckpointLineageHealthSnapshot` instead
of parsing raw maps, or publish the bundled JSON Schema from
`jsonSchemaMetadata()` for external validators. Use the inspector's
`lineageHealthValidation` section, or
`DiscreteTokenDatasetCheckpointLineageHealthValidationReport` from Java, when
CI needs a compact valid/invalid payload rather than the full health payload.
Use `lineageHealthSchema` or `lineageHealthValidationSchema` when the same
workflow needs a single schema, `lineageHealthSchemaCatalog` for compact
contract discovery, `lineageHealthSchemas` when it should discover both health
contracts with embedded schemas, and `lineageHealthSchemaCatalogSchema` when
the catalog shape itself should be pinned. The catalog includes a bundle-level
`schemaSetSha256`, per-schema SHA-256 digests, and byte counts for drift checks.
Use `lineageHealthSchemaLock` for the smallest stable lock payload and
`lineageHealthSchemaLockSchema` when that lock shape should be pinned too. Use
`lineageHealthSchemaLockValidation schemaLock=/path/to/lock.json` to compare a
saved lock against the current schema bundle before automation consumes a
lineage-health payload, add `requireSchemaLockValid=true` when drift should fail
the command, and `lineageHealthSchemaLockValidationSchema` to pin the validator
report shape. The validation report includes its schema id/resource and both
lock-schema ids, which keeps archived CI logs self-describing.
Use `issueCodes`,
`issueDetailCount`, and `blockingIssueCount` for compact CI summaries, and
`primaryIssueCode` with `primaryIssueAction` for the headline failure. Use
`healthScore`, `alertLevel`, and `healthBadge` when a dashboard needs a compact
lineage status pill. Use `checks`, `failingChecks`, and `checkSummary` when it
needs category-level lineage invariant rows, primary failing-check identity,
type, action, full check payload, or severity rollups; those priority-aware
primary failing-check fields are also mirrored at the top level of
`lineageHealth`.
Add `requireLineageHealthy=true` in inspector commands, or
`withFailOnLineageIssues(true)` in Java selection policies, when unhealthy
lineage should block checkpoint selection.
Use the checkpoint demo's `clean lineage-unhealthy` mode when CI examples need
a deterministic missing-parent fixture for `lineageHealth` failure payloads.
Keep the default `resumeMode=strict` for normal training. Use
`resumeMode=compatible` for warning-only current-plan gates, and
`resumeMode=force` only when a research/debug run intentionally accepts
compatibility warnings.
Use `DiscreteTokenDatasetTrainerProvenanceSpec.builder(checkpointDir, plan)`
for the normal trainer integration path: it creates the report, manifest,
resume policy, checkpoint sidecar helpers, restore-plan selection helpers, and
lifecycle listener from one reusable object.
Use `DiscreteTokenDatasetTrainerCheckpointBridge.writeManifest(...)`,
`requireResumeReadyAndWriteReport(...)`, and `attachToTrainingMetadata(...)`
when recursive-reasoning dataset provenance should live beside the normal
trainer checkpoint files and appear in trainer summary metadata.
Use `DiscreteTokenDatasetTrainerProvenanceListener.builder(...)` when that same
workflow should run from trainer lifecycle callbacks and fail fast before
training overwrites an incompatible dataset manifest.
Use `toMetadata()` when the trainer needs to persist the dataset-plan health
next to checkpoints or reports.

## Step 5: Convert One Batch To Backend Tensors

`DiscreteTokenDatasetBatch` is still Java-array based. Convert it at the last
responsible moment.

```java
DiscreteTokenDatasetBatch batch = trainEpoch.batches().get(0);

int[][] inputIds = batch.inputTokens();
int[][] targetIds = batch.targetTokens();
int[][] inputMask = batch.inputMask();
int[][] targetMask = batch.targetMask();
```

From here, a concrete trainer can convert arrays into the tensor backend it
owns:

- Gollek tensor/autograd tensors
- ONNX input tensors
- SafeTensor-backed model inputs
- LiteRT or GGUF runner inputs
- external research tensors

The dataset API does not pick that backend for you.

## Step 6: Keep Evaluation Metadata

Known solution counts and metadata stay available through the batch:

```java
for (int row = 0; row < batch.batchSize(); row++) {
    if (batch.hasKnownSolutionCount(row)) {
        int solutions = batch.knownSolutionCounts()[row];
        Map<String, Object> metadata = batch.metadata().get(row);
        // attach to trainer reports or coverage evaluation
    }
}
```

This is important for GRAM-style width-scaling experiments, where valid-rate
and unique-solution coverage are usually as important as the scalar loss.

## Recommended Policy

For first experiments:

| Stage | Recommendation |
|-------|----------------|
| Dataset shape | `DiscreteTokenDatasetExample` |
| Standard planner | `DiscreteTokenDatasetPlanner.plan(...)` |
| Planner config | `DiscreteTokenDatasetPlanConfig.stratifiedLengthSorted(...)` |
| Pre-training checks | `plan.diagnostics()` |
| Manual diagnostics | `DiscreteTokenDatasetProfiler.profile(...)` |
| Manual mixed task split | `stratifiedShuffledByFractions(..., seed)` |
| Manual training epoch | `lengthSorted(..., batchSize, padToken, dropLast)` |
| Tensor conversion | trainer-owned adapter after batching |

## Next Step

After the dataset workflow works, wire the batches into a model-specific
trainer adapter. Keep the benchmark codec, dataset planning, tensor conversion,
and model forward pass as separate layers so future tasks can reuse the same
dataset path.
