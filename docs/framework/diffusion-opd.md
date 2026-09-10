---
layout: default
title: DiffusionOPD in Gollek
---

# DiffusionOPD in Gollek

Gollek now has a dedicated Java-first scaffold for **DiffusionOPD**, a multi-task on-policy distillation method for diffusion models.

Citation:

- Quanhao Li, Junqiu Yu, Kaixun Jiang, Yujie Wei, Zhen Xing, Pandeng Li, Ruihang Chu, Shiwei Zhang, Yu Liu, Zuxuan Wu. *DiffusionOPD: A Unified Perspective of On-Policy Distillation in Diffusion Models*. arXiv:2605.15055, 2026. [arXiv](https://arxiv.org/abs/2605.15055)

---

## Why this matters

Gollek is a one-stop Java platform for inference, ML, DL, and NN training. That means diffusion alignment work should follow the same rule:

- training APIs in Java
- orchestration in Java
- datasets and task routing in Java
- backend bridges only where runners or kernels already need them

DiffusionOPD fits that direction well because the paper’s core idea is an algorithmic training loop, not a Python-only runtime requirement.

---

## What was added

### New Java modules

- `:ml:gollek-ml-diffusion-api`
- `:ml:gollek-ml-diffusion-opd`

### Main Java entrypoints

- `tech.kayys.gollek.train.diffusion.api.*`
- `tech.kayys.gollek.train.diffusion.opd.DefaultDiffusionOpdTrainer`
- `tech.kayys.gollek.train.diffusion.opd.adapter.RunnerDiffusionAdapters`
- `tech.kayys.gollek.ml.Gollek.DL.diffusionOpdTrainer()`

---

## Module roles

### `gollek-ml-diffusion-api`

This module provides the stable contracts:

- `DiffusionTask`
- `DiffusionPromptSample`
- `DiffusionDenoiser`
- `DiffusionScheduler`
- `DiffusionConditioningResolver`
- `DiffusionOptimizationStep`
- `DiffusionOpdConfig`
- `DiffusionOpdSession`

### `gollek-ml-diffusion-opd`

This module provides the first algorithm scaffold:

- `DefaultDiffusionOpdTrainer`
- round-robin multi-task sampling
- stage-aware teacher routing by timestep interval
- scheduler-based transition mean adaptation
- ODE/SDE loss shape for per-step mean matching
- Java listener lifecycle hooks
- checkpoint-directory summary/history artifacts
- adapters from existing Gollek diffusion runner contracts

---

## Current design

The current vertical slice focuses on the part Gollek needs first:

1. represent diffusion OPD tasks in Java
2. run student-teacher rollout supervision in Java
3. map backend denoisers and schedulers into the OPD abstraction
4. expose the builder through the canonical Gollek ML entrypoint

This is intentionally narrower than the full paper implementation. It gives Gollek a clean Java surface before more backend-specific logic is layered in.

---

## First adapter layer

Gollek already has diffusion runner contracts under `runner/gollek-diffusion`, including:

- `UNetModel`
- `Scheduler`

Those can now be adapted into OPD training with:

```java
DiffusionDenoiser student =
    RunnerDiffusionAdapters.denoiser(unetModel);

DiffusionScheduler diffusionScheduler =
    RunnerDiffusionAdapters.scheduler(ddimScheduler);
```

That keeps the algorithm Java-native while reusing existing Gollek runtime surfaces.

---

## Example shape

```java
var trainer = Gollek.DL.diffusionOpdTrainer()
    .samplerType(DiffusionSamplerType.ODE)
    .student(RunnerDiffusionAdapters.denoiser(studentUnet))
    .teacher("ocr", RunnerDiffusionAdapters.denoiser(ocrTeacherUnet))
    .teacher("aesthetic", RunnerDiffusionAdapters.denoiser(aestheticTeacherUnet))
    .scheduler(RunnerDiffusionAdapters.scheduler(ddimScheduler))
    .conditioningResolver(sample -> textEncoder.encode(sample.prompt()))
    .task(new DiffusionTask("ocr", "OCR", "ocr", "teacher-ocr", ocrPrompts))
    .task(new DiffusionTask("aesthetic", "Aesthetic", "aesthetic", "teacher-aesthetic", aestheticPrompts))
    .maxRounds(100)
    .batchSize(2)
    .build();

trainer.fit();
```

The exact text-encoder, optimizer step, checkpointing, and variance handling will keep evolving, but the Java module boundaries are now in place.

There is also a concrete Java example in the repo:

- `gollek/training/gollek-train-examples/src/main/java/tech/kayys/gollek/train/examples/DiffusionOpdDDIMExample.java`

And a JBang script for fast local experimentation:

- `gollek/examples/jbang/trainer/trainer_diffusion_opd_ddim.java`

When `checkpointDir(...)` is set, the current scaffold now writes:

- `diffusion-opd-summary.json`
- `diffusion-opd-history.csv`
- `diffusion-opd-report.json`

It also supports Java-side lifecycle callbacks through `DiffusionOpdListener`.

For stage-aware routing, each `DiffusionTask` can now carry
`DiffusionTeacherBinding` entries such as:

```java
new DiffusionTask(
    "ocr",
    "OCR",
    "ocr",
    "teacher-ocr",
    List.of(
        new DiffusionTeacherBinding("ocr-early", 0, 2, "early"),
        new DiffusionTeacherBinding("ocr-late", 2, Integer.MAX_VALUE, "late")
    ),
    promptSamples
)
```

This is the current Gollek implementation step most directly inspired by
eDiff-I’s stage-specialized denoiser idea.

The trainer now also supports per-stage loss weighting, so early, mid, and late
teachers can contribute with different emphasis during OPD. For common setups,
Gollek provides Java helpers through `DiffusionTeacherBindings`, for example:

```java
new DiffusionTask(
    "ocr",
    "OCR",
    "ocr",
    "teacher-ocr",
    DiffusionTeacherBindings.splitEarlyLate(
        4,
        "ocr-early",
        "ocr-late",
        1.25d,
        0.85d
    ),
    promptSamples
)
```

This keeps stage routing configuration in Java while making the training loop
more flexible than fixed hardcoded intervals.

Gollek also now supports scheduler-aware partitioning. Instead of splitting
stages by raw step count, bindings can be derived from the scheduler timetable
itself, which is a better fit for sparse samplers such as DDIM:

```java
var diffusionScheduler = RunnerDiffusionAdapters.scheduler(ddimScheduler);

var bindings = DiffusionTeacherBindings.splitEarlyLate(
    diffusionScheduler,
    "ocr-early",
    "ocr-late",
    1.25d,
    0.85d
);
```

This keeps the API Java-native while letting stage boundaries follow the
effective denoising schedule rather than assuming uniform step spacing.

Gollek also now supports adaptive stage weighting in the trainer. When enabled,
the OPD loop tracks per-stage mean loss and rebalances stage factors across
rounds, which helps emphasize underperforming denoising regions without
throwing away the base stage weights configured in `DiffusionTeacherBinding`.

```java
var trainer = Gollek.DL.diffusionOpdTrainer()
    .adaptiveStageWeighting(true)
    .adaptiveStageWeightMomentum(0.60d)
    .adaptiveStageWeightRange(0.80d, 1.35d)
    .build();
```

Current behavior:

- stage factors start at `1.0`
- each round computes per-stage mean base loss
- higher-loss stages are nudged upward within the configured factor range
- lower-loss stages are nudged downward, with momentum smoothing

Gollek also now has a dedicated alignment seam for the safetensor-native
Stable Diffusion inference runner in
`StableDiffusionRunnerAdapters`. The current status is:

- `PNDMScheduler` is directly bridged for timestep/schedule alignment
- stable-diffusion-native UNet adaptation is available through an explicit
  `TensorAccelBridge`
- this keeps training and inference aligned without pretending the core
  `Tensor` and `AccelTensor` stacks are already the same runtime

Example shape:

```java
var scheduler = StableDiffusionRunnerAdapters.scheduler(pndmScheduler);

var denoiser = StableDiffusionRunnerAdapters.denoiser(
    stableDiffusionUnet,
    tensorAccelBridge
);
```

For float32 experimentation, Gollek also provides a bridge helper so callers
only need to supply two explicit conversions:

```java
var bridge = StableDiffusionRunnerAdapters.float32Bridge(
    coreTensor -> extractFloat32(coreTensor),
    (values, shape) -> createCoreTensor(values, shape)
);
```

This keeps the adapter usable today while Gollek's generic core-tensor
materialization API is still maturing.

For the Metal-aligned stable-diffusion-native path, Gollek now also provides a
no-friction convenience overload:

```java
MetalBinding.initialize();
MetalBinding metalBinding = MetalBinding.getInstance();
metalBinding.init();

var bridge = StableDiffusionRunnerAdapters.metalDefaultTensorFloat32Bridge(
    metalBinding
);
```

This overload returns an accelerator-aware bridge that:

- materializes stable-diffusion-native `AccelTensor` values into core
  `DefaultTensor` objects tagged as `DeviceType.METAL`
- exposes Metal runtime metadata such as device name, unified-memory status,
  native availability, and available accelerator memory
- keeps the Java training stack aligned with the maintained
  `gollek-backend-metal` binding surface without depending on stale backend
  adapter classes

Current caveat:

- the materialized core tensor is a transport tensor for adapter boundaries
  and should receive a full execution backend before downstream math
  operations are invoked

Gollek now also supports an executable scheduler bridge for the
stable-diffusion-native PNDM path:

```java
var bridge = StableDiffusionRunnerAdapters.metalDefaultTensorFloat32Bridge(
    metalBinding
);

DiffusionScheduler scheduler = StableDiffusionRunnerAdapters.scheduler(
    pndmScheduler,
    bridge
);
```

This means OPD training code can now reuse the same Java-side scheduler step
shape that the stable-diffusion-native inference runner uses, instead of only
reading scheduler metadata.

Gollek also now includes an end-to-end structural trainer demo that uses both
stable-diffusion-native bridge surfaces together:

```java
var trainer = Gollek.DL.diffusionOpdTrainer()
    .student(StableDiffusionRunnerAdapters.denoiser(studentUnet, bridge))
    .teacher("ocr-early", StableDiffusionRunnerAdapters.denoiser(ocrEarlyTeacher, bridge))
    .scheduler(StableDiffusionRunnerAdapters.scheduler(pndmScheduler, bridge))
    .task(...)
    .build();
```

This is still a Java-first scaffold rather than full weight-backed Stable
Diffusion training, but it proves that:

- the UNet adapter and scheduler adapter compose cleanly inside the OPD trainer
- stage-aware routing and adaptive weighting still work on the
  stable-diffusion-native path
- Gollek can keep training and inference aligned without leaving Java at the
  orchestration level

To prepare the jump from stub fixtures to real local weights, the example lane
now validates the native runner repository layout and reports whether a local
fixture is usable. The expected structure matches the current
`StableDiffusionNativeRunner`:

- `text_encoder/`
- `unet/`
- `vae/`
- `tokenizer/`

The examples auto-detect common local paths and also accept an override via
`GOLLEK_SD_NATIVE_MODEL_DIR` or a direct path argument.

Gollek now also includes a plain-Java fixture loader utility for this lane, so
the stable-diffusion-native trainer example can automatically switch from a
stub UNet to a real local `unet/` safetensor checkpoint when the fixture is
available.

That lane now also supports per-role fixture resolution, so `student`,
`ocr-early`, `ocr-late`, `aesthetics-early`, and `aesthetics-late` can point
to different local repos through dedicated environment overrides or role-named
subdirectories under a shared base fixture.

When the shared fixture is usable, the example can also upgrade prompt
conditioning from a synthetic tensor to real CLIP text embeddings loaded from
`text_encoder/` plus `tokenizer/`, while still keeping role-specific UNet
fixtures separate.

That real CLIP conditioning path now exists in both the Gradle example and
the JBang example, so quick local experimentation follows the same native
bridge behavior as the main Java example lane.

Gollek now also supports task-specific text-conditioning fixtures in that
example lane. `ocr` and `aesthetics` can each resolve their own CLIP/text
encoder repo through environment overrides such as
`GOLLEK_SD_NATIVE_MODEL_DIR_TEXT_OCR` and
`GOLLEK_SD_NATIVE_MODEL_DIR_TEXT_AESTHETICS`, or through `text-ocr/` and
`text-aesthetics/` subdirectories under a shared fixture root.

Those task-specific conditioning lanes are now also written into the standard
DiffusionOPD artifacts. The summary JSON and round-history CSV can include
fields such as `conditioningTaskModes`,
`conditioningTaskFixtureBaseDirs`, and `conditioningTaskFixtures`, so loss
analysis can stay tied to the actual text-conditioning source used per task.

The native bridge examples now also record observed runtime diagnostics instead
of only configured fixture metadata. Artifact fields such as
`conditioningTaskResolveCounts`, `conditioningTaskLossSteps`,
`conditioningTaskLossSums`, and `conditioningTaskMeanLoss` show how often each
conditioning lane actually ran and how its per-task loss profile evolved.

That runtime path is now formalized through
`DiffusionOpdRuntimeObserver`, so integrations can attach training-time
diagnostics to the standard DiffusionOPD summary/history artifacts without
relying on example-owned mutable metadata maps.

Gollek now also ships a reusable built-in implementation,
`ConditioningTaskMetricsObserver`, inside `gollek-ml-diffusion-opd`. That
observer captures per-task conditioning lane usage and loss aggregates so
integrations can adopt standard conditioning diagnostics without rewriting
their own observer class.

Alongside it, Gollek now includes `TeacherStageTaskMetricsObserver`, a second
built-in runtime observer for standard OPD rollout aggregation. It captures
observed task, teacher, stage, and task-stage usage/loss metrics so diffusion
integrations can attach a fuller diagnostics bundle with just a couple of
observer registrations.

To reduce that wiring further, Gollek now provides
`DiffusionOpdDiagnosticsPacks.standardTaskDiagnostics(...)` plus
`DefaultDiffusionOpdTrainer.Builder.runtimeObservers(...)`, so integrations can
enable the standard conditioning and rollout diagnostics bundle in a single
builder call.

The trainer now also emits a normalized `diffusion-opd-report.json` artifact
next to the summary and history files. That report groups run metadata,
artifacts, teacher/stage/task diagnostics, conditioning diagnostics, adaptive
weighting details, and round history into clearer top-level sections for
downstream analysis.

That normalized report schema is now represented by small typed records in the
DiffusionOPD API, including `DiffusionOpdReport`,
`DiffusionOpdRunReport`, and `DiffusionOpdArtifactsReport`, so downstream Java
tooling can align to stable top-level sections instead of depending on ad hoc
string-key conventions alone.

Gollek now also exposes `DiffusionOpdReports.load(...)` in
`gollek-ml-diffusion-opd`, so Java integrations can read
`diffusion-opd-report.json` back into the typed report schema instead of only
writing it.

For terminal-first workflows, the repo now also includes a JBang inspector:

- `gollek/examples/jbang/trainer/trainer_diffusion_opd_report_inspector.java`

It loads `diffusion-opd-report.json` through `DiffusionOpdReports.load(...)`
and can print either the full report or selected sections such as
`overview`, `run`, `teachers`, `conditioning`, or `roundHistory` directly from
the terminal, in either plain text or pretty-printed JSON.

The inspector now also supports focused history selectors such as
`roundHistory:last`, `roundHistory:task=ocr`,
`roundHistory:teacher=ocr-early`, `roundHistory:stage=early`, and
`roundHistory:round=2`, which makes it easier to inspect one slice of OPD
behavior without dumping the entire history array.

That selector path now supports compact chained queries too, for example
`roundHistory:task=ocr:last`, `roundHistory:teacher=ocr-early:last`,
`roundHistory:task=ocr:count`, and `roundHistory:task=ocr:meanLoss`, so
terminal inspection can return one row or one aggregate instead of a full list.

It also supports ranked slices such as
`roundHistory:task=ocr:sort=-averageLoss:top=3` or
`roundHistory:teacher=ocr-early:sort=round:top=5`, which is handy when you want
the worst-loss rows or the earliest/latest few entries from a filtered subset.

For a more compact terminal view, the inspector now also supports summary
presets such as `taskSummary=ocr`, `teacherSummary=ocr-early`, and
`stageSummary=early`. Those return a small aggregate bundle with count,
mean loss, the latest matching row, and a few representative ranked entries.

The summary layer also supports paired comparisons such as
`taskTeacherSummary=ocr,ocr-early`, `taskStageSummary=ocr,early`, and
`teacherStageSummary=ocr-early,early`, which makes it easier to inspect one
combined slice without manually chaining multiple filters.

For bulk comparison, the inspector now also supports grouped rollups such as
`taskSummaries`, `teacherSummaries`, and `stageSummaries`, each returning one
aggregate map keyed by the discovered task, teacher, or stage values in the
report history.

Those grouped rollups can now be ranked too, for example with
`taskSummaries:sort=-meanLoss:top=5` or
`teacherSummaries:sort=-count:top=3`, which makes it easier to surface the most
problematic or most-active slices directly from the terminal.

The same idea now works for combined dimensions too with
`taskTeacherSummaries`, `taskStageSummaries`, and `teacherStageSummaries`,
including ranked forms such as `taskTeacherSummaries:sort=-meanLoss:top=10`.

The inspector now also supports `table` and `csv` output modes for these
summary views, which makes it easier to move from terminal inspection into
spreadsheet or dashboard workflows without writing a separate export script.

Those export-oriented modes now also support optional column projection, so a
command can request a compact schema such as `value,count,meanLoss` or
`pair,count,meanLoss` instead of exporting every available field.

The inspector can now also write `text`, `json`, `table`, or `csv` output
directly to a file path from the CLI. It can infer export format from output
filenames such as `.json`, `.csv`, `.table`, `.md`, `.txt`, or `.log`, and
`_` remains available as a no-projection placeholder when a call shape still
needs it.

Projection now also understands a few friendly aliases and flattened latest-row
fields, including `loss`, `latestRound`, `latestLoss`, `latestTeacher`,
`latestTask`, `latestStage`, `top1Round`, `top1Loss`, `first1Round`, and
`first1Loss`.

For common export views, the inspector now also supports small projection
presets such as `minimal`, `compact`, `latest`, `leaderboard`, `details`, and
`compare`, which expand to reusable column sets for `table` and `csv` output.

The richer `details` preset and pair-oriented `compare` preset now also
flatten one representative top-loss row and one representative first-round row
through aliases such as `top1Round`, `top1Loss`, `first1Round`, and
`first1Loss`.

Those presets are now section-aware too: grouped single-dimension summaries
expand around `value`, while pair rollups such as `taskTeacherSummaries`
expand around `pair`.

For repeated analysis workflows, the inspector now also supports
directory-oriented bundle export through selectors like `bundle=standard` and
`bundle=rollups`, so one command can emit a small pack of related JSON, CSV,
table, or text views into an output directory. Each bundle now also includes a
`manifest.json` index describing the bundle type, creation timestamp, format,
source report path, and per-file section metadata for generated files. For
`table` and `csv` bundles, grouped summaries default to `compact` projection
and pair rollups default to `compare` projection unless an explicit column
selection is supplied. Ad hoc packs are supported too through
`bundle=custom:overview,taskSummaries,taskTeacherSummaries`, and custom
entries can assign output aliases through `section@alias`, such as
`bundle=custom:overview@run-overview,taskTeacherSummaries@teacher-pairs`.
Custom entries can also override their own projection through `#columns`, for
example `bundle=custom:taskSummaries@tasks#compact,taskTeacherSummaries@pairs#compare`.
They can also override per-entry format through `!json`, `!csv`, `!table`, or
`!text`, for example
`bundle=custom:overview@run-overview!json,taskTeacherSummaries@teacher-pairs#compare!csv`.
Bundle directories and `manifest.json` files can also be inspected directly
through the same inspector entrypoint, including `manifest`,
`bundleSummary`, `bundleHealth`, `files`, and `file:<name>` views, plus filtered file lists such as
`files:format=csv` and `files:section=taskTeacherSummaries`. Bundle manifests
can also be summarized through grouped selectors like
`filesSummary:by=section`, `filesSummary:by=format:sort=-count`, or
`filesSummary:by=section:sort=-count:top=3`. `bundleSummary` adds a compact
overview with total file count, section count, format count, and the dominant
section/format rows, and also supports `focus=sections|formats|all` plus
`top=<n>` for smaller embedded rollups. `dominant=true` trims the output down
to the headline section/format winners without the embedded summary lists.
It also validates the manifest against the bundle directory and reports
`existingFileCount`, `missingFileCount`, and `missingFiles` when bundle
artifacts are missing on disk. `bundleHealth` provides the same integrity
signal in a smaller status-oriented shape with `healthy`, normalized `status`,
`healthScore`, `alertLevel`, stable `issueCodes`, `primaryIssueCode`,
compact `healthBadge` with UI-ready `variant`, `label`, `token`, `tooltip`,
`checkStatus`, `primaryCheckCode`, and `primaryCheckSeverity`,
human-facing `summaryMessage` and `recommendedAction`,
`missingFileCount`, `missingFiles`, plus grouped `missingSections` and
`missingFormats`. It also exposes structured `checks` for named validations
like output-directory presence and artifact completeness, normalized
`checkSummary` fields (`total`, `passed`, `failed`, `passRate`,
`failureRate`, `status`, `alertLevel`, local `summaryMessage`,
local `recommendedAction`, local `issueCodes`,
local `primaryIssueCode`,
nested `healthBadge` with `status`, `alertLevel`, `primaryIssueCode`,
`primaryCheckName`, `primaryCheckMessage`, `primaryCheckSeverity`, `score`, `variant`, `label`, `token`,
`checkStatus`, `summaryMessage`, `recommendedAction`, and `tooltip`,
`dominantSeverity`,
`allPassed`, `hasCriticalFailures`, `hasWarningFailures`,
`hasInfoFailures`, `failingSeverityCounts`, `primaryFailingName`, `primaryFailingCode`,
`primaryFailingSeverity`, `primaryFailingMessage`, `failingNames`,
`failingCodes`, and `severityCounts`), along with
`failingChecks`, `failingCheckCount`, and aggregate counters such as
`passingCheckCount`, `criticalCheckCount`, `warningCheckCount`, and
`infoCheckCount` for compact status summaries. The
health view also supports `focus=files|sections|formats|all` and `top=<n>` for
more compact diagnosis slices. The
inspector can also load the actual
generated artifact chosen by exact name or by a filter, for example
`loadfile:overview.json` or
`loadfile:format=csv:section=taskTeacherSummaries`. When a filter matches
multiple files, `sort=name|-name|section|format|count`, `top=<n>`,
`pick=first|last`, or `index=<n>` can be added for stable selection.

Concrete examples are now included in the repo:

- `gollek/training/gollek-train-examples/src/main/java/tech/kayys/gollek/train/examples/DiffusionOpdStableDiffusionMetalBridgeExample.java`
- `gollek/training/gollek-train-examples/src/main/java/tech/kayys/gollek/train/examples/DiffusionOpdStableDiffusionNativeBridgeTrainerExample.java`
- `gollek/examples/jbang/trainer/trainer_diffusion_opd_stable_diffusion_metal_bridge.java`
- `gollek/examples/jbang/trainer/trainer_diffusion_opd_stable_diffusion_native_bridge.java`

For Apple accelerator alignment, Gollek now also supports a Metal-aware bridge
factory backed by `gollek-backend-metal` metadata:

```java
var metalBridge = StableDiffusionRunnerAdapters.metalFloat32Bridge(
    MetalBinding.getInstance(),
    coreTensor -> extractFloat32(coreTensor),
    (values, shape) -> createCoreTensor(values, shape)
);
```

This does not pretend `Tensor` and `AccelTensor` are zero-copy identical yet,
but it does let OPD integrations carry real Metal backend capability signals
such as device name, unified-memory status, and available accelerator memory.

Gollek now also has a `DefaultTensor` materializer path for backend-aware
bridges. This means callers can provide a concrete `ComputeBackend` plus target
`DeviceType`, and the adapter will build core tensors with that backend
attached instead of only handing back raw float32 construction callbacks:

```java
var bridge = StableDiffusionRunnerAdapters.defaultTensorFloat32Bridge(
    computeBackend,
    DeviceType.METAL,
    coreTensor -> extractFloat32(coreTensor)
);
```

There is also a Metal-specific convenience variant:

```java
var bridge = StableDiffusionRunnerAdapters.metalDefaultTensorFloat32Bridge(
    MetalBinding.getInstance(),
    computeBackend,
    coreTensor -> extractFloat32(coreTensor)
);
```

---

## What comes next

The next implementation steps are:

1. add a concrete Java DDIM example under the training examples module
2. add checkpoint persistence specific to diffusion OPD
3. support scheduler variance for SDE closed-form KL
4. integrate teacher registry and prompt datasets more deeply
5. expose training monitoring through SDK/job surfaces where appropriate

---

## Related docs

- [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs)
- [Gollek Framework](/docs/framework/)
- [DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting)
- [DiffusionOPD Selector Reference](/docs/framework/diffusion-opd-selector-reference)
- [ML Framework Modules](/docs/sdk-modules)
- [Runtime Architecture](/docs/runtime/architecture)

If you are working with `diffusion-opd-report.json`, typed query helpers,
bundle manifests, or exported inspection packs, continue with
[DiffusionOPD Reporting and Inspection](/docs/framework/diffusion-opd-reporting).

---

## Related papers and how they help Gollek

Not every diffusion paper helps the same layer of the stack. For Gollek, these papers split into four practical buckets:

### 1. Core distillation objective

- **DiffusionOPD**: Quanhao Li et al., *DiffusionOPD: A Unified Perspective of On-Policy Distillation in Diffusion Models*, arXiv:2605.15055, 2026.

This is the main paper behind the current Java scaffold. It tells us how to:

- structure teacher-student multi-task diffusion training
- supervise on the student’s own rollout
- use per-step mean matching instead of higher-variance PPO-style gradients
- unify deterministic ODE and stochastic SDE supervision

For Gollek, this paper should continue driving:

- `DefaultDiffusionOpdTrainer`
- `TransitionMeanAdapter`
- `DiffusionOpdLosses`
- teacher registry and multi-task sampling

### 2. Latent diffusion architecture foundation

- **LDM**: Robin Rombach et al., *High-Resolution Image Synthesis with Latent Diffusion Models*, arXiv:2112.10752, 2022.

This is the architectural baseline that matters most for Gollek’s diffusion runtime. It tells us why latent-space training and cross-attention conditioning are the right default path for a practical Java platform.

For Gollek, this paper should drive:

- stronger latent diffusion abstractions in `runner/gollek-diffusion`
- explicit text-conditioning interfaces
- separation of autoencoder, denoiser, and scheduler contracts
- future checkpoint/model manifest structure for latent diffusion pipelines

### 3. Multi-stage denoiser specialization

- **eDiff-I**: Yogesh Balaji et al., *eDiff-I: Text-to-Image Diffusion Models with an Ensemble of Expert Denoisers*, arXiv:2211.01324, 2023.

This paper is especially interesting for Gollek because it says different denoising stages behave differently, and that stage-specialized denoisers can improve text alignment without raising total inference cost.

For Gollek, this suggests a strong next improvement after basic OPD:

- extend `DiffusionTask` or the future teacher registry with timestep-range specialization
- support stage-aware teacher routing
- allow different teachers or adapters for early, mid, and late denoising
- expose this as a Java composition strategy instead of a monolithic single teacher

This is probably the most useful paper here after DiffusionOPD itself.

### 4. Production-grade latent diffusion conditioning

- **SDXL**: Dustin Podell et al., *SDXL: Improving Latent Diffusion Models for High-Resolution Image Synthesis*, arXiv:2307.01952, 2023.

SDXL is less about the OPD loss itself and more about what a stronger practical latent diffusion backbone looks like:

- larger UNet
- richer conditioning
- multiple text encoders
- multi-aspect-ratio training
- refinement model

For Gollek, this suggests future improvements to the Java diffusion runtime:

- richer conditioning resolver contracts
- support for multiple conditioning streams
- optional refiner-stage modeling
- better pipeline metadata for base-plus-refiner flows

### 5. Editing and image-to-image behavior

- **SDEdit**: Chenlin Meng et al., *SDEdit: Guided Image Synthesis and Editing with Stochastic Differential Equations*, arXiv:2108.01073, 2022.

This one is useful, but for a narrower slice. It matters most if Gollek wants:

- image-to-image editing
- partial-noise inversion/editing workflows
- faithfulness-vs-realism controls

For the current DiffusionOPD training work, it is secondary. It becomes important once Gollek exposes editing-style diffusion pipelines in Java.

---

## Priority order for Gollek

If we prioritize by what improves the current Java diffusion roadmap the most:

1. **2605.15055 / DiffusionOPD**
   - continue implementing the real training loop
2. **2211.01324 / eDiff-I**
   - add stage-aware teacher specialization
3. **2112.10752 / LDM**
   - harden the latent diffusion runtime architecture
4. **2307.01952 / SDXL**
   - extend conditioning, aspect ratio, and refiner support
5. **2108.01073 / SDEdit**
   - add editing workflows later

---

## Best next code improvement from these papers

The highest-value next code step inspired by this paper set is:

- add **stage-aware teacher routing** to DiffusionOPD

Why:

- it directly combines the current OPD scaffold with eDiff-I’s strongest idea
- it fits Gollek’s Java-first modular design well
- it can be expressed cleanly as timestep-range routing without forcing a new training abstraction

That means future Gollek changes should likely introduce:

- timestep-interval teacher bindings
- a teacher selector that picks the teacher by task plus denoising stage
- stage-specific metadata in summary/history artifacts

This is the most natural research-driven improvement after the current listener/checkpoint/example work.
