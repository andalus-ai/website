---
layout: default
title: gollek-ml-metrics
parent: API REferences
nav_order: 70
---

# gollek-ml-metrics

The `gollek-ml-metrics` module provides tools for evaluating model performance and tracking training progress. It includes standard metrics for classification, regression, and natural language processing, as well as utilities for benchmarking and observability.

## 🌟 Overview

Quantifying model quality is essential for iteration and production deployment. This module offers a standardized API for computing metrics, ensuring consistency across different tasks and environments. It also includes an early-stopping utility to prevent overfitting.

## 🚀 Key Features

- **Categorized Metrics**:
    - **Classification**: Accuracy, Precision, Recall, F1-Score, Confusion Matrix.
    - **Regression**: MSE, MAE, R-Squared, Huber Loss.
    - **NLP**: BLEU, ROUGE, Perplexity, Token Accuracy.
    - **Segmentation**: IoU (Intersection over Union), Dice Coefficient.
- **Benchmark Suite**: Native utilities for measuring inference latency, throughput, and memory footprint.
- **Metrics Tracker**: State container for gathering and averaging metrics across batches and epochs.
- **TensorBoard Integration**: Built-in support for writing logs to TensorBoard for visualization.
- **Early Stopping**: Automated criteria for halting training based on metric stagnation.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-metrics</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Tracking Classification Metrics

```java
import tech.kayys.gollek.ml.metrics.ClassificationMetrics;
import tech.kayys.gollek.ml.metrics.MetricsTracker;

MetricsTracker tracker = new MetricsTracker();

// Inside evaluation loop:
tracker.update(new ClassificationMetrics(preds, targets));

// Get final report
System.out.println("Accuracy: " + tracker.getAverage("accuracy"));
System.out.println("F1-Score: " + tracker.getAverage("f1"));
```

### Benchmarking Model Performance

```java
import tech.kayys.gollek.ml.metrics.BenchmarkSuite;

BenchmarkSuite suite = BenchmarkSuite.builder()
    .model(model)
    .input(input)
    .iterations(100)
    .warmup(10)
    .build();

suite.run();
System.out.println("Average Latency: " + suite.getAverageLatency() + "ms");
System.out.println("Peak Memory: " + suite.getPeakMemoryUsage() + "MB");
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.metrics.MetricsTracker`

Central container for aggregating metric values.

| Method | Description |
|:-------|:------------|
| `update(Metric m)` | Adds a new metric calculation to the aggregator. |
| `reset()` | Clears all tracked metrics (e.g., at epoch end). |
| `getAverage(String name)` | Returns the mean value for a specific metric. |
| `report()` | Generates a formatted summary string of all metrics. |

### `tech.kayys.gollek.ml.metrics.BenchmarkSuite`

Utility for profiling model execution.

- `run()`: Executes the benchmark loop.
- `getThroughput()`: Returns inferences per second.
- `getLatencyP95()`: Returns the 95th percentile latency.

---

[Back to API Hub](../)
