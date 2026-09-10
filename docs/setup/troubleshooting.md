---
layout: default
title: Troubleshooting Guide
nav_order: 10
---

# Comprehensive Troubleshooting Guide

**Version**: 2.0.0  
**Status**: ✅ **Production Ready**

---

## Overview

This guide provides comprehensive troubleshooting for the Gollek Inference Engine, integrated with the standardized error code system for quick diagnosis and resolution.

---

## Error Code System

Gollek uses a standardized error code system for consistent error handling and troubleshooting.

### Error Code Format

```
CATEGORY_NNN
```

- **CATEGORY**: Error category (MODEL, DEVICE, RUNTIME, etc.)
- **NNN**: Three-digit error number

### Error Categories

| Category | Code Prefix | HTTP Status | Description |
|----------|-------------|-------------|-------------|
| MODEL | MODEL_XXX | 404, 400 | Model-related errors |
| DEVICE | DEVICE_XXX | 503, 500 | Hardware/device errors |
| RUNTIME | RUNTIME_XXX | 500, 504 | Runtime execution errors |
| PLUGIN | PLUGIN_XXX | 500, 504 | Plugin lifecycle errors |
| PROVIDER | PROVIDER_XXX | 400-504 | Provider integration errors |
| CONFIG | CONFIG_XXX | 400, 500 | Configuration errors |
| NETWORK | NETWORK_XXX | 502-504 | Network errors |
| QUOTA | QUOTA_XXX | 429 | Resource quota errors |
| AUTH | AUTH_XXX | 401, 403 | Authentication errors |
| INIT | INIT_XXX | 500 | Initialization errors |

---

## Error Category Routing

Use these category anchors from the error-code reference when you need the closest troubleshooting path.

### Model Errors {#model-errors}

Start by verifying the model identifier, local path, manifest entry, and runner compatibility. Then use the runtime, provider, or storage checks below depending on where loading fails.

### Tensor Errors {#tensor-errors}

Check tensor shape, dtype, device placement, and whether the operation expects batched input. If the tensor lives on an accelerator, also check the device troubleshooting path.

### Quota Errors {#quota-errors}

Quota errors usually come from provider limits, local concurrency limits, or configured request budgets. Check provider limits first, then reduce batch size or request rate.

### Auth Errors {#auth-errors}

Verify API keys, token scopes, environment variables, and provider configuration. For local-only workflows, also confirm that protected model downloads are authenticated.

### Init Errors {#init-errors}

Initialization failures usually mean a runner, plugin, device, or native library could not start. Check plugin errors, device errors, and runtime logs in that order.

### Storage Errors {#storage-errors}

Confirm `GOLLEK_HOME`, cache permissions, model directory existence, and available disk space. Storage issues often surface during model download, conversion, or first load.

### Conversion Errors {#conversion-errors}

Check source format, output path, quantization options, and whether the target runner supports the converted artifact.

### Validation Errors {#validation-errors}

Validation errors usually mean a request payload or config value is malformed. Check required fields, enum values, tensor shapes, and model/provider IDs.

### Circuit Breaker Errors {#circuit-errors}

Circuit breaker errors mean repeated failures have temporarily paused a route. Check the underlying runtime or provider error, then wait for the breaker window or switch provider.

### Routing Errors {#routing-errors}

Routing errors mean no runner, provider, or fallback route matched the request. Check model format, provider selection, plugin availability, and fallback configuration.

### Config Errors {#config-errors}

Configuration errors usually come from missing keys, invalid values, or conflicting environment variables. Use the configuration checks below for exact commands.

### Stream Errors {#stream-errors}

Streaming errors usually come from interrupted clients, provider timeouts, or token-generation failures. Check runtime logs and retry with a shorter generation first.

### Internal Errors {#internal-errors}

Internal errors need logs and a minimal reproduction. Capture the error payload, runtime logs, model ID, provider, device, and the exact command or request body.

---

## Error Payload Structure

All errors follow a standardized payload structure:

```json
{
  "type": "RUNTIME_INFERENCE_FAILED",
  "message": "Inference execution failed",
  "details": {
    "errorCode": "RUNTIME_001",
    "category": "RUNTIME",
    "retryable": true
  },
  "retryable": true,
  "originNode": "node-1",
  "originRunId": "run-123",
  "attempt": 1,
  "maxAttempts": 3,
  "timestamp": "2026-03-25T10:00:00Z",
  "suggestedAction": "retry",
  "provenanceRef": "ref-456"
}
```

### Error Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | String | Error type/code |
| `message` | String | Human-readable message |
| `details` | Map | Additional error details |
| `retryable` | Boolean | Whether error is retryable |
| `originNode` | String | Node where error occurred |
| `originRunId` | String | Run ID for tracing |
| `attempt` | Integer | Current attempt number |
| `maxAttempts` | Integer | Maximum retry attempts |
| `timestamp` | Instant | Error timestamp |
| `suggestedAction` | String | Suggested resolution action |
| `provenanceRef` | String | Reference for tracing |

---

## Common Errors and Solutions

### Plugin Errors

#### PLUGIN_001: Plugin Initialization Failed

**HTTP Status**: 500  
**Retryable**: No

**Symptoms**:
```
Error: Plugin initialization failed
Plugin: cuda-kernel
Details: CUDA not available
```

**Solutions**:
1. Check if plugin JAR is present:
   ```bash
   ls ~/.gollek/plugins/*.jar
   ```

2. Verify plugin manifest:
   ```bash
   jar xf plugin.jar META-INF/MANIFEST.MF
   cat META-INF/MANIFEST.MF
   ```

3. Check plugin dependencies:
   ```bash
   gollek plugin check <plugin-id>
   ```

4. Verify hardware availability:
   ```bash
   # For CUDA
   nvidia-smi
   
   # For Metal
   system_profiler SPDisplaysDataType
   ```

#### PLUGIN_002: Plugin Execution Failed

**HTTP Status**: 500  
**Retryable**: Yes

**Symptoms**:
```
Error: Plugin execution failed
Plugin: gguf-runner
Operation: infer
```

**Solutions**:
1. Check plugin health:
   ```bash
   gollek plugin health <plugin-id>
   ```

2. Verify model compatibility:
   ```bash
   gollek model check <model-id>
   ```

3. Check resource availability:
   ```bash
   gollek system resources
   ```

4. Retry with fallback:
   ```bash
   gollek run --enable-cpu --model <model> --prompt <prompt>
   ```

#### PLUGIN_003: Plugin Configuration Invalid

**HTTP Status**: 500  
**Retryable**: No

**Symptoms**:
```
Error: Plugin configuration invalid
Plugin: cuda-kernel
Invalid field: device_id
```

**Solutions**:
1. Check configuration file:
   ```bash
   cat ~/.gollek/config.yaml
   ```

2. Validate plugin configuration:
   ```bash
   gollek plugin config <plugin-id> --validate
   ```

3. Reset to defaults:
   ```bash
   gollek plugin config <plugin-id> --reset
   ```

---

### Device Errors

#### DEVICE_001: Device Not Available

**HTTP Status**: 503  
**Retryable**: Yes

**Symptoms**:
```
Error: Requested device not available
Device: cuda
```

**Solutions**:
1. Check device availability:
   ```bash
   gollek device list
   ```

2. Verify drivers installed:
   ```bash
   # CUDA
   nvcc --version
   
   # ROCm
   rocminfo
   
   # Metal
   system_profiler SPDisplaysDataType
   ```

3. Use CPU fallback:
   ```bash
   gollek run --use-cpu --model <model> --prompt <prompt>
   ```

4. Enable CPU fallback for production:
   ```bash
   gollek run --enable-cpu --model <model> --prompt <prompt>
   ```

#### DEVICE_002: Device Out of Memory

**HTTP Status**: 503  
**Retryable**: Yes

**Symptoms**:
```
Error: Device out of memory
Device: cuda
Available: 2GB
Required: 8GB
```

**Solutions**:
1. Reduce model size:
   ```bash
   gollek run --model <smaller-model> --prompt <prompt>
   ```

2. Enable memory optimization:
   ```bash
   gollek run --optimize-memory --model <model> --prompt <prompt>
   ```

3. Use CPU for large models:
   ```bash
   gollek run --use-cpu --model <large-model> --prompt <prompt>
   ```

4. Close other GPU applications:
   ```bash
   nvidia-smi  # Check GPU usage
   ```

#### DEVICE_005: GPU Not Found

**HTTP Status**: 503  
**Retryable**: No

**Symptoms**:
```
Error: GPU not found
Platform: cuda
```

**Solutions**:
1. Check GPU detection:
   ```bash
   gollek device detect
   ```

2. Verify GPU hardware:
   ```bash
   # Linux
   lspci | grep -i vga
   
   # macOS
   system_profiler SPDisplaysDataType
   
   # Windows
   dxdiag
   ```

3. Install/Update drivers:
   ```bash
   # NVIDIA
   sudo apt install nvidia-driver-535
   
   # AMD
   sudo apt install rocm-dkms
   ```

4. Use CPU until GPU available:
   ```bash
   gollek run --use-cpu --model <model> --prompt <prompt>
   ```

---

### Runtime Errors

#### RUNTIME_001: Inference Execution Failed

**HTTP Status**: 500  
**Retryable**: Yes

**Symptoms**:
```
Error: Inference execution failed
Model: llama-3-8b
Runner: gguf-runner
```

**Solutions**:
1. Check model integrity:
   ```bash
   gollek model verify <model-id>
   ```

2. Verify runner compatibility:
   ```bash
   gollek runner check <runner-id> --model <model-id>
   ```

3. Reduce batch size:
   ```bash
   gollek run --batch-size 1 --model <model> --prompt <prompt>
   ```

4. Enable fallback:
   ```bash
   gollek run --enable-cpu --model <model> --prompt <prompt>
   ```

#### RUNTIME_002: Inference Request Timeout

**HTTP Status**: 504  
**Retryable**: Yes

**Symptoms**:
```
Error: Inference request timeout
Timeout: 60s
Model: llama-3-70b
```

**Solutions**:
1. Increase timeout:
   ```bash
   gollek run --timeout 120 --model <model> --prompt <prompt>
   ```

2. Use smaller model:
   ```bash
   gollek run --model <smaller-model> --prompt <prompt>
   ```

3. Reduce max tokens:
   ```bash
   gollek run --max-tokens 256 --model <model> --prompt <prompt>
   ```

4. Use GPU acceleration:
   ```bash
   gollek run --platform cuda --model <model> --prompt <prompt>
   ```

#### RUNTIME_003: Out of Memory During Inference

**HTTP Status**: 500  
**Retryable**: Yes

**Symptoms**:
```
Error: Out of memory during inference
Available: 4GB
Required: 16GB
```

**Solutions**:
1. Enable memory optimization:
   ```bash
   gollek run --optimize-memory --model <model> --prompt <prompt>
   ```

2. Use quantized model:
   ```bash
   gollek run --model <model>-q4 --prompt <prompt>
   ```

3. Reduce context size:
   ```bash
   gollek run --context-size 2048 --model <model> --prompt <prompt>
   ```

4. Use CPU with swap:
   ```bash
   gollek run --use-cpu --model <model> --prompt <prompt>
   ```

---

### Provider Errors

#### PROVIDER_001: Provider Not Initialized

**HTTP Status**: 503  
**Retryable**: Yes

**Symptoms**:
```
Error: Provider not initialized
Provider: openai
```

**Solutions**:
1. Check provider configuration:
   ```bash
   gollek provider config openai --validate
   ```

2. Verify API key:
   ```bash
   echo $OPENAI_API_KEY
   ```

3. Initialize provider:
   ```bash
   gollek provider init openai
   ```

4. Check network connectivity:
   ```bash
   curl https://api.openai.com/v1/models
   ```

#### PROVIDER_003: Provider Timeout

**HTTP Status**: 504  
**Retryable**: Yes

**Symptoms**:
```
Error: Provider timeout
Provider: openai
Timeout: 30s
```

**Solutions**:
1. Increase timeout:
   ```bash
   export OPENAI_TIMEOUT=60
   ```

2. Check network latency:
   ```bash
   curl -w "@curl-format.txt" https://api.openai.com/v1/models
   ```

3. Use fallback provider:
   ```bash
   gollek run --provider gemini --model <model> --prompt <prompt>
   ```

4. Enable retry:
   ```bash
   gollek run --retry 3 --model <model> --prompt <prompt>
   ```

#### PROVIDER_005: Provider Rate Limit Exceeded

**HTTP Status**: 429  
**Retryable**: Yes

**Symptoms**:
```
Error: Provider rate limit exceeded
Provider: openai
Limit: 100/min
```

**Solutions**:
1. Wait and retry:
   ```bash
   sleep 60
   gollek run --model <model> --prompt <prompt>
   ```

2. Use different provider:
   ```bash
   gollek run --provider gemini --model <model> --prompt <prompt>
   ```

3. Enable rate limiting:
   ```bash
   gollek config set rate_limit 50
   ```

4. Upgrade API plan:
   ```
   Visit provider website to upgrade plan
   ```

---

### Configuration Errors

#### CONFIG_001: Required Configuration Missing

**HTTP Status**: 500  
**Retryable**: No

**Symptoms**:
```
Error: Required configuration missing
Field: api_key
Provider: openai
```

**Solutions**:
1. Check configuration file:
   ```bash
   cat ~/.gollek/config.yaml
   ```

2. Set missing configuration:
   ```bash
   gollek config set openai.api_key sk-...
   ```

3. Use environment variable:
   ```bash
   export OPENAI_API_KEY=sk-...
   ```

4. Validate configuration:
   ```bash
   gollek config validate
   ```

#### CONFIG_002: Invalid Configuration Value

**HTTP Status**: 500  
**Retryable**: No

**Symptoms**:
```
Error: Invalid configuration value
Field: timeout
Value: -1
Expected: positive integer
```

**Solutions**:
1. Check configuration syntax:
   ```bash
   gollek config get <field>
   ```

2. Fix invalid value:
   ```bash
   gollek config set <field> <valid-value>
   ```

3. Reset to default:
   ```bash
   gollek config reset <field>
   ```

4. Validate all configuration:
   ```bash
   gollek config validate
   ```

---

### Network Errors

#### NETWORK_001: Network Timeout

**HTTP Status**: 504  
**Retryable**: Yes

**Symptoms**:
```
Error: Network timeout
Operation: model download
Timeout: 300s
```

**Solutions**:
1. Check network connectivity:
   ```bash
   ping huggingface.co
   ```

2. Increase timeout:
   ```bash
   gollek config set network.timeout 600
   ```

3. Use different mirror:
   ```bash
   gollek config set huggingface.mirror https://hf-mirror.com
   ```

4. Check proxy settings:
   ```bash
   echo $HTTP_PROXY
   echo $HTTPS_PROXY
   ```

#### NETWORK_002: Network Unreachable

**HTTP Status**: 503  
**Retryable**: Yes

**Symptoms**:
```
Error: Network unreachable
Host: huggingface.co
```

**Solutions**:
1. Check internet connection:
   ```bash
   ping 8.8.8.8
   ```

2. Check DNS resolution:
   ```bash
   nslookup huggingface.co
   ```

3. Check firewall rules:
   ```bash
   sudo ufw status
   ```

4. Use offline mode:
   ```bash
   gollek run --offline --model <local-model> --prompt <prompt>
   ```

---

## Diagnostic Commands

### System Diagnostics

```bash
# Check system status
gollek system status

# Check available devices
gollek device list

# Check plugin status
gollek plugin status

# Check model status
gollek model list

# Check configuration
gollek config validate
```

### Plugin Diagnostics

```bash
# Check plugin health
gollek plugin health <plugin-id>

# Check plugin configuration
gollek plugin config <plugin-id> --validate

# List plugin capabilities
gollek plugin capabilities <plugin-id>

# Test plugin execution
gollek plugin test <plugin-id>
```

### Model Diagnostics

```bash
# Verify model integrity
gollek model verify <model-id>

# Check model compatibility
gollek model check <model-id>

# Get model information
gollek model info <model-id>

# Test model inference
gollek model test <model-id>
```

### Network Diagnostics

```bash
# Test network connectivity
gollek network test

# Check provider connectivity
gollek provider test <provider-id>

# Check download speed
gollek network speed-test

# Check DNS resolution
gollek network dns-test
```

---

## Error Recovery Strategies

### Automatic Retry

For retryable errors, Gollek automatically retries with exponential backoff:

```yaml
retry:
  enabled: true
  max_attempts: 3
  initial_delay: 1s
  max_delay: 30s
  multiplier: 2.0
```

### Fallback Execution

Configure fallback for non-retryable errors:

```yaml
fallback:
  enabled: true
  strategy: cpu  # Use CPU if GPU fails
  # or
  strategy: provider  # Use cloud provider if local fails
```

### Circuit Breaker

Enable circuit breaker for repeated failures:

```yaml
circuit_breaker:
  enabled: true
  failure_threshold: 5
  success_threshold: 3
  timeout: 60s
```

---

## Getting Help

### Logs

```bash
# View recent logs
gollek logs --recent

# View error logs
gollek logs --level ERROR

# Follow live logs
gollek logs --follow

# Export logs
gollek logs --export > logs.txt
```

### Support Channels

- **Documentation**: https://gollek.ai/docs
- **GitHub Issues**: https://github.com/gollek-ai/gollek/issues
- **Discord**: https://discord.gg/gollek
- **Email**: support@gollek.ai

### Error Reporting

When reporting errors, include:

1. Error code and message
2. Steps to reproduce
3. System information:
   ```bash
   gollek system info
   ```
4. Logs:
   ```bash
   gollek logs --recent 100
   ```
5. Configuration (sanitized):
   ```bash
   gollek config export --sanitize
   ```

---

## Resources

- **[Error Codes Reference](/docs/setup/error-codes)** - Complete error code list
- **[Plugin System v2.0](/docs/plugins/plugin-system-v2)** - Plugin documentation
- **[Kernel Auto-Detection](/docs/runtime/kernel-auto-detection)** - Platform detection
- **[Configuration Guide](/docs/optimization-config)** - Configuration options

---

[Back to Documentation](/docs) &nbsp; [Error Codes](/docs/setup/error-codes) &nbsp; [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs)
