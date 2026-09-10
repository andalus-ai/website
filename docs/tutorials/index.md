---
layout: default
title: Tutorials
nav_order: 30
---

# 🎓 Tutorials

Use this page as the front door for the Gollek learning path. Start with the basic route if you are new to the SDK, jump to intermediate if you already understand tensors and training loops, or choose an advanced branch when you are packaging, compressing, serving, or inspecting real workflows.

## Start Here

<div class="paths-grid">
  <a class="path-card path-card-highlighted" href="/docs/tutorials/basic/">
    <span class="path-badge">Begin</span>
    <h3>Basic Foundations</h3>
    <p class="path-description">Install Java 25 and Gollek, run a first script, learn tensors, and train a small neural network.</p>
    <div class="path-features">
      <span class="feature-tag feature-tag-highlighted">Install</span>
      <span class="feature-tag feature-tag-highlighted">Tensors</span>
      <span class="feature-tag feature-tag-highlighted">First NN</span>
    </div>
  </a>

  <a class="path-card" href="/docs/tutorials/intermediate/">
    <span class="path-badge">Build</span>
    <h3>Intermediate Modeling</h3>
    <p class="path-description">Move into CNNs, RNNs, data loaders, batching, collators, and ONNX Stable Diffusion.</p>
    <div class="path-features">
      <span class="feature-tag">CNN</span>
      <span class="feature-tag">RNN</span>
      <span class="feature-tag">Data</span>
    </div>
  </a>

  <a class="path-card" href="/docs/tutorials/advanced/">
    <span class="path-badge">Ship</span>
    <h3>Advanced Workflows</h3>
    <p class="path-description">Choose branches for multimodal products, quantized runtime deployment, native packaging, and report inspection.</p>
    <div class="path-features">
      <span class="feature-tag">Runtime</span>
      <span class="feature-tag">Multimodal</span>
      <span class="feature-tag">Reports</span>
    </div>
  </a>
</div>

## Default Learning Route

| Step | Tutorial | Main result |
|------|----------|-------------|
| 1 | [Installation & CLI Hello World](/docs/tutorials/basic/installation) | Java 25, Gollek CLI, and a working JBang script. |
| 2 | [Tensors for Beginners](/docs/tutorials/basic/tensors) | Tensor creation, math operations, and device movement. |
| 3 | [My First Neural Network](/docs/tutorials/basic/first-nn) | A small trainable model with loss and optimizer steps. |
| 4 | [Convolutional Neural Networks](/docs/tutorials/intermediate/cnn) | Image-modeling foundations. |
| 5 | [LSTMs & Sequences](/docs/tutorials/intermediate/rnn) | Sequence-modeling foundations for text, audio, and time series. |
| 6 | [Building Efficient Data Pipelines](/docs/tutorials/intermediate/data-pipelines) | Repeatable datasets, loaders, splits, collators, and samplers. |
| 7 | [Stable Diffusion Image Generation](/docs/tutorials/intermediate/stable-diffusion) | Prompt-to-image workflow through the ONNX path. |
| 8 | [Advanced Tutorials](/docs/tutorials/advanced/) | Branch into multimodal, deployment, reporting, and runtime paths. |
| 9 | [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving) | Use Gollek as a serving engine for Wayang-Gollek or another agent runtime. |

## Choose By Goal

| If you want to... | Go here |
|-------------------|---------|
| learn Gollek from a clean machine | [Basic Tutorials](/docs/tutorials/basic/) |
| build image or sequence models | [Intermediate Tutorials](/docs/tutorials/intermediate/) |
| batch, split, collate, or sample training data | [Building Efficient Data Pipelines](/docs/tutorials/intermediate/data-pipelines) |
| generate images from prompts | [Stable Diffusion Image Generation](/docs/tutorials/intermediate/stable-diffusion) |
| build multimodal applications | [Multimodal AI Pipelines](/docs/tutorials/advanced/multimodal) |
| make models smaller for deployment | [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start) |
| package native artifacts | [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start) |
| connect Gollek to an agent runtime | [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving) |
| keep Gollek and Wayang-Gollek responsibilities separate | [Agent Integration Boundary](/docs/agent-integration-boundary) |
| inspect reports, bundles, and experiment outputs | [DiffusionOPD Reporting Workflow](/docs/tutorials/advanced/diffusion-opd-report-workflow) |
| run terminal-first examples | [Integrations](/docs/tutorials/integrations/) |

## Integration Tracks

Use these when you already know which environment you want:

- [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving) for Wayang-Gollek or external agent runtimes that use Gollek as an inference/serving engine.
- [JBang Integration](/docs/tutorials/integrations/jbang) for single-file Java experiments and terminal-first tutorial scripts.
- [Jupyter Integration](/docs/tutorials/integrations/jupyter) for notebook-style exploration with the standalone Gollek Java kernel and notebook magics.
- [LangChain4j Integration](/docs/tutorials/integrations/langchain4j) for application workflows that already use LangChain4j.

## Reference Handoff

Tutorials are deliberately task-first. When you need API depth after a tutorial works, continue with:

- [gollek-ml-data API](/docs/api-references/0.1.0-SNAPSHOT/modules/gollek-ml-data) for dataset and loader details.
- [Runtime Core API](/docs/runtime/core-api) for inference requests, responses, streaming, and async flows.
- [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving) for route templates and preflight policy examples.
- [Agent Integration API](/docs/agent-integration-api) for serving preflight, route gates, MCP discovery, embeddings, and RAG context injection.
- [Quantization Docs](/docs/framework/quantization-docs) for model compression strategy and configuration.
- [Native Runtime Docs](/docs/runtime/native-runtime-docs) for native-image and FFI packaging.

---

[Back to Documentation Hub](../)
