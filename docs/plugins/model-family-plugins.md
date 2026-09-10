---
layout: default
title: Model Family Plugins
nav_order: 3
---

# Model Family Plugins

Model family plugins are the detachable "model farm" layer in Gollek. They let Gollek understand Hugging Face style model families without forcing every architecture, tokenizer, or weight-layout adapter into every production inference build.

Use this page when you want to:

- Add a new family from `3rdparty/transformers/src/transformers/models`.
- Package only selected families into the CLI or runtime.
- Reuse tokenizer metadata across runners.
- Keep experimental or metadata-only families out of lean production builds.

---

## Mental Model

Gollek separates model knowledge from execution:

| Layer | Owns | Examples |
|-------|------|----------|
| Model family plugin | Architecture names, `model_type` claims, tokenizer profiles, support metadata, direct-runtime readiness | Llama, Gemma, Phi, Qwen, BERT, FLAVA, Mamba |
| Runner plugin | Artifact execution for a format | GGUF, SafeTensor, ONNX, LiteRT |
| Kernel/backend plugin | Hardware acceleration | Metal, CUDA, ROCm, DirectML |
| Extension | External installable package or higher-level feature | OCR, quantization labs, custom pipelines |

A model family plugin does not need to execute a model by itself. It advertises what Gollek can safely know about that family. A runner then decides whether a specific artifact can be executed.

That split keeps production builds small. A server that only runs Llama/Gemma/Qwen can attach only those families; a research build can attach every family; a minimal proxy build can detach all model-family plugins.

When debugging a real model route, start with the model-family bundle to confirm
Gollek recognizes the architecture and tokenizer metadata, then inspect the runner
route to see which artifact format will execute. The runner route report is owned
by the runner plugin layer:

```bash
gollek modules --json | jq '.modelFamilyBundle | {bundlePreset, familyCount, productionSafety}'

gollek run \
  --model google/gemma-4-E2B-it \
  --prompt "what is jakarta" \
  --route-report-json \
  | jq '{
      provider,
      format,
      route_runner,
      route_selection_source,
      route_redirected,
      route_artifact_cache_hit,
      route_artifact_cache_state,
      route_profile_status,
      route_profile_source,
      route_profile_provider,
      family_route: .runner_route.runtime_redirect_reason
    }'
```

See [Runner Plugins](/docs/plugins/runner-plugins) for `--runner`, `--provider`,
hybrid routing, and route artifact cache semantics.

---

## Current Bundle Profiles

The CLI Gradle build selects model families using `-Pgollek.modelFamilies=<selectors>`.

| Profile | Default? | Meaning |
|---------|----------|---------|
| `core` | Yes | Production-friendly default families that Gollek should usually know about. |
| `optional` | No | Useful families that are stable enough to opt into explicitly. |
| `metadata_only` | No | Family and tokenizer metadata exist, but direct production runtime support may still be pending. |
| `experimental` | No | Research or vendor-specific families that should stay opt-in. |

Current high-level grouping:

| Profile | Families |
|---------|----------|
| `core` | `gemma`, `llama`, `mistral`, `phi`, `qwen` |
| `optional` | `code_llama`, `cohere`, `gemma2`, `gemma3`, `gemma4`, `yi` |
| `experimental` | `deepseek`, `deepseek_v2`, `deepseek_v3`, `deepseek_vl`, `deepseek_vl_hybrid`, `kimi` |
| `metadata_only` | `albert`, `align`, `altclip`, `arcee`, `bamba`, `bark`, `bart`, `barthez`, `bartpho`, `beit`, `bert`, `bert_generation`, `bert_japanese`, `bertweet`, `bigbird`, `bigbird_pegasus`, `biogpt`, `bitnet`, `blenderbot`, `blenderbot_small`, `blip`, `blip_2`, `bloom`, `bridgetower`, `bros`, `byt5`, `camembert`, `canine`, `chameleon`, `chinese_clip`, `clap`, `clip`, `clipseg`, `codegen`, `colmodernvbert`, `colpali`, `colqwen2`, `convbert`, `convnext`, `cpm`, `cpmant`, `ctrl`, `cvt`, `data2vec`, `dbrx`, `deberta`, `deberta_v2`, `deit`, `depth`, `detr`, `dialogpt`, `diffllama`, `dinov2`, `dinov2_with_registers`, `distilbert`, `donut`, `dpr`, `efficientnet`, `electra`, `encodec`, `ernie`, `esm`, `exaone`, `eurobert`, `falcon`, `falcon_h1`, `falcon_mamba`, `fast_vlm`, `flava`, `flaubert`, `florence2`, `focalnet`, `fnet`, `fsmt`, `funnel`, `fuyu`, `gemma3n`, `glm`, `glm_ocr`, `got_ocr2`, `gpt2`, `gpt_bigcode`, `gpt_neo`, `gpt_neox`, `gpt_neox_japanese`, `gpt_oss`, `gptj`, `granite`, `grounding_dino`, `groupvit`, `herbert`, `hubert`, `ibert`, `idefics`, `idefics2`, `idefics3`, `instructblip`, `instructblipvideo`, `internvl`, `jamba`, `jina_embeddings_v3`, `kosmos2`, `kosmos2_5`, `layoutlm`, `layoutxlm`, `levit`, `lighton_ocr`, `lilt`, `llama4`, `llava`, `llava_next`, `llava_next_video`, `llava_onevision`, `longformer`, `longt5`, `luke`, `lxmert`, `m2m100`, `mamba`, `mamba2`, `marian`, `markuplm`, `maskformer`, `mbart`, `megatron_bert`, `megatron_gpt2`, `metaclip_2`, `mgp_str`, `ministral`, `ministral3`, `mistral3`, `mistral4`, `mixtral`, `mllama`, `mobilebert`, `mobilenet`, `mobilevit`, `mobilevitv2`, `modernbert`, `modernbert_decoder`, `modernvbert`, `mpt`, `mpnet`, `mt5`, `musicgen`, `nemotron`, `nllb`, `nllb_moe`, `nomic_bert`, `nougat`, `olmo`, `olmo2`, `olmo3`, `olmo_hybrid`, `olmoe`, `oneformer`, `openai_gpt`, `opt`, `owlvit`, `owlv2`, `paligemma`, `pegasus`, `pegasus_x`, `persimmon`, `phi4_multimodal`, `phimoe`, `phobert`, `pix2struct`, `pixtral`, `plbart`, `poolformer`, `prophetnet`, `pvt`, `pvt_v2`, `qwen2_audio`, `qwen2_moe`, `qwen2_5_omni`, `qwen2_5_vl`, `qwen2_vl`, `qwen3_5`, `qwen3_5_moe`, `qwen3_moe`, `qwen3_next`, `qwen3_omni_moe`, `qwen3_vl`, `qwen3_vl_moe`, `qwen_vl`, `rag`, `recurrent_gemma`, `reformer`, `regnet`, `rembert`, `resnet`, `roberta`, `roberta_prelayernorm`, `roc_bert`, `roformer`, `rwkv`, `sam`, `segformer`, `seamless_m4t`, `shieldgemma2`, `siglip`, `siglip2`, `smollm3`, `smolvlm`, `speecht5`, `squeezebert`, `stablelm`, `starcoder2`, `switch_transformers`, `swin`, `t5`, `t5gemma`, `t5gemma2`, `trocr`, `umt5`, `upernet`, `vaultgemma`, `video_llama_3`, `video_llava`, `vipllava`, `vilt`, `vision_text_dual_encoder`, `vit`, `visual_bert`, `vits`, `wav2vec2`, `wav2vec2_bert`, `wavlm`, `whisper`, `x_clip`, `xglm`, `xlm`, `xlm_roberta`, `xlm_roberta_xl`, `xlnet`, `xmod`, `yolos`, `zamba` |

Metadata-only is deliberate. It allows tokenizer routing, architecture detection, diagnostics, and conversion planning without pretending that every family has efficient direct SafeTensor inference yet.

Capability-oriented selector aliases are also available for production bundle design:

| Alias | Meaning |
|-------|---------|
| `direct` | Text-oriented families with direct SafeTensor adapters or guarded direct-runtime paths. |
| `vlm` | Vision-language and multimodal generation families. |
| `vision` | Image, detection, document-vision, and vision-language families. |
| `audio` | Speech, audio-codec, audio-language, and omni multimodal families. |
| `embedding` | Encoder, retrieval, and embedding-oriented families. |
| `moe` | Sparse expert, hybrid, and router-heavy families that should be explicitly opted into. |
| `research` | All non-core families: `optional`, `metadata_only`, and `experimental`. |

Aliases are composable with profiles and family ids. For example, `core,vlm` keeps text production families attached while adding VLM metadata, and `core,moe` adds sparse expert families without attaching every research model.

---

## Select Families for a Build

Run these commands from the `gollek` repo root.

Attach the default production model farm:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=core :ui:gollek-cli:printModelFamilyBundle
```

`printModelFamilyBundle` includes preset conformance details when a preset is active, so local builds can see
selector or policy drift without opening the JSON report.

Attach one family:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=llama :ui:gollek-cli:compileJava
```

Attach several families:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=llama,qwen,gemma :ui:gollek-cli:compileJava
```

Attach a profile:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=metadata_only :ui:gollek-cli:compileJava
```

Attach a capability-oriented alias:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=core,vlm :ui:gollek-cli:compileJava
```

Attach a lean direct-runtime bundle:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=direct :ui:gollek-cli:compileJava
```

Attach everything for research, diagnostics, or release validation:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=all :ui:gollek-cli:compileJava
```

Detach all model-family plugins:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=none :ui:gollek-cli:compileJava
```

Write the selected bundle report for CI:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=core,metadata_only :ui:gollek-cli:writeModelFamilyBundleReport
./gradlew --no-daemon -Pgollek.modelFamilies=core,metadata_only :ui:gollek-cli:writeModelFamilyBundleGateReport
./gradlew --no-daemon -Pgollek.modelFamilies=core,metadata_only :ui:gollek-cli:validateModelFamilyBundleGate
./gradlew --no-daemon -Pgollek.modelFamilies=core,metadata_only :ui:gollek-cli:writePluginGatesReport
./gradlew --no-daemon -Pgollek.modelFamilies=core,metadata_only :ui:gollek-cli:validatePluginGates
```

The reports are written to:

```text
ui/gollek-cli/build/reports/gollek/model-family-bundle.json
ui/gollek-cli/build/reports/gollek/model-family-bundle-gate.json
ui/gollek-cli/build/reports/gollek/plugin-gates.json
```

`model-family-bundle.json` describes the selected build inputs, policies, aliases, presets, fixture status, and
selection rows. `model-family-bundle-gate.json` runs the packaged runtime classpath through ServiceLoader,
combines bundle availability with model-family plugin contract validation, and emits `gate`, `availability`,
`contract`, `manifest`, `discoveredFamilies`, and `families` for CI archival. `validateModelFamilyBundleGate`
uses the same runtime gate and fails the build when a selected family is missing, fixture or preset health is bad,
or a packaged model-family plugin violates the reusable family contract.

For an external model-family bundle, run the report writer with the output path first and one or more plugin
classpath entries after it. Path-separator lists are accepted too:

```bash
java -cp "<gollek-cli-runtime-classpath>" \
  tech.kayys.gollek.cli.util.ModelFamilyBundleGateReportWriter \
  /tmp/model-family-bundle-gate.json \
  /opt/gollek/plugins/gollek-model-example.jar
```

The Gradle gate tasks expose the same path through `-Pgollek.modelFamilyPluginClasspath`:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyPluginClasspath=/opt/gollek/plugins/gollek-model-example.jar \
  :ui:gollek-cli:validateModelFamilyBundleGate \
  :ui:gollek-cli:writeModelFamilyBundleGateReport
```

The generated report records those extra paths in `externalPluginClasspath`, then validates discovery, tokenizer
metadata, architecture adapters, and model-family contracts through that same external classloader. Missing
classpath entries fail fast so CI does not accidentally validate a packaged-only runtime when an external bundle
path was mistyped.
When one external bundle contains both extension providers and model-family plugins, use the common
`-Pgollek.pluginClasspath` property and the combined gate tasks:

```bash
./gradlew --no-daemon \
  -Pgollek.pluginClasspath=/opt/gollek/plugins/gollek-bundle.jar \
  :ui:gollek-cli:validatePluginGates \
  :ui:gollek-cli:writePluginGatesReport
```

`plugin-gates.json` embeds the extension-availability report and the model-family bundle report, then exposes one
top-level `gate` with `extensionStatus`, `modelFamilyStatus`, prefixed violations, and a single pass/fail status.

Use policy gates for production builds:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilies=core \
  -Pgollek.requiredModelFamilies=llama,qwen \
  -Pgollek.forbiddenModelFamilies=experimental,metadata_only \
  :ui:gollek-cli:check
```

Policy gates fail the build if a required family is missing or a forbidden family is selected.

Use alias policy gates when CI should validate a whole curated bundle, not only individual
families:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilies=direct \
  -Pgollek.requiredModelFamilyAliases=direct \
  -Pgollek.forbiddenModelFamilyAliases=embedding \
  :ui:gollek-cli:validateModelFamilyBundlePolicy
```

`requiredModelFamilyAliases` requires every family in that alias to be attached. `forbiddenModelFamilyAliases`
fails if any selected family overlaps the alias. This is stricter and more explicit than checking a single
family id, which is useful when aliases evolve over time.

The JSON report includes a CI-friendly `policyStatus` block:

```bash
jq -e '.policyStatus.passed == true' ui/gollek-cli/build/reports/gollek/model-family-bundle.json
jq '.policyStatus' ui/gollek-cli/build/reports/gollek/model-family-bundle.json
jq '{policySource,presetRequiredAliases,explicitRequiredFamilies}' ui/gollek-cli/build/reports/gollek/model-family-bundle.json
```

Use `policyStatus.passed` for a one-line release gate, then inspect `policyViolations` only when the gate
fails. `policySource` tells whether the required/forbidden gates came from the selected preset, explicit
Gradle policy flags, both, or no policy at all.

The same report also embeds fixture health so release tooling can check bundle policy and fixture coverage from one artifact:

```bash
jq -e '.fixtureStatus.passed == true' ui/gollek-cli/build/reports/gollek/model-family-bundle.json
jq '.fixtureStatus.coverage' ui/gollek-cli/build/reports/gollek/model-family-bundle.json
jq '.selection[] | select(.fixture.required) | {id, fixture: .fixture.passed}' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle.json
```

Use production presets when CI should apply selectors and policy gates from one reviewed name. Hyphenated
values such as `prod-llm` are accepted and normalized to `prod_llm` in reports and locks:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  :ui:gollek-cli:validateModelFamilyBundlePolicy
```

Available presets:

| Preset | Purpose |
|--------|---------|
| `prod_llm` | Lean direct-runtime LLM bundle with embedding metadata detached. |
| `prod_embedding` | Encoder/retrieval bundle with direct LLM and MoE families detached. |
| `prod_vlm_metadata` | Core text stack plus VLM metadata for routing and conversion planning. |
| `metadata_inspection` | Metadata-only model farm without direct-runtime families. |
| `research_all` | Attach every model-family plugin for diagnostics and release validation. |
| `runtime_proxy` | Detach all model-family plugins for runtime-only proxy builds. |

### Production tokenizer safety

Production presets whose ids start with `prod_` have an extra safety rule: they must not select families whose
tokenizer adapter metadata is still pending. This lets the same model farm support broad research discovery while
keeping production inference engines lean, predictable, and free of half-wired tokenizer routes.

The generated bundle report exposes this as `productionSafety`:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  :ui:gollek-cli:writeModelFamilyBundleReport

jq '.productionSafety' ui/gollek-cli/build/reports/gollek/model-family-bundle.json
jq '.availabilityStatus | {status,productionSafetyStatus,productionPendingTokenizerFamilies}' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle.json
```

The gate is considered passed when either the active bundle is not a production preset or every selected family
has ready tokenizer metadata. When it fails, `availabilityStatus.status` is `production_safety_failed`, and the
report lists the exact pending families plus their reasons. The higher-level `modelFamilyBundle.gate.status`
also preserves this as `production_safety_failed`, or `production_safety_and_contract_failed` when a plugin
contract violation is present too. The combined `pluginGates.status` promotes the same reason as
`model_family_production_safety_failed`, while `pluginGates.modelFamilyStatus` keeps the exact model-family gate
status for dashboards that need the sub-gate detail.

Use these checks before shipping a production binary:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  :ui:gollek-cli:validateModelFamilyBundlePresets \
  :ui:gollek-cli:validateModelFamilyBundlePolicy \
  :ui:gollek-cli:writeModelFamilyBundleGateReport
```

At runtime, `gollek modules` surfaces the same decision:

```bash
gollek modules --json | jq '.modelFamilyBundle.productionSafety'
gollek modules --json | jq '.modelFamilyBundle.availabilityStatus | {status,productionSafetyStatus,productionPendingTokenizerFamilies}'
gollek modules --json | jq '.modelFamilyBundle.gate | {status,violations}'
gollek modules --json | jq '.pluginGates | {status,modelFamilyStatus,violations}'
gollek modules --plugin-doctor
gollek modules --plugin-doctor --json | jq '.modelFamilies.productionSafety'
```

Recommended production pattern:

| Build lane | Preset/selector | Tokenizer rule |
|------------|-----------------|----------------|
| Production text LLM | `prod_llm` or `direct` | Pending-tokenizer families must be excluded or completed first. |
| Production embedding | `prod_embedding` | Encoder tokenizer metadata must be ready before release. |
| VLM routing metadata | `prod_vlm_metadata` | VLM metadata may be attached for routing, but pending tokenizer families stay visible in reports. |
| Research diagnostics | `research_all` or `all` | Pending-tokenizer families are allowed so discovery can continue. |
| Runtime proxy | `runtime_proxy` or `none` | No model-family tokenizer metadata is packaged. |

If the gate fails, either move that family out of the `prod_*` preset or complete the plugin's tokenizer
descriptor metadata before using the build for production inference.

Validate all preset definitions, not only the preset selected for the current build:

```bash
./gradlew --no-daemon :ui:gollek-cli:validateModelFamilyBundlePresets
./gradlew --no-daemon :ui:gollek-cli:printModelFamilyBundlePresets
```

This simulates each preset's selectors and checks its required families, forbidden families, required aliases,
and forbidden aliases. Use it after changing alias membership or preset policy so production presets cannot
silently drift into incomplete or oversized bundles.

`writeModelFamilyBundleReport` also includes `bundlePresets[].selectedCount` and
`bundlePresets[].policyStatus`, so release tooling can audit every preset from the generated JSON.
It also includes `activeBundlePresetConformance`, which compares the current selectors and policy inputs
against the active preset before the CLI is launched.

Validate active preset conformance in CI:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  :ui:gollek-cli:validateModelFamilyBundlePresetConformance
```

Add the conformance gate to the normal `check` lifecycle:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  -Pgollek.enforceModelFamilyBundlePresetConformance=true \
  :ui:gollek-cli:check
```

By default, the task allows explicit overrides only when they still reproduce the preset exactly. For release
pipelines that require the preset to be the sole source of truth, add
`-Pgollek.requireCleanModelFamilyBundlePresetConformance=true`; this fails even if explicit selectors or policy
flags happen to match the preset.

Pin a production bundle with a lock file when CI should catch unintended drift in selectors, selected
families, profiles, active preset conformance, policy inputs, or required fixture coverage:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  -Pgollek.modelFamilyBundleLock=model-family-bundle.direct.lock.properties \
  :ui:gollek-cli:writeModelFamilyBundleLock
```

Validate the current build against that lock:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  -Pgollek.modelFamilyBundleLock=model-family-bundle.direct.lock.properties \
  :ui:gollek-cli:validateModelFamilyBundleLock
```

Write a CI artifact without failing the build:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  -Pgollek.modelFamilyBundleLock=model-family-bundle.direct.lock.properties \
  :ui:gollek-cli:writeModelFamilyBundleLockDriftReport

./gradlew --no-daemon -q \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  -Pgollek.modelFamilyBundleLock=model-family-bundle.direct.lock.properties \
  :ui:gollek-cli:printModelFamilyBundleLockDriftJson
```

Validate the drift report contract used by CI/release dashboards:

```bash
./gradlew --no-daemon \
  :ui:gollek-cli:validateModelFamilyBundleLockDriftReportContract
```

The JSON report is written to `ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json`.
`validateModelFamilyBundleLock` writes the same report before failing, so CI can upload it as an artifact.
The report includes `currentBundleStatus`, which captures the active selectors, selected families, policy status,
preset conformance, production tokenizer safety, and fixture status from the current build.
`writeModelFamilyBundleLock` runs bundle policy and fixture validation before writing, so the lock is only
generated after the selected production bundle and required fixture set are healthy.
`check` also runs `validateModelFamilyBundleLockDriftReportContract`, which exercises synthetic scalar,
selection, and fixture fingerprint drift so dashboard-facing JSON fields do not change accidentally.

Inspect the high-signal drift summaries first:

```bash
jq '.conformanceSummaries' ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '.selectionSummaries' ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '.productionSafetySummaries' ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '.fixtureSummaries' ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '{driftCount,bundleScalarDriftCount,bundleSelectionDriftCount,productionSafetyDriftCount,conformanceDriftCount,fixtureDriftCount,expectedFixtureStatus,actualFixtureStatus}' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '.currentBundleStatus | {bundlePreset,familyCount,productionSafety,policyStatus,fixtureStatus}' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '.productionSafetyDrift' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '.bundleScalarDrift' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '.bundleSelectionDrift' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '.fixtureFingerprintDrift' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
jq '.drift[] | select(.key | startswith("fixture"))' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle-lock-drift.json
```

The default lock path is `ui/gollek-cli/model-family-bundle.lock.properties`. Override it with
`-Pgollek.modelFamilyBundleLock=<relative-path>` when maintaining separate production locks such as
`model-family-bundle.direct.lock.properties` or `model-family-bundle.embedding.lock.properties`.
The lock includes `presetConformanceStatus` and the selector/policy additions or omissions that explain drift,
plus `fixtureRequiredSelectors`, `fixtureRequiredFamilies`, `fixturePassed`, and fixture coverage counts.
It also stores `fixtureRequiredFingerprint`, `fixtureInventoryFingerprint`, `fixtureRequiredContentFingerprints`,
and `fixturePresentContentFingerprints`, so code review can distinguish a clean preset build from an intentional
override and can see which family fixture was required, lost, or quietly edited. When validation fails, the error
starts with preset conformance and fixture coverage drift summaries before listing the raw key-level lock
differences. The `bundleScalarDrift` array captures non-list changes such as bundle preset, bundle fingerprint,
family count, policy booleans, preset conformance booleans, and fixture coverage counts with `scope`, `label`,
`status`, `expected`, and `actual` fields. `productionSafetySummaries` and `productionSafetyDrift` isolate
production tokenizer requirement, readiness, pending-family, and pending-reason changes from the generic scalar
and selection drift arrays. The `fixtureFingerprintDrift` array provides the same fixture content drift as
structured JSON with `scope`, `familyId`, `status`, `expected`, and `actual` fields for release dashboards.

---

## Runtime Discovery

Model family plugins are regular Gollek plugins:

- They implement `tech.kayys.gollek.spi.model.ModelFamilyPlugin`.
- They also satisfy `tech.kayys.gollek.spi.plugin.GollekPlugin`.
- They register with `ModelFamilyPluginRegistry.global()` during plugin initialization.
- They are discovered by CDI, ServiceLoader, and the plugin manager path used by `gollek-plugin-core`.

The CLI also checks them through `PluginAvailabilityChecker`, so missing provider errors can show:

- Available model-family plugin ids.
- Bundle profiles such as `core` or `metadata_only`.
- Current bundle policy status, active bundle preset policy status, and preset-level violations.
- Bundle availability status, including detached builds, missing selected plugins, policy failures, fixture failures, and preset drift.
- Fixture status for the required model-family fixture set packaged into the binary.
- Direct SafeTensor support status.
- Missing bundled families.
- Duplicate `model_type` claim conflicts.

Use:

```bash
gollek modules --all
```

to inspect packaged runtime modules and model-family availability in a built CLI.

External model-family bundles should be discovered through the same classloader that will serve production
requests. This keeps attach/detach semantics consistent even when the CLI or inference engine has already scanned
its packaged classpath:

```java
ModelFamilyPluginRegistry.global().discoverServiceLoaderPlugins(pluginClassLoader);

List<String> familyIds = PluginAvailabilityChecker.getGlobalModelFamilyPluginIds(pluginClassLoader);
ModelFamilyBundleGate gate = PluginAvailabilityChecker.getGlobalModelFamilyBundleGate(pluginClassLoader);
if (gate.failed()) {
    throw new IllegalStateException(gate.failureMessage());
}
```

The external JAR still uses the same model-family ServiceLoader descriptor:

```text
META-INF/services/tech.kayys.gollek.spi.model.ModelFamilyPlugin
```

Use the explicit classloader path for detached tokenizer, architecture, VLM, embedding, or research-family bundles
that should be installed beside the production engine instead of compiled into every binary.

Build selector aliases are also packaged into the CLI manifest. Automation can inspect the alias definitions that were available when the binary was built:

```bash
gollek modules --json | jq '.modelFamilyBundle.bundleAliases[] | {id,familyCount,families}'
```

Bundle presets are packaged too, so release tooling can verify the binary was built from the reviewed preset:

```bash
gollek modules --fail-on-plugin-gates
gollek modules --fail-on-model-family-gate
gollek modules --json | jq '.pluginGates'
gollek modules --json | jq '.modelFamilyBundle | {bundlePreset, activeBundlePreset, availableBundlePresets}'
gollek modules --json | jq '.modelFamilyBundle.gate'
gollek modules --json | jq '.modelFamilyBundle.availabilityStatus'
gollek modules --json | jq '.modelFamilyBundle.productionSafety'
gollek modules --json | jq '.modelFamilyBundle.fixtureStatus'
gollek modules --json | jq '.modelFamilyBundle | {selectorSource, selectors, explicitSelectors, presetSelectors}'
gollek modules --json | jq '.modelFamilyBundle | {policySource,presetRequiredAliases,explicitRequiredFamilies}'
gollek modules --json | jq '.modelFamilyBundle.activeBundlePresetConformance'
gollek modules --json | jq '.modelFamilyBundle | {policyStatus, policyViolations}'
gollek modules --json | jq '.modelFamilyBundle.activeBundlePreset | {id,selectedCount,policyStatus}'
gollek modules --json | jq '.modelFamilyBundle.bundlePresets[] | {id,selectors,selectedCount,policyStatus,productionSafety}'
gollek modules --plugin-doctor
gollek modules --plugin-doctor --json | jq '.modelFamilies | {bundleAvailability,productionSafety}'
```

`selectorSource` tells whether the bundle came from an explicit `-Pgollek.modelFamilies`, the active preset,
or the default `core` fallback. `policySource` separately tells whether the bundle policy came from preset
policy, explicit Gradle policy flags such as `-Pgollek.requiredModelFamilies`, both, or neither. The
bundle-level policy reflects the exact selectors and required/forbidden gates used for this binary.
`activeBundlePresetConformance` compares the shipped binary back to the reviewed preset and reports `clean`,
`matched`, or `drifted` with selector and policy-input additions or omissions.
`gate` combines runtime bundle availability with model-family plugin contract validation. It reports `passed`,
`status`, `violationCount`, and prefixed `violations`, making it the single CI field to archive or fail on for a
model-family bundle release. Use `--fail-on-model-family-gate` when CI should print the same diagnostics and then
exit non-zero on bundle availability, fixture, preset-conformance, or model-family contract failures.
The top-level `pluginGates` object combines `extensionAvailability.gate` and `modelFamilyBundle.gate`; use
`--fail-on-plugin-gates` when the whole plugin surface should be treated as one runtime release decision.
`fixtureStatus` captures the required fixture selectors/families, fixture fingerprints, pass/fail status, and
missing/problem fixture families that were packaged into the binary. `availabilityStatus` condenses the runtime
view into `ready`, `detached`, `missing_plugins`, `policy_failed`, `production_safety_failed`, `fixture_failed`,
or `preset_drifted`, plus counts for selected, discovered, missing, and omitted families. It also includes
`productionSafetyStatus`, `productionSafetyPassed`, `productionPendingTokenizerFamilies`, `problems`, and
`remediationHints`, so dashboards and provider-not-found errors can point directly at missing plugin artifacts,
policy flag mismatches, pending-tokenizer production gates, fixture gate failures, or preset drift. This is the
field to check first when a production binary starts but a selected model-family plugin was not actually
discovered at runtime.
Human-facing provider errors also print the same fixture summary and list missing/problem fixture families, so
operators can identify fixture-gate failures without switching to JSON first.
Preset entries include the selected families and policy violations computed when the CLI was built, so runtime
diagnostics can confirm whether a shipped binary still matches the production preset that CI reviewed.

Each alias row also includes `selectedFamilies`, `missingFamilies`, `complete`, and `partial`, so CI can distinguish a bundle that fully satisfies `direct` from one that only overlaps it through shared families like Gemma 4.

The bundle report also classifies selector intent with `requestedFamilies`, `requestedProfiles`, `requestedAliases`, `reservedSelectors`, and `unknownSelectors`. That makes it easy to tell whether a build explicitly requested `direct` or merely satisfies it because `all` was selected.

### Optional Audio Extensions

The same attach/detach rule applies to higher-level extensions. Suling is the optional audio adapter used by the
MOSS TTS ONNX runtime. A production text-only inference engine can leave it detached, while an audio-serving build
can attach the external Suling module for FLAC and MP3 encoding.

Source builds prefer the external extension when it exists, then fall back to a tiny WAV-only stub:

```kotlin
includeOptionalProject("suling", "../extensions/audio/suling", "stubs/suling")
```

Inspect the packaged audio-extension state with:

```bash
gollek modules
gollek modules --json | jq '.extensionAvailability.totals'
gollek modules --json | jq '.extensionAvailability.policy'
gollek modules --json | jq '.extensionAvailability.policy.configuration'
gollek modules --json | jq '.extensionAvailability.contract'
gollek modules --json | jq '.extensionAvailability.gate'
gollek modules --json | jq '.extensionAvailability.contractViolations'
gollek modules --json | jq '.extensionAvailability.byKind.audio'
gollek modules --json | jq '.extensionAvailability.byId.suling'
gollek modules --json | jq '.audioExtensions.suling'
gollek run --model <moss-tts-id> --tts-diagnostics --json | jq '.suling'
```

`extensionAvailability` is the generic plugin-core view for any detachable extension. `audioExtensions.suling`
keeps the audio-specific convenience fields for existing automation. `gollek modules` uses camelCase fields
such as `productionReady`, `flacAvailable`, and `mp3EncodingAvailable`; `gollek run --tts-diagnostics --json`
uses snake_case fields such as
`production_ready`, `flac_available`, and `mp3_encoding_available`.
The text form prints an `Extension Availability` section with the same summary counts and provider rows.
Release gates can configure the same report as a policy check:

```bash
GOLLEK_REQUIRED_PRODUCTION_EXTENSIONS=suling gollek modules --json | jq '.extensionAvailability.policy'
GOLLEK_FORBIDDEN_EXTENSIONS=suling gollek modules --json | jq '.extensionAvailability.policy'
GOLLEK_REQUIRED_PRODUCTION_EXTENSIONS=suling gollek modules --fail-on-extension-gate
```

Use `GOLLEK_REQUIRED_EXTENSIONS` when an extension only needs to be attached and healthy,
`GOLLEK_REQUIRED_PRODUCTION_EXTENSIONS` when fallback modes are not acceptable, and
`GOLLEK_FORBIDDEN_EXTENSIONS` for lean inference binaries where an extension must stay detached.
The policy JSON includes `configuration.requiredExtensions`, `configuration.requiredProductionExtensions`,
and `configuration.forbiddenExtensions` entries so CI can see whether each gate came from a JVM system
property, an environment variable, or was left unset.
`gate` combines policy and provider-contract status into one production-friendly decision. It reports
`passed`, `status`, `violationCount`, and prefixed `violations`; use `--fail-on-extension-gate` when CI should
exit non-zero after printing the diagnostic report.
Runtime code can use the same gate without shelling out:

```java
ExtensionAvailabilityGate gate = PluginAvailabilityChecker.getGlobalExtensionAvailabilityGate(pluginClassLoader);
if (gate.failed()) {
    throw new IllegalStateException(gate.failureMessage());
}
```

Any detachable extension can publish the same health contract by implementing
`tech.kayys.gollek.plugin.core.ExtensionAvailabilityProvider` and adding a standard service descriptor:

```text
META-INF/services/tech.kayys.gollek.plugin.core.ExtensionAvailabilityProvider
```

The file contains one provider implementation class per line, for example:

```text
tech.kayys.gollek.cli.util.SulingAudioExtensionAvailabilityProvider
```

`ExtensionAvailabilityRegistry.global().discoverServiceLoaderProviders()` then makes classpath extensions visible
to `gollek modules --json` without hardcoding that extension into the CLI. Runtime plugin loaders can use the
explicit classloader overload when the extension lives in an external bundle:

```java
ExtensionAvailabilityRegistry.global().discoverServiceLoaderProviders(pluginClassLoader);
PluginAvailabilityChecker.getGlobalExtensionAvailabilityReports(pluginClassLoader);
```

This is the preferred attach/detach path for optional audio, vision, tokenizer, accelerator, or future
model-serving extensions that should not be bundled into every production inference engine.
External bundles should be validated through the same classloader they will use in production: the provider must be
discoverable only from the bundle classpath, its contract must pass, and the combined gate must fail when the
bundle publishes unstable ids, mismatched availability reports, or impossible readiness states.
The Gradle gate tasks can validate those external providers with `-Pgollek.extensionPluginClasspath`:

```bash
./gradlew --no-daemon \
  -Pgollek.extensionPluginClasspath=/opt/gollek/plugins/gollek-extension-tokenizer.jar \
  :ui:gollek-cli:validateExtensionAvailabilityProviderContracts \
  :ui:gollek-cli:writeExtensionAvailabilityGateReport
```

The registry also validates each provider contract. `contract` gives CI one gate-shaped summary with
`status`, `passed`, `violationCount`, `summaries`, and `byExtensionId`; `contractViolations` keeps the
flat machine-readable rows. The generated report records external provider paths in `externalPluginClasspath`.
Missing classpath entries fail fast so CI does not accidentally validate a packaged-only runtime when an external
extension bundle path was mistyped. Violations report unstable ids or kinds, provider/report id mismatches,
impossible attached/detached states, and production-ready reports that are unhealthy or detached. Treat a
failed contract as a release-gate failure for production extension bundles.

For CLI-packaged providers, keep the descriptor guarded with:

```bash
./gradlew :ui:gollek-cli:validateExtensionAvailabilityProviders
./gradlew :ui:gollek-cli:validateExtensionAvailabilityProviderContracts
./gradlew :ui:gollek-cli:writeExtensionAvailabilityGateReport
./gradlew :ui:gollek-cli:validateModelFamilyBundleGate
./gradlew :ui:gollek-cli:writeModelFamilyBundleGateReport
./gradlew :ui:gollek-cli:validatePluginGates
./gradlew :ui:gollek-cli:writePluginGatesReport
```

The first task checks ServiceLoader descriptors and provider source shape before compile. The second task runs
the packaged providers on the compiled CLI runtime classpath and fails if `contract.status` is `failed`.
The report task writes `ui/gollek-cli/build/reports/gollek/extension-availability-gate.json` with the same
`gate`, `policy`, `contract`, and extension rows that production CI can archive. The model-family gate tasks
write `ui/gollek-cli/build/reports/gollek/model-family-bundle-gate.json` and fail on the same combined
`modelFamilyBundle.gate` decision exposed by `gollek modules --fail-on-model-family-gate`. The combined plugin
gate tasks write `ui/gollek-cli/build/reports/gollek/plugin-gates.json` and fail when either the extension gate or
the model-family gate fails.

| Field | Meaning |
|-------|---------|
| `totals` | CI-friendly aggregate counts for attached, detached, healthy, unhealthy, production-ready, status, and kind. |
| `policy` | Optional release-gate result driven by `GOLLEK_REQUIRED_EXTENSIONS`, `GOLLEK_REQUIRED_PRODUCTION_EXTENSIONS`, and `GOLLEK_FORBIDDEN_EXTENSIONS`. |
| `policy.configuration` | Source metadata for each policy input, including the JVM property name, environment variable name, and active source. |
| `contract` | Aggregate provider-contract gate with `passed`, `status`, `violationCount`, `summaries`, and `byExtensionId`. |
| `gate` | Combined policy plus contract release gate used by `--fail-on-extension-gate`. |
| `contractViolations` | Machine-readable provider contract problems that should be fixed before shipping an extension bundle. |
| `byKind` | Extension reports grouped by kind, such as `audio`, so future tokenizer, vision, or accelerator extensions can share the same shape. |
| `byId` | Extension reports keyed by stable extension id. |
| `status` | `detached`, `fallback`, or `ready`. |
| `attached` / `detached` | Whether an audio adapter is on the runtime classpath. |
| `healthy` | Whether the current modular state is valid. Detached and fallback are healthy for lean builds. |
| `productionReady` / `production_ready` | True only when the external, non-fallback Suling module is attached. |
| `formats` | Encoded output formats exposed by the active adapter. The fallback advertises `wav`. |
| `flacAvailable` / `flac_available` | Whether the libFLAC-backed encoder is usable. |
| `mp3EncodingAvailable` / `mp3_encoding_available` | Whether the FFmpeg/libmp3lame encoder is usable. |
| `remediationHints` / `remediation_hints` | Operator hints, such as attaching the external Suling module or using WAV. |

This keeps the model farm and adjacent runtime extensions consistent: unsupported production features are not
silently packaged into every binary, and diagnostics can still explain exactly what is missing when an operator
asks for MP3 or FLAC from a lean build.

Build-time catalog readiness is available before launching a CLI binary. Generate the catalog report when a
release wants to prune the model farm or audit which families are safe to attach:

```bash
./gradlew --no-daemon :ui:gollek-cli:writeModelFamilyModuleCatalogReport

jq '.readinessCounts' \
  ui/gollek-cli/build/reports/gollek/model-family-module-catalog.json
jq '.catalog[] | {id, profile, readiness, tokenizerReady, productionReady, directSafetensorReady}' \
  ui/gollek-cli/build/reports/gollek/model-family-module-catalog.json
jq '.catalog[] | select(.productionReady) | {id, readiness, tokenizerKinds}' \
  ui/gollek-cli/build/reports/gollek/model-family-module-catalog.json
jq '.catalog[] | select(.directSafetensorReady) | {id, readiness}' \
  ui/gollek-cli/build/reports/gollek/model-family-module-catalog.json
jq '{passed, productionReadinessPendingFamilyCount, directSafetensorPendingFamilyCount, productionReadinessPendingFamilies, directSafetensorPendingFamilies}' \
  ui/gollek-cli/build/reports/gollek/model-family-module-catalog.json
```

Each catalog entry carries the derived fields production gates usually need:

| Field | Meaning |
|-------|---------|
| `tokenizerReady` | The family is included, has tokenizer metadata, and is not marked pending. |
| `productionReady` | The family is included, has complete service descriptors, is not metadata-only or experimental, and has ready tokenizer metadata. |
| `directSafetensorReady` | The family is production-ready and belongs to the guarded direct SafeTensor alias. |
| `metadataOnly` | The plugin is useful for resolution, docs, conversion planning, or diagnostics, but should stay out of production inference bundles by default. |
| `readiness` | One compact state such as `direct_safetensor_ready`, `production_ready`, `metadata_only`, `tokenizer_pending`, `tokenizer_missing`, `service_incomplete`, or `not_included`. |

`validateModelFamilyModuleCatalog` treats `productionReadinessPendingFamilies` and
`directSafetensorPendingFamilies` as release blockers. This lets experimental families stay visible as
`tokenizer_pending` without weakening the hard gate for core, optional, and direct-runtime production bundles.

Use the catalog report for packaging decisions and the live CLI matrix below for runtime classpath decisions.
They intentionally answer different questions: the catalog says what the source tree can produce, while
`gollek modules --json` says what the current binary actually attached.
The generated `META-INF/gollek-model-family-bundle.properties` manifest also carries
`productionReadinessPassed`, `productionReadinessPendingFamilies`, `directSafetensorReadinessPassed`,
and `directSafetensorPendingFamilies`, so packaged CLI/plugin diagnostics can reuse the same build-time gate
without re-scanning Gradle project metadata.
At runtime, the same signal is exposed through `gollek modules --json`:

```bash
gollek modules --json | jq '.modelFamilyBundle.catalogReadiness'
gollek modules --json | jq '.modelFamilyBundle.availabilityStatus | {catalogReadinessStatus,catalogReadinessPassed,productionReadinessPendingFamilies,directSafetensorPendingFamilies}'
gollek modules --json | jq '.pluginGates | {status,modelFamilyStatus,violations}'
```

When those packaged blockers fail, the model-family gate uses `catalog_readiness_failed`, and the combined
plugin gate preserves the scope as `model_family_catalog_readiness_failed`.

The same command exposes a capability matrix summary for attached model-family plugins. The JSON form is intended for automation:

```bash
gollek modules --json | jq '.modelFamilyPlugins.capabilityTotals'
gollek modules --json | jq '.modelFamilyPlugins.capabilityMatrix[] | {id,bundleProfile,tokenizer,gguf,architectureAdapterCount,directSafetensorStatus,onnx,training,multimodal}'
```

Use this matrix to decide whether a production bundle should attach or detach a family before shipping an inference engine. The matrix is derived from the SPI support report, so tokenizer reuse, direct SafeTensor readiness, GGUF/ONNX flags, training metadata, and multimodal modality claims stay consistent across CLI diagnostics and plugin checks.
The matrix also carries `architectureAdapterIds`, `architectureAdapterCount`, and `architectureAdapterPresent` so release gates can verify that direct-runtime families actually ship the adapter surface they advertise.

Runtime code can use the same SPI registry after parsing a Hugging Face `config.json`:

```java
ModelConfig config = ModelConfig.fromDirectory(modelDir, objectMapper);
ModelFamilyResolution resolution = ModelFamilyPluginRegistry.global().resolve(config);

if (resolution.resolved()) {
    Optional<ModelFamilySupportReport> family = resolution.primarySupportReport();
    List<ModelTokenizerDescriptor> tokenizers = resolution.tokenizerDescriptors();
}
```

`resolution.status()` is `RESOLVED`, `NOT_FOUND`, or `AMBIGUOUS`. The `familyIds()`,
`primaryFamilyId()`, `supportReports()`, `primarySupportReport()`, and `tokenizerDescriptors()`
results are immutable or optional-safe to pass into tokenizer routing, conversion planning, provider
selection, or production policy checks.

Tokenizer runtimes can use the higher-level helper when they only have a model directory:

```java
Optional<ModelFamilyResolution> resolution = TokenizerFactory.resolveModelFamily(modelDir);
Optional<ModelFamilyTokenizerInspection> tokenizers = TokenizerFactory.inspectModelFamilyTokenizers(modelDir);
Tokenizer tokenizer = TokenizerFactory.load(modelDir, null);
```

`TokenizerFactory.load` now uses the same model-family resolution result before falling back to generic
tokenizer file detection, so family-specific tokenizer descriptors and runtime diagnostics stay aligned.
`inspectModelFamilyTokenizers` checks each advertised tokenizer descriptor against the files on disk. When a
family resolves but no descriptor file group is usable, it reports `model_family_tokenizer_files_missing`
with remediation hints that name the required file groups.

Direct architecture resolution follows the same shape. `ModelArchitectureRegistry.resolve(config)` first
asks the matched model-family plugin for architecture adapters, then falls back to globally registered
adapters. That keeps detachable production bundles predictable: an unrelated plugin can advertise a broad
adapter, but the family that claimed the checkpoint gets first chance to resolve it.
If no direct adapter can be selected, the failure message includes the model-family resolver summary,
`problemCodes`, `remediationHints`, and compact direct SafeTensor support reports.

For production runners, use the shared runtime compatibility gate instead of duplicating these checks:

```java
ModelFamilyRuntimeCompatibility compatibility =
        ModelFamilyPluginRegistry.global().directSafetensorCompatibility(config, modelDir);

if (!compatibility.compatible()) {
    throw new IllegalStateException(String.join(", ", compatibility.problemCodes()));
}
```

The direct SafeTensor gate requires a resolved family, ready direct SafeTensor support, a selected architecture
adapter, tokenizer descriptors, and, when a model directory is provided, a usable tokenizer file group. It returns
the selected adapter id, usable tokenizer ids, problem codes, and remediation hints as one reusable decision object
for CLI diagnostics, release policy, and runtime provider gating.

Operators can inspect the same resolution result for a pulled or local checkpoint:

```bash
gollek show <model-id-or-path>
gollek show <model-id-or-path> --json | jq '.modelFamily'
```

The JSON object includes the resolution `status`, matched `familyIds`, compact support reports, and tokenizer
descriptor metadata. If the checkpoint has no readable `config.json`, the field is `null`.
When `requiresAttention` is true, `problemCodes` and `remediationHints` explain whether the checkpoint is
missing a family plugin, matched multiple overlapping families, or resolved to a plugin that did not publish a
support report.
For local checkpoints, each `.modelFamily.tokenizers[]` entry also includes `fileStatusAvailable`, `usable`,
`existingFileGroup`, and `missingFileGroups`, so scripts can tell whether an advertised tokenizer profile
actually matches the files on disk before starting inference.
The `.modelFamily.directArchitecture` object shows whether direct SafeTensor support is expected, which matched
family architecture adapters are attached, which adapter would be selected for this checkpoint, and any direct
adapter problem codes such as `model_family_architecture_adapters_missing`.
For production automation, prefer `.modelFamily.runtimeCompatibility.directSafetensor`: it is backed by the shared
SPI compatibility gate and includes `compatible`, selected architecture adapter details, usable tokenizer ids,
runtime problem codes, and remediation hints.

---

## What a Family Descriptor Contains

Every family publishes a `ModelFamilyDescriptor`:

```java
return new ModelFamilyDescriptor(
        "mamba",
        "Mamba / Mamba2",
        List.of("mamba", "mamba2"),
        List.of("MambaForCausalLM", "MambaModel", "Mamba2ForCausalLM", "Mamba2Model"),
        List.of(
                ModelFamilyCapability.CAUSAL_LM,
                ModelFamilyCapability.TOKENIZER,
                ModelFamilyCapability.TRAINING,
                ModelFamilyCapability.ONNX),
        Map.of(
                "bundle_profile", "metadata_only",
                "origin", "3rdparty/transformers/src/transformers/models/mamba",
                "tokenizer", "byte_level_bpe",
                "direct_safetensor", "pending_selective_state_space_runtime",
                "version", "0.1.0-SNAPSHOT"));
```

Important fields:

| Field | Purpose |
|-------|---------|
| `id` | Stable Gollek family id, usually lowercase snake case. |
| `displayName` | Human-readable name for diagnostics. |
| `modelTypes` | Hugging Face `config.json` `model_type` values claimed by this plugin. |
| `architectureClassNames` | Hugging Face architecture names such as `LlamaForCausalLM`. |
| `capabilities` | What this family advertises: causal LM, encoder, vision, audio, tokenizer, GGUF, ONNX, and so on. |
| `metadata.bundle_profile` | Build profile used by the CLI selector. |
| `metadata.origin` | Transformer source directory used as the implementation reference. |
| `metadata.direct_safetensor` | Readiness reason for direct SafeTensor runtime support. |
| `metadata.<scope>_direct_safetensor` | Partial-support caveat surfaced by diagnostics, for example `moe_direct_safetensor=pending_packed_expert_router_runtime`. |

Use `DIRECT_SAFETENSOR_INFERENCE` only when the family has a real architecture adapter and the runtime path is safe. If runtime work is pending, keep the descriptor metadata-only and set a clear pending reason.

Scoped direct SafeTensor caveats should use status-style values: `pending_*`, `experimental_*`, `not_*`, or a reason containing `_pending`. The bundle validator checks this convention so CLI diagnostics can classify partial runtime gaps consistently.

Descriptor contract checks also run through the SPI registry and `gollek modules --all`. They report machine-readable violations for malformed family ids, unknown bundle profiles, missing `origin` metadata, unsafe tokenizer file groups, missing tokenizer descriptors, duplicate tokenizer ids, direct SafeTensor capability without an architecture adapter, and duplicate `model_type` claims.

If a plugin overrides `supportReport()`, the report must stay consistent with the descriptor, architecture adapters, tokenizer descriptors, bundle profile, and direct SafeTensor readiness. The validator treats drift as a contract violation because that report drives CLI diagnostics, bundle matrices, and production attach/detach policy gates.

---

## Tokenizer Reuse

Tokenizer profiles are reusable descriptors, not one-off code paths. A family can advertise one or more tokenizers:

```java
@Override
public List<ModelTokenizerDescriptor> tokenizerDescriptors() {
    return List.of(ModelTokenizerDescriptor.sentencePieceBpe("llama-spm-bpe"));
}
```

Built-in helpers:

| Helper | Looks for |
|--------|-----------|
| `huggingFaceBpe(id)` | `tokenizer.json`, `vocab.json + merges.txt`, or nested `tokenizer/` variants. |
| `sentencePieceBpe(id)` | `tokenizer.json` or nested `tokenizer/tokenizer.json`; native SentencePiece remains explicitly marked as unsupported until provided. |
| `wordPiece(id)` | `tokenizer.json`, `vocab.txt`, or nested tokenizer variants. |

For unusual tokenizers, use a custom descriptor:

```java
new ModelTokenizerDescriptor(
        "rwkv-tokenizer",
        ModelTokenizerKind.CUSTOM,
        List.of(),
        Map.of("status", "metadata_only"));
```

At runtime, tokenizer code can ask the registry for descriptors that match a model type or architecture name. Each descriptor can then find the first complete file group inside a model directory.

---

## Fixture Validation

Each model-family module can carry tiny Hugging Face style fixtures under:

```text
src/test/resources/model-family-fixtures/<family-id>/
```

A useful starter fixture is only:

```text
config.json
tokenizer.json
```

`ModelFamilyFixtureValidator` checks that the fixture is still aligned with the plugin:

| Check | Why it matters |
|-------|----------------|
| `model_type` is claimed by `ModelFamilyDescriptor.modelTypes()` | The family can be selected from HF configs. |
| `architectures` intersects `architectureClassNames()` | The family can route common Transformers exports. |
| Tokenizer files satisfy one descriptor file group | Reusable tokenizer routing is not just metadata. |
| Direct SafeTensor adapters match the fixture when advertised | Runtime-ready families do not drift from their adapter claims. |

Example test:

```java
List<ModelFamilyContractViolation> violations = ModelFamilyFixtureValidator.validate(
        new ExampleModelFamilyPlugin(),
        Path.of(getClass().getResource("/model-family-fixtures/example").toURI()));

assertEquals(List.of(), violations.stream()
        .map(ModelFamilyContractViolation::summary)
        .toList());
```

Use real shapes from representative community checkpoints when they are known, but keep fixtures lightweight. Do not commit weights; fixture validation is for config, tokenizer-file layout, and plugin metadata drift.

Generate the fixture inventory report:

```bash
./gradlew --no-daemon -q :ui:gollek-cli:writeModelFamilyFixtureReport
```

The report is written to:

```text
ui/gollek-cli/build/reports/gollek/model-family-fixtures.json
```

Generate the compact fingerprint report when CI only needs fixture hashes:

```bash
./gradlew --no-daemon -q :ui:gollek-cli:writeModelFamilyFixtureFingerprintReport
./gradlew --no-daemon -q :ui:gollek-cli:printModelFamilyFixtureFingerprintJson
```

The compact report is written to:

```text
ui/gollek-cli/build/reports/gollek/model-family-fixture-fingerprints.json
```

Pin fixture fingerprints independently from a production bundle lock:

```bash
./gradlew --no-daemon -q \
  -Pgollek.modelFamilyFixtureFingerprintLock=model-family-fixture-fingerprints.lock.properties \
  :ui:gollek-cli:writeModelFamilyFixtureFingerprintLock

./gradlew --no-daemon -q \
  -Pgollek.modelFamilyFixtureFingerprintLock=model-family-fixture-fingerprints.lock.properties \
  :ui:gollek-cli:validateModelFamilyFixtureFingerprintLock

./gradlew --no-daemon -q \
  -Pgollek.modelFamilyFixtureFingerprintLock=model-family-fixture-fingerprints.lock.properties \
  :ui:gollek-cli:printModelFamilyFixtureFingerprintLockDriftJson
```

The drift artifact is written to:

```text
ui/gollek-cli/build/reports/gollek/model-family-fixture-fingerprint-lock-drift.json
```

The drift JSON includes `currentFingerprintStatus`, so CI can render the current pass state, aggregate hashes,
coverage counts, and per-family fixture hashes from the same artifact that reports drift.
`writeModelFamilyFixtureFingerprintLock` runs `validateModelFamilyFixtures` first, so a lock is only generated
after the required fixture set passes config/tokenizer validation.
Use `-Pgollek.enforceModelFamilyFixtureFingerprintLock=true` to include the fixture fingerprint lock in
`:ui:gollek-cli:check`.

Validate required fixture coverage:

```bash
./gradlew --no-daemon -q :ui:gollek-cli:validateModelFamilyFixtures
```

By default this gates the `core` model farm. Tighten or relax the gate with the same selector style used by bundles:

```bash
./gradlew --no-daemon -q \
  -Pgollek.requiredModelFamilyFixtures=direct \
  :ui:gollek-cli:validateModelFamilyFixtures

./gradlew --no-daemon -q \
  -Pgollek.requiredModelFamilyFixtures=none \
  :ui:gollek-cli:validateModelFamilyFixtures
```

The bundle report and bundle lock both include this fixture health. Use the report for live CI checks and the lock
to catch unintended changes to the required fixture surface or fixture contents:

```bash
jq '.fixtureStatus' ui/gollek-cli/build/reports/gollek/model-family-bundle.json
jq '.fixtureStatus.requiredContentFingerprints' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle.json
jq '{passed, requiredFixtureFingerprint, fixtureInventoryFingerprint}' \
  ui/gollek-cli/build/reports/gollek/model-family-fixture-fingerprints.json
jq '.fixtures[] | {id, contentFingerprint}' \
  ui/gollek-cli/build/reports/gollek/model-family-fixtures.json
```

---

## Add a New Model Family

Use this checklist when adapting a new family from Transformers.

### 1. Choose the Family Boundary

Keep one plugin per family cluster when the tokenizer and weight-layout story is shared:

| Good family boundary | Why |
|----------------------|-----|
| `llama` covers base Llama and Llama 3 | Code Llama is an optional detachable plugin; Llama 4, DiffLlama, MLLama, and Video-LLaMA 3 are separate because their tokenizer, MoE, vision, or attention paths differ. |
| `gemma` covers base Gemma | Gemma 2, Gemma 3 text, and Gemma 4 are optional detachable plugins; Gemma 4 owns `gemma4`, `gemma4_text`, `gemma4_vision`, `gemma4_audio`, and `gemma4_unified` metadata, but only the guarded dense text adapter is experimental direct SafeTensor. Gemma 4 MoE/A4B configs are parsed from `text_config`, then guarded because Transformers stores their expert branch as packed `experts.gate_up_proj` plus router scale tensors that need a dedicated runtime path. Gemma 4 12B Unified keeps tokenizer, processor, and family-resolution support in the Gemma 4 plugin while full unified multimodal embedder execution remains a runtime-plugin concern. Gemma 3n, PaliGemma, RecurrentGemma, ShieldGemma2, T5Gemma/T5Gemma2, and VaultGemma stay separate because their multimodal, recurrent, encoder-decoder, or safety-classifier paths differ. |
| `qwen` covers dense Qwen2/Qwen2.5/Qwen3 | MoE, VL, audio, and omni variants are separate plugins to keep production bundles lean. Qwen2-VL, Qwen2.5-VL, Qwen3-VL, and Qwen3-VL-MoE are separate because their processors, vision stacks, and sparse expert paths differ. |
| `mistral` covers base Mistral | Mixtral, Ministral, Mistral 3, and Mistral 4 are separate plugins because their MoE, Tekken, and multimodal paths differ. |
| `deepseek` covers R1 compatibility | DeepSeek-V2, DeepSeek-V3, DeepSeek-VL, and DeepSeek-VL-Hybrid are separate experimental plugins because MLA/MoE and vision-alignment paths should stay opt-in. |
| `mamba` covers `mamba`, `mamba2` | Same state-space family, different runtime maturity. |
| `bert`, `bert_generation`, `roberta`, `deberta`, `electra` are separate | Encoder and encoder-decoder families differ enough to keep claims clear. BERT-adjacent variants such as `modernvbert`, `roc_bert`, and `wav2vec2_bert` stay separate because their tokenizer, embedding, or audio processor paths differ. |
| `clip`, `clipseg`, `metaclip_2`, `x_clip`, and `vision_text_dual_encoder` are separate | CLIP derivatives share concepts, but segmentation heads, video processors, newer MetaCLIP layouts, and generic delegated dual-encoder configs should be detachable from the base CLIP plugin. |

If two families claim the same `model_type`, `validateModelFamilyBundle` and runtime diagnostics can report conflicts. Do not use overlapping claims unless you are intentionally replacing a plugin.

### Gemma 4 12B Unified Scope

`google/gemma-4-12B-it` is claimed by the optional `gollek-model-gemma4` plugin as `gemma4_unified`. The plugin recognizes the HF unified wrapper names (`Gemma4ForMultimodalLM`, `Gemma4ForImageTextToText`) and keeps the reusable `Gemma4Processor`, image/video processors, audio feature extractor, tokenizer descriptor, chat-template routing, and nested `gemma4_text` config parsing together.

This is not the same as declaring every runtime production-ready. Direct SafeTensor support remains scoped to the guarded dense text path; unified image/audio/video embedding is advertised as `metadata_processor_only_until_unified_embedder_runtime`. Production bundles that do not need Gemma 4 multimodal should keep the plugin detached or block the `vlm`/`audio` aliases during bundle validation.

The runtime attachment point is intentionally separate from the model-family plugin. A Gemma 4 unified execution plugin should implement `tech.kayys.gollek.spi.multimodal.UnifiedMultimodalRuntime`, expose a `UnifiedRuntimeManifest` that claims `gemma4_unified`, and register itself through `META-INF/services/tech.kayys.gollek.spi.multimodal.UnifiedMultimodalRuntime`. The CLI exposes the built-in `gemma4-unified-runtime` extension availability report through plugin-core; until a runtime implementation is present, `gollek modules --json` reports it as `detached` and `productionReady=false`. When the runtime is supplied through `--external-plugin-classpath` or an external plugin directory, the availability checker evaluates that scoped classloader so the same report flips to the runtime manifest readiness state.

External plugin directory inspection also reports unified runtime jars separately from model-family install candidates through `pluginDirectoryReadiness.unifiedRuntimePluginCandidates`, `unifiedRuntimeReady`, `unifiedRuntimeNotReady`, `unifiedRuntimePluginJars`, `hasUnifiedMultimodalRuntimeServiceEntry`, `unifiedRuntimeReady`, `unifiedRuntimeErrors`, `unifiedMultimodalRuntimeProviders`, and `unifiedMultimodalRuntimeMissingProviderClasses`. This lets CI verify that a runtime jar is present, declares ServiceLoader providers, and packages those provider class entries without pretending it is a model-family metadata plugin.

`gollek modules --json`, `gollek modules --plugin-doctor --json`, and the plugin-gates CI artifact also expose a `unifiedRuntimes` section with `runtimeCount`, `productionReadyCount`, discovered `modelTypes`, per-runtime manifest details, `contractViolations`, duplicate-claim `conflicts`, and selected model-family `modelFamilyRequirements`. The text command prints the same registry as **Unified Multimodal Runtimes**, and plugin doctor text includes the same selected requirement summary, so operators can spot a missing runtime, invalid manifest, or duplicate `gemma4_unified` claim without reading plugin jars by hand.

The combined plugin gate fails on invalid unified runtime manifests, duplicate runtime `model_type` claims, and selected model-family unified-runtime requirements that resolve to `missing_runtime`, `conflicting_runtime`, `invalid_runtime`, `insufficient_modalities`, or `not_production_ready`. That means `gollek modules --fail-on-plugin-gates` and the standalone plugin-gates check can block an unsafe production bundle even when the runtime jar itself is ServiceLoader-ready. Gate JSON also includes `violationCategories` for `extension`, `modelFamily`, `pluginDirectory`, `unifiedRuntime`, and `unifiedRuntimeRequirement`, while text output prints the same breakdown as `Gate categories`, so CI and operators can route failures without parsing human-readable violation strings.

Model-family plugins can now declare unified runtime requirements through `ModelFamilyUnifiedRuntimeRequirement`. The default adapter derives a requirement from descriptor metadata such as `unified_model_type` and `unified_runtime_required_modalities`, while families with richer needs can override `unifiedRuntimeRequirements()`. Gemma 4 declares `gemma4_unified` with `text`, `image`, `audio`, and `video` modalities, so tooling can distinguish “family metadata is installed” from “the multimodal execution runtime is attached and production-ready.”

The CLI compares those requirements against `UnifiedRuntimeRegistry` and reports each selected family requirement as `ready`, `missing_runtime`, `conflicting_runtime`, `invalid_runtime`, `insufficient_modalities`, or `not_production_ready` under `unifiedRuntimes.modelFamilyRequirements`; the CI artifact also includes `modelFamilyRequirementTotals` with counts, status totals, selected family IDs, selected model types, and attention-only family/model-type lists. Plugin doctor and plugin gates use the same compatibility result for remediation hints and fail-closed enforcement, making it clear whether to attach a runtime plugin, fix a runtime manifest, or detach duplicate runtime owners.

After ServiceLoader attaches a runtime, the built-in availability provider validates the `UnifiedRuntimeManifest`. Invalid manifests remain visible as attached extensions, but report `status=invalid`, `healthy=false`, `productionReady=false`, and include machine-readable manifest violations such as `missing_input_modalities`.

Runtime-aware tooling should use `tech.kayys.gollek.spi.multimodal.UnifiedRuntimeRegistry` to discover providers and retrieve validated manifest reports. This keeps Gemma 4, Qwen, LLaVA-style, and future unified runtimes on the same reusable ServiceLoader path.

Only one attached runtime should claim a given unified `model_type`. If multiple providers claim `gemma4_unified`, the built-in availability report fails closed with `status=conflict` so production inference never depends on ServiceLoader ordering.

This split is the production safety rail: the Gemma 4 family plugin can still provide tokenizer, processor, chat-template, and config inspection support for tools, while inference engines only attach the unified runtime when they explicitly package the image/audio/video embedder path.

### 2. Create the Module

Create a module under:

```text
models/gollek-model-<family>
```

The minimal Gradle file is:

```kotlin
plugins {
    `java-library`
    `maven-publish`
}

group = "tech.kayys.gollek"
version = "0.1.0-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(25))
    }
}

repositories {
    mavenCentral()
    mavenLocal()
}

dependencies {
    implementation(project(":spi:gollek-spi-model"))
    implementation(group = "jakarta.enterprise", name = "jakarta.enterprise.cdi-api")
    implementation(group = "jakarta.inject", name = "jakarta.inject-api")
}
```

### 3. Implement `ModelFamilyPlugin`

Start metadata-only unless direct inference is truly ready:

```java
package tech.kayys.gollek.models.example;

import jakarta.enterprise.context.ApplicationScoped;
import tech.kayys.gollek.spi.model.ModelFamilyCapability;
import tech.kayys.gollek.spi.model.ModelFamilyDescriptor;
import tech.kayys.gollek.spi.model.ModelFamilyPlugin;
import tech.kayys.gollek.spi.model.ModelTokenizerDescriptor;

import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ExampleModelFamilyPlugin implements ModelFamilyPlugin {

    @Override
    public ModelFamilyDescriptor descriptor() {
        return new ModelFamilyDescriptor(
                "example",
                "Example Model",
                List.of("example"),
                List.of("ExampleForCausalLM", "ExampleModel"),
                List.of(
                        ModelFamilyCapability.CAUSAL_LM,
                        ModelFamilyCapability.TOKENIZER,
                        ModelFamilyCapability.ONNX),
                Map.of(
                        "bundle_profile", "metadata_only",
                        "origin", "3rdparty/transformers/src/transformers/models/example",
                        "tokenizer", "byte_level_bpe",
                        "direct_safetensor", "pending_runtime_adapter",
                        "version", "0.1.0-SNAPSHOT"));
    }

    @Override
    public List<ModelTokenizerDescriptor> tokenizerDescriptors() {
        return List.of(ModelTokenizerDescriptor.huggingFaceBpe("example-bpe"));
    }
}
```

If direct SafeTensor support is ready, add architecture adapters:

```java
@Override
public List<ModelArchitecture> architectureAdapters() {
    return List.of(new ExampleArchitecture());
}
```

Then add `ModelFamilyCapability.DIRECT_SAFETENSOR_INFERENCE` only when the adapter is real and covered by tests.

### 4. Add `plugin.json`

Place it at:

```text
models/gollek-model-example/src/main/resources/plugin.json
```

Example:

```json
{
  "id": "model-family/example",
  "name": "Example Model Family",
  "version": "0.1.0-SNAPSHOT",
  "description": "Example model-family metadata and tokenizer routing",
  "vendor": "Kayys.tech",
  "mainClass": "tech.kayys.gollek.models.example.ExampleModelFamilyPlugin",
  "dependencies": [],
  "optionalDependencies": [],
  "properties": {
    "extensionPoint": "model-family",
    "bundleProfile": "metadata_only",
    "families": ["example"]
  }
}
```

The `properties.bundleProfile` value must match the Gradle `ModelFamilyModule` profile.

### 5. Add ServiceLoader Entries

Create both files:

```text
models/gollek-model-example/src/main/resources/META-INF/services/tech.kayys.gollek.spi.model.ModelFamilyPlugin
models/gollek-model-example/src/main/resources/META-INF/services/tech.kayys.gollek.spi.plugin.GollekPlugin
```

Each file should contain the implementation class:

```text
tech.kayys.gollek.models.example.ExampleModelFamilyPlugin
```

The dual entry is intentional. It lets model-family discovery work through the model SPI and lets the core plugin manager treat the same class as a regular Gollek plugin.

### 6. Register the Module

Add the module to `settings.gradle.kts`:

```kotlin
include("models:gollek-model-example")
```

Add it to `ui/gollek-cli/build.gradle.kts`:

```kotlin
ModelFamilyModule("example", ":models:gollek-model-example", "metadata_only"),
```

### 7. Add Config Architecture Fallbacks

Update `ModelConfig` so config-only loading can infer the right architecture:

```java
case "example" -> "ExampleForCausalLM";
```

Add separate cases for variants when needed:

```java
case "example_v2" -> "ExampleV2ForCausalLM";
```

### 8. Validate the Family

Compile the module:

```bash
./gradlew --no-daemon :models:gollek-model-example:compileJava
```

Validate model-family metadata:

```bash
./gradlew --no-daemon -q :ui:gollek-cli:validateModelFamilyBundle
```

Validate fixture coverage:

```bash
./gradlew --no-daemon -q :ui:gollek-cli:validateModelFamilyFixtures
```

Add a fixture test:

```text
models/gollek-model-example/src/test/resources/model-family-fixtures/example/config.json
models/gollek-model-example/src/test/resources/model-family-fixtures/example/tokenizer.json
```

Run the model-family module test:

```bash
./gradlew --no-daemon -q :models:gollek-model-example:test
```

Compile the CLI with the new family selected:

```bash
./gradlew --no-daemon -Pgollek.modelFamilies=example :ui:gollek-cli:compileJava
```

Generate a CI-readable report:

```bash
./gradlew --no-daemon -q -Pgollek.modelFamilies=example :ui:gollek-cli:writeModelFamilyBundleReport
```

Confirm the report contains the family:

```bash
jq -e '(.families | index("example") != null)' \
  ui/gollek-cli/build/reports/gollek/model-family-bundle.json
```

---

## Promote a Family from Metadata-Only to Runtime-Ready

Do not promote a family just because its descriptor compiles. Promote only after the runner path is accurate and fast enough for production.

Checklist:

- Add architecture adapters that map config and tensor names correctly.
- Validate tokenizer selection with real model directories.
- Add weight-layout tests for representative checkpoints.
- Verify runner compatibility for the target artifact format.
- Add direct inference smoke tests for a small checkpoint or fixture.
- Change `direct_safetensor` metadata from `pending_*` to ready behavior by adding `DIRECT_SAFETENSOR_INFERENCE` and adapters.
- Move the bundle profile only when production owners agree the family belongs in default builds.

Recommended profile movement:

```text
metadata_only -> optional -> core
```

Experimental families should not jump directly to `core`.

---

## Production Packaging Patterns

Use these common selector patterns:

| Build type | Selector |
|------------|----------|
| Lean production LLM server | `-Pgollek.modelFamilies=direct` |
| Production LLM plus VLM metadata | `-Pgollek.modelFamilies=core,vlm` |
| Retrieval or embedding service | `-Pgollek.modelFamilies=embedding` |
| Default Gollek CLI | no selector, equivalent to `core` |
| Research model farm | `-Pgollek.modelFamilies=all` |
| Metadata inspection build | `-Pgollek.modelFamilies=metadata_only` |
| Runtime-only proxy without model-family metadata | `-Pgollek.modelFamilies=none` |

For production CI, prefer presets when one reviewed name should drive both bundle selection and policy gates:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilyBundlePreset=prod-llm \
  :ui:gollek-cli:check
```

For strict production CI, combine selectors with policies:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilies=llama,qwen \
  -Pgollek.requiredModelFamilies=llama,qwen \
  -Pgollek.forbiddenModelFamilies=experimental,metadata_only \
  :ui:gollek-cli:check
```

This keeps the model farm modular and makes accidental model bloat visible before it ships.

If the production target is an alias-defined bundle, assert the alias directly:

```bash
./gradlew --no-daemon \
  -Pgollek.modelFamilies=direct \
  -Pgollek.requiredModelFamilyAliases=direct \
  -Pgollek.forbiddenModelFamilyAliases=embedding \
  :ui:gollek-cli:validateModelFamilyBundlePolicy
```

Avoid assuming aliases are mutually exclusive. For example, `direct` and `vlm` intentionally overlap through
Gemma 4, so `-Pgollek.modelFamilies=direct -Pgollek.forbiddenModelFamilyAliases=vlm` fails and shows the
overlapping selected families.

Release automation can use `.policyStatus.passed` from
`ui/gollek-cli/build/reports/gollek/model-family-bundle.json` as the high-level signal and reserve
`.policyViolations` for debugging details. Use `.policySource` when CI needs to prove whether those policy
gates came from a reviewed preset, explicit Gradle flags, or a deliberate mix of both.

For drift protection, generate a lock with `writeModelFamilyBundleLock`, commit it, and validate it in CI
with `validateModelFamilyBundleLock`. To include the lock guard in the normal Gradle check lifecycle, pass
`-Pgollek.enforceModelFamilyBundleLock=true` alongside the same preset or selectors and lock path.
If the build is preset-driven, also pass `-Pgollek.enforceModelFamilyBundlePresetConformance=true` so CI catches
preset drift before comparing the lower-level lock file.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `Unknown gollek.modelFamilies selector` | Family id or selector alias was not added to `ui/gollek-cli/build.gradle.kts`. | Add a `ModelFamilyModule` entry, or add the id to `modelFamilyBundleAliases` if it is a curated alias. |
| `missing plugin.json` | Module resources are incomplete. | Add `src/main/resources/plugin.json`. |
| `ServiceLoader file does not list mainClass` | Service file class name differs from `plugin.json`. | Keep both ServiceLoader files and `mainClass` identical. |
| `bundleProfile is ... expected ...` | `plugin.json` and Gradle profile disagree. | Use one profile in both places. |
| Direct SafeTensor says `DECLARED_NO_ADAPTER` | Capability was advertised without architecture adapters. | Add adapters or remove `DIRECT_SAFETENSOR_INFERENCE`. |
| Duplicate `model_type` claim | Two plugins claim the same Hugging Face model type. | Split claims or choose one owner. |
| Family selected but not discovered at runtime | Dependency was selected in Gradle but ServiceLoader/CDI metadata is missing. | Run `validateModelFamilyBundle` and inspect service files. |

---

## Design Rules

- Keep model-family plugins small and dependency-light.
- Treat Transformers source as the reference for config, tokenizer, architecture names, and tensor layout.
- Prefer metadata-only descriptors over unsafe runtime claims.
- Use `bundle_profile` as a production boundary, not just a label.
- Keep tokenizer descriptors reusable and file-group based.
- Register through both model SPI and core plugin SPI so the family can be used by runtime diagnostics, CLI checks, and future dynamic plugin loading.
- Do not let model-family modules pull heavyweight inference dependencies into every CLI build. Runners own execution dependencies.
