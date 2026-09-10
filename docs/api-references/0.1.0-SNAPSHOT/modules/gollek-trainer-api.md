---
layout: default
title: gollek-trainer-api
parent: API REferences
nav_order: 48
---

# gollek-trainer-api

The `gollek-trainer-api` module is the canonical Gradle-first contract layer for Gollek training. It separates stable training lifecycle interfaces from the legacy runtime implementation still being migrated out of `training/`.

## 🌟 Overview

This module is intentionally small and stable. It exists so trainer integrations, listeners, logging, checkpointing, and future IDE/library tooling can depend on a clean API without dragging the full legacy trainer runtime onto the classpath.

## 🚀 Key Types

- **`TrainerSession`**: runtime view of a live training job
- **`TrainerConfig`**: canonical training configuration shared across trainer modules
- **`TrainingListener`**: lifecycle hooks for orchestration, logging, and extensions
- **`TrainingSummary`**: stable training result summary

## 📦 Installation

Today this is a **canonical Gradle module first**:

```kotlin
implementation(project(":trainer:gollek-trainer-api"))
```

During the migration, Maven and JBang users should continue to consume the broader compatibility surfaces that already publish cleanly, such as `gollek-ml-api`, instead of assuming a standalone `gollek-trainer-api` artifact is already available everywhere.

## 🛠️ Usage Example

```java
import tech.kayys.gollek.trainer.api.TrainerConfig;
import tech.kayys.gollek.trainer.api.TrainingListener;
import tech.kayys.gollek.trainer.api.TrainerSession;

TrainerConfig config = new TrainerConfig(
    10,
    1.0,
    true,
    Path.of("checkpoints")
);

TrainingListener listener = new TrainingListener() {
    @Override
    public void onEpochEnd(TrainerSession session, int epoch, double trainLoss) {
        System.out.println("epoch=" + epoch + " loss=" + trainLoss);
    }
};
```

## 📖 API Highlights

| Type | Description |
|:-----|:------------|
| `TrainerSession` | `currentEpoch()`, `globalStep()`, `summary()`, `stop()` |
| `TrainerConfig` | shared config record for epochs, gradient clip, AMP, checkpoint dir |
| `TrainingListener` | trainer lifecycle extension points |
| `TrainingSummary` | final status and runtime summary |

---

[Back to API Hub](../)
