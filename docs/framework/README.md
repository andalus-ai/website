---
layout: default
title: Framework Documentation
nav_order: 2
parent: Docs
has_children: true
---

# Gollek Framework Documentation

Comprehensive documentation for the Gollek ML/DL Framework.

---

## Core Documentation

### [Framework Enhancement Status](FRAMEWORK-ENHANCEMENT-STATUS.md)
{: .mb-4 }
Latest completion status (April 8, 2026)
- ✅ 95%+ implementation complete
- 100+ Java classes implemented
- 11 pre-trained models
- Production-ready infrastructure

### [Framework Architecture](framework.md)
{: .mb-4 }
Deep dive into framework design and architecture
- Core components and modules
- Autograd system design
- Tensor operations
- Layer abstractions

### [ML SDK Guide](ml-sdk.md)
{: .mb-4 }
Getting started with the Gollek ML SDK
- Installation and setup
- Basic tensor operations
- Building and training models
- Model evaluation

### [Training Docs](training.md)
{: .mb-4 }
Routing page for the broader Java training lane
- Generic framework training path
- Trainer runtime and JBang entrypoints
- DiffusionOPD, Byte-Latent, and Recursive Reasoning family selection

### [Recursive Reasoning Dataset API](recursive-reasoning-dataset-api.md)
{: .mb-4 }
Structured reasoning dataset utilities
- Generic token examples, profiles, splits, epochs, and padded batches
- Task-stratified split policies for mixed benchmarks
- Length-sorted batching and padding-efficiency metrics

### [Quantization Guide](quantization.md)
{: .mb-4 }
Model quantization and compression techniques
- INT8 quantization
- FP16 mixed precision
- Quantization-Aware Training (QAT)
- Performance benchmarks

### [Multimodal SDK](multimodal-sdk.md)
{: .mb-4 }
Support for multimodal AI models
- Vision-language models
- Audio processing
- Cross-modal embeddings

### [Audio Processing](audio-processing.md)
{: .mb-4 }
Audio processing and speech models
- Audio augmentation
- Feature extraction
- Speech recognition integration

---

## Quick Links

### For New Users
1. Start with [Framework Enhancement Status](FRAMEWORK-ENHANCEMENT-STATUS.md) for latest updates
2. Read [ML SDK Guide](ml-sdk.md) to get started
3. Follow a tutorial from the getting-started guide (coming soon)

### For Advanced Users
1. Review [Framework Architecture](framework.md) for design details
2. Explore [Quantization Guide](quantization.md) for optimization
3. Check [Multimodal SDK](multimodal-sdk.md) for advanced features

### For Contributors
1. See [Framework Enhancement Status](FRAMEWORK-ENHANCEMENT-STATUS.md#next-steps) for roadmap
2. Review architecture in [Framework Architecture](framework.md)
3. Follow coding standards in SDK modules

---

## Status Overview

| Component | Status | Details |
|-----------|--------|---------|
| **Core Framework** | ✅ Complete | Autograd, tensor ops, 50+ layers |
| **Model Zoo** | ✅ 95% | 11 core models (CLIP/Wav2Vec2 pending) |
| **Distributed Training** | ✅ Complete | DataParallel, DDP, ring-allreduce |
| **Quantization** | ✅ Complete | INT8, FP16, QAT with <1% loss |
| **Serving** | ✅ Complete | HTTP REST server, model registry |
| **Documentation** | ⚠️ 60% | Architecture clear, user guides in progress |

---

## Key Features

### Architecture
- **Pure Java** — No JNI dependencies for core operations
- **JDK 25 Optimized** — Vector API for SIMD, FFM for off-heap storage
- **Modular Design** — 18+ independent SDK modules
- **Production-Ready** — Tested, documented, optimized

### Capabilities
- **100+ Layer Types** — CNN, RNN, Transformer, GNN, etc.
- **15+ Loss Functions** — Classification, regression, metric learning
- **9+ Optimizers** — Adam, SGD, LAMB, Lion, SAM, etc.
- **20+ Metrics** — Classification, regression, segmentation, NLP

### Performance
- **SIMD Acceleration** — 2-5x faster via Vector API
- **Distributed Training** — Multi-GPU, multi-node with DDP
- **Quantization** — 4x smaller models with <1% accuracy loss
- **Async I/O** — Virtual threads for non-blocking operations

---

## Latest Updates

**April 8, 2026** — Framework Enhancement Assessment Complete
- 95%+ implementation rate confirmed
- 17 implementation sessions documented
- 100+ classes implemented and tested
- Alpha release target: Week 2
- GA release target: Week 6-8

See [Framework Enhancement Status](FRAMEWORK-ENHANCEMENT-STATUS.md) for full details.

---

## Navigation

- **[Home](./)** — Documentation index
- **[Runtime](/docs/runtime/architecture)** — Gollek runtime system
- **[Plugins](/docs/plugins/plugin-system-v2)** — Plugin system and extensions
- **[Setup](/docs/setup/)** — Installation and configuration

---

**Last Updated:** April 8, 2026  
**Current Version:** 1.0 Beta (In Development)  
**Confidence Level:** High (85-90%)
