---
title: "Gollek Platform Architecture"
description: "Technical architecture of Gollek inference/serving, ML framework, and hardware dispatch"
---

# Gollek Architecture Diagrams

This document outlines the high-level architecture, module boundaries, and dispatch sequences of the Gollek platform.

Gollek uses five major module families:

- inference/serving core: `gollek-core`, `gollek-spi-*`, provider routing
- format runners: `runner/*` (GGUF, Safetensor, ONNX, LiteRT, and others)
- ML framework: `gollek-ml-*`
- trainer: `gollek-trainer-*`
- integrations: `gollek-integration-*`

Some legacy pages still mention older `gollek-sdk-*` training-era names. Those should be read as compatibility terminology during migration.

## 1. High-Level Modular Architecture

The Gollek platform uses a layered architecture that keeps inference/serving concerns separate from framework/trainer concerns.

```mermaid
graph TD
    subgraph "Application Surfaces"
        CLI["gollek-cli"]
        SDK["gollek-sdk-*"]
        INTG["gollek-integration-*"]
    end

    subgraph "Inference / Serving Core"
        SPI["gollek-spi-* contracts"]
        CORE["gollek-core + provider routing"]
    end

    subgraph "Format Runner Layer"
        GGUF["runner:gguf:*"]
        ST["runner:safetensor:*"]
        ONNX["runner:onnx:*"]
        LITERT["runner:litert:*"]
    end

    subgraph "ML Framework + Trainer"
        MLAPI["ml:gollek-ml-api"]
        MLDATA["ml:gollek-ml-data"]
        MLNN["ml:gollek-ml-nn"]
        TRAINERAPI["trainer:gollek-trainer-api"]
        TRAINER["trainer:gollek-trainer"]
    end

    subgraph "Backend / Kernel Layer"
        CPU["CPU backend"]
        METAL["Metal backend"]
        CUDA["CUDA backend"]
        ROCM["ROCm backend"]
    end

    CLI --> CORE
    SDK --> CORE
    INTG --> CORE

    CORE --> SPI
    CORE --> GGUF
    CORE --> ST
    CORE --> ONNX
    CORE --> LITERT

    GGUF --> CPU
    GGUF --> METAL
    ST --> CPU
    ST --> METAL
    ONNX --> CPU
    ONNX --> CUDA
    ONNX --> ROCM
    LITERT --> CPU
    LITERT --> METAL

    MLAPI --> MLDATA
    MLAPI --> MLNN
    TRAINER --> TRAINERAPI
    TRAINER --> MLAPI
```

## 2. Inference Dispatch Sequence

When a request is served, Gollek resolves the model format and dispatches to the selected runner/backend path.

```mermaid
sequenceDiagram
    participant User
    participant CLI as Gollek CLI / SDK
    participant Core as Provider Router
    participant Runner as Format Runner
    participant Backend as Compute Backend

    User->>CLI: run(prompt, model)
    CLI->>Core: inference request
    Core->>Core: resolve model format + runtime policy
    Core->>Runner: dispatch(request)
    Runner->>Backend: execute(prefill/decode)
    Backend-->>Runner: logits / tokens
    Runner-->>Core: inference response
    Core-->>CLI: response
    CLI-->>User: text / stream chunks
```

## 3. Trainer Execution Sequence

Trainer-facing APIs are split from the broader ML facade so orchestration can evolve independently.

```mermaid
sequenceDiagram
    participant App as Trainer App
    participant API as gollek-trainer-api
    participant Runtime as gollek-trainer
    participant ML as gollek-ml-api

    App->>API: create TrainerConfig + TrainerSession
    API->>Runtime: start training session
    Runtime->>ML: forward / backward / optimizer step
    ML-->>Runtime: metrics and model state
    Runtime-->>API: TrainingSummary + lifecycle events
    API-->>App: progress callbacks / completion
```
