---
layout: default
title: gollek-ml-api
parent: API REferences
nav_order: 10
---

# gollek-ml-api

The `gollek-ml-api` module serves as the primary high-level façade for the entire Gollek ML framework. It provides a unified entry point, masking the complexity of underlying tensor operations, autograd engines, and hardware backends.

## 🌟 Overview

This module is designed for developers who want to integrate ML capabilities into their Java applications without diving into low-level tensor manipulation. It provides a fluent builder API for model instantiation and execution.

## 🚀 Key Features

- **Unified SDK Entry Point**: The `Gollek` class provides access to all major framework features.
- **Fluent Builder Pattern**: Simplified model and device configuration.
- **Pipeline Orchestration**: Built-in support for text, vision, and multi-modal pipelines.
- **Hardware Agnostic**: Automatically selects the best available backend (CUDA, Metal, CPU).

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-api</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Initializing the SDK

```java
import tech.kayys.gollek.ml.Gollek;

// Initialize with automatic device detection
Gollek sdk = Gollek.builder()
    .model("qwen-0.5b")
    .build();

System.out.println("Running on: " + sdk.getDevice());
```

### Simple Text Completion

```java
String prompt = "Neural networks are";
String completion = sdk.generate(prompt);
System.out.println(completion);
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.Gollek`

The central entry point for the SDK.

| Method | Description |
|:-------|:------------|
| `builder()` | Returns a new `Gollek.Builder` instance. |
| `generate(String prompt)` | Performs high-level text generation. |
| `getDevice()` | Returns the active `Device` being used for execution. |
| `close()` | Releases native resources and cleans up memory. |

### `tech.kayys.gollek.ml.Gollek.Builder`

Configures the SDK instance.

| Method | Description |
|:-------|:------------|
| `model(String modelPath)` | Sets the target model (HuggingFace ID or local path). |
| `device(String deviceType)` | Manually specifies the device (`CPU`, `CUDA`, `METAL`). |
| `precision(String type)` | Sets execution precision (`FP32`, `FP16`, `INT8`). |
| `build()` | Creates the `Gollek` instance. |

---

[Back to API Hub](../)
