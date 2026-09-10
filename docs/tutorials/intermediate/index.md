---
layout: default
title: Intermediate Tutorials
parent: Tutorials
nav_order: 20
---

# Intermediate Tutorials

Use this tier as the bridge from first Gollek models to production-ready model workflows. The path below starts with basic setup, moves through CNN/RNN/data-pipeline work, then hands you off to multimodal, quantization, native runtime, and reporting workflows in the advanced tier.

## Learning Path: Basic to Advanced

<div class="paths-grid">
  <a class="path-card" href="/docs/tutorials/basic/">
    <span class="path-badge">Start</span>
    <h3>1. Basic Foundations</h3>
    <p class="path-description">Install Gollek, learn tensors, run a first neural network, and use JBang for quick local experiments.</p>
    <div class="path-features">
      <span class="feature-tag">Installation</span>
      <span class="feature-tag">Tensors</span>
      <span class="feature-tag">First NN</span>
    </div>
  </a>

  <a class="path-card path-card-highlighted" href="/docs/tutorials/intermediate/cnn">
    <span class="path-badge">Current</span>
    <h3>2. Intermediate Modeling</h3>
    <p class="path-description">Build image and sequence models, prepare repeatable data loaders, and run an ONNX Stable Diffusion image-generation workflow.</p>
    <div class="path-features">
      <span class="feature-tag feature-tag-highlighted">CNN</span>
      <span class="feature-tag feature-tag-highlighted">RNN</span>
      <span class="feature-tag feature-tag-highlighted">DataLoader</span>
      <span class="feature-tag feature-tag-highlighted">Stable Diffusion</span>
    </div>
  </a>

  <a class="path-card" href="/docs/tutorials/advanced/">
    <span class="path-badge">Next</span>
    <h3>3. Advanced Runtime Workflows</h3>
    <p class="path-description">Move from single examples into multimodal pipelines, quantization, native runtimes, cloud providers, and report inspection workflows.</p>
    <div class="path-features">
      <span class="feature-tag">Multimodal</span>
      <span class="feature-tag">Quantization</span>
      <span class="feature-tag">Native Runtime</span>
    </div>
  </a>

  <a class="path-card" href="/docs/tutorials/integrations/agent-serving">
    <span class="path-badge">Serve</span>
    <h3>4. Agent Serving Integration</h3>
    <p class="path-description">Use Gollek as the inference and serving substrate for Wayang-Gollek or another agent runtime, with preflight gates, route matching, MCP discovery, embeddings, and caller-owned RAG context.</p>
    <div class="path-features">
      <span class="feature-tag">Preflight</span>
      <span class="feature-tag">MCP</span>
      <span class="feature-tag">RAG</span>
    </div>
  </a>
</div>

## Recommended Order

| Step | Tutorial | Why it matters |
|------|----------|----------------|
| 1 | [Installation & CLI Hello World](/docs/tutorials/basic/installation) | Get Java, the CLI, and a working local command path. |
| 2 | [Tensors for Beginners](/docs/tutorials/basic/tensors) | Understand the tensor API used by every model example. |
| 3 | [My First Neural Network](/docs/tutorials/basic/first-nn) | Train a small model before adding specialized layers. |
| 4 | [Convolutional Neural Networks](/docs/tutorials/intermediate/cnn) | Move into image classification and image datasets. |
| 5 | [LSTMs & Sequences](/docs/tutorials/intermediate/rnn) | Work with sequence, text, audio, and time-series patterns. |
| 6 | [Building Efficient Data Pipelines](/docs/tutorials/intermediate/data-pipelines) | Batch, split, collate, and sample training data with the canonical `gollek-ml-data` APIs. |
| 7 | [Stable Diffusion Image Generation](/docs/tutorials/intermediate/stable-diffusion) | Generate images with the ONNX Stable Diffusion runner and SDK flow. |
| 8 | [Multimodal AI Pipelines](/docs/tutorials/advanced/multimodal) | Combine modalities and connect the intermediate work to richer AI systems. |
| 9 | [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start) | Make models smaller and more deployment-friendly. |
| 10 | [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start) | Package and verify native artifacts for deployment. |
| 11 | [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving) | Preflight a serving route, validate tools, expose MCP contracts, create embeddings, and pass caller-selected RAG context without moving orchestration into Gollek. |
| 12 | [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow) | Inspect training reports, bundles, and release views. |

## Intermediate Tutorials

- **[Convolutional Neural Networks (CNN)](/docs/tutorials/intermediate/cnn)**: Build image classifiers and connect them to image data.
- **[LSTMs & Sequences](/docs/tutorials/intermediate/rnn)**: Handle time-series, audio, and text-like sequence inputs.
- **[Building Efficient Data Pipelines](/docs/tutorials/intermediate/data-pipelines)**: Use `Dataset`, `DataLoader`, splits, collators, and samplers for repeatable training.
- **[Stable Diffusion Image Generation](/docs/tutorials/intermediate/stable-diffusion)**: Generate images from prompts with the ONNX Stable Diffusion path.
- **[Auto-Grad in Depth](/docs/tutorials/intermediate/rnn#autograd-in-depth)**: Understand how gradients flow through custom modules.

## Choose Your Next Advanced Branch

- **Image generation and multimodal apps**: continue to [Multimodal AI Pipelines](/docs/tutorials/advanced/multimodal), then [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow).
- **Model size and serving**: continue to [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start), then [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start).
- **Agentic serving integrations**: continue to [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving), then [Agent Integration API](/docs/agent-integration-api) and [Agent Integration Boundary](/docs/agent-integration-boundary) before wiring Wayang-Gollek or another orchestrator.
- **Terminal-first workflows**: continue to [JBang Integration](/docs/tutorials/integrations/jbang), then [Trainer JBang Workflow](/docs/tutorials/advanced/trainer-jbang-workflow).

---

[Back to Tutorials Overview](/docs/tutorials/)
