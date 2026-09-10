---
layout: default
title: gollek-ml-hub
parent: API REferences
nav_order: 300
---

# gollek-ml-hub

The `gollek-ml-hub` module provides the canonical model hub for Gradle-managed Gollek ML usage. It simplifies loading, caching, and applying pretrained weights from local repositories and remote hubs such as HuggingFace.

## 🌟 Overview

Modern ML workflows rely heavily on shared repositories of models and weights. Gollek’s `ModelHub` surface keeps that logic inside a small Gradle-first module instead of scattering it across older training/runtime packages.

## 🚀 Key Features

- **HuggingFace + local support**: load model weights from HF identifiers or local paths
- **Efficient caching**: cache-aware local storage under the user model directory
- **SafeTensor-aware loading**: bridge SafeTensors into `GradTensor` / `NNModule`
- **Canonical config**: `HubConfig` for revision, cache dir, token, and timeout

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-hub</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Loading Weights from HuggingFace

```java
import tech.kayys.gollek.ml.hub.ModelHub;
import tech.kayys.gollek.ml.hub.HubConfig;

var weights = ModelHub.loadWeights(
    "Qwen/Qwen2.5-0.5B",
    HubConfig.builder()
        .revision("main")
        .build()
);
```

### Loading Directly into an `NNModule`

```java
ModelHub.loadInto(myModel, "Qwen/Qwen2.5-0.5B");
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.hub.ModelHub`

Static entrypoint for model weight discovery and loading.

| Method | Description |
|:-------|:------------|
| `loadWeights(modelId)` | Resolves and loads model weights into a `Map<String, GradTensor>`. |
| `loadWeights(modelId, config)` | Same as above with explicit hub configuration. |
| `loadInto(module, modelId)` | Resolves weights and applies them to an `NNModule`. |
| `applyWeights(module, weights)` | Applies a resolved weight map to a module. |

### Utilities

- **`HubConfig`**: revision, cache dir, token, force-download, timeout
- **`Gollek.Hub`**: umbrella entrypoint from `gollek-ml-api`

---

[Back to API Hub](../)
