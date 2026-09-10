---
layout: default
title: Gollek Documentation
---

# Gollek Documentation

Welcome to the Gollek documentation. Gollek is the AI platform layer for inference, serving, embeddings, ML/NN/DL APIs, training, plugins, and runtime backends. Wayang-Gollek is the agentic system engine that runs on top of Gollek through SDK and API contracts.

---

## Which Docs Area Should I Start With?

If you want installation, CLI, JBang, or first-run setup:

- [Setup Docs](/docs/setup/)
- [Examples Docs](/docs/setup/examples-docs)

If you want Java-side modeling, training, or framework APIs:

- [Framework Overview](/docs/framework/framework)
- [Training Docs](/docs/framework/training)
- [Training Fast Gate](/docs/framework/training-fast-gate)

If you want runtime operations, deployment paths, or backend troubleshooting:

- [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs)
- [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
- [Native Runtime Docs](/docs/runtime/native-runtime-docs)

If you want to integrate Gollek with agent systems such as Wayang-Gollek:

- [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving)
- [Agent Integration Boundary](/docs/agent-integration-boundary)
- [Agent Integration API](/docs/agent-integration-api)
- [Wayang-Gollek Agent System](/docs/agent-framework/)
- [Inference Serving](/docs/runtime/inference-serving)

If you want modular model-family plugins, detachable model farm builds, or visual node workflow engines:

- [Model Family Plugins](/docs/plugins/model-family-plugins)
- [Visual Node Workflows](/docs/plugins/node-plugins)
- [Gollek Extensions](/docs/extensions/)

If you want guided workflows instead of reference pages:

- [Tutorials Overview](/docs/tutorials/)
- [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow)

---

## Latest: MOSS TTS ONNX Audio Runtime

**Local text-to-speech | Voice presets | Suling WAV/FLAC/MP3 | Live audio preview | Audio-native run metrics**

[Read the MOSS TTS ONNX Guide](/docs/runtime/moss-tts-onnx)

---

## Latest: Production-Safe Model Farm Plugins

**Detachable model families | `prod_*` bundle presets | tokenizer readiness gates | plugin doctor diagnostics**

[Read the Model Family Plugins Guide](/docs/plugins/model-family-plugins)

---

## SDK v0.2 Release

**Advanced Tensor Operations | Vision Transforms | NLP Tokenizers | Complete Examples**

[View v0.2 Release Notes](/docs/release-notes-v0.2)

---

## 🎯 Platform Overview

**Complete Platform Roadmap (9 Phases)**

The Gollek and Wayang-Gollek ecosystem spans 9 phases of development:

1. **Phases 1-3**: Deep Learning Foundation (Gollek SDK) - All 3 Complete ✅
2. **Phases 4-7**: Wayang-Gollek Agent System (Runs on top of Gollek) - All 4 Complete ✅
3. **Phases 8-9**: Production Hardening & Optimization - All 3 Complete ✅ (8, 8B, 9), 1 Designed (9B)

**Start Your Journey:**
- [**📊 Platform Phases Overview**](/docs/phases-overview) - Complete roadmap of all 9 phases
- **[Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving)** - Preflight route templates for Wayang-Gollek and external agent runtimes
- **[Agent Integration Boundary](/docs/agent-integration-boundary)** - Clear ownership between Gollek and Wayang-Gollek
- **[Agent Integration API](/docs/agent-integration-api)** - Serving contract, endpoints, SDK bridge, and Wayang-Gollek recipe
- **[Wayang-Gollek Agent System (Phases 4-7)](/docs/agent-framework/)** - Build intelligent agents on top of Gollek
- **[🚀 Production Hardening (Phases 8-9)](/docs/production-hardening/)** - Deploy to production
- **[⚡ GPU Acceleration (Phase 2)](/docs/gpu-acceleration/)** - 30-100x speedup with Gollek Kernels
- **[🔧 Extended Features (Phase 3)](/docs/extended-features/)** - Transformers and model zoo

---

## Getting Started

### New Users

1. **[Platform Overview](/docs/phases-overview)** - Understand the complete system
2. **[Quick Start Guide](/docs/setup/sdk-installation)** - Install and set up Gollek in 5 minutes
3. **[First Neural Network Tutorial](/docs/tutorials/basic/first-nn)** - Build a simple neural network
4. **[Training Docs](/docs/framework/training)** - Choose the standard supervised or trainer-first workflow

### Building Agents (Wayang-Gollek)

1. **[Agent Integration Boundary](/docs/agent-integration-boundary)** - Understand what belongs in Gollek versus Wayang-Gollek
2. **[Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving)** - Run preflight templates for chat, Responses, embeddings/RAG, and MCP tools
3. **[Agent Integration API](/docs/agent-integration-api)** - Use Gollek's serving contract from Wayang-Gollek
4. **[Wayang-Gollek Agent System](/docs/agent-framework/)** - Overview of the upper agent runtime layer
5. **[Inference Serving](/docs/runtime/inference-serving)** - Use Gollek as the model serving substrate
6. **[Production Deployment](/docs/production-hardening/)** - Deploy agents safely

### Migrating from PyTorch

1. **[PyTorch to Gollek](/docs/migration-pytorch)** - Mapping PyTorch APIs to Gollek
2. **[ML SDK Guide](/docs/framework/ml-sdk)** - Core Java-side modeling and training surface
3. **[Examples Docs](/docs/setup/examples-docs)** - Current example hubs, JBang catalog, and walkthroughs

---

## Featured Paths

### Setup-First

1. [Setup Docs](/docs/setup/)
2. [Quick Start Guide](/docs/setup/sdk-installation)
3. [Examples Docs](/docs/setup/examples-docs)

### Trainer-First

1. [Training Docs](/docs/framework/training)
2. [Trainer JBang Docs](/docs/setup/trainer-jbang-docs)
3. [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow)

### Runtime Ops

1. [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs)
2. [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
3. [Native Runtime Docs](/docs/runtime/native-runtime-docs)

### Framework Developer

1. [Framework Overview](/docs/framework/framework)
2. [ML SDK Guide](/docs/framework/ml-sdk)
3. [API References](/docs/api-references/0.1.0-SNAPSHOT/)

---

## Documentation Hubs

### Gollek and Wayang-Gollek Platform

| Section | Description | Status |
|---------|-------------|--------|
| [**Platform Phases Overview**](/docs/phases-overview) | 9-phase roadmap | 📊 Complete |
| [**Agent Serving Quick Start**](/docs/tutorials/integrations/agent-serving) | Preflight route templates and serving gate examples | ✅ Available |
| [**Agent Integration Boundary**](/docs/agent-integration-boundary) | Gollek vs Wayang-Gollek ownership | ✅ Available |
| [**Agent Integration API**](/docs/agent-integration-api) | Agent-facing serving contract and Wayang-Gollek recipe | ✅ Available |
| [**Wayang-Gollek Agent System**](/docs/agent-framework/) | Intelligent agent runtime and skills above Gollek | ✅ Production Ready |
| [**Production Hardening (Phases 8-9)**](/docs/production-hardening/) | Observability, optimization, testing | ✅ Production Ready |
| [**🚀 Inference Serving**](/docs/runtime/inference-serving) | Continuous batching and paged attention | ✅ Production Ready |
| [**🎮 GPU Runtime Docs**](/docs/runtime/gpu-runtime-docs) | Kernels, SPI, auto-detection, and placement | ✅ Available |
| [**☁️ Cloud Provider Docs**](/docs/runtime/cloud-provider-docs) | Plugin installation and provider configuration | ✅ Available |
| [**🧩 Native Runtime Docs**](/docs/runtime/native-runtime-docs) | Native-image, executables, and FFI entrypoints | ✅ Available |
| [**Visual Node Workflows**](/docs/plugins/node-plugins) | Strongly-typed visual NodePlugin execution SPI | ✅ Production Ready |
| [**⚙️ Optimization Config**](/docs/optimization-config) | Runtime and plugin tuning | ✅ Production Ready |

Additional platform references:

- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)
- [GPU Runtime Troubleshooting](/docs/runtime/gpu-runtime-troubleshooting)
- [GPU Kernel SPI](/docs/runtime/gpu-kernel-spi)
- [Cloud Provider Glossary](/docs/runtime/cloud-provider-glossary)
- [Cloud Provider Config Examples](/docs/runtime/cloud-provider-config-examples)
- [Native Runtime Glossary](/docs/runtime/native-runtime-glossary)
- [Native Runtime Examples](/docs/runtime/native-runtime-examples)
- [Provider Fallback Router](/docs/runtime/provider-fallback-router)
- [GPU Acceleration (Phase 2)](/docs/gpu-acceleration/)
- [Extended Features (Phase 3)](/docs/extended-features/)

### Framework & Training

| Document | Description |
|----------|-------------|
| [Framework Overview](/docs/framework/framework) | Main ML framework and module overview |
| [ML SDK Guide](/docs/framework/ml-sdk) | Core Java-side modeling and training surface |
| [Training Docs](/docs/framework/training) | Generic training and trainer runtime entrypoint |
| [Training Fast Gate](/docs/framework/training-fast-gate) | Training metadata gate, advisory candidates, promotion plans, and validation receipts |
| [DiffusionOPD Docs](/docs/framework/diffusion-opd-docs) | DiffusionOPD overview, workflows, and selectors |
| [Byte-Latent Docs](/docs/framework/byte-latent-docs) | Byte-Latent checkpoints, workflows, and compare flows |
| [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs) | GRAM-style rollout, compare, bundle, and dataset flows |
| [Audio Processing Docs](/docs/framework/audio-processing-docs) | STT, TTS, VAD, and audio runtime routing |
| [Quantization Docs](/docs/framework/quantization-docs) | Strategy selection, Java usage, and REST usage |
| [API References](/docs/api-references/0.1.0-SNAPSHOT/) | Generated framework and trainer module reference |

### API Snapshot

| Version | Description | Status |
|:--------|:------------|:-------|
| [**0.1.0-SNAPSHOT**](/docs/api-references/0.1.0-SNAPSHOT/) | Modern ML/DL/NN framework modules reference | 📚 Available |

### Core Guides

| Document | Description |
|----------|-------------|
| [TensorOps API](/docs/api-tensorops) | Advanced slicing, gathering, masking, and tensor utility operations |
| [Tokenizer API](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nlp) | Text tokenization interface and vocabulary surface |
| [Vision Transforms](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-vision) | Image preprocessing and transform composition |
| [Multimodal SDK](/docs/framework/multimodal-sdk) | Java-side multimodal framework entrypoint |
| [Model Family Plugins](/docs/plugins/model-family-plugins) | Detachable Hugging Face style model-family metadata, tokenizer profiles, and bundle selection |

### Examples, Tutorials, and Terminal Paths

| Document | Description |
|----------|-------------|
| [Examples Docs](/docs/setup/examples-docs) | Main examples chooser across setup, tutorials, and runnable demos |
| [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving) | Preflight route templates for agent runtimes that use Gollek serving |
| [JBang Examples Catalog](/docs/setup/jbang-examples) | Runnable terminal-first scripts across ML, multimodal, and trainer lanes |
| [Jupyter Integration](/docs/tutorials/integrations/jupyter) | Standalone Gollek Java notebooks with helpers, magics, and artifact inspection |
| [Trainer JBang Docs](/docs/setup/trainer-jbang-docs) | Terminal-first trainer families and report workflows |
| [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow) | Guided trainer-first tutorial path |
| [Tutorials Overview](/docs/tutorials/) | Basic, intermediate, and advanced guided walkthroughs |

---

## API Reference

### Core Classes

- **[Tensor](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-tensor)** - Multi-dimensional array abstraction
- **[GradTensor](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-autograd)** - Tensor with gradient tracking
- **[TensorOps](/docs/api-tensorops)** - Advanced tensor operations ⭐ NEW
- **[Module](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nn)** - Base class for neural network components
- **[Sequential](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nn)** - Container for stacked modules

### Neural Network Modules (118+ classes)

**Layers:**
- [Linear](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nn)
- [Conv2d](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-cnn)
- [RNN, LSTM, GRU](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-rnn)
- [MultiHeadAttention](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-transformer)
- [Embedding](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nn)

**Full List:** [All NN Modules](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nn)

### Loss Functions

- [CrossEntropyLoss](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nn)
- [MSELoss](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nn)
- [BCELoss](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nn)
- [Full List](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nn)

### Optimizers

- [Adam](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-optimize)
- [SGD](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-optimize)
- [RMSprop](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-optimize)
- [Full List](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-optimize)

### Data & Vision ⭐ NEW

- [Tokenizer](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-nlp)
- [VisionTransforms](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-vision)
- [Compose](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-vision)
- [Normalize](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-vision)

---

## Examples & Tutorials

- [Examples Docs](/docs/setup/examples-docs) - Main chooser for setup-side examples, tutorials, and runnable demos
- [JBang Examples Catalog](/docs/setup/jbang-examples) - Runnable terminal-first scripts across ML, multimodal, and trainer lanes
- [Jupyter Integration](/docs/tutorials/integrations/jupyter) - Standalone Gollek Java notebooks with helpers, magics, and artifact inspection
- [Trainer JBang Docs](/docs/setup/trainer-jbang-docs) - Trainer-family demos, inspectors, and workflows
- [Tutorials Overview](/docs/tutorials/) - Guided basic, intermediate, and advanced walkthroughs
- [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow) - End-to-end trainer-first tutorial path

---

## Setup & Runtime

- [Setup Docs](/docs/setup/) - Install, configure, and bootstrap Gollek
- [CLI Installation](/docs/setup/cli-installation) - CLI setup and first-run path
- [CLI Reference](/docs/setup/cli-reference) - Command usage and options
- [Extensions](/docs/extensions/) - Scaffold pipeline projects and global `FeatureAdapter` packages
- [MOSS TTS ONNX Audio](/docs/runtime/moss-tts-onnx) - Local text-to-speech runtime path
- [Optimization Config](/docs/optimization-config)
- [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs)
- [GPU Runtime Troubleshooting](/docs/runtime/gpu-runtime-troubleshooting)
- [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
- [Native Runtime Docs](/docs/runtime/native-runtime-docs)
- [Quantization Docs](/docs/framework/quantization-docs)
- [Native Library Guide](/docs/runtime/native-library-guide)

---

## Architecture & Design

- [Runtime Architecture](/docs/runtime/architecture)
- [Core Runtime Architecture](/docs/runtime/core-runtime-architecture)
- [Device Responsibility Architecture](/docs/runtime/device-responsibility-architecture)
- [Framework Overview](/docs/framework/framework)
- [Developer Guidance](/docs/dev-log/developer-guidance)

---

## Troubleshooting & FAQ

- [Troubleshooting Guide](/docs/setup/troubleshooting)
- [Error Codes](/docs/setup/error-codes)
- [GPU Runtime Troubleshooting](/docs/runtime/gpu-runtime-troubleshooting)
- [Native Library Guide](/docs/runtime/native-library-guide)

---

## Contributing

- [SDK Installation](/docs/setup/sdk-installation)
- [CLI Installation](/docs/setup/cli-installation)
- [Developer Guidance](/docs/dev-log/developer-guidance)
- [GitHub Packages Deployment](/docs/dev-log/github-packages-deployment)
- [Git Repository Cleanup](/docs/dev-log/git-repository-cleanup)

---

## Release Notes

- **[SDK v0.2](/docs/release-notes-v0.2)** ⭐ Latest - Advanced Tensor Ops, Vision Transforms, NLP Tokenizers
- [Enhancement History](/docs/dev-log/enhancement-history) - Historical implementation notes
- [PyTorch Migration Guide](/docs/migration-pytorch) - Migrating model and API patterns into Gollek

---

## Community & Support

- [GitHub Repository](https://github.com/bhangun/gollek)
- [GitHub Discussions](https://github.com/bhangun/gollek/discussions)
- [Issue Tracker](https://github.com/bhangun/gollek/issues)
- [Email](mailto:support@gollek.io)

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--subtle-bg); border-radius: 12px;">
  <h3>Ready to Build?</h3>
  <p>Start with the <strong><a href="/docs/setup/sdk-installation">Quick Start Guide</a></strong> or dive into <strong><a href="/docs/setup/examples-docs">Examples Docs</a></strong></p>
  <p style="font-size: 0.9rem; margin-top: 1rem;">
    <a href="https://github.com/bhangun/gollek">⭐ Star on GitHub</a> •
    <a href="https://github.com/bhangun/gollek/discussions">💬 Join Discussions</a> •
    <a href="mailto:support@gollek.io">📧 Email Support</a>
  </p>
</div>
