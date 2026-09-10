---
layout: default
title: Gollek SDK Features
---

# Gollek SDK Features

Comprehensive feature set for building AI-powered applications with flexibility and performance.

---

## Core Features

### Unified Inference API

Single consistent interface for all inference providers and model formats.

**Benefits:**
- Write once, run anywhere
- Easy provider switching
- Reduced vendor lock-in
- Simplified testing and development

**Supported Formats:**
- GGUF (llama.cpp)
- ONNX Runtime, including Stable Diffusion and MOSS TTS audio pipelines with streamed artifacts
- TensorFlow Lite
- Cloud APIs (Gemini, Anthropic, OpenAI)
- **Audio Models (Whisper STT, MOSS TTS ONNX)**
- **Quantized Models (INT4, INT8, FP8)**

---

### GPU Kernel Acceleration

Native GPU acceleration for optimal inference performance.

**Supported Platforms:**

| Platform | Architecture | Key Features |
|----------|--------------|--------------|
| **NVIDIA CUDA** | A100/H100/H200 | FlashAttention-2/3, FP8/FP4, Tensor Cores |
| **NVIDIA Blackwell** | B100/B200/GB200 | FA3+TMEM, FP4, 192GB HBM3e, Async Exec |
| **AMD ROCm** | MI300X/MI250X | HIP Kernels, Unified Memory, FlashAttention |
| **Apple Metal** | M1/M2/M3/M4 | MPS Graph, Unified Memory, AMX Blocks |

**Features:**
- FlashAttention-2/3 for 2-3x speedup
- FP4/FP8 tensor core acceleration
- Unified memory zero-copy on A100/H100/B200/MI300X
- Paged KV cache for long contexts
- Multi-GPU support

[Learn more](/docs/gpu-kernels)

---

### Cloud Provider Integration

Seamless integration with leading cloud LLM providers via dynamic plugin system.

**Plugin Architecture:**
- **Dynamic Loading**: Add/remove providers via JAR files at runtime
- **Hot-Reload**: Update providers without restarting the application
- **ClassLoader Isolation**: Each provider runs in isolated ClassLoader
- **Auto-Discovery**: Plugins automatically discovered from `~/.gollek/plugins/`
- **Unified API**: Consistent interface across all providers

**Supported Providers:**

| Provider | Models | Context | Key Features |
|----------|--------|---------|--------------|
| **OpenAI** | GPT-4, GPT-3.5-Turbo, o1 | 128K | Function calling, Vision, 128K context |
| **Anthropic** | Claude 3 (Opus/Sonnet/Haiku) | 200K | 200K context, Vision, Low hallucination |
| **Google Gemini** | Gemini Pro/Ultra | 1M+ | Multimodal, Long context |
| **Cerebras** | Llama 3.1 | 8K | ~400 tokens/s speed |
| **Mistral** | Mistral, Mixtral | 32K | Open weights, Efficient |

**Plugin Features:**
- JAR auto-discovery from `~/.gollek/plugins/`
- Hot-reload on file changes
- Dynamic load/unload without restart
- Plugin manifest (`plugin.json`) support
- Per-plugin configuration
- Health monitoring

**Example:**
```java
// Plugins automatically loaded on startup
PluginManager manager = CDI.current().select(PluginManager.class).get();
manager.initialize();

// Get provider
OpenAiCloudProvider openai = (OpenAiCloudProvider) 
    manager.byId("openai-cloud-provider").get();

// Use for inference
InferenceResponse response = openai.complete(request);
```

[Learn more](/docs/cloud-providers) [Plugin Guide](/docs/plugin-system)

---

### Extension System

Installable extension packages add user-visible features without changing the core runtime.

**Naming:**
- **Extension**: installable external package
- **Plugin**: low-level runtime or built-in module
- **Feature**: user-visible capability
- **Adapter**: technical SPI implementation
- **Pipeline**: inference orchestration adapter

**Supported Capability Kinds:**
- Inference pipelines for OCR, TTS, document, vision, audio, or multimodal models
- Training and dataset adapters
- Quantization and optimization adapters
- Backend bridges and model exporters
- Evaluators and research tooling

**CLI:**
```bash
gollek extensions kinds
gollek extensions init features/gollek-ocr-lab --kind pipeline --pipeline-id ocr-lab --gollek-path gollek
gollek extensions init features/gollek-awq-lab --kind quantization --adapter-id awq-quantizer --input model --output model --target llm --format safetensors,gguf --gollek-path gollek
gollek extensions inspect path/to/extension.jar --strict
gollek extensions install path/to/extension.jar --force
gollek extensions index --output gollek-extensions.index.json
gollek extensions migrate --dry-run
gollek extensions finalize-migration --dry-run
gollek extensions doctor --strict --json
```

Extension manifests use `META-INF/gollek-extension.json`; legacy `META-INF/gollek-feature.json` files are still supported.

`gollek extensions kinds` shows available scaffold templates. `gollek extensions init` defaults to a pipeline project, while non-pipeline kinds scaffold `FeatureAdapter` services for global capabilities such as training, quantization, optimization, backend bridges, exporters, datasets, and evaluators. `gollek extensions index` produces a native/AOT-friendly inventory for launchers, CI, and GraalVM build inputs.

`gollek extensions doctor` detects collisions across extension ids, feature ids, pipeline ids, adapter ids, provider classes, and implementation classes. `gollek extensions finalize-migration --dry-run` previews cleanup for migrated legacy jars before archiving them. JVM builds can load installed extension jars dynamically; GraalVM native builds use AOT-linked extensions and keep installed jars as manifest-inspectable assets.

[Learn more](/docs/extensions/)

---

### Multi-Provider Support

Seamlessly integrate with multiple inference providers.

| Provider | Type | Capabilities |
|----------|------|--------------|
| GGUF | Local | Streaming, Async, Batch |
| ONNX | Local | Text, image, audio/TTS, streaming artifacts, WAV/FLAC/MP3 |
| TFLite | Local | Streaming, Batch |
| OpenAI | Cloud | Streaming, Async, Functions, Vision |
| Anthropic | Cloud | Streaming, Async, Tools, Vision |
| Google Gemini | Cloud | Streaming, Async, Multimodal |
| Ollama | Local/Cloud | Streaming, Async |
| Cerebras | Cloud | Streaming, High-throughput |
| Mistral | Cloud | Streaming, Function calling |

---

### Reactive Streaming

Real-time token streaming with backpressure support.

**Features:**
- Non-blocking I/O
- Mutiny reactive streams
- Token-by-token delivery
- Flow control for slow consumers
- Graceful error handling

**Example:**
```java
client.streamCompletion(request)
    .onItem().invoke(chunk -> 
        System.out.print(chunk.getToken())
    )
    .subscribe().with(ignored -> {});
```

---

### Async Job Processing

Background job execution with status tracking.

**Features:**
- Submit long-running requests asynchronously
- Poll for status updates
- Wait for completion with timeout
- Automatic retry on failure
- Result caching

**Use Cases:**
- Large document processing
- Batch data analysis
- Long-form content generation
- Complex reasoning tasks

---

### Batch Inference

Process multiple requests efficiently in a single call.

**Benefits:**
- Reduced network overhead
- Better throughput
- Simplified parallel processing
- Cost optimization

**Example:**
```java
List<InferenceResponse> responses = client.batchInference(
    new BatchInferenceRequest(requests)
);
```

---

### Visual Node Workflows

Expose strongly-typed, reactive AI orchestrations directly to frontend visual editors (such as Flutter node graphs) using the `NodePlugin` SPI.

**Features:**
- **Visual Serialization**: Serialize graph schemas, categories, and ports directly over JSON descriptors.
- **Port Contracts**: Enforce input/output connection validation via `NodePort` types (`STRING`, `NUMBER`, `BOOLEAN`, `JSON`, `TENSOR`, `CONTEXT`).
- **CDI-managed Discovery**: Automatic discovery and hot-reload of custom visual node plugins via `NodeRegistry`.
- **Backward-Compatible Adapters**: Wrap existing phase plugins inside `InferencePhaseNodeAdapter` to run them as graph nodes without rewriting.

[Learn more](/docs/plugins/node-plugins)

---

### Advanced Serving Optimizations

Maximize hardware utilization and minimize latency with state-of-the-art serving architectures.

**Key Optimizations:**
- **Speculative Decoding**: Accelerate token generation up to 2-3x by pairing a fast draft model with a larger target verification model.
- **Semantic Caching**: Short-circuit repetitive or semantically similar prompts by running embedding-based similarity checks against a vector store.
- **KV Cache Offloading**: Optimize GPU memory overhead by dynamically paging inactive KV cache states to host memory (RAM) or disk (NVMe).
- **Continuous Batching**: Dynamically group requests at the token level (rather than the sequence level) to maximize execution throughput.

---

## Model Management

### Centralized Model Life-cycle

Programmatic management of models from discovery to inference.

**Features:**
- **One-Call Preparation**: `prepareModel` handles local resolution, pulling from HuggingFace/S3, and SHA-256 verification.
- **Provider Auto-Selection**: Automatically routes models to GGUF, ONNX, or Cloud based on format.
- **Detailed Statistics**: Access model usage, version history, and storage metrics.

### Local Model Repository

Persistent storage for downloaded models.

**Features:**
- Automatic model caching
- No re-downloads on restart
- Progress tracking during download
- Multiple source support (HF, S3, local)
- Model metadata management

---

### Model Discovery

Browse and query available models.

**Capabilities:**
- List all available models
- Paginated model listing
- Filter by format, size, provider
- Detailed model information
- Version tracking

---

## Provider Management

### Provider Discovery

Auto-discover and query available providers.

**Information Available:**
- Provider capabilities
- Health status
- Supported models
- Version and vendor info
- Performance metrics

---

### Provider Selection

Flexible provider routing strategies.

**Options:**
- Global default provider
- Per-request provider override
- Automatic failover
- Load balancing (enterprise)
- Cost-based routing (enterprise)

---

## Audio Processing

### Speech-to-Text (Whisper)

Production-ready speech transcription with 99+ language support.

**Features:**
- Complete Whisper encoder-decoder implementation
- Beam search decoding for accuracy
- Word-level timestamps
- Language auto-detection
- Voice activity detection (VAD)
- Streaming transcription
- Multi-format support (WAV, MP3, FLAC, OGG, M4A, WebM)

**Supported Models:**
- tiny (39M), base (74M), small (244M), medium (769M), large-v3 (1.55B)

**Performance:**
- RTF: 0.15x - 1.5x (model dependent)
- WER: 2.9% - 8.5% on LibriSpeech

### Text-to-Speech (MOSS TTS ONNX)

Local text-to-speech synthesis through the MOSS TTS Nano ONNX pipeline.

**Features:**
- Multi-session ONNX orchestration: prefill, decode-step, local frame sampling, and audio codec decode
- Companion MOSS Audio Tokenizer repository discovery, with optional automatic pull
- Built-in voice presets with exact names, language aliases, and language/gender selectors
- Suling audio output for WAV, FLAC, and MP3, with MP3 encoded through the FFmpeg FFM bridge
- Audio quality presets for compact speech, balanced MP3, high-bitrate MP3, and lossless FLAC
- Mono/stereo/native channel modes, duplicate-channel collapse, DC removal, fades, and peak normalization
- Streaming progress, encoded audio chunks, and optional live PCM preview while generation is running
- Reproducible audio with deterministic seed default, explicit `--seed`, or `--random-seed`
- Audio-specific run metrics: generated duration, synthesis duration, realtime speed, RTF, and frames per second

**CLI Example:**

```bash
gollek pull OpenMOSS-Team/MOSS-TTS-Nano-100M-ONNX
gollek run --model 71e8f7 \
  --prompt "apa kabar dunia" \
  --voice "en Trump" \
  --audio-quality balanced \
  --output ~/Downloads/hello.mp3
```

**Voice UX:**
- `--list-voices` prints available presets without generating audio.
- `--voice "en Trump"` resolves the exact English Trump preset.
- `--voice-lang en --voice-gender female` selects an English female preset.
- Unknown selector terms fail clearly and show nearby valid choices.

**Audio UX:**
- `--audio-quality compact` writes a small MP3 for quick sharing.
- `--audio-quality lossless` writes FLAC with high compression.
- `--live-audio` plays decoded PCM chunks while the final artifact is generated.
- `--audio-channels auto` collapses near-duplicate stereo output to cleaner mono by default.

### Audio Processing Pipeline

Comprehensive audio utilities for speech applications.

**Feature Extraction:**
- Log-Mel spectrogram (80 mel bins)
- MFCC (13 cepstral coefficients)
- F0 (fundamental frequency)
- Energy contour

**Audio Utilities:**
- High-quality resampling (sinc interpolation)
- Format conversion (int16 ↔ float32)
- Peak and RMS normalization
- Voice activity detection
- Silence removal
- Utterance segmentation

[Learn more](/docs/audio-processing)

---

## Model Quantization

### GPTQ (INT4)

4-bit integer quantization with 8x compression.

**Features:**
- Group-wise quantization (configurable group size)
- Per-channel scaling
- Activation ordering (ActOrder)
- Hessian-based optimization
- SafeTensors format

**Compression:** ~8x
**Quality Loss:** Low-Medium
**Best For:** CPU inference, large models (7B+)

### INT8 Quantization

8-bit integer quantization with 4x compression.

**Features:**
- Per-channel or per-tensor scaling
- Symmetric or asymmetric quantization
- Fast calibration
- Minimal quality loss

**Compression:** ~4x
**Quality Loss:** Very Low
**Best For:** Production inference, balanced quality/speed

### FP8 Quantization

8-bit floating point for GPU tensor cores.

**Features:**
- E4M3 and E5M2 formats
- Optimized for H100/MI300
- Near-lossless quality
- Tensor core acceleration

**Compression:** ~4x
**Quality Loss:** Minimal
**Best For:** GPU inference with FP8 support

### Quantization Pipeline

End-to-end quantization workflow.

**REST API:**
- `POST /api/v1/quantization/quantize` - Quantize model
- `POST /api/v1/quantization/quantize/stream` - Stream progress
- `GET /api/v1/quantization/recommend` - Get strategy recommendation
- `GET /api/v1/quantization/strategies` - List strategies

**Performance:**
- 7B model: ~90s (INT4), ~45s (INT8)
- 13B model: ~180s (INT4), ~90s (INT8)
- 70B model: ~900s (INT4), ~450s (INT8)

[Learn more](/docs/quantization)

---

## Native Integration

### GraalVM Native Image

Compile to native code for optimal performance.

**Benefits:**
- Instant startup (no JVM warmup)
- Reduced memory footprint
- Smaller deployment size
- Enhanced security (no bytecode)

**Output:**
- Shared libraries (.so, .dylib, .dll)
- Static executables
- Embedded system binaries

---

### C FFI Interface

Direct C/C++ integration via function entrypoints.

**Functions:**
- Client lifecycle management
- Synchronous and async inference
- Streaming support
- Job management
- Model and provider queries

**Language Bindings:**
- C/C++ (native)
- Python (via ctypes)
- Rust (via FFI)
- Go (via cgo)
- Node.js (via node-ffi)

---

## Enterprise Features

### Multi-Tenancy

Tenant isolation and resource management.

**Features:**
- Tenant-scoped API keys
- Isolated model pools
- Per-tenant quotas and rate limits
- Usage tracking and billing
- Compliance audit trails

**Activation:**
```bash
export WAYANG_MULTITENANCY_ENABLED=true
export GOLLEK_TENANT_ID=tenant-123
```

---

### Security

Enterprise-grade security features.

**Capabilities:**
- Secure credential management
- API key rotation
- Encrypted model storage
- Network isolation
- Access control policies
- Audit logging

---

### Observability

Comprehensive monitoring and debugging.

**Engine Metrics:**
- **P95 Latency**: Track 95th percentile response times per provider/model.
- **Error Rate Tracking**: Real-time failure monitoring for proactive failover.
- **Circuit Breaker Status**: Monitor automated throttling state.
- **Token Usage**: Granular counters for input/output tokens.

**Tracing:**
- OpenTelemetry integration
- Distributed trace propagation
- Span annotations
- Context propagation

**Logging:**
- Structured JSON logging
- Correlation IDs
- Configurable log levels
- Sensitive data redaction

---

## Developer Experience

### CDI Integration

Seamless Jakarta EE integration.

**Features:**
- Automatic bean discovery
- Dependency injection
- CDI scopes support
- Event integration
- Interceptor support

**Example:**
```java
@ApplicationScoped
public class MyService {
    @Inject
    GollekLocalClient client;
    
    public String generate(String prompt) {
        // Use injected client
    }
}
```

---

### Modular Architecture

Include only what you need.

**Benefits:**
- Minimal dependencies
- Reduced attack surface
- Faster builds
- Smaller deployments

**Optional Modules:**
- Provider-specific extensions
- Model repository implementations
- Format converters
- MCP integrations

---

### Type-Safe APIs

Full Java type safety with builders.

**Features:**
- Immutable request/response objects
- Builder pattern for construction
- Compile-time validation
- IDE autocomplete support
- Clear error messages

---

## Performance Features

### Non-Blocking I/O

Reactive architecture throughout.

**Benefits:**
- High concurrency
- Efficient resource utilization
- Better throughput
- Responsive under load

---

### Connection Pooling

Efficient connection management for cloud providers.

**Features:**
- Reusable HTTP connections
- Configurable pool sizes
- Connection keepalive
- Automatic reconnection

---

### Response Caching

Optional caching for repeated requests.

**Use Cases:**
- FAQ responses
- Common queries
- Static content generation
- Test data

---

## Integration Features

### MCP Support

Model Context Protocol integration for tools.

**Capabilities:**
- Tool discovery
- Tool invocation
- Context management
- Multi-tool workflows

---

### Plugin System

Low-level runtime architecture via built-in and dynamic plugins.

**Extension Points:**
- Custom providers
- Model repositories
- Format converters
- Authentication schemes
- Pre/post processors

---

---

### Embedded ML SDK

A PyTorch-like deep learning framework built natively for the Java ecosystem.

**Key Components:**

#### Autograd Engine (`gollek-sdk-autograd`)
Define-by-run dynamic computation graphs with support for complex backpropagation.
- **GradTensor**: Tensors that track operations for gradient calculation.
- **Dynamic Graphs**: Build computation graphs on the fly during the forward pass.
- **Context Management**: Use `NoGrad` to disable gradient tracking during inference.

**Example:**
```java
GradTensor x = GradTensor.scalar(2.0f).requiresGrad(true);
GradTensor w = GradTensor.scalar(3.0f).requiresGrad(true);
GradTensor y = w.mul(x);
y.backward(); // Calculate gradients
```

#### Neural Network Modules (`gollek-sdk-nn`)
High-level abstractions for building and training complex models.
- **Standard Layers**: Linear, LayerNorm, Dropout, Embedding, MultiHeadAttention.
- **Transformer Blocks**: Pre-built Encoder and Decoder layers.
- **Loss Functions**: MSE, CrossEntropy, CosineEmbedding.
- **Optimizers**: AdamW, SGD with parameter grouping.

#### NLP Pipelines (`gollek-sdk-nlp`)
Task-oriented pipelines for common NLP operations.
- **Text Generation**: LLM-powered sequence completion.
- **Embeddings**: High-quality vector representations.
- **Classification**: Sentiment analysis and zero-shot categorization.

#### Data Loading (`gollek-sdk-data`)
Scalable data pipelines for model training.
- **Dataset API**: Abstract interface for indexed data.
- **DataLoader**: Multithreaded batching and shuffling.
- **Format Support**: CSV, Text, and custom implementations.

---

## Comparison Table

| Feature | Community | Enterprise |
|---------|-----------|------------|
| Multi-provider support | Yes | Yes |
| Streaming inference | Yes | Yes |
| Async jobs | Yes | Yes |
| Batch processing | Yes | Yes |
| Native FFI | Yes | Yes |
| Model management | Yes | Yes |
| CDI integration | Yes | Yes |
| **Audio Processing** | **Yes** | **Yes** |
| **Model Quantization** | **Yes** | **Yes** |
| **Embedded ML SDK** | **Yes** | **Yes** |
| GPU acceleration | Yes | Yes |
| Multi-tenancy | No | Yes |
| Advanced security | Basic | Full |
| Audit logging | Basic | Comprehensive |
| Priority support | Community | 24/7 |
| SLA | No | Yes |

---

## Getting Started

Ready to explore these features?

[View Documentation](/docs/) &nbsp; [See Examples](/docs/examples)

---

[Back to Home](/) &nbsp; [View Documentation](/docs/)
