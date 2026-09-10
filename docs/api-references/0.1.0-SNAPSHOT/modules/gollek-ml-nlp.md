---
layout: default
title: gollek-ml-nlp
parent: API REferences
nav_order: 120
---

# gollek-ml-nlp

The `gollek-ml-nlp` module provides high-level pipelines and data structures for Natural Language Processing. It includes support for tokenization, text classification, and Large Language Model (LLM) orchestration.

## 🌟 Overview

NLP tasks require specialized handling of text data, including complex tokenization and sequence management. This module organizes these tasks into "Pipelines", similar to HuggingFace Transformers, making it easy to deploy text-based models in Java.

## 🚀 Key Features

- **Standardized Pipelines**: Ready-to-use pipelines for `TextGeneration`, `Embeddings`, and `TextClassification`.
- **Flexible Tokenization**: `TokenizerPipeline` handles the conversion of strings to numeric sequences, with support for modern encoding schemes.
- **Rich Text Abstractions**: `Doc`, `Span`, and `Token` classes provide a structured way to interact with processed text.
- **Multi-lingual Support**: Built-in logic for language detection and specialized processing via `Language` and `LanguageFactory`.
- **Pipeline Factory**: A central hub (`PipelineFactory`) for instantiating pre-configured NLP solutions.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-nlp</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Text Generation Pipeline

```java
import tech.kayys.gollek.ml.nlp.PipelineFactory;
import tech.kayys.gollek.ml.nlp.TextGenerationPipeline;
import tech.kayys.gollek.ml.nlp.PipelineConfig;

// Initialize a generation pipeline for a specific model
TextGenerationPipeline pipeline = PipelineFactory.create(
    "text-generation", 
    new PipelineConfig("qwen-0.5b")
);

// Generate text
String prompt = "Java is a language that";
String result = pipeline.generate(prompt, 50); // Generate up to 50 tokens
System.out.println(result);
```

### Text Classification

```java
import tech.kayys.gollek.ml.nlp.TextClassificationPipeline;

TextClassificationPipeline classifier = PipelineFactory.create(
    "text-classification",
    new PipelineConfig("sentiment-analysis-v1")
);

var label = classifier.classify("I love building AI tools in Java!");
System.out.printf("Label: %s, Score: %.4f%n", label.label(), label.score());
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.nlp.PipelineFactory`

The entry point for creating NLP tasks.

| Method | Description |
|:-------|:------------|
| `create(String task, PipelineConfig config)` | Instantiates a task-specific pipeline. |
| `register(String task, PipelineProvider p)` | Registers a custom pipeline implementation. |

### `tech.kayys.gollek.ml.nlp.Doc`

Represents a processed document containing tokens and metadata.

- `tokens()`: Returns a list of `Token` objects.
- `spans()`: Returns a list of named entities or custom spans.
- `vector()`: Returns the document-level embedding vector.

### Pipeline Config & State

- **`PipelineConfig`**: Holds model configuration, hyper-parameters (top-k, temperature), and device settings.
- **`Token`**: Represents a single word or sub-word unit.
- **`Span`**: Represents a slice of the document (e.g., for NER or chunking).

---

[Back to API Hub](../)
