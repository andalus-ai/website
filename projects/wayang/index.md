---
layout: default
title: Wayang
permalink: /projects/wayang/
---

<section class="page-hero">
  <span class="eyebrow">Application product / Wayang</span>
  <h1>Model business processes, decisions, integrations and agentic work.</h1>
  <p class="lead">Wayang is a low-code agentic factory and process platform. It owns the definitions and user-facing model; it delegates durable workflow execution to Gamelan and agent execution to Andalus.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="https://github.com/andalus-ai/wayang" target="_blank" rel="noopener">View Wayang repository</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/wayang/blob/main/README.md" target="_blank" rel="noopener">Read project overview</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/wayang/tree/main/docs" target="_blank" rel="noopener">Browse design guides</a>
    <a class="btn btn-ghost" href="/projects/gamelan/">Gamelan workflow engine</a>
  </div>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">What Wayang models</span><h2>One definition layer, multiple business capabilities</h2></div>
  <div class="feature-grid-v2">
    <article class="feature-v2-card"><h3>Business processes</h3><p>BPMN-subset process definitions, validation and compilation, including gateways, service tasks, agent tasks, timers and message waits.</p></article>
    <article class="feature-v2-card"><h3>Business decisions</h3><p>DMN-style decision tables and decision graphs, with explicit hit policies and dependency handling.</p></article>
    <article class="feature-v2-card"><h3>Enterprise integration</h3><p>Enterprise Integration Patterns, message routing, transformation, aggregation, retries, throttling and connector definitions.</p></article>
    <article class="feature-v2-card"><h3>Agentic workflows</h3><p>Declarative agent specifications and templates, with an adapter that invokes agents through the Andalus execution service.</p></article>
  </div>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Ownership boundaries</span><h2>Wayang does not duplicate the execution engines</h2></div>
  <div class="path-example"><pre><code class="language-text">Wayang
  Process / decision / integration / agent definitions
       |                                  |
       v                                  v
Gamelan                            Andalus Runtime
Durable workflow execution        Agent execution
Scheduling / retries / history    Models / tools / memory / guardrails</code></pre></div>
  <ul>
    <li><strong>Wayang</strong> owns definitions, validation, compilation and its user-facing authoring model.</li>
    <li><strong>Gamelan</strong> owns durable workflow execution, scheduling, retries, persistence and run history.</li>
    <li><strong>Andalus</strong> owns agent execution and agent capabilities.</li>
  </ul>
  <p>Wayang also contains an in-memory reference engine for local development and testing. The project README documents current verification limits; for example, it states that the Maven build has not yet been executed and that no live Gamelan or Andalus deployment has been exercised. Check the source status before treating an integration as production-verified.</p>
</section>

<section class="project-section">
  <div class="section-heading"><span class="eyebrow">Developer entry points</span><h2>Explore the implementation</h2></div>
  <div class="quick-grid">
    <a class="quick-card" href="https://github.com/andalus-ai/wayang/blob/main/docs/ARCHITECTURE.md" target="_blank" rel="noopener"><h3>Architecture</h3><p>Read the execution model, compilation approach and verification notes.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/wayang/blob/main/docs/API.md" target="_blank" rel="noopener"><h3>API and service shell</h3><p>Review the API boundary and current REST, WebSocket and gRPC implementation status.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/wayang/blob/main/docs/RELEASE.md" target="_blank" rel="noopener"><h3>Release workflow</h3><p>Explore the design for publishing projects as standalone applications.</p></a>
  </div>
</section>
