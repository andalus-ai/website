---
layout: default
title: Advanced Tutorials
parent: Tutorials
nav_order: 30
---

# 🔴 Advanced Tutorials

Use this tier when the basic and intermediate examples are already working and you want to turn them into runtime, deployment, reporting, or multimodal workflows. The advanced tier is intentionally branch-based: pick one production goal, finish its shortest path, then come back for the next branch.

## Before You Start

You will get the most out of this tier if you have already completed the core bridge from the [Intermediate Tutorials](/docs/tutorials/intermediate/):

- [CNN image modeling](/docs/tutorials/intermediate/cnn) or [RNN sequence modeling](/docs/tutorials/intermediate/rnn)
- [Building Efficient Data Pipelines](/docs/tutorials/intermediate/data-pipelines)
- [Stable Diffusion Image Generation](/docs/tutorials/intermediate/stable-diffusion)

If those pieces are not familiar yet, start with the intermediate page first. It maps the full path from setup and tensors into the advanced runtime workflows below.

## Default Advanced Route

| Step | Tutorial | Outcome |
|------|----------|---------|
| 1 | [Multimodal AI Pipelines](/docs/tutorials/advanced/multimodal) | Combine text, image, audio, and model-specific encoders in one workflow. |
| 2 | [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start) | Compress one model, verify the output, and decide whether Java or REST owns the next step. |
| 3 | [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start) | Produce one native executable or shared library and verify the artifact. |
| 4 | [Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start) | Install one provider plugin and verify the runtime plugin path. |
| 5 | [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow) | Inspect reports, bundle manifests, and release views after a run. |

## Choose Your Branch

<div class="paths-grid">
  <a class="path-card path-card-highlighted" href="/docs/tutorials/advanced/multimodal">
    <span class="path-badge">Apps</span>
    <h3>Multimodal Products</h3>
    <p class="path-description">Start here when the goal is an assistant, image workflow, audio flow, or combined modality experience.</p>
    <div class="path-features">
      <span class="feature-tag feature-tag-highlighted">Vision</span>
      <span class="feature-tag feature-tag-highlighted">Audio</span>
      <span class="feature-tag feature-tag-highlighted">Fusion</span>
    </div>
  </a>

  <a class="path-card" href="/docs/tutorials/advanced/quantization-quick-start">
    <span class="path-badge">Runtime</span>
    <h3>Smaller Deployable Models</h3>
    <p class="path-description">Use quantization, native runtime packaging, and provider plugins to move a model toward serving.</p>
    <div class="path-features">
      <span class="feature-tag">INT8</span>
      <span class="feature-tag">Native</span>
      <span class="feature-tag">Cloud</span>
    </div>
  </a>

  <a class="path-card" href="/docs/tutorials/integrations/agent-serving">
    <span class="path-badge">Serving</span>
    <h3>Agent Runtime Substrate</h3>
    <p class="path-description">Preflight model routes, validate requests and tools, expose MCP contracts, create embeddings, and pass caller-owned RAG context into Gollek serving.</p>
    <div class="path-features">
      <span class="feature-tag">Route Gate</span>
      <span class="feature-tag">Embeddings</span>
      <span class="feature-tag">MCP</span>
    </div>
  </a>

  <a class="path-card" href="/docs/tutorials/advanced/diffusion-opd-report-workflow">
    <span class="path-badge">Ops</span>
    <h3>Training Reports & Bundles</h3>
    <p class="path-description">Use the reporting workflows when you need to inspect runs, reopen saved outputs, or compare experiments.</p>
    <div class="path-features">
      <span class="feature-tag">Reports</span>
      <span class="feature-tag">Bundles</span>
      <span class="feature-tag">Compare</span>
    </div>
  </a>
</div>

## Branch Guides

### Multimodal And Domain Workflows

- **[Multimodal AI Pipelines](/docs/tutorials/advanced/multimodal)**: build models that see, hear, and speak.
- **[Stable Diffusion from Scratch](/docs/tutorials/advanced/multimodal#stable-diffusion-from-scratch)**: implement the diffusion pipeline using Gollek components.
- **[Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)**: choose transcription or synthesis first, run one Java audio flow, and decide when to use the specialized MOSS TTS ONNX runtime page.
- **[On-Device Inference with LiteRT](/docs/tutorials/advanced/on-device)**: export and run models on mobile and Apple Silicon.

### Runtime And Deployment

- **[Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start)**: choose one strategy, quantize one model, verify the output, and route the result into Java or REST usage.
- **[Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start)**: build one native executable or one shared library and verify the output artifact.
- **[Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start)**: install one provider plugin, set one API key, configure `plugin.json` or env vars, and verify the runtime plugin path.
- **[Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving)**: use Gollek as the serving engine for Wayang-Gollek or another agent runtime with preflight policies, route matching, MCP discovery, embeddings, and caller-owned RAG context.
- **[SafeTensors & GGUF](/docs/tutorials/advanced/on-device#safetensor--gguf)**: master high-performance weight persistence formats.
- **[Custom GPU Kernels](/docs/tutorials/advanced/on-device#custom-gpu-kernels)**: write Metal-accelerated operations for the Gollek backend.

### Reports, Experiments, And Terminal Workflows

- **[DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow)**: train a run, load `diffusion-opd-report.json`, compute campaign/release views, and inspect bundle manifests.
- **[DiffusionOPD JBang Inspector Workflow](/docs/tutorials/advanced/diffusion-opd-jbang-inspector)**: inspect reports, export bundles, and validate bundle health directly from the terminal.
- **[Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow)**: bootstrap the trainer runtime, choose a family-specific workflow, inspect artifacts, and reopen saved bundles from the terminal.
- **[Byte-Latent Workflow](/docs/tutorials/advanced/byte-latent-workflow)**: run a checkpoint demo, inspect history, inspect a workflow manifest, compare two train+infer reports, and reopen a compare bundle.
- **[Recursive Reasoning Workflow](/docs/tutorials/advanced/recursive-reasoning-workflow)**: run the GRAM-style demo, inspect one report, compare two reports, reopen saved results, and reopen compare bundles.
- **[Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)**: turn benchmark examples into generic token datasets, profiles, deterministic splits, length-sorted epochs, and padded batches.

## When To Move Back To References

After a quick start works, use the reference pages to deepen the implementation:

- [Runtime Core API](/docs/runtime/core-api) for SDK-level inference contracts.
- [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving) for route templates and preflight policy examples.
- [Agent Integration API](/docs/agent-integration-api) for serving preflight, route policy gates, MCP discovery, embeddings, and RAG context injection.
- [Native Runtime Docs](/docs/runtime/native-runtime-docs) for native-image, executables, and FFI entrypoints.
- [Quantization Docs](/docs/framework/quantization-docs) for strategy selection, Java usage, and REST usage.
- [gollek-ml-data API](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-data) when data loading, batching, or sampling needs more control.
- [gollek-ml-recursive-reasoning API](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-recursive-reasoning) when structured reasoning datasets, rollouts, or benchmark adapters need more control.

---

[Back to Tutorials Overview](../)
