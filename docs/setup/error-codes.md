---
layout: default
title: Error Codes Reference
nav_order: 11
---

# Error Codes Reference

**Version**: 2.0.0  
**Status**: ✅ **Production Ready**

---

## Overview

Gollek uses a standardized error code system for consistent error handling across all components. Each error code is unique and follows the format `CATEGORY_NNN`.

---

## Error Code Format

```
CATEGORY_NNN
```

- **CATEGORY**: Error category prefix (e.g., MODEL, DEVICE, RUNTIME)
- **NNN**: Three-digit error number (e.g., 001, 002, 003)

### Example

```
RUNTIME_001
├──────┘ └─┘
│        └── Error number
└─── Category
```

---

## Error Categories

### MODEL Errors (404, 400)

Model-related errors for model loading, validation, and compatibility.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| MODEL_001 | 404 | Model not found | No | Requested model does not exist |
| MODEL_002 | 404 | Model version not found | No | Requested model version not available |
| MODEL_003 | 400 | Invalid model format | No | Model format is invalid or corrupted |
| MODEL_004 | 400 | Model file corrupted | No | Model file is corrupted or incomplete |
| MODEL_005 | 400 | Model exceeds size limit | No | Model size exceeds configured limit |
| MODEL_006 | 403 | Model signature verification failed | No | Model signature verification failed |
| MODEL_007 | 400 | Model not compatible with selected runner | No | Model incompatible with runner |

**Troubleshooting**: See [Model Errors](/docs/setup/troubleshooting#model-errors)

---

### TENSOR Errors (400, 500)

Tensor operation errors for tensor manipulation and conversion.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| TENSOR_001 | 400 | Tensor shape mismatch | No | Tensor shape does not match expected |
| TENSOR_002 | 400 | Tensor data type mismatch | No | Tensor data type does not match |
| TENSOR_003 | 400 | Invalid tensor data | No | Tensor data is invalid or malformed |
| TENSOR_004 | 400 | Tensor size does not match shape | No | Tensor size inconsistent with shape |
| TENSOR_005 | 500 | Tensor conversion failed | Yes | Tensor conversion operation failed |
| TENSOR_006 | 400 | Required input tensor missing | No | Required input tensor not provided |

**Troubleshooting**: See [Tensor Errors](/docs/setup/troubleshooting#tensor-errors)

---

### DEVICE Errors (503, 500)

Hardware and device-related errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| DEVICE_001 | 503 | Requested device not available | Yes | Requested device not available |
| DEVICE_002 | 503 | Device out of memory | Yes | Device memory exhausted |
| DEVICE_003 | 500 | Device initialization failed | No | Device failed to initialize |
| DEVICE_004 | 500 | Device driver error | Yes | Device driver encountered error |
| DEVICE_005 | 503 | GPU not found | No | No GPU detected on system |
| DEVICE_006 | 503 | TPU not available | No | TPU not available on system |
| DEVICE_007 | 501 | NPU not supported on this platform | No | NPU not supported on platform |

**Troubleshooting**: See [Device Errors](/docs/setup/troubleshooting#device-errors)

---

### QUOTA Errors (429)

Resource quota and rate limiting errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| QUOTA_001 | 429 | Quota exceeded | No | Resource quota exceeded |
| QUOTA_002 | 429 | Rate limit exceeded | Yes | API rate limit exceeded |
| QUOTA_003 | 429 | Too many concurrent requests | Yes | Concurrent request limit exceeded |
| QUOTA_004 | 429 | Storage quota exceeded | No | Storage quota exceeded |
| QUOTA_005 | 429 | Compute quota exceeded | Yes | Compute quota exceeded |

**Troubleshooting**: See [Quota Errors](/docs/setup/troubleshooting#quota-errors)

---

### AUTH Errors (401, 403)

Authentication and authorization errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| AUTH_001 | 401 | Invalid authentication token | No | Authentication token invalid |
| AUTH_002 | 401 | Authentication token expired | No | Authentication token expired |
| AUTH_003 | 401 | Tenant not found | No | Tenant account not found |
| AUTH_004 | 403 | Permission denied | No | Permission denied for operation |
| AUTH_005 | 403 | Tenant account suspended | No | Tenant account suspended |

**Troubleshooting**: See [Authentication Errors](/docs/setup/troubleshooting#auth-errors)

---

### INIT Errors (500)

Initialization errors for components and services.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| INIT_001 | 500 | Runner initialization failed | No | Runner failed to initialize |
| INIT_002 | 500 | Model loading failed | Yes | Model loading operation failed |
| INIT_003 | 500 | Native library loading failed | No | Native library failed to load |
| INIT_004 | 500 | Invalid configuration | No | Configuration is invalid |
| INIT_005 | 500 | Required dependency missing | No | Required dependency not found |

**Troubleshooting**: See [Initialization Errors](/docs/setup/troubleshooting#init-errors)

---

### RUNTIME Errors (500, 504, 400)

Runtime execution errors during inference.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| RUNTIME_001 | 500 | Inference execution failed | Yes | Inference execution failed |
| RUNTIME_002 | 504 | Inference request timeout | Yes | Request exceeded timeout limit |
| RUNTIME_003 | 500 | Out of memory during inference | Yes | Memory exhausted during inference |
| RUNTIME_004 | 500 | Native library crashed | Yes | Native library encountered crash |
| RUNTIME_005 | 500 | Invalid runner state | No | Runner in invalid state |
| RUNTIME_006 | 400 | Batch size exceeds limit | No | Batch size exceeds configured limit |

**Troubleshooting**: See [Runtime Errors](/docs/setup/troubleshooting#runtime-errors)

---

### STORAGE Errors (500, 503, 404, 403)

Storage and persistence errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| STORAGE_001 | 500 | Failed to read from storage | Yes | Storage read operation failed |
| STORAGE_002 | 500 | Failed to write to storage | Yes | Storage write operation failed |
| STORAGE_003 | 404 | Storage resource not found | No | Storage resource not found |
| STORAGE_004 | 503 | Storage connection failed | Yes | Storage connection failed |
| STORAGE_005 | 403 | Storage permission denied | No | Storage permission denied |

**Troubleshooting**: See [Storage Errors](/docs/setup/troubleshooting#storage-errors)

---

### CONVERSION Errors (500, 400, 504)

Model conversion and quantization errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| CONVERSION_001 | 500 | Model conversion failed | Yes | Model conversion operation failed |
| CONVERSION_002 | 400 | Target format not supported | No | Target format not supported |
| CONVERSION_003 | 504 | Model conversion timeout | Yes | Conversion exceeded timeout |
| CONVERSION_004 | 500 | Converted model validation failed | No | Converted model validation failed |
| CONVERSION_005 | 500 | Model quantization failed | Yes | Quantization operation failed |

**Troubleshooting**: See [Conversion Errors](/docs/setup/troubleshooting#conversion-errors)

---

### VALIDATION Errors (400)

Request validation errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| VALIDATION_001 | 400 | Required field missing | No | Required field not provided |
| VALIDATION_002 | 400 | Invalid field format | No | Field format is invalid |
| VALIDATION_003 | 400 | Validation constraint violated | No | Validation constraint violated |

**Troubleshooting**: See [Validation Errors](/docs/setup/troubleshooting#validation-errors)

---

### CIRCUIT Errors (503)

Circuit breaker and resilience errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| CIRCUIT_001 | 503 | Circuit breaker open | Yes | Circuit breaker is open |
| CIRCUIT_002 | 503 | All runner attempts failed | Yes | All runner attempts failed |
| CIRCUIT_003 | 503 | Fallback execution failed | Yes | Fallback execution failed |

**Troubleshooting**: See [Circuit Breaker Errors](/docs/setup/troubleshooting#circuit-errors)

---

### PROVIDER Errors (400-504)

Provider integration errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| PROVIDER_001 | 503 | Provider not initialized | Yes | Provider not initialized |
| PROVIDER_002 | 503 | Provider unavailable | Yes | Provider service unavailable |
| PROVIDER_003 | 504 | Provider timeout | Yes | Provider request timeout |
| PROVIDER_004 | 401 | Provider authentication failed | No | Provider authentication failed |
| PROVIDER_005 | 429 | Provider rate limit exceeded | Yes | Provider rate limit exceeded |
| PROVIDER_006 | 429 | Provider quota exceeded | No | Provider quota exceeded |
| PROVIDER_007 | 502 | Provider returned invalid response | Yes | Provider response invalid |
| PROVIDER_008 | 502 | Provider stream failed | Yes | Provider streaming failed |
| PROVIDER_009 | 400 | Provider request invalid | No | Provider request invalid |
| PROVIDER_010 | 500 | Provider initialization failed | No | Provider initialization failed |

**Troubleshooting**: See [Provider Errors](/docs/setup/troubleshooting#provider-errors)

---

### ROUTING Errors (403, 404, 503)

Routing and registry errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| ROUTING_001 | 503 | No compatible provider available | Yes | No compatible provider found |
| ROUTING_002 | 404 | Provider not found | No | Requested provider not found |
| ROUTING_003 | 403 | Routing policy rejected request | No | Routing policy rejected request |

**Troubleshooting**: See [Routing Errors](/docs/setup/troubleshooting#routing-errors)

---

### PLUGIN Errors (500, 504)

Plugin lifecycle errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| PLUGIN_001 | 500 | Plugin initialization failed | No | Plugin failed to initialize |
| PLUGIN_002 | 500 | Plugin execution failed | Yes | Plugin execution failed |
| PLUGIN_003 | 500 | Plugin configuration invalid | No | Plugin configuration invalid |

**Troubleshooting**: See [Plugin Errors](/docs/setup/troubleshooting#plugin-errors)

---

### CONFIG Errors (400, 500)

Configuration errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| CONFIG_001 | 500 | Required configuration missing | No | Required configuration missing |
| CONFIG_002 | 500 | Invalid configuration value | No | Configuration value invalid |
| CONFIG_003 | 400 | Unsupported configuration | No | Configuration not supported |

**Troubleshooting**: See [Configuration Errors](/docs/setup/troubleshooting#config-errors)

---

### NETWORK Errors (502-504)

Network and transport errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| NETWORK_001 | 504 | Network timeout | Yes | Network operation timeout |
| NETWORK_002 | 503 | Network unreachable | Yes | Network unreachable |
| NETWORK_003 | 503 | DNS resolution failed | Yes | DNS resolution failed |
| NETWORK_004 | 502 | TLS handshake failed | No | TLS handshake failed |
| NETWORK_005 | 502 | Network protocol error | Yes | Network protocol error |
| NETWORK_006 | 502 | Network response invalid | Yes | Network response invalid |

**Troubleshooting**: See [Network Errors](/docs/setup/troubleshooting#network-errors)

---

### STREAM Errors (500-504)

Streaming errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| STREAM_001 | 500 | Stream initialization failed | No | Stream initialization failed |
| STREAM_002 | 502 | Stream disconnected | Yes | Stream connection lost |
| STREAM_003 | 502 | Stream protocol error | Yes | Stream protocol error |
| STREAM_004 | 504 | Stream timeout | Yes | Stream operation timeout |

**Troubleshooting**: See [Stream Errors](/docs/setup/troubleshooting#stream-errors)

---

### INTERNAL Errors (500)

Internal server errors.

| Code | HTTP Status | Message | Retryable | Description |
|------|-------------|---------|-----------|-------------|
| INTERNAL_001 | 500 | Internal server error | Yes | Internal server error |
| INTERNAL_002 | 500 | Database error | Yes | Database operation failed |
| INTERNAL_003 | 500 | Cache error | Yes | Cache operation failed |
| INTERNAL_004 | 500 | Serialization error | Yes | Serialization failed |

**Troubleshooting**: See [Internal Errors](/docs/setup/troubleshooting#internal-errors)

---

## Error Handling Best Practices

### 1. Check Error Code

Always check the error code to determine the appropriate action:

```java
if (error.getCode().equals("RUNTIME_001")) {
    // Handle inference failure
} else if (error.getCode().equals("DEVICE_002")) {
    // Handle out of memory
}
```

### 2. Respect Retryable Flag

Only retry errors marked as retryable:

```java
if (error.isRetryable()) {
    // Retry with backoff
} else {
    // Handle as non-recoverable
}
```

### 3. Use Suggested Action

Follow the suggested action when provided:

```java
switch (error.getSuggestedAction()) {
    case "retry":
        // Retry operation
        break;
    case "fallback":
        // Use fallback
        break;
    case "escalate":
        // Escalate to human
        break;
    case "human_review":
        // Require human review
        break;
}
```

### 4. Log Error Details

Always log complete error details for debugging:

```java
log.error("Error occurred: {}", error.getMessage());
log.error("Error code: {}", error.getCode());
log.error("Details: {}", error.getDetails());
log.error("Retryable: {}", error.isRetryable());
```

### 5. Include Error in Response

Include error details in API responses:

```json
{
  "success": false,
  "error": {
    "code": "RUNTIME_001",
    "message": "Inference execution failed",
    "retryable": true,
    "suggestedAction": "retry"
  }
}
```

---

## Resources

- **[Troubleshooting Guide](/docs/setup/troubleshooting)** - Comprehensive troubleshooting
- **[Error Payload Format](/docs/setup/troubleshooting#error-payload-structure)** - Error payload structure
- **[Plugin System v2.0](/docs/plugins/plugin-system-v2)** - Plugin documentation

---

[Back to Documentation](/docs) &nbsp; [Troubleshooting](/docs/setup/troubleshooting) &nbsp; [Error Codes](/docs/setup/error-codes)
