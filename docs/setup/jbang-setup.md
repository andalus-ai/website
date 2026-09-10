---
layout: default
title: JBang Setup
---

# JBang Setup

Run Gollek examples without installing build tools. JBang handles all dependencies automatically.

---

## Install JBang

### macOS / Linux

```bash
curl -Ls https://sh.jbang.dev | bash -s -
```

### Windows (PowerShell)

```powershell
iex "& { $(iwr https://ps.jbang.dev) } trust add https://github.com/bhangun/gollek"
iex "& { $(iwr https://ps.jbang.dev) } app install"
```

### SDKMAN

```bash
sdk install jbang
```

### Verify Installation

```bash
jbang --version
```

---

## Configure Gollek Repository

JBang needs access to the Gollek Maven repository. Add to `~/.jbang/` or specify in each script:

```bash
# Trust the Gollek repository
jbang trust add https://github.com/bhangun/gollek

# Or configure in ~/.jbang/settings.json
{
  "repositories": {
    "gollek": "https://maven.pkg.github.com/bhangun/gollek"
  }
}
```

For GitHub packages, you may need authentication:

```bash
# Set GitHub token for Maven access
export JBANG_GITHUB_TOKEN=your_github_token
```

---

## Run Examples

### Browse Available Examples

```bash
cd gollek/examples/jbang/
ls -la
```

### Run an Example

```bash
# Hello World
jbang examples/jbang/common/hello_gollek.java

# SDK Quickstart
jbang examples/jbang/sdk/gollek-quickstart.java

# v0.3 Unified Framework Demo
jbang examples/jbang/sdk/unified_framework_demo.java --demo all

# Graph Fusion Benchmark
jbang examples/jbang/sdk/graph_fusion_example.java --size 8192

# Quantization
jbang examples/jbang/quantizer/gollek-quantizer-turboquant.java --mode demo
```

### Run with Custom Java Version

```bash
# Specify Java 25
jbang --java 25 examples/jbang/common/hello_gollek.java
```

---

## Create Your Own Script

### Minimal Example

Create `my_example.java`:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25
//DEPS tech.kayys.gollek:gollek-ml-ml:0.3.0-SNAPSHOT
//COMPILE_OPTIONS --enable-preview --add-modules jdk.incubator.vector --enable-native-access=ALL-UNNAMED
//RUNTIME_OPTIONS --enable-preview --add-modules jdk.incubator.vector --enable-native-access=ALL-UNNAMED
//REPOS local,mavencentral,github=https://maven.pkg.github.com/bhangun/gollek

import tech.kayys.gollek.ml.Gollek;
import tech.kayys.gollek.ml.tensor.Tensor;

public class my_example {
    public static void main(String[] args) {
        System.out.println("Gollek JBang Example");
        
        // Create and manipulate tensors
        Tensor x = Gollek.randn(3, 4);
        Tensor y = Gollek.randn(4, 5);
        Tensor z = x.matmul(y);
        
        System.out.println("x shape: " + java.util.Arrays.toString(x.shape()));
        System.out.println("y shape: " + java.util.Arrays.toString(y.shape()));
        System.out.println("z shape: " + java.util.Arrays.toString(z.shape()));
    }
}
```

Run it:

```bash
jbang my_example.java
```

---

## Example Categories

### SDK Examples

| Script | Description | Command |
|--------|-------------|---------|
| `gollek-quickstart.java` | SDK quickstart | `jbang sdk/gollek-quickstart.java` |
| `unified_framework_demo.java` | v0.3 capabilities demo | `jbang sdk/unified_framework_demo.java --demo all` |
| `graph_fusion_example.java` | Fusion benchmark | `jbang sdk/graph_fusion_example.java` |

### Edge Inference

| Script | Description | Command |
|--------|-------------|---------|
| `image_classification.java` | Image classification | `jbang edge/image_classification.java --model model.tflite` |
| `object_detection.java` | Object detection | `jbang edge/object_detection.java` |
| `text_generation.java` | Text generation | `jbang edge/text_generation.java` |

### Quantization

| Script | Description | Command |
|--------|-------------|---------|
| `gollek-quantizer-turboquant.java` | TurboQuant demo | `jbang quantizer/gollek-quantizer-turboquant.java --mode demo` |
| `gptq_quantizer.java` | GPTQ quantization | `jbang quantizer/gptq_quantizer.java` |
| `awq_quantizer.java` | AWQ quantization | `jbang quantizer/awq_quantizer.java` |

### NLP

| Script | Description | Command |
|--------|-------------|---------|
| `sentiment_analysis.java` | Sentiment analysis | `jbang nlp/sentiment_analysis.java` |
| `chat_with_qwen_gguf.java` | Chat with Qwen GGUF | `jbang nlp/chat_with_qwen_gguf.java` |

---

## Tips

### Caching

JBang caches dependencies automatically. First run downloads dependencies; subsequent runs are fast:

```bash
# Clear cache if needed
jbang cache clear
```

### Native Access

For native memory access (FFM API), add:

```java
//COMPILE_OPTIONS --enable-native-access=ALL-UNNAMED
//RUNTIME_OPTIONS --enable-native-access=ALL-UNNAMED
```

### Vector API

For SIMD vectorization:

```java
//COMPILE_OPTIONS --add-modules jdk.incubator.vector
//RUNTIME_OPTIONS --add-modules jdk.incubator.vector
```

### Debugging

Run with verbose output:

```bash
jbang -v examples/jbang/common/hello_gollek.java
```

---

## Troubleshooting

### "Dependency resolution failed"

Ensure the Gollek repository is accessible:

```bash
# Test Maven access
curl -I https://maven.pkg.github.com/bhangun/gollek/tech/kayys/gollek/gollek-ml-ml/0.3.0-SNAPSHOT/maven-metadata.xml
```

### "Native memory access denied"

Add native access flags:

```java
//COMPILE_OPTIONS --enable-native-access=ALL-UNNAMED
//RUNTIME_OPTIONS --enable-native-access=ALL-UNNAMED
```

### "Preview features not enabled"

Add preview flags:

```java
//COMPILE_OPTIONS --enable-preview
//RUNTIME_OPTIONS --enable-preview
```

---

## Next Steps

- **[SDK Installation](sdk-installation) - Install as Maven/Gradle dependency
- **[CLI Installation](cli-installation) - Install the Gollek CLI
- **[Examples Index](/examples/jbang/INDEX.md) - Browse all JBang examples
- **[Framework Guide](/docs/framework/) - Learn the ML framework
