---
layout: default
title: Cloud Provider Quick Start
parent: Advanced Tutorials
nav_order: 36
---

# Cloud Provider Quick Start

This tutorial walks through the shortest useful Gollek cloud-provider setup
path:

1. install one provider plugin JAR
2. set one API key
3. configure provider settings through environment variables or `plugin.json`
4. verify the plugin is in the expected runtime location
5. run one request through the configured provider path

See also:

- [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
- [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers)
- [Cloud Provider Glossary](/docs/runtime/cloud-provider-glossary)
- [Cloud Provider Config Examples](/docs/runtime/cloud-provider-config-examples)

## Step 1: Install One Provider Plugin

For a built-in plugin source tree in this repository, use the built-in install
path. Example with OpenAI:

```bash
cd inference-gollek/plugins/gollek-plugin-openai
mvn clean install
```

That copies the resulting JAR into:

```text
~/.gollek/plugins/
```

If you already have a prebuilt JAR, you can place it there directly:

```bash
cp gollek-plugin-openai-1.0.0.jar ~/.gollek/plugins/
```

## Step 2: Set One API Key

The simplest path is an environment variable:

```bash
export OPENAI_API_KEY=sk-your-api-key-here
```

You can follow the same pattern for other providers:

- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`

## Step 3: Optional `plugin.json` Configuration

If you want a persistent runtime config file, create:

```text
~/.gollek/plugins/plugin.json
```

Example:

```json
{
  "providers": {
    "openai-cloud-provider": {
      "apiKey": "sk-your-api-key-here",
      "baseUrl": "https://api.openai.com/v1"
    }
  }
}
```

Use this path when environment variables are not the configuration boundary you
want to standardize on.

## Step 4: Verify The Runtime Location

Confirm the plugin JAR is in the discovery directory:

```bash
ls -la ~/.gollek/plugins/*.jar
```

If you are using `plugin.json`, also confirm it exists:

```bash
ls -la ~/.gollek/plugins/plugin.json
```

At this point, the runtime has:

- one provider JAR in the plugin discovery directory
- one provider credential path
- optional extra provider settings

## Step 5: Run One Request

Use your normal Gollek runtime entrypoint with the configured provider path.

The exact request surface depends on your application/runtime layer, but the
important boundary here is already complete:

- plugin installed
- credential set
- provider config available

For most users, this is the point where the long-form
[Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers) page
becomes the best follow-up for provider-specific request and integration
details.

## Quick Checklist

- plugin JAR copied into `~/.gollek/plugins/`
- provider API key exported or placed in `plugin.json`
- optional provider settings written
- runtime can see the plugin directory contents

## Related Docs

- [Cloud Provider Docs](/docs/runtime/cloud-provider-docs)
- [Cloud LLM Providers & Plugin System](/docs/runtime/cloud-providers)
- [Cloud Provider Glossary](/docs/runtime/cloud-provider-glossary)
- [Cloud Provider Config Examples](/docs/runtime/cloud-provider-config-examples)
