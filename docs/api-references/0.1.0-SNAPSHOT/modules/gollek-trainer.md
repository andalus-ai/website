---
layout: default
title: gollek-trainer
parent: API REferences
nav_order: 49
---

# gollek-trainer

The `gollek-trainer` module is the canonical runtime-facing home for Gollek training orchestration during the Gradle migration.

## 🌟 Overview

Today this module provides the forward-looking package surface under `tech.kayys.gollek.trainer.*` while bridging to the richer legacy training runtime still being moved out of `training/`. It is the right entrypoint to depend on when you want the canonical trainer namespace without binding new code to the old package layout.

## 🚀 Key Features

- **Canonical package root**: `tech.kayys.gollek.trainer.*`
- **Reflective bridge**: can detect and bridge to the legacy trainer runtime while migration is in progress
- **Gradle-first structure**: aligns with the new `trainer/` namespace rather than the old `training/` umbrella

## 📦 Installation

Today this is a **canonical Gradle module first**:

```kotlin
implementation(project(":trainer:gollek-trainer"))
```

During the migration, Maven and JBang users should keep treating the trainer runtime as part of the broader ML compatibility surface until a standalone published trainer artifact is finalized.

## 🛠️ Usage Example

```java
import tech.kayys.gollek.trainer.Trainers;

if (Trainers.runtimeAvailable()) {
    Object trainerBuilder = Trainers.builder();
    System.out.println("Trainer runtime bridge is available: " + trainerBuilder.getClass().getName());
}
```

## 📖 API Highlights

| Type | Description |
|:-----|:------------|
| `Trainers` | canonical bridge entrypoint for trainer runtime availability and builder access |

---

[Back to API Hub](../)
