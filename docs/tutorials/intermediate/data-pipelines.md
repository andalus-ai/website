---
layout: default
title: Building Efficient Data Pipelines
parent: Intermediate Tutorials
grand_parent: Tutorials
nav_order: 3
---

# Building Efficient Data Pipelines

This tutorial covers the canonical `gollek-ml-data` path for repeatable
training inputs. Use it after the first CNN or RNN tutorial, and before moving
into larger image-generation, multimodal, quantization, or native-runtime
workflows.

The public package for new code is `tech.kayys.gollek.ml.data.*`. Some older
helpers still exist in compatibility packages while migration continues, but
new tutorials and examples should start from the `ml.data` APIs below.

## What You Will Build

By the end of this tutorial you will know how to:

- create a `Dataset` from records or tensors
- split data into train and validation sets
- create deterministic `DataLoader` batches
- collate generic records into tensor batches
- choose samplers for class balance, distributed work, and sequence padding

## 1. Start With a Dataset

Use `Dataset` when you have indexed examples that can be loaded by position.
For quick experiments, create one from memory:

```java
import tech.kayys.gollek.ml.data.Dataset;

record Example(float[] features, int label) {}

Dataset<Example> raw = Dataset.of(
    new Example(new float[] {1.0f, 0.0f}, 0),
    new Example(new float[] {0.0f, 1.0f}, 1),
    new Example(new float[] {0.8f, 0.2f}, 0),
    new Example(new float[] {0.2f, 0.9f}, 1)
);
```

Dataset transforms stay lazy and composable:

```java
Dataset<Example> prepared = raw
    .filter(example -> example.features().length == 2)
    .shuffle(42L)
    .cache();
```

Use `cache()` after expensive preprocessing that you want to reuse across
epochs. Keep it off for very large or streaming datasets.

## 2. Create Generic Batches

A generic `DataLoader<T>` yields `List<T>` mini-batches. This is useful when
you still need custom parsing, tokenization, augmentation, or feature building
inside the training loop.

```java
import java.util.List;
import tech.kayys.gollek.ml.data.DataLoader;
import tech.kayys.gollek.ml.data.Dataset;

Dataset.Split<Example> split = prepared.split(0.8, 42L);

DataLoader<Example> trainRows =
    new DataLoader<>(
        split.train(),
        32,
        false,
        false,
        DataLoader.randomSampler(42L)
    );

for (List<Example> batch : trainRows) {
    // Convert records to tensors, run augmentation, then call the model.
}
```

Use a seeded sampler for repeatable training batches and keep validation
deterministic:

```java
DataLoader<Example> validationRows =
    new DataLoader<>(split.validation(), 64, false, false);
```

## 3. Use Tensor Batches For Models

When your inputs and labels are already tensors, use the tensor helpers. They
yield `DataLoader.Batch`, which exposes `inputs()` and `labels()` tensors.

```java
import tech.kayys.gollek.ml.autograd.GradTensor;
import tech.kayys.gollek.ml.data.DataLoader;

GradTensor images = GradTensor.randn(128, 3, 32, 32);
int[] labels = new int[128];
for (int i = 0; i < labels.length; i++) {
    labels[i] = i % 10;
}

var split = DataLoader.classificationStratifiedSplit(
    images,
    labels,
    0.8,
    42L
);

var train = split.trainLoader(16, true, 42L);
var validation = split.validationLoader(32);

for (DataLoader.Batch batch : train) {
    GradTensor x = batch.inputs();
    GradTensor y = batch.labels();

    // model.forward(x);
    // loss.forward(prediction, y);
    // optimizer.step();
}
```

Prefer a stratified split for classification so train and validation keep a
similar label distribution.

## 4. Collate Custom Samples

For custom records, collate batches into a structure your model expects. A
collate function keeps conversion logic close to the data pipeline instead of
spreading it across the model code.

```java
import tech.kayys.gollek.ml.autograd.GradTensor;
import tech.kayys.gollek.ml.data.DataLoader;
import tech.kayys.gollek.ml.data.Dataset;

Dataset<Dataset.Sample> samples = Dataset.of(
    new Dataset.Sample(
        GradTensor.of(new float[] {1f, 2f}, 2),
        GradTensor.of(new float[] {0f}, 1)
    ),
    new Dataset.Sample(
        GradTensor.of(new float[] {3f, 4f}, 2),
        GradTensor.of(new float[] {1f}, 1)
    )
);

var loader = new DataLoader<>(samples, 2)
    .collate(DataLoader.sampleBatchCollate());

for (DataLoader.Batch batch : loader) {
    GradTensor inputs = batch.inputs();
    GradTensor targets = batch.labels();
}
```

For sequence data with variable lengths, use a padded collator:

```java
var padded = new DataLoader<>(samples, 8)
    .collate(DataLoader.paddedSampleBatchCollate(0.0f, -100.0f));
```

The first pad value is used for inputs. The second value is used for labels,
where `-100` is a common ignore index for language-modeling losses.

## 5. Pick a Sampler Strategy

Choose the simplest sampler that matches the data problem:

| Data shape | Recommended API | Use when |
|------------|-----------------|----------|
| Balanced image or tabular classification | `classificationStratifiedSplit(...)` | You need stable train/validation class ratios. |
| Imbalanced classification | `classBalancedSampleWeights(...)` with `weightedRandomSampler(...)` | Rare classes should appear more often during training. |
| Binary or multi-label tasks | `binary(...)`, `binarySplit(...)`, `binaryStratifiedSplit(...)` | Labels need BCE-compatible tensor shapes. |
| Variable-length text or audio | `paddedSampleBatchCollate(...)` | Each sample has a different token or frame count. |
| Length-sensitive sequences | `inputLengthBucketBatchSampler(...)` or `lengthBucketBatchSampler(...)` | Similar-length samples should be batched together to reduce padding. |
| Multi-worker training | `distributedSampler(...)` | Several ranks must see different shards of the same dataset. |

Example for imbalanced classes:

```java
var dataset = DataLoader.classificationDataset(images, labels);
float[] weights = DataLoader.classBalancedSampleWeights(labels);

var balancedTrain = DataLoader.tensorBuilder(dataset)
    .batchSize(16)
    .weightedRandomSampler(weights, labels.length, true, 7L)
    .build();
```

## 6. Pipeline Checklist

Before training a model, confirm these points:

- Batch size fits the target runtime memory.
- Training uses shuffling or a sampler; validation does not.
- Classification splits preserve label distribution.
- Sequence batches either pad correctly or use length-aware sampling.
- Random seeds are fixed for reproducible local experiments.
- Expensive transforms are cached only when the dataset fits memory.

## Next Steps

- Continue image modeling with [Convolutional Neural Networks](/docs/tutorials/intermediate/cnn).
- Continue sequence modeling with [LSTMs & Sequences](/docs/tutorials/intermediate/rnn).
- Move into generation with [Stable Diffusion Image Generation](/docs/tutorials/intermediate/stable-diffusion).
- Prepare deployment with [Quantization Quick Start](/docs/tutorials/advanced/quantization-quick-start).
