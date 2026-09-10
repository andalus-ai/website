---
layout: default
title: Native Runtime Examples
---

# Native Runtime Examples

This page shows abbreviated example shapes for the main Gollek native-runtime
artifacts and the minimal FFI call flow.

Use it when you want to recognize the expected output files and the smallest C
API interaction pattern before wiring them into your own build or host process.

See also:

- [Native Runtime Docs](/docs/runtime/native-runtime-docs)
- [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start)
- [Native Runtime Glossary](/docs/runtime/native-runtime-glossary)

## Native Executable Output

Example:

```text
inference-gollek/ui/gollek-cli/target/
└── gollek-cli-<version>-runner
```

What to notice:

- the native executable path is an output artifact, not a shared library
- this is the shape to expect when Gollek itself is the deployed process

## Shared Library Output

Example:

```text
libgollek_sdk_local.so
libgollek_sdk_local.dylib
gollek_sdk_local.dll
```

What to notice:

- the exact extension depends on the platform
- this is the shape to expect when another host process loads Gollek as a
  library instead of launching it as a standalone executable

## Minimal C Call Flow

Abbreviated example:

```c
long client = golek_client_create();

char* response = golek_create_completion_json(
    client,
    "{\"model\":\"llama-3.2-3b-instruct\",\"prompt\":\"Hello\",\"maxTokens\":32}"
);

printf("%s\n", response);
golek_string_free(response);
golek_client_destroy(client);
```

What to notice:

- create a client handle first
- call one JSON-based inference entrypoint
- free returned strings with `golek_string_free`
- destroy the client handle when finished

## Minimal Error Path

Abbreviated example:

```c
char* response = golek_create_completion_json(client, requestJson);
if (response == NULL) {
    char* error = golek_last_error();
    fprintf(stderr, "Error: %s\n", error);
    golek_string_free(error);
}
```

What to notice:

- FFI calls can return `NULL` on failure
- the error message is retrieved separately
- error strings also need `golek_string_free`

## Suggested Companions

After this page, the most useful follow-ups are:

- [Native Runtime Docs](/docs/runtime/native-runtime-docs)
- [Native Runtime Glossary](/docs/runtime/native-runtime-glossary)
- [Native Compilation Guide](/docs/runtime/native-compilation)
- [Native FFI Reference](/docs/runtime/native-ffi)
- [Native Runtime Quick Start](/docs/tutorials/advanced/native-runtime-quick-start)
