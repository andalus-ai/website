---
layout: default
title: SDK Installation
---

# Gollek SDK Installation

Install Gollek as a Maven/Gradle dependency for use in your Java projects.

---

## System Requirements

| Requirement | Version |
|-------------|---------|
| **Java** | 25+ (with preview features) |
| **Maven** | 3.8+ |
| **Gradle** | 8.5+ |
| **OS** | macOS (Apple Silicon), Linux (x86_64/aarch64), Windows |

---

## Maven

Add the Gollek repository and dependency to your `pom.xml`:

```xml
<repositories>
    <repository>
        <id>github</id>
        <url>https://maven.pkg.github.com/bhangun/gollek</url>
    </repository>
    <repository>
        <id>mavencentral</id>
        <url>https://repo.maven.apache.org/maven2</url>
    </repository>
</repositories>

<dependencies>
    <!-- Core ML Framework -->
    <dependency>
        <groupId>tech.kayys.gollek</groupId>
        <artifactId>gollek-ml-ml</artifactId>
        <version>0.3.0-SNAPSHOT</version>
    </dependency>

    <!-- Optimization Suite (v0.3+) -->
    <dependency>
        <groupId>tech.kayys.gollek</groupId>
        <artifactId>gollek-ml-optimize</artifactId>
        <version>0.3.0-SNAPSHOT</version>
    </dependency>

    <!-- ONNX Runtime Integration (v0.3+) -->
    <dependency>
        <groupId>tech.kayys.gollek</groupId>
        <artifactId>gollek-ml-onnx</artifactId>
        <version>0.3.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

---

## Gradle

Add to your `build.gradle`:

```groovy
repositories {
    maven {
        url = uri("https://maven.pkg.github.com/bhangun/gollek")
    }
    mavenCentral()
}

dependencies {
    // Core ML Framework
    implementation 'tech.kayys.gollek:gollek-ml-ml:0.3.0-SNAPSHOT'

    // Optimization Suite
    implementation 'tech.kayys.gollek:gollek-ml-optimize:0.3.0-SNAPSHOT'

    // ONNX Runtime
    implementation 'tech.kayys.gollek:gollek-ml-onnx:0.3.0-SNAPSHOT'
}
```

Enable preview features:

```groovy
tasks.withType(JavaCompile).configureEach {
    options.compilerArgs += ['--enable-preview', '--add-modules', 'jdk.incubator.vector']
}

tasks.withType(JavaExec).configureEach {
    jvmArgs += ['--enable-preview', '--add-modules', 'jdk.incubator.vector', '--enable-native-access=ALL-UNNAMED']
}
```

---

## Available Modules

| Module | Artifact | Description |
|--------|----------|-------------|
| **Core ML** | `gollek-ml-ml` | Tensor operations, autograd, neural network layers |
| **Optimization** | `gollek-ml-optimize` | Graph fusion, quantization, memory pool |
| **ONNX** | `gollek-ml-onnx` | ONNX Runtime inference |
| **GGUF** | `gollek-ml-gguf` | GGUF model reader/writer |
| **LiteRT** | `gollek-ml-litert` | LiteRT (TFLite) integration |
| **SafeTensors** | `gollek-ml-safetensor` | SafeTensors format support |
| **Transformer** | `gollek-ml-transformer` | Multi-head attention, transformer layers |
| **CNN** | `gollek-ml-cnn` | Convolutional layers |
| **RNN** | `gollek-ml-rnn` | RNN, LSTM, GRU layers |

---

## Quick Start

### 1. Create a Tensor

```java
import tech.kayys.gollek.ml.Gollek;
import tech.kayys.gollek.ml.tensor.Tensor;

public class QuickStart {
    public static void main(String[] args) {
        // Create tensors
        Tensor x = Gollek.randn(3, 4);
        Tensor y = Gollek.zeros(3, 4);
        Tensor z = Gollek.ones(3, 4);

        System.out.println("x shape: " + java.util.Arrays.toString(x.shape()));
    }
}
```

### 2. Build a Neural Network

```java
import tech.kayys.gollek.ml.nn.Linear;
import tech.kayys.gollek.ml.nn.ReLU;
import tech.kayys.gollek.ml.nn.Sequential;

public class NeuralNetwork {
    public static void main(String[] args) {
        // Build model
        Sequential model = Sequential.builder()
            .add(new Linear(784, 256))
            .add(new ReLU())
            .add(new Linear(256, 128))
            .add(new ReLU())
            .add(new Linear(128, 10))
            .build();

        System.out.println("Model built: 784 → 256 → 128 → 10");
    }
}
```

### 3. Run Inference

```java
import tech.kayys.gollek.ml.runner.*;

public class Inference {
    public static void main(String[] args) {
        ModelRunner runner = ModelRunner.builder()
            .modelPath("model.onnx")
            .device(RunnerDevice.CUDA)
            .build();

        InferenceResult result = runner.infer(
            InferenceInput.fromFloats(inputData, 1, 3, 224, 224)
        );

        System.out.println("Latency: " + result.latency());
        System.out.println("Output: " + result.primaryOutput().asFloats());

        runner.close();
    }
}
```

---

## GPU Acceleration

### CUDA (NVIDIA GPUs)

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-runtime-inference</artifactId>
    <version>0.3.0-SNAPSHOT</version>
</dependency>
```

Requirements:
- NVIDIA GPU with compute capability 6.0+
- CUDA Toolkit 11.8+
- cuDNN 8.6+

### Metal (Apple Silicon)

Works out of the box on M1/M2/M3 Macs. No additional dependencies needed.

---

## Verification

Run the verification script:

```java
import tech.kayys.gollek.ml.Gollek;

public class VerifyInstallation {
    public static void main(String[] args) {
        Gollek.printInfo();
        
        // Test tensor operations
        var x = Gollek.randn(2, 2);
        var y = Gollek.randn(2, 2);
        var z = x.add(y);
        
        System.out.println("✓ Gollek SDK installed successfully");
        System.out.println("✓ Tensor operations working");
        System.out.println("✓ CUDA available: " + Gollek.isCudaAvailable());
        System.out.println("✓ Metal available: " + Gollek.isMetalAvailable());
    }
}
```

Expected output:
```
Gollek ML Framework
  Version: 0.3.0-SNAPSHOT
  Device: CPU (Apple M3 Pro, 12 cores)
  CUDA: Not available
  Metal: Available
  Java: 25.0.1 (Eclipse Adoptium)
  Vector API: 256-bit

✓ Gollek SDK installed successfully
✓ Tensor operations working
✓ CUDA available: false
✓ Metal available: true
```

---

## Next Steps

- **[CLI Installation](cli-installation) - Install the Gollek CLI tool
- **[JBang Setup](jbang-setup) - Run examples without build tools
- **[Framework Guide](/docs/framework/) - Learn the ML framework
- **[Inference Guide](/docs/framework/inference) - Model inference guide
- **[Examples](/examples/) - Browse JBang and Jupyter examples

---

## Troubleshooting

### "Could not find artifact" error

Ensure the GitHub repository is configured in your `settings.xml`:

```xml
<servers>
    <server>
        <id>github</id>
        <username>YOUR_GITHUB_USERNAME</username>
        <password>YOUR_GITHUB_TOKEN</password>
    </server>
</servers>
```

### Java version mismatch

Gollek requires Java 25. Check your version:

```bash
java -version
```

If you have multiple Java versions, use `JAVA_HOME`:

```bash
export JAVA_HOME=/path/to/java25
```

### Native library not found

For GPU support, ensure native libraries are in your library path:

```bash
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH  # Linux
export DYLD_LIBRARY_PATH=/usr/local/cuda/lib:$DYLD_LIBRARY_PATH  # macOS
```
