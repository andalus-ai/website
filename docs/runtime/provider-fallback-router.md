---
layout: default
title: Provider Fallback Router
---

# 🔄 Provider Fallback Router

Intelligent provider routing with automatic fallback chain, circuit breakers, and cost-aware selection. Route inference requests through prioritized providers with fault tolerance built-in.

---

## 🎯 Overview

The Provider Fallback Router ensures your inference requests always succeed by automatically failing over to backup providers when the primary fails.

```
Request Flow:
  ┌──────────────────────────────────────────────────────┐
  │  Your Request                                        │
  │  "What is the capital of France?"                    │
  └──────────────────┬───────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ 1. Primary: OpenAI    │ ← Cost: $0.03/1K tokens
         │    gpt-4              │
         └───────────┬───────────┘
                     │ Failed!
                     ▼
         ┌───────────────────────┐
         │ 2. Fallback: Anthropic│ ← Cost: $0.025/1K tokens
         │    claude-3           │
         └───────────┬───────────┘
                     │ Success!
                     ▼
              ┌──────────────┐
              │ Response     │
              │ "Paris"      │
              └──────────────┘
```

---

## 🏗️ Architecture

### Routing Layers

| Layer | Purpose | Behavior |
|-------|---------|----------|
| **Local GPU/CPU** | Fast, private inference | GGUF, ONNX, TensorRT |
| **Primary Cloud** | Main production provider | OpenAI, Anthropic, etc. |
| **Backup Cloud** | Fallback on failure | Secondary provider |
| **Emergency** | Last resort | Cheapest available |

### Key Features

- ✅ **Cost-aware** - Tracks per-token costs and respects budget limits
- ✅ **Latency-optimized** - Prefers low-latency providers based on historical data
- ✅ **Fault-tolerant** - Automatic retry with next provider on failure
- ✅ **Quota-managed** - Respects per-provider quotas and rotates when exhausted
- ✅ **Circuit breaker** - Opens after consecutive failures, auto-recovery

---

## 🔧 Configuration

### Basic Setup

```java
ProviderFallbackRouter router = ProviderFallbackRouter.builder()
    .primary("openai", "gpt-4", 0.03)           // provider, model, cost per 1K tokens
    .fallback("anthropic", "claude-3", 0.025)   // backup provider
    .localFallback("gguf", "llama-3-70b", 0.0)  // local GGUF model
    .maxCostPerRequest(0.10)                     // $0.10 max per request
    .maxRetries(3)                               // try up to 3 providers
    .timeout(Duration.ofSeconds(30))             // 30s timeout per provider
    .build();

// Register provider instances
router.registerProvider("openai", openAiProvider);
router.registerProvider("anthropic", anthropicProvider);
router.registerProvider("gguf", ggufProvider);

// Route requests
Uni<InferenceResponse> response = router.route(request);
```

### Quarkus Configuration

```properties
# Provider costs and limits
gollek.providers.openai.costPer1KTokens=0.03
gollek.providers.anthropic.costPer1KTokens=0.025
gollek.providers.local-gguf.costPer1KTokens=0.0

# Router settings
gollek.router.maxCostPerRequest=0.10
gollek.router.maxRetries=3
gollek.router.timeoutSeconds=30
```

---

## 📊 Circuit Breaker

The circuit breaker prevents cascading failures by opening after consecutive failures:

```
State Machine:
  ┌──────────┐   5 failures    ┌──────────┐   60s timeout    ┌────────────┐
  │  CLOSED  │ ──────────────→ │   OPEN   │ ───────────────→ │ HALF-OPEN  │
  │(normal)  │                 │(blocked) │                  │(testing)   │
  └──────────┘                 └──────────┘                  └─────┬──────┘
                                                                   │
                                                3 successes        │
                                               ┌───────────────────┘
                                               ▼
                                        ┌──────────┐
                                        │  CLOSED  │
                                        │(recovered)│
                                        └──────────┘
```

### Circuit Breaker Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| **Failure Threshold** | 5 | Failures before opening |
| **Success Threshold** | 3 | Successes before closing |
| **Reset Timeout** | 60s | Time before testing recovery |

---

## 📈 Metrics & Monitoring

### Provider Statistics

```java
Map<String, ProviderStats> stats = router.getProviderStats();
ProviderStats openaiStats = stats.get("openai");

System.out.println("Total Requests: " + openaiStats.totalRequests());
System.out.println("Success Rate: " + String.format("%.1f%%", openaiStats.successRate()));
System.out.println("Avg Latency: " + openaiStats.avgLatencyMs() + "ms");
System.out.println("Total Tokens: " + openaiStats.totalTokens());
```

### Metrics Available

| Metric | Description |
|--------|-------------|
| **totalRequests** | Total requests sent to provider |
| **successfulRequests** | Requests that succeeded |
| **failedRequests** | Requests that failed |
| **avgLatencyMs** | Average response time |
| **totalTokens** | Total tokens processed |
| **successRate** | Percentage of successful requests |

---

## 🎯 Routing Strategies

### Cost-Optimized Route

```java
// Router automatically selects cheapest provider that meets requirements
ProviderFallbackRouter router = ProviderFallbackRouter.builder()
    .primary("openai", "gpt-4", 0.03)
    .fallback("openai", "gpt-3.5-turbo", 0.002)  // 15x cheaper
    .localFallback("gguf", "llama-3-8b", 0.0)     // Free
    .maxCostPerRequest(0.05)
    .build();
```

### Latency-Optimized Route

```java
// Router prefers low-latency providers based on historical performance
ProviderFallbackRouter router = ProviderFallbackRouter.builder()
    .primary("local-gpu", "llama-3-70b", 0.0)    // ~100ms latency
    .fallback("openai", "gpt-4", 0.03)            // ~2s latency
    .maxRetries(2)
    .timeout(Duration.ofSeconds(5))               // Fast timeout
    .build();
```

### High-Availability Route

```java
// Maximum reliability with multiple fallbacks
ProviderFallbackRouter router = ProviderFallbackRouter.builder()
    .primary("openai", "gpt-4", 0.03)
    .fallback("anthropic", "claude-3", 0.025)
    .fallback("google", "gemini-pro", 0.02)
    .localFallback("gguf", "llama-3-70b", 0.0)
    .maxRetries(4)
    .build();
```

---

## 🚨 Error Handling

The router provides detailed error information:

```java
try {
    InferenceResponse response = router.route(request)
        .await().atMost(Duration.ofSeconds(30));
} catch (MaxRetriesExceededException e) {
    // All providers failed after max retries
    log.error("All providers failed: " + e.getMessage());
} catch (NoProvidersAvailableException e) {
    // No providers configured or all disabled
    log.error("No providers available: " + e.getMessage());
}
```

---

## 📊 Performance Impact

| Scenario | Without Router | With Router | Improvement |
|----------|---------------|-------------|-------------|
| **Provider Failure** | 100% failure | Auto-fallback | **99.9% uptime** |
| **Cost Overage** | Unbounded | Capped at limit | **Cost control** |
| **Latency Spike** | User waits | Fast failover | **Better UX** |
| **Quota Exhausted** | Service down | Switch provider | **Zero downtime** |

---

## 🚀 Getting Started

1. **[Configure Providers](/docs/runtime/cloud-providers)** - Set up provider instances
2. **[Configure Router](#-configuration)** - Build fallback chain
3. **[Monitor Metrics](#-metrics--monitoring)** - Track provider health

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; background: var(--subtle-bg); border-radius: 12px;">
  <h3>Ready for Reliable Inference?</h3>
  <p>Start with the <strong><a href="/docs/runtime/cloud-providers">Provider Setup</a></strong> or explore <strong><a href="/docs/runtime/inference-serving">Inference Serving</a></strong></p>
</div>
