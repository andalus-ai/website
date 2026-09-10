---
layout: default
title: JBang & Jupyter Tutorial
---

<section class="hero hero-compact">
  <p class="eyebrow">Interactive Scripting</p>
  <h1>Mastering Gollek SDK with JBang & Jupyter</h1>
  <p class="lead">Build, train, and deploy neural networks using simple Java scripts. No complex build tools required.</p>
</section>

---

| **Both** | End-to-end workflows from prototype to production | 10 minutes | [Combined Workflows](#combined-workflows) |

---

## Quick Start

### Option 1: Remote Setup (Recommended)

```bash
# Install jbang and Gollek SDK components directly from the repo
curl -sSL https://raw.githubusercontent.com/bhangun/gollek/main/scripts/install.sh | bash
```

This one-liner automatically:
- ✅ Checks for Java 11+
- ✅ Installs or verifies jbang
- ✅ Checks for Jupyter and Maven
- ✅ Provides direct execution links for Gollek examples
- ✅ Checks prerequisites (Java, Maven)
- ✅ Builds Gollek SDK
- ✅ Installs Jupyter kernel
- ✅ Verifies jbang setup
- ✅ Shows next steps

### Option 2: Jupyter Only

```bash
# Install Jupyter
pip install jupyter

# Install Java kernel
pip install ijava

# Start notebook
jupyter notebook
```

Create a new notebook with kernel: **"Gollek SDK (Java)"**

### Option 3: jbang Only

```bash
# Install jbang
curl -Ls https://sh.jbang.dev | bash -s - app setup

# Run example
jbang gollek/sdk/jbang-templates/gollek-template.java
```

---

## Jupyter Integration

### What is Jupyter?

Jupyter is an interactive computing environment where you can:
- Write and execute code in cells
- Document with Markdown
- Visualize outputs and results
- Build reproducible workflows
- Share notebooks with team members

### Installation

#### Prerequisites

```bash
# Check Java version
java -version          # Requires Java 11+

# Check Python/pip
python3 --version      # Requires Python 3.7+
pip --version
```

#### Step-by-Step Installation
## Option 1: Installing Jupyter Kernels using pip
**1. Install Jupyter**
```bash
pip install jupyter
```

**2. Install Java Kernel (ijava)**
```bash
pip install ijava
```

**3. Verify Installation**
```bash
jupyter kernelspec list
```

You should see: `java` kernel in the list.

## Option 2: Installing Jupyter Kernels locally

The simplest way to run Java based Jupyter kernels is to install JBang and run the following:
```bash
jbang install-kernel@jupyter-java
```

#### Alternative: Using the Automated Installer

```bash
cd gollek/sdk/jupyter-kernel
bash install.sh
```

### Your First Jupyter Notebook

#### Step 1: Start Jupyter
```bash
jupyter notebook
```

Browser opens at `http://localhost:8888`

#### Step 2: Create New Notebook

1. Click **"New"** → **"Gollek SDK (Java)"**
2. Name your notebook (e.g., "My First Model")

#### Step 3: Import Gollek SDK

In the first cell, import the modules:

```java
import tech.kayys.gollek.ml.nn.*;
import tech.kayys.gollek.ml.nn.activation.*;
import tech.kayys.gollek.ml.nn.loss.*;
import tech.kayys.gollek.ml.nn.optimizer.*;
```

Press `Shift+Enter` to execute.

#### Step 4: Build a Neural Network

```java
// Create a simple neural network
Sequential model = new Sequential(
    new Linear(784, 128),
    new ReLU(),
    new Linear(128, 64),
    new ReLU(),
    new Linear(64, 10)
);

System.out.println("Model created successfully!");
```

#### Step 5: Create Training Setup

```java
// Loss function
CrossEntropyLoss loss = new CrossEntropyLoss();

// Optimizer
Adam optimizer = new Adam(0.001);

System.out.println("Training setup ready!");
```

### Jupyter Examples

#### Example 1: Binary Classification with Custom Data

```java
import tech.kayys.gollek.ml.tensor.*;
import tech.kayys.gollek.ml.nn.*;

// Create sample data
double[][] X = {
    {0.0, 0.0}, {0.0, 1.0}, {1.0, 0.0}, {1.0, 1.0}
};
double[][] y = {
    {0.0}, {1.0}, {1.0}, {0.0}
};

// Build model
Sequential model = new Sequential(
    new Linear(2, 4),
    new ReLU(),
    new Linear(4, 1),
    new Sigmoid()
);

System.out.println("Binary classification model created!");
```

#### Example 2: Training Loop with Metrics

```java
// Training hyperparameters
int epochs = 50;
double learningRate = 0.01;

// Training loop
for (int epoch = 0; epoch < epochs; epoch++) {
    // Forward pass
    Tensor output = model.forward(input);
    
    // Loss computation
    Tensor loss_val = loss.forward(output, target);
    
    // Backward pass
    loss_val.backward();
    
    // Optimizer step
    optimizer.step();
    optimizer.zeroGrad();
    
    if ((epoch + 1) % 10 == 0) {
        System.out.println("Epoch " + (epoch + 1) + ", Loss: " + loss_val.item());
    }
}
```

#### Example 3: Model Evaluation

```java
// Disable training mode
model.eval();

// Predict on test data
Tensor predictions = model.forward(testInput);

// Calculate accuracy
Accuracy metric = new Accuracy();
double accuracy = metric.compute(predictions, testLabels);

System.out.println("Test Accuracy: " + String.format("%.2f%%", accuracy * 100));
```

#### Example 4: Saving and Loading Models

```java
// Save model weights
model.saveWeights("my_model.bin");

// Load model weights
model.loadWeights("my_model.bin");

System.out.println("Model saved and loaded successfully!");
```

#### Example 5: Hyperparameter Tuning

```java
// Try different learning rates
double[] learningRates = {0.001, 0.01, 0.1};

for (double lr : learningRates) {
    // Create fresh optimizer
    Adam opt = new Adam(lr);
    
    // Train with this LR
    // ... training code ...
    
    System.out.println("Learning rate " + lr + " tested");
}
```

### Jupyter Tips & Tricks

**Performance**
- First Java execution is slow (JIT compilation) — 10-30 seconds
- Subsequent cells run fast
- Keep imports in the first cell for best performance

**Memory**
- Default heap: 512MB
- Increase if needed by modifying `kernel.json`:
  ```json
  "java_executable": "java -Xmx2g"
  ```

**Variables Across Cells**
- Variables persist automatically between cells
- Clear with: `%reset` magic command

**Rich Output**
- Print tables with `System.out.printf()`
- Output arrays for visualization
- Use HTML output for custom visualization

**Debugging**
- Add `System.out.println()` statements
- Use `try-catch` for error handling
- Inspect variables with `System.out.println(variable)`

---

## jbang Integration

### What is jbang?

jbang is a tool that lets you write single-file Java scripts without compilation:
- No build tool required
- Automatic dependency resolution
- Direct script execution
- Perfect for automation and CLI tools

### Installation

#### Prerequisites

```bash
# Check Java version
java -version          # Requires Java 11+
```

#### Install jbang

```bash
curl -Ls https://sh.jbang.dev | bash -s - app setup
```

#### Verify Installation

```bash
jbang --version
```

### Your First jbang Script

#### Step 1: Create a Script

Create `hello-gollek.java`:

```java
//DEPS tech.kayys.gollek:gollek-sdk-nn:0.1.0-SNAPSHOT
//REPOS local,mavencentral,github=https://maven.pkg.github.com/bhangun/gollek

import tech.kayys.gollek.ml.nn.*;

public class hello_gollek {
    public static void main(String[] args) {
        System.out.println("Hello from Gollek!");
        
        // Create a simple model
        Sequential model = new Sequential(
            new Linear(10, 5),
            new ReLU(),
            new Linear(5, 1)
        );
        
        System.out.println("Model created successfully!");
    }
}
```

#### Step 2: Run the Script

```bash
jbang hello-gollek.java
```

That's it! No compilation needed.

### jbang Examples

#### Example 1: Template (Copy & Use)

```java
//DEPS tech.kayys.gollek:gollek-sdk-nn:0.1.0-SNAPSHOT
//REPOS local,mavencentral,github=https://maven.pkg.github.com/bhangun/gollek

import tech.kayys.gollek.ml.nn.*;
import tech.kayys.gollek.ml.autograd.GradTensor;

public class my_script {
    public static void main(String[] args) {
        System.out.println("=== Gollek Neural Network ===");
        
        // TODO: Add your code here
        
        Sequential model = new Sequential(
            new Linear(784, 128),
            new ReLU(),
            new Linear(128, 10)
        );
        
        System.out.println("Model ready for training!");
    }
}
```

#### Example 2: Training Script

```java
//DEPS tech.kayys.gollek:gollek-sdk-nn:0.1.0-SNAPSHOT
//REPOS local,mavencentral,github=https://maven.pkg.github.com/bhangun/gollek

import tech.kayys.gollek.ml.nn.*;
import tech.kayys.gollek.ml.nn.loss.*;
import tech.kayys.gollek.ml.nn.optim.*;
import tech.kayys.gollek.ml.autograd.GradTensor;

public class train_model {
    public static void main(String[] args) {
        // Model
        Sequential model = new Sequential(
            new Linear(28 * 28, 128),
            new ReLU(),
            new Linear(128, 10)
        );
        
        // Loss and optimizer
        CrossEntropyLoss loss = new CrossEntropyLoss();
        Adam optimizer = new Adam(0.001);
        
        // Training (pseudo-code)
        for (int epoch = 1; epoch <= 10; epoch++) {
            System.out.println("Epoch " + epoch);
        }
        
        System.out.println("Training complete!");
    }
}
```

#### Example 3: CLI Tool with Arguments

```java
//DEPS tech.kayys.gollek:gollek-sdk-nn:0.1.0-SNAPSHOT
//REPOS local,mavencentral,github=https://maven.pkg.github.com/bhangun/gollek

import tech.kayys.gollek.ml.nn.*;
import tech.kayys.gollek.ml.nn.optim.*;
import tech.kayys.gollek.ml.autograd.GradTensor;

public class train_cli {
    public static void main(String[] args) {
        int epochs = args.length > 0 ? Integer.parseInt(args[0]) : 10;
        double lr = args.length > 1 ? Double.parseDouble(args[1]) : 0.001;
        
        System.out.println("Training for " + epochs + " epochs");
        System.out.println("Learning rate: " + lr);
        
        Sequential model = new Sequential(
            new Linear(784, 128),
            new ReLU(),
            new Linear(128, 10)
        );
        
        Adam optimizer = new Adam(lr);
        
        for (int e = 1; e <= epochs; e++) {
            System.out.println("Epoch " + e + "...");
        }
        
        System.out.println("Done!");
    }
}
```

**Usage:**
```bash
jbang train_cli.java 20 0.01
```

#### Example 4: Batch Processing

```java
//DEPS tech.kayys.gollek:gollek-sdk-nn:0.1.0-SNAPSHOT
//REPOS local,mavencentral,github=https://maven.pkg.github.com/bhangun/gollek

import tech.kayys.gollek.ml.nn.*;
import java.util.*;

public class batch_process {
    public static void main(String[] args) {
        Sequential model = new Sequential(
            new Linear(10, 5),
            new ReLU(),
            new Linear(5, 1)
        );
        
        // Batch data
        List<String> files = Arrays.asList("file1.txt", "file2.txt", "file3.txt");
        
        for (String file : files) {
            System.out.println("Processing " + file);
            // Process...
        }
        
        System.out.println("Batch processing complete!");
    }
}
```

#### Example 5: Error Handling

```java
//DEPS tech.kayys.gollek:gollek-sdk-nn:0.1.0-SNAPSHOT
//REPOS local,mavencentral,github=https://maven.pkg.github.com/bhangun/gollek

import tech.kayys.gollek.ml.nn.*;

public class error_handling {
    public static void main(String[] args) {
        try {
            Sequential model = new Sequential(
                new Linear(784, 128),
                new ReLU(),
                new Linear(128, 10)
            );
            
            System.out.println("Model created successfully!");
            
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid model configuration: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

### jbang Advanced Features

**Export to JAR**
```bash
jbang -o my_app.jar my_script.java
java -jar my_app.jar
```

**Build for Distribution**
```bash
jbang -o gollek-app.jar my_script.java --build
```

**Run from GitHub**
```bash
jbang https://raw.githubusercontent.com/user/repo/main/script.java
```

**IDE Integration**
```bash
jbang -o pom.xml my_script.java  # Generate pom.xml for IDE
```

---

## Combined Workflows

### Workflow 1: Prototype to Production

```
Step 1: Prototype in Jupyter
  └─ Explore concepts
  └─ Test architectures
  └─ Visualize results
     
Step 2: Convert to jbang
  └─ Move working code
  └─ Clean up notebook
  └─ Add CLI arguments
     
Step 3: Deploy as Script
  └─ Run as scheduled job
  └─ Integrate with systems
  └─ Package for distribution
```

### Workflow 2: Interactive Development

```
Day 1: Jupyter Exploration
  └─ Load datasets
  └─ Build model
  └─ Test hyperparameters
  └─ Document findings
     
Day 2: jbang Automation
  └─ Convert to jbang
  └─ Add scheduling
  └─ Run batch experiments
  └─ Collect results
```

### Workflow 3: Team Collaboration

**Scientist:**
```
1. Build model in Jupyter
2. Export notebook to script
3. Share script with team
```

**Engineer:**
```
1. Take jbang script
2. Integrate with CI/CD
3. Deploy to production
```

---

## Examples in gollek/sdk

The SDK includes ready-to-use examples:

```
gollek/sdk/
├── jbang-templates/
│   ├── gollek-template.java          # Main template
│   └── examples/
│       └── neural-network-example.java  # Complete example
└── jupyter-kernel/
    ├── JUPYTER_SETUP.md              # Full guide
    └── kernel.json                   # Configuration
```

**Run Examples:**
```bash
# jbang example
jbang gollek/sdk/jbang-templates/examples/neural-network-example.java

# Jupyter example
jupyter notebook  # Create new with gollek-template.java contents
```

---

## Configuration

### Environment Variables

```bash
# Java options
export JAVA_OPTS="-Xmx2g -Xms1g"

# Gollek model repository
export GOLLEK_MODEL_REPO_PATH=$HOME/.gollek/models

# Jupyter kernel classpath (if custom)
export GOLLEK_SDK_CLASSPATH=$HOME/.m2/repository/tech/kayys/gollek/gollek-sdk-nn/0.1.0-SNAPSHOT/gollek-sdk-nn-0.1.0-SNAPSHOT.jar
```

### Maven Dependencies

**pom.xml:**
```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-sdk-nn</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

### jbang Dependencies

In your script:
```java
// DEPS tech.kayys.gollek:gollek-sdk-nn:0.1.0-SNAPSHOT
```

---

## Troubleshooting

### Jupyter Issues

**Problem: Kernel not found**
```bash
# Solution: Reinstall kernel
pip install --upgrade ijava
jupyter kernelspec list
```

**Problem: Import errors**
```bash
# Solution: Rebuild Maven
cd gollek/sdk
mvn clean install -DskipTests
```

**Problem: Out of memory**
```bash
# Solution: Increase heap size in kernel.json
"java_executable": "java -Xmx4g"
```

### jbang Issues

**Problem: Dependency not found**
```bash
# Solution: Clear cache and retry
rm -rf ~/.jbang
jbang script.java
```

**Problem: Java version error**
```bash
# Solution: Use Java 11+
java -version  # Check version
jbang --version  # Check jbang
```

**Problem: Script exits immediately**
```bash
# Solution: Add error handling
jbang script.java 2>&1
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `NoClassDefFoundError` | Missing dependency | Check DEPS comments |
| `ClassCastException` | Wrong tensor type | Verify shape/dtype |
| `OutOfMemoryError` | Too large model/data | Increase heap size |
| `FileNotFoundException` | Missing file | Check file paths |

---

## Performance Tips

### Jupyter
- Keep imports in first cell (5-10% faster)
- Batch operations over loops (100x faster)
- Use `.eval()` mode for inference (20% faster)
- Monitor memory with `Runtime.getRuntime().totalMemory()`

### jbang
- Compilation cached in `~/.jbang` (2x faster after first run)
- Use `-o output.jar` for repeated runs
- Add `// DEPS` at top for faster dependency resolution
- Use Maven Central vs JCenter (faster)

### Both
- Load models once, reuse many times
- Pre-allocate tensors when possible
- Batch inference over single inference
- Use native libraries for heavy computation

---

## Next Steps

1. **Start with One-Command Setup**
   ```bash
   cd gollek/sdk && bash install-jupyter-jbang.sh
   ```

2. **Choose Your Path**
   - **Interactive**: Read [Jupyter Integration](/docs/tutorials/integrations/jupyter)
   - **Scripting**: Read [JBang Integration](/docs/tutorials/integrations/jbang)
   - **Learning**: Check [Examples Docs](/docs/setup/examples-docs)

3. **Build Something**
   - Create first notebook
   - Write first script
   - Combine for end-to-end workflow

4. **Get Help**
   - [Troubleshooting Guide](/docs/setup/troubleshooting)
   - [API Documentation](/docs/framework/ml-sdk)
   - [Examples Docs](/docs/setup/examples-docs)

---

## Key Resources

| Resource | Purpose | Location |
|----------|---------|----------|
| Quick Overview | 5-min intro | [JUPYTER_JBANG_README.md](https://github.com/wayang-platform/gollek-sdk) |
| Jupyter Guide | Complete setup | [JUPYTER_SETUP.md](https://github.com/wayang-platform/gollek-sdk) |
| jbang Guide | Complete setup | [JBANG_SETUP.md](https://github.com/wayang-platform/gollek-sdk) |
| Examples | Working patterns | [EXAMPLES.md](https://github.com/wayang-platform/gollek-sdk) |
| Troubleshooting | Problem solutions | [TROUBLESHOOTING.md](https://github.com/wayang-platform/gollek-sdk) |
| ML SDK API | API reference | [ML SDK Docs](/docs/framework/ml-sdk) |

---

## Summary

| Aspect | Jupyter | jbang | Both |
|--------|---------|-------|------|
| **Use Case** | Exploration | Automation | Full Workflow |
| **Setup** | 5 min | 2 min | 10 min |
| **Best For** | Learning | Production | Teams |
| **Visualization** | Rich output | Console | Mixed |
| **Sharing** | Notebooks | Scripts | Both |

Ready to start? Run:
```bash
bash gollek/sdk/install-jupyter-jbang.sh
```

[Home](/docs/index) · [ML SDK](/docs/framework/ml-sdk) · [Examples Docs](/docs/setup/examples-docs) · [Troubleshooting](/docs/setup/troubleshooting)
