# Native Compilation Guide

Building native images with GraalVM for optimal performance and minimal memory footprint.

---

## Prerequisites

### GraalVM Installation

```bash
# macOS with Homebrew
brew install --cask graalvm

# Or download from Oracle
# https://www.oracle.com/java/technologies/downloads/#graalvm

# Set JAVA_HOME
export JAVA_HOME=/Library/Java/JavaVirtualMachines/graalvm-25.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

# Verify installation
java -version
# Should show: Oracle GraalVM
```

### Native Image Tool

```bash
# Install native-image tool (included with GraalVM 25+)
gu install native-image

# Verify
native-image --version
```

### Platform-Specific Requirements

#### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

#### Linux
```bash
# Install build essentials
sudo apt install build-essential zlib1g-dev
```

#### Windows (WSL2 recommended)
```bash
# Install Visual Studio Build Tools
# Or use WSL2 with Linux instructions
```

---

## Building Native Images

### Gollek CLI Native Build

```bash
cd inference-gollek/ui/gollek-cli

# Standard native build
mvn clean package -Pnative -DskipTests

# Native build with optimizations
mvn clean package -Pnative -DskipTests \
    -Dnative-image.build-args=-O3 \
    -Dnative-image.build-args=--gc=G1

# Output: target/gollek-cli-*-runner (executable)
```

### Cloud Providers Native Build

```bash
# OpenAI Provider
cd inference-gollek/extension/cloud/gollek-ext-cloud-openai
mvn clean package -Pnative -DskipTests

# Anthropic Provider
cd inference-gollek/extension/cloud/gollek-ext-cloud-anthropic
mvn clean package -Pnative -DskipTests

# All cloud providers
cd inference-gollek/extension/cloud
mvn clean package -Pnative -DskipTests
```

### GPU Kernels Native Build

```bash
# Note: GPU kernels require CUDA/ROCm runtime
# Native image includes FFM bindings but requires GPU drivers at runtime

# CUDA Kernel
cd inference-gollek/extension/kernel/gollek-kernel-cuda
mvn clean package -Pnative -DskipTests

# Blackwell Kernel
cd inference-gollek/extension/kernel/gollek-kernel-blackwell
mvn clean package -Pnative -DskipTests
```

---

## Native Image Configuration

### Reflection Configuration

Native image requires explicit reflection configuration. Each module includes:

```
src/main/resources/META-INF/native-image/
├── reflect-config.json      # Reflection configuration
├── resource-config.json     # Resource inclusion
└── jni-config.json          # JNI configuration (if needed)
```

### Example Configuration

**reflect-config.json:**
```json
[
  {
    "name": "tech.kayys.gollek.provider.openai.OpenAiProvider",
    "allDeclaredConstructors": true,
    "allPublicConstructors": true,
    "allDeclaredMethods": true,
    "allPublicMethods": true
  },
  {
    "name": "tech.kayys.gollek.provider.openai.OpenAiRequest",
    "allDeclaredFields": true,
    "allDeclaredMethods": true
  }
]
```

**resource-config.json:**
```json
{
  "resources": [
    {"pattern": "META-INF/services/.*"},
    {"pattern": "META-INF/jandex.idx"}
  ],
  "bundles": [],
  "jni": false
}
```

---

## Build Profiles

### Available Profiles

| Profile | Description | Use Case |
|---------|-------------|----------|
| `native` | Standard native build | Production deployment |
| `native-sources` | Generate native sources | Debugging/inspection |
| `native-test` | Native test executable | Testing native image |

### Profile Usage

```bash
# Standard native build
mvn package -Pnative

# Generate native sources
mvn package -Pnative-sources

# Build and run native tests
mvn test -Pnative-test
```

---

## Optimization Options

### Performance Optimizations

```bash
# Maximum optimization
mvn package -Pnative \
    -Dnative-image.build-args=-O3 \
    -Dnative-image.build-args=--gc=G1

# Fast startup optimization
mvn package -Pnative \
    -Dnative-image.build-args=--optimize-for-size \
    -Dnative-image.build-args=--strict-image-heap

# Small binary size
mvn package -Pnative \
    -Dnative-image.build-args=--optimize-for-size
```

### Memory Optimizations

```bash
# Use G1 GC for large heaps
-Dnative-image.build-args=--gc=G1

# Use Serial GC for small heaps
-Dnative-image.build-args=--gc=serial

# Enable heap dumping on OOM
-Dnative-image.build-args=-XX:+HeapDumpOnOutOfMemoryError
```

---

## Runtime Configuration

### Environment Variables

```bash
# OpenAI API Key
export OPENAI_API_KEY=sk-...

# Anthropic API Key
export ANTHROPIC_API_KEY=sk-ant-...

# CUDA Library Path (for GPU kernels)
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
```

### Native Image Options

```bash
# Run with custom heap size
./gollek-cli-runner -Xmx2g

# Enable verbose GC logging
./gollek-cli-runner -XX:+PrintGC -Xlog:gc*.log

# Run with G1 GC
./gollek-cli-runner -XX:+UseG1GC
```

---

## Troubleshooting

### Common Issues

#### "Error: Class initialization failed"

**Solution:** Add class to initialization configuration:

```json
{
  "name": "tech.kayys.ProblematicClass",
  "condition": {
    "typeReachable": "tech.kayys.TriggerClass"
  }
}
```

#### "Error: Unsupported features java.lang.reflect.Field"

**Solution:** Add field to reflection config:

```json
{
  "name": "tech.kayys.Class",
  "allDeclaredFields": true
}
```

#### "Error: Resource not found"

**Solution:** Add resource pattern to resource-config.json:

```json
{
  "resources": [
    {"pattern": "path/to/resource/.*"}
  ]
}
```

#### "Error: JNI access required"

**Solution:** Enable JNI in resource-config.json:

```json
{
  "jni": true
}
```

### Debug Native Image

```bash
# Build with debug symbols
mvn package -Pnative \
    -Dnative-image.build-args=-g

# Run with tracing
./gollek-cli-runner \
    -Dgraal.TraceRuntimeCalls=true \
    -Dgraal.PrintAnalysisCallTree

# Generate report
native-image --report-unsupported-elements-at-runtime
```

---

## Performance Comparison

### Binary Size

| Build Type | Size | Startup Time | Memory Usage |
|------------|------|--------------|--------------|
| JVM (JAR) | ~50 MB | ~2-5s | ~200 MB |
| Native Image | ~30 MB | ~50-100ms | ~50 MB |

### Runtime Performance

| Metric | JVM | Native Image | Improvement |
|--------|-----|--------------|-------------|
| Cold Start | 2-5s | 50-100ms | 20-50x faster |
| Memory Footprint | 200 MB | 50 MB | 4x smaller |
| Peak Performance | 100% | 90-95% | ~5% slower |

---

## Platform-Specific Notes

### macOS (Apple Silicon)

```bash
# Build for Apple Silicon
mvn package -Pnative \
    -Dnative-image.build-args=--macos

# Universal binary (Intel + Apple Silicon)
mvn package -Pnative \
    -Dnative-image.build-args=--macos \
    -Dnative-image.build-args=-arch:arm64,x86_64
```

### Linux

```bash
# Static linking (fully standalone binary)
mvn package -Pnative \
    -Dnative-image.build-args=--static \
    -Dnative-image.build-args=--libc=musl

# Requires musl-dev: sudo apt install musl-dev
```

### Docker

```dockerfile
# Multi-stage native build
FROM ghcr.io/graalvm/graalvm-ce:25 AS build
COPY . /app
WORKDIR /app
RUN mvn package -Pnative -DskipTests

FROM gcr.io/distroless/base-debian12
COPY --from=build /app/target/*-runner /app/runner
ENTRYPOINT ["/app/runner"]
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Native Build

on: [push, pull_request]

jobs:
  native-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up GraalVM
        uses: graalvm/setup-graalvm@v1
        with:
          java-version: '25'
          distribution: 'graalvm'
          components: 'native-image'
      
      - name: Build native image
        run: mvn -B package -Pnative -DskipTests
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: native-binary
          path: target/*-runner
```

---

## Resources

- [GraalVM Native Image Documentation](https://www.graalvm.org/latest/reference-manual/native-image/)
- [Maven Native Plugin](https://www.graalvm.org/latest/reference-manual/native-image/maven/)
- [Native Image Build Configuration](https://github.com/oracle/graal/blob/master/docs/reference-manual/native-image/BuildConfiguration.md)

---

[Back to GPU Runtime Docs](/docs/runtime/gpu-runtime-docs) &nbsp; [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
