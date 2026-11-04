---
layout: default
title: Andalus Framework
permalink: /projects/andalus-framework/
---

<section class="page-hero">
  <span class="eyebrow">Reusable agent framework</span>
  <h1>Build agentic systems on reusable Java contracts.</h1>
  <p class="lead">Andalus Framework is the protocol-neutral library layer: contracts, SPIs and reusable capabilities that can be embedded in the Andalus Runtime or used by other compatible applications.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="https://github.com/andalus-ai/andalus-framework" target="_blank" rel="noopener">View framework repository</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/andalus-framework/blob/main/README.md" target="_blank" rel="noopener">Read project overview</a>
  </div>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Reusable capabilities</span><h2>Framework building blocks</h2></div>
  <div class="feature-grid-v2">
    <article class="feature-v2-card"><h3>Core contracts</h3><p>Agent, skill, tool, workflow, memory and execution abstractions.</p></article>
    <article class="feature-v2-card"><h3>Protocols and communication</h3><p>Adapters and communication contracts, including A2A and ANP-related modules.</p></article>
    <article class="feature-v2-card"><h3>Tools and integrations</h3><p>Tool invocation, MCP-related capabilities, provider interfaces and plugin extension points.</p></article>
    <article class="feature-v2-card"><h3>Knowledge and memory</h3><p>Reusable knowledge, retrieval, embedding and memory services.</p></article>
    <article class="feature-v2-card"><h3>Security and resilience</h3><p>Security APIs, policy and governance abstractions, resilience patterns and observability contracts.</p></article>
  </div>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Framework vs runtime</span><h2>Libraries are not the deployment application</h2></div>
  <div class="path-example"><pre><code class="language-text">Custom application       Andalus Runtime
        \                     /
         \                   /
          Andalus Framework
      Contracts / SPIs / reusable libraries</code></pre></div>
  <ul>
    <li><strong>Andalus Framework</strong> provides reusable libraries and contracts with a focus on embeddability.</li>
    <li><strong>Andalus Runtime</strong> builds on the framework to provide an opinionated executable environment, orchestration, CLI, APIs and deployment integration.</li>
  </ul>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Developer entry points</span><h2>Start with the source repositories</h2></div>
  <div class="quick-grid">
    <a class="quick-card" href="https://github.com/andalus-ai/andalus-framework/blob/main/README.md" target="_blank" rel="noopener"><h3>Framework overview</h3><p>Review module ownership, prerequisites and build guidance.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/andalus-framework/tree/main/framework" target="_blank" rel="noopener"><h3>Framework modules</h3><p>Explore the reusable library modules in the source tree.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/andalus" target="_blank" rel="noopener"><h3>Andalus Runtime</h3><p>See the executable runtime that consumes the framework.</p></a>
  </div>
  <p>Follow the current repository README for the authoritative Java and Maven requirements. Older docs and examples may contain stale repository coordinates or package references.</p>
</section>
