---
layout: default
title: gollek-ml-data
parent: API REferences
nav_order: 140
---

# gollek-ml-data

The `gollek-ml-data` module provides the canonical Gollek data API for ingestion, preprocessing, batching, and sampling. New code should import from:

```java
import tech.kayys.gollek.ml.data.*;
```

Use this package name in tutorials, examples, and application code. The source
tree can contain compatibility or migration modules, but the public learner-facing
surface is `tech.kayys.gollek.ml.data.*`.

## 🌟 Overview

Training deep learning models requires repeatable handling of data splits, transforms, batch sizes, and sampling policy. This module provides standard patterns for loading common formats and building custom data pipelines with on-the-fly transformations.

## 🚀 Key Features

- **Dataset Abstraction**: Unified interface for indexed datasets.
- **DataLoader**: Generic mini-batch iteration over `Dataset<T>`.
- **Tensor DataLoader Helpers**: Classification, binary, tensor-pair, and train/validation helpers that yield `DataLoader.Batch`.
- **Samplers and Collators**: Weighted random sampling, distributed sampling, length-aware batches, and padded sequence collators.
- **Predefined Datasets**:
    - `TextDataset`: Stream-based loading of raw text files.
    - `CsvDataset`: Fast parsing of tabular data.
- **Support for Large Data**: `StreamingDataset` allows processing of datasets that exceed system RAM.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-data</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Loading a CSV Dataset

```java
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import tech.kayys.gollek.ml.data.CsvDataset;
import tech.kayys.gollek.ml.data.DataLoader;

CsvDataset dataset = new CsvDataset(Path.of("data/train.csv"), ",", true);

// Create DataLoader for batching
DataLoader<Map<String, String>> loader = new DataLoader<>(dataset, 32, true, false);

// Use in training loop
for (List<Map<String, String>> batch : loader) {
    // ... convert rows to tensors
}
```

### Working with Text Data

```java
import java.nio.file.Path;
import tech.kayys.gollek.ml.data.TextDataset;

TextDataset trainData = new TextDataset(Path.of("corpus.txt"));
```

### Tensor Classification Batches

```java
import tech.kayys.gollek.ml.autograd.GradTensor;
import tech.kayys.gollek.ml.data.DataLoader;

GradTensor inputs = GradTensor.randn(128, 3, 32, 32);
int[] labels = new int[128];
for (int i = 0; i < labels.length; i++) {
    labels[i] = i % 10;
}

var split = DataLoader.classificationStratifiedSplit(inputs, labels, 0.8, 42L);
var train = split.trainLoader(16, true, 42L);

for (DataLoader.Batch batch : train) {
    GradTensor x = batch.inputs();
    GradTensor y = batch.labels();
    // ... forward, loss, backward, optimizer step
}
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.data.Dataset<T>`

Use `Dataset<T>` for indexed samples.

| Method | Description |
|:-------|:------------|
| `Dataset.of(...)` / `Dataset.from(...)` | Creates an in-memory dataset. |
| `get(index)` / `size()` | Reads a sample and reports sample count. |
| `map(...)`, `filter(...)`, `cache()` | Builds reusable preprocessing pipelines. |
| `split(...)`, `stratifiedSplit(...)`, `kFold(...)` | Creates train/validation folds from generic records. |

### `tech.kayys.gollek.ml.data.DataLoader`

Use `DataLoader<T>` for generic record batches.

| Method | Description |
|:-------|:------------|
| `new DataLoader<>(dataset, batchSize)` | Creates sequential mini-batches. |
| `new DataLoader<>(dataset, batchSize, shuffle, dropLast)` | Adds shuffling and partial-batch control. |
| `iterator()` | Yields `List<T>` generic batches. |
| `collate(fn)` | Converts `List<T>` batches into model-ready structures. |
| `map(fn)` | Transforms samples while preserving loader settings. |
| `numBatches()` | Returns the number of batches that will be produced. |
| `size()` | Returns the source dataset sample count. |

### Tensor Helpers

Use these helpers when the model already consumes tensors.

| Method | Description |
|:-------|:------------|
| `tensorDataset(inputs, labels)` | Wraps input and label tensors as paired samples. |
| `classification(...)` | Builds a tensor loader for class-index labels. |
| `classificationStratifiedSplit(...)` | Creates train/validation splits that preserve class distribution. |
| `binary(...)` / `binarySplit(...)` | Builds BCE-compatible binary or multi-label batches. |
| `tensorBuilder(dataset)` | Configures batch size, seed, samplers, and drop-last behavior for tensor datasets. |
| `sampleBatchCollate()` / `paddedSampleBatchCollate(...)` | Collates fixed or variable-length samples. |

### Dataset Implementations (Canonical)

- **`CsvDataset`**: parses CSV rows to key/value maps.
- **`TextDataset`**: reads text lines or corpus-style textual data.
- **`StreamingDataset`**: interface for datasets read lazily from large sources.

## Learn More

- [Building Efficient Data Pipelines](/docs/tutorials/intermediate/data-pipelines)
- [Intermediate Tutorials](/docs/tutorials/intermediate/)

---

[Back to API Hub](../)
