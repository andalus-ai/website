---
layout: default
title: Introducing the New Gollek Inference Engine
date: 2026-02-27
description: Release introduction to the new Gollek inference engine, key advantages, and community contribution paths.
categories: [release, runtime]
tags: [sdk, cli, native, community, performance]
cover: aurora
---

<p class="blog-meta">Published: February 27, 2026</p>

# Introducing the New Gollek Inference Engine

Gollek is now available as a full inference engine platform for developers, teams, and the wider community. This release focuses on fast local execution, clean integration paths, and production-ready operations without giving up flexibility.

Whether you are building command-line workflows, backend services, or enterprise integration layers, Gollek is designed to be practical from day one.

---

## What Is New in This Release

- Unified inference runtime across local and cloud providers
- Standalone `gollek` CLI for direct usage
- Java SDK for service and application embedding
- Native build and distribution support for macOS, Linux, and Windows
- Consistent developer experience for install, run, observe, and iterate

---

## Why Gollek Is a Strong Choice

### 1. One Interface Across Many Runtimes

Gollek gives a consistent API and CLI surface for multiple model backends and providers. Teams can switch providers, compare outputs, and evolve architecture without rewriting the full integration layer.

### 2. Local-First Performance

The runtime is built for practical local inference workflows, including GGUF-native usage and low-latency startup paths. This helps developer machines, edge environments, and cost-sensitive deployments.

### 3. SDK + CLI Together

Many teams need both: an SDK for application integration and a CLI for experiments, debugging, and operations. Gollek ships both as first-class components so your workflow stays consistent from prototype to production.

### 4. Cross-Platform Distribution

Release artifacts support macOS, Linux, and Windows, including installer-oriented packaging and package-manager pathways. This lowers friction for team onboarding and internal adoption.

### 5. Native-Ready Architecture

Gollek supports native compilation and FFI-oriented workflows, making it a fit for high-performance services, constrained environments, and integration with non-JVM ecosystems.

### 6. Extensible by Design

Provider and extension patterns make it possible to add capabilities incrementally. You can keep the core lean while introducing specialized runtime behavior as your use cases grow.

### 7. Production Observability Mindset

The platform is designed to work with structured logging, metrics, and service-oriented deployment patterns, helping teams operate inference workloads with confidence.

---

## Who Should Use Gollek

- Developers who want local inference workflows with a clean CLI
- Backend teams embedding inference into Java services
- Platform teams standardizing model-provider access across products
- Builders who need a foundation they can extend and contribute to

---

## Community and Contribution

Gollek is built for open collaboration. Community and developer contributions are welcome across:

- Runtime performance improvements
- Provider integrations
- Documentation and example quality
- Tooling, packaging, and cross-platform support
- Testing, reliability, and observability enhancements

If you want to contribute, start with:

1. Read the docs and run the CLI locally
2. Open issues for bugs, improvements, and feature proposals
3. Submit pull requests for targeted improvements
4. Share usage feedback so we can prioritize real developer needs

---

## Start Today

- Install guide: [Gollek CLI Installation](/docs/cli-installation)
- Developer docs: [Getting Started](/docs/)
- API reference: [Core API](/docs/core-api)
- Project repository: [bhangun/gollek](https://github.com/bhangun/gollek)

Gollek is ready to use now, and it will get better with community input. We invite developers and organizations to build with it, test it in real workloads, and help shape the roadmap.
