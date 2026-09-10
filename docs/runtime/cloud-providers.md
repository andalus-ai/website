---
layout: default
title: Cloud Providers
---

# Cloud LLM Providers & Plugin System

For the guided landing page that groups provider usage, plugin installation,
configuration, and custom-plugin entrypoints in one place, start with
[Cloud Provider Docs](/docs/runtime/cloud-provider-docs).

Seamless integration with leading cloud LLM providers via a dynamic plugin architecture. Add or remove providers at runtime without recompilation.

---

## Overview

Gollek provides a **plugin-based architecture** for cloud provider integration, enabling:

- **Dynamic Loading**: Add/remove providers via JAR files
- **Hot-Reload**: Update providers without restart
- **Isolation**: Each provider runs in isolated ClassLoader
- **Unified API**: Consistent interface across all providers
- **Auto-Discovery**: Plugins automatically discovered from `~/.gollek/plugins/`

### Supported Providers

| Provider | Models | Streaming | Function Calling | Multimodal | Max Context |
|----------|--------|-----------|------------------|------------|-------------|
| **OpenAI** | GPT-4, GPT-3.5-Turbo, o1 | ✓ | ✓ | ✓ | 128K |
| **Anthropic** | Claude 3 (Opus/Sonnet/Haiku) | ✓ | ✓ | ✓ | 200K |
| **Google Gemini** | Gemini Pro/Ultra | ✓ | ✓ | ✓ | 1M+ |
| **Cerebras** | Llama 3.1 | ✓ | ✗ | ✗ | 8K |
| **Mistral** | Mistral, Mixtral | ✓ | ✓ | ✗ | 32K |

---

## Plugin System

### Architecture

Cloud providers are loaded as plugins from JAR files:

```
~/.gollek/plugins/
├── gollek-plugin-openai-1.0.0.jar     # OpenAI provider plugin
├── gollek-plugin-anthropic-1.0.0.jar  # Anthropic provider plugin
├── gollek-plugin-gemini-1.0.0.jar     # Google Gemini provider plugin
└── custom-provider-1.0.0.jar          # Your custom provider
```

### Features

| Feature | Description |
|---------|-------------|
| **JAR Auto-Discovery** | Scans `~/.gollek/plugins/` for `.jar` files |
| **ClassLoader Isolation** | Each plugin has isolated ClassLoader |
| **Hot-Reload** | Watches for file changes and reloads automatically |
| **Dynamic Load/Unload** | Load/unload plugins at runtime |
| **Plugin Manifest** | JAR manifest contains plugin metadata |
| **Configuration** | Per-plugin configuration support |
| **Health Checks** | Plugin health monitoring |

---

## Quick Start

### Installation

#### Option 1: Build from Source (Built-in Plugins)

For plugins in the wayang-platform repository:

```bash
cd inference-gollek/plugins/gollek-plugin-openai
mvn clean install
```

This automatically copies the JAR to `~/.gollek/plugins/`

#### Option 2: Build Standalone Plugin (External Plugins)

For independent plugins developed outside the platform:

```bash
# Clone the plugin repository
git clone https://github.com/your-org/gollek-plugin-openai.git
cd gollek-plugin-openai

# Build standalone JAR
mvn clean package

# Install to Gollek plugins directory
mvn install -Pinstall-plugin
```

#### Option 3: Download Pre-built JAR

```bash
# Download latest release from Maven Central or GitHub
wget https://github.com/gollek-ai/gollek/releases/download/v1.0.0/gollek-plugin-openai-1.0.0.jar

# Copy to plugin directory
cp gollek-plugin-openai-1.0.0.jar ~/.gollek/plugins/
```

#### Option 4: Use Fat JAR (with all dependencies)

```bash
mvn clean package -Pfat-jar
cp target/gollek-plugin-openai-1.0.0-all.jar ~/.gollek/plugins/
```

### Configuration

#### Via Environment Variables (Recommended)

```bash
export OPENAI_API_KEY=sk-your-api-key-here
export ANTHROPIC_API_KEY=sk-ant-your-api-key-here
export GEMINI_API_KEY=your-gemini-api-key
```

#### Via plugin.json

Create `~/.gollek/plugins/plugin.json`:

```json
{
  "providers": {
    "openai-cloud-provider": {
      "apiKey": "sk-your-api-key-here",
      "baseUrl": "https://api.openai.com/v1",
      "organization": "org-your-org-id"
    },
    "anthropic-cloud-provider": {
      "apiKey": "sk-ant-your-api-key-here",
      "baseUrl": "https://api.anthropic.com"
    }
  }
}
```

#### Via Application Properties

```properties
# OpenAI Configuration
gollek.providers.openai.enabled=true
gollek.providers.openai.api-key=sk-...
gollek.providers.openai.base-url=https://api.openai.com/v1
gollek.providers.openai.default-model=gpt-3.5-turbo

# Anthropic Configuration
gollek.providers.anthropic.enabled=true
gollek.providers.anthropic.api-key=sk-ant-...
gollek.providers.anthropic.base-url=https://api.anthropic.com
```

---

## Plugin Types

### Built-in Plugins (with Parent POM)

Plugins maintained as part of the Gollek platform:

**Characteristics:**
- Inherits configuration from `gollek-plugin-parent`
- Released with the platform
- Located in `inference-gollek/plugins/`
- Automatic deployment to plugin directory

**Example POM:**
```xml
<project>
    <parent>
        <groupId>tech.kayys.gollek</groupId>
        <artifactId>gollek-plugin-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    
    <artifactId>gollek-plugin-openai</artifactId>
</project>
```

### Standalone Plugins (without Parent POM)

Independent plugins developed by external developers:

**Characteristics:**
- No dependency on Gollek parent POM
- Independent release cycle
- Can be published to Maven Central
- Self-contained configuration

**Example POM:**
```xml
<project>
    <groupId>tech.kayys</groupId>
    <artifactId>gollek-plugin-myprovider</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <gollek.version>1.0.0-SNAPSHOT</gollek.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>tech.kayys.gollek</groupId>
            <artifactId>gollek-spi-provider</artifactId>
            <version>${gollek.version}</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

See the [Plugin System Guide](/docs/plugins/plugin-system-v2) for detailed instructions.

---

## Creating Custom Plugins

### Plugin Structure

```
my-custom-provider/
├── src/main/java/tech/kayys/gollek/plugin/
│   └── MyCustomProvider.java
├── pom.xml
└── README.md
```

### Example Plugin Implementation

```java
package tech.kayys.plugin;

import tech.kayys.gollek.spi.provider.LLMProvider;
import tech.kayys.gollek.spi.provider.StreamingProvider;
import tech.kayys.gollek.spi.provider.ProviderConfig;
import tech.kayys.gollek.spi.provider.ProviderCapabilities;
import tech.kayys.gollek.spi.provider.ProviderMetadata;
import tech.kayys.gollek.spi.provider.ProviderRequest;
import tech.kayys.gollek.spi.provider.ProviderHealth;
import tech.kayys.gollek.spi.inference.InferenceResponse;
import tech.kayys.gollek.spi.inference.StreamingInferenceChunk;
import tech.kayys.gollek.spi.exception.ProviderException;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;

public class MyCustomProvider implements LLMProvider, StreamingProvider {

    @Override
    public String id() {
        return "my-custom-provider";
    }

    @Override
    public String name() {
        return "My Custom Provider";
    }

    @Override
    public String version() {
        return "1.0.0";
    }

    @Override
    public ProviderMetadata metadata() {
        return ProviderMetadata.builder()
            .providerId(id())
            .name(name())
            .description("Custom provider for specialized models")
            .version(version())
            .vendor("Your Company")
            .homepage("https://example.com")
            .build();
    }

    @Override
    public ProviderCapabilities capabilities() {
        return ProviderCapabilities.builder()
            .streaming(true)
            .functionCalling(true)
            .multimodal(false)
            .maxContextTokens(8192)
            .supportedModels(Set.of("model-v1", "model-v2"))
            .build();
    }

    @Override
    public void initialize(ProviderConfig config) {
        // Load configuration
        String apiKey = config.getSecret("apiKey").orElse(null);
        String baseUrl = config.getString("baseUrl", "https://api.example.com");
        // Initialize your client
    }

    @Override
    public boolean supports(String modelId, ProviderRequest request) {
        return Set.of("model-v1", "model-v2").contains(modelId);
    }

    @Override
    public Uni<InferenceResponse> infer(ProviderRequest request) {
        // Implement inference logic
        return Uni.createFrom().item(InferenceResponse.builder()
            .requestId(request.getRequestId())
            .content("Response from my provider")
            .model(request.getModel())
            .build());
    }

    @Override
    public Multi<InferenceChunk> inferStream(ProviderRequest request) {
        // Implement streaming logic
        return Multi.createFrom().items(
            InferenceChunk.of(request.getRequestId(), 0, "Hello "),
            InferenceChunk.finalChunk(request.getRequestId(), 1, "World!")
        );
    }

    @Override
    public Uni<ProviderHealth> health() {
        return Uni.createFrom().item(ProviderHealth.healthy("Provider is ready"));
    }

    @Override
    public void shutdown() {
        // Cleanup resources
    }
}
```

### Plugin Manifest (in pom.xml)

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-jar-plugin</artifactId>
            <configuration>
                <archive>
                    <manifestEntries>
                        <Plugin-Id>my-custom-provider</Plugin-Id>
                        <Plugin-Version>${project.version}</Plugin-Version>
                        <Plugin-Class>tech.kayys.plugin.MyCustomProvider</Plugin-Class>
                        <Plugin-Provider>tech.kayys</Plugin-Provider>
                        <Plugin-Description>My custom provider</Plugin-Description>
                    </manifestEntries>
                </archive>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### Build and Deploy

```bash
# Build
mvn clean package

# Deploy to plugin directory
cp target/gollek-plugin-myprovider-1.0.0.jar ~/.gollek/plugins/

# Plugin auto-loads within 1 second (hot-reload)
```

---

## OpenAI Provider

### Supported Models

| Model | Context | Capabilities | Best For |
|-------|---------|--------------|----------|
| gpt-4-turbo | 128K | Text, Vision, Function | Complex reasoning |
| gpt-4 | 8K | Text, Vision, Function | High-quality tasks |
| gpt-3.5-turbo | 16K | Text, Function | Cost-effective |
| o1-preview | 128K | Reasoning | Complex problems |
| gpt-4o | 128K | Text, Vision, Audio | Multimodal tasks |
| gpt-4o-mini | 128K | Text, Vision | Fast, cost-effective |

### Usage Example

```java
import tech.kayys.gollek.spi.provider.ProviderRequest;
import tech.kayys.gollek.spi.inference.InferenceResponse;
import tech.kayys.gollek.spi.Message;

// Get provider from plugin manager or inject
LLMProvider openai = pluginManager.getProvider("openai-cloud-provider");

// Create request
ProviderRequest request = ProviderRequest.builder()
    .model("gpt-4-turbo")
    .message(Message.system("You are a helpful assistant."))
    .message(Message.user("Explain quantum computing in simple terms."))
    .parameter("temperature", 0.7)
    .parameter("max_tokens", 500)
    .build();

// Execute inference (non-blocking)
Uni<InferenceResponse> response = openai.infer(request);
response.subscribe().with(resp -> {
    System.out.println(resp.getContent());
    System.out.println("Tokens used: " + resp.getTokensUsed());
});

// Or blocking
InferenceResponse response = openai.inferBlocking(request);
```

### Streaming Example

```java
import tech.kayys.gollek.spi.inference.StreamingInferenceChunk;
import io.smallrye.mutiny.Multi;

Multi<StreamingInferenceChunk> stream = openai.inferStream(request);
stream.subscribe().with(
    chunk -> System.out.print(chunk.getDelta()),
    error -> error.printStackTrace(),
    () -> System.out.println("\nStream complete!")
);
```

### Function Calling Example

```java
import tech.kayys.gollek.spi.tool.ToolDefinition;

ToolDefinition tool = ToolDefinition.builder()
    .name("get_weather")
    .description("Get current weather for a location")
    .parameter("location", String.class, "City name")
    .parameter("unit", String.class, "Temperature unit (celsius/fahrenheit)")
    .build();

ProviderRequest request = ProviderRequest.builder()
    .model("gpt-4-turbo")
    .message(Message.user("What's the weather in Tokyo?"))
    .tool(tool)
    .build();

InferenceResponse response = openai.inferBlocking(request);
if (response.hasToolCalls()) {
    // Handle tool calls
    response.getToolCalls().forEach(toolCall -> {
        System.out.println("Calling: " + toolCall.name());
        System.out.println("Arguments: " + toolCall.arguments());
    });
}
```

---

## Provider Selection

### Automatic Selection

Gollek automatically selects providers based on model name patterns:

```
"claude-*" → Anthropic Provider
"gpt-*" → OpenAI Provider
"gemini-*" → Gemini Provider
"llama3.1-*" → Cerebras Provider
```

### Manual Selection

```java
ProviderRequest request = ProviderRequest.builder()
    .provider("openai")  // Explicit provider
    .model("gpt-4-turbo")
    .message(Message.user("Hello"))
    .build();
```

---

## Plugin Management

### List Loaded Plugins

```bash
curl http://localhost:8080/api/v1/plugins
```

Response:
```json
{
  "plugins": [
    {
      "id": "openai-cloud-provider",
      "version": "1.0.0",
      "status": "running",
      "health": "healthy"
    },
    {
      "id": "anthropic-cloud-provider",
      "version": "1.0.0",
      "status": "running",
      "health": "healthy"
    }
  ]
}
```

### Check Plugin Health

```bash
curl http://localhost:8080/api/v1/plugins/openai-cloud-provider/health
```

### Unload Plugin

```bash
curl -X DELETE http://localhost:8080/api/v1/plugins/openai-cloud-provider
```

### Reload Plugin

```bash
# Just replace the JAR file - it auto-reloads!
cp new-version.jar ~/.gollek/plugins/openai-cloud-provider.jar
```

---

## Error Handling

### Plugin Loading Errors

```bash
# Check logs for plugin loading issues
tail -f ~/.gollek/logs/gollek.log | grep plugin
```

### Common Issues

#### "Plugin not found"

```bash
# Verify JAR is in plugin directory
ls -la ~/.gollek/plugins/*.jar

# Check plugin manifest
unzip -p ~/.gollek/plugins/gollek-plugin-openai.jar META-INF/MANIFEST.MF
```

#### "API key not configured"

```bash
# Set environment variable
export OPENAI_API_KEY=sk-...

# Or configure in plugin.json
{
  "providers": {
    "openai-cloud-provider": {
      "apiKey": "sk-..."
    }
  }
}
```

---

## Best Practices

### Plugin Versioning

```
~/.gollek/plugins/
├── gollek-plugin-openai-1.0.0.jar    # Versioned JARs
├── gollek-plugin-openai-1.0.1.jar
└── gollek-plugin-openai.jar          # Current version (symlink)
```

### Configuration Management

```bash
# Use environment variables for sensitive data
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...

# Reference in configuration
gollek.providers.openai.api-key=${OPENAI_API_KEY}
```

### Hot-Reload Development

```bash
# Watch directory during development
while true; do
    inotifywait -e modify target/*.jar
    cp target/*.jar ~/.gollek/plugins/
    echo "Plugin reloaded!"
done
```

### Cost Optimization

```java
// Use cheaper models for simple tasks
ProviderRequest simpleRequest = ProviderRequest.builder()
    .model("gpt-3.5-turbo")  // Cheaper
    .message(Message.user("Simple query"))
    .build();

// Use premium models for complex tasks
ProviderRequest complexRequest = ProviderRequest.builder()
    .model("gpt-4-turbo")  // Higher quality
    .message(Message.user("Complex reasoning task"))
    .build();
```

---

## Resources

- [Plugin Developer Guide](/docs/plugins/plugin-system-v2) - Complete guide for creating plugins
- [Plugin Templates](/docs/plugins/plugin-templates) - Starter layouts for plugin projects
- [Plugin System Guide](/docs/plugins/plugin-system-v2)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/claude/reference)
- [Google Gemini API Documentation](https://ai.google.dev/docs)

---

[Back to Plugin System v2](/docs/plugins/plugin-system-v2) &nbsp; [View Architecture](/docs/runtime/architecture)
