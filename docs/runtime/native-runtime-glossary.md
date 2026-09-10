---
layout: default
title: Native Runtime Glossary
---

# Native Runtime Glossary

This page defines the core terms used across Gollek’s native-image and
native-FFI docs.

Use it when you understand the general native-runtime flow but want a fast
vocabulary reference for build and FFI terminology.

See also:

- [Native Runtime Docs](/docs/runtime/native-runtime-docs)
- [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start)
- [Native Runtime Examples](/docs/runtime/native-runtime-examples)

## Terms

### `@CEntryPoint`

The GraalVM annotation used to expose Java methods as native callable entry
points inside a generated shared library.

### client handle

The numeric handle returned by FFI client-creation functions such as
`golek_client_create`, used by later calls to refer back to the same runtime
client instance.

### C API

The exported native-callable function surface presented to C or C-compatible
host applications through the shared-library path.

### FFI

Foreign Function Interface. In this docs cluster, it means using Gollek through
native callable functions rather than through a JVM-hosted Java process alone.

### GraalVM

The JDK/toolchain used here for Gollek native builds, including the
`native-image` tool.

### native executable

A compiled standalone program produced through the GraalVM native-image path,
used when Gollek itself is the deployed process.

### native image

The GraalVM-compiled binary form of a Java application or library. Depending on
flags, this can be a standalone executable or a shared library.

### `native-image`

The GraalVM tool used to build native executables or shared libraries from
Java bytecode and configuration metadata.

### shared library

A `.so`, `.dylib`, or `.dll` produced by the FFI path, used when another host
runtime wants to call Gollek through a C ABI.

### `golek_string_free`

The companion C API function used to release strings returned from the FFI
surface.

### shared-library path

The native-runtime path where Gollek is packaged as a loadable library instead
of a standalone executable.

## Suggested Companions

After this glossary, the most useful follow-ups are:

- [Native Runtime Docs](/docs/runtime/native-runtime-docs)
- [Native Runtime Examples](/docs/runtime/native-runtime-examples)
- [Native Compilation Guide](/docs/runtime/native-compilation)
- [Native FFI Reference](/docs/runtime/native-ffi)
- [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start)
