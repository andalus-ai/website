---
layout: default
title: Training Fast Gate
---

# Training Fast Gate

Gollek training modules can move from advisory coverage into the hard CI gate
through a fast metadata path. The fast gate reads checked-in Gradle settings,
training module build files, the Gradle training gate registry, and the two
training metadata locks. It does not configure the Gradle project, so it is
suited for quick CI preflight and review automation.

Use this page when you need to:

- inspect which training modules are hard-gated
- find tested modules that are still advisory candidates
- promote selected advisory candidates into the hard gate
- validate promotion-plan artifacts in CI or review tooling
- archive machine-readable receipts for training gate changes

## Commands

Run the fast metadata gate from `gollek/`:

```bash
scripts/verify-training-advisory-gates-fast.py
```

Run the contract test for the fast gate itself:

```bash
scripts/test-training-fast-gate.sh
```

Compare the fast metadata reports against the Gradle-generated reports:

```bash
bash scripts/test-training-fast-gradle-parity.sh
```

The parity script normalizes the shared JSON reports from both paths and diffs
them. It also checks one selected-candidate case.

```bash
bash scripts/test-training-fast-gradle-parity.sh \
  --candidate audio,vision \
  --artifact-dir /tmp/gollek-training-gradle-parity
```

`--artifact-dir` keeps raw Gradle/Fast reports, normalized JSON, diff files,
logs, `training-gradle-parity-summary.json`, and a human-readable `README.md`.
If `--candidate` is omitted, the script uses
`GOLLEK_TRAINING_PARITY_CANDIDATES` or the first available advisory candidates
from coverage. If `--artifact-dir` is omitted, it uses
`GOLLEK_TRAINING_PARITY_ARTIFACT_DIR` when set.

CI keeps the fast metadata check and Gradle parity check separate:

- `.github/workflows/training-fast-gate.yml` runs the Gradle-free metadata gate
  for quick registry, lock, and training project preflight.
- `.github/workflows/training-gradle-parity.yml` sets up JDK 25, generates both
  Gradle and fast reports, writes a concise Actions step summary, and uploads
  the parity artifact bundle for review.

Generate reports in a custom directory:

```bash
scripts/verify-training-advisory-gates-fast.py \
  --output-dir /tmp/gollek-training-fast-gate
```

Select advisory candidates by label:

```bash
scripts/verify-training-advisory-gates-fast.py \
  --candidate audio,vision \
  --output-dir /tmp/gollek-training-fast-gate
```

## Promotion Workflow

Generate a dry-run promotion plan without changing the registry or locks:

```bash
scripts/verify-training-advisory-gates-fast.py \
  --candidate audio \
  --promote-selected \
  --dry-run
```

Validate an existing promotion plan:

```bash
scripts/verify-training-advisory-gates-fast.py \
  --validate-promotion-plan build/reports/gollek/training-module-promotion-plan.json
```

Write a validation report for CI artifacts:

```bash
scripts/verify-training-advisory-gates-fast.py \
  --validate-promotion-plan build/reports/gollek/training-module-promotion-plan.json \
  --promotion-plan-validation-report-file build/reports/gollek/training-module-promotion-plan-validation.json
```

Apply an intentional selected-candidate promotion:

```bash
scripts/verify-training-advisory-gates-fast.py \
  --candidate audio \
  --promote-selected
```

Apply mode snapshots the training gate registry plus both training metadata
locks first. If validation or report writing fails after mutation begins, the
script restores those files before exiting.

## Promotion Rules

Promotion is intentionally narrow:

- `--promote-selected` requires concrete `--candidate` labels.
- Empty selection, `all`, and `*` are rejected for promotion.
- Dry-run mode writes a promotion plan but does not edit files.
- Apply mode updates the registry and refreshes both metadata locks.
- Promotion plans include a stable SHA-256 `promotionFingerprint`.
- Validation mode recomputes the fingerprint and rejects stale or edited plans.

The fingerprint is root-independent. It covers:

- the selected advisory candidate rows
- the candidate selection property and value
- the logical mutation targets for the registry and both locks

It does not depend on the absolute checkout path, so the same planned promotion
can be compared across local machines and CI fixtures.

## Artifacts

The fast gate writes these JSON artifacts by default under
`gollek/build/reports/gollek/`.

| File | Format | Purpose |
|------|--------|---------|
| `training-module-checks.json` | `gollek.training.module-checks.v2` | Hard-gated training checks and registry fingerprint |
| `training-module-checks-lock-drift.json` | `gollek.training.module-checks.lock-drift.v1` | Drift between the hard-check registry and checked-in lock |
| `training-module-coverage.json` | `gollek.training.module-coverage.v2` | Training project coverage and advisory candidate discovery |
| `training-module-candidate-selection.json` | `gollek.training.module-candidate-selection.v2` | Selected advisory candidates and follow-up commands |
| `training-module-candidates-lock-drift.json` | `gollek.training.module-candidates.lock-drift.v1` | Drift between advisory candidates and checked-in candidate lock |
| `training-module-fast-gate-summary.json` | `gollek.training.fast-gate-summary.v1` | Aggregate pass/fail summary for CI |
| `training-module-promotion-plan.json` | `gollek.training.promotion-plan.v1` | Selected promotion details, snippets, commands, mutation files, and fingerprint |
| `training-module-promotion-plan-validation.json` | `gollek.training.promotion-plan-validation.v1` | Validation receipt for an existing promotion plan |

Checked-in locks live in:

- `gollek/gradle/training-module-checks.lock.json`
- `gollek/gradle/training-module-candidates.lock.json`

The source registry lives in:

- `gollek/buildSrc/src/main/kotlin/gollek.training-gates.gradle.kts`

## Promotion Plan Contract

`gollek.training.promotion-plan.v1` contains:

| Field | Meaning |
|-------|---------|
| `promotionFingerprintAlgorithm` | Currently `SHA-256` |
| `promotionFingerprint` | Root-independent hash of the selected promotion |
| `selectedLabels` | Advisory labels being promoted |
| `selectedTaskPaths` | Gradle test task paths for the selected candidates |
| `candidateCount` | Number of selected candidates |
| `dryRun` | `true` when the plan did not edit files |
| `applied` | `true` when apply mode completed |
| `transactional` | `true` for applied plans protected by rollback snapshots |
| `mutationFiles` | Registry and lock files that apply mode may mutate |
| `promotionSnippets` | Copy-pasteable `TrainingModuleCheck` entries |
| `commands` | Follow-up validation and Gradle verification commands |

Validation recomputes labels, task paths, snippets, mutation files, and the
fingerprint from the candidate rows. If any of those drift, the plan is
rejected.

## Validation Report Contract

`gollek.training.promotion-plan-validation.v1` is a small receipt for an
existing promotion plan. It contains:

| Field | Meaning |
|-------|---------|
| `passed` | Whether the plan passed contract validation |
| `planFile` | Validated plan path |
| `planFormat` | Format from the plan when available |
| `promotionFingerprint` | Validated plan fingerprint when available |
| `candidateCount` | Candidate count from the plan when available |
| `selectedLabels` | Selected labels from the plan when available |
| `dryRun` / `applied` / `transactional` | Promotion state flags from the plan |
| `error` | Empty on success, validation failure text on failure |

When the validation report flag is supplied, failed validation still writes a
report with `passed=false` and an `error`, which is useful for CI artifact
upload.

## Related Docs

- [Training Docs](/docs/framework/training)
- [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
