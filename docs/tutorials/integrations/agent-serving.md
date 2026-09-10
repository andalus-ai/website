---
layout: default
title: Agent Serving Quick Start
parent: Platform Integrations
grand_parent: Tutorials
nav_order: 4
---

# Agent Serving Quick Start

Use this quick start when Gollek is the inference and serving engine for
Wayang-Gollek, a coding-agent runtime, a low-code agent builder, or another
external orchestrator. Gollek validates and serves model requests. The caller
owns planning, retrieval policy, vector stores, tool execution, memory, retries,
and workflow state.

## 1. Start From The Serving Boundary

Check that the running Gollek endpoint is exposing the expected serving
contract:

```bash
gollek agent capabilities \
  --base-url http://localhost:8080 \
  --api-key community \
  --require-serving-boundary

gollek agent contract \
  --base-url http://localhost:8080 \
  --api-key community \
  --require-serving-boundary
```

These commands do not invoke a model. They confirm that the endpoint is acting
as an inference-serving engine rather than an agent orchestrator.

## 2. Pick A Route Template

Start from one of the request templates below. They are intentionally small, so
an application can fill in the model id, prompt, tool schemas, and RAG context
from its own configuration.

| Template | Feature profile | Use it for |
|---|---|---|
| [Chat agent preflight](/docs/tutorials/integrations/templates/chat-agent-preflight.json) | `chat_agent` | Chat Completions with system prompts, tools, and caller-selected RAG context. |
| [Responses agent preflight](/docs/tutorials/integrations/templates/responses-agent-preflight.json) | `responses_agent` | Responses API callers that prefer `instructions`, `input`, and Responses-style events. |
| [Embedding RAG preflight](/docs/tutorials/integrations/templates/embedding-rag-preflight.json) | `embedding_rag` | Embedding generation for caller-owned indexing, vector search, and retrieval. |
| [MCP tools preflight](/docs/tutorials/integrations/templates/mcp-tools-preflight.json) | `mcp_tools` | MCP discovery and tool schema validation without tool execution. |

The template policy defaults to `requested_route`, which requires the selected
model, surface, and feature profile to match the requested route. Use
`readiness_only` for loose local checks and `clean` for CI or publishing gates.
Keep top-level route fields aligned with nested request fields. If a template
contains both `model` and `request.model`, they should describe the same route;
`gollek agent template-check`, `gollek agent request-validate`, `gollek agent
readiness`, and `gollek agent preflight` fail locally on explicit conflicts
before they call Gollek. Use `--model`, `--surface`, or `--feature-profile`
when you intentionally want to override a saved template.

## 3. Check The Template Locally

Check the saved template before starting Gollek or wiring it into an agent
workflow:

```bash
gollek agent template-check \
  --request-file docs/tutorials/integrations/templates/chat-agent-preflight.json \
  --json
```

`template-check` is local-only: it does not call Gollek, invoke a model, execute
tools, run retrieval, or own workflow state. It catches missing model ids and
explicit conflicts between top-level route fields and nested `request` fields,
plus unsupported surfaces, feature profiles, and preflight policy profiles.

## 4. Run Preflight Locally

Run preflight with a template before wiring the route into an agent workflow:

```bash
gollek agent preflight \
  --base-url http://localhost:8080 \
  --api-key community \
  --request-file docs/tutorials/integrations/templates/chat-agent-preflight.json \
  --preflight-policy requested_route
```

For CI, use the same file and make the gate stricter:

```bash
gollek agent preflight \
  --base-url http://localhost:8080 \
  --api-key community \
  --request-file docs/tutorials/integrations/templates/chat-agent-preflight.json \
  --preflight-policy clean \
  --json
```

`clean` blocks on readiness failures, route mismatch, and warnings. The JSON
output includes `object: "gollek.agent_preflight_result"`, the requested route,
the selected route, `route_comparison`, `route_mismatches`,
`preflight_gate`, and `preflight_policy`.

If the selected route does not match the request, inspect
`route_mismatches[].requested` and `route_mismatches[].selected`. Human output
prints the same detail as `mismatch: model requested=... selected=...`, so CI
logs can show exactly what drifted.

## 5. Wire The Agent Runtime

After preflight passes, keep the runtime flow directional:

1. Wayang-Gollek or the caller receives the user task.
2. The caller selects the route template and runs preflight.
3. If retrieval is needed, the caller asks Gollek for embeddings.
4. The caller searches its own vector store and selects context chunks.
5. The caller sends `rag_context` or `retrieval_context` into Gollek generation.
6. Gollek returns text, stream events, and tool-call declarations.
7. The caller authorizes and executes tools, records memory, and decides the
   next step.

Gollek should not run the tool loop or own the vector store. That separation
keeps Gollek reusable as a platform and keeps Wayang-Gollek free to evolve as
the agentic system engine.

## 6. Use The SDK Gate

Java callers can use the same route policy through the SDK:

```java
AgentServingPreflightGate gate = client.agent().servingPreflightGate(
    AgentServingPreflightRequest.builder()
        .modelId("demo-model")
        .surface("chat")
        .featureProfile("chat_agent")
        .request(chatRequest)
        .requestOptions(trace)
        .build(),
    AgentServingPreflightPolicy.clean());

if (!gate.ready()) {
    throw new IllegalStateException("Gollek serving gate failed: "
        + gate.blockingMessages());
}
```

Use `gate.toMetadata()` for CI artifacts, dashboards, or Wayang-Gollek startup
health reports.

## Next

- [Agent Integration API](/docs/agent-integration-api)
- [Agent Integration Boundary](/docs/agent-integration-boundary)
- [Runtime Core API](/docs/runtime/core-api)
