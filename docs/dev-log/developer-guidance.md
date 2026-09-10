---
layout: default
title: Developer Guidance
---

# Developer Guidance

Operational guidance for benchmarking, CI gates, and rollout safety.

---

## Latest Strict Gate Status

<section class="subtle-panel gate-status-panel" id="gate-status-panel">
  <div class="gate-status-head">
    <strong>Latest strict matrix:</strong>
    <span class="gate-pill gate-pill-unknown" id="gate-status-pill">UNKNOWN</span>
  </div>
  <div class="gate-status-meta" id="gate-status-meta">Loading latest gate summary…</div>
  <div class="gate-status-metrics" id="gate-status-metrics"></div>
</section>

---

## Benchmark Workflow

Use three profiles consistently:

1. `baseline`
2. `hybrid-fp8-bf16`
3. `sageattention2-intent`

Run with:
- `bench-multilora-zipf.sh` for a single profile
- `bench-matrix-advanced.sh` for full matrix + gate evaluation
- `bench-compare.sh` for baseline-vs-candidate delta reports

---

## CI Modes

1. Smoke (`bench-matrix-smoke.yml`)
- deterministic mock-backed check
- safe default for PR merge protection

2. Strict (`bench-matrix-strict.yml`)
- manual run against real endpoints
- preferred before release cut
- emits trend artifacts (`trends/matrix-gates.csv`, `trends/matrix-gates.json`) in each run
- emits gate alert artifacts (`gate-alert.txt`, `gate-alert.md`) in each run
- can send optional webhook alert on failure (`GOLLEK_BENCH_ALERT_WEBHOOK`)

---

## Gate Guidance

Default hybrid gate targets:
- throughput uplift: `>= 20%` (`req/s` or `tokens/s`)
- latency p95 regression: `<= 10%`
- absolute error-rate regression: `<= 0.005`

Runtime-tag policy:
- `--runtime-tag-gate auto|on|off`
- recommended: `on` for strict runs, `auto` for mixed environments

---

## Metal Runner Modes (Apple Silicon)

Metal runners are controlled with a single mode flag that supports auto-detect and manual forcing:

```properties
gollek.runners.metal.enabled=true
gollek.runners.metal-offload.enabled=true
gollek.runners.metal.mode=auto  # auto|standard|offload|force|disabled
```

Behavior:
- `auto`: detect availability and pick standard vs offload based on model size vs unified memory
- `standard`: force the in-memory Metal runner
- `offload`: force the weight-offload runner
- `force`: keep Metal runners active even when detection fails
- `disabled`: remove Metal runners from selection

Configuration sources:
- `gollek.runners.metal.mode` via `GOLLEK_METAL_MODE` env var
- `gollek.runners.metal.enabled` via `GOLLEK_METAL_ENABLED` env var
- `gollek.runners.metal-offload.enabled` via `GOLLEK_METAL_OFFLOAD_ENABLED` env var

Engine device preference (routing defaults):
- `gollek.engine.device.preference=auto|metal|cuda|cpu|none` (default: `auto`)
- `auto` sets `preferredDevice=METAL` on Apple Silicon, otherwise no preference
- Request override (default on): `device=metal|cuda|cpu|rocm|tpu|npu` in request parameters
- Disable request overrides: `gollek.engine.device.preference.allow-request-override=false`

Runner auto-Metal toggles:
- GGUF: `gguf.provider.gpu.auto-metal=true` and `gguf.provider.gpu.auto-metal.layers=-1`
- GGUF: `gguf.provider.coalesce.enabled=true`, `gguf.provider.coalesce.window-ms=3`, `gguf.provider.coalesce.seq-max=1` (set `seq-max > 1` to enable multi-sequence micro-batching)
  - Metrics: `gollek.gguf.coalesce.seq.max`, `gollek.gguf.coalesce.seq.avg`, `gollek.gguf.coalesce.seq.total`
- GGUF Converter: set `dryRun=true` on `/v1/converter/gguf/convert` to resolve paths without converting.
- GGUF Converter: `POST /v1/converter/gguf/convert/preview` resolves paths without converting and returns `derivedOutputName`, `inputBasePath`, and `outputBasePath`.
- CLI: `gollek convert --input ~/models/llama-2-7b --output ~/conversions --quant q4_k_m`
- LiteRT: `litert.provider.gpu.auto-metal=true`
- LibTorch: `libtorch.provider.gpu.auto-mps-enabled=true`
- ONNX Runtime: `onnx.runner.execution_provider=coreml` (Apple Silicon CoreML EP)
- Global Metal switches (`gollek.runners.metal.enabled=false` or `gollek.runners.metal.mode=disabled`) also disable ONNX CoreML.
- CoreML smoke test (optional): set `gollek.onnx.library-path=/path/to/libonnxruntime.dylib` and run the ONNX module tests.
- ONNX device selection tests cover:
  - `~/.gollek/libs/` fallback when `gollek.runners.onnx.library-path` is missing.
  - Apple Silicon + `coreMlAvailable=true` exposes `DeviceType.METAL`.
- Hugging Face ONNX integration test (optional):
  set `GOLLEK_ONNX_HF_REPO`, `GOLLEK_ONNX_LIBRARY_PATH` (must point to a real ONNX Runtime library),
  and optionally `GOLLEK_HF_TOKEN` or `HF_TOKEN` if the repo is gated, then run the ONNX module tests.
  To make the test fail instead of skipping on network/404/401, set `GOLLEK_ONNX_HF_REQUIRED=true`.
  You can also enable strict mode via Maven: `mvn -f gollek/extension/runner/onnx/gollek-runner-onnx/pom.xml -Phf-integration-required test`.
  If strict mode fails with DNS errors, check local DNS/VPN/proxy settings or run in non-strict mode.
  Quick ONNX test matrix:
  - Optional integration: `GOLLEK_ONNX_HF_REPO=onnx-community/tiny-random-bert`
  - Required integration: `GOLLEK_ONNX_HF_REPO=... GOLLEK_ONNX_HF_REQUIRED=true`
  - Library path: `GOLLEK_ONNX_LIBRARY_PATH=~/.gollek/libs/libonnxruntime.dylib`
  - Tokens (if gated): `GOLLEK_HF_TOKEN=$HF_TOKEN`

CLI Native Build (GraalVM):
- Build: `mvn -f inference-gollek/ui/gollek-cli/pom.xml -Pnative -DskipTests clean package`
- Output binary: `inference-gollek/ui/gollek-cli/target/gollek`
- Temp directory override (sandbox-friendly): `-H:TempDirectory=/tmp` (already wired in CLI build args)
- File logging toggle:
  - Disable file logging: `GOLLEK_CLI_FILE_LOG_ENABLED=false`
  - Override log path: `GOLLEK_CLI_LOG_FILE=/tmp/gollek/cli.log`
  - Default path: `~/.gollek/logs/cli.log`
- CLI run example:
  - `GOLLEK_CLI_FILE_LOG_ENABLED=false inference-gollek/ui/gollek-cli/target/gollek --help`
- Native CLI wrapper (cleans deprecated env keys):
  - `inference-gollek/ui/gollek-cli/scripts/run-native.sh --help`

SafeTensors provider:
- Default backend is `auto`, which prefers GGUF conversion (fast, Metal-aware) when the converter is available.
- Configure backend explicitly: `safetensor.provider.backend=auto|gguf|libtorch`.
- Conversion output directory: `safetensor.provider.ggufOutputDir=~/.gollek/models/gguf/converted`.
- GGUF conversion uses the built-in Java converter in `gollek/extension/runner/gguf/gollek-gguf-converter`.
- Install ONNX Runtime (prebuilt): 
  `make -C gollek/extension/runner/onnx/gollek-runner-onnx/src/main/cpp/onnxruntime install`
  (copies `libonnxruntime.*` into `~/.gollek/libs/` which the runner will auto-detect if the configured path is missing).

LiteRT (TFLite):
- Base path for `.litertlm` models: `litert.provider.model.base-path=~/.gollek/models/litert`
- LiteRT module tests: `mvn -f gollek/extension/runner/litert/gollek-runner-litert/pom.xml test`
- Optional real-model integration test:
  - `LITERT_LIBRARY_PATH=~/.gollek/libs/libtensorflowlite_c.dylib`
  - `GOLLEK_TFLITE_MODEL_URL=https://storage.googleapis.com/download.tensorflow.org/models/mobilenet_v1_2018_08_02/mobilenet_v1_1.0_224_quant.litertlm`
  - Strict mode: `GOLLEK_TFLITE_REQUIRED=true` (fails instead of skip on download errors)
  - The LiteRT loader auto-searches `~/.gollek/libs/` for `libtensorflowlite_c.*` if no override is set.
- Sample model helper:
  - `bash gollek/extension/runner/litert/gollek-runner-litert/scripts/download-sample-model.sh`
- LiteRT runtime helper:
  - `bash gollek/extension/runner/litert/gollek-runner-litert/scripts/download-litert-runtime.sh`
  - Optional: `GOLLEK_TFLITE_RUNTIME_URL=https://.../libtensorflowlite_c.dylib` to download directly
- GitHub Releases auto-download (if assets are published):
  - `GOLLEK_LITERT_RUNTIME_REPO=bhangun/gollek`
  - `GOLLEK_LITERT_RUNTIME_RELEASE=latest`
  - `GOLLEK_LITERT_RUNTIME_ASSET=litert-runtime-macos-arm64.tar.gz`
  - Asset naming details: `gollek/extension/runner/litert/gollek-runner-litert/docs/RELEASE_ASSETS.md`
  - Release checklist: `gollek/extension/runner/litert/gollek-runner-litert/docs/RELEASE_CHECKLIST.md`
  - Release notes template: `gollek/extension/runner/litert/gollek-runner-litert/docs/RELEASE_NOTES_TEMPLATE.md`
  - GitHub Actions workflow: `.github/workflows/litert-runtime-release.yml`
  - Build + release workflow: `.github/workflows/litert-runtime-build-and-release.yml`
- Make targets:
  - `make litert-sample`
  - `make litert-runtime`
  - `make litert-runtime-package`

Release How-To (LiteRT runtime assets):
1. Build or obtain `libtensorflowlite_c.*` for each target OS/arch.
2. Package with `make litert-runtime-package` (produces `dist/litert-runtime-*.tar.gz`).
3. Upload assets to a GitHub release (manual or via `LiteRT Runtime Release` workflow).
4. Verify download + smoke test using the commands in the release checklist.

Diagnostics:
- Auto mode will skip offload when the model fits unified memory.
- Force mode keeps Metal runners active even if detection reports unavailable.
- If Metal is unavailable and mode is not `force`, the Metal runners are removed from selection.
- Build/install note: `make -C gollek/extension/kernel/gollek-backend-metal/src/main/cpp/metal install`
  copies `libgollek_metal.dylib` to `~/.gollek/libs/` (and resources for packaging).

Decision flow (auto + manual):

```mermaid
flowchart TD
  A["Start"] --> B["Read gollek.runners.metal.mode"]
  B --> C{"Mode = disabled?"}
  C -->|Yes| X["Disable all Metal runners"]
  C -->|No| D{"Metal available?"}
  D -->|No| E{"Mode = force?"}
  E -->|Yes| F["Keep Metal runners (forced)"]
  E -->|No| X
  D -->|Yes| G{"Mode = standard?"}
  G -->|Yes| H["Select standard Metal only"]
  G -->|No| I{"Mode = offload?"}
  I -->|Yes| J["Select offload Metal only"]
  I -->|No| K["Auto: estimate model vs unified memory"]
  K -->|Fits| H
  K -->|Does not fit| J
```

Example logs:

```text
INFO  [MetalRunner] Metal runner enabled (mode=auto, metalAvailable=true)
INFO  [MetalWeightOffloadingRunner] Metal offload skipped (auto) — model fits in unified memory
```

GPU smoke test (Apple Silicon only):
- Opt-in by setting `-Dgollek.metal.tests=true`
- Optional strict mode: `-Dgollek.metal.tests.strict=true` (fails on Metal init errors instead of skipping)
- Provide the dylib path via `-Dgollek.metal.library-path=/path/to/libgollek_metal.dylib`,
  `-Dgollek.runners.metal.library-path=...`, or `GOLLEK_METAL_LIBRARY_PATH`
- Default search paths: `~/.gollek/libs/libgollek_metal.dylib`, `/usr/local/lib/libgollek_metal.dylib`, `/Library/Gollek/libgollek_metal.dylib`
- The test skips automatically if Metal is unavailable or the dylib is missing
- Headless CI can report `No Metal device found`; run on a logged-in desktop session for GPU validation.
- CI/profile shortcut: `mvn -f gollek/extension/kernel/gollek-backend-metal/pom.xml -Pmetal-gpu-tests test`
- JVM note: the profile sets `--enable-native-access=ALL-UNNAMED` to satisfy FFM access.

Troubleshooting checklist:
- Metal not selected: confirm `gollek.runners.metal.enabled=true` and the device is Apple Silicon.
- Metal unavailable in logs: set `gollek.runners.metal.mode=force` to test manual override.
- Offload never used: try a larger model or set `gollek.runners.metal.mode=offload`.
- Unexpected CPU fallback: verify other runners are enabled and the Metal mode is not `disabled`.
- `No Metal device found`: run tests in a logged-in desktop session (headless CI may not expose Metal).

Build note:
- If you see `class not found` errors after moving SPI types, run a clean build to clear stale reactor output: `mvn -f gollek/pom.xml clean install`.

---

## Failure Triage

When matrix fails:

1. Open `gate-summary.txt` first.
2. Map failure to gate type:
- throughput
- latency
- error
- SA2 runtime tag
3. Use `compare/report.txt` and `results.csv` to isolate impact.
4. Roll back to baseline flags if regression is user-visible.

Update website badge data after strict run:

```bash
./scripts/publish-latest-gate-summary.sh \
  --gate-json /path/to/strict-run/gate-summary.json \
  --output ../website/gollek-ai.github.io/assets/data/latest-gate-summary.json
```

---

## Trend Tracking

Generate trend snapshots:

```bash
./scripts/bench-trend-snapshot.sh \
  --matrix-root ops/benchmarks/matrix \
  --out-csv ops/benchmarks/trends/matrix-gates.csv \
  --out-json ops/benchmarks/trends/matrix-gates.json \
  --limit 100
```

Use the CSV for quick review and JSON for automation.
In strict CI, this snapshot is generated automatically; use manual script runs for local/offline aggregation.

---

[Back to Docs Index](/docs/) &nbsp; [Architecture](/docs/runtime/architecture)

<script>
  (function () {
    const pill = document.getElementById('gate-status-pill');
    const meta = document.getElementById('gate-status-meta');
    const metrics = document.getElementById('gate-status-metrics');
    if (!pill || !meta || !metrics) return;

    fetch('/assets/data/latest-gate-summary.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('status file not available');
        return res.json();
      })
      .then((data) => {
        const status = data.gate_status === 'PASS' ? 'PASS' : (data.gate_status === 'FAIL' ? 'FAIL' : 'UNKNOWN');
        pill.textContent = status;
        pill.classList.remove('gate-pill-unknown', 'gate-pill-pass', 'gate-pill-fail');
        pill.classList.add(status === 'PASS' ? 'gate-pill-pass' : status === 'FAIL' ? 'gate-pill-fail' : 'gate-pill-unknown');

        const matrixName = data.matrix_name || 'unknown';
        const generatedAt = data.generated_at_utc || 'unknown';
        meta.textContent = `Matrix: ${matrixName} | Generated: ${generatedAt}`;

        const req = data.hybrid_req_delta_pct ?? 'n/a';
        const tok = data.hybrid_tokens_delta_pct ?? 'n/a';
        const lat = data.hybrid_latency_p95_delta_pct ?? 'n/a';
        const err = data.hybrid_error_delta_abs ?? 'n/a';
        metrics.textContent = `req_delta=${req}% · tok_delta=${tok}% · lat_p95_delta=${lat}% · err_delta=${err}`;
      })
      .catch(() => {
        pill.textContent = 'UNKNOWN';
        pill.classList.remove('gate-pill-pass', 'gate-pill-fail');
        pill.classList.add('gate-pill-unknown');
        meta.textContent = 'Latest gate summary not published yet.';
        metrics.textContent = 'Publish /assets/data/latest-gate-summary.json from strict run artifacts.';
      });
  })();
</script>

---

## Modular Tokenizer Architecture

The Gollek platform has migrated to a unified **Tokenizer SPI** (`tech.kayys.gollek.tokenizer.spi`), replacing the legacy `HuggingFaceTokenizer` with a pluggable, format-aware architecture.

### Key Features
- **Universal Support**: Seamlessly handles both **BPE** (`tokenizer.json`) and **SentencePiece** (`tokenizer.model`) variants.
- **Automatic Discovery**: `TokenizerFactory` intelligently detects the model format and loads the optimal backend (BPE vs. SPM).
- **Native SPM Bridge**: High-performance SentencePiece decoding via a native Rust-based bridge (`libspm_bridge`).
- **Streaming Stability**: Integrated `StreamingDecoder` handles multi-byte UTF-8 sequences and BPE merge boundaries, preventing character garbling in streaming responses.

### Common Usage
```java
// Centralized loading (auto-detects format)
Tokenizer tokenizer = TokenizerFactory.loadFromDirectory(modelDir);

// Options-based API
long[] promptTokens = tokenizer.encode(prompt, EncodeOptions.defaultOptions());

// Stateful streaming decoder (for robust output)
StreamingDecoder decoder = new StreamingDecoder(tokenizer, DecodeOptions.defaultOptions());
for (long token : modelOutput) {
    String piece = decoder.decodeNext(token); // Handles partial UTF-8
    System.out.print(piece);
}
```

---

## Native Library Management

### Standard Location

Native libraries are stored in `~/.gollek/libs/`:

```
~/.gollek/libs/
├── llama/              # GGUF/llama.cpp libraries
├── onnxruntime/        # ONNX Runtime libraries
├── libtorch/           # LibTorch libraries
├── native/            # Shared native bridges (e.g., spm_bridge)
└── litert/            # TensorFlow Lite libraries
```

### Quick Setup

```bash
# Install all native libraries
make -f Makefile.native install-native-libs

# Verify installation
make -f Makefile.native verify-libs
```

### Configuration

```bash
# Override default directory
export GOLLEK_NATIVE_LIB_DIR=/opt/gollek/libs

# Explicit library paths
export GOLLEK_LLAMA_LIB_PATH=~/.gollek/libs/llama/libllama.dylib
export GOLLEK_ONNX_LIB_PATH=~/.gollek/libs/onnxruntime/libonnxruntime.dylib
export GOLLEK_NATIVE_LIB=~/.gollek/libs/native/ # Path for spm_bridge
```

### Documentation

- [Git Repository Cleanup](git-repository-cleanup.md) - Repository maintenance guide
- [Native Library Management Guide](/docs/runtime/native-library-guide) - Complete technical guide

---
