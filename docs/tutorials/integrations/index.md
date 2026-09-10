---
layout: default
title: Platform Integrations
parent: Tutorials
nav_order: 40
---

# 🔌 Platform Integrations

Gollek is designed to play well with the modern developer ecosystem. These tutorials guide you through integrating Gollek's local and cloud AI capabilities with popular Java tools and data science platforms.

## 🛠️ Available Integrations

### [Agent Serving: Wayang-Gollek Substrate](./agent-serving)
Use Gollek as the serving engine below Wayang-Gollek or another agent runtime.
- Preflight policy profiles: `readiness_only`, `requested_route`, and `clean`
- Route templates for chat, Responses, embeddings/RAG, and MCP tools
- Clear boundary between Gollek serving and caller-owned orchestration

### ⚡ [JBang: Rapid Prototyping](./jbang)
Learn how to use JBang to run single-file Java AI scripts with zero configuration. Perfect for testing new models or building quick automation tools.
- Auto-dependency resolution with `//DEPS`
- Using Gollek templates
- CLI argument handling

### 📓 [Jupyter: Interactive ML](./jupyter)
Step-by-step guide to setting up the Gollek Java kernel for Jupyter. Combine interactive code cells with rich visualization.
- Standalone Gollek kernel install and doctor checks
- Preloaded Java/Gollek helpers for tensors, charts, images, audio, and models
- Notebook magics for files, archives, dependencies, checksums, and disk summaries

### 🦜 [LangChain4j: AI Orchestration](./langchain4j)
Connect Gollek to the wider LLM ecosystem. Learn how to use Gollek's chat and streaming models within the LangChain4j framework.
- `GollekChatModel` configuration
- Streaming responses
- Multimodal reasoning hooks

---

[Back to Tutorials Overview](../)
