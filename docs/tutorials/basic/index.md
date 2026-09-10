---
layout: default
title: Basic Tutorials
parent: Tutorials
nav_order: 10
---

# 🟢 Basic Tutorials

Use this tier to get from a clean machine to a small trainable Gollek model. The goal is not to cover every API yet; it is to make the core loop feel normal: install the tools, create tensors, define a model, run a training step, then move into real data and specialized architectures.

## Recommended Order

| Step | Tutorial | You should finish with |
|------|----------|------------------------|
| 1 | [Installation & CLI Hello World](/docs/tutorials/basic/installation) | Java 25, the Gollek CLI, and a working JBang hello-world script. |
| 2 | [Tensors for Beginners](/docs/tutorials/basic/tensors) | Confidence creating tensors, running math operations, and moving tensors to an accelerator. |
| 3 | [My First Neural Network](/docs/tutorials/basic/first-nn) | A small feed-forward model with a forward pass, loss, backward pass, and optimizer step. |
| 4 | [Using JBang for Rapid Prototyping](/docs/tutorials/basic/installation#using-jbang-for-rapid-prototyping) | A quick way to run experiments before creating a full Maven project. |

## Basic Path Map

<div class="paths-grid">
  <a class="path-card path-card-highlighted" href="/docs/tutorials/basic/installation">
    <span class="path-badge">Step 1</span>
    <h3>Prepare The Runtime</h3>
    <p class="path-description">Install Java 25, verify the Gollek CLI, and run the smallest script that touches the SDK.</p>
    <div class="path-features">
      <span class="feature-tag feature-tag-highlighted">Java 25</span>
      <span class="feature-tag feature-tag-highlighted">CLI</span>
      <span class="feature-tag feature-tag-highlighted">JBang</span>
    </div>
  </a>

  <a class="path-card" href="/docs/tutorials/basic/tensors">
    <span class="path-badge">Step 2</span>
    <h3>Learn The Data Shape</h3>
    <p class="path-description">Use tensors for initialization, element-wise operations, matrix math, and device movement.</p>
    <div class="path-features">
      <span class="feature-tag">Tensor</span>
      <span class="feature-tag">MatMul</span>
      <span class="feature-tag">Device</span>
    </div>
  </a>

  <a class="path-card" href="/docs/tutorials/basic/first-nn">
    <span class="path-badge">Step 3</span>
    <h3>Train One Small Model</h3>
    <p class="path-description">Connect layers, loss, gradients, and an optimizer before moving to CNN/RNN workflows.</p>
    <div class="path-features">
      <span class="feature-tag">Layers</span>
      <span class="feature-tag">Loss</span>
      <span class="feature-tag">Optimizer</span>
    </div>
  </a>
</div>

## Success Checklist

Before moving on, make sure you can:

- run `gollek --version` and `gollek --help`
- run a JBang script that imports Gollek dependencies
- create a tensor and print its shape or values
- explain the difference between a forward pass, loss, backward pass, and optimizer step
- change one model hyperparameter and rerun the first neural-network example

## Continue the Learning Path

When these foundations feel comfortable, move to the [Intermediate Tutorials](/docs/tutorials/intermediate/). A good next route is:

1. [Convolutional Neural Networks](/docs/tutorials/intermediate/cnn) if you want image modeling.
2. [LSTMs & Sequences](/docs/tutorials/intermediate/rnn) if you want text, audio, or time-series patterns.
3. [Building Efficient Data Pipelines](/docs/tutorials/intermediate/data-pipelines) once you need batching, splitting, collators, and samplers.
4. [Stable Diffusion Image Generation](/docs/tutorials/intermediate/stable-diffusion) when you are ready for an ONNX image-generation workflow.

---

[Back to Tutorials Overview](../)
