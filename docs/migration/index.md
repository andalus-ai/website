---
layout: default
title: Documentation ownership and migration map
permalink: /docs/migration/
---

# Documentation ownership and migration map

This page is the working index for migrating the former Gollek documentation into the current Andalus AI project boundaries. It records where current documentation lives, what can be reused, and what must be audited before being presented as current guidance.

**Migration rule:** project repositories are the source of truth for current APIs, build instructions and capability status. A historical Gollek page is not current merely because it still builds or appears in the website.

## Current project documentation

### Aljabr — Java ML framework

**Owns:** reusable tensor and numerical APIs, operators, model abstractions, compute backends, format/tokenizer foundations and low-level native interoperability.

Start with the canonical repository documents:

- [Aljabr README](https://github.com/andalus-ai/aljabr/blob/main/README.md) — project scope, build requirements, published modules and capability caveats.
- [Framework architecture](https://github.com/andalus-ai/aljabr/blob/main/docs/architecture/FRAMEWORK_ARCHITECTURE.md) — reusable framework boundaries and compute layers.
- [Computational framework scope](https://github.com/andalus-ai/aljabr/blob/main/docs/architecture/COMPUTATIONAL_FRAMEWORK_SCOPE.md) — broader mathematical, numerical, statistical and ML scope; explicitly a target taxonomy, not a feature-completion claim.
- [Research and training readiness audit](https://github.com/andalus-ai/aljabr/blob/main/docs/architecture/RESEARCH_TRAINING_READINESS.md) — current gaps that must be resolved before advertising training primitives as supported.
- [Tensor research quickstart](https://github.com/andalus-ai/aljabr/blob/main/docs/examples/TENSOR_RESEARCH_QUICKSTART.md) — example material to validate before publishing as a website tutorial.

### Tafkir — training and adaptation

**Owns:** training workflows, dataset/training pipelines, fine-tuning and adaptation orchestration, experiment workflows and training-oriented integrations built on Aljabr.

The repository contains useful module-level material and Jupyter/JBang integration documentation, but its top-level README and some older training READMEs still contain legacy product diagrams, repository links or claims that need reconciliation with the current architecture.

Start with:

- [Tafkir repository](https://github.com/andalus-ai/tafkir)
- [Quantization integration boundary](https://github.com/andalus-ai/tafkir/blob/main/docs/architecture/ALJABR_QUANTIZATION_INTEGRATION.md) — explicit Aljabr SPI / Tafkir implementation ownership.
- [Jupyter kernel README](https://github.com/andalus-ai/tafkir/blob/main/ecosystem/jupyter/tafkir-jupyter-kernel/README.md) — current source location to audit; verify its examples and SDK bindings before treating them as supported.
- [Training module README](https://github.com/andalus-ai/tafkir/blob/main/training/README.md) — currently legacy Aljabr-branded material; do not migrate as Tafkir documentation without rewriting and source validation.

### AQLI — inference runtime

**Owns:** inference runners and adapters, model repository/download policy, request lifecycle, generation policy, scheduling, streaming, serving APIs, CLI and deployment operations.

Start with:

- [AQLI README](https://github.com/andalus-ai/aqli/blob/main/README.md) — current product scope, quickstart caveats and repository map.
- [System architecture](https://github.com/andalus-ai/aqli/blob/main/docs/architecture/SYSTEM_ARCHITECTURE.md) — Aljabr/AQLI/Tafkir boundaries and migration rules.
- [Module ownership matrix](https://github.com/andalus-ai/aqli/blob/main/docs/architecture/MODULE_OWNERSHIP_MATRIX.md) — canonical owner and acceptance evidence for overlap candidates.
- [Quickstart](https://github.com/andalus-ai/aqli/blob/main/docs/QUICKSTART.md), [API examples](https://github.com/andalus-ai/aqli/blob/main/docs/API_EXAMPLES.md), and [observability guide](https://github.com/andalus-ai/aqli/blob/main/docs/OBSERVABILITY.md) — candidate user-facing guides; verify commands and signatures against the current CLI/SDK before publishing.

## Legacy website content: migration decisions

| Existing website area | Target owner | Migration treatment |
|---|---|---|
| `docs/framework/` tensor, operators, model abstractions, compute and backend guides | Aljabr | Reconcile each page with current Aljabr modules and APIs; split out training workflow material for Tafkir. |
| `docs/framework/` training, trainer, dataset and fine-tuning guides | Tafkir + Aljabr | Aljabr owns reusable computation; Tafkir owns workflow orchestration. Rewrite examples against current Tafkir APIs. |
| `docs/runtime/` request lifecycle, serving, CLI, model repository and deployment guides | AQLI | Migrate only after checking current runner, CLI and service behavior. |
| `docs/runtime/` generic tensors, kernels, backend APIs and native FFM guides | Aljabr | Keep serving policy and AQLI runner lifecycle out of these framework guides. |
| `docs/setup/` CLI installation and command reference | AQLI | Replace old Gollek commands with versioned AQLI instructions after validating installer and CLI help. |
| `docs/setup/` JBang and notebook guides | Aljabr / Tafkir / AQLI | Separate examples by task; do not make notebook tooling a framework/runtime dependency. |
| `docs/tutorials/basic/` tensor and neural-network tutorials | Aljabr | Rebuild against a published or tested Aljabr API. |
| `docs/tutorials/intermediate/` model training and data-pipeline tutorials | Tafkir + Aljabr | Separate framework primitives from training workflow APIs. |
| `docs/tutorials/advanced/` inference, serving and native-runtime tutorials | AQLI + Aljabr | AQLI owns request/serving steps; Aljabr owns reusable compute/backend setup. |
| `docs/api-references/0.1.0-SNAPSHOT/` generated Gollek API pages | Historical archive | Do not relabel generated package references. Regenerate from current published artifacts after API review. |
| `docs/plugins/` and `docs/extensions/` | Per capability | Assign each plugin to the project that owns the extension point; preserve explicit optional dependency boundaries. |
| Gollek release notes and old SDK feature/status pages | Historical archive | Preserve as history; annotate old versions and do not imply current support. |

## Migration sequence

1. **Inventory and classify** — map every legacy page to an owner, status and current source.
2. **Aljabr foundation docs** — migrate framework concepts and verified tensor/backend examples first.
3. **AQLI runtime docs** — migrate quickstart, CLI, SDK, runner and serving guides against current interfaces.
4. **Tafkir training docs** — migrate datasets, trainer, fine-tuning, evaluation, JBang and Jupyter material after reconciling its legacy README and module documentation.
5. **Shared guides** — document model artifacts, compatibility, Java setup, Gradle/Maven consumption and cross-project architecture.
6. **Historical archive** — retain old release notes and generated references with explicit historical labels.

## Acceptance criteria for a migrated page

- It names the owning project and links to its canonical repository.
- Commands, artifact coordinates, Java baseline and API examples are checked against the current source or published release.
- Capability statements distinguish implemented, tested, experimental and planned behavior.
- Examples have a reproducible build/run path or are clearly marked as illustrative.
- Cross-project dependencies follow the rule: **AQLI → Aljabr; Tafkir → Aljabr; no AQLI ↔ Tafkir dependency.**
- The Jekyll build and local-link validation pass.

This map is an audit plan, not a claim that the legacy pages have already been migrated.
