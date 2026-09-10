---
layout: default
title: Cloud Provider Config Examples
---

# Cloud Provider Config Examples

This page shows abbreviated example shapes for the main Gollek cloud-provider
runtime setup surfaces.

Use it when you want to recognize the expected plugin directory and config-file
layout before wiring the plugin system into your own environment.

See also:

- [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
- [Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start)
- [Cloud Provider Glossary](/docs/runtime/cloud-provider-glossary)

## Plugin Directory Layout

Example:

```text
~/.gollek/plugins/
├── gollek-plugin-openai-1.0.0.jar
├── gollek-plugin-anthropic-1.0.0.jar
├── gollek-plugin-gemini-1.0.0.jar
└── plugin.json
```

What to notice:

- provider plugins are discovered from one runtime directory
- multiple provider JARs can coexist
- `plugin.json` sits beside the JARs as the main runtime configuration file

## `plugin.json`

Abbreviated example:

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

What to notice:

- configuration is grouped by provider identity
- API keys and base URLs can live here instead of only in env vars
- this is the main persistent runtime config shape for provider plugins

## Environment Variable Setup

Example:

```bash
export OPENAI_API_KEY=sk-your-api-key-here
export ANTHROPIC_API_KEY=sk-ant-your-api-key-here
export GEMINI_API_KEY=your-gemini-api-key
```

What to notice:

- environment variables are the lightest-weight setup path
- they work well for local development, shell sessions, and CI secrets
- this is usually the fastest first-run path before standardizing on
  `plugin.json`

## Built-In Plugin Source Layout

Abbreviated example:

```text
inference-gollek/plugins/
└── gollek-plugin-openai/
    ├── pom.xml
    └── src/
```

What to notice:

- built-in provider plugins live in the repository
- they are the simplest path when you want to build from source rather than
  install a prebuilt JAR

## Suggested Companions

After this page, the most useful follow-ups are:

- [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
- [Cloud Provider Glossary](/docs/runtime/cloud-provider-glossary)
- [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers)
- [Cloud Provider Quick Start](/docs/tutorials/advanced/cloud-provider-quick-start)
