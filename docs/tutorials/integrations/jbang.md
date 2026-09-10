---
layout: default
title: JBang Integration
parent: Platform Integrations
grand_parent: Tutorials
nav_order: 1
---

# ⚡ JBang: Rapid AI Prototyping

[JBang](https://jbang.dev/) allows you to run Java as a script, which is perfect for AI experiments and model testing without the overhead of a full Maven or Gradle project.

## 1. Installation

If you don't have JBang installed, run:

```bash
curl -Ls https://sh.jbang.dev | bash -s - app setup
```

## 2. Using Gollek Dependencies

JBang uses the `//DEPS` directive to automatically download and cache your artifacts.

```java
//DEPS tech.kayys.gollek:gollek-ml-api:0.1.0-SNAPSHOT
import tech.kayys.gollek.ml.tensor.Tensor;

public class TestTensor {
    public static void main(String[] args) {
        System.out.println(Tensor.ones(3, 3));
    }
}
```

## 3. Running Scripts

You can run your scripts directly from the command line:

```bash
jbang TestTensor.java
```

## 4. Using the Gollek Template

We provide a built-in template to jumpstart your development:

```bash
cd gollek/framework/integration/jbang
jbang jbang-templates/gollek_template.java
```

---

[Back to Integrations Overview](./)
