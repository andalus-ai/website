---
layout: default
title: Native Runtime Quick Start
parent: Advanced Tutorials
nav_order: 37
---

# Native Runtime Quick Start

This tutorial walks through the two shortest useful native-runtime paths:

1. build one native executable
2. build one shared library for the FFI boundary

See also:

- [Native Runtime Docs](/docs/runtime/native-runtime-docs)
- [Native Compilation Guide](/docs/runtime/native-compilation)
- [Native FFI Reference](/docs/runtime/native-ffi)
- [Native Runtime Glossary](/docs/runtime/native-runtime-glossary)
- [Native Runtime Examples](/docs/runtime/native-runtime-examples)

## Pick Your Goal

Use the native executable path when Gollek itself is the deployed program.

Use the shared-library path when another host process wants to call Gollek
through a C ABI.

## Path A: Build One Native Executable

Start with the CLI-native build path:

```bash
cd inference-gollek/ui/gollek-cli
mvn clean package -Pnative -DskipTests
```

What to expect:

- GraalVM and `native-image` must already be installed
- the output is a native executable under `target/`

The important first verification step is simply:

- the build finishes successfully
- the `target/` directory contains the native runner artifact

If this path is what you need, the main follow-up page is:

- [Native Compilation Guide](/docs/runtime/native-compilation)

## Path B: Build One Shared Library

Start with the Java-local SDK classes used in the FFI reference:

```bash
mvn -f inference-gollek/sdk/gollek-sdk-java-local/pom.xml -DskipTests package
```

Then generate the shared library:

```bash
native-image \
  -cp inference-gollek/sdk/gollek-sdk-java-local/target/classes \
  --shared \
  -H:Name=gollek_sdk_local \
  -H:Class=tech.kayys.gollek.sdk.local.nativeinterop.GollekNativeEntrypoints
```

What to expect:

- Linux/macOS output:
  `libgollek_sdk_local.so` or `libgollek_sdk_local.dylib`
- Windows output:
  `gollek_sdk_local.dll`

The important first verification step is simply:

- the shared library file exists
- the native-image command completed successfully

If this path is what you need, the main follow-up page is:

- [Native FFI Reference](/docs/runtime/native-ffi)

## Minimal Sanity Checks

For the executable path:

- GraalVM is installed
- `native-image --version` works
- the native build produces an artifact in `target/`

For the shared-library path:

- the Java classes build successfully
- `native-image --shared` succeeds
- the expected `.so`, `.dylib`, or `.dll` exists

## Fast Decision Rule

- choose executable:
  when deployment owns the full Gollek process
- choose shared library:
  when another runtime owns the process and Gollek is a callable component

## Related Docs

- [Native Runtime Docs](/docs/runtime/native-runtime-docs)
- [Native Compilation Guide](/docs/runtime/native-compilation)
- [Native FFI Reference](/docs/runtime/native-ffi)
- [Native Runtime Glossary](/docs/runtime/native-runtime-glossary)
- [Native Runtime Examples](/docs/runtime/native-runtime-examples)
