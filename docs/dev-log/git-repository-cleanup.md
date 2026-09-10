---
layout: default
title: Git Repository Cleanup
nav_order: 10
parent: Getting Started
---

# Git Repository Cleanup

{: .highlight }
**IMPORTANT**: The Gollek repository has been cleaned to remove large binary files. Follow this guide if you encounter issues.

## Overview

The Gollek inference repository has been cleaned to remove large native library binaries from git tracking. This reduces repository size and improves clone/pull performance.

### Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Repository Size | 33M | 23M | **30% reduction** |
| Large Binary Files | 42 | 0 | **100% removed** |
| Tracked Libraries | Yes | No | Clean history |

---

## What Was Removed

The following large files were removed from git tracking:

### Native Libraries (40MB+)
- `libonnxruntime.dylib` (26MB) - ONNX Runtime
- `libllama.dylib` (2.1MB) - llama.cpp GGUF
- `libgollek_metal.dylib` - Metal kernel
- Other platform-specific libraries

### Build Artifacts
- `target/` directories
- `CMakeFiles/` build directories
- `cmake-build-*/` directories
- Benchmark JARs (`benchmarks.jar`)

### Generated Code
- Auto-generated Java bindings (`llama_h.java`, etc.)
- CMake build logs

---

## Standard Native Library Location

Native libraries are now stored in **`~/.gollek/libs/`** instead of being tracked in git.

### Directory Structure

```
~/.gollek/
└── libs/
    ├── llama/              # GGUF / llama.cpp libraries
    │   ├── libllama.dylib
    │   ├── libggml.dylib
    │   └── libggml-base.dylib
    │
    ├── onnxruntime/        # ONNX Runtime libraries
    │   └── libonnxruntime.dylib
    │
    ├── libtorch/           # PyTorch / LibTorch libraries
    │   ├── libtorch.dylib
    │   └── libtorch_cpu.dylib
    │
    └── litert/            # TensorFlow Lite libraries
```

### Benefits

✅ No large binaries in git repository  
✅ Faster clone and pull operations  
✅ Easy library updates and version management  
✅ Consistent across all runners (GGUF, ONNX, LibTorch, TFLite)  
✅ Platform-specific libraries handled automatically  

---

## Quick Start

### For New Users

1. **Clone the repository**
   ```bash
   git clone https://github.com/gollek-ai/inference-gollek.git
   cd inference-gollek
   ```

2. **Install native libraries**
   ```bash
   make -f Makefile.native install-native-libs
   ```

3. **Verify installation**
   ```bash
   ls -lh ~/.gollek/libs/*/
   ```

4. **Start using Gollek**
   ```bash
   ./mvnw quarkus:dev -f ui/gollek-cli
   ```

### For Existing Users

If you already have the repository, you need to install libraries to the new location:

```bash
# Pull latest changes
git pull

# Install libraries to standard location
make -f Makefile.native install-native-libs

# Verify
ls -lh ~/.gollek/libs/*/
```

---

## Installation Methods

### Method 1: Makefile Helper (Recommended)

```bash
# Install all native libraries
make -f Makefile.native install-native-libs

# Install specific runners
make -f Makefile.native install-gguf-libs
make -f Makefile.native install-onnx-libs
make -f Makefile.native install-libtorch-libs
make -f Makefile.native install-litert-libs

# Verify installation
make -f Makefile.native verify-libs
```

### Method 2: Manual Installation

#### GGUF / llama.cpp

```bash
# Create directory
mkdir -p ~/.gollek/libs/llama

# Copy from build directory
cp plugins/runner/gguf/gollek-ext-runner-gguf/src/main/resources/native-libs/cpu/*.dylib ~/.gollek/libs/llama/

# Set permissions
chmod +x ~/.gollek/libs/llama/*.dylib

# Clear macOS quarantine (if needed)
xattr -dr com.apple.quarantine ~/.gollek/libs/llama
```

#### ONNX Runtime

```bash
# Create directory
mkdir -p ~/.gollek/libs/onnxruntime

# Copy from build directory
cp plugins/runner/onnx/gollek-runner-onnx/src/main/cpp/onnxruntime/build/onnxruntime-osx-arm64-1.19.2/lib/libonnxruntime.dylib ~/.gollek/libs/onnxruntime/

# Set permissions
chmod +x ~/.gollek/libs/onnxruntime/*.dylib
```

### Method 3: Download Pre-built Binaries

#### GGUF / llama.cpp

```bash
cd ~/.gollek/libs/llama
curl -L https://github.com/ggerganov/llama.cpp/releases/latest/download/llama-bin-macos-arm64.tar.gz | tar xz
```

#### ONNX Runtime

```bash
cd ~/.gollek/libs/onnxruntime
curl -L https://github.com/microsoft/onnxruntime/releases/download/v1.19.2/onnxruntime-osx-arm64-1.19.2.tgz | tar xz
cp lib/libonnxruntime.dylib .
```

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOLLEK_NATIVE_LIB_DIR` | Override base directory | `~/.gollek/libs/` |
| `GOLLEK_LLAMA_LIB_PATH` | Explicit llama.cpp library path | - |
| `GOLLEK_LLAMA_LIB_DIR` | Explicit llama.cpp directory | `~/.gollek/libs/llama/` |
| `GOLLEK_ONNX_LIB_PATH` | Explicit ONNX Runtime library path | - |
| `GOLLEK_ONNX_LIB_DIR` | Explicit ONNX Runtime directory | `~/.gollek/libs/onnxruntime/` |
| `GOLLEK_LIBTORCH_SOURCE_DIR` | LibTorch source directory | `~/.gollek/source/vendor/libtorch` |

### Example Configuration

```bash
# Use custom library directory
export GOLLEK_NATIVE_LIB_DIR=/opt/gollek/libs

# Use specific library file
export GOLLEK_LLAMA_LIB_PATH=/custom/path/libllama.dylib

# Run with configuration
java -jar gollek.jar chat --model <model>
```

### Loading Priority

Libraries are loaded in this priority order:

1. **Explicit configuration** (config file or command-line)
2. **Environment variables** (`GOLLEK_*_LIB_PATH`)
3. **Standard location** (`~/.gollek/libs/<runner>/`)
4. **Legacy locations** (source vendor, build directories)
5. **System library path** (`java.library.path`)

---

## Troubleshooting

### Library Not Found

**Error**: `Native library not found at ~/.gollek/libs/llama/libllama.dylib`

**Solutions**:

1. **Verify library exists**
   ```bash
   ls -lh ~/.gollek/libs/llama/
   ```

2. **Set explicit path**
   ```bash
   export GOLLEK_LLAMA_LIB_PATH=~/.gollek/libs/llama/libllama.dylib
   ```

3. **Reinstall libraries**
   ```bash
   make -f Makefile.native install-gguf-libs
   ```

### UnsatisfiedLinkError

**Error**: `UnsatisfiedLinkError: dlopen: library not loaded`

**Solutions**:

1. **Check dependencies** (macOS)
   ```bash
   otool -L ~/.gollek/libs/llama/libllama.dylib
   ```

2. **Ensure all dependencies are present**
   ```bash
   ls -lh ~/.gollek/libs/llama/
   # Should show: libllama.dylib, libggml.dylib, libggml-base.dylib, etc.
   ```

3. **Try with debug logging**
   ```bash
   java -Dgollek.logging.level=DEBUG -jar gollek.jar chat --model <model>
   ```

### macOS Quarantine Issues

**Error**: `Library not loaded: cannot load file` or `code signature invalid`

**Solution**:

```bash
# Clear quarantine attributes
xattr -dr com.apple.quarantine ~/.gollek/libs/llama
xattr -dr com.apple.quarantine ~/.gollek/libs/onnxruntime
xattr -dr com.apple.quarantine ~/.gollek/libs/libtorch

# Verify
xattr -l ~/.gollek/libs/llama/libllama.dylib
```

### Permission Issues

**Error**: `Permission denied`

**Solution**:

```bash
# Set executable permissions
chmod +x ~/.gollek/libs/llama/*.dylib
chmod +x ~/.gollek/libs/onnxruntime/*.dylib
chmod +x ~/.gollek/libs/libtorch/*.dylib
```

---

## Migration from Old Structure

If you have libraries in old locations, migrate them:

```bash
# Migrate llama.cpp
if [ -d ~/.gollek/source/vendor/llama.cpp ]; then
    mkdir -p ~/.gollek/libs/llama
    cp ~/.gollek/source/vendor/llama.cpp/build/bin/*.dylib ~/.gollek/libs/llama/ 2>/dev/null || true
fi

# Migrate ONNX Runtime
if [ -d ~/.gollek/source/vendor/onnxruntime ]; then
    mkdir -p ~/.gollek/libs/onnxruntime
    cp ~/.gollek/source/vendor/onnxruntime/lib/*.dylib ~/.gollek/libs/onnxruntime/ 2>/dev/null || true
fi

# Set permissions
chmod +x ~/.gollek/libs/*/*.dylib

# Clear quarantine
xattr -dr com.apple.quarantine ~/.gollek/libs/
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Install native libraries
        run: make -f Makefile.native install-native-libs
      
      - name: Build
        run: ./mvnw clean install -DskipTests
      
      - name: Test
        run: ./mvnw test
```

### Docker Example

```dockerfile
FROM eclipse-temurin:21-jdk-alpine

RUN apk add --no-cache make curl

WORKDIR /app
COPY . .

# Install native libraries
RUN make -f Makefile.native install-native-libs

# Build
RUN ./mvnw clean package -DskipTests

CMD ["java", "-jar", "target/gollek.jar"]
```

---

## Maintenance

### Check Installation

```bash
# List all installed libraries
ls -lh ~/.gollek/libs/*/

# Verify with Makefile
make -f Makefile.native verify-libs
```

### Update Libraries

```bash
# Remove old libraries
make -f Makefile.native clean-native-libs

# Install fresh copies
make -f Makefile.native install-native-libs
```

### Clean Uninstall

```bash
# Remove all Gollek libraries
rm -rf ~/.gollek/libs/

# Or remove entire Gollek directory
rm -rf ~/.gollek/
```

---

## Related Documentation

- [Native Library Management Guide](/docs/runtime/native-library-guide) - Complete technical guide
- [Developer Guidance](developer-guidance.md) - Development best practices
- [CLI Reference](/docs/setup/cli-reference) - Command-line interface

---

## Need Help?

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting) above
2. Review the [Native Library Management Guide](/docs/runtime/native-library-guide)
3. Open an issue on [GitHub](https://github.com/gollek-ai/inference-gollek/issues)
4. Check existing discussions on [GitHub Discussions](https://github.com/gollek-ai/inference-gollek/discussions)
