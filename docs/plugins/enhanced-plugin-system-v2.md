---
layout: default
title: Enhanced Plugin System v2.0
nav_order: 1
---

# Enhanced Plugin System v2.0

Complete four-level plugin architecture with enhanced v2.0 SPI for kernel and runner plugins, featuring comprehensive lifecycle management, type-safe operations, and full engine integration.

---

## Overview

The Gollek Inference Engine has been enhanced with a comprehensive **v2.0 plugin system** that provides:

- **Type-Safe Operations** - Generic operations with compile-time safety
- **Lifecycle Management** - Comprehensive validate/initialize/health/shutdown
- **ClassLoader Isolation** - Safe plugin loading and hot-reload
- **Comprehensive Validation** - Pre-initialization checks with errors/warnings
- **Enhanced Error Handling** - Specific unchecked exceptions
- **Observability** - Metrics, health monitoring, and tracing
- **Full Engine Integration** - CDI producers and automatic injection

---

## What's New in v2.0

### Kernel Plugins (Enhanced)

| Feature | v1.0 | v2.0 |
|---------|------|------|
| **Type Safety** | Basic | ✅ Generic operations |
| **Lifecycle** | Simple | ✅ validate/initialize/health/shutdown |
| **Isolation** | None | ✅ ClassLoader per plugin |
| **Hot-Reload** | Limited | ✅ Full support |
| **Validation** | Basic | ✅ Comprehensive with errors/warnings |
| **Error Handling** | Generic | ✅ Specific exception hierarchy |
| **Metrics** | Basic | ✅ Comprehensive observability |
| **Configuration** | Map-based | ✅ Type-safe with builder |
| **CDI Integration** | Manual | ✅ Automatic producers |
| **Engine Integration** | Partial | ✅ Full integration |

### Runner Plugins (Enhanced)

| Feature | v1.0 | v2.0 |
|---------|------|------|
| **Type Safety** | Map-based | ✅ Generic RunnerResult<T> |
| **Lifecycle** | Basic | ✅ validate/initialize/health/shutdown |
| **Operations** | infer/stream | ✅ Unified execute() with RequestType |
| **Model Mgmt** | createSession | ✅ loadModel/unloadModel with ModelHandle |
| **Validation** | None | ✅ Pre-initialization validation |
| **Error Handling** | Generic | ✅ Specific unchecked exceptions |
| **Health Monitoring** | Basic | ✅ Detailed status |
| **Metadata** | Basic | ✅ Rich capability information |

---

## Plugin Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Application Layer                          │
│  InferenceRequest → Engine                              │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         Gollek Inference Engine                         │
│  - PluginSystemIntegrator                               │
│  - KernelPluginProducer (CDI)                           │
│  - RunnerPluginProducer (CDI)                           │
│  - InferenceOrchestrator                                │
│  - Metrics & Monitoring                                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│       Level 1: Runner Plugins (Enhanced v2.0)           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  GGUF    │ │  ONNX    │ │ Safetensor│ │TensorRT  │  │
│  │  v2.0    │ │  v2.0    │ │  v2.0     │ │  v2.0    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐                             │
│  │LibTorch  │ │ TFLite   │                             │
│  │v2.0+Safet│ │  v2.0    │                             │
│  └──────────┘ └──────────┘                             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│       Level 2: Feature Plugins                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │  Audio   │ │  Vision  │ │   Text   │                │
│  └──────────┘ └──────────┘ └──────────┘                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│      Level 3: Optimization Plugins                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   FA3    │ │   FA4    │ │  Paged   │ │  Prompt  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│    Level 4: Kernel Plugins (Enhanced v2.0)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  CUDA    │ │  ROCm    │ │  Metal   │ │ DirectML │  │
│  │  v2.0    │ │  v2.0    │ │  v2.0    │ │  v2.0    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Enhanced Kernel Plugins

### CUDA Kernel (v2.0)

**File**: `plugins/kernel/cuda/gollek-plugin-kernel-cuda/.../CudaKernelPlugin.java`

**Features**:
- ✅ Comprehensive validation (CUDA availability, device check, compute capability)
- ✅ Lifecycle management with detailed logging
- ✅ Type-safe operations (GEMM, FlashAttention, normalization, etc.)
- ✅ Health monitoring with device details
- ✅ Integrated with actual `CudaRunner` implementation
- ✅ Support for 6+ architectures (Volta, Turing, Ampere, Ada, Hopper, Blackwell)

**Usage**:
```java
@Inject
KernelPluginManager kernelManager;

// Get CUDA kernel
KernelPlugin cuda = kernelManager.getKernelForPlatform("cuda").get();

// Validate
KernelValidationResult validation = cuda.validate();
if (!validation.isValid()) {
    System.out.println("Validation failed: " + validation.getErrors());
}

// Initialize
KernelContext context = KernelContext.builder()
    .config(KernelConfig.builder()
        .deviceId(0)
        .memoryFraction(0.9f)
        .build())
    .build();

cuda.initialize(context);

// Execute operation
KernelOperation operation = KernelOperation.builder()
    .name("gemm")
    .parameter("m", 1024)
    .parameter("n", 1024)
    .build();

KernelResult<Matrix> result = cuda.execute(operation, context);
```

### Metal Kernel (v2.0)

**File**: `plugins/kernel/metal/gollek-backend-metal/.../MetalKernelPlugin.java`

**Features**:
- ✅ Comprehensive validation (macOS, Apple Silicon, Metal framework)
- ✅ Lifecycle management
- ✅ Type-safe operations
- ✅ Health monitoring with chip details
- ✅ Integrated with actual `MetalRunner` implementation
- ✅ Automatic chip detection (M1/M2/M3/M4)
- ✅ Unified memory optimization

**Usage**:
```java
@Inject
KernelPluginManager kernelManager;

// Auto-detect platform
String platform = KernelPlugin.autoDetectPlatform();
// Returns "metal" on Apple Silicon

// Get Metal kernel
KernelPlugin metal = kernelManager.getKernelForPlatform("metal").get();

// Check health
KernelHealth health = metal.health();
if (health.isHealthy()) {
    Map<String, Object> details = health.getDetails();
    System.out.println("Chip: " + details.get("chip_name"));
    System.out.println("Unified Memory: " + details.get("unified_memory_gb") + " GB");
}
```

---

## Enhanced Runner Plugins

### GGUF Runner (v2.0)

**File**: `plugins/runner/gguf/gollek-plugin-runner-gguf/.../GGUFRunnerPlugin.java`

**Integrated With**: `tech.kayys.gollek.inference.gguf.LlamaCppRunner`

**Features**:
- ✅ Comprehensive validation (llama.cpp availability, memory, acceleration)
- ✅ Lifecycle management
- ✅ Type-safe operations (INFER, TOKENIZE, DETOKENIZE)
- ✅ Health monitoring with device details
- ✅ Support for 14+ architectures
- ✅ CUDA/Metal acceleration detection

**Supported Formats**: `.gguf`

**Supported Architectures**: Llama 2/3, Mistral, Mixtral, Qwen, Gemma, Phi, Falcon, etc.

### ONNX Runner (v2.0)

**File**: `plugins/runner/onnx/gollek-plugin-runner-onnx/.../OnnxRunnerPlugin.java`

**Features**:
- ✅ Comprehensive validation (ONNX Runtime, execution provider)
- ✅ Lifecycle management
- ✅ Type-safe operations (INFER, EMBED, CLASSIFY)
- ✅ Multi-device support (CPU, CUDA, DirectML, CoreML)
- ✅ Execution provider auto-detection

**Supported Formats**: `.onnx`, `.onnxruntime`

**Execution Providers**:
- CPUExecutionProvider
- CUDAExecutionProvider
- DirectMLExecutionProvider
- CoreMLExecutionProvider

### Safetensor Runner (v2.0)

**File**: `plugins/runner/safetensor/gollek-plugin-runner-safetensor/.../SafetensorRunnerPlugin.java`

**Features**:
- ✅ Comprehensive validation (backend health, device, memory)
- ✅ Lifecycle management
- ✅ Type-safe operations (INFER, EMBED, CLASSIFY)
- ✅ Direct backend or GGUF conversion
- ✅ Multimodal processing integration
- ✅ Flash attention support

**Supported Formats**: `.safetensors`, `.gguf`, `.bin`

**Multimodal Support**:
- Text-only inference
- Text + Image (Vision-Language)
- Text + Audio
- Multi-image inference

### LibTorch Runner (v2.0 + Safetensor)

**File**: `plugins/runner/torch/gollek-plugin-runner-libtorch/.../LibTorchRunnerPlugin.java`

**Features**:
- ✅ Comprehensive validation (LibTorch availability, CUDA)
- ✅ Lifecycle management
- ✅ Type-safe operations (INFER, EMBED)
- ✅ **Safetensor model loading** (NEW)
- ✅ TorchScript support
- ✅ Quantization support

**Safetensor Integration**:
```java
@Inject
LibTorchRunnerPlugin runner;

// Load Safetensor model
Path modelPath = Path.of("/models/llama3-8b.safetensors");
if (runner.isSafetensorModel(modelPath)) {
    LibTorchModule module = runner.loadSafetensorModel(modelPath);
    System.out.println("Loaded " + module.getTensorCount() + " tensors");
}
```

**Supported Formats**: `.pt`, `.pth`, `.bin`, `.safetensors`

### TensorRT Runner (v2.0)

**File**: `plugins/runner/tensorrt/gollek-plugin-runner-tensorrt/.../TensorRTRunnerPlugin.java`

**Features**:
- ✅ Comprehensive validation (TensorRT, CUDA)
- ✅ Lifecycle management
- ✅ Type-safe operations (INFER)
- ✅ FP16/INT8 precision
- ✅ Multi-GPU support
- ✅ Dynamic batching

**Supported Formats**: `.engine`, `.plan`

### TFLite Runner (v2.0)

**File**: `plugins/runner/litert/gollek-plugin-runner-litert/.../LiteRTRunnerPlugin.java`

**Features**:
- ✅ Comprehensive validation (TFLite, delegates)
- ✅ Lifecycle management
- ✅ Type-safe operations (INFER, CLASSIFY)
- ✅ GPU delegate support
- ✅ NNAPI delegate support (Android)
- ✅ Quantization support (INT8, FP16)

**Supported Formats**: `.litertlm`, `.tfl`

---

## Engine Integration

### CDI Producers

**Kernel Plugin Producer**:
```java
@ApplicationScoped
public class KernelPluginProducer {
    
    @Produces
    @Singleton
    public KernelPluginManager produceKernelPluginManager() {
        if (!initialized) {
            initialize();
        }
        return kernelPluginManager;
    }
}
```

**Runner Plugin Producer**:
```java
@ApplicationScoped
public class RunnerPluginProducer {
    
    @Produces
    @Singleton
    public RunnerPluginManager produceRunnerPluginManager() {
        if (!initialized) {
            initialize();
        }
        return runnerPluginManager;
    }
}
```

### Usage in Engine Components

```java
@ApplicationScoped
public class InferenceService {
    
    // Direct injection
    @Inject
    KernelPluginManager kernelManager;
    
    @Inject
    RunnerPluginManager runnerManager;
    
    // Or via integrator
    @Inject
    PluginSystemIntegrator integrator;
    
    public void execute() {
        // Get kernel plugin manager
        KernelPluginManager km = integrator.getKernelPluginManager();
        
        // Get runner plugin manager
        RunnerPluginManager rm = integrator.getRunnerPluginIntegration()
            .getRunnerManager();
    }
}
```

---

## Type-Safe Operations

### Kernel Operations

```java
// Create operation
KernelOperation operation = KernelOperation.builder()
    .name("gemm")
    .parameter("m", 1024)
    .parameter("n", 1024)
    .parameter("k", 1024)
    .metadata("priority", "high")
    .build();

// Create context
KernelContext context = KernelContext.builder()
    .config(KernelConfig.builder()
        .deviceId(0)
        .memoryFraction(0.9f)
        .build())
    .build();

// Execute
KernelResult<Matrix> result = kernel.execute(operation, context);

// Access result
if (result.isSuccess()) {
    Matrix output = result.getData();
    System.out.println("Completed in " + 
        result.getDuration().toMillis() + "ms");
}
```

### Runner Operations

```java
// Create request
RunnerRequest request = RunnerRequest.builder()
    .type(RequestType.INFER)
    .inferenceRequest(inferenceRequest)
    .parameter("temperature", 0.7)
    .parameter("max_tokens", 512)
    .build();

// Create context
RunnerContext context = RunnerContext.builder()
    .config(RunnerConfig.builder()
        .contextSize(4096)
        .threads(4)
        .build())
    .build();

// Execute
RunnerResult<InferenceResponse> result = runner.execute(request, context);

// Access result
if (result.isSuccess()) {
    InferenceResponse response = result.getData();
    System.out.println("Generated: " + response.getContent());
}
```

---

## Error Handling

### Exception Hierarchy

```
KernelException / RunnerException (unchecked)
├── InitializationException
├── ExecutionException
├── NotFoundException
├── ModelLoadException
└── UnknownOperationException / UnknownRequestException
```

### Usage

```java
try {
    plugin.execute(request, context);
} catch (KernelNotFoundException e) {
    LOG.errorf("No kernel for: %s", e.getPlatform());
} catch (UnknownOperationException e) {
    LOG.errorf("Unknown operation: %s", e.getOperationName());
} catch (KernelExecutionException e) {
    LOG.errorf("Execution failed: %s", e.getMessage(), e);
}
```

---

## Health Monitoring

### Kernel Health

```java
@Inject
KernelPluginManager kernelManager;

Map<String, KernelHealth> health = kernelManager.getHealthStatus();
health.forEach((platform, h) -> {
    if (h.isHealthy()) {
        System.out.println(platform + ": ✓ " + h.getMessage());
        System.out.println("  Details: " + h.getDetails());
    } else {
        System.out.println(platform + ": ✗ " + h.getMessage());
    }
});
```

### Runner Health

```java
@Inject
RunnerPluginManager runnerManager;

Map<String, Boolean> health = runnerManager.getHealthStatus();
health.forEach((runner, healthy) -> {
    System.out.println(runner + ": " + (healthy ? "✓" : "✗"));
});
```

---

## Metrics

### Kernel Metrics

```java
@Inject
KernelPluginManager kernelManager;

KernelMetrics metrics = kernelManager.getMetrics();

System.out.println("Uptime: " + metrics.getUptime() + "ms");
System.out.println("Total Operations: " + 
    metrics.getCounter("total_operations"));
System.out.println("Total Errors: " + 
    metrics.getCounter("total_errors"));

// Per-operation stats
OperationStats gemmStats = metrics.getOperationStats("gemm");
System.out.printf("GEMM: count=%d, avg=%.2fms, success=%.2f%%\n",
    gemmStats.getCount(),
    gemmStats.getAverageDuration(),
    gemmStats.getSuccessRate() * 100);
```

### Runner Metrics

```java
@Inject
RunnerPluginManager runnerManager;

Map<String, Object> metrics = runnerManager.getMetrics();

System.out.println("Total Runners: " + metrics.get("total_runners"));
System.out.println("Available Runners: " + metrics.get("available_runners"));
System.out.println("Healthy Runners: " + metrics.get("healthy_runners"));
```

---

## Testing

### Integration Test

```java
@QuarkusTest
public class PluginSystemIntegrationTest {
    
    @Inject
    PluginSystemIntegrator integrator;
    
    @Test
    public void testPluginSystemInitialized() {
        assertTrue(integrator.isFullyInitialized());
        
        Map<String, Boolean> status = integrator.getPluginStatus();
        assertTrue(status.get("kernel"));
        assertTrue(status.get("runner"));
        assertTrue(status.get("optimization"));
        assertTrue(status.get("feature"));
    }
    
    @Test
    public void testKernelPluginManager() {
        KernelPluginManager km = integrator.getKernelPluginManager();
        assertNotNull(km);
        
        KernelHealth health = km.health();
        assertTrue(health.isHealthy());
    }
    
    @Test
    public void testRunnerPluginManager() {
        RunnerPluginManager rm = integrator.getRunnerPluginIntegration()
            .getRunnerManager();
        assertNotNull(rm);
        
        List<RunnerPlugin> runners = rm.getAllPlugins();
        assertTrue(runners.size() > 0);
    }
}
```

---

## Deployment

### Maven Dependencies

```xml
<!-- Kernel Plugin Core -->
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-plugin-kernel-core</artifactId>
    <version>${project.version}</version>
</dependency>

<!-- Runner Plugin Core -->
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-plugin-runner-core</artifactId>
    <version>${project.version}</version>
</dependency>

<!-- Engine (includes all integrations) -->
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-engine</artifactId>
    <version>${project.version}</version>
</dependency>
```

### Plugin Discovery

All plugins are automatically discovered via CDI:

```java
@Inject
Instance<KernelPlugin> kernelInstances;

@Inject
Instance<RunnerPlugin> runnerInstances;
```

---

## Resources

- **[Enhanced Kernel Plugin System](/docs/plugins/enhanced-plugin-architecture)** - Complete kernel plugin documentation
- **[Enhanced Runner Plugin System](/docs/plugins/enhanced-runner-plugin-architecture)** - Complete runner plugin documentation
- **[Safetensor Integration](/docs/runtime/safetensor-runner-integration)** - Safetensor runner with multimodal
- **[LibTorch-Safetensor Integration](/docs/runtime/safetensor-runner-integration)** - LibTorch with Safetensor loading
- **[Engine Integration](/docs/runtime/core-runtime-architecture)** - Engine wiring with all plugins

---

[Back to Architecture](/docs/runtime/architecture) &nbsp; [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs) &nbsp; [Runner Plugins](/docs/plugins/runner-plugins)
