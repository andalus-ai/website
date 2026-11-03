---
layout: default
title: Andalus Runtime
permalink: /projects/andalus/
---

<section class="page-hero">
  <span class="eyebrow">Executable agent runtime</span>
  <h1>Run and orchestrate agentic applications.</h1>
  <p class="lead">Andalus Runtime is the executable, opinionated environment built on Andalus Framework. It brings together agent execution, orchestration, integrations, APIs, deployment and operational capabilities.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="https://github.com/andalus-ai/andalus" target="_blank" rel="noopener">View runtime repository</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/andalus/blob/main/README.md" target="_blank" rel="noopener">Read project overview</a>
    <a class="btn btn-ghost" href="/projects/andalus-framework/">Explore Andalus Framework</a>
  </div>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Runtime responsibilities</span><h2>From agent logic to an executable service</h2></div>
  <div class="feature-grid-v2">
    <article class="feature-v2-card"><h3>Agent execution</h3><p>Run agent strategies and execution pipelines using configured model providers, tools and context.</p></article>
    <article class="feature-v2-card"><h3>Orchestration</h3><p>Coordinate agents and graph-based workflows, with integration points for workflow execution.</p></article>
    <article class="feature-v2-card"><h3>Interfaces and deployment</h3><p>Provide application-facing CLI and service interfaces, packaging and deployment entry points.</p></article>
    <article class="feature-v2-card"><h3>Governance and operations</h3><p>Integrate guardrails, human review, policy enforcement, observability and runtime health capabilities.</p></article>
  </div>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Architecture boundary</span><h2>Runtime built on reusable framework libraries</h2></div>
  <div class="path-example"><pre><code class="language-text">Application / service
        |
        v
Andalus Runtime
  Execution / orchestration / APIs / deployment
        |
        v
Andalus Framework
  Contracts / SPIs / tools / knowledge / security
        |
        v
External providers and infrastructure</code></pre></div>
  <p>The runtime is the executable product; the framework is the reusable library layer. The runtime README also documents integrations with inference and workflow backends. Those are adapters and dependencies, not a reason to merge their ownership into the agent runtime.</p>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Developer entry points</span><h2>Explore the runtime</h2></div>
  <div class="quick-grid">
    <a class="quick-card" href="https://github.com/andalus-ai/andalus/blob/main/README.md" target="_blank" rel="noopener"><h3>Runtime overview</h3><p>Review the current architecture, capabilities and repository guidance.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/andalus/tree/main" target="_blank" rel="noopener"><h3>Source repository</h3><p>Inspect runtime modules and implementation.</p></a>
    <a class="quick-card" href="/projects/wayang/"><h3>Wayang platform</h3><p>Explore the low-code process and agentic automation product built around Andalus and Gamelan.</p></a>
  </div>
  <p>Use the repository README as the source of truth for current build prerequisites and executable commands. The website intentionally avoids copying version-specific commands that may drift.</p>
</section>
