---
layout: default
title: Agent Integration API
---

# Agent Integration API

Gollek exposes an agent-facing serving contract for systems such as Wayang-Gollek. The API lets an external agent runtime discover serving capabilities, validate payloads, fetch MCP tool definitions, create embeddings, inject caller-selected RAG context, and call OpenAI-compatible generation endpoints.

Gollek does not plan, execute tools, own memory, or manage workflow state. Those decisions stay in Wayang-Gollek or another agent orchestrator.

## Endpoint Summary

| Purpose | Method | Path | Model Invoked |
|---|---|---|---|
| Capability discovery | `GET` | `/v1/agent/capabilities` | No |
| Machine-readable contract | `GET` | `/v1/agent/contract` | No |
| Readiness issue catalog | `GET` | `/v1/agent/readiness/issues` | No |
| Serving preflight | `POST` | `/v1/agent/preflight` | No |
| Request validation | `POST` | `/v1/agent/validate?surface={surface}` | No |
| Tool schema validation | `POST` | `/v1/agent/tools/validate` | No |
| MCP server discovery | `GET` | `/v1/mcp/servers` | No |
| MCP tool discovery | `GET` | `/v1/mcp/tools?compat=openai` | No |
| Chat Completions | `POST` | `/v1/chat/completions` | Yes |
| Responses | `POST` | `/v1/responses` | Yes |
| Embeddings | `POST` | `/v1/embeddings` | Yes |
| Model capabilities | `GET` | `/v1/models/{id}/capabilities` | No |

Use `GET /v1/agent/contract` as the source of truth for the current schema hints. The current contract object uses `version: "v1"`, `contract_version: "v1"`, `supported_contract_versions: ["v1"]`, and `service_role: "inference_serving_engine"`.

## Auth And Trace

Deployments can expose API-key and authorization headers according to the returned contract. The Java SDK sends Gollek trace headers through `AgentRequestOptions`.
For compatibility with Gollek's serving endpoints, the SDK sends both `X-API-Key: <token>` and `Authorization: Bearer <token>`.

| Field | Header | Body aliases |
|---|---|---|
| Request id | `X-Gollek-Request-Id` | `request_id` |
| Trace id | `X-Gollek-Trace-Id` | `trace_id`, `trace` |
| Session id | `X-Gollek-Session-Id` | `session_id`, `conversation`, `previous_response_id` |
| User id | `X-Gollek-User-Id` | `user`, `user_id` |

Gollek propagates trace details into response headers and response metadata under `gollek_trace`.

## Contract Discovery

Use capabilities for lightweight feature discovery:

```bash
curl -s http://localhost:8080/v1/agent/capabilities \
  -H "X-API-Key: community"
```

Use the contract endpoint when an orchestrator needs endpoint paths, schema hints, boundary rules, streaming metadata, and trace behavior:

```bash
curl -s http://localhost:8080/v1/agent/contract \
  -H "X-API-Key: community"
```

The contract includes:

- `contract_version`
- `supported_contract_versions`
- `compatibility`
- `feature_negotiation`
- `boundary.gollek_owns`
- `boundary.agent_orchestrator_owns`
- `auth`
- `traceability`
- `streaming`
- `endpoints`
- `schemas`
- `readiness_issue_catalog`
- `readiness_issue_catalog_by_code`

Wayang-Gollek should read these fields at startup or during health checks, then adapt its own workflow only to supported surfaces.
Use `feature_negotiation.required_features` as the startup gate for a Wayang-Gollek integration. Treat unknown feature names as forward-compatible and ignore them unless your orchestrator explicitly needs that feature. Gollek keeps the feature flags scoped to serving primitives such as OpenAI-compatible chat/responses, embeddings, MCP tool discovery, request validation, tool contract validation, and RAG context injection; Wayang-Gollek still owns planning, memory, retrieval policy, vector-store state, tool authorization, tool execution, retries, and workflow state.
The readiness issue catalog gives non-Java clients the same stable code,
default severity, summary, and remediation metadata that the Java SDK exposes
through `AgentReadinessIssueCodes`. For clients that only need code metadata,
call `GET /v1/agent/readiness/issues` instead of downloading the full contract.

## Serving Feature Profiles

Feature profiles are named shortcuts for serving requirements. They help an
orchestrator request a known Gollek capability bundle without hardcoding every
feature flag. Profiles still describe serving primitives only; they do not
choose an agent plan, execute tools, select documents, own memory, or create
workflow state.

`feature_negotiation.default_feature_profile` is `agent_serving`. The contract
also returns `supported_feature_profiles` and a `feature_profiles` catalog with
each profile's required and optional features.

| Profile | Use it for | Still owned by Wayang-Gollek or caller |
|---|---|---|
| `agent_serving` | Full serving gate for chat, Responses, embeddings, MCP discovery, validation, and RAG context injection | Planning, memory, retrieval policy, vector store, tool execution |
| `chat_agent` | Chat Completions serving with tools, system prompts, streams, and caller-supplied RAG context | Agent loop, tool authorization, tool execution, retrieval |
| `responses_agent` | Responses API serving with the same external orchestration boundary | Agent loop, tool authorization, tool execution, retrieval |
| `embedding_rag` | Embedding generation for caller-owned RAG indexing and retrieval | Chunking policy, vector storage, retrieval, ranking |
| `mcp_tools` | MCP discovery plus tool schema validation without execution | MCP calls, auth, approvals, tool result loop |

Send `feature_profile` to `/v1/agent/preflight` when a route has a known shape.
If `required_features` or `optional_features` are supplied, they override the
profile-derived lists for that request. Unsupported profile names block the
feature-negotiation check with `FEATURE_PROFILE_UNSUPPORTED`.

## Model Route Capabilities

Use model capabilities before routing a particular agent request. This endpoint describes whether a selected model can use Gollek's serving surfaces for system prompts, tools, streaming, embeddings, and caller-supplied RAG context.
Gollek advertises this route as `model_capabilities` in both `/v1/agent/capabilities` and `/v1/agent/contract`; treat it as a required preflight surface for agent-serving integrations.

```bash
curl -s http://localhost:8080/v1/models/demo-model/capabilities \
  -H "X-API-Key: community"
```

From the CLI, use the same model-route check and fail CI when the selected model cannot satisfy the agent-serving route:

```bash
gollek agent model-capabilities \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --require-serving-boundary
```

The capability matrix includes:

- `available`, `known`, `preferred_provider`
- `limits`
- `api_contract`
- `openai_compatibility`
- `inference`
- `tooling`
- `rag`
- `embeddings`
- `modalities`
- `provider_candidates`
- `metadata`

For an agent-serving route, require completion serving, Chat Completions and Responses compatibility, system prompt support, tool definition ingestion, and RAG context injection. Also keep `tooling.tool_execution`, `rag.retrieval_policy`, and `rag.vector_store_ownership` set to `false` so Wayang-Gollek remains responsible for tool execution and retrieval policy.

For embedding and RAG indexing routes, require `openai_compatibility.embeddings`,
`modalities.embeddings`, and `embeddings.generation`. Use
`embeddings.dimensions` to match a caller-owned vector store when model metadata
knows the output size, and treat `embeddings.encoding_formats` plus
`embeddings.input_aliases` as the stable request-shape hints. The embedding
capability block must keep `embeddings.retrieval_policy` and
`embeddings.vector_store_ownership` set to `false`; Gollek generates vectors,
while Wayang-Gollek or another orchestrator owns retrieval and storage.

## Serving Preflight

Use server-side preflight when a non-Java client wants one validation-only readiness report instead of calling every discovery endpoint itself. The preflight combines capabilities, contract, feature negotiation, selected model route, MCP discovery, tool contract validation, and request validation.
The response also echoes `contract_version`, `supported_contract_versions`, and `feature_negotiation`, so CI can store one artifact that records which serving contract was checked. Send `required_contract_version`, `required_features`, and `optional_features` to make that negotiation explicit. Unsupported required features block the preflight; unsupported optional features become warnings.

```bash
curl -s http://localhost:8080/v1/agent/preflight \
  -H "Content-Type: application/json" \
  -H "X-API-Key: community" \
  -d '{
    "model": "demo-model",
    "surface": "chat",
    "feature_profile": "chat_agent",
    "required_contract_version": "v1",
    "required_features": ["rag_context", "mcp_tool_discovery"],
    "optional_features": ["stream_usage_reporting"],
    "request": {
      "request_id": "req_preflight_123",
      "messages": [
        {"role": "system", "content": "Use supplied context."},
        {"role": "user", "content": "Can this route support my agent?"}
      ],
      "tools": [
        {
          "type": "function",
          "function": {
            "name": "search_context",
            "parameters": {"type": "object"}
          }
        }
      ],
      "rag_context": [
        {"source": "docs", "text": "Gollek validates readiness without invoking the model."}
      ]
    }
  }'
```

The CLI exposes the same server-side preflight for local development and CI:

```bash
gollek agent capabilities \
  --base-url http://localhost:8080 \
  --api-key community \
  --require-serving-boundary

gollek agent contract \
  --base-url http://localhost:8080 \
  --api-key community \
  --require-serving-boundary

gollek agent issue-catalog \
  --base-url http://localhost:8080 \
  --api-key community \
  --area tool_validation \
  --require-serving-boundary

gollek agent model-capabilities \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --require-serving-boundary

gollek agent tools-validate \
  --base-url http://localhost:8080 \
  --api-key community \
  --tool-file tools.json \
  --require-clean \
  --require-serving-boundary

gollek agent request-validate \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --surface chat \
  --prompt "Can this route support my agent?" \
  --tool-file tools.json \
  --rag-context "Gollek validates payload mapping without invoking the model." \
  --require-clean \
  --require-serving-boundary

gollek agent mcp-tools \
  --base-url http://localhost:8080 \
  --api-key community \
  --require-tools \
  --require-serving-boundary

gollek agent readiness \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --surface chat \
  --feature-profile chat_agent \
  --prompt "Can this route support my agent?" \
  --rag-context "Gollek validates readiness without invoking the model." \
  --require-tools \
  --require-clean \
  --require-serving-boundary \
  --json

gollek agent preflight \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --surface chat \
  --feature-profile chat_agent \
  --preflight-policy requested_route \
  --prompt "Can this route support my agent?" \
  --rag-context "Gollek validates readiness without invoking the model."
```

Use `gollek agent template-schema --json` to print the canonical Draft 2020-12
schema for saved route templates before wiring a builder, GitHub Action, or
Wayang-Gollek integration. Use `gollek agent template-example --list` to inspect
the starter catalog first, or `gollek agent template-example --list --json` when
a website or builder UI needs machine-readable route choices. Use
`gollek agent template-example --id embedding_rag --output wayang-agent-route.json`
to emit a valid starter route by catalog id for chat, Responses, embeddings/RAG,
or MCP tool-schema routes, then run it through template-check before publishing.
Human mode prints the exact `gollek agent template-check --request-file ... --json`
command for the saved file, including shell-safe quoting when the path contains
spaces. Use `--json` when stdout must remain machine-readable, or combine
`--output` with `--list` to save the catalog JSON for a local builder cache.
Output writes are conservative by default and require `--overwrite` before
replacing an existing file. The id flag accepts the catalog ids and normalizes
hyphenated aliases such as `embedding-rag`; explicit surface or feature-profile
overrides must match the selected id. Use
`gollek agent template-check --request-file wayang-agent-route.json --json`
as the local publishing guard when CI only needs to parse a saved route
template and catch top-level/nested route drift. It returns
`object: "gollek.agent_template_check"` and exits without HTTP, model
invocation, tool execution, retrieval, or workflow state. It also rejects
missing model ids, unsupported surfaces, unsupported feature profiles, and
preflight policy typos before a low-code builder publishes the template. JSON
output keeps the compatibility `issues` string array and adds `issue_details[]`
with stable `code`, `field`, optional `value`, optional `suggested_value`, and
optional `allowed_values` so GitHub Actions or builder UIs can annotate the
exact setting and display likely fixes for common typos. Human output prints
the same stable codes plus compact field, value, suggested-value, and
allowed-value hints for template issues. Use `gollek agent readiness` as the CI bundle when an
orchestrator wants one local command to call
every discovery and validation surface. It returns
`object: "gollek.agent_readiness_report"` with `checked_areas`, `checks`,
`issues_by_area`, and per-check results for capabilities, contract, model
capabilities, MCP tools, tool validation, request validation, and server
preflight. Use `--json` for raw discovery, readiness, preflight, or
issue-catalog responses. `gollek agent issue-catalog --area tool_validation`
prints the stable code, default severity, summary, and remediation metadata that
dashboards can show when preflight returns active issues. `gollek agent
capabilities`, `gollek agent contract`, `gollek agent issue-catalog`, `gollek
agent model-capabilities`, `gollek agent tools-validate`, `gollek agent
request-validate`, and `gollek agent mcp-tools` exit `1` with
`--require-serving-boundary` when the server, selected model, or validation
response drifts from the inference-serving boundary. `gollek agent readiness`
always fails on blocked checklist items, including boundary drift, because it is
meant to be a complete agent-serving gate. `gollek agent tools-validate
--require-clean`, `gollek agent request-validate --require-clean`, and `gollek
agent readiness --require-clean` also exit `1` on portability warnings; `gollek
agent mcp-tools --require-tools` and `gollek agent readiness --require-tools`
exit `1` when discovery returns no usable tools. `gollek agent
template-check`, `gollek agent request-validate`, `gollek agent readiness`, and `gollek agent preflight`
accept `--feature-profile` with the same serving profile names advertised by
the contract. `embedding_rag` defaults generated CLI requests to the embeddings
surface when `--surface` is omitted. `gollek agent
preflight` accepts `--request-json` or `--request-file` for a full
OpenAI-compatible request, and `--no-mcp` for routes that do not depend on MCP
discovery. `template-check` exits `0` when the saved template is locally valid,
`1` when the template itself is invalid, and `2` for CLI parse/config errors.
The readiness and preflight commands exit `0` when the route is ready, `1` when
blocked, and `2` for local CLI or connection errors.

### Preflight Policies And Route Gates

Server preflight reports whether Gollek can serve a request. The caller still
chooses how strict the integration gate should be. Use a policy profile when
Wayang-Gollek, another agent runtime, or CI needs the same decision every time.

| Policy profile | Blocks on | Use it for |
|---|---|---|
| `readiness_only` | Gollek readiness failures only | Local development and loose compatibility checks. |
| `requested_route` | Readiness failures plus selected route mismatch | Production startup checks where model, surface, and feature profile must stay stable. |
| `clean` | Readiness failures, route mismatch, and warnings | CI, release gates, and low-code agent publishing checks. |

The CLI also exposes the strictness switches directly:

- `--require-route-match` blocks when the selected route differs from the requested model, surface, or feature profile.
- `--fail-on-warning` or `--fail-on-warnings` blocks when preflight returns warnings.
- `--preflight-policy clean` is equivalent to requiring route match and failing on warnings.

Examples:

```bash
gollek agent preflight \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --surface chat \
  --feature-profile chat_agent \
  --preflight-policy readiness_only

gollek agent preflight \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --surface chat \
  --feature-profile chat_agent \
  --preflight-policy requested_route

gollek agent preflight \
  --base-url http://localhost:8080 \
  --api-key community \
  --request-file wayang-agent-route.json \
  --preflight-policy clean \
  --json
```

`--json` returns a typed wrapper with `object: "gollek.agent_preflight_result"`.
It preserves the raw server response, the
typed readiness report, the requested route, the selected route,
`route_comparison`, `route_mismatches`, `route_mismatch_messages`,
`preflight_gate`, and `preflight_policy`. The raw server response remains
`object: "gollek.agent_preflight"`.

When the selected route drifts from the request, `route_comparison.mismatches`
and top-level `route_mismatches` show each field with `requested`, `selected`,
and a compact `message`. This is the first place to inspect when CI blocks on
`requested_route` or `clean`.

Request files can carry their own baseline policy, which the CLI can make
stricter with flags:

```json
{
  "model": "demo-model",
  "surface": "chat",
  "feature_profile": "chat_agent",
  "preflight_policy": {
    "profile": "requested_route"
  },
  "request": {
    "model": "demo-model",
    "messages": [
      {"role": "system", "content": "Use supplied context and tools when relevant."},
      {"role": "user", "content": "Answer using the provided context."}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "search_context",
          "parameters": {"type": "object"}
        }
      }
    ],
    "rag_context": [
      {"source": "docs", "text": "The agent runtime selected this context before calling Gollek."}
    ]
  }
}
```

Use this shape for low-code builders and agent templates: the template can ask
for `requested_route`, while CI can add `--preflight-policy clean` before
publishing. The policy never executes tools, runs retrieval, stores memory, or
chooses the next agent step; it only decides whether Gollek's serving route is
acceptable for the caller.

Keep the top-level route fields and nested request route fields aligned. For
example, top-level `model`, `surface`, and `feature_profile` should match any
nested `request.model`, `request.surface`, and `request.feature_profile`. The
`gollek agent template-check`, `gollek agent request-validate`, `gollek agent
readiness`, and `gollek agent preflight` fail locally on explicit conflicts
before calling Gollek. Use
`--model`, `--surface`, or `--feature-profile` when a CI job or operator
intentionally wants to override a saved template.
With `--json`, local route conflicts emit `code: "AGENT_ROUTE_CONFLICT"` and a
`conflicts` array containing `field`, `top_level`, and `request` values, so CI
can report exactly which saved-template route field drifted.

The response always keeps the serving boundary visible:

- `object: "gollek.agent_preflight"`
- `status: "ready"` or `"blocked"`
- `ready`
- `blocking_issue_count`
- `warning_count`
- `ready_check_count`
- `blocked_check_count`
- `skipped_check_count`
- `check_results`
- `checked_areas`
- `readiness_report`
- `issues`
- `issue_hints`
- `issue_hints_by_area`
- `issue_hints_by_code`
- `remediation_plan`
- `blocking_remediation_plan`
- `warning_remediation_plan`
- `remediation_plan_by_area`
- `remediation_plan_by_code`
- `issues_by_area`
- `issue_codes_by_area`
- `blocking_messages`
- `warning_messages`
- `blocking_codes`
- `warning_codes`
- `boundary.validation_only: true`
- `boundary.model_invoked: false`
- `boundary.tool_execution: false`
- `boundary.retrieval_execution: false`

Use `check_results` when a CI job or agent dashboard needs per-area status for
capabilities, contract, model route, MCP discovery, tool validation, and request
validation. Each check includes `status`, `ready`, `requested`,
`blocking_messages`, `warning_messages`, `blocking_codes`, `warning_codes`,
`issue_hints`, `remediation_plan`, and `remediation_plan_by_code`;
`status: "skipped"` with `requested: false` means the preflight intentionally
did not run that area. Use the top-level and per-check code fields for
automation, and the message fields for operator-facing logs. The top-level
`issues` array carries the same stable `code` per issue, alongside `area`,
`severity`, and `message`; `issue_codes_by_area`, `blocking_codes`, and
`warning_codes` provide compact summaries for CI gates and dashboards.
`issue_hints` adds `default_severity`, `summary`, and `remediation` for active
issues so non-Java dashboards can show operator guidance without reimplementing
the SDK catalog. `issue_hints_by_area` and `issue_hints_by_code` expose the same
active hints grouped for dashboards, CI annotations, and orchestrator health
checks. `remediation_plan` deduplicates those active hints into next-action
steps with the source `messages` preserved. `blocking_remediation_plan` and
`warning_remediation_plan` expose the same steps split by severity for CI gates,
while `remediation_plan_by_area` keeps the same steps grouped by readiness area
and `remediation_plan_by_code` groups them by stable readiness code. For all
possible readiness codes, read
`readiness_issue_catalog` or `readiness_issue_catalog_by_code` from
`GET /v1/agent/contract`, or call the lighter
`GET /v1/agent/readiness/issues` endpoint.
Checks can also include `details` for typed dashboard summaries. Embedding
preflights expose `check_results.request_validation.details.embedding` with
input counts, input lengths, requested dimensions, encoding format, metadata
keys, and the embedding/RAG ownership boundary. The contract exposes this shape
through `schemas.agent_preflight_check_result` so clients can validate each
`check_results` entry consistently.

Human-mode `gollek agent preflight` and `gollek agent readiness` print the same
details as operator-facing lines. Readiness also echoes the selected feature
profile beside the model and surface. Blocking and warning messages include
stable `[code: ...]` annotations when codes are available. When a code maps to
the readiness issue catalog, the CLI also prints a short `remediation:` line
from `issue_hints` or the SDK catalog. Treat these lines as a readable projection
of the JSON `check_results` and `issue_hints` maps, not as a separate contract:

```text
Selected route: model=other-model, surface=chat, feature_profile=chat_agent
Route comparison: mismatch fields=model
  mismatch: model requested=demo-model selected=other-model
Preflight gate: blocked
  blocking: selected route differs from requested route: model requested=demo-model selected=other-model
```

```text
- request_validation: ready, requested=true
  details: surface=chat, model=demo-model
  boundary: validation_only=true, model_invoked=false, tool_execution=false, retrieval_execution=false
  request: streaming=false, messages=2, inputs=0, tools=1, parameters=model,tools
  rag: injected=true, items=1, alias=rag_context
```

For embedding preflights, the request-validation detail line exposes the vector
route without giving Gollek retrieval or storage ownership:

```text
- request_validation: ready, requested=true
  details: surface=embeddings, model=demo-embed
  embeddings: inputs=2, input_lengths=5,4, requested_dimensions=768, encoding=float, metadata_keys=tenant
  embedding boundary: generation=true, retrieval_execution=false, retrieval_policy_owner=agent_orchestrator, vector_store_owner=agent_orchestrator
```

The contract schema advertises `check_results` as a map keyed by readiness area
so clients can validate future areas without hard-coding a fixed field list.
The top-level response and nested readiness report both include
`checked_areas`, ordered like the emitted `checks` map, so dashboards can show
which preflight stages were evaluated without expanding each check.
`readiness_report` mirrors the CLI/SDK `gollek.agent_readiness_report` shape
while the top-level `object` remains `gollek.agent_preflight` for
backward-compatible API callers. The contract marks emitted trace, boundary,
check-count, issue, and message fields as required for both the top-level
preflight response and the nested readiness report.

By default, preflight requires MCP discovery, tool validation, and request validation. For routes that do not use MCP tools, set `discover_mcp_tools: false`, `mcp_discovery_required: false`, and optionally `validate_tools: false`.

For embedding-only RAG indexing checks, preflight the embedding route without
MCP/tool checks:

```bash
curl -s http://localhost:8080/v1/agent/preflight \
  -H "Content-Type: application/json" \
  -H "X-API-Key: community" \
  -d '{
    "model": "demo-embed",
    "surface": "embeddings",
    "discover_mcp_tools": false,
    "mcp_discovery_required": false,
    "validate_tools": false,
    "tool_validation_required": false,
    "request": {
      "request_id": "req_embed_preflight_123",
      "input": ["Find context for this task"],
      "dimensions": 768,
      "encoding_format": "float",
      "metadata": {"tenant": "agent-project"}
    }
  }'
```

The resulting `model_capabilities.embeddings` block reports whether
`/v1/embeddings` can generate vectors for the selected model, known dimensions,
accepted encoding formats, input aliases, and the retrieval/vector-store
boundary. The nested `request_validation.normalized` block reports
`input_count`, `input_lengths`, `requested_dimensions`, `encoding_format`, and
`rag.vector_store_owned_by: "agent_orchestrator"` without invoking the model.
For CI and dashboards, the same summary is available at
`check_results.request_validation.details.embedding`.

Readiness uses the same request-building flags as preflight, plus `--no-tool-validation`, `--no-request-validation`, `--mcp-optional`, and `--no-mcp` when a route intentionally skips part of the checklist. It does not execute tools, run retrieval, authorize tools, or invoke a model; it only verifies that Gollek is ready to serve the request while the agent runtime owns planning and workflow state.

## Request Validation

Validation maps a request without invoking a model. Use it before a workflow starts or when a low-code builder saves an agent configuration.

```bash
curl -s "http://localhost:8080/v1/agent/validate?surface=chat" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: community" \
  -d '{
    "model": "demo-model",
    "request_id": "req_validate_123",
    "messages": [
      {"role": "system", "content": "Use supplied context."},
      {"role": "user", "content": "Validate this request."}
    ],
    "rag_context": [
      {"source": "docs", "text": "Gollek validates agent-facing payloads."}
    ]
  }'
```

Supported validation surfaces are `chat`, `responses`, and `embeddings`.
From the CLI, validate generated or supplied request JSON directly:

```bash
gollek agent request-validate \
  --base-url http://localhost:8080 \
  --api-key community \
  --model demo-model \
  --surface chat \
  --prompt "Validate this request." \
  --tool-file tools.json \
  --rag-context "Caller-owned retrieval context." \
  --require-clean \
  --require-serving-boundary
```

Use `--request-json` or `--request-file` when validating a real agent builder
payload. The command accepts either a direct request object or a full saved
route template with a nested `request` object, checks route consistency locally,
then posts only to `/v1/agent/validate`; it does not invoke a model, execute
tools, run retrieval, or update agent memory.

The validation response reports:

- `object: "gollek.agent_validation"`
- `surface`
- `valid`
- `model_invoked: false`
- `normalized`
- `trace`
- `boundary.validation_only: true`
- `boundary.tool_execution: false`
- `boundary.retrieval_execution: false`

## Tool Contract Validation

Gollek accepts OpenAI-compatible tool definitions and MCP-derived tool definitions, validates their schema shape, and can return tool-call declarations from model output. Gollek does not authorize or execute tools.

```bash
curl -s http://localhost:8080/v1/agent/tools/validate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: community" \
  -d '{
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "search_context",
          "description": "Search caller-owned knowledge",
          "parameters": {
            "type": "object",
            "properties": {
              "query": {"type": "string"}
            },
            "required": ["query"]
          }
        }
      }
    ]
  }'
```

Tool validation is useful for Wayang-Gollek low-code builders because invalid tool definitions can be rejected before a workflow is published.
From the CLI, validate a tool bundle directly and optionally fail CI on portability warnings:

```bash
gollek agent tools-validate \
  --base-url http://localhost:8080 \
  --api-key community \
  --tool-file tools.json \
  --require-clean \
  --require-serving-boundary
```

The command posts only to `/v1/agent/tools/validate`; it does not invoke a model, authorize a tool, execute a tool, or start an agent loop.

## MCP Discovery

Gollek can expose registered MCP servers and tool definitions:

```bash
curl -s "http://localhost:8080/v1/mcp/tools?compat=openai" \
  -H "X-API-Key: community"
```

Use `compat=openai` when the next call is `/v1/chat/completions` or `/v1/responses`.

From the CLI, discover OpenAI-compatible MCP tool definitions and fail CI if the MCP surface is unavailable, crosses into execution, or returns no tools:

```bash
gollek agent mcp-tools \
  --base-url http://localhost:8080 \
  --api-key community \
  --require-tools \
  --require-serving-boundary
```

Use `--server <name>` to inspect one MCP server, `--raw-mcp-tools` for raw MCP tool schemas, and `--include-disabled-mcp` when diagnostics need disabled registrations.

Gollek's role ends at discovery and schema conversion. Wayang-Gollek owns the MCP client loop, tool authorization, execution, result messages, retries, and operator approval.

## Embeddings For Caller-Owned RAG

Gollek generates embeddings, but the vector store and retrieval policy belong to the caller.

```bash
curl -s http://localhost:8080/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "X-API-Key: community" \
  -d '{
    "model": "demo-embed",
    "request_id": "req_embed_123",
    "trace_id": "trace_embed_123",
    "input": ["Find context for this task"],
    "metadata": {"tenant": "agent-project"}
  }'
```

OpenAI-compatible embedding responses contain `object: "list"`, `model`,
`data[].embedding`, and metadata. SDK callers can use `AgentEmbeddingView` to
extract vectors, dimensions, usage, metadata, and trace details.

Use `POST /v1/agent/validate?surface=embeddings` when a builder or CI job needs
to dry-run the request shape before serving. The normalized validation payload
reports `input_count`, `input_lengths`, optional `requested_dimensions`,
`encoding_format`, metadata, and a RAG boundary summary showing that retrieval
execution, retrieval policy, and vector-store ownership remain outside Gollek.

## RAG Context Injection

After Wayang-Gollek retrieves and ranks documents, pass selected chunks to Gollek as `rag_context`.

Accepted aliases include:

- `rag_context`
- `retrieval_context`
- `retrieved_context`
- `context_documents`
- `retrieved_documents`

Context items can include:

| Field | Purpose |
|---|---|
| `text`, `content`, `page_content` | Retrieved text chunk |
| `id`, `chunk_id` | Stable chunk id |
| `source` | URI, file, path, or source label |
| `title` | Human-readable title |
| `score` | Retriever relevance score |
| `metadata` | Caller-owned metadata |

Gollek injects supplied context into the model request and records RAG metadata. It does not search a vector store or choose which documents are relevant.

## Chat Completions

Use Chat Completions for OpenAI-compatible message arrays:

```bash
curl -s http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: community" \
  -d '{
    "model": "demo-model",
    "request_id": "req_agent_123",
    "trace_id": "trace_agent_123",
    "messages": [
      {"role": "system", "content": "Answer using supplied context and tools when relevant."},
      {"role": "user", "content": "What changed for agentic support?"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "search_context",
          "parameters": {"type": "object"}
        }
      }
    ],
    "tool_choice": "auto",
    "rag_context": [
      {
        "id": "chunk-1",
        "source": "docs/agentic",
        "score": 0.92,
        "text": "Gollek exposes inference APIs for agent orchestrators."
      }
    ]
  }'
```

For streaming, set `stream: true` and use `stream_options`:

```json
{
  "stream": true,
  "stream_options": {
    "include_usage": true,
    "include_trace": true,
    "include_stream_metadata": true
  }
}
```

Streaming uses server-sent events and ends with `data:[DONE]`.

## Responses

Use Responses when the caller prefers `instructions`, `input`, `previous_response_id`, and Responses-compatible stream events.

```bash
curl -s http://localhost:8080/v1/responses \
  -H "Content-Type: application/json" \
  -H "X-API-Key: community" \
  -d '{
    "model": "demo-model",
    "instructions": "Use the provided context when relevant.",
    "input": "Summarize the Gollek agent integration boundary.",
    "retrieval_context": [
      {
        "source": "docs/api",
        "text": "Gollek owns serving, MCP discovery, embeddings, and RAG context injection."
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "lookup",
          "parameters": {"type": "object"}
        }
      }
    ]
  }'
```

Responses streaming emits events such as `response.created`, `response.output_text.delta`, `response.output_text.done`, and `response.completed`, then the `[DONE]` sentinel.

## Java SDK Bridge

The full Java remote SDK exposes the same serving boundary through `client.agent()`.
Standalone agent runtimes can also depend on the lighter `gollek-sdk-agent`
artifact and construct `AgentIntegrationClient` directly.
Use `servingReadiness(...)` when a caller wants the SDK to run discovery and
dry-run validation as one serving-only preflight. Use the individual typed views
when a UI needs to display each contract section separately.
Non-Java runtimes can call `POST /v1/agent/preflight` directly for the same
readiness shape.

```java
AgentRequestOptions trace = AgentRequestOptions.builder()
    .requestId("req-wayang-123")
    .traceId("trace-wayang-123")
    .sessionId("session-abc")
    .userId("user-42")
    .build();

AgentCapabilitiesView capabilities = client.agent().capabilitiesView(trace);
if (!capabilities.hasRequiredAgentServingCapabilities()) {
    throw new IllegalStateException("Gollek capabilities mismatch: "
        + capabilities.agentServingCapabilityIssues());
}

AgentServingContract contract = client.agent().contractView(trace);
if (!contract.hasRequiredServingBoundary()) {
    throw new IllegalStateException("Gollek serving boundary mismatch: " + contract.servingBoundaryIssues());
}

AgentModelCapabilitiesView model = client.agent().modelCapabilitiesView("demo-model", trace);
if (!model.hasRequiredAgentServingRoute()) {
    throw new IllegalStateException("Model cannot serve this agent route: "
        + model.agentServingRouteIssues());
}

AgentModelCapabilitiesView.EmbeddingCapabilities embeddingRoute = model.embeddings();
if (!embeddingRoute.storageOwnedByOrchestrator()) {
    throw new IllegalStateException("Embedding route crossed the RAG storage boundary");
}

AgentMcpDiscoveryView tools = client.agent().mcpToolsView(true, true, trace);
if (!tools.discoveryOnly()) {
    throw new IllegalStateException("MCP discovery endpoint crossed the serving boundary");
}

AgentToolValidationView toolCheck = client.agent().validateToolsView(
    Map.of("tools", tools.openAiToolDefinitions()), trace);
if (toolCheck.hasWarnings()) {
    wayangAudit.recordToolSchemaWarnings(toolCheck.warnings());
}

AgentEmbeddingView embedding = client.agent().createEmbeddingView(Map.of(
    "model", "demo-embed",
    "input", List.of("Find context for this task")
), trace);

List<Map<String, Object>> retrievedChunks = wayangVectorStore.search(embedding.firstVector());

Map<String, Object> chatRequest = Map.of(
    "model", "demo-model",
    "messages", List.of(
        Map.of("role", "system", "content", "Use supplied context and tools when relevant."),
        Map.of("role", "user", "content", "Answer the task.")),
    "tools", tools.openAiToolDefinitions(),
    "rag_context", retrievedChunks
);

AgentValidationView dryRun = client.agent().validateRequestView("chat", chatRequest, trace);
if (!dryRun.validationOnly() || dryRun.modelInvoked()) {
    throw new IllegalStateException("Validation endpoint crossed the serving boundary");
}

AgentServingReadinessReport readiness = AgentServingReadinessReport.builder()
    .capabilities(capabilities)
    .contract(contract)
    .modelRoute(model)
    .mcpDiscovery(tools, true)
    .toolValidation(toolCheck, true)
    .requestValidation(dryRun, true)
    .build();
readiness.requireReady("Gollek serving preflight failed");
wayangAudit.recordPreflight(readiness.toReport());
if (readiness.hasWarnings()) {
    wayangAudit.recordPreflightWarnings(readiness.warningMessages());
}

AgentResponseView response = client.agent().createChatCompletionView(chatRequest, trace);

wayangToolLoop.handle(response.toolCalls());
wayangMemory.recordAssistantMessage(response.outputText());
```

Compact preflight callers can use:

```java
AgentServingReadinessReport readiness = client.agent().servingReadiness(
    "demo-model",
    "chat",
    chatRequest,
    trace);
readiness.requireReady("Gollek serving preflight failed");
```

When the Gollek server exposes `POST /v1/agent/preflight`, Java callers can use
the same one-call server-side preflight and still receive the typed readiness
report:

```java
AgentServingReadinessReport readiness = client.agent().servingPreflightReadiness(
    AgentServingPreflightRequest.builder()
        .modelId("demo-model")
        .surface("chat")
        .featureProfile("chat_agent")
        .request(chatRequest)
        .requestOptions(trace)
        .build());
readiness.requireReady("Gollek serving preflight failed");
```

Use the typed result and gate when the caller also wants route-match and warning
policy in one reusable object:

```java
AgentServingPreflightPolicy policy = AgentServingPreflightPolicy.requestedRoute();

AgentServingPreflightResult result = client.agent().servingPreflightResult(
    AgentServingPreflightRequest.builder()
        .modelId("demo-model")
        .surface("chat")
        .featureProfile("chat_agent")
        .request(chatRequest)
        .requestOptions(trace)
        .build());

AgentServingPreflightGate gate = result.gate(policy);
if (!gate.ready()) {
    throw new IllegalStateException("Gollek serving gate failed: "
        + gate.blockingMessages());
}

wayangAudit.recordPreflightGate(gate.toMetadata());
```

For the shortest SDK call, ask the client to evaluate the policy directly:

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
gate.result().readiness().requireReady("Gollek serving preflight failed");
if (!gate.ready()) {
    throw new IllegalStateException("Gollek route gate failed: "
        + gate.blockingMessages());
}
```

`AgentServingPreflightPolicy.readinessOnly()` checks only server readiness,
`requestedRoute()` also requires the selected route to match the request, and
`clean()` also treats warnings as blocking. `AgentServingPreflightResult`
exposes `requestedRoute()`, `selectedRoute()`, `routeMatches()`,
`routeMismatchFields()`, `routeMismatches()`, `routeMismatchDetails()`,
`routeMismatchMessages()`, `readyForRequestedRoute()`, and
`statusForRequestedRoute()` for dashboards and integration tests.

`toReport()` emits the same CI-friendly shape as the CLI readiness gate:
`object: "gollek.agent_readiness_report"`, readiness status, blocking and
warning counts, check counts, per-check messages, and the validation-only
boundary. Use `toMetadata()` when the agent runtime only needs compact status
fields to attach to request metadata; the metadata includes `checked_areas` for
compact health dashboards. SDK callers can also use `blockingCodes()`,
`warningCodes()`, `issueCodesByArea()`, and per-check helpers such as
`requestValidationCheck().hasBlockingCode("AGENT_REQUEST_INVALID")` for CI gates
or agent-runtime routing decisions. `readiness.issueHints()` returns active
issues with catalog summaries and remediation text; `AgentReadinessIssueCodes.describe(code)`
returns the same catalog metadata for standalone codes. Readiness checks can
also include `details`; for embedding preflights,
`checks.request_validation.details.embedding` contains input counts, input
lengths, requested dimensions, encoding format, metadata keys, and the
embedding/RAG ownership boundary.

For a non-MCP route, keep the same serving checks while skipping MCP discovery
and tool validation:

```java
AgentServingReadinessReport readiness = client.agent().servingReadiness(
    AgentServingPreflightRequest.builder()
        .modelId("demo-model")
        .surface("chat")
        .request(chatRequest)
        .requestOptions(trace)
        .discoverMcpTools(false)
        .mcpDiscoveryRequired(false)
        .validateTools(false)
        .build());
readiness.requireReady("Gollek serving preflight failed");
```

For embedding-only routes, pass `surface("embeddings")`. The SDK then validates
the selected model through `embeddingRouteIssues()` instead of requiring chat,
tool, and RAG-context generation features:

```java
AgentServingReadinessReport readiness = client.agent().servingReadiness(
    AgentServingPreflightRequest.builder()
        .modelId("demo-embed")
        .surface("embeddings")
        .request(Map.of(
            "model", "demo-embed",
            "input", List.of("Find context for this task"),
            "dimensions", 768,
            "encoding_format", "float"))
        .requestOptions(trace)
        .discoverMcpTools(false)
        .mcpDiscoveryRequired(false)
        .validateTools(false)
        .toolValidationRequired(false)
        .build());
readiness.requireReady("Gollek embedding route is not ready");
```

The request dry-run also exposes typed embedding details, which is useful when
Wayang or another orchestrator wants to verify dimensions, encoding, and RAG
ownership before it creates vectors:

```java
AgentValidationView dryRun = client.agent().validateRequestView(
    "embeddings",
    Map.of(
        "model", "demo-embed",
        "input", List.of("Find context for this task"),
        "dimensions", 768,
        "encoding_format", "float"),
    trace);

AgentValidationView.EmbeddingValidation embedding = dryRun.embeddingValidation();
if (!embedding.rag().embeddingGeneration()
        || embedding.rag().retrievalExecution()
        || !embedding.storageOwnedByOrchestrator()) {
    throw new IllegalStateException("Gollek crossed the embedding/RAG serving boundary");
}

wayangAudit.recordEmbeddingDryRun(Map.of(
    "dimensions", embedding.requestedDimensions(),
    "encoding_format", embedding.encodingFormat(),
    "input_lengths", embedding.inputLengths()));
```

For live agent UIs or coding-agent loops, the lightweight bridge can also stream
without adding reactive dependencies:

```java
AgentStreamAccumulator.Snapshot stream = client.agent().streamChatCompletion(
    Map.of(
        "model", "demo-model",
        "messages", messages,
        "tools", tools.openAiToolDefinitions(),
        "rag_context", retrievedChunks),
    trace,
    event -> {
        if (event.hasDelta()) {
            wayangUi.appendDelta(event.delta());
        }
        if (event.hasToolCalls()) {
            wayangToolLoop.preview(event.toolCalls());
        }
    });

wayangToolLoop.handle(stream.toolCalls());
wayangMemory.recordAssistantMessage(stream.outputText());
```

In this bridge, Gollek produces embeddings, validates contracts, serves the model, and returns tool-call declarations. Wayang-Gollek owns vector search, tool execution, memory updates, approval policy, and the next agent step.

For a runnable version of this flow, use the JBang example in the Gollek repo:

```bash
cd gollek
./gradlew smokeJbangAgentBridgeExamples -Pgollek.jbang.agentBridge.offline=false
```

To run the script manually:

```bash
./gradlew :sdk:gollek-sdk-agent:publishToMavenLocal
cd examples/jbang
jbang run --no-integrations integration/wayang_gollek_serving_bridge.java --mock
```

Use `--live --base-url http://localhost:8080 --api-key community` when a Gollek serving endpoint is running.

## Wayang-Gollek Recipe

1. Start a Wayang-Gollek workflow with request, trace, session, and user identity.
2. Call `GET /v1/agent/capabilities`, `GET /v1/agent/contract`, and optionally `GET /v1/agent/readiness/issues` during startup or health checks.
3. Run `POST /v1/agent/preflight` or call each discovery endpoint separately.
4. Check the selected route with `GET /v1/models/{id}/capabilities`.
5. Load MCP tools from Gollek using `GET /v1/mcp/tools?compat=openai`.
6. Validate low-code tool definitions with `POST /v1/agent/tools/validate`.
7. Generate an embedding with `POST /v1/embeddings`.
8. Search the Wayang-Gollek vector store using the embedding vector.
9. Pass selected chunks to Gollek as `rag_context`.
10. Call `/v1/chat/completions` or `/v1/responses`.
11. If Gollek returns tool calls, execute them in Wayang-Gollek.
12. Send tool results back through a follow-up generation call if the workflow needs another model step.
13. Store memory, audit events, approvals, and workflow state in Wayang-Gollek.

## Non-Goals

Gollek's agent integration API intentionally does not:

- Plan tasks.
- Execute tools.
- Authorize tool calls.
- Own memory.
- Choose retrieval policy.
- Store vector indexes.
- Manage workflow state.
- Render low-code agent builders.
- Run multi-agent coordination loops.

Those responsibilities belong in Wayang-Gollek or another external orchestrator.

## Related Docs

- [Agent Serving Quick Start](/docs/tutorials/integrations/agent-serving)
- [Agent Integration Boundary](/docs/agent-integration-boundary)
- [Wayang-Gollek Agent System](/docs/agent-framework/)
- [Inference Serving](/docs/runtime/inference-serving)
- [Runtime Architecture](/docs/runtime/architecture)
- [SDK Modules](/docs/sdk-modules)
