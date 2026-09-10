# Plugin Templates

**Date**: 2026-03-25  
**Version**: 2.0.0  
**Status**: ✅ **COMPLETE**

---

## Overview

This page provides downloadable templates for creating new plugins with the manifest-based plugin system v2.0.

---

## Runner Plugin Template

### POM Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>tech.kayys.gollek</groupId>
        <artifactId>gollek-runner-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>gollek-plugin-runner-custom</artifactId>
    <name>Gollek Plugin :: Custom Runner</name>
    <description>Custom format runner plugin</description>

    <properties>
        <maven.compiler.source>25</maven.compiler.source>
        <maven.compiler.target>25</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- Runner Plugin Core -->
        <dependency>
            <groupId>tech.kayys.gollek</groupId>
            <artifactId>gollek-plugin-runner-core</artifactId>
            <version>${project.version}</version>
        </dependency>

        <!-- Logging -->
        <dependency>
            <groupId>org.jboss.logging</groupId>
            <artifactId>jboss-logging</artifactId>
            <scope>provided</scope>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.4.2</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
                        </manifest>
                        <manifestEntries>
                            <!-- Required -->
                            <Plugin-Id>custom-runner</Plugin-Id>
                            <Plugin-Type>runner</Plugin-Type>
                            <Plugin-Version>${project.version}</Plugin-Version>
                            <Plugin-Name>Custom Runner</Plugin-Name>
                            <Plugin-Provider>tech.kayys.gollek.plugin.runner.custom.CustomRunnerPlugin</Plugin-Provider>
                            
                            <!-- Capabilities -->
                            <Plugin-Capabilities>custom-inference, custom-format</Plugin-Capabilities>
                            
                            <!-- Dependencies -->
                            <Plugin-Dependencies></Plugin-Dependencies>
                            
                            <!-- Deployment modes -->
                            <Plugin-Deployment>standalone,microservice,hybrid</Plugin-Deployment>
                            
                            <!-- Metadata -->
                            <Plugin-Author>Your Name</Plugin-Author>
                            <Plugin-Vendor>Your Organization</Plugin-Vendor>
                            <Plugin-License>MIT</Plugin-License>
                            
                            <!-- Performance -->
                            <Plugin-Performance-Speedup>1x (baseline)</Plugin-Performance-Speedup>
                            <Plugin-Performance-Memory-Overhead>50-100MB</Plugin-Performance-Memory-Overhead>
                            
                            <!-- Supported Formats -->
                            <Supported-Formats>.custom</Supported-Formats>
                            <Supported-Architectures>custom-arch</Supported-Architectures>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Plugin Implementation Template

```java
/*
 * MIT License
 *
 * Copyright (c) 2026 Your Name
 */

package tech.kayys.gollek.plugin.runner.custom;

import org.jboss.logging.Logger;
import tech.kayys.gollek.plugin.runner.*;

import java.util.*;

/**
 * Custom runner plugin implementation.
 */
public class CustomRunnerPlugin implements RunnerPlugin {

    private static final Logger LOG = Logger.getLogger(CustomRunnerPlugin.class);

    public static final String ID = "custom-runner";

    private RunnerConfig config;
    private volatile boolean initialized = false;
    private volatile boolean healthy = false;

    @Override
    public String id() {
        return ID;
    }

    @Override
    public String name() {
        return "Custom Runner";
    }

    @Override
    public String version() {
        return "2.0.0";
    }

    @Override
    public String description() {
        return "Custom format runner plugin";
    }

    @Override
    public String format() {
        return "custom";
    }

    @Override
    public RunnerValidationResult validate() {
        LOG.info("Validating custom runner...");
        
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        // Add validation logic here
        if (!isCustomFormatAvailable()) {
            errors.add("Custom format not available");
            return RunnerValidationResult.invalid(errors);
        }

        LOG.infof("Custom runner validation complete: %d errors, %d warnings", 
            errors.size(), warnings.size());
        
        return RunnerValidationResult.builder()
            .valid(errors.isEmpty())
            .errors(errors)
            .warnings(warnings)
            .build();
    }

    @Override
    public void initialize(RunnerContext context) throws RunnerException {
        if (initialized) {
            throw new RunnerInitializationException(ID, "Already initialized");
        }

        LOG.info("Initializing custom runner...");

        try {
            this.config = context.getConfig();
            
            // Initialize custom backend
            initializeCustomBackend();
            
            initialized = true;
            healthy = true;
            
            LOG.info("Custom runner initialized successfully");
            
        } catch (Exception e) {
            initialized = false;
            healthy = false;
            LOG.error("Failed to initialize custom runner", e);
            throw new RunnerInitializationException(ID, 
                "Failed to initialize: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean isAvailable() {
        return isCustomFormatAvailable();
    }

    @Override
    public RunnerHealth health() {
        if (!initialized) {
            return RunnerHealth.unhealthy("Not initialized");
        }

        if (!healthy) {
            return RunnerHealth.unhealthy("Plugin unhealthy");
        }

        Map<String, Object> details = new HashMap<>();
        details.put("initialized", initialized);
        details.put("healthy", healthy);
        
        return healthy ? 
            RunnerHealth.healthy(details) :
            RunnerHealth.unhealthy("Custom runner unhealthy", details);
    }

    @Override
    public Set<String> supportedFormats() {
        return Set.of(".custom");
    }

    @Override
    public Set<String> supportedArchitectures() {
        return Set.of("custom-arch");
    }

    @Override
    public Set<RequestType> supportedRequestTypes() {
        return Set.of(RequestType.INFER);
    }

    @Override
    public <T> RunnerResult<T> execute(RunnerRequest request, RunnerContext context) 
            throws RunnerException {
        if (!initialized) {
            throw new RunnerExecutionException(ID, request.getType().name(), 
                "Custom runner not initialized");
        }

        if (!healthy) {
            throw new RunnerExecutionException(ID, request.getType().name(), 
                "Custom runner unhealthy");
        }

        try {
            LOG.debugf("Executing custom operation: %s", request.getType());
            
            RunnerResult<T> result = switch (request.getType()) {
                case INFER -> executeInference(request, context);
                default -> throw new UnknownRequestException(request.getType());
            };
            
            return result;
            
        } catch (RunnerException e) {
            throw e;
        } catch (Exception e) {
            throw new RunnerExecutionException(ID, request.getType().name(),
                "Execution failed: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> metadata() {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("format", "custom");
        metadata.put("version", version());
        metadata.put("supported_operations", supportedRequestTypes());
        
        if (initialized) {
            metadata.put("initialized", true);
            metadata.put("healthy", healthy);
        }
        
        return metadata;
    }

    @Override
    public void shutdown() {
        if (!initialized) {
            return;
        }

        LOG.info("Shutting down custom runner...");

        try {
            shutdownCustomBackend();
            initialized = false;
            healthy = false;
            LOG.info("Custom runner shutdown complete");
        } catch (Exception e) {
            LOG.error("Error shutting down custom runner", e);
        }
    }

    // Internal methods
    private boolean isCustomFormatAvailable() {
        // Check if custom format is available
        return true;
    }

    private void initializeCustomBackend() throws RunnerException {
        // Initialize custom backend
        LOG.info("Custom backend initialized");
    }

    private void shutdownCustomBackend() {
        // Shutdown custom backend
        LOG.debug("Custom backend shutdown");
    }

    @SuppressWarnings("unchecked")
    private <T> RunnerResult<T> executeInference(RunnerRequest request, RunnerContext context) {
        LOG.infof("Executing custom inference");
        
        // Implement inference logic here
        
        Map<String, Object> result = Map.of(
            "status", "success",
            "operation", "infer",
            "format", "custom"
        );
        
        return (RunnerResult<T>) RunnerResult.success(result);
    }
}
```

---

## Kernel Plugin Template

### POM Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>tech.kayys.gollek</groupId>
        <artifactId>gollek-kernel-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>gollek-plugin-kernel-custom</artifactId>
    <name>Gollek Plugin :: Custom Kernel</name>
    <description>Custom kernel plugin for GPU acceleration</description>

    <properties>
        <maven.compiler.source>25</maven.compiler.source>
        <maven.compiler.target>25</maven.compiler.target>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.4.2</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
                        </manifest>
                        <manifestEntries>
                            <!-- Required -->
                            <Plugin-Id>custom-kernel</Plugin-Id>
                            <Plugin-Type>kernel</Plugin-Type>
                            <Plugin-Version>${project.version}</Plugin-Version>
                            <Plugin-Name>Custom Kernel</Plugin-Name>
                            <Plugin-Provider>tech.kayys.gollek.plugin.kernel.custom.CustomKernelPlugin</Plugin-Provider>
                            
                            <!-- Capabilities -->
                            <Plugin-Capabilities>custom-acceleration, gpu-inference</Plugin-Capabilities>
                            
                            <!-- Dependencies -->
                            <Plugin-Dependencies></Plugin-Dependencies>
                            
                            <!-- Deployment modes -->
                            <Plugin-Deployment>microservice,hybrid</Plugin-Deployment>
                            
                            <!-- Metadata -->
                            <Plugin-Author>Your Name</Plugin-Author>
                            <Plugin-Vendor>Your Organization</Plugin-Vendor>
                            <Plugin-License>MIT</Plugin-License>
                            
                            <!-- GPU Requirements -->
                            <Plugin-GPU-Requirement>Custom GPU, Driver X.Y+</Plugin-GPU-Requirement>
                            <Plugin-Minimum-Compute-Capability>6.0</Plugin-Minimum-Compute-Capability>
                            <Plugin-Minimum-Memory>4GB</Plugin-Minimum-Memory>
                            
                            <!-- Performance -->
                            <Plugin-Performance-Speedup>2-5x (vs CPU)</Plugin-Performance-Speedup>
                            <Plugin-Performance-Memory-Overhead>50-100MB</Plugin-Performance-Memory-Overhead>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## Optimization Plugin Template

### POM Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>tech.kayys.gollek</groupId>
        <artifactId>gollek-optimization-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>gollek-plugin-optimization-custom</artifactId>
    <name>Gollek Plugin :: Custom Optimization</name>
    <description>Custom optimization plugin</description>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.4.2</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
                        </manifest>
                        <manifestEntries>
                            <!-- Required -->
                            <Plugin-Id>custom-optimization</Plugin-Id>
                            <Plugin-Type>optimization</Plugin-Type>
                            <Plugin-Version>${project.version}</Plugin-Version>
                            <Plugin-Name>Custom Optimization</Plugin-Name>
                            <Plugin-Provider>tech.kayys.gollek.plugin.optimization.custom.CustomOptimizationPlugin</Plugin-Provider>
                            
                            <!-- Capabilities -->
                            <Plugin-Capabilities>custom-optimization, performance-boost</Plugin-Capabilities>
                            
                            <!-- Dependencies -->
                            <Plugin-Dependencies>cuda-kernel</Plugin-Dependencies>
                            
                            <!-- Deployment modes -->
                            <Plugin-Deployment>microservice,hybrid</Plugin-Deployment>
                            
                            <!-- Metadata -->
                            <Plugin-Author>Your Name</Plugin-Author>
                            <Plugin-Vendor>Your Organization</Plugin-Vendor>
                            <Plugin-License>MIT</Plugin-License>
                            
                            <!-- GPU Requirements -->
                            <Plugin-GPU-Requirement>CUDA 11.0+</Plugin-GPU-Requirement>
                            <Plugin-Minimum-Compute-Capability>6.0</Plugin-Minimum-Compute-Capability>
                            
                            <!-- Performance -->
                            <Plugin-Performance-Speedup>1.5-2x</Plugin-Performance-Speedup>
                            <Plugin-Performance-Memory-Overhead>50-100MB</Plugin-Performance-Memory-Overhead>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## Manifest Entry Reference

### Required Entries

| Entry | Description | Example |
|-------|-------------|---------|
| `Plugin-Id` | Unique plugin identifier | `gguf-runner` |
| `Plugin-Type` | Plugin type | `runner`, `kernel`, `optimization`, `provider`, `feature` |
| `Plugin-Version` | Semantic version | `2.0.0` |
| `Plugin-Name` | Human-readable name | `GGUF Runner` |
| `Plugin-Provider` | Fully qualified class name | `tech.kayys.gollek.plugin.runner.gguf.GGUFRunnerPlugin` |

### Optional Entries

| Entry | Description | Example |
|-------|-------------|---------|
| `Plugin-Capabilities` | Comma-separated capabilities | `gguf-inference, llama-architecture` |
| `Plugin-Dependencies` | Comma-separated dependencies | `cuda-kernel` |
| `Plugin-Deployment` | Supported deployment modes | `standalone,microservice,hybrid` |
| `Plugin-Author` | Author name | `Gollek Team` |
| `Plugin-Vendor` | Vendor name | `Kayys.tech` |
| `Plugin-License` | License | `MIT` |
| `Plugin-GPU-Requirement` | GPU requirements | `NVIDIA GPU, CUDA 11.0+` |
| `Plugin-Minimum-Compute-Capability` | Minimum compute capability | `6.0` |
| `Plugin-Minimum-Memory` | Minimum memory | `4GB` |
| `Plugin-Performance-Speedup` | Expected speedup | `2-3x` |
| `Plugin-Performance-Memory-Overhead` | Memory overhead | `100-200MB` |
| `Supported-Formats` | Supported file formats | `.gguf,.bin` |
| `Supported-Architectures` | Supported architectures | `llama,mistral,qwen` |

---

## Resources

- **[Plugin System v2.0](/docs/plugins/plugin-system-v2)** - Complete guide
- **[Manifest-Based Plugin System](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/MANIFEST_BASED_PLUGIN_SYSTEM.md)** - Technical details
- **[Plugin Examples](/docs/plugins/plugin-examples)** - Real-world examples

---

[Back to Plugin System v2.0](/docs/plugins/plugin-system-v2) &nbsp; [Examples](/docs/plugins/plugin-examples) &nbsp; [Migration Guide](/docs/plugins/plugin-migration)
