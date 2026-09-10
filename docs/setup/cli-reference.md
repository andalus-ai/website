---
layout: default
title: Gollek CLI Reference
---

# Gollek CLI Reference

Quick reference for the core CLI commands.

---

## Chat with Models

Start an interactive chat session with any supported model.

```bash
gollek chat --model google/gemma-4-E2B-it --gguf
```

### GGUF Conversion Options

Force GGUF format with custom quantization:

```bash
# Default Q4_K_M quantization
gollek chat --model ~/models/my-model --gguf

# Custom quantization
gollek chat --model ~/models/my-model --gguf --quant Q8_0
```

### Chat Options

| Flag | Description | Default |
|------|-------------|---------|
| `-m, --model` | Model ID or path | - |
| `-p, --provider` | Provider ID (gguf, openai, gemini, etc.) | Auto |
| `--gguf` | Force GGUF format (converts if necessary) | false |
| `--quant` | Quantization type for GGUF conversion | Q4_K_M |
| `--temperature` | Sampling temperature | 0.2 |
| `--max-tokens` | Max tokens to generate | 256 |
| `--top-p` | Top-p sampling | 0.95 |
| `--top-k` | Top-k sampling | 40 |
| `--stream` | Stream response token by token | true |
| `--session` | Enable persistent session (KV cache reuse) | true |
| `--concise` | Use concise system prompt | false |
| `-v, --verbose` | Show detailed internal logs | false |
| `-q, --quiet` | Quiet mode: only output messages | false |
| `--no-color` | Disable ANSI color output | false |
| `--json` | Enable JSON output mode | false |
| `--sse` | Output as OpenAI-compatible SSE JSON | false |
| `-o, --output` | Save conversation to file | - |

### Quantization Types

| Type | Quality | Size | Speed | Use Case |
|------|---------|------|-------|----------|
| `Q4_0` | Good | Smallest | Fastest | Edge devices, limited memory |
| `Q4_K_M` | Better | Small | Fast | **Default** - Balanced |
| `Q5_0` | High | Medium | Moderate | Better quality |
| `Q5_K_M` | High | Medium | Moderate | Good balance |
| `Q6_K` | Very High | Large | Slower | High quality needs |
| `Q8_0` | Best | Largest | Slowest | Maximum quality |
| `F16` | Original | 2x | Fast | No quantization |
| `F32` | Original | 4x | Slowest | Full precision |

---

## Convert to GGUF

Convert a local model (directory or file) into GGUF.

```bash
gollek convert --input ~/models/llama-2-7b --output ~/conversions --quant q4_k_m
```

Dry‑run (resolve paths only):

```bash
gollek convert --input ~/models/llama-2-7b --output ~/conversions --dry-run
```

Options:
- `--input`: Input model path (file or directory)
- `--output`: Output GGUF file or directory
- `--quant`: Quantization type (`q4_k_m`, `q8_0`, `f16`, ...)
- `--overwrite`: Overwrite output if it exists
- `--dry-run`: Resolve paths without converting
- `--json`: Print JSON output for scripting
- `--json-pretty`: Pretty-print JSON output
- `--model-base`: Base path for relative input paths
- `--output-base`: Base path for relative output paths

---

## Run Inference

```bash
gollek run --model Qwen/Qwen2.5-0.5B-Instruct --prompt "Hi"
```

---

## Agent Serving Preflight

Inspect Gollek's agent-facing discovery contract and validate a serving route for an external agent runtime without invoking a model, executing tools, or running retrieval.

```bash
gollek agent capabilities \
  --base-url http://localhost:8080 \
  --api-key community \
  --require-serving-boundary

gollek agent contract \
  --base-url http://localhost:8080 \
  --api-key community \
  --require-serving-boundary

gollek agent model-capabilities \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --require-serving-boundary

gollek agent tools-validate \
  --base-url http://localhost:8080 \
  --api-key community \
  --tool-file tools.json \
  --require-clean \
  --require-serving-boundary

gollek agent request-validate \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --surface chat \
  --prompt "Can this route support my agent?" \
  --tool-file tools.json \
  --rag-context "Gollek validates payload mapping without invoking the model." \
  --require-clean \
  --require-serving-boundary

gollek agent mcp-tools \
  --base-url http://localhost:8080 \
  --api-key community \
  --require-tools \
  --require-serving-boundary

gollek agent template-check \
  --request-file wayang-agent-route.json \
  --json

gollek agent template-example --list

gollek agent template-example \
  --id embedding_rag \
  --output wayang-agent-route.json

gollek agent template-example \
  --id embedding_rag \
  --output wayang-agent-route.json \
  --overwrite

gollek agent template-example \
  --id embedding_rag \
  --json

gollek agent template-schema --json
```

```bash
gollek agent readiness \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --surface chat \
  --feature-profile chat_agent \
  --prompt "Can this route support my agent?" \
  --require-tools \
  --require-clean \
  --require-serving-boundary \
  --json

gollek agent preflight \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --surface chat \
  --feature-profile chat_agent \
  --prompt "Can this route support my agent?"

gollek agent preflight \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-embed \
  --feature-profile embedding_rag \
  --prompt "Find context for this task" \
  --no-mcp \
  --no-tool-validation
```

Use `gollek agent template-schema --json` to print the canonical Draft 2020-12 schema for saved agent route templates before wiring a builder, GitHub Action, or Wayang-Gollek integration. Use `gollek agent template-example --list` to show the starter catalog for chat, Responses, embeddings/RAG, and MCP tool-schema routes, or add `--json` when a website, installer, or low-code builder needs a machine-readable choice list. Use `gollek agent template-example --id embedding_rag --output wayang-agent-route.json` to generate a valid starter route template by catalog id and save it locally, then run it through `gollek agent template-check` before publishing. Human mode prints the exact `gollek agent template-check --request-file ... --json` command for the saved file, including shell-safe quoting when the path contains spaces. `--output` writes the selected route template JSON, or the catalog JSON when combined with `--list`; it refuses to replace an existing file unless `--overwrite` is set. `--json` can still be used when stdout must remain machine-readable. `--id` accepts the catalog ids and also normalizes hyphenated forms such as `embedding-rag`; explicit `--surface` or `--feature-profile` overrides must match the selected id. Use `gollek agent template-check` as the local publishing guard for saved agent route templates. It parses `--request-json` or `--request-file`, checks top-level route fields against the nested `request`, rejects unsupported surfaces, feature profiles, and preflight policy profiles, and exits without HTTP, model invocation, tool execution, retrieval, or workflow state. Human mode prints stable `[code: ...]` annotations plus compact `field`, `value`, `suggested`, and `allowed` hints for template issues; JSON mode keeps the compatibility `issues` string array and also emits `issue_details[]` with stable `code`, `field`, optional `value`, optional `suggested_value`, and optional `allowed_values` for CI annotations. Use `gollek agent readiness` as the CI bundle for agent-serving integration checks. It calls capabilities, contract, model capabilities, MCP tool discovery, tool validation, request validation, and preflight, then emits `gollek.agent_readiness_report` with `checked_areas`, `checks`, and `issues_by_area` for dashboard-friendly gating. Readiness exits `1` on any blocked checklist item, including serving-boundary drift. Use `--json` with any `gollek agent` subcommand for CI-friendly raw output. Use `--feature-profile` with `agent_serving`, `chat_agent`, `responses_agent`, `embedding_rag`, or `mcp_tools` to choose a named serving bundle; `embedding_rag` defaults generated requests and example templates to the embeddings surface when `--surface` is omitted. Use `--request-json` or `--request-file` with `template-check`, `request-validate`, `readiness`, or `preflight` to send either a direct chat, Responses, or embeddings request, or a full saved route template with a nested `request` object. These commands reject explicit route conflicts locally before calling Gollek unless `--model`, `--surface`, or `--feature-profile` intentionally overrides the template. In JSON mode, route conflicts return `AGENT_ROUTE_CONFLICT` with `conflicts[].field`, `conflicts[].top_level`, and `conflicts[].request` for CI annotations. Add `--tool-file` for OpenAI-compatible tool definitions, `--rag-context` or `--rag-file` for caller-owned retrieval context, and `--no-mcp` or `--mcp-optional` when the route should not block on MCP discovery.

Human-mode `gollek agent readiness` prints model, surface, feature profile, per-check status, endpoint, and any blocking or warning messages across capabilities, contract, model route, MCP discovery, tool validation, request validation, and server preflight. Blocking and warning lines include stable `[code: ...]` annotations when available, so operators can copy the exact CI/dashboard reason without opening raw JSON. When the server exposes preflight `check_results`, human-mode `gollek agent preflight` prints the same style of per-area status, codes, and details so operators can fix the route without opening the raw JSON first.

Chat request preflight shows the serving boundary and the normalized request shape:

```text
Gollek agent preflight: ready
Endpoint: http://localhost:8080/v1/agent/preflight
Model: demo-model
Surface: chat
Feature profile: chat_agent
Boundary: validation_only=true, model_invoked=false, tool_execution=false, retrieval_execution=false, tool_authorization=false
Issues: blocking=0, warnings=0
Checks: ready=5, blocked=0, skipped=1
- request_validation: ready, requested=true
  details: surface=chat, model=demo-model
  boundary: validation_only=true, model_invoked=false, tool_execution=false, retrieval_execution=false
  request: streaming=false, messages=2, inputs=0, tools=1, parameters=model,tools
  rag: injected=true, items=1, alias=rag_context
```

Embedding preflight keeps the same service boundary while exposing vector-route details for caller-owned RAG:

```text
Gollek agent preflight: ready
Model: demo-embed
Surface: embeddings
- request_validation: ready, requested=true
  details: surface=embeddings, model=demo-embed
  boundary: validation_only=true, model_invoked=false, tool_execution=false, retrieval_execution=false
  embeddings: inputs=2, input_lengths=5,4, requested_dimensions=768, encoding=float, metadata_keys=tenant
  embedding boundary: generation=true, retrieval_execution=false, retrieval_policy_owner=agent_orchestrator, vector_store_owner=agent_orchestrator
```

| Flag | Description | Default |
|------|-------------|---------|
| `--base-url` | Gollek serving base URL | `GOLLEK_BASE_URL`, then `http://localhost:8080` |
| `--api-key` | API key sent as `X-API-Key` and `Authorization: Bearer` | `GOLLEK_API_KEY`, then `community` |
| `--require-serving-boundary` | For `capabilities`, `contract`, `model-capabilities`, `tools-validate`, `request-validate`, and `mcp-tools`, exit `1` when Gollek does not advertise the serving-engine boundary. `readiness` always treats boundary drift as blocked. | false |
| `--tool-json`, `--tools-json` | Inline JSON tool object, array, or object with `tools` array for `tools-validate` | - |
| `--tool-file`, `--tools-file` | JSON tool definition file(s) for `tools-validate`, `request-validate`, `readiness`, or `preflight` | - |
| `--require-clean` | For `tools-validate`, `request-validate`, and `readiness`, exit `1` when portability warnings are returned | false |
| `--server` | For `mcp-tools`, inspect one MCP server | all enabled servers |
| `--raw-mcp-tools` | For `mcp-tools`, `readiness`, or `preflight`, request raw MCP schemas instead of OpenAI-compatible tools | false |
| `--include-disabled-mcp` | For `mcp-tools`, `readiness`, or `preflight`, include disabled MCP registrations | false |
| `--require-tools` | For `mcp-tools` and `readiness`, exit `1` when discovery returns no tools | false |
| `--model`, `-m` | Model id to validate, check, preflight, or include in `template-example` output | Request `model` field |
| `--id`, `--example-id` | For `template-example`, generate a starter by catalog id: `chat`, `responses`, `embedding_rag`, or `mcp_tools` | - |
| `--list`, `--catalog` | For `template-example`, print the available starter route-template catalog instead of one route template | false |
| `--output`, `-o` | For `template-example`, write the generated route template or catalog JSON to a file | - |
| `--overwrite` | For `template-example --output`, replace an existing output file | false |
| `--surface` | Compatibility surface for `template-example`, `template-check`, `request-validate`, `readiness`, or `preflight`: `chat`, `responses`, or `embeddings` | `chat` |
| `--feature-profile` | Serving feature profile for `template-example`, `template-check`, `request-validate`, `readiness`, or `preflight`: `agent_serving`, `chat_agent`, `responses_agent`, `embedding_rag`, or `mcp_tools` | `agent_serving` |
| `--request-json`, `--request-file` | OpenAI-compatible request JSON; `template-check`, `request-validate`, `readiness`, and `preflight` also accept a full route template with nested `request`; `template-check` requires one of these inputs | Generated from prompt |
| `--rag-context`, `--rag-file` | Caller-owned RAG context to validate for injection | - |
| `--no-mcp` | Skip MCP tool discovery | false |
| `--mcp-optional` | Do not block when MCP discovery is unavailable | false |
| `--no-tool-validation` | Skip tool schema validation | false |
| `--no-request-validation` | Skip request dry-run validation | false |
| `--json` | Print the raw discovery, local template-check, template schema, template example/catalog, readiness, or preflight response | false |

### Text-to-Speech with ONNX

Gollek can run the MOSS TTS Nano ONNX pipeline locally and save generated speech as WAV, plus FLAC or MP3 when the external Suling audio extension is attached. The packaged fallback is healthy for lean builds and supports WAV; FLAC uses the libFLAC FFM backend, and MP3 uses the FFmpeg FFM bridge with `libmp3lame`.

```bash
# Pull the TTS model
gollek pull OpenMOSS-Team/MOSS-TTS-Nano-100M-ONNX

# Generate balanced MP3 with a named preset
gollek run --model 71e8f7 \
  --prompt "apa kabar dunia" \
  --voice "en Trump" \
  --audio-quality balanced \
  --output ~/Downloads/tes-onnx-id.mp3

# Generate lossless FLAC with separate selector flags
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice-lang en \
  --voice-gender female \
  --audio-quality lossless \
  --output hello.flac

# Preview decoded PCM while the final file is being generated
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice "en Trump" \
  --live-audio \
  --output hello.mp3

# Inspect available voices without generating audio
gollek run --model 71e8f7 --list-voices

# Inspect MOSS TTS model, codec, ONNX caches, and audio backends
gollek run --model 71e8f7 --tts-diagnostics

# Emit structured diagnostics for scripts and health checks
gollek run --model 71e8f7 --tts-diagnostics --json

# Inspect the packaged Suling audio-extension state
gollek modules --json | jq '.extensionAvailability.byId.suling'
gollek modules --json | jq '.audioExtensions.suling'

# Warm MOSS TTS assets and ONNX sessions without generating audio
gollek run --model 71e8f7 --tts-warmup

# Warm MOSS TTS and report cache/session state as JSON
gollek run --model 71e8f7 --tts-warmup --json

# Preview stale MOSS TTS optimized graph cache cleanup
gollek run --model 71e8f7 --tts-cache-prune

# Apply stale MOSS TTS optimized graph cache cleanup
gollek run --model 71e8f7 --tts-cache-prune-apply
```

MOSS TTS uses a companion codec repository, `OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano-ONNX`. Gollek discovers it from the local model index and can pull it automatically unless `--no-tts-auto-codec` is set.

Repeated MOSS TTS runs cache ONNX Runtime optimized graphs under `~/.gollek/cache/onnx/optimized/moss-tts` by default, and codec sessions are opened lazily so normal runs skip unused codec graphs. The cache key includes ONNX external `.data` sidecars, so repaired or replaced model weights create fresh optimized graph entries. `Audio details` reports the cache state, such as `onnx cache 0/4 hit (4 built)` for a fresh normal run or `onnx cache 4/4 hit` once warm. Diagnostics show cache directory size, current optimized files, stale optimized files, unrelated optimized files, orphan sidecars, and external data sidecar inventory. Use `--tts-cache-prune` to preview stale optimized graph cleanup, then `--tts-cache-prune-apply` to delete the stale optimized graph files. Prune is scoped to stale files that match the resolved model's graph filename families, so unrelated optimized graph files in the same cache root are listed and reported but not deleted. External `.data` sidecars are pruned only when removing stale graphs would leave no current or unrelated optimized graph in the cache root; JSON includes `external_data_sidecar_prune_policy`, `pruneable_external_data_sidecar_*`, and `retained_external_data_sidecar_*` fields for automation. Diagnostics, warmup, and prune support `--json`, which prints structured cache, session, asset, voice, codec, and audio backend status for scripts. MOSS TTS defaults ONNX Runtime native logging to `error` so JSON output stays parseable; set `GOLLEK_ONNX_LOG_LEVEL=warning` or `-Dgollek.onnx.log-level=warning` when native ORT warnings are useful. Long-lived JVM processes also keep small MOSS session and asset caches: `onnx sessions warmed` / `onnx assets warmed` mean the model was loaded into the process cache, while `onnx sessions hot` / `onnx assets hot` mean the request reused already-open sessions and parsed metadata/tokenizer assets. Set `GOLLEK_ONNX_OPTIMIZED_MODEL_CACHE=false` or `-Dgollek.onnx.optimized-model-cache.enabled=false` to disable graph caching, and use `GOLLEK_ONNX_OPTIMIZED_MODEL_CACHE_DIR` or `-Dgollek.onnx.optimized-model-cache.dir` to relocate it. Set `GOLLEK_ONNX_MOSS_TTS_SESSION_CACHE=false` or `-Dgollek.onnx.moss-tts.session-cache.enabled=false` to disable in-process session caching; `GOLLEK_ONNX_MOSS_TTS_SESSION_CACHE_MAX_ENTRIES` and `-Dgollek.onnx.moss-tts.session-cache.max-entries` tune its size. Asset caching has matching `GOLLEK_ONNX_MOSS_TTS_ASSET_CACHE` and `GOLLEK_ONNX_MOSS_TTS_ASSET_CACHE_MAX_ENTRIES` controls.

### Run Options

| Flag | Description | Default |
|------|-------------|---------|
| `--model` | Local model id, short id, Hugging Face id, or path | - |
| `--prompt` | Prompt text for text, image, or audio generation | - |
| `--provider` | Provider override, such as `onnx`, `gguf`, or `safetensor` | Auto |
| `--output`, `-o` | Output path for image or audio artifacts | Provider default |
| `--seed` | Random seed for reproducible image/TTS output. MOSS TTS defaults to `1234`. | Generated for image, `1234` for TTS |
| `--random-seed`, `--tts-random-seed` | Use a fresh random TTS seed when `--seed` is omitted | false |
| `--voice`, `--tts-voice` | TTS voice preset or selector string | Auto/default |
| `--voice-lang`, `--voice-language` | TTS voice language selector, such as `en`, `jp`, or `zh` | - |
| `--voice-gender` | TTS gender selector, or a preset term when used with `--voice-lang` | - |
| `--list-voices`, `--voices` | Print TTS voice presets for the resolved model and exit | false |
| `--tts-diagnostics`, `--tts-preflight` | Inspect local MOSS TTS model, codec, voices, caches, and audio encoders without generating audio | false |
| `--tts-warmup`, `--onnx-warmup` | Warm MOSS TTS model assets and ONNX sessions without generating audio | false |
| `--tts-cache-prune`, `--onnx-cache-prune` | Preview stale MOSS TTS optimized graph cache cleanup | false |
| `--tts-cache-prune-apply`, `--onnx-cache-prune-apply` | Delete stale MOSS TTS optimized graph cache files | false |
| `--tts-codec`, `--codec` | Companion codec model id, short id, or path | Auto |
| `--no-tts-auto-codec` | Disable automatic MOSS codec pull | false |
| `--tts-max-frames`, `--max-frames` | Maximum audio frames for TTS generation | Model limit |
| `--tts-max-seconds`, `--max-seconds` | Maximum generated audio duration | Model limit |
| `--audio-format`, `--tts-audio-format` | Audio output format for TTS: `wav`, `flac`, or `mp3` | From `--output`, preset, or WAV |
| `--audio-quality`, `--tts-audio-quality` | TTS quality preset: `compact`, `speech`, `balanced`, `high`, or `lossless` | Auto |
| `--audio-bitrate`, `--audio-bitrate-kbps` | Encoded bitrate in kbps for formats such as MP3 | Preset or encoder default |
| `--audio-channels`, `--tts-audio-channels` | Channel mode: `auto`, `mono`, `stereo`, or `native` | auto |
| `--tts-codec-decode`, `--codec-decode` | MOSS codec decode mode: `auto`, `streaming`, or `full` | auto |
| `--audio-stream-chunk-kb`, `--tts-stream-chunk-kb` | Encoded audio stream chunk size in KiB | 64 |
| `--tts-stream-progress-frames` | Emit progress every N generated frames | Runner default |
| `--no-tts-stream-progress` | Hide live TTS progress updates | false |
| `--tts-stream-pcm`, `--audio-stream-pcm` | Emit decoded PCM preview chunks while streaming | false |
| `--live-audio`, `--tts-live-audio` | Play decoded PCM chunks while the final file is generated | false |
| `--no-low-latency-audio` | Emit PCM preview after generation instead of during frame generation | false |
| `--no-audio-polish` | Disable DC removal, edge fades, and peak normalization | false |
| `--no-audio-normalize` | Disable peak normalization while keeping other audio polish | false |
| `--audio-gain-db` | Extra output gain before encoding | 0 dB |
| `--audio-peak-db` | Peak-normalization target in dBFS | -3 dBFS |
| `--audio-fade-ms` | Fade-in/fade-out duration in milliseconds | Runner default |
| `--flac-compression` | FLAC compression level, 0 fastest through 8 smallest | Preset or 5 |
| `--ext` | Explicit output extension. Overrides the extension in `--output`. | Provider format |

### TTS Audio Formats

| Preset | Format | Default Encoding | Use Case |
|--------|--------|------------------|----------|
| `compact` | MP3 | 64 kbps | Small files and quick sharing |
| `speech` | MP3 | 96 kbps | Spoken-word drafts |
| `balanced` | MP3 | 128 kbps | General-purpose output |
| `high` | MP3 | 192 kbps | Higher-quality lossy output |
| `lossless` | FLAC | Compression level 8 | Archival or post-processing |

You can override the preset with `--audio-format`, `--audio-bitrate`, or `--flac-compression`. Output extension detection also works, so `--output hello.mp3` writes MP3 unless an explicit format says otherwise.

### TTS Voice Selection

Voice selection is intentionally strict enough to avoid accidental fallbacks:

- `--voice "en Trump"` selects the real `EN Trump` preset.
- `--voice-lang en --voice-gender Trump` is equivalent to `--voice "en Trump"`.
- `--voice-lang en --voice-gender female` selects an English female preset.
- `--voice "jp male"` reports that no Japanese male preset is available when the model does not ship one.
- Unknown terms fail with an error that lists valid voices for the requested language.

TTS runs print audio-native metrics instead of token speed:

```text
Audio details: 2.08s, 48000 Hz, 1ch, 26 frames, 128 kbps, voice EN Trump, seed 1234, mono collapsed, polished peak
[Audio: 2.08s, Generation: 2.91s, Speed: 0.71x realtime, RTF: 1.40, Synthesis: 8.9 frames/s]
```

---

## Pull a Model

```bash
gollek pull hf:Qwen/Qwen2.5-0.5B-Instruct
```

---

## Manage Extensions

Use extensions for installable external packages such as OCR/VL pipelines, training tools, quantizers, optimizers, exporters, datasets, evaluators, or backend bridges.

```bash
gollek extensions kinds
gollek extensions init features/gollek-ocr-lab --kind pipeline --pipeline-id ocr-lab --gollek-path gollek
gollek extensions init features/gollek-awq-lab --kind quantization --adapter-id awq-quantizer --input model --output model --target llm --format safetensors,gguf --gollek-path gollek
gollek extensions --details --paths
gollek extensions inspect path/to/extension.jar --strict
gollek extensions install path/to/extension.jar --force
gollek extensions index --output gollek-extensions.index.json
gollek extensions migrate --dry-run
gollek extensions finalize-migration --dry-run
gollek extensions prune-legacy --dry-run
gollek extensions doctor --strict --json
gollek extensions backups --json
gollek extensions rollback extension-id --dry-run
gollek extensions remove extension-id
```

`gollek features` is still accepted as an alias. `gollek modules` shows built-in runtime modules and low-level plugins.

`gollek extensions kinds` lists scaffold kinds, generated service type, default inputs/outputs, target hints, and copyable examples. `gollek extensions init` defaults to a pipeline scaffold. Passing `--kind training`, `optimization`, `quantization`, `backend`, `exporter`, `dataset`, or `evaluator` scaffolds a `FeatureAdapter` service and manifest capability for non-inference-extension work.

Preferred extension metadata lives at `META-INF/gollek-extension.json`; legacy `META-INF/gollek-feature.json` manifests are still supported. Generated manifests include service metadata and an ahead-of-time loading note so tools can inventory extension entrypoints without loading classes.

`gollek extensions migrate` copies legacy `~/.gollek/features` jars into `~/.gollek/extensions` and writes the preferred lock file. The legacy directory is not a runtime extension path. Add `--force` to replace conflicting target jars after rollback backups are created.

`gollek extensions finalize-migration --dry-run` previews legacy jars that already match a preferred extension by checksum, extension id, feature id, pipeline id, adapter id, provider class, or implementation class. Running without `--dry-run` archives the legacy jar into rollback backups first, then removes it from `~/.gollek/features`. `gollek extensions prune-legacy` remains available as the lower-level cleanup command.

`doctor` reports extension, feature, pipeline, adapter, provider class, and implementation class collisions. It treats them as warnings normally and as failures under `--strict`.

`doctor` also reports a migration-only `legacy_migration` status. The legacy directory is not scanned as a runtime path, but doctor can still suggest `migrate --dry-run` or `finalize-migration --dry-run` when old jars are present.

Legacy path configuration such as `GOLLEK_FEATURE_PATH` or `-Dgollek.features.path` is ignored. `doctor` reports those settings as warnings, and `--strict` fails so stale team or CI configuration is visible.

On the JVM, installed extension jars can be loaded dynamically from `~/.gollek/extensions`, `GOLLEK_EXTENSION_PATH`, or `-Dgollek.extensions.path`. In GraalVM native image runtime, dynamic jar loading is disabled; extensions must be included ahead of time in the native build, while `doctor` still inspects installed jar manifests. `gollek extensions index --output gollek-extensions.index.json` emits a launcher/build inventory with jar checksums, ServiceLoader entries, manifest capabilities, validation status, and native-image hints.

---

[Back to Docs Index](/docs/) &nbsp; [CLI Installation](/docs/setup/cli-installation)
