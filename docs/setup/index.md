---
layout: default
title: Documentation
---

<section class="hero hero-compact">
  <p class="eyebrow">Documentation Hub</p>
  <h1>Gollek SDK Documentation</h1>
  <p class="lead">Comprehensive guides, API references, and examples for building AI-powered applications with Gollek SDK.</p>
</section>

<section class="quick-grid">
  <a class="quick-card" href="#getting-started">
    <h3>🚀 Getting Started</h3>
    <p>Installation, quickstart, and setup guides.</p>
  </a>
  <a class="quick-card" href="#core-concepts">
    <h3>📚 Core Concepts</h3>
    <p>Architecture, API reference, and fundamentals.</p>
  </a>
  <a class="quick-card" href="#model-formats">
    <h3>📦 Model Formats</h3>
    <p>GGUF, ONNX, TFLite, audio, and quantization.</p>
  </a>
  <a class="quick-card" href="#advanced">
    <h3>🔬 Advanced</h3>
    <p>GPU kernels, audio processing, and plugins.</p>
  </a>
  <a class="quick-card" href="#examples">
    <h3>💡 Examples</h3>
    <p>JBang scripts, tutorials, and code samples.</p>
  </a>
  <a class="quick-card" href="#support">
    <h3>🛟 Support</h3>
    <p>Troubleshooting, error codes, and help.</p>
  </a>
</section>

---

## Getting Started {#getting-started}

Essential guides to get you up and running quickly.

### [SDK Installation](/docs/setup/sdk-installation)
Install Gollek as a Maven/Gradle dependency for use in Java projects. Includes quick start examples and GPU acceleration setup.

**Maven Setup**:
```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-ml</artifactId>
    <version>0.3.0-SNAPSHOT</version>
</dependency>
```

---

### [JBang Setup](/docs/setup/jbang-setup)
Run Gollek examples without build tools. JBang handles all dependencies automatically.

**Quick Start**:
```bash
curl -Ls https://sh.jbang.dev | bash -s -
jbang examples/jbang/sdk/unified_framework_demo.java --demo all
```

---

### [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
Routing page for the terminal-first trainer lane.

**Use it for**:
- generic trainer runtime entrypoints
- Byte-Latent trainer workflows
- DiffusionOPD trainer/report workflows
- Recursive Reasoning trainer/report workflows

---

### [CLI Installation](/docs/setup/cli-installation)
Install the Gollek CLI via release installer, Homebrew, or Chocolatey for macOS, Linux, and Windows.

**Quick Install**:
```bash
# macOS/Linux
curl -sSL https://raw.githubusercontent.com/bhangun/gollek/main/scripts/install.sh | bash

# Windows
winget install gollek
```

---

### [GitHub Packages Deployment](/docs/dev-log/github-packages-deployment)
Use Gollek SDK in Maven projects via GitHub Packages. Configure repositories, authenticate, and manage dependencies.

**Maven Setup**:
```xml
<repository>
    <id>github</id>
    <url>https://maven.pkg.github.com/bhangun/gollek</url>
</repository>
```

---

### [Core API](/docs/runtime/core-api)
Main entry point for all SDK operations. Learn about `GollekLocalClient`, `InferenceRequest`, `InferenceResponse`, and completion APIs.

**Key Topics**:
- Creating SDK instances
- Building inference requests
- Executing synchronous and streaming inference
- Async jobs and batch processing

---

### [Examples](/docs/setup/examples)
Code examples and usage patterns for common scenarios including streaming, async jobs, and provider selection.

---

### [Examples Docs](/docs/setup/examples-docs)
Landing page for choosing between code examples, broad JBang examples, and
trainer-specific JBang workflows.

---

## 🆕 v0.3 New Features

### [Unified Model Runner](/docs/framework/inference)
Single API for all frameworks (GGUF, ONNX, LiteRT, TensorRT). No more framework-specific code.

```java
ModelRunner runner = ModelRunner.builder()
    .modelPath("model.onnx")
    .device(RunnerDevice.CUDA)
    .build();
```

### [Dynamic Batching Engine](/docs/framework/inference#dynamic-batching)
Automatic request batching with SLA enforcement. 5-10x throughput improvement.

### [Graph Fusion Engine](/docs/framework/inference#graph-fusion)
Fuse multiple operations into single kernels. 3-10x speedup from reduced launch overhead.

### [Quantization Engine](/docs/framework/inference#quantization)
INT4/INT8/FP8 quantization with AWQ/GPTQ algorithms. 4-8x memory reduction.

### [Shared Memory Pool](/docs/framework/inference#shared-memory-pool)
Zero-copy tensor allocation across frameworks. Unified memory management.

---

## Core Concepts {#core-concepts}

Fundamental concepts and architecture documentation.

### [Architecture](/docs/runtime/architecture)
System architecture overview including SDK layers, provider system, model repository, and inference pipeline.

**Diagram**:
```
+------------------+     +-------------------+     +------------------+
|  Gollek Client   | --> |  Inference Svc    | --> |   Providers      |
+------------------+     +-------------------+     +------------------+
```

---

### [Core Runtime Architecture](/docs/runtime/core-runtime-architecture)
Deep dive into the runtime engine, execution model, and performance characteristics.

---

### [Plugin System v2](/docs/plugins/plugin-system-v2)
Extensible plugin architecture for custom providers, features, and runners.

**Plugin Types**:
- **Feature Plugins**: Add new capabilities
- **Runner Plugins**: Model format support (GGUF, ONNX, etc.)
- **Kernel Plugins**: Hardware acceleration (CUDA, Metal, ROCm)

---

### [Enhanced Plugin Architecture](/docs/plugins/enhanced-plugin-architecture)
Advanced plugin patterns with kernel auto-detection and isolation strategies.

---

### [Enhanced Runner Plugin Architecture](/docs/plugins/enhanced-runner-plugin-architecture)
Building custom model runners with enhanced plugin system.

---

### [Feature Plugins](/docs/plugins/feature-plugins)
Extend Gollek with custom features and capabilities.

---

### [Optimization Plugins](/docs/plugins/optimization-plugins)
Performance optimization plugins for inference acceleration.

---

### [Plugin Examples](/docs/plugins/plugin-examples)
Working examples of plugin implementations.

---

### [Plugin Templates](/docs/plugins/plugin-templates)
Starter templates for building your own plugins.

---

### [Plugin Migration](/docs/plugins/plugin-migration)
Migrate from v1 to v2 plugin system.

---

### [Enhanced Plugin System v2](/docs/plugins/enhanced-plugin-system-v2)
Complete guide to the enhanced plugin architecture.

---

### [Kernel Auto-Detection](/docs/runtime/kernel-auto-detection)
Automatic hardware kernel detection and selection.

---

### [Storage Layout](/docs/dev-log/storage-layout)
Understanding Gollek's local storage structure for models and caches.

**Default Location**: `~/.gollek/`

---

### [Enhancement History](/docs/dev-log/enhancement-history)
Complete development history and changelog.

---

### [Phase 1 Completion](/docs/dev-log/phase1-completion)
Integration testing results and milestones (41 tests passed).

---

### [Phase 2 Completion](/docs/dev-log/phase2-completion)
Performance optimization results (3x throughput improvement).

---

## Model Formats {#model-formats}

Supported model formats and conversion tools.

### [GGUF Enhancements](/docs/runtime/gguf-enhancements)
K-quant support (Q2_K, Q4_K, Q5_K, Q6_K), 40+ model families, and quantization improvements.

**Supported Families**:
- Llama, Mistral, DeepSeek, Yi, DBRX, Grok, Jamba, Mamba, RWKV

---

### [Quantization](/docs/framework/quantization-docs)
GPTQ INT4/INT8 and FP8 quantization with SafeTensors format for 4-8x compression.

**Quantization Types**:
- **GPTQ INT4**: 8x compression
- **INT8**: 4x compression
- **FP8**: GPU tensor core optimization

---

### [Safetensor Runner Integration](/docs/runtime/safetensor-runner-integration)
Direct inference from Safetensors format models.

---

### [Runner Plugins](/docs/plugins/runner-plugins)
Model runner implementations for different formats.

---

### [MOSS TTS ONNX Audio](/docs/runtime/moss-tts-onnx)
Local text-to-speech through the MOSS TTS Nano ONNX pipeline with companion codec orchestration, voice presets, Suling WAV/FLAC/MP3 output, and live PCM preview.

**CLI Recipes**:
- Balanced MP3: `--voice "en Trump" --audio-quality balanced --output hello.mp3`
- Lossless FLAC: `--audio-quality lossless --output hello.flac`
- Live preview: `--live-audio --output hello.mp3`

---

## Advanced Topics {#advanced}

Advanced features and specialized capabilities.

### [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs)
Native CUDA, Blackwell, ROCm, and Metal kernels with FlashAttention-2/3.

**Supported Hardware**:
- NVIDIA CUDA (including Blackwell)
- AMD ROCm
- Apple Metal (M1/M2/M3)

---

### [Audio Processing Docs](/docs/framework/audio-processing-docs)
Speech-to-text, text-to-speech, audio encoding, and VAD pipeline.

**Capabilities**:
- **STT**: Whisper with 99+ languages
- **TTS**: MOSS TTS ONNX with voice selectors and companion codec discovery
- **Encoding**: Suling WAV/FLAC/MP3 output, including FFmpeg-backed MP3
- **VAD**: Voice activity detection
- **Streaming**: Progress events, encoded chunks, and optional live PCM preview

---

### [Multimodal SDK](/docs/framework/multimodal-sdk)
Vision-language models and multimodal inference.

---

### [ML SDK](/docs/framework/ml-sdk)
Embedded ML SDK: PyTorch-like Tensors, Autograd, NN Modules, and training in pure Java.

**Features**:
- Tensor operations with autograd
- Neural network layers (Linear, Conv, Attention)
- Loss functions and optimizers
- Model persistence (GGUF, Safetensors)

---

### [Native Library Guide](/docs/runtime/native-library-guide)
Building and using native libraries with Gollek.

---

### [Native FFI](/docs/runtime/native-ffi)
GraalVM native image support with C FFI for embedded integration.

---

### [Native Compilation](/docs/runtime/native-compilation)
Compiling Gollek to native executables.

---

### [Developer Guidance](/docs/dev-log/developer-guidance)
Best practices, tips, and tricks for Gollek development.

**Topics**:
- Metal GPU smoke test
- LiteRT TFLite setup
- Performance tuning
- Memory management

---

### [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
Cloud inference providers: OpenAI, Anthropic, Google Gemini, Cerebras, Mistral.

---

## Examples & Tutorials {#examples}

Hands-on examples and tutorials.

### [JBang Examples Catalog](/docs/setup/jbang-examples)
**23+ ready-to-run Java scripts** covering:
- 🟢 Beginner: Hello World, templates
- 🔵 Neural Networks: MLP, training, persistence
- 🟣 NLP: Sentiment, transformers, chatbots
- 🟠 ML Integrations: DL4J, Stanford NLP, Smile, Tribuo

**Quick Start**:
```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/hello_gollek.java
```

---

### [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
Terminal-first entry page for the trainer lane.

**Use it for**:
- generic trainer runtime routing
- Byte-Latent, DiffusionOPD, and Recursive Reasoning trainer workflows
- guided handoff into the trainer-specific advanced tutorial

---

### [Jupyter & JBang Integration](/docs/dev-log/jupyter-jbang-integration)
Interactive development with Jupyter notebooks and jbang scripts.

**What You'll Learn**:
- Setting up Jupyter Java kernel
- Interactive model building
- Converting notebooks to scripts
- Team collaboration workflows

---

### [CLI Reference](/docs/setup/cli-reference)
Complete CLI command reference including `gollek chat`, `gollek convert`, and more.

**Common Commands**:
```bash
gollek chat --provider gemini
gollek convert --input model.safetensors --output model.gguf
gollek list-models
```

---

## Support {#support}

Troubleshooting and help resources.

### [Troubleshooting](/docs/setup/troubleshooting)
Common issues and solutions.

**Common Problems**:
- Dependency resolution failures
- Model not found errors
- GPU/CUDA issues
- Memory problems

---

### [Error Codes](/docs/setup/error-codes)
Complete error code reference with descriptions and solutions.

**Error Categories**:
- **INFERENCE_***: Inference-related errors
- **MODEL_***: Model loading/management errors
- **PROVIDER_***: Provider configuration errors
- **RUNTIME_***: Runtime execution errors

---

### [Git Repository Cleanup](/docs/dev-log/git-repository-cleanup)
Guide for cleaning up large files from git history.

---

### [GitHub Packages Deployment](/docs/dev-log/github-packages-deployment)
Publishing and consuming packages via GitHub Packages.

---

## Quick Reference

### Installation

```bash
# CLI (macOS/Linux)
curl -sSL https://raw.githubusercontent.com/bhangun/gollek/main/scripts/install.sh | bash

# CLI (Windows)
winget install gollek

# Maven Dependency
# See: /docs/dev-log/github-packages-deployment
```

### First Inference

```java
GollekLocalClient client = GollekSdkFactory.createLocalSdk();
InferenceRequest request = InferenceRequest.builder()
    .model("llama-3.2-3b-instruct")
    .prompt("Hello, world!")
    .build();
InferenceResponse response = client.createCompletion(request);
```

### Run JBang Example

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/hello_gollek.java
```

### Configure API Keys

```bash
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
export GOOGLE_API_KEY=...
```

---

## Documentation Categories

| Category | Pages | Description |
|----------|-------|-------------|
| **Getting Started** | 5 | Installation, setup, quickstart |
| **Core Concepts** | 15 | Architecture, API, plugins |
| **Model Formats** | 5 | GGUF, quantization, runners |
| **Advanced** | 10 | GPU, audio, native, ML SDK |
| **Examples** | 3 | JBang, Jupyter, CLI reference |
| **Support** | 5 | Troubleshooting, errors, help |

---

## Additional Resources

- [Blog](/blog/) - Latest news and announcements
- [Features](/features/) - Feature overview
- [GitHub](https://github.com/bhangun/gollek) - Source code and issues
- [Discussions](https://github.com/bhangun/gollek/discussions) - Community discussions

---

**Last Updated**: March 2026 | **Version**: 1.0.0

[Back to Home](/) · [View on GitHub](https://github.com/bhangun/gollek)
