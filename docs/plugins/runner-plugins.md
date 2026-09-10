---
layout: default
title: Runner Plugins
---

# Runner Plugin System

Model format runner plugins for flexible, modular AI inference support.

---

## Overview

The Runner Plugin system provides a modular architecture for supporting different model formats, enabling:

- **Hot-Reload**: Add/remove model format support without restarting
- **Selective Deployment**: Include only needed runners in your deployment
- **Performance**: Optimized runners for specific formats
- **Extensibility**: Create custom runners for proprietary formats

---

## Available Runner Plugins

| Runner | Format | Backend | GPU Support | Size |
|--------|--------|---------|-------------|------|
| **GGUF** | .gguf | llama.cpp | ✅ CUDA/Metal | ~500 MB |
| **Safetensor** | .safetensors | Direct/GGUF | ✅ CUDA/MPS | ~20 GB |
| **ONNX** | .onnx | ONNX Runtime | ✅ Multi | ~800 MB |
| **TensorRT** | .engine | TensorRT | ✅ NVIDIA | ~2 GB |
| **LibTorch** | .pt/.bin | PyTorch | ✅ CUDA | ~3 GB |
| **TFLite** | .litertlm | TensorFlow Lite | ✅ GPU | ~500 MB |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Application Layer                          │
│  InferenceRequest → Runner Selection                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│           RunnerPluginManager                           │
│  - Plugin discovery                                     │
│  - Format-based routing                                 │
│  - Session management                                   │
│  - Lifecycle management                                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Runner Plugins                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  GGUF    │ │ Safetensor│ │   ONNX   │ │TensorRT  │  │
│  │ (llama)  │ │  (HF)    │ │ (onnx)   │ │  (TRT)   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│           Feature Plugins (Optional)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │  Audio   │ │  Vision  │ │   Text   │                │
│  │ Feature  │ │ Feature  │ │ Feature  │                │
│  └──────────┘ └──────────┘ └──────────┘                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│           Native Backends                               │
│  libllama.so | libonnxruntime.so | libnvinfer.so       │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Installation

#### Option 1: Build from Source

```bash
# Build runner plugin core
cd inference-gollek/core/gollek-plugin-runner-core
mvn clean install

# Build specific runner plugin
cd inference-gollek/plugins/runner/gguf/gollek-plugin-runner-gguf
mvn clean install -Pinstall-plugin

# Build all runner plugins
cd inference-gollek/plugins/runner
mvn clean install -Pinstall-plugin
```

This installs runner plugins to `~/.gollek/plugins/runners/`

#### Option 2: Download Pre-built JARs

```bash
# Download specific runner
wget https://github.com/gollek-ai/gollek/releases/download/v1.0.0/gollek-plugin-runner-gguf-1.0.0.jar

# Copy to runners directory
cp gollek-plugin-runner-gguf-1.0.0.jar ~/.gollek/plugins/runners/
```

### Configuration

Create `~/.gollek/plugins/runners/runner-config.json`:

```json
{
  "gguf-runner": {
    "enabled": true,
    "n_gpu_layers": -1,
    "n_ctx": 4096,
    "flash_attention": true
  },
  "safetensor-runner": {
    "enabled": true,
    "backend": "direct",
    "device": "cuda",
    "dtype": "f16"
  },
  "onnx-runner": {
    "enabled": false,
    "execution_provider": "CUDAExecutionProvider"
  }
}
```

---

## Usage Examples

### CLI: Auto Runner, Explicit Runner, And Provider

For production inference, treat `--runner` as the model-artifact execution lane and
`--provider` as the lower-level provider override. Omit `--runner` for auto detection:

```bash
gollek run \
  --model google/gemma-4-E2B-it \
  --prompt "what is jakarta"
```

Use an explicit runner when a deployment image should only exercise one runtime family:

```bash
gollek run \
  --runner gguf \
  --model google/gemma-4-E2B-it \
  --prompt "what is jakarta"

gollek run \
  --runner litert \
  --model google/gemma-4-E2B-it \
  --prompt "what is jakarta"

gollek run \
  --runner safetensor \
  --model google/gemma-4-E2B-it \
  --prompt "what is jakarta"
```

Use `--provider` only when you need to force the concrete provider implementation,
for example during debugging, benchmarking, or a controlled fallback test:

```bash
gollek run \
  --provider gguf \
  --model /models/gemma-4-E2B-it-Q4_K_M.gguf \
  --prompt "what is jakarta"
```

`--runner hybrid` keeps auto provider selection enabled while allowing Gollek to
prefer a faster compatible runtime artifact when one is available:

```bash
gollek run \
  --runner hybrid \
  --model google/gemma-4-E2B-it \
  --prompt "what is jakarta"
```

### Route Report JSON For Plugins

Runner plugins and release automation can inspect routing without invoking the model:

```bash
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
      route_redirect_reason,
      route_artifact_cache_hit,
      route_artifact_cache_state,
      route_artifact_cache_kind,
      route_profile_status,
      route_profile_source,
      route_profile_provider,
      route_profile_advice,
      runner: .runner_route.normalized_runner,
      redirected: .runner_route.runtime_redirected,
      redirect_to: .runner_route.runtime_redirect_to_provider
    }'
```

The top-level route artifact cache summary is stable for plugin consumers:

| Field | Meaning |
|-------|---------|
| `route_runner` | Normalized runner route: `auto`, `hybrid`, `safetensor`, `gguf`, or `litert`. |
| `route_selection_source` | Selection source for the route: `auto`, `runner_cli`, `provider_cli`, or `format_cli`. |
| `route_redirected` | `true` when runtime routing redirected to a different provider/format artifact. |
| `route_redirect_reason` | Human-readable redirect reason. Present only when a reason is known. |
| `route_artifact_cache_hit` | `true` when an alternate runtime artifact came from the route artifact cache. |
| `route_artifact_cache_state` | `hit`, `miss`, or `not_applicable`. |
| `route_artifact_cache_kind` | Cache lane such as `gemma4_text_gguf`, `community_text_gguf`, or `gemma4_mobile_qat_litert`. Present only when a cache lane is known. |
| `route_profile_status` | Performance profile status: `selected`, `redirected`, `candidate`, or `unavailable`. |
| `route_profile_source` | Signal source: `selected_route`, `runtime_redirect`, `artifact_cache`, `heuristic`, `benchmark_cache`, or `none`. |
| `route_profile_provider` | Preferred provider from the route profile, such as `gguf` or `litert`. Present only when known. |
| `route_profile_advice` | Human-readable next step for keeping the route production-efficient. Present only when useful. |

Use the state to separate routing behavior:

| State | Meaning |
|-------|---------|
| `hit` | Gollek reused a previously discovered compatible runtime artifact. |
| `miss` | Gollek redirected to an alternate artifact, but this route was cold and may populate the cache. |
| `not_applicable` | No alternate runtime artifact cache participated in the route. |

The nested `runner_route` object remains the source of truth for detailed routing
decisions. The top-level route summary fields are a convenience contract for
dashboards, smoke tests, and plugin installers that only need to know who selected
the route and whether the current run is warm, cold, or unrelated to route
artifact caching.

Route profile fields are intentionally separate from routing behavior. They
summarize selected routes, runtime redirects, cached alternate artifacts,
heuristic advice for safetensor direct routes, and measured local throughput
from the route benchmark cache. The `benchmark_cache` source means Gollek has
seen a successful text generation for the same local artifact/provider/format
route and can surface observed throughput/TTFT advice without invoking the model.

Benchmark observations are stored under `~/.gollek/cache/route-benchmark-profiles.tsv`
by default. For hermetic tests or production images, set
`-Dgollek.cli.route_benchmark_cache_enabled=false` to disable writes/reads, or
`-Dgollek.cli.route_benchmark_cache_dir=/path/to/cache` to point the cache at a
deployment-controlled directory. Gollek treats measurements older than 30 days
as stale in health reports by default; override that with
`-Dgollek.cli.route_benchmark_cache_stale_days=7` when production hosts change
frequently. Stale measurements remain visible in `route-benchmarks` and
`modules --json`, but they do not become `route_profile_source=benchmark_cache`
unless diagnostics explicitly opt in with
`-Dgollek.cli.route_benchmark_cache_allow_stale=true`.

Inspect the measured route cache without reading the TSV directly:

```bash
gollek route-benchmarks
gollek route-benchmarks --json
gollek route-benchmarks list --provider gguf --model gemma
gollek route-benchmarks list --fresh-only --provider gguf
gollek modules --json | jq '.runnerPlugins.routeBenchmarkCache'
gollek modules --json | jq '.runnerPlugins | {schema: .routeBenchmarkCacheReportSchema, validation: .routeBenchmarkCacheReportValidation}'
gollek modules --doctor --json | jq '.routeBenchmarkCache'
gollek modules --doctor --json --fail-on-route-benchmark-cache
```

The table output marks each row as `fresh` or `stale` and includes its age in
days. Use `--fresh-only` in production checks when stale diagnostics should stay
visible in the cache but should not influence route decisions.
The modules JSON report also exposes `profileTrustStatus`, `trustedEntryCount`,
`freshEntryCount`, `strictHealthy`, `problems`, and `remediationHints`, so plugin
installers and deployment checks can inspect benchmark readiness without reading
the cache TSV directly. Add `--fail-on-route-benchmark-cache` when those reported
problems should fail a release or deployment smoke check after the JSON diagnostics
are printed. The same readiness surface has a stable plugin-facing contract under
`.runnerPlugins.routeBenchmarkCacheReportSchema`, schema self-check output under
`.runnerPlugins.routeBenchmarkCacheReportSchemaValidation`, and live payload
validation under `.runnerPlugins.routeBenchmarkCacheReportValidation`; these are
also advertised through `.runnerPlugins.routeContractBundle`. The standalone
`gollek modules --doctor --json` report emits the same
`routeBenchmarkCacheReportSchema`, `routeBenchmarkCacheReportSchemaValidation`,
and `routeBenchmarkCacheReportValidation` fields next to `routeBenchmarkCache`
for release gates that only consume the focused doctor output. Payload contract
drift is included in `pluginGates` and can be enforced with `--fail-on-plugin-gates`;
cache readiness problems such as stale-only profiles remain an explicit
deployment choice enforced with `--fail-on-route-benchmark-cache`. The combined
plugin-gates CI artifact also includes
`routeBenchmarkCacheReportContract.schema` and
`routeBenchmarkCacheReportContract.schemaValidation`, so schema drift is caught
even when a release job only reads the generated gate report.

Check freshness and prune stale measurements explicitly when a runner plugin,
kernel backend, or host profile changes:

```bash
gollek route-benchmarks doctor
gollek route-benchmarks doctor --json
gollek route-benchmarks doctor --strict
gollek route-benchmarks prune --dry-run --older-than-days 30
gollek route-benchmarks prune --yes --older-than-days 30
```

Use `doctor --strict` in deployment or release smoke checks when stale,
unreadable, invalid, disabled, or unwritable benchmark cache state should block
promotion.

Clear all measurements explicitly when a deployment image should start with a
cold benchmark profile:

```bash
gollek route-benchmarks clear --yes
```

### Example 1: Auto-Select Runner

```java
@Inject
RunnerPluginRegistry runnerRegistry;

// Runner automatically selected based on file extension
Optional<RunnerSession> session = runnerRegistry.createSession(
    "models/llama-3-8b.gguf",  // .gguf → GGUF runner
    Map.of("n_ctx", 4096)
);

InferenceResponse response = session.get()
    .infer(request)
    .await()
    .atMost(Duration.ofSeconds(30));
```

### Example 2: Specific Runner

```java
// Get specific runner plugin
Optional<RunnerPlugin> ggufRunner = runnerRegistry.getPlugin("gguf-runner");

if (ggufRunner.isPresent()) {
    RunnerSession session = ggufRunner.get()
        .createSession("models/llama-3-8b.gguf", config);
    
    InferenceResponse response = session.infer(request).await();
}
```

### Example 3: With Feature Plugins

```java
// Enable specific features
Map<String, Object> config = Map.of(
    "features", Map.of(
        "text", Map.of(
            "enabled", true,
            "temperature", 0.7
        ),
        "vision", Map.of("enabled", false)
    )
);

Optional<RunnerSession> session = runnerRegistry.createSession(
    "llama-3-8b.gguf",
    config
);
```

### Example 4: Multi-Format Service

```java
// GGUF model
Optional<RunnerSession> ggufSession = runnerRegistry.createSession(
    "llama-3-8b.gguf",
    Map.of()
);

// ONNX model
Optional<RunnerSession> onnxSession = runnerRegistry.createSession(
    "bert-base.onnx",
    Map.of()
);

// Safetensor model
Optional<RunnerSession> stSession = runnerRegistry.createSession(
    "clip-vit.safetensors",
    Map.of()
);
```

---

## Runner Plugin Details

### GGUF Runner

**Format**: `.gguf` (llama.cpp)

**Features**:
- ✅ Full llama.cpp support
- ✅ GPU acceleration (CUDA, Metal, ROCm)
- ✅ Quantization support (Q2_K - Q8_0)
- ✅ LoRA adapter support
- ✅ Flash Attention
- ✅ Context up to 128K

**Supported Models**:
- Llama 2/3
- Mistral
- Mixtral MoE
- Qwen
- Falcon
- Gemma
- Phi

**Configuration**:
```yaml
gollek:
  runners:
    gguf-runner:
      enabled: true
      n_gpu_layers: -1      # All layers on GPU
      n_ctx: 4096           # Context size
      n_batch: 512          # Batch size
      flash_attention: true
```

---

### Safetensor Runner

**Format**: `.safetensors`, `.gguf` (via conversion)

**Features**:
- ✅ Direct Safetensor inference
- ✅ GGUF conversion support
- ✅ Multi-device support (CPU, CUDA, MPS)
- ✅ Flash Attention
- ✅ LoRA adapters
- ✅ Quantization (FP8, INT8, GPTQ)

**Feature Plugins**:
- Audio (Whisper, SpeechT5)
- Vision (CLIP, ViT, DETR, LLaVA)
- Text (Llama, Mistral, BERT)

**Configuration**:
```yaml
gollek:
  runners:
    safetensor-runner:
      enabled: true
      backend: direct       # or "gguf-conversion"
      device: cuda
      dtype: f16
      features:
        audio:
          enabled: true
        vision:
          enabled: false
        text:
          enabled: true
```

---

### ONNX Runner

**Format**: `.onnx`, `.onnxruntime`

**Features**:
- ✅ ONNX Runtime backend
- ✅ Multi-device (CPU, CUDA, DirectML, CoreML)
- ✅ Quantization support
- ✅ Batch processing
- ✅ Cross-platform

**Supported Models**:
- BERT
- RoBERTa
- DistilBERT
- Whisper
- CLIP
- YOLO
- ViT

**Configuration**:
```yaml
gollek:
  runners:
    onnx-runner:
      enabled: true
      execution_provider: "CUDAExecutionProvider"
      intra_op_num_threads: 4
      inter_op_num_threads: 2
      gpu_mem_limit: 4294967296
```

---

### TensorRT Runner

**Format**: `.engine`, `.plan`

**Features**:
- ✅ TensorRT backend
- ✅ FP16/INT8 optimization
- ✅ Layer fusion
- ✅ Kernel auto-tuning
- ✅ NVIDIA GPU optimized

**Configuration**:
```yaml
gollek:
  runners:
    tensorrt-runner:
      enabled: true
      max_workspace_size: 4294967296
      fp16_mode: true
      int8_mode: false
      max_batch_size: 32
```

---

### LibTorch Runner

**Format**: `.pt`, `.bin`, `.pth`

**Features**:
- ✅ PyTorch LibTorch backend
- ✅ CUDA support
- ✅ JIT compilation
- ✅ Custom operators
- ✅ Training support

**Configuration**:
```yaml
gollek:
  runners:
    libtorch-runner:
      enabled: true
      device: cuda
      dtype: float16
```

---

### TFLite Runner

**Format**: `.litertlm`

**Features**:
- ✅ TensorFlow Lite backend
- ✅ GPU delegate support
- ✅ NNAPI support (Android)
- ✅ Quantization support
- ✅ Edge device optimized

**Configuration**:
```yaml
gollek:
  runners:
    litert-runner:
      enabled: true
      device: GPU
      num_threads: 4
```

---

## Deployment Scenarios

### Scenario 1: Edge Device (CPU Only)

**Use Case**: Raspberry Pi, Jetson Nano

**Runners**:
```yaml
gollek:
  runners:
    onnx-runner:
      enabled: true
      execution_provider: "CPUExecutionProvider"
    litert-runner:
      enabled: true
      device: CPU
```

**Size**: ~200 MB

---

### Scenario 2: NVIDIA GPU Server

**Use Case**: Production inference service

**Runners**:
```yaml
gollek:
  runners:
    gguf-runner:
      enabled: true
      n_gpu_layers: -1
    safetensor-runner:
      enabled: true
      backend: direct
    tensorrt-runner:
      enabled: true
      fp16_mode: true
```

**Size**: ~1.5 GB

---

### Scenario 3: Development Machine

**Use Case**: Model development and testing

**Runners**:
```yaml
gollek:
  runners:
    gguf-runner:
      enabled: true
    safetensor-runner:
      enabled: true
    onnx-runner:
      enabled: true
    libtorch-runner:
      enabled: true
```

**Size**: ~2.5 GB

---

## Performance Comparison

### Inference Speed (A100, 8B Model)

| Runner | Quantization | Tokens/s | VRAM | Latency |
|--------|--------------|----------|------|---------|
| GGUF | Q4_K_M | 220 | 6 GB | Low |
| GGUF | Q8_0 | 180 | 10 GB | Low |
| Safetensor | FP16 | 150 | 16 GB | Medium |
| TensorRT | FP16 | 250 | 16 GB | Lowest |
| ONNX | FP32 | 80 | 20 GB | High |
| LibTorch | FP16 | 140 | 16 GB | Medium |

### Memory Efficiency

| Format | 7B Model | 13B Model | 70B Model |
|--------|----------|-----------|-----------|
| GGUF (Q4) | 4 GB | 8 GB | 40 GB |
| GGUF (Q8) | 8 GB | 14 GB | 70 GB |
| Safetensor (FP16) | 14 GB | 26 GB | 140 GB |
| TensorRT (FP16) | 14 GB | 26 GB | 140 GB |

---

## Creating Custom Runner Plugins

### Step 1: Implement RunnerPlugin Interface

```java
public class CustomRunnerPlugin implements RunnerPlugin {
    
    @Override
    public String id() {
        return "custom-runner";
    }
    
    @Override
    public String name() {
        return "Custom Format Runner";
    }
    
    @Override
    public Set<String> supportedFormats() {
        return Set.of(".custom", ".mdl");
    }
    
    @Override
    public boolean supportsModel(String modelPath) {
        return modelPath.toLowerCase().endsWith(".custom");
    }
    
    @Override
    public boolean isAvailable() {
        // Check if native library is loaded
        try {
            System.loadLibrary("custom-inference");
            return true;
        } catch (UnsatisfiedLinkError e) {
            return false;
        }
    }
    
    @Override
    public RunnerSession createSession(String modelPath, Map<String, Object> config) {
        return new CustomRunnerSession(modelPath, config);
    }
}
```

### Step 2: Create RunnerSession

```java
public class CustomRunnerSession implements RunnerSession {
    
    @Override
    public Uni<InferenceResponse> infer(InferenceRequest request) {
        // Implement inference logic
        return Uni.createFrom().item(response);
    }
    
    @Override
    public Multi<StreamingInferenceChunk> stream(InferenceRequest request) {
        // Implement streaming logic
        return Multi.createFrom().items(chunks);
    }
    
    // ... other methods
}
```

### Step 3: Create POM

```xml
<project>
    <artifactId>gollek-plugin-runner-custom</artifactId>
    
    <dependencies>
        <dependency>
            <groupId>tech.kayys.gollek</groupId>
            <artifactId>gollek-plugin-runner-core</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <configuration>
                    <archive>
                        <manifestEntries>
                            <Plugin-Id>custom-runner</Plugin-Id>
                            <Plugin-Class>tech.kayys.plugin.CustomRunnerPlugin</Plugin-Class>
                            <Plugin-Type>runner</Plugin-Type>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Step 4: Build and Deploy

```bash
mvn clean package
cp target/gollek-plugin-runner-custom-1.0.0.jar ~/.gollek/plugins/runners/
```

---

## Monitoring

### Health Checks

```bash
# Get runner health status
curl http://localhost:8080/api/v1/runners/health

# Response:
{
  "gguf-runner": {
    "healthy": true,
    "available": true
  },
  "safetensor-runner": {
    "healthy": true,
    "available": true
  },
  "onnx-runner": {
    "healthy": false,
    "available": false,
    "error": "ONNX Runtime not found"
  }
}
```

### Metrics

```bash
# Get runner statistics
curl http://localhost:8080/api/v1/runners/stats

# Response:
{
  "initialized": true,
  "total_runners": 3,
  "available_runners": 2,
  "active_sessions": 5,
  "runners": [
    {
      "id": "gguf-runner",
      "name": "GGUF Runner",
      "version": "1.0.0",
      "available": true,
      "formats": [".gguf"]
    }
  ]
}
```

---

## Troubleshooting

### Runner Not Loading

```bash
# Check if plugin JAR is in correct directory
ls -la ~/.gollek/plugins/runners/*.jar

# Check plugin manifest
unzip -p gollek-plugin-runner-gguf.jar META-INF/MANIFEST.MF

# Check logs for errors
tail -f ~/.gollek/logs/gollek.log | grep runner
```

### Native Library Not Found

```bash
# Set library path
export LD_LIBRARY_PATH=/path/to/native/libs:$LD_LIBRARY_PATH

# Or copy to system directory
sudo cp libllama.so /usr/local/lib/
sudo ldconfig
```

### Model Format Not Supported

```java
// Check which runner supports the model
RunnerPluginManager manager = RunnerPluginManager.getInstance();
Optional<RunnerPlugin> plugin = manager.findPluginForModel("model.gguf");

if (plugin.isPresent()) {
    System.out.println("Supported by: " + plugin.get().name());
} else {
    System.out.println("No runner supports this model format");
}
```

---

## Resources

- **Runner Plugin Core**: `inference-gollek/core/gollek-plugin-runner-core/`
- **GGUF Runner**: `inference-gollek/plugins/runner/gguf/`
- **Safetensor Runner**: `inference-gollek/plugins/runner/safetensor/`
- [Feature Plugin System](/docs/plugins/feature-plugins)
- [Optimization Plugins](/docs/plugins/optimization-plugins)
- [Architecture](/docs/runtime/architecture)

---

[Back to Optimization Plugins](/docs/plugins/optimization-plugins) &nbsp; [Feature Plugins](/docs/plugins/feature-plugins) &nbsp; [View Architecture](/docs/runtime/architecture)
