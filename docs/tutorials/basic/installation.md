---
layout: default
title: Installation & Hello World
parent: Basic Tutorials
grand_parent: Tutorials
nav_order: 1
---

# 🚀 Installation & Hello World

This tutorial will guide you through the process of setting up the Gollek environment and running your first AI script on local hardware.

## 1. System Requirements

Before you begin, ensure your system meets the following requirements:
- **Java**: JDK 25.
- **Hardware**: 
    - macOS: Apple Silicon (M1/M2/M3/M4) recommended.
    - Linux: x86_64 with modern GLIBC.
- **JBang**: Installed and configured in your shell path for the tutorial script path.

## 2. Installing Gollek CLI

The easiest way to install Gollek is via our automated installation script:

```bash
curl -fsSL https://github.com/bhangun/gollek/releases/latest/download/install.sh | bash
```

Verify the installation:

```bash
java -version
gollek --version
gollek --help
```

## 3. Your First Script: Hello World

Create a new file named `hello_gollek.java`:

```java
//DEPS tech.kayys.gollek:gollek-ml-api:0.1.0-SNAPSHOT
import tech.kayys.gollek.ml.Gollek;
import tech.kayys.gollek.ml.tensor.Tensor;

public class hello_gollek {
    public static void main(String[] args) {
        // Initialize Gollek on the best available device (CPU/GPU)
        Gollek gollek = Gollek.init();
        
        // Create a simple identity matrix
        Tensor t = Tensor.eye(3);
        
        System.out.println("Hello from Gollek!");
        System.out.println("Default Device: " + gollek.getDeviceName());
        System.out.println("Tensor: " + t);
    }
}
```

Run it using JBang:

```bash
jbang hello_gollek.java
```

## 4. Using JBang for Rapid Prototyping {#using-jbang-for-rapid-prototyping}

JBang is the fastest way to try small Gollek scripts because each file can declare its own dependencies. Use it for tutorial experiments, quick tensor checks, and small model sketches before moving code into a Maven or Gradle project.

Useful habits:

- keep one focused script per experiment
- start with a tiny input tensor before loading real data
- print shapes and device names early
- move repeated code into a normal Java project once the experiment becomes reusable

## 🎯 Next Steps

Now that your environment is ready, move on to [Tensors for Beginners](/docs/tutorials/basic/tensors).
