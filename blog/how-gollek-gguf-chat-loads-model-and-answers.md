---
layout: default
title: How Gollek GGUF Chat Loads from Hugging Face and Answers
date: 2026-03-03
description: Step-by-step walkthrough of what happens when running gollek chat with a GGUF provider and a Hugging Face model reference.
categories: [runtime]
tags: [cli, gguf, huggingface, model-repository, sequence-diagram]
cover: aurora
---

<p class="blog-meta">Published: March 3, 2026</p>

# How Gollek GGUF Chat Loads from Hugging Face and Answers

This post explains what happens when you run:

```bash
gollek chat --provider gguf --model Qwen/Qwen2.5-0.5B-Instruct
```

From the first command, Gollek resolves the model source, pulls artifacts into the local model repository (if needed), initializes the GGUF runtime session, opens interactive prompt mode, and generates the answer.

---

## Example Session

```text
  _____       _  _      _    
 / ____|     | || |    | |   
| |  __  ___ | || | ___| | __
| | |_ |/ _ \| || |/ _ \ |/ /
| |__| | (_) | || |  __/   < 
 \_____|\___/|_||_|\___|_|\_\

Model: Qwen2.5-0.5B-Instruct-GGUF
Provider: gguf
Commands: 'exit' to quit, '/reset' to clear history.
Note: Use '\' at the end of a line for multiline input.
----------------------------------------------------------------------------------------------------

>>> Hello, what can you do?

Assistant: I can help you with coding, writing, and analysis...

[Tokens: 42, Duration: 0.85s, Speed: 49.41 t/s]
```

---

## Process Breakdown

1. CLI parses runtime intent:
- provider is pinned to `gguf`
- model reference is `Qwen/Qwen2.5-0.5B-Instruct`

2. Provider + model resolution:
- Provider registry routes request to GGUF provider path.
- Model repository checks local cache first.
- If missing, repository resolves Hugging Face source and downloads required model artifacts.

3. GGUF session initialization:
- GGUF runtime loads model metadata and tensors.
- Chat runtime prepares initial conversation state and prompt formatting.

4. Interactive prompt loop:
- User input (`>>> ...`) is appended to chat state.
- GGUF provider executes generation with current context.
- Output is streamed/assembled and printed as `Assistant: ...`.

5. Metrics and user feedback:
- CLI prints tokens, duration, and token/s speed.
- Session remains active for next prompt until `exit` or `/reset`.

---

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant C as Gollek CLI
    participant R as Provider Registry
    participant M as Model Repository
    participant H as Hugging Face Source
    participant G as GGUF Provider/Runtime

    U->>C: gollek chat --provider gguf --model Qwen/Qwen2.5-0.5B-Instruct
    C->>R: Resolve provider (gguf)
    R-->>C: GGUF provider selected
    C->>M: Resolve model reference
    M->>M: Check local cache
    alt Model not cached
      M->>H: Fetch model artifacts
      H-->>M: Return GGUF artifacts
      M->>M: Store in local repository
    else Model cached
      M-->>C: Return local artifact path
    end
    C->>G: Initialize GGUF session
    G-->>C: Ready (model + chat state)
    U->>C: "Hello, what can you do?"
    C->>G: Generate response from current prompt/context
    G-->>C: Assistant text + token stats
    C-->>U: Print answer and [Tokens, Duration, Speed]
```

---

## Why This Matters

- Local-first behavior keeps repeat runs fast after first download.
- Explicit `--provider gguf` gives deterministic runtime path for benchmarking and debugging.
- Interactive loop + token stats make CLI suitable for both demos and performance validation.

---

For related runtime guidance, see [Developer Guidance](/docs/developer-guidance) and [Architecture](/docs/architecture).
