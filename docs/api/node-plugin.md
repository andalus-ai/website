---
layout: default
title: NodePlugin API
---

# NodePlugin API Reference

The `NodePlugin` SPI provides a reactive interface for building visual node workflows that can be consumed by frontend editors (e.g., Flutter). It lives in the `tech.kayys.gollek.spi.node` package.

## Core Interface

```java
package tech.kayys.gollek.spi.node;

import io.smallrye.mutiny.Uni;
import tech.kayys.gollek.spi.plugin.GollekPlugin;

public interface NodePlugin extends GollekPlugin {
    /**
     * Returns the visual descriptor describing this node (metadata, ports, category, etc.).
     */
    NodeDescriptor descriptor();

    /**
     * Reactive execution of the node logic. The implementation receives a {@link NodeExecutionContext}
     * that provides typed access to inputs and allows writing typed outputs.
     */
    Uni<Void> execute(NodeExecutionContext context);
}
```

## Supporting Types

- **`NodeDescriptor`** – Immutable description of the node (id, name, category, version, ports, UI hints).
- **`NodePort`** – Definition of an input or output socket; includes name, data type, direction, and optional defaults.
- **`NodeCategory`** – Enum that drives visual styling in the frontend (LLM, PROMPT, ROUTER, MEMORY, TOOL, TRANSFORM, OUTPUT).
- **`NodeExecutionContext`** – Runtime context exposing:
  - `Optional<T> getInput(String name, Class<T> type)` – read typed inputs.
  - `void setOutput(String name, Object value)` – write typed outputs.
  - Additional helpers for tracing, token limits, and cancellation.

## Adapter for Legacy Phase Plugins

Existing `InferencePhasePlugin` implementations can be wrapped automatically by the built‑in `InferencePhaseNodeAdapter`, allowing seamless migration without code changes.

```java
InferencePhasePlugin legacy = ...;
NodePlugin node = new InferencePhaseNodeAdapter(legacy);
```

The adapter forwards descriptor information and schedules the legacy `execute` call on the Vert.x worker pool, guaranteeing non‑blocking behavior.

## Registration

All `NodePlugin` beans are discovered via CDI. The `DefaultNodeRegistry` aggregates custom nodes and adapters at application start‑up and exposes a JSON‑serializable catalog for UI consumption.

## Example Custom Node

```java
@ApplicationScoped
public class PromptBuilderNodePlugin implements NodePlugin {
    private static final String ID = "tech.kayys.gollek.prompt.builder";

    @Override
    public String id() { return ID; }

    @Override
    public NodeDescriptor descriptor() {
        return NodeDescriptor.builder()
            .id(ID)
            .name("Prompt Builder")
            .description("Injects variables into a prompt template")
            .category(NodeCategory.PROMPT)
            .version(version())
            .inputs(List.of(
                NodePort.input("template", NodePort.DataType.STRING, ""),
                NodePort.input("context", NodePort.DataType.STRING, "")
            ))
            .outputs(List.of(
                NodePort.output("prompt", NodePort.DataType.STRING)
            ))
            .build();
    }

    @Override
    public Uni<Void> execute(NodeExecutionContext ctx) {
        return Uni.createFrom().item(ctx)
            .map(c -> {
                String template = c.getInput("template", String.class).orElse("");
                String context = c.getInput("context", String.class).orElse("");
                c.setOutput("prompt", template.replace("{context}", context));
                return null;
            });
    }
}
```

## JSON Descriptor Example

```json
{
  "id": "tech.kayys.gollek.prompt.builder",
  "name": "Prompt Builder",
  "description": "Injects variables into a prompt template.",
  "category": "PROMPT",
  "version": "1.0.0",
  "icon": "edit_note",
  "color": "#FFBF00",
  "inputs": [{"name":"template","dataType":"STRING","required":true}],
  "outputs": [{"name":"prompt","dataType":"STRING"}]
}
```

---

For a complete list of built‑in visual nodes, see the **NodePlugin Registry** endpoint:

```
GET /api/v1/node-registry
```

This endpoint returns the JSON array of all descriptors, ready to be consumed by a Flutter graph editor.
