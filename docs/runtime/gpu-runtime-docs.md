---
layout: default
title: GPU Runtime Docs
---

# GPU Runtime Docs

This page groups the main Gollek GPU runtime materials into one reader path.

It is the best entrypoint if you are trying to answer one of these questions:

- how Gollek’s GPU kernel stack is organized
- where the unified kernel SPI fits versus the backend-specific kernel pages
- how platform auto-detection and CPU fallback work
- how to reason about Metal device placement and responsibility boundaries
- how to install and verify the native libraries the runtime depends on

## Which Page Should I Read?

If you want the big-picture kernel architecture and platform comparison, start
with [GPU Kernel Acceleration](/docs/runtime/gpu-kernels).

If you want the stable Java-facing contract for CUDA, Metal, ROCm, and CPU
backends, start with [GPU Kernel SPI](/docs/runtime/gpu-kernel-spi).

If you want to understand how Gollek decides between Metal, CUDA, ROCm, and
CPU at runtime, start with
[Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection).

If you are debugging Apple Silicon or device-placement behavior, start with:

- [Metal GPU Device Placement](/docs/runtime/metal-gpu-device-placement)
- [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)
- [Device Responsibility Architecture](/docs/runtime/device-responsibility-architecture)

If you are blocked by missing `.dylib`, `.so`, or backend native dependencies,
start with [Native Library Management Guide](/docs/runtime/native-library-guide).

If you want one guided runtime debugging path that connects library setup,
platform detection, and device placement, use
[GPU Runtime Troubleshooting](/docs/runtime/gpu-runtime-troubleshooting).

## Main Surfaces

- [GPU Kernel Acceleration](/docs/runtime/gpu-kernels)
  explains backend families, platform tradeoffs, and kernel architecture.
- [GPU Kernel SPI](/docs/runtime/gpu-kernel-spi)
  defines the unified Java-facing compute contract above CUDA, Metal, ROCm,
  and CPU backends.
- [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection)
  explains platform selection, override flags, and fallback order.
- [Metal GPU Device Placement](/docs/runtime/metal-gpu-device-placement)
  explains how Metal/MPS placement works on Apple Silicon.
- [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)
  is the fast troubleshooting companion for runtime placement issues.
- [Device Responsibility Architecture](/docs/runtime/device-responsibility-architecture)
  explains which layer owns device decisions and where placement bugs should be
  investigated.
- [Native Library Management Guide](/docs/runtime/native-library-guide)
  covers installation, verification, overrides, and troubleshooting for native
  runtime libraries.
- [GPU Runtime Troubleshooting](/docs/runtime/gpu-runtime-troubleshooting)
  is the guided path for “GPU acceleration is not behaving right.”

## Quick Triage

If you just need the shortest runtime sanity-check path, use this order:

1. install and verify native libraries in
   [Native Library Management Guide](/docs/runtime/native-library-guide)
2. confirm the selected platform in
   [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection)
3. confirm the final device placement in
   [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)

That covers the three most common runtime questions:

- can Gollek load the required backend libraries?
- which platform did Gollek actually choose?
- where did the tensors finally land?

## Which Layer Owns This?

Use this quick ownership split before debugging too deeply:

- library/setup problem:
  start with [Native Library Management Guide](/docs/runtime/native-library-guide)
- platform-selection problem:
  start with [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection)
- placement/responsibility problem:
  start with
  [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)
  and
  [Device Responsibility Architecture](/docs/runtime/device-responsibility-architecture)
- backend optimization/detail problem:
  start with [GPU Kernel Acceleration](/docs/runtime/gpu-kernels)
  and [GPU Kernel SPI](/docs/runtime/gpu-kernel-spi)

## Starter Paths

### I just want GPU acceleration working

1. Read [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection)
2. Verify your runtime libraries in
   [Native Library Management Guide](/docs/runtime/native-library-guide)
3. Use [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)
   if the chosen device still looks wrong
4. Follow [GPU Runtime Troubleshooting](/docs/runtime/gpu-runtime-troubleshooting)
   if you want that whole path in one page

### I’m building against the Java kernel abstraction

1. Read [GPU Kernel SPI](/docs/runtime/gpu-kernel-spi)
2. Use [GPU Kernel Acceleration](/docs/runtime/gpu-kernels) for platform
   capability context
3. Use [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection) to
   understand real runtime selection behavior

### I’m debugging Apple Silicon placement

1. Read [Metal GPU Device Placement](/docs/runtime/metal-gpu-device-placement)
2. Keep [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)
   open for the fast checklist
3. Use [Device Responsibility Architecture](/docs/runtime/device-responsibility-architecture)
   when the bug is really about ownership boundaries

## Where Does This Live In The Repo?

| Path | Role |
|------|------|
| `inference-gollek/extension/kernel/` | Backend-specific kernel modules and low-level runtime integrations |
| `runner/` | Runtime adapters and format-specific execution layers |
| `gollek-backend-*` | Hardware/backend ownership modules such as Metal and CPU |
| `gollek-spi-*` | Shared runtime/service/provider contracts used above the backend layer |

Fast practical entrypoints:

- `docs/runtime/gpu-kernels.md`
- `docs/runtime/gpu-kernel-spi.md`
- `docs/runtime/kernel-auto-detection.md`
- `docs/runtime/metal-gpu-device-placement.md`
- `docs/runtime/native-library-guide.md`

## What’s Stable Vs Evolving?

The current stable-enough surfaces for readers and downstream integrators are:

- the documented platform-selection model in
  [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection)
- the public compute contract in
  [GPU Kernel SPI](/docs/runtime/gpu-kernel-spi)
- the native-library configuration and verification patterns in
  [Native Library Management Guide](/docs/runtime/native-library-guide)

The more likely-to-evolve areas are:

- backend-specific optimization details and benchmark claims
- newer platform-specific fast paths
- some architecture pages that describe ownership or diagnostics rather than a
  narrow public API contract

Rule of thumb:
anchor integrations first on the SPI, documented selection behavior, and
library-management boundary, then treat backend-specific optimization details
as higher-churn layers.

## Docs Status

Current GPU runtime docs coverage includes:

- backend architecture overview
- unified kernel SPI
- platform auto-detection and fallback
- Metal/device placement references
- native library setup and troubleshooting
- guided runtime troubleshooting workflow

Recent additions:

- GPU runtime landing page
- guided runtime troubleshooting workflow
- quick triage block
- ownership-routing box

If this runtime docs cluster still is not enough, the fastest next places to
look are:

- `docs/runtime/gpu-kernels.md`
- `docs/runtime/gpu-kernel-spi.md`
- `docs/runtime/native-library-guide.md`
