---
layout: default
title: Cloud Provider Glossary
---

# Cloud Provider Glossary

This page defines the core terms used across Gollek’s cloud-provider and
plugin-system docs.

Use it when you understand the general setup flow but want a fast vocabulary
reference for plugin installation and runtime configuration language.

See also:

- [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
- [Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start)
- [Cloud Provider Config Examples](/docs/runtime/cloud-provider-config-examples)

## Terms

### built-in plugin

A provider plugin maintained inside the Gollek repository, typically under
`inference-gollek/plugins/`, and usually built with the shared plugin parent
configuration.

### cloud provider

One remote LLM service integrated through Gollek’s plugin system, such as
OpenAI, Anthropic, Gemini, Cerebras, or Mistral.

### custom plugin

A provider plugin built specifically for one organization or use case rather
than shipped as one of Gollek’s built-in provider plugins.

### hot reload

The ability for Gollek to notice plugin JAR changes in the plugin directory and
reload provider integrations without a full application rebuild.

### plugin directory

The runtime discovery directory `~/.gollek/plugins/`, where provider JARs are
placed so Gollek can discover and load them.

### plugin JAR

The packaged Java archive that contains one provider implementation plus its
plugin metadata and dependencies.

### plugin manifest

The metadata stored inside a plugin JAR that advertises the plugin identity and
loading information to the runtime.

### `plugin.json`

The runtime configuration file under `~/.gollek/plugins/plugin.json` that can
store per-provider settings such as API keys, base URLs, or other provider
options.

### provider configuration

The runtime settings used to activate and talk to one provider plugin, supplied
through environment variables, `plugin.json`, or application properties.

### provider plugin

A plugin whose purpose is to connect Gollek to one cloud LLM provider through a
common provider/runtime abstraction.

### standalone plugin

A provider plugin developed and versioned outside the main Gollek repository,
usually with its own release cycle and packaging setup.

### unified API

Gollek’s goal that different cloud providers can be reached through one
consistent application-facing abstraction rather than one provider-specific
integration per application.

## Suggested Companions

After this glossary, the most useful follow-ups are:

- [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
- [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers)
- [Cloud Provider Config Examples](/docs/runtime/cloud-provider-config-examples)
- [Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start)
