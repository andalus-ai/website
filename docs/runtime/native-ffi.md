---
layout: default
title: Native FFI Reference
---

# Native FFI Reference

For the guided landing page that groups native-image builds and shared-library
FFI entrypoints in one place, start with
[Native Runtime Docs](/docs/runtime/native-runtime-docs).

GraalVM native image integration with C function entrypoints for embedded systems and high-performance applications.

---

## Overview

Gollek SDK provides GraalVM native image support with C function entrypoints (`@CEntryPoint`), enabling:

- **Direct C/C++ integration** - Call Gollek SDK from native applications
- **Reduced memory footprint** - Native images have smaller memory requirements
- **Faster startup** - No JVM warmup, instant execution
- **Embedded deployment** - Run on resource-constrained devices

---

## Building Native Library

### Prerequisites

- **GraalVM 24.1+** with Native Image support
- **Maven 3.8+**
- **C compiler** (gcc, clang, or MSVC)

### Build Commands

```bash
# Build the JAR
mvn -f inference-gollek/sdk/gollek-sdk-java-local/pom.xml -DskipTests package

# Generate native shared library
native-image \
  -cp inference-gollek/sdk/gollek-sdk-java-local/target/classes \
  --shared \
  -H:Name=gollek_sdk_local \
  -H:Class=tech.kayys.gollek.sdk.local.nativeinterop.GollekNativeEntrypoints
```

### Output

- **Linux/macOS**: `libgollek_sdk_local.so` / `libgollek_sdk_local.dylib`
- **Windows**: `gollek_sdk_local.dll`

---

## C API Reference

### Client Lifecycle

#### golek_client_create

Create a new SDK client instance.

```c
long golek_client_create();
```

**Returns:**
- Client handle (positive integer) on success
- 0 on failure

**Example:**
```c
long client = golek_client_create();
if (client == 0) {
    fprintf(stderr, "Failed to create client\n");
    exit(1);
}
```

---

#### golek_client_destroy

Destroy a client instance and free resources.

```c
int golek_client_destroy(long clientHandle);
```

**Parameters:**
- `clientHandle` - Client handle from create call

**Returns:**
- 1 on success, 0 on failure

**Example:**
```c
golek_client_destroy(client);
```

---

#### golek_client_shutdown_runtime

Shutdown the entire SDK runtime.

```c
void golek_client_shutdown_runtime();
```

**Note:** This destroys all active clients. Use with caution.

---

### Error Handling

#### golek_last_error

Get the last error message.

```c
char* golek_last_error();
```

**Returns:**
- UTF-8 error message string
- Must be freed with `golek_string_free`

**Example:**
```c
char* error = golek_last_error();
if (error != NULL) {
    fprintf(stderr, "Error: %s\n", error);
    golek_string_free(error);
}
```

---

#### golek_clear_last_error

Clear the last error message.

```c
void golek_clear_last_error();
```

---

#### golek_string_free

Free any string returned by Gollek SDK functions.

```c
void golek_string_free(char* str);
```

**Important:** All returned `char*` values must be released by calling this function.

---

### Inference APIs

All inference functions accept JSON payloads and return JSON responses.

#### golek_create_completion_json

Synchronous inference request.

```c
char* golek_create_completion_json(long clientHandle, const char* requestJson);
```

**Parameters:**
- `clientHandle` - Client handle
- `requestJson` - JSON-encoded InferenceRequest

**Returns:**
- JSON-encoded InferenceResponse
- NULL on error (check `golek_last_error`)

**Example:**
```c
const char* requestJson = "{"
    "\"model\": \"llama-3.2-3b-instruct\","
    "\"prompt\": \"Hello, world!\","
    "\"maxTokens\": 100"
"}";

char* responseJson = golek_create_completion_json(client, requestJson);
if (responseJson != NULL) {
    printf("Response: %s\n", responseJson);
    golek_string_free(responseJson);
} else {
    fprintf(stderr, "Error: %s\n", golek_last_error());
}
```

---

#### golek_create_completion_async_json

Asynchronous inference request.

```c
char* golek_create_completion_async_json(long clientHandle, const char* requestJson);
```

**Returns:**
- JSON-encoded InferenceResponse (after completion)

---

#### golek_stream_completion_json

Streaming inference request.

```c
char* golek_stream_completion_json(long clientHandle, const char* requestJson);
```

**Returns:**
- JSON array of InferenceChunk objects

**InferenceChunk JSON:**
```json
{
    "requestId": "req-123",
    "sequenceNumber": 1,
    "token": "Hello",
    "isComplete": false,
    "timestamp": "2024-01-01T00:00:00Z"
}
```

---

### Async Job Management

#### golek_submit_async_job_json

Submit an async inference job.

```c
char* golek_submit_async_job_json(long clientHandle, const char* requestJson);
```

**Returns:**
```json
{
    "jobId": "job-abc-123"
}
```

---

#### golek_get_job_status_json

Get async job status.

```c
char* golek_get_job_status_json(long clientHandle, const char* jobId);
```

**Parameters:**
- `jobId` - Job ID string

**Returns:**
```json
{
    "jobId": "job-abc-123",
    "status": "COMPLETED",
    "result": { ... },
    "error": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "completedAt": "2024-01-01T00:00:05Z"
}
```

---

#### golek_wait_for_job_json

Wait for job completion.

```c
char* golek_wait_for_job_json(
    long clientHandle, 
    const char* jobId,
    long maxWaitMillis,
    long pollIntervalMillis
);
```

**Parameters:**
- `maxWaitMillis` - Maximum wait time in milliseconds
- `pollIntervalMillis` - Status check interval in milliseconds

---

### Batch Inference

#### golek_batch_inference_json

Process multiple inference requests.

```c
char* golek_batch_inference_json(long clientHandle, const char* batchRequestJson);
```

**BatchRequest JSON:**
```json
{
    "requests": [
        {
            "model": "llama-3.2-3b-instruct",
            "prompt": "First request"
        },
        {
            "model": "llama-3.2-3b-instruct",
            "prompt": "Second request"
        }
    ]
}
```

**Returns:**
- JSON array of InferenceResponse objects

---

### Provider Management

#### golek_list_available_providers_json

List all available providers.

```c
char* golek_list_available_providers_json(long clientHandle);
```

**Returns:**
- JSON array of ProviderInfo objects

---

#### golek_get_provider_info_json

Get provider details.

```c
char* golek_get_provider_info_json(long clientHandle, const char* providerId);
```

---

#### golek_set_preferred_provider

Set default provider.

```c
int golek_set_preferred_provider(long clientHandle, const char* providerId);
```

**Returns:**
- 1 on success, 0 on failure

---

#### golek_get_preferred_provider_json

Get current preferred provider.

```c
char* golek_get_preferred_provider_json(long clientHandle);
```

**Returns:**
```json
{
    "preferredProvider": "ollama"
}
```

---

### Model Management

#### golek_list_models_json

List all models.

```c
char* golek_list_models_json(long clientHandle);
```

---

#### golek_list_models_paginated_json

List models with pagination.

```c
char* golek_list_models_paginated_json(
    long clientHandle, 
    int offset, 
    int limit
);
```

---

#### golek_get_model_info_json

Get model details.

```c
char* golek_get_model_info_json(long clientHandle, const char* modelId);
```

---

#### golek_pull_model_json

Pull a model from remote source.

```c
char* golek_pull_model_json(long clientHandle, const char* modelSpec);
```

**Returns:**
- JSON array of progress events

---

#### golek_delete_model

Delete a model.

```c
int golek_delete_model(long clientHandle, const char* modelId);
```

**Returns:**
- 1 on success, 0 on failure

---

## C++ Example

```cpp
#include <iostream>
#include <string>

extern "C" {
    long golek_client_create();
    int golek_client_destroy(long clientHandle);
    char* golek_create_completion_json(long clientHandle, const char* requestJson);
    char* golek_last_error();
    void golek_string_free(char* str);
}

int main() {
    // Create client
    long client = golek_client_create();
    if (client == 0) {
        std::cerr << "Failed to create client: " 
                  << golek_last_error() << std::endl;
        return 1;
    }

    // Build request
    std::string requestJson = R"({
        "model": "llama-3.2-3b-instruct",
        "prompt": "What is 2 + 2?",
        "maxTokens": 50
    })";

    // Execute inference
    char* responseJson = golek_create_completion_json(
        client, 
        requestJson.c_str()
    );

    if (responseJson != NULL) {
        std::cout << "Response: " << responseJson << std::endl;
        golek_string_free(responseJson);
    } else {
        std::cerr << "Error: " << golek_last_error() << std::endl;
    }

    // Cleanup
    golek_client_destroy(client);
    return 0;
}
```

---

## Python Example (via ctypes)

```python
import ctypes
import json

# Load library
lib = ctypes.CDLL('./libgollek_sdk_local.so')

# Define function signatures
lib.golek_client_create.restype = ctypes.c_long
lib.golek_create_completion_json.argtypes = [ctypes.c_long, ctypes.c_char_p]
lib.golek_create_completion_json.restype = ctypes.c_char_p
lib.golek_string_free.argtypes = [ctypes.c_char_p]

# Create client
client = lib.golek_client_create()

# Build request
request = {
    "model": "llama-3.2-3b-instruct",
    "prompt": "Hello!",
    "maxTokens": 100
}
request_json = json.dumps(request).encode('utf-8')

# Execute inference
response_json = lib.golek_create_completion_json(client, request_json)

if response_json:
    response = json.loads(response_json.decode('utf-8'))
    print("Response:", response)
    lib.golek_string_free(response_json)
else:
    print("Error occurred")

# Cleanup
lib.golek_client_destroy(client)
```

---

## Memory Management

**Critical:** All string pointers returned by Gollek SDK functions must be freed:

```c
char* result = golek_create_completion_json(client, requestJson);
// Use result...
golek_string_free(result);  // MUST free
```

Failure to free strings will result in memory leaks.

---

## Error Handling Pattern

```c
char* result = golek_create_completion_json(client, requestJson);
if (result == NULL) {
    char* error = golek_last_error();
    if (error != NULL) {
        fprintf(stderr, "Error: %s\n", error);
        golek_string_free(error);
    }
    golek_clear_last_error();
    return -1;
}

// Use result...
golek_string_free(result);
return 0;
```

---

## Thread Safety

- Client handles are thread-safe for concurrent reads
- Each thread should use its own client handle for writes
- Error state is thread-local

---

## Native Image Configuration

### Custom Substitutions

For advanced use cases, create a `jni-config.json`:

```json
[
  {
    "name": "tech.kayys.gollek.sdk.local.nativeinterop.GollekNativeEntrypoints",
    "methods": [
        { "name": "golek_client_create" },
        { "name": "golek_create_completion_json" }
    ]
  }
]
```

### Build with Configuration

```bash
native-image \
  -cp target/classes \
  --shared \
  -H:Name=gollek_sdk_local \
  -H:Class=tech.kayys.gollek.sdk.local.nativeinterop.GollekNativeEntrypoints \
  --initialize-at-build-time=tech.kayys.gollek \
  -H:JNIConfigurationFiles=jni-config.json
```

---

[Back to Core API](/docs/runtime/core-api) &nbsp; [Architecture](/docs/runtime/architecture)
