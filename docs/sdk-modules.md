---
layout: default
title: ML Framework Modules
---

# Gollek ML Framework Modules

This page replaces the older "SDK modules" view.

Gollek is moving toward a Gradle-only module layout with:

- `ml/*` for the Java ML framework itself
- `trainer/*` for training lifecycle and orchestration
- `integration/*` for JBang, Jupyter, LangChain4j, and other adapters

Older `gollek-sdk-*` names still appear in some examples and historical docs, but they should be treated as compatibility surfaces during the migration, not the canonical structure.

This page intentionally stays at `/docs/sdk-modules.md` so older links do not
break, but the content is now about the broader Gollek platform module naming,
not just the SDK layer.

---

## Build and Install Path

For local development installs on macOS, use:

- `./run-install-local-macos.sh`

This path now runs a Gradle-only install flow by default. Legacy Maven command
fallback is intentionally removed from the default installer path to keep build
behavior consistent.

---

## Platform Naming Rules

Gollek should use distinct naming families for distinct responsibilities.

| Family | Canonical naming | Purpose |
|---|---|---|
| Inference and serving | `gollek-backend-*`, `gollek-runner-*`, `gollek-plugin-runner-*`, `gollek-provider-*`, `gollek-spi-*` | runtime engine, hardware adapters, format runners, serving contracts |
| Client and application SDK | `gollek-sdk-*` | application-facing SDKs, sessions, local/remote client access |
| Java ML framework | `gollek-ml-*` | model building, data, optimization, export, hub, framework utilities |
| Trainer | `gollek-trainer-*` | training lifecycle, experiment orchestration, trainer runtime contracts |
| Integrations | `gollek-integration-*` | JBang, Jupyter, LangChain4j, and other adapters |

### Jupyter Integration

The Jupyter adapter is documented as
[`gollek-integration-jupyter`](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-integration-jupyter).
It is a standalone Gollek Java kernel with preloaded ML helpers, rich notebook
outputs, dependency magics, and artifact-inspection commands such as `%tree`,
`%du`, `%zipls`, `%tarls`, `%extract`, and `%sha256`. Its CSV/TSV magics also
support dataframe-style previews with `-n` row limits, `--profile` column
stats, `%sample` random row checks, `%sort` top/bottom row previews,
`%filter` row subsets, `%describe` numeric summaries, `%schema` dtype-style
inference, `%missing` missingness checks, `%valuecounts` categorical counts,
`%scatter` relationship checks, `%groupby` grouped summaries, `%lineplot`
inline SVG trends, and `%hist` distribution checks, plus `%corr --heatmap`
Pearson correlation matrices from CSV/TSV artifacts.

That split matches the Gollek vision:

- inference/serving is the core identity
- Java ML/training is a first-class framework layer
- SDKs and integrations are adapters around those cores, not the core itself

---

## Inference and Serving

For the serving side, prefer these naming patterns:

- `backend/*`
  - hardware-specific acceleration surfaces such as Metal, CUDA, ROCm, Vulkan
- `runner/*`
  - model-format execution adapters such as GGUF, Safetensor, ONNX, LiteRT
- `provider/*` and `spi/*`
  - provider routing and runtime contracts
- `sdk/*`
  - application-facing client access, not the ML framework itself

Architecture naming should also stay explicit:

- `native-java`
  - preferred long-term path where Gollek handles execution in Java directly
- `binding`
  - short-term compatibility and fallback path for llama.cpp, libtorch, LiteRT, ONNX runtime, and similar native bridges

For mobile and portable library usage, the most natural naming surfaces are:

- `:runner:onnx:*`
- `:runner:litert:*`

Those are the right places to emphasize Quarkus/GraalVM portability and
platform-specific delivery.

---

## Canonical Layout

### Core ML Framework

| Canonical Gradle module | Role |
|---|---|
| `:ml:gollek-ml-api` | umbrella framework entrypoint |
| `:ml:gollek-ml-core` | shared estimator and transformer foundations |
| `:ml:gollek-ml-selection` | metrics, cross-validation, model selection |
| `:ml:gollek-ml-data` | dataset and dataloader APIs |
| `:ml:gollek-ml-diffusion-api` | diffusion-training contracts for Java task, prompt, scheduler, and session APIs |
| `:ml:gollek-ml-diffusion-opd` | Java implementation scaffold for DiffusionOPD-style multi-task distillation |
| `:ml:gollek-ml-runner-api` | runner abstraction for ONNX, LiteRT, and future adapters |

For diffusion alignment, Gollek now exposes a Java-first OPD surface described in:

- [DiffusionOPD in Gollek](/docs/framework/diffusion-opd)

Current public training data and metric conveniences live behind
`tech.kayys.gollek.ml.Gollek.DL`:

- `TrainingPreset.REGRESSION_HUBER_*`, `huberLoss(...)`, and
  `trainingOptions().regressionMetrics()` support outlier-tolerant regression
  with MAE, MSE, RMSE, and R2 reporting.
- `trainingOptions().checkpointDir(...).restoreBestModelAtEnd()` saves
  validation-driven best-model snapshots to `canonical-best-model.safetensors`
  and reloads the best epoch before returning. By default the monitor is
  validation loss, but `.bestModelMonitorMetric("f1", BestModelMonitorMode.MAX)`
  can select by a named validation metric such as F1, accuracy, AUROC, or
  average precision.
- `trainingOptions().earlyStopping(...).earlyStoppingMonitorMetric(...)` uses
  the same validation metric stream to stop by task quality, so classification
  runs can stop on F1 or AUROC while regression runs keep the validation-loss
  default.
- `TrainingSummary.metadata().get("epochHistory")` gives one row per completed
  epoch with train/validation losses, metric values, learning rate, optimizer
  steps, and scheduler steps for dashboards and reproducible debugging.
- `trainingOptions().stepLrBatches(...)`, `.cosineAnnealingLrBatches(...)`,
  `.warmupCosineLrBatches(...)`, and their `Epochs` variants expose public
  scheduler policies for one-call `fit(...)`. Warmup/cosine starts new runs at
  LR `0.0`, supports scheduler checkpoint resume, and reports
  `learningRateSchedulerState.*` metadata.
- `trainingOptions().reduceLrOnPlateauValidationLoss(...)` lowers LR when
  validation loss stalls, while `.reduceLrOnPlateauMetric(...)` can follow a
  named validation metric. Plateau state is checkpointed and reported through
  `learningRateSchedulerState.*`.
- Summary and history metadata include gradient/parameter diagnostics such as
  `latestGradientL2NormBeforeClip`, `latestGradientL2Norm`,
  `latestGradientClipped`, and `latestParameterL2Norm`, making exploding or
  clipped gradients visible in ordinary SDK runs.
- The trainer has a non-finite guard for NaN/Inf loss and gradients. It fails
  before unsafe backward/optimizer updates, clears pending gradients, avoids
  writing corrupted checkpoints, and reports `nonFinite*` metadata plus a
  `stopReason` such as `non-finite-train-loss`.
- Summary and history metadata also include train/validation throughput
  counters such as `trainBatchCount`, `trainSampleCount`,
  `trainSamplesPerSecond`, `validationBatchCount`, and
  `validationSamplesPerSecond`.
- When `checkpointDir(...)` is set, the same history is persisted as
  `canonical-history.csv` beside the checkpoint files for spreadsheet-friendly
  learning-curve inspection. Resumed runs reload existing rows and append new
  epochs so interrupted training keeps a continuous curve. Nested metric maps
  and detailed diagnostics are encoded as deterministic JSON cells, so
  dashboards can parse confusion matrices and similar payloads without scraping
  Java `Map.toString()` text. Malformed structured cells are surfaced through
  `trainingHistoryLoadError` and rejected by strict resume. Duplicate headers,
  blank headers, and rows with extra cells are treated as ambiguous history
  shape errors instead of being silently overwritten or ignored. The `epoch`
  column is required and must contain unique non-negative integers.
- The checkpoint directory also receives `canonical-report.json`, a structured
  trainer report with final summary fields, epoch history, metric maps,
  checkpoint state, accelerator metadata, gradient diagnostics, and throughput
  counters for CLIs, dashboards, and JBang examples.
- Optimizer checkpoints now preserve SGD momentum, Adam/AdamW moments, and
  RMSprop accumulators/velocity so `resumeFromCheckpoint()` can continue
  optimizer dynamics instead of only restoring model weights.
- Optimizers and `GradientClipper` now validate finite hyperparameters,
  parameter values, and gradients before mutating state. Adam L2 weight decay
  leaves gradient buffers intact, and Adagrad applies weight decay uniformly
  across the full tensor.
- StepLR, CosineAnnealingLR, WarmupCosineScheduler, and ReduceLROnPlateau now
  validate finite scheduler configuration and checkpoint payloads before
  restoring resumed learning rates, rejecting NaN LRs, negative counters, and
  infinite plateau metrics.
- Trainer summaries now expose partial-resume diagnostics for checkpoint
  artifacts, so users can see whether model, optimizer, scheduler, GradScaler,
  or history files were missing when resume began even if the run recreates
  them later. Strict resume now fails closed on missing runtime state or
  required artifacts, while lenient loading records `checkpointResumePartial`
  and the missing names.
- Model checkpoints now write `canonical-model.metadata` beside
  `canonical-model.safetensors`. Resume validates model class and parameter
  signatures plus byte-size/SHA-256 integrity when metadata exists, fails fast
  by default on incompatible or corrupted snapshots, and records
  `checkpointResumeCompatibilityMismatches` when lenient checkpoint loading is
  explicitly enabled.
- Checkpoint directories now also write `canonical-checkpoints.metadata`, a
  byte-size/SHA-256 manifest for runtime, optimizer, scheduler, GradScaler,
  history, report, and model artifacts. Resume validates runtime-state files
  before deserializing them, so corrupted runtime/optimizer/scheduler state
  fails closed by default and is reported through lenient compatibility
  diagnostics. Best-model restore-at-end uses the same manifest guard before
  replacing current weights.
- Train and validation batches now validate non-null, non-empty,
  sample-aligned, finite input/label tensors before forward or loss execution,
  so malformed or NaN/Infinity dataset values fail before they can poison
  gradients, optimizer state, or validation metrics.
- Custom trainer loss functions must return a single-value tensor. Vector or
  matrix losses now fail before `backward()`, surfacing `invalidLossShape`
  instead of logging one value while autograd propagates another reduction.
- Trainer model outputs are validated before loss and metric evaluation, so
  NaN/Infinity predictions fail as `nonFiniteKind=prediction` instead of
  leaking into custom losses or validation metrics.
- Trainer metric snapshots now validate finite values after real
  train/validation batches have run. Duplicate names, NaN/Infinity, or throwing
  custom metrics stop the run, and `DetailedMetric` payloads are guarded the
  same way. Failures report `invalidMetric*` metadata and skip final checkpoint
  writes, while empty train/validation phases may remain undefined for
  compatibility.
- Trainer metric contracts are now standalone `TrainingMetric` and
  `DetailedTrainingMetric` APIs, with `TrainingMetrics` as the public built-in
  catalog. Built-ins are split internally by regression, binary, multiclass,
  and multilabel metric families. The legacy `CanonicalTrainer.Metric`,
  `.DetailedMetric`, and `.Metrics` names remain as compatibility aliases
  instead of owning the implementation.
- `QuantizationEngine` now uses real supplied weights: either direct in-memory
  tensors or a simple text weight file. Missing model files fail fast instead
  of generating placeholder weights, and the output artifact includes quantized
  codes, dequantized values, compression estimates, and error metrics.
- `GradScaler` now performs real mixed-precision loss scaling: callers
  backpropagate the returned scaled loss, unscale optimizer/parameter
  gradients, skip unsafe steps on NaN/Inf, and let the scale grow/back off from
  observed overflow. The scaler can now be checkpointed/resumed with
  compatibility validation and overflow-safe unscale writes.
- `CanonicalTrainer.Builder.mixedPrecision(true)`, `.gradScaler(...)`, and
  `trainingOptions().mixedPrecision()` now use that scaler during the actual
  trainer step. Public `trainingOptions().gradScaler(customScaler)` /
  `.mixedPrecision(customScaler)` can tune the initial scale and growth policy,
  while overflowed updates are skipped and `canonical-grad-scaler.state`
  persists scaler state for resume. Incompatible saved scaler policies fail
  closed by default, with opt-in lenient loading surfacing the mismatch in
  trainer metadata and `gradScalerCheckpointFallbackUsed`.
- `GradTensor` now differentiates common composed training graphs including
  view ops, `sum`/`mean`, `pow`, unary math/activation ops, and last-dimension
  `softmax`, so custom Java losses can rely on autograd instead of manual hooks
  for basic expressions.
- `Gollek.cat(...)`, `Gollek.stack(...)`, and `Gollek.where(...)` now keep
  autograd links alive through concatenation, stacking, and broadcasted
  selection paths.
- Transformer attention compatibility einsums (`bhid,bhjd->bhij` and
  `bhij,bhjd->bhid`) now keep gradients connected through attention score and
  context application paths for Java-side transformer training.
- Public `MultiHeadAttention` keeps gradients through head split/merge reshapes
  and causal masks, and `TransformerBlock` dropout now applies a differentiable
  mask instead of returning detached tensors.
- `FlashAttention` uses differentiable exact attention when gradients are
  tracked, while the no-grad tiled inference path keeps its memory-efficient
  loop and correctly merges multi-head output order.
- `MultiHeadAttention(..., dropoutP)` now applies attention-probability
  dropout after softmax, and transformer encoder/decoder layers pass their
  dropout setting into internal self/cross attention modules.
- `TransformerBlock` now uses a registered GELU feed-forward activation, so
  the implementation matches the documented transformer FFN instead of silently
  behaving like a ReLU block.
- `RotaryEmbedding.apply(...)` now keeps RoPE gradients connected via the
  inverse rotation and validates rank, head dimension, and max sequence length
  before using the frequency cache.
- Root `tech.kayys.gollek.ml.nn.GroupNorm` now preserves gradients through
  differentiable reshape/mean/variance tensor ops and validates group/channel
  configuration before training.
- `Dropout` now rejects non-finite probabilities and handles `p=1` as an
  explicit zero-output/zero-gradient path, while layer `GroupNorm` validates
  group counts, epsilon, rank, and channel count.
- Weighted `CrossEntropyLoss` now uses sample-weight mean normalization for
  both scalar loss and logits gradients instead of scaling by raw batch size.
- CrossEntropy, Focal, LabelSmoothing, ArcFace, and CTC losses now validate
  class-index targets so wrongly-shaped, `NaN`, fractional, or out-of-range
  labels fail before training indexes logits.
- CrossEntropy, LabelSmoothing, BCE-with-logits, and focal losses now reject
  non-finite logits before softmax/sigmoid loss computation, preventing bad
  activations from entering the trainer graph as silent `NaN` gradients.
- `FocalLoss` and `BinaryFocalWithLogitsLoss` now reject empty or non-finite
  logits before focal weighting, with finite-difference coverage for
  positive-weighted binary/multi-label focal gradients.
- Regression losses (`MSELoss`, `L1Loss`, `SmoothL1Loss`, `HuberLoss`) now
  reject empty tensors and NaN/Inf predictions or targets before loss/gradient
  computation, and `SmoothL1Loss` uses standard beta-scaled semantics.
- `LabelSmoothingLoss` now keeps gradients connected with the standard
  `softmax - smoothedTarget` backward path for calibrated classification
  training.
- `BCEWithLogitsLoss` now uses a stable softplus formulation, preserving large
  losses for confident wrong binary predictions and rejecting non-finite logits
  or invalid targets before training.
- `DiceLoss` now backpropagates the overlap objective for segmentation training
  and validates probability predictions, binary masks, matching shapes, and
  smoothing values.
- `IoULoss` now backpropagates through predicted bounding boxes and validates
  `[batch, 4]` finite, ordered coordinates before computing object-detection
  overlap loss.
- `TripletLoss` now backpropagates active margin violations to anchor,
  positive, and negative embeddings and validates matching `[batch, dim]`
  embedding tensors.
- `ContrastiveLoss` now backpropagates positive pairs and active negative
  margin violations while validating binary labels and matching `[batch, dim]`
  embedding tensors.
- `CosineEmbeddingLoss` now backpropagates positive and active negative cosine
  pairs while validating strict `1.0`/`-1.0` labels, margin bounds, and
  matching `[batch, dim]` embedding tensors.
- `CTCLoss` now backpropagates log-probability inputs using log-space
  forward-backward posteriors and rejects blank/impossible target alignments
  before training.
- `ArcFaceLoss` now backpropagates through feature embeddings and learned class
  centers, including normalization and angular-margin derivatives.
- `KnowledgeDistillation` now trains student models from both soft teacher
  distributions and hard labels using teacher-to-student KL plus CrossEntropy,
  with teacher logits detached and student gradients preserved.
- The default CPU NN backend now implements depthwise convolution, image
  resize/crop/normalize, scaled dot-product attention, and multi-head attention
  instead of returning null for these runtime paths.
- `classificationDataLoader(...)` and `classificationTrainValidationSplit(...)`
  accept Java `int[]` labels and produce CrossEntropy-compatible class-index
  tensors.
- `classificationStratifiedTrainValidationSplit(...)` and
  `binaryStratifiedTrainValidationSplit(...)` preserve class/binary label
  coverage across train and validation sets for small classification datasets.
- `multiLabelBinaryStratifiedTrainValidationSplit(...)` balances per-label
  positive counts while preserving exact train/validation sizes for
  multi-label BCE datasets.
- `trainingOptions().classificationMetrics()` records accuracy, macro
  precision, macro recall, and macro F1 into `TrainingSummary.metadata()`.
- `confusionMatrixMetric()` / `trainingOptions().confusionMatrixMetric()`
  records scalar `confusion_matrix_accuracy` plus structured matrix details in
  summary metadata, epoch history, `canonical-history.csv`, and
  `canonical-report.json`. Rows represent actual classes and columns represent
  predicted classes.
- `trainingOptions().topKAccuracyMetric(k)` records top-k accuracy, such as
  `top2_accuracy` or `top5_accuracy`, for logits shaped `[batch, classes]`.
- `classificationMacroRocAucMetric()`,
  `classificationMacroAveragePrecisionMetric()`, and
  `trainingOptions().classificationRankingMetrics()` report one-vs-rest
  multi-class ranking quality directly from CrossEntropy-style logits.
- `classWeights(...)` derives balanced weights for imbalanced multi-class
  datasets, `classWeightsFor(numClasses, ...)` supports explicit class counts,
  and `trainingOptions().crossEntropyClassWeights(...)` applies those weights
  to the one-call CrossEntropy trainer preset path.
- `TrainingPreset.CLASSIFICATION_FOCAL_*`, `focalLoss(...)`, and
  `trainingOptions().focalGamma(...)` / `.focalClassWeights(...)` support
  focal-loss classification for hard-example-focused imbalanced training, with
  finite-logit validation before softmax/focal weighting.
- `TrainingPreset.BINARY_FOCAL_WITH_LOGITS_*`,
  `binaryFocalWithLogitsLoss(...)`, and `trainingOptions().focalGamma(...)` /
  `.focalAlpha(...)` combine focal hard-example weighting with existing
  `.bcePositiveWeight(...)` / `.bcePositiveWeights(...)` controls for
  imbalanced binary and multi-label training, with finite-logit validation and
  tested positive-weight gradients.
- `binaryDataLoader(...)`, `binaryTrainValidationSplit(...)`,
  `binaryStratifiedTrainValidationSplit(...)`, and
  `TrainingPreset.BINARY_BCE_WITH_LOGITS_*` support one-output binary
  classifiers using BCE-with-logits targets shaped `[batch, 1]`.
- `binaryPositiveWeight(...)` derives `negatives / positives` for imbalanced
  binary datasets, and `trainingOptions().bcePositiveWeight(...)` applies it
  to the one-call BCE trainer preset path.
- `trainingOptions().binaryClassificationMetrics()` records thresholded
  binary accuracy, precision, recall, and F1 using logit `0.0` as the
  probability `0.5` boundary.
- `binaryAccuracyMetric(logitThreshold)`, `binaryF1Metric(logitThreshold)`,
  and `trainingOptions().binaryClassificationMetrics(logitThreshold)` evaluate
  binary BCE/focal logits at deployment-specific operating points.
- `binaryConfusionMatrixMetric(logitThreshold)` and
  `trainingOptions().binaryConfusionMatrixMetric(logitThreshold)` record
  scalar `binary_confusion_matrix_accuracy` plus TN/FP/FN/TP, specificity,
  balanced accuracy, and a structured `[[TN, FP], [FN, TP]]` matrix in
  trainer summaries, evaluation summaries, epoch history, and reports.
- `binaryRocAucMetric()`, `binaryAveragePrecisionMetric()`, and
  `trainingOptions().binaryRankingMetrics()` report ranking quality directly
  from logits for imbalanced binary datasets.
- `multiLabelBinaryDataLoader(...)`, `multiLabelBinaryTrainValidationSplit(...)`,
  and `multiLabelBinaryStratifiedTrainValidationSplit(...)` accept Java
  `int[][]`, `boolean[][]`, or `float[][]` targets while preserving
  `[batch, labels]` shape for multi-label BCE training.
- `multiLabelPositiveWeights(...)` derives per-label imbalance weights, and
  `trainingOptions().bcePositiveWeights(...)` applies those weights to
  multi-label BCE-with-logits presets.
- `trainingOptions().multiLabelBinaryMetrics()` records exact-match accuracy,
  Hamming loss, macro precision, macro recall, and macro F1 for multi-label
  BCE outputs.
- `multiLabelMacroF1Metric(logitThreshold)` and
  `trainingOptions().multiLabelBinaryMetrics(logitThreshold)` evaluate
  multi-label BCE/focal logits with custom thresholds when probability `0.5`
  is not the desired operating point.
- `multiLabelMacroRocAucMetric()`, `multiLabelMacroAveragePrecisionMetric()`,
  and `trainingOptions().multiLabelRankingMetrics()` report per-label macro
  ranking quality directly from multi-label logits.
- `evaluate(...)` runs no-grad validation/test passes with the same metric
  factories used by training.

### Trainer

| Canonical Gradle module | Role |
|---|---|
| `:trainer:gollek-trainer-api` | trainer contracts such as config, session, listeners, summaries |
| `:trainer:gollek-trainer` | canonical trainer runtime facade (module path: `trainer/gollek-trainer`) |
| `training/gollek-train` (legacy source area) | compatibility source area while migration continues; new Gradle runtime module is `:trainer:gollek-trainer` |

### Deployment and Model Distribution

| Canonical Gradle module | Role |
|---|---|
| `:ml:gollek-ml-hub` | pretrained model discovery and loading |
| `:ml:gollek-ml-export` | export and benchmarking |
| `:runner:onnx:gollek-ml-export-onnx` | ONNX export bridge |

---

## Public API Direction

For new framework code, prefer:

- `tech.kayys.gollek.ml.Gollek`
- `tech.kayys.gollek.ml.vision.*`
- `tech.kayys.gollek.ml.optimize.*`

For trainer lifecycle contracts, prefer:

- `tech.kayys.gollek.trainer.api.*`
- `tech.kayys.gollek.trainer.*`

For client/application SDK code, prefer:

- `tech.kayys.gollek.sdk.*`
- `tech.kayys.gollek.sdk.feature.*` for ML Kit-style app features
- `tech.kayys.gollek.client.agent.*` when an external agent runtime needs only
  Gollek's serving contract, validation, embeddings, MCP discovery, and
  OpenAI-compatible response views

For compatibility during the migration, these older namespaces are still intentionally bridged:

- `tech.kayys.gollek.train.*`
- `tech.kayys.gollek.export.*`
- `tech.kayys.gollek.hub.*`

Those compatibility namespaces exist so older code and examples do not break while the canonical `ml/*` and `trainer/*` structure settles.

---

## Quick Start

### ML Kit-Style SDK Features

Gollek SDK now exposes a grouped feature kit for app-facing capabilities:

- Face recognition
- Natural language
- Document scanner

Preferred entrypoint:

```java
import tech.kayys.gollek.sdk.feature.GollekFeatureKit;

GollekFeatureKit features = sdk.featureKit();
```

Recommended package direction:

- `tech.kayys.gollek.sdk.feature.GollekFeatureKit`
- `tech.kayys.gollek.sdk.feature.*` request/response types

For local runtime usage through `gollek-sdk-local`, these features route through:

- multimodal processors when available (vision/doc pipelines)
- local heuristic NLP fallback for language/sentiment/entity extraction

### Agent Serving SDK

Use `gollek-sdk-agent` when the caller is an external agentic system such as
Wayang-Gollek and only needs the Gollek serving boundary. This artifact keeps
the bridge small: HTTP, JSON, typed capability and contract views, typed response
views, serving readiness reports, trace headers, MCP discovery, tool schema
validation, embeddings, OpenAI-compatible generation helpers, and JDK-only
stream callbacks.

Use `gollek-sdk-remote` when an application wants the broader remote Gollek SDK
surface. It still exposes the same agent integration client through
`client.agent()`, so existing remote SDK users do not need a second dependency.
Use `servingReadiness(...)` when the caller wants the SDK to run capability,
contract, model-route, MCP, tool, and request-validation preflight calls as one
serving-only report. Use `AgentServingPreflightRequest` when that preflight
needs to disable optional stages such as MCP discovery or tool validation.
Use `servingPreflightReadiness(...)` when the Gollek server exposes
`POST /v1/agent/preflight` and the caller wants the server to compose the same
checks in one request.
Non-Java callers can use the same server-side readiness shape through
`POST /v1/agent/preflight`.

```java
AgentIntegrationClient agent = new AgentIntegrationClient(
    HttpClient.newHttpClient(),
    new ObjectMapper(),
    "http://localhost:8080",
    "community");

AgentCapabilitiesView capabilities = agent.capabilitiesView();
if (!capabilities.hasRequiredAgentServingCapabilities()) {
    throw new IllegalStateException("Gollek capabilities mismatch: "
        + capabilities.agentServingCapabilityIssues());
}
if (!capabilities.supportsContractVersion("v1")
        || !capabilities.featureNegotiation().supportsFeature("agent_feature_negotiation")) {
    throw new IllegalStateException("Gollek agent contract is not compatible with this orchestrator");
}

AgentServingContract contract = agent.contractView();
if (!contract.hasRequiredServingBoundary()) {
    throw new IllegalStateException("Gollek serving boundary mismatch: " + contract.servingBoundaryIssues());
}

AgentModelCapabilitiesView model = agent.modelCapabilitiesView("demo");
if (!model.hasRequiredAgentServingRoute()) {
    throw new IllegalStateException("Model cannot serve this agent route: "
        + model.agentServingRouteIssues());
}

AgentMcpDiscoveryView tools = agent.mcpToolsView(true, true);
if (!tools.discoveryOnly()) {
    throw new IllegalStateException("MCP discovery endpoint crossed the serving boundary");
}

AgentToolValidationView toolCheck = agent.validateToolsView(Map.of("tools", tools.openAiToolDefinitions()));
if (toolCheck.hasWarnings()) {
    wayangAudit.recordToolSchemaWarnings(toolCheck.warnings());
}

AgentValidationView dryRun = agent.validateRequestView("chat", Map.of(
    "model", "demo",
    "messages", messages,
    "tools", tools.openAiToolDefinitions()));
if (!dryRun.validationOnly() || dryRun.modelInvoked()) {
    throw new IllegalStateException("Validation endpoint crossed the serving boundary");
}

AgentServingReadinessReport readiness = AgentServingReadinessReport.builder()
    .capabilities(capabilities)
    .contract(contract)
    .modelRoute(model)
    .mcpDiscovery(tools, true)
    .toolValidation(toolCheck, true)
    .requestValidation(dryRun, true)
    .build();
readiness.requireReady("Gollek serving preflight failed");

AgentServingReadinessReport.Check requestCheck =
    readiness.requestValidationCheck();
AgentServingReadinessReport.RequestDetails requestDetails =
    requestCheck.requestDetails();
wayangAudit.recordValidatedShape(
    requestCheck.surface(),
    requestCheck.model(),
    requestDetails.messageCount(),
    requestDetails.toolCount(),
    requestDetails.rag().items());

AgentStreamAccumulator.Snapshot stream = agent.streamChatCompletion(
    Map.of("model", "demo", "messages", messages, "tools", tools.openAiToolDefinitions()),
    event -> wayangUi.appendDelta(event.delta()));
```

When the server-side preflight endpoint is available, the same readiness report
can be requested directly:

```java
AgentServingReadinessReport readiness = agent.servingPreflightReadiness(
    AgentServingPreflightRequest.builder()
        .modelId("demo")
        .surface("chat")
        .featureProfile(AgentServingFeatureProfile.CHAT_AGENT)
        .requiredContractVersion("v1")
        .requiredFeatures(List.of("rag_context", "mcp_tool_discovery"))
        .optionalFeatures(List.of("stream_usage_reporting"))
        .request(Map.of("model", "demo", "messages", messages))
        .build());
readiness.requireReady("Gollek serving preflight failed");
```

Use serving feature profiles when the caller wants a named Gollek capability
bundle instead of spelling out every feature flag. The default profile is
`agent_serving`, which checks the full agent-serving contract. More focused
profiles include `chat_agent`, `responses_agent`, `embedding_rag`, and
`mcp_tools`. Profiles are still serving-only: Wayang-Gollek owns planning,
retrieval policy, vector-store state, memory, tool authorization, and tool
execution.

```java
AgentServingPreflightRequest ragIndexingPreflight =
    AgentServingPreflightRequest.builder()
        .modelId("demo-embed")
        .surface("embeddings")
        .featureProfile(AgentServingFeatureProfile.EMBEDDING_RAG)
        .request(Map.of(
            "model", "demo-embed",
            "input", documentsForIndexing))
        .discoverMcpTools(false)
        .mcpDiscoveryRequired(false)
        .validateTools(false)
        .toolValidationRequired(false)
        .build();

AgentServingReadinessReport ragReadiness =
    agent.servingPreflightReadiness(ragIndexingPreflight);
ragReadiness.requireReady("Gollek embedding/RAG serving preflight failed");
```

Each readiness check preserves `details` as raw metadata and exposes typed
helpers for operator dashboards and agent-platform health probes. Standard
areas also have convenience accessors such as `modelRouteCheck()`,
`featureNegotiationCheck()`, `mcpDiscoveryCheck()`, `toolValidationCheck()`, and
`requestValidationCheck()`. The report metadata includes `checked_areas` so
dashboards can show which preflight stages were evaluated without expanding the
full `checks` map. Server-side preflight parsing accepts either the full
`check_results` map or a compact response that exposes `checked_areas` plus a
nested `readiness_report.checks` map.
The report also groups active `issue_hints` by area and by stable code through
`issueHintsByArea()` and `issueHintsByCode()`, while each `Check` exposes
`issueHint(code)`, `remediationForCode(code)`, `remediationPlan()`,
`remediationPlanByCode()`, and `remediationPlanForCode(code)` for direct UI or
CI lookups.
Use `remediationPlan()`, `blockingRemediationPlan()`,
`warningRemediationPlan()`, `remediationPlanByArea()`,
`remediationPlanByCode()`, or `remediationPlanForCode(code)` when an adapter
needs deduplicated next actions instead of every raw issue message. Each
remediation step preserves its source messages so CI output can stay compact
while still showing the exact blocked checks. Serialized report and check maps
also expose `blocking_remediation_plan` and `warning_remediation_plan` for
wire-compatible severity filters.
Agent-serving discovery also exposes explicit contract-version negotiation.
Use `AgentCapabilitiesView.featureNegotiation()` or
`AgentServingContract.featureNegotiation()` to check
`supported_contract_versions`, `default_feature_profile`,
`supported_feature_profiles`, `required_features`, and requested feature
support before Wayang-Gollek starts an orchestration loop.
Stable readiness codes can still be explained through the SDK catalog instead
of a caller-owned lookup table:

```java
AgentServingReadinessReport.Check check =
    readiness.requestValidationCheck();

if (check.hasEmbeddingDetails()) {
    AgentServingReadinessReport.EmbeddingDetails embedding =
        check.embeddingDetails();
    assert embedding.storageOwnedByOrchestrator();
    assert !embedding.rag().retrievalExecution();
}

AgentReadinessIssueCodes.CatalogEntry issue =
    AgentReadinessIssueCodes.describe("AGENT_REQUEST_INVALID");
wayangAudit.recordIssueHint(
    issue.code(),
    issue.area(),
    issue.defaultSeverity(),
    issue.remediation());

for (AgentServingReadinessReport.IssueHint hint : readiness.issueHints()) {
    wayangDashboard.showReadinessHint(
        hint.code(),
        hint.summary(),
        hint.remediation());
}

readiness.remediationForCode("AGENT_REQUEST_INVALID")
    .ifPresent(remediation -> wayangAudit.recordRemediation(
        "AGENT_REQUEST_INVALID",
        remediation));

for (AgentReadinessRemediation step : readiness.blockingRemediationPlan()) {
    wayangDashboard.showNextAction(
        step.area(),
        step.code(),
        step.remediation(),
        step.messages());
}

readiness.remediationPlanForCode("TOOL_DEFINITIONS_INVALID")
    .forEach(step -> wayangAudit.recordNextAction(
        step.code(),
        step.messages(),
        step.remediation()));
```

### ML Framework Entry Point

```java
import tech.kayys.gollek.ml.Gollek;
import tech.kayys.gollek.ml.vision.models.ResNet;

ResNet model = ResNet.resnet18(10);

var exporter = Gollek.Export.model(model)
    .inputShape(1, 3, 224, 224)
    .build();

exporter.toONNX("model.onnx");
```

### Model Hub

```java
import tech.kayys.gollek.ml.Gollek;
import tech.kayys.gollek.ml.vision.models.ResNet;

ResNet model = ResNet.resnet18(1000);
Gollek.Hub.loadInto(model, "hf:google/vit-base-patch16-224");
```

### Compatibility Example

If you still have older code that imports the legacy compatibility bridge:

```java
import tech.kayys.gollek.export.ModelExporter;
import tech.kayys.gollek.hub.ModelHub;
```

that is still supported for now, but new code should move toward `Gollek.Export`, `Gollek.Hub`, and `tech.kayys.gollek.ml.*`.

---

## Migration Map

| Legacy wording | Current canonical meaning |
|---|---|
| `gollek-sdk-train` | trainer runtime split across `:trainer:gollek-trainer-api`, `:trainer:gollek-trainer`, plus legacy compatibility sources under `training/gollek-train` |
| `gollek-sdk-export` | `:ml:gollek-ml-export` plus `Gollek.Export` and `tech.kayys.gollek.export.*` compatibility |
| `gollek-sdk-hub` | `:ml:gollek-ml-hub` plus `Gollek.Hub` and `tech.kayys.gollek.hub.*` compatibility |
| `gollek-sdk-core` | shared ML/tensor/autograd foundations now spread across `gollek-ml-api`, `gollek-ml-core`, `gollek-ml-tensor`, and `gollek-ml-autograd` |
| `gollek-sdk-local` | local application/client SDK, not the canonical ML framework root |
| `gollek-sdk-session` | session/client compatibility surface; trainer contracts now belong under `gollek-trainer-*` |

---

## JBang Examples

The repository still contains JBang files whose names start with `gollek-sdk-*`.

That does **not** mean the old SDK naming is the preferred future direction.

Those files are kept for continuity while the public ML framework surface is migrated. Canonical trainer-aligned examples now start with:

- `gollek/examples/jbang/trainer/trainer_runtime_bootstrap.java`
- `gollek/examples/jbang/trainer/trainer_accelerated_autograd.java`
- `gollek/examples/jbang/trainer/trainer_resume_history.java`
- `gollek/examples/jbang/trainer/trainer_robust_regression_huber.java`
- `gollek/examples/jbang/trainer/trainer_classification_metrics.java`
- `gollek/examples/jbang/trainer/trainer_binary_bce_metrics.java`
- `gollek/examples/jbang/trainer/trainer_multilabel_bce_metrics.java`

Before running those trainer examples from `gollek/examples/jbang`, publish
their local Gradle-built runtime graph with:

```bash
./gradlew publishJbangTrainerExamplesToMavenLocal
```

Compatibility examples under older SDK naming include:

- `gollek/examples/jbang/sdk/gollek-quickstart.java`
- `gollek/examples/jbang/sdk/gollek-sdk-core-example.java`
- `gollek/examples/jbang/sdk/gollek-sdk-vision-example.java`
- `gollek/examples/jbang/sdk/gollek-sdk-train-example.java`
- `gollek/examples/jbang/sdk/gollek-sdk-augment-example.java`
- `gollek/examples/jbang/sdk/gollek-sdk-export-example.java`

should be read as compatibility samples during the rename, not as the final naming model.

---

## Recommended Reading

- [Framework Overview](/docs/framework/index)
- [API Reference Index](/docs/api-references/0.1.0-SNAPSHOT/)
- [gollek-trainer-api](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-trainer-api)
- [gollek-trainer](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-trainer)
- [gollek-ml-hub](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-hub)
- [gollek-ml-export](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-export)
