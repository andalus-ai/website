---
layout: default
title: gollek-ml-train
parent: API REferences
nav_order: 50
---

# gollek-ml-train

The `gollek-ml-train` page is now a legacy compatibility reference during the Gradle migration. New code should prefer `gollek-trainer-api` and `gollek-trainer`.

## 🌟 Overview

Historically this module held the high-level training runtime. That code is being split into:

- `gollek-trainer-api` for stable training contracts
- `gollek-trainer` for the canonical runtime-facing bridge
- legacy runtime code still migrating out of `training/`

## 🚀 Key Features

- **Migration bridge**: preserves discoverability for users coming from the old module name
- **Canonical replacement**: points users to the new `trainer/` namespace
- **Compatibility strategy**: lets docs and dependency references stay readable while package/runtime migration continues

## 📦 Installation

Treat this page as a compatibility signpost, not as a new standalone dependency recommendation.

Today the canonical trainer split is:

```kotlin
implementation(project(":trainer:gollek-trainer-api"))
implementation(project(":trainer:gollek-trainer"))
```

If you are still consuming Gollek through Maven or JBang, keep using the broader published compatibility surfaces until the trainer modules are published independently.

## 🛠️ Usage Examples

### Canonical Direction

For new code:

```java
import tech.kayys.gollek.trainer.Trainers;
import tech.kayys.gollek.trainer.api.TrainerConfig;
```

Use:

- [`gollek-trainer-api`](gollek-trainer-api)
- [`gollek-trainer`](gollek-trainer)

### Legacy Runtime Note

```java
boolean available = Trainers.runtimeAvailable();
Object legacyBuilder = Trainers.builder();
```

## 📖 API Highlights

| Module | Role |
|:-------|:-----|
| `gollek-trainer-api` | stable session/config/listener contracts |
| `gollek-trainer` | canonical runtime bridge |
| `gollek-ml-train` | legacy compatibility reference only |

---

[Back to API Hub](../)
