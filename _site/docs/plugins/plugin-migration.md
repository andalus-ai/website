# Plugin System Migration Guide (v1.0 → v2.0)

**Date**: 2026-03-25  
**Version**: 2.0.0  
**Status**: ✅ **COMPLETE**

---

## Overview

This guide helps you migrate from the hardcoded plugin system v1.0 to the manifest-based plugin system v2.0.

---

## What's Changed

### v1.0 (Hardcoded)

```java
// PluginAvailabilityChecker.java - v1.0
private String getRequiredPluginsForCapability(String capability) {
    return switch (capability.toLowerCase()) {
        case "gguf-inference" -> "   • gguf-runner\n";
        case "cuda-acceleration" -> "   • cuda-kernel\n";
        case "metal-acceleration" -> "   • metal-kernel\n";
        // ... hardcoded for every capability
        default -> "";
    };
}
```

**Problems**:
- ❌ Hardcoded plugin IDs
- ❌ Hardcoded capability mappings
- ❌ Must update code to add new plugins
- ❌ Not flexible or extensible

### v2.0 (Manifest-Based)

```manifest
# Plugin JAR Manifest
Plugin-Id: gguf-runner
Plugin-Type: runner
Plugin-Capabilities: gguf-inference, llama-architecture, mistral-architecture
Plugin-Deployment: standalone,microservice,hybrid
```

```java
// PluginAvailabilityChecker.java - v2.0
public String getRequiredPluginsForCapability(String capability) {
    for (PluginDescriptor plugin : discoveredPlugins.values()) {
        if (plugin.hasCapability(capability)) {
            // Read from manifest dynamically
            return buildPluginInfo(plugin);
        }
    }
    return "";
}
```

**Benefits**:
- ✅ No hardcoded mappings
- ✅ Plugins self-describe capabilities
- ✅ Add new plugins without code changes
- ✅ Flexible and extensible

---

## Migration Steps

### Step 1: Update Plugin POMs

**Before (v1.0)**:
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <configuration>
        <archive>
            <manifestEntries>
                <Plugin-Id>gguf-runner</Plugin-Id>
                <Plugin-Type>runner</Plugin-Type>
            </manifestEntries>
        </archive>
    </configuration>
</plugin>
```

**After (v2.0)**:
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <configuration>
        <archive>
            <manifest>
                <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
            </manifest>
            <manifestEntries>
                <!-- Required -->
                <Plugin-Id>gguf-runner</Plugin-Id>
                <Plugin-Type>runner</Plugin-Type>
                <Plugin-Version>${project.version}</Plugin-Version>
                <Plugin-Name>GGUF Runner</Plugin-Name>
                <Plugin-Provider>tech.kayys.gollek.plugin.runner.gguf.GGUFRunnerPlugin</Plugin-Provider>
                
                <!-- Capabilities -->
                <Plugin-Capabilities>gguf-inference, llama-architecture, mistral-architecture</Plugin-Capabilities>
                
                <!-- Deployment modes -->
                <Plugin-Deployment>standalone,microservice,hybrid</Plugin-Deployment>
                
                <!-- Performance -->
                <Plugin-Performance-Speedup>1x (baseline)</Plugin-Performance-Speedup>
            </manifestEntries>
        </archive>
    </configuration>
</plugin>
```

### Step 2: Update PluginAvailabilityChecker

**Before (v1.0)**:
```java
public class PluginAvailabilityChecker {
    
    private boolean checkCapability(String capability) {
        return switch (capability.toLowerCase()) {
            case "gguf-inference" -> hasRunnerPlugin("gguf-runner");
            case "cuda-acceleration" -> hasKernelPlugin("cuda-kernel");
            // ... hardcoded
            default -> false;
        };
    }
}
```

**After (v2.0)**:
```java
public class PluginAvailabilityChecker {
    
    private final Map<String, PluginDescriptor> discoveredPlugins = new ConcurrentHashMap<>();
    private final Map<String, List<PluginDescriptor>> capabilityIndex = new ConcurrentHashMap<>();
    
    private boolean checkCapability(String capability) {
        List<PluginDescriptor> plugins = capabilityIndex.get(capability.toLowerCase());
        
        if (plugins == null || plugins.isEmpty()) {
            return false;
        }
        
        // Check if at least one plugin supporting this capability is available
        for (PluginDescriptor plugin : plugins) {
            if (isPluginAvailable(plugin)) {
                return true;
            }
        }
        
        return false;
    }
}
```

### Step 3: Update Plugin Discovery

**Before (v1.0)**:
```java
// Hardcoded plugin loading
List<String> pluginIds = List.of("gguf-runner", "cuda-kernel", "metal-kernel");
for (String pluginId : pluginIds) {
    loadPlugin(pluginId);
}
```

**After (v2.0)**:
```java
// Manifest-based discovery
ServiceLoader<GollekPlugin> loader = ServiceLoader.load(GollekPlugin.class);
for (GollekPlugin plugin : loader) {
    PluginDescriptor descriptor = loadPluginDescriptor(plugin.getClass());
    if (descriptor != null) {
        discoveredPlugins.put(plugin.id(), descriptor);
        
        // Index capabilities
        for (String capability : descriptor.getCapabilities()) {
            capabilityIndex
                .computeIfAbsent(capability, k -> new ArrayList<>())
                .add(descriptor);
        }
    }
}
```

### Step 4: Update Error Messages

**Before (v1.0)**:
```java
public String getCapabilityNotAvailableError(String capability) {
    String requiredPlugins = switch (capability) {
        case "gguf-inference" -> "   • gguf-runner\n";
        case "cuda-acceleration" -> "   • cuda-kernel\n";
        // ... hardcoded
        default -> "";
    };
    
    return "Capability '" + capability + "' not available.\n" + requiredPlugins;
}
```

**After (v2.0)**:
```java
public String getCapabilityNotAvailableError(String capability) {
    StringBuilder message = new StringBuilder();
    message.append("❌ Capability '").append(capability).append("' is not available.\n\n");
    
    // Read from manifest dynamically
    String requiredPlugins = getRequiredPluginsForCapability(capability);
    if (!requiredPlugins.isEmpty()) {
        message.append("📦 Required plugins:\n");
        message.append(requiredPlugins);
    }
    
    return message.toString();
}
```

---

## Breaking Changes

### Removed APIs

**v1.0**:
```java
// Hardcoded capability check
boolean hasCapability(String capability);

// Returns hardcoded plugin list
List<String> getRequiredPlugins(String capability);
```

**v2.0**:
```java
// Manifest-based capability check
boolean hasCapability(String capability);

// Returns plugins from manifest
List<PluginDescriptor> getPluginsForCapability(String capability);

// Get all available capabilities
Set<String> getAvailableCapabilities();
```

### Changed Behavior

**Plugin Loading**:
- v1.0: Hardcoded plugin IDs
- v2.0: Manifest-based discovery

**Capability Mapping**:
- v1.0: Switch statement in code
- v2.0: Manifest entries

**Error Messages**:
- v1.0: Hardcoded messages
- v2.0: Generated from manifest

---

## Compatibility Matrix

| Feature | v1.0 | v2.0 | Migration Required |
|---------|------|------|-------------------|
| Plugin Discovery | Hardcoded | Manifest | ✅ Yes |
| Capability Mapping | Hardcoded | Manifest | ✅ Yes |
| Error Messages | Hardcoded | Generated | ✅ Yes |
| Deployment Modes | Limited | Full support | ⚠️ Update POM |
| Plugin Metadata | Minimal | Comprehensive | ⚠️ Update POM |

---

## Migration Checklist

### For Plugin Developers

- [ ] Update plugin POM with manifest entries
- [ ] Add Plugin-Capabilities entry
- [ ] Add Plugin-Deployment entry
- [ ] Add Plugin-Provider entry
- [ ] Add performance metadata
- [ ] Add GPU requirements (if applicable)
- [ ] Test plugin discovery
- [ ] Verify capability indexing

### For Application Developers

- [ ] Update PluginAvailabilityChecker to use manifest
- [ ] Remove hardcoded capability mappings
- [ ] Update error message generation
- [ ] Test plugin discovery
- [ ] Test capability checking
- [ ] Update documentation

### For End Users

- [ ] Reinstall plugins with updated manifests
- [ ] Verify plugin directory structure
- [ ] Test plugin loading
- [ ] Verify capabilities work

---

## Testing

### Plugin Manifest Verification

```bash
# Extract and verify manifest
jar xf gollek-plugin-runner-gguf-2.0.0.jar META-INF/MANIFEST.MF
cat META-INF/MANIFEST.MF

# Check required entries
grep "Plugin-Id" META-INF/MANIFEST.MF
grep "Plugin-Type" META-INF/MANIFEST.MF
grep "Plugin-Capabilities" META-INF/MANIFEST.MF
```

### Capability Discovery Test

```java
@Test
public void testCapabilityDiscovery() {
    // Check capability is discovered from manifest
    assertTrue(pluginChecker.hasCapability("gguf-inference"));
    
    // Get plugins for capability
    List<PluginDescriptor> plugins = 
        pluginChecker.getPluginsForCapability("gguf-inference");
    assertFalse(plugins.isEmpty());
    
    // Verify plugin metadata from manifest
    PluginDescriptor plugin = plugins.get(0);
    assertEquals("gguf-runner", plugin.getId());
    assertTrue(plugin.getCapabilities().contains("gguf-inference"));
}
```

### Deployment Mode Test

```java
@Test
public void testDeploymentMode() {
    // Check deployment mode compatibility
    PluginDescriptor plugin = pluginChecker.getPlugin("gguf-runner").get();
    assertTrue(plugin.supportsDeployment(DeploymentMode.STANDALONE));
    assertTrue(plugin.supportsDeployment(DeploymentMode.MICROSERVICE));
    assertTrue(plugin.supportsDeployment(DeploymentMode.HYBRID));
}
```

---

## Troubleshooting

### Plugin Not Discovered

**Symptom**: Plugin JAR in directory but not discovered

**Solutions**:
1. Check manifest has required entries:
   ```bash
   jar tf plugin.jar | grep MANIFEST
   unzip -p plugin.jar META-INF/MANIFEST.MF | grep Plugin-
   ```
2. Verify Plugin-Id and Plugin-Type are present
3. Check Plugin-Provider class exists
4. Restart application

### Capability Not Found

**Symptom**: `hasCapability()` returns false for known capability

**Solutions**:
1. Check plugin manifest has Plugin-Capabilities entry
2. Verify capability name matches exactly (case-sensitive)
3. Check if plugin is loaded: `pluginChecker.getDiscoveredPlugins()`
4. Rebuild plugin with updated manifest

### Manifest Entry Missing

**Symptom**: Manifest entry not appearing in JAR

**Solutions**:
1. Check POM has manifestEntries configuration
2. Verify Maven jar-plugin version is 3.4.2+
3. Run `mvn clean package` to rebuild
4. Check generated JAR: `jar tf target/*.jar | grep MANIFEST`

---

## Rollback Plan

If you need to rollback to v1.0:

1. **Revert Code Changes**:
   ```bash
   git checkout <v1.0-commit> -- sdk/gollek-sdk-core/src/main/java/tech/kayys/gollek/sdk/core/PluginAvailabilityChecker.java
   ```

2. **Revert Plugin POMs**:
   ```bash
   git checkout <v1.0-commit> -- plugins/*/pom.xml
   ```

3. **Rebuild Plugins**:
   ```bash
   mvn clean install -DskipTests
   ```

4. **Restart Application**

---

## Resources

- **[Plugin System v2.0 Documentation](/docs/plugins/plugin-system-v2)** - Complete guide
- **[Manifest-Based Plugin System](https://github.com/gollek-ai/gollek/blob/main/inference-gollek/MANIFEST_BASED_PLUGIN_SYSTEM.md)** - Technical details
- **[Plugin Examples](/docs/plugins/plugin-examples)** - Real-world examples
- **[Plugin Repository](https://gollek.ai/plugins)** - Download updated plugins

---

[Back to Plugin System v2.0](/docs/plugins/plugin-system-v2) &nbsp; [Examples](/docs/plugins/plugin-examples) &nbsp; [Setup Docs](/docs/setup/)
