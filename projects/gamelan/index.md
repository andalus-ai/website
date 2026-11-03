---
layout: default
title: Gamelan
permalink: /projects/gamelan/
---

<section class="page-hero">
  <span class="eyebrow">Workflow infrastructure / Gamelan</span>
  <h1>Execute durable workflows across services and systems.</h1>
  <p class="lead">Gamelan is the workflow execution engine in the Andalus AI ecosystem. It manages workflow definitions and runs, schedules DAG work, dispatches nodes to executors, and provides lifecycle and recovery capabilities for long-running processes.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="https://github.com/andalus-ai/gamelan" target="_blank" rel="noopener">View Gamelan repository</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/gamelan/blob/main/README.md" target="_blank" rel="noopener">Read project README</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/gamelan/tree/main/docs" target="_blank" rel="noopener">Browse design guides</a>
  </div>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Core responsibility</span><h2>Own workflow execution, not business-process authoring</h2></div>
  <div class="feature-grid-v2">
    <article class="feature-v2-card"><h3>Workflow lifecycle</h3><p>Represent workflow definitions and runs, create and control executions, and track their lifecycle.</p></article>
    <article class="feature-v2-card"><h3>DAG scheduling and dispatch</h3><p>Schedule dependency-aware work and dispatch workflow nodes to registered executors.</p></article>
    <article class="feature-v2-card"><h3>Recovery and persistence</h3><p>Recover active runs from persisted state and manage execution state through repository and runtime services.</p></article>
    <article class="feature-v2-card"><h3>Executor and extension integration</h3><p>Provide executor registration and discovery, plugin extension points, and documented protocol integrations such as gRPC and Kafka.</p></article>
  </div>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Ecosystem boundaries</span><h2>Wayang defines; Gamelan executes; Andalus runs agents</h2></div>
  <div class="path-example"><pre><code class="language-text">Wayang
  Business process / decision / integration definitions
       |                                  |
       v                                  v
Gamelan                            Andalus Runtime
Durable workflow execution        Agent execution
DAG scheduling / recovery         Agent capabilities and tools</code></pre></div>
  <ul>
    <li><strong>Wayang</strong> owns the authoring and definition model for business processes, decisions, integration flows and agent tasks.</li>
    <li><strong>Gamelan</strong> owns durable workflow execution, run lifecycle, scheduling, dispatch, recovery and executor coordination.</li>
    <li><strong>Andalus</strong> owns agent execution and agent-specific runtime capabilities. Gamelan can dispatch work to executors; agent tasks can be integrated through the appropriate Andalus adapter.</li>
  </ul>
  <p>This is a responsibility model for composition, not a claim that every integration is already deployed or production-verified. Check the individual repositories and integration tests for current adapter and deployment status.</p>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Developer entry points</span><h2>Explore the implementation</h2></div>
  <div class="quick-grid">
    <a class="quick-card" href="https://github.com/andalus-ai/gamelan/blob/main/docs/BUILD_PROFILES.md" target="_blank" rel="noopener"><h3>Build profiles</h3><p>Review the documented profile-based project and task selection.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/gamelan/blob/main/docs/DEPLOYMENT_GUIDE.md" target="_blank" rel="noopener"><h3>Deployment guide</h3><p>Review deployment topology and operational configuration.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/gamelan/blob/main/docs/PLUGIN_SYSTEM.md" target="_blank" rel="noopener"><h3>Plugin system</h3><p>Explore the documented plugin and executor extension points.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/gamelan/blob/main/docs/AGENT_CONTEXT_PERSISTENCE.md" target="_blank" rel="noopener"><h3>Agent context persistence</h3><p>Review local-file and PostgreSQL-backed agent-context store options described by the project.</p></a>
  </div>
</section>
