---
layout: default
title: Core API Reference
---

# Core API Reference

Complete reference for the Gollek SDK Java API.

---

## GollekLocalClient Interface

The `GollekLocalClient` is the main entry point for all SDK operations.

### Interface Definition

```java
public interface GollekLocalClient {
    // ==================== Standard Inference ====================
    InferenceResponse createCompletion(InferenceRequest request);
    CompletableFuture<InferenceResponse> createCompletionAsync(InferenceRequest request);
    Multi<StreamingInferenceChunk> streamCompletion(InferenceRequest request);

    // Async job management
    String submitAsyncJob(InferenceRequest request);
    AsyncJobStatus getJobStatus(String jobId);
    AsyncJobStatus waitForJob(String jobId, Duration maxWaitTime, Duration pollInterval);

    // Batch inference
    List<InferenceResponse> batchInference(BatchInferenceRequest batchRequest);

    // ==================== Multimodal Inference ====================
    MultimodalResponse multimodalInference(MultimodalRequest request);
    Multi<MultimodalResponse> multimodalInferenceStream(MultimodalRequest request);
    
    // Convenience methods
    MultimodalResponse visionQA(String model, byte[] imageBytes, String question);
    MultimodalResponse imageCaptioning(String model, byte[] imageBytes);
    float[] imageEmbedding(String model, byte[] imageBytes);

    // Provider management
    List<ProviderInfo> listAvailableProviders();
    ProviderInfo getProviderInfo(String providerId);
    void setPreferredProvider(String providerId);
    Optional<String> getPreferredProvider();

    // Model Preparation & Resolution
    ModelResolution prepareModel(String modelId, Consumer<PullProgress> progressCallback);
    Optional<String> autoSelectProvider(String modelId);
    Optional<String> resolveDefaultModel();

    // Advanced Operations
    List<GollekPlugin.PluginMetadata> listPlugins();
    Map<String, Object> getMetrics(String providerId, String modelId);
    Optional<ModelRegistry.ModelStats> getModelStats(String modelId);
    ModelManifest registerModel(ModelRegistry.ModelUploadRequest request);

    // MCP Registry
    McpRegistryManager mcpRegistry();
}
```
    McpRegistryManager mcpRegistry();
}
```

---

## Completion APIs

### createCompletion

Synchronous inference request. Blocks until the response is complete.

```java
InferenceResponse createCompletion(InferenceRequest request)
```

**Parameters:**
- `request` - InferenceRequest with model, prompt, and parameters

**Returns:**
- InferenceResponse with generated content

**Throws:**
- GollekLocalClientException - If inference fails

**Example:**
```java
InferenceRequest request = InferenceRequest.builder()
    .model("llama-3.2-3b-instruct")
    .prompt("What is the capital of France?")
    .maxTokens(100)
    .build();

InferenceResponse response = client.createCompletion(request);
System.out.println("Answer: " + response.getContent());
```

---

### createCompletionAsync

Asynchronous inference request. Returns a CompletableFuture.

```java
CompletableFuture<InferenceResponse> createCompletionAsync(InferenceRequest request)
```

**Parameters:**
- `request` - InferenceRequest with model, prompt, and parameters

**Returns:**
- CompletableFuture<InferenceResponse>

**Example:**
```java
CompletableFuture<InferenceResponse> future = 
    client.createCompletionAsync(request);

future.thenAccept(response -> 
    System.out.println("Answer: " + response.getContent())
).exceptionally(ex -> {
    System.err.println("Error: " + ex.getMessage());
    return null;
});
```

---

### streamCompletion

Streaming inference with real-time token delivery.

```java
Multi<StreamingInferenceChunk> streamCompletion(InferenceRequest request)
```

**Parameters:**
- `request` - InferenceRequest with model, prompt, and parameters

**Returns:**
- Multi<InferenceChunk> - Reactive stream of tokens

**Example:**
```java
client.streamCompletion(request)
    .onItem().invoke(chunk -> {
        System.out.print(chunk.getToken());
        if (chunk.isComplete()) {
            System.out.println("\nGeneration complete!");
        }
    })
    .subscribe().with(
        chunk -> {}, // onItem
        Throwable::printStackTrace, // onFailure
        () -> System.out.println("Stream completed") // onCompletion
    );
```

**InferenceChunk Fields:**
| Field | Type | Description |
|-------|------|-------------|
| requestId | String | Unique request ID |
| sequenceNumber | long | Token sequence number |
| token | String | Generated token text |
| isComplete | boolean | True if last token |
| timestamp | Instant | Token generation time |

---

## Async Job Management

### submitAsyncJob

Submit an inference job for background processing.

```java
String submitAsyncJob(InferenceRequest request)
```

**Returns:**
- String - Job ID for status tracking

**Example:**
```java
String jobId = client.submitAsyncJob(request);
System.out.println("Job submitted: " + jobId);
```

---

### getJobStatus

Check the status of an async job.

```java
AsyncJobStatus getJobStatus(String jobId)
```

**Returns:**
- AsyncJobStatus with job state and result (if complete)

**AsyncJobStatus Fields:**
| Field | Type | Description |
|-------|------|-------------|
| jobId | String | Job identifier |
| status | String | PENDING, RUNNING, COMPLETED, FAILED |
| result | InferenceResponse | Result (if completed) |
| error | String | Error message (if failed) |
| createdAt | Instant | Job creation time |
| completedAt | Instant | Job completion time |

**Example:**
```java
AsyncJobStatus status = client.getJobStatus(jobId);
if (status.isComplete()) {
    System.out.println("Result: " + status.getResult().getContent());
} else {
    System.out.println("Status: " + status.getStatus());
}
```

---

### waitForJob

Block until job completes or timeout.

```java
AsyncJobStatus waitForJob(
    String jobId, 
    Duration maxWaitTime, 
    Duration pollInterval
)
```

**Parameters:**
- `jobId` - Job identifier
- `maxWaitTime` - Maximum time to wait
- `pollInterval` - Status check interval

**Example:**
```java
AsyncJobStatus status = client.waitForJob(
    jobId, 
    Duration.ofMinutes(5), 
    Duration.ofSeconds(1)
);
```

---

## Batch Inference

### batchInference

Process multiple inference requests in one call.

```java
List<InferenceResponse> batchInference(BatchInferenceRequest batchRequest)
```

**Example:**
```java
List<InferenceRequest> requests = List.of(
    InferenceRequest.builder()
        .model("llama-3.2-3b-instruct")
        .prompt("Translate to French: Hello")
        .build(),
    InferenceRequest.builder()
        .model("llama-3.2-3b-instruct")
        .prompt("Translate to Spanish: Hello")
        .build()
);

BatchInferenceRequest batch = new BatchInferenceRequest(requests);
List<InferenceResponse> responses = client.batchInference(batch);

for (int i = 0; i < responses.size(); i++) {
    System.out.println("Response " + i + ": " + 
        responses.get(i).getContent());
}
```

---

## Provider Management

### listAvailableProviders

List all registered inference providers.

```java
List<ProviderInfo> listAvailableProviders()
```

**ProviderInfo Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | String | Provider identifier |
| name | String | Human-readable name |
| version | String | Provider version |
| description | String | Provider description |
| vendor | String | Provider vendor |
| healthStatus | Status | HEALTHY, UNHEALTHY, UNKNOWN |
| capabilities | Set | Supported capabilities |
| supportedModels | Set | Available models |
| metadata | Map | Additional metadata |

**Example:**
```java
List<ProviderInfo> providers = client.listAvailableProviders();
for (ProviderInfo provider : providers) {
    System.out.printf("%s - %s (Status: %s)%n",
        provider.getId(),
        provider.getName(),
        provider.getHealthStatus());
}
```

---

### getProviderInfo

Get detailed information about a specific provider.

```java
ProviderInfo getProviderInfo(String providerId)
```

**Example:**
```java
ProviderInfo ollama = client.getProviderInfo("ollama");
System.out.println("Ollama version: " + ollama.getVersion());
```

---

### setPreferredProvider

Set default provider for inference requests.

```java
void setPreferredProvider(String providerId)
```

**Example:**
```java
client.setPreferredProvider("ollama");
// Subsequent requests use Ollama by default
```

---

### getPreferredProvider

Get the currently set preferred provider.

```java
Optional<String> getPreferredProvider()
```

---

## Model Management

### listModels

List all available models.

```java
List<ModelInfo> listModels()
List<ModelInfo> listModels(int offset, int limit)
```

**ModelInfo Fields:**
| Field | Type | Description |
|-------|------|-------------|
| modelId | String | Model identifier |
| name | String | Model name |
| version | String | Model version |
| format | String | Model format (GGUF, ONNX, etc.) |
| sizeBytes | Long | Model size in bytes |
| quantization | String | Quantization type |
| createdAt | Instant | Creation timestamp |
| updatedAt | Instant | Last update timestamp |
| metadata | Map | Additional metadata |

**Example:**
```java
List<ModelInfo> models = client.listModels(0, 10);
for (ModelInfo model : models) {
    System.out.printf("%s - %s (%s)%n",
        model.getModelId(),
        model.getName(),
        model.getFormat());
}
```

---

### getModelInfo

Get detailed information about a specific model.

```java
Optional<ModelInfo> getModelInfo(String modelId)
```

---

### deleteModel

Delete a model from the local repository.

```java
void deleteModel(String modelId)
```

---

### pullModel

Pull a model from a remote source.

```java
void pullModel(String modelSpec, Consumer<PullProgress> progressCallback)
```

**Note:** In the local SDK, this operation may be unsupported. Use runtime/API model management instead.

**PullProgress Fields:**
| Field | Type | Description |
|-------|------|-------------|
| status | String | Download status |
| digest | String | Content digest |
| total | Long | Total bytes |
| completed | Long | Completed bytes |
| percentComplete | double | Percentage complete |

---

---

## Model Preparation & Resolution

### prepareModel

Centralized logic to ensure a model is ready for inference. This method handles local resolution, pulling from remote if missing, and verifying the download.

```java
ModelResolution prepareModel(String modelId, Consumer<PullProgress> progressCallback)
```

**Returns:**
- `ModelResolution` - Object containing final `modelId` and `localPath`.

**Example:**
```java
ModelResolution resolution = client.prepareModel("llama-3.2-3b", progress -> {
    System.out.printf("\rDownloading: %.2f%%", progress.getPercentComplete());
});
System.out.println("Model ready at: " + resolution.getLocalPath());
```

---

### autoSelectProvider

Automatically determine the best inference provider based on the model format (GGUF, ONNX, etc.).

```java
Optional<String> autoSelectProvider(String modelId)
```

---

### resolveDefaultModel

Resolve the system's default model ID if none is specified by the user.

```java
Optional<String> resolveDefaultModel()
```

---

## Advanced Operations

### listPlugins

List all installed engine plugins and their metadata.

```java
List<GollekPlugin.PluginMetadata> listPlugins()
```

---

### getMetrics

Retrieve real-time performance metrics for a specific provider/model combination.

```java
Map<String, Object> getMetrics(String providerId, String modelId)
```

**Metrics Keys:**
- `p95LatencyMs` - 95th percentile latency in milliseconds
- `errorRate` - Recent failure percentage
- `circuitBreakerOpen` - Boolean indicating if the provider is currently throttled

---

### getModelStats

Get detailed usage and version statistics for a model.

```java
Optional<ModelRegistry.ModelStats> getModelStats(String modelId)
```

---

### registerModel

Programmatically register a custom model into the local registry.

```java
ModelManifest registerModel(ModelRegistry.ModelUploadRequest request)
```

---

## MCP Registry

### mcpRegistry

Access the Model Context Protocol registry for tool integration.

```java
McpRegistryManager mcpRegistry()
```

**Example:**
```java
McpRegistryManager registry = client.mcpRegistry();
// Register or query MCP tools
```

---

## Error Handling

All SDK operations throw `GollekLocalClientException` on failure:

```java
try {
    InferenceResponse response = client.createCompletion(request);
} catch (GollekLocalClientException e) {
    System.err.println("Inference failed: " + e.getMessage());
    System.err.println("Cause: " + e.getCause());
}
```

---

[Back to Getting Started](/docs/) &nbsp; [Native FFI Reference](/docs/runtime/native-ffi)
