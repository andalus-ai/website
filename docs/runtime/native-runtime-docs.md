---
layout: default
title: Native Runtime Docs
---

# Native Runtime Docs

This page groups the main Gollek native-image and native-FFI materials into one
reader path.

It is the best entrypoint if you are trying to answer one of these questions:

- how to build Gollek components as GraalVM native images
- how native-image build profiles and flags fit into deployment workflows
- how to expose Gollek through a C-friendly FFI surface
- whether you need a native executable or a shared library

See also:

- [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start)
- [Native Runtime Glossary](/docs/runtime/native-runtime-glossary)
- [Native Runtime Examples](/docs/runtime/native-runtime-examples)

## Do You Want An Executable Or A Shared Library?

If you want a native executable, start with:

- [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start)
- [Native Compilation Guide](/docs/runtime/native-compilation)

If you want a native shared library and C ABI boundary, start with:

- [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start)
- [Native FFI Reference](/docs/runtime/native-ffi)
- [Native Runtime Examples](/docs/runtime/native-runtime-examples)

Rule of thumb:

- executable means Gollek itself is the deployed process
- shared library means another host process loads and calls Gollek through the
  exported native entrypoints

## Which Page Should I Read?

If you want to build native executables with GraalVM, start with
[Native Compilation Guide](/docs/runtime/native-compilation).

If you want to embed Gollek behind a C ABI or shared library boundary, start
with [Native FFI Reference](/docs/runtime/native-ffi).

If you want one compact hands-on path first, use
[Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start).

If you want a quick vocabulary reference for build and FFI terms, use
[Native Runtime Glossary](/docs/runtime/native-runtime-glossary).

If you want abbreviated output and call-flow shapes first, use
[Native Runtime Examples](/docs/runtime/native-runtime-examples).

## Main Surfaces

- [Native Compilation Guide](/docs/runtime/native-compilation)
  explains GraalVM installation, native-image prerequisites, build profiles,
  optimization flags, and deployment-oriented native builds.
- [Native FFI Reference](/docs/runtime/native-ffi)
  explains the shared-library path, `@CEntryPoint` surface, and the exported C
  APIs for client lifecycle, error handling, and inference calls.
- [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start)
  is the shortest path for building one native executable or one shared
  library and verifying the output artifact.
- [Native Runtime Glossary](/docs/runtime/native-runtime-glossary)
  defines the main GraalVM, native-image, and FFI vocabulary used across this
  docs cluster.
- [Native Runtime Examples](/docs/runtime/native-runtime-examples)
  shows the expected executable output, shared-library output, and minimal C
  call flow shapes.

## Starter Paths

### I want a native executable

1. read [Native Compilation Guide](/docs/runtime/native-compilation)
2. install GraalVM and `native-image`
3. use the documented `-Pnative` build path for the component you care about

### I want a native shared library / FFI boundary

1. read [Native FFI Reference](/docs/runtime/native-ffi)
2. build the Java classes
3. generate the shared library with `native-image --shared`

## Rule Of Thumb

- native executable:
  choose this when Gollek itself is the deployed program
- native shared library:
  choose this when another host process wants to call Gollek through a C API

## Key Runtime Locations

| Path | Role |
|------|------|
| `docs/runtime/native-compilation.md` | Native-image build and deployment guide |
| `docs/runtime/native-ffi.md` | Shared-library and C-API reference |
| `inference-gollek/sdk/gollek-sdk-java-local/` | Java-local SDK surface used in the FFI examples |

## What’s Stable Vs Evolving?

The current stable-enough surfaces for readers and downstream integrators are:

- the documented GraalVM/native-image build flow
- the high-level distinction between executable and shared-library paths
- the exported C API families in the native FFI reference

The more likely-to-evolve areas are:

- optimization flags and recommended profile combinations
- some deployment examples and module-specific build paths
- the exact breadth of the FFI surface as more entrypoints are added

Rule of thumb:
anchor integrations first on the documented build model and current exported FFI
entrypoints, then treat performance-tuning and expansion details as higher-churn
layers.

## Docs Status

Current native-runtime docs coverage includes:

- GraalVM/native-image prerequisites
- native build profiles and optimization flags
- module-level native build examples
- shared-library generation
- exported C API surface reference
- compact hands-on quick-start tutorial
- shared glossary coverage
- artifact/examples page

Recent additions:

- native-runtime landing page
- quick-start tutorial
- glossary
- artifact/examples page
- top-level chooser

If this docs cluster still is not enough, the fastest next places to look are:

- `docs/runtime/native-compilation.md`
- `docs/runtime/native-ffi.md`
- `inference-gollek/sdk/gollek-sdk-java-local/`
