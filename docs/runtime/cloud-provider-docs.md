---
layout: default
title: Cloud Provider Docs
---

# Cloud Provider Docs

This page groups the main Gollek cloud-provider and plugin-system materials
into one reader path.

It is the best entrypoint if you are trying to answer one of these questions:

- how to use OpenAI, Anthropic, Gemini, or other cloud LLM providers through
  Gollek
- where plugin JARs live and how they are discovered
- how to configure provider API keys and plugin settings
- how to build or ship a custom cloud-provider plugin

See also:

- [Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start)
- [Cloud Provider Glossary](/docs/runtime/cloud-provider-glossary)
- [Cloud Provider Config Examples](/docs/runtime/cloud-provider-config-examples)

## Do You Want To Use A Provider Or Build One?

If you want to use an existing provider plugin, start with:

- [Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start)
- [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers)
- [Cloud Provider Config Examples](/docs/runtime/cloud-provider-config-examples)

If you want to build your own provider plugin, start with:

- [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers)
- [Cloud Provider Glossary](/docs/runtime/cloud-provider-glossary)

Rule of thumb:

- existing provider means install one JAR, set credentials, and run
- custom provider means focus on plugin architecture, packaging, and runtime
  discovery

## Which Page Should I Read?

If you want to use an existing provider plugin, start with
[Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers).

If you want to install provider JARs and configure API keys, start with the
installation and configuration sections of
[Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers).

If you want to build your own provider plugin, jump to the custom-plugin part
of [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers).

If you want one compact end-to-end setup path first, use
[Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start).

If you want a quick vocabulary reference for plugin and provider terms, use
[Cloud Provider Glossary](/docs/runtime/cloud-provider-glossary).

If you want abbreviated runtime setup shapes first, use
[Cloud Provider Config Examples](/docs/runtime/cloud-provider-config-examples).

## Main Surfaces

- [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers)
  explains supported providers, plugin loading, configuration, hot reload, and
  custom plugin structure.
- [Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start)
  is the shortest path for installing one plugin, setting one API key, and
  verifying the runtime plugin directory.
- [Cloud Provider Glossary](/docs/runtime/cloud-provider-glossary)
  defines the main plugin, configuration, and provider vocabulary used across
  this docs cluster.
- [Cloud Provider Config Examples](/docs/runtime/cloud-provider-config-examples)
  shows the expected plugin directory, `plugin.json`, and environment-variable
  setup shapes.

## Starter Paths

### I want to use OpenAI or another existing cloud provider

1. read [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers)
2. choose one installation path:
   - build from source
   - build standalone plugin
   - download prebuilt JAR
3. configure credentials through environment variables or `plugin.json`

### I want to build my own provider plugin

1. read the plugin architecture and built-in vs standalone plugin sections in
   [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers)
2. follow the custom plugin structure and packaging guidance there
3. install the JAR into `~/.gollek/plugins/`

## Key Runtime Locations

| Path | Role |
|------|------|
| `~/.gollek/plugins/` | Runtime plugin discovery directory for provider JARs |
| `~/.gollek/plugins/plugin.json` | Per-provider runtime configuration file |
| `inference-gollek/plugins/` | Built-in provider/plugin source modules in the repo |

Fast practical entrypoints:

- `docs/runtime/cloud-providers.md`
- `~/.gollek/plugins/`
- `~/.gollek/plugins/plugin.json`
- `inference-gollek/plugins/`

## What’s Stable Vs Evolving?

The current stable-enough surfaces for readers and downstream users are:

- the plugin directory model under `~/.gollek/plugins/`
- environment-variable and `plugin.json` style configuration
- the documented built-in versus standalone plugin split

The more likely-to-evolve areas are:

- the exact set of bundled provider plugins
- hot-reload behavior details
- examples and packaging helpers around custom plugin development

Rule of thumb:
anchor operational usage first on the plugin directory, configuration style,
and the long-form cloud provider guide, then treat individual provider and
packaging details as higher-churn layers.

## Docs Status

Current cloud-provider docs coverage includes:

- provider/plugin architecture overview
- installation flows
- configuration via env vars, `plugin.json`, and properties
- built-in vs standalone plugin guidance
- custom plugin packaging path
- compact hands-on quick-start tutorial
- shared glossary coverage
- config/examples page

Recent additions:

- cloud-provider landing page
- quick-start tutorial
- glossary
- config/examples page
- top-level chooser

If this docs cluster still is not enough, the fastest next places to look are:

- `docs/runtime/cloud-providers.md`
- `~/.gollek/plugins/`
- `~/.gollek/plugins/plugin.json`
- `inference-gollek/plugins/`
