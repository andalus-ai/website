---
layout: default
title: Enhanced Runner Plugin System v2.0
nav_order: 4
---

# Enhanced Runner Plugin System v2.0

Comprehensive model format support with enhanced runner plugin system (v2.0), featuring type-safe operations, lifecycle management, ClassLoader isolation, and full engine integration.

---

## Overview

The runner plugin system has been enhanced to v2.0 with production-ready features for model format support:

- **Type-Safe Operations** - Generic `RunnerResult<T>` with compile-time safety
- **Lifecycle Management** - Comprehensive validate/initialize/health/shutdown
- **Model Management** - Explicit load/unload with `ModelHandle`
- **Multiple Request Types** - INFER, EMBED, RERANK, CLASSIFY, TOKENIZE
- **Format Detection** - Auto-detect GGUF, ONNX, Safetensors, TensorRT, etc.
- **Error Handling** - Specific exception hierarchy (unchecked)
- **ClassLoader Isolation** - Prevent conflicts between runners
- **Hot-Reload Support** - Update runners without restart
- **CDI Integration** - Automatic injection via producers

---

## What's New in v2.0

### Comparison: v1.0 vs v2.0

| Feature | v1.0 | v2.0 |
|---------|------|------|
| **Type Safety** | Map-based | ✅ Generic RunnerResult<T> |
| **Lifecycle** | Basic | ✅ validate/initialize/health/shutdown |
| **Operations** | infer/stream/embed | ✅ Unified execute() with RequestType |
| **Model Mgmt** | createSession | ✅ loadModel/unloadModel with ModelHandle |
| **Async** | Uni/Multi only | ✅ CompletionStage support |
| **Validation** | None | ✅ Pre-initialization validation |
| **Error Handling** | Generic | ✅ Specific unchecked exceptions |
| **ClassLoader** | None | ✅ Isolation per runner |
| **Hot-Reload** | Limited | ✅ Full support |
| **CDI Integration** | Manual | ✅ Automatic producers |

---

## Supported Model Formats

| Runner | Format | Extensions | Backend | GPU Support |
|--------|--------|-----------|---------|-------------|
| **GGUF** | GGUF | .gguf | llama.cpp | ✅ CUDA/Metal |
| **ONNX** | ONNX | .onnx | ONNX Runtime | ✅ CUDA/DirectML |
| **Safetensors** | Safetensors | .safetensors | Custom | ✅ CUDA/MPS |
| **TensorRT** | TensorRT | .engine, .plan | TensorRT | ✅ NVIDIA |
| **LibTorch** | PyTorch | .pt, .pth, .bin | LibTorch | ✅ CUDA |
| **TFLite** | TensorFlow Lite | .litertlm, .tfl | TFLite | ✅ GPU delegate |

---

## Enhanced SPI Interface

### RunnerPlugin Interface

```java
public interface RunnerPlugin {
    // Identity
    String id();
    String name();
    String version();
    String format();
    String description();
    
    // Lifecycle
    RunnerValidationResult validate();
    void initialize(RunnerContext context) throws RunnerException;
    boolean isAvailable();
    boolean isHealthy();
    RunnerHealth health();
    void shutdown();
    
    // Model Support
    Set<String> supportedFormats();
    Set<String> supportedArchitectures();
    boolean supportsModel(String modelPath);
    int priority();
    
    // Operations (Typed)
    <T> RunnerResult<T> execute(
        RunnerRequest request,
        RunnerContext context) throws RunnerException;
    
    // Async Support
    <T> CompletionStage<RunnerResult<T>> executeAsync(
        RunnerRequest request,
        RunnerContext context);
    
    // Model Management
    ModelHandle loadModel(
        ModelLoadRequest request,
        RunnerContext context) throws RunnerException;
    void unloadModel(
        ModelHandle modelHandle,
        RunnerContext context) throws RunnerException;
    
    // Capabilities
    Map<String, Object> metadata();
    RunnerConfig getConfig();
    Set<RequestType> supportedRequestTypes();
}
```

### RequestType Enum

```java
public enum RequestType {
    INFER,      // Text generation, chat, completion
    EMBED,      // Vector embeddings
    RERANK,     // Document reranking
    CLASSIFY,   // Text classification
    TOKENIZE,   // Text to tokens
    DETOKENIZE  // Tokens to text
}
```

---

## Type-Safe Operations

### RunnerRequest

```java
// Create inference request
RunnerRequest request = RunnerRequest.builder()
    .type(RequestType.INFER)
    .inferenceRequest(inferenceRequest)
    .parameter("temperature", 0.7)
    .parameter("max_tokens", 512)
    .metadata("trace_id", "abc123")
    .build();

// Access parameters
Optional<Double> temp = request.getParameter("temperature", Double.class);
Optional<String> traceId = request.getMetadataValue("trace_id");
```

### RunnerContext

```java
// Create context
RunnerContext context = RunnerContext.builder()
    .config(runnerConfig)
    .parameter("batch_size", 4)
    .metadata("user_id", "user123")
    .executionContext(execContext)
    .build();

// Access configuration
RunnerConfig config = context.getConfig();
Optional<Integer> batchSize = context.getParameter("batch_size", Integer.class);
```

### RunnerResult

```java
// Execute operation
RunnerResult<InferenceResponse> result = runner.execute(request, context);

// Access result
if (result.isSuccess()) {
    InferenceResponse response = result.getData();
    System.out.println("Generated: " + response.getContent());
    System.out.println("Duration: " + result.getDuration().toMillis() + "ms");
} else {
    System.err.println("Failed: " + result.getErrorMessage().orElse("Unknown"));
}

// Access metadata
Map<String, Object> metadata = result.getMetadata();
```

---

## Model Management

### ModelLoadRequest

```java
// Create load request
ModelLoadRequest loadRequest = ModelLoadRequest.builder()
    .modelPath("/models/llama-3-8b.gguf")
    .format("gguf")  // Optional, auto-detected
    .config(RunnerConfig.builder()
        .contextSize(4096)
        .nGpuLayers(-1)  // All layers on GPU
        .threads(4)
        .build())
    .build();
```

### ModelHandle

```java
// Load model
ModelHandle model = runner.loadModel(loadRequest, context);

// Access model info
System.out.println("Model ID: " + model.getModelId());
System.out.println("Format: " + model.getFormat());
System.out.println("Loaded at: " + new Date(model.getLoadedAt()));

// Unload model
runner.unloadModel(model, context);
```

---

## Configuration

### RunnerConfig

```java
RunnerConfig config = RunnerConfig.builder()
    .contextSize(4096)        // Context length
    .threads(4)               // CPU threads
    .nGpuLayers(-1)           // -1 = all layers on GPU
    .batchSize(1)             // Batch size
    .threadsBatch(1)          // Batch processing threads
    .flashAttention(true)     // Enable flash attention
    .memoryLimit(8192)        // 8GB memory limit
    .build();

// Validate
if (!config.isValid()) {
    throw new IllegalArgumentException("Invalid configuration");
}
```

### Complete Configuration Example

```yaml
gollek:
  runners:
    gguf-runner:
      enabled: true
      context-size: 4096
      threads: 4
      n-gpu-layers: -1
      batch-size: 1
      flash-attention: true
      memory-limit: 8192
    
    onnx-runner:
      enabled: true
      execution-provider: cuda
      intra-op-threads: 4
      inter-op-threads: 2
    
    safetensor-runner:
      enabled: false
```

---

## Exception Handling

### Exception Hierarchy

```
RunnerException (unchecked, extends RuntimeException)
├── RunnerInitializationException
├── RunnerExecutionException
├── RunnerNotFoundException
├── ModelLoadException
└── UnknownRequestException
```

### Usage Example

```java
try {
    RunnerResult<InferenceResponse> result = runner.execute(request, context);
} catch (RunnerNotFoundException e) {
    // No runner for format
    LOG.errorf("No runner for: %s", e.getFormat());
} catch (ModelLoadException e) {
    // Model loading failed
    LOG.errorf("Load failed: %s", e.getModelPath(), e);
} catch (UnknownRequestException e) {
    // Unsupported request type
    LOG.errorf("Unknown type: %s", e.getRequestType());
} catch (RunnerExecutionException e) {
    // Execution failed
    LOG.errorf("Exec failed: %s", e.getMessage(), e);
}
```

---

## Engine Integration

### CDI Integration

```java
@ApplicationScoped
public class InferenceService {
    
    @Inject
    RunnerPluginManager runnerManager;
    
    @Inject
    RunnerPluginIntegration runnerIntegration;
    
    public void loadModel(String path) {
        ModelLoadRequest request = ModelLoadRequest.builder()
            .modelPath(path)
            .format(RunnerPlugin.detectFormat(path))
            .config(getConfig())
            .build();
        
        ModelHandle model = runnerManager.loadModel(
            request, RunnerContext.empty());
    }
    
    public InferenceResponse infer(InferenceRequest request) {
        RunnerRequest runnerRequest = RunnerRequest.builder()
            .type(RequestType.INFER)
            .inferenceRequest(request)
            .build();
        
        RunnerResult<InferenceResponse> result = runnerManager.execute(
            runnerRequest, RunnerContext.empty());
        
        return result.getData();
    }
}
```

### PluginSystemIntegrator

```java
@ApplicationScoped
public class PluginSystemIntegrator {
    
    @Inject
    RunnerPluginProducer runnerPluginProducer;
    
    private void initializeRunnerPlugins() {
        // Initialize via producer
        runnerPluginProducer.initialize();
        
        RunnerPluginManager manager = 
            runnerPluginProducer.getRunnerManager();
        
        // Log details
        LOG.infof("Total runners: %d", manager.getAllRunners().size());
        LOG.infof("Available: %d", manager.getAvailableRunners().size());
    }
}
```

---

## Creating Custom Runners

### Example: Custom GGUF Runner

```java
public class GGUFRunnerPlugin implements RunnerPlugin {
    
    public static final String ID = "gguf-runner";
    
    @Override
    public String id() { return ID; }
    
    @Override
    public String name() { return "GGUF Runner"; }
    
    @Override
    public String format() { return "gguf"; }
    
    @Override
    public Set<String> supportedFormats() {
        return Set.of(".gguf");
    }
    
    @Override
    public Set<String> supportedArchitectures() {
        return Set.of("llama", "mistral", "gemma", "qwen");
    }
    
    @Override
    public RunnerValidationResult validate() {
        if (!isLlamaCppAvailable()) {
            return RunnerValidationResult.invalid(
                "llama.cpp not available");
        }
        return RunnerValidationResult.valid();
    }
    
    @Override
    public void initialize(RunnerContext context) 
            throws RunnerException {
        initializeLlamaCpp(context.getConfig());
    }
    
    @Override
    public <T> RunnerResult<T> execute(
            RunnerRequest request,
            RunnerContext context) throws RunnerException {
        
        return switch (request.getType()) {
            case INFER -> executeInference(request, context);
            case EMBED -> executeEmbedding(request, context);
            default -> throw new UnknownRequestException(
                request.getType());
        };
    }
    
    @Override
    public ModelHandle loadModel(
            ModelLoadRequest request,
            RunnerContext context) throws RunnerException {
        
        return loadLlamaModel(
            request.getModelPath(),
            request.getConfig());
    }
    
    @SuppressWarnings("unchecked")
    private <T> RunnerResult<T> executeInference(
            RunnerRequest request,
            RunnerContext context) {
        
        InferenceRequest infRequest = request.getInferenceRequest()
            .orElseThrow(() -> new RunnerExecutionException(
                "Missing inference request"));
        
        // Execute inference
        InferenceResponse response = llamaInfer(infRequest);
        
        return (RunnerResult<T>) RunnerResult.success(response);
    }
}
```

### Service Provider Configuration

Create `src/main/resources/META-INF/services/tech.kayys.gollek.plugin.runner.RunnerPlugin`:

```
tech.kayys.GGUFRunnerPlugin
```

### JAR Manifest

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-jar-plugin</artifactId>
            <configuration>
                <archive>
                    <manifestEntries>
                        <Plugin-Id>gguf-runner</Plugin-Id>
                        <Plugin-Type>runner</Plugin-Type>
                        <Plugin-Version>${project.version}</Plugin-Version>
                        <Format>gguf</Format>
                        <Plugin-Class>tech.kayys.GGUFRunnerPlugin</Plugin-Class>
                    </manifestEntries>
                </archive>
            </configuration>
        </plugin>
    </plugins>
</build>
```

---

## Usage Examples

### Example 1: Basic Model Loading

```java
@Inject
RunnerPluginManager runnerManager;

public void loadModel() {
    ModelLoadRequest request = ModelLoadRequest.builder()
        .modelPath("/models/llama-3-8b.gguf")
        .config(RunnerConfig.builder()
            .nGpuLayers(-1)
            .contextSize(4096)
            .build())
        .build();
    
    ModelHandle model = runnerManager.loadModel(
        request, RunnerContext.empty());
    
    System.out.println("Loaded: " + model.getModelId());
}
```

### Example 2: Inference Execution

```java
@Inject
RunnerPluginManager runnerManager;

public InferenceResponse generate(String prompt) {
    InferenceRequest request = InferenceRequest.builder()
        .prompt(prompt)
        .maxTokens(512)
        .build();
    
    RunnerRequest runnerRequest = RunnerRequest.builder()
        .type(RequestType.INFER)
        .inferenceRequest(request)
        .build();
    
    RunnerResult<InferenceResponse> result = runnerManager.execute(
        runnerRequest, RunnerContext.empty());
    
    return result.getData();
}
```

### Example 3: Embedding Generation

```java
@Inject
RunnerPluginManager runnerManager;

public float[] generateEmbedding(String text) {
    EmbeddingRequest request = EmbeddingRequest.builder()
        .input(text)
        .build();
    
    RunnerRequest runnerRequest = RunnerRequest.builder()
        .type(RequestType.EMBED)
        .embeddingRequest(request)
        .build();
    
    RunnerResult<EmbeddingResponse> result = runnerManager.execute(
        runnerRequest, RunnerContext.empty());
    
    return result.getData().getEmbedding();
}
```

### Example 4: Format Detection

```java
String modelPath = "/models/llama-3-8b.gguf";

// Auto-detect format
String format = RunnerPlugin.detectFormat(modelPath);
System.out.println("Format: " + format);  // "gguf"

// Find appropriate runner
Optional<RunnerPlugin> runner = runnerManager.findRunnerForFormat(format);
if (runner.isPresent()) {
    System.out.println("Found runner: " + runner.get().name());
}
```

---

## Observability

### Metrics

```java
@Inject
RunnerPluginManager runnerManager;

public void logMetrics() {
    RunnerMetrics metrics = runnerManager.getMetrics();
    
    System.out.println("Uptime: " + metrics.getUptime() + "ms");
    System.out.println("Total Operations: " + 
        metrics.getCounter("total_operations"));
    System.out.println("Total Errors: " + 
        metrics.getCounter("total_errors"));
    
    // Per-operation stats
    OperationStats inferStats = metrics.getOperationStats("infer");
    System.out.printf("Infer: count=%d, avg=%.2fms, success=%.2f%%\n",
        inferStats.getCount(),
        inferStats.getAverageDuration(),
        inferStats.getSuccessRate() * 100);
}
```

### Health Monitoring

```java
@Inject
RunnerPluginManager runnerManager;

public void checkHealth() {
    Map<String, RunnerHealth> health = runnerManager.getHealthStatus();
    health.forEach((runner, h) -> {
        if (h.isHealthy()) {
            System.out.println(runner + ": ✓ " + h.getMessage());
        } else {
            System.out.println(runner + ": ✗ " + h.getMessage());
        }
    });
}
```

---

## Performance

### Operation Latency (Llama-3-8B, A100)

| Operation | v1.0 | v2.0 | Overhead |
|-----------|------|------|----------|
| Model Load | 2.5s | 2.5s | None |
| Inference (512 tokens) | 1.2s | 1.2s | None |
| Embedding | 50ms | 50ms | None |
| ClassLoader Load | N/A | +5-10ms | One-time |

### Memory Usage

| Component | v1.0 | v2.0 | Change |
|-----------|------|------|--------|
| Base Runner | 500 MB | 505 MB | +1% |
| Per-Runner | 500 MB | 505 MB | +1% |
| With Isolation | N/A | +5MB/runner | Isolation benefit |

---

## Troubleshooting

### Runner Not Found

**Symptom**: `RunnerNotFoundException`

**Solutions**:
1. Check runner plugin deployed
2. Verify format detection: `RunnerPlugin.detectFormat(path)`
3. Check logs for loading errors

### Model Load Failed

**Symptom**: `ModelLoadException`

**Solutions**:
1. Verify model file exists
2. Check model format compatibility
3. Verify sufficient memory
4. Review runner validation errors

### ClassLoader Issues

**Symptom**: `ClassNotFoundException`

**Solutions**:
1. Ensure dependencies in runner JAR
2. Check parent-first package config
3. Verify no conflicting library versions

---

## Resources

- **Implementation Plan**: [Enhanced Runner Plugin Plan](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/core/gollek-plugin-runner-core/ENHANCED_RUNNER_PLUGIN_PLAN.md)
- **Summary**: [Enhancement Summary](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/core/gollek-plugin-runner-core/RUNNER_PLUGIN_ENHANCEMENT_SUMMARY.md)
- **Original Docs**: [Runner Plugin Summary](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/core/gollek-plugin-runner-core/RUNNER_PLUGIN_SUMMARY.md)
- **Enhanced Kernel Plugins**: [Kernel Plugin v2.0](/docs/plugins/enhanced-plugin-architecture)
- **GPU Runtime Docs**: [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs)

---

[Back to Plugin Architecture](/docs/plugins/plugin-architecture) &nbsp; [Enhanced Plugin System](/docs/plugins/enhanced-plugin-architecture) &nbsp; [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs)
