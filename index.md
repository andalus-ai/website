---
layout: default
title: Andalus AI — Java AI/ML Ecosystem
---

<section class="hero">
  <div class="hero-logo-container">
    <div class="hero-logo" role="img" aria-label="Andalus AI">ANDALUS AI</div>
  </div>
  <p class="eyebrow">Open-source Java AI/ML ecosystem</p>
  <h1>Build. Train. Run. Deploy.</h1>
  <p class="lead">Andalus AI brings together focused Java projects for machine learning foundations, model training and inference. Build on shared foundations without coupling every workflow into one monolithic platform.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="#projects">Explore the projects</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai">GitHub organization</a>
    <a class="btn btn-ghost" href="/docs/">Legacy documentation</a>
  </div>
  <div class="hero-stats">
    <span>Java-first</span>
    <span>Open source</span>
    <span>Modular projects</span>
    <span>Shared foundations</span>
  </div>
</section>

<section id="projects" class="content-container" style="padding: 64px 0;">
  <p class="eyebrow">The machine-learning foundation</p>
  <h2 class="section-title-alt">Three focused projects</h2>
  <p class="lead">Each project has a distinct responsibility and can evolve independently.</p>
  <div class="project-grid">
    <a class="project-card project-card-featured" href="https://github.com/andalus-ai/aljabr">
      <span class="project-card-kicker">ML framework</span>
      <h2>Aljabr</h2>
      <p>A Java-first machine-learning framework for tensors, operators, model abstractions, compute backends and reusable ML development foundations.</p>
      <span class="project-card-link">Explore Aljabr &rarr;</span>
    </a>
    <a class="project-card" href="https://github.com/andalus-ai/tafkir">
      <span class="project-card-kicker">Training &amp; adaptation</span>
      <h2>Tafkir</h2>
      <p>Training and model-adaptation workflows built on Aljabr, including data pipelines, training orchestration, fine-tuning and evaluation.</p>
      <span class="project-card-link">Explore Tafkir &rarr;</span>
    </a>
    <a class="project-card" href="https://github.com/andalus-ai/aqli">
      <span class="project-card-kicker">Inference runtime</span>
      <h2>AQLI</h2>
      <p>A Java-first inference runtime for model execution, generation, request scheduling, streaming, serving interfaces and deployment operations.</p>
      <span class="project-card-link">Explore AQLI &rarr;</span>
    </a>
  </div>
</section>

<section class="content-container" style="padding: 32px 0 72px;">
  <p class="eyebrow">How the pieces fit</p>
  <h2 class="section-title-alt">A shared foundation, independent workflows</h2>
  <p class="lead">Aljabr provides reusable ML and compute foundations. Tafkir and AQLI build on those foundations for different workloads; neither is a required dependency of the other.</p>
  <div class="path-example">
    <pre><code class="language-text">                    Applications
                          |
              +-----------+-----------+
              |                       |
        Tafkir workflows         AQLI runtime
        Train / adapt            Infer / serve
              |                       |
              +-----------+-----------+
                          |
                        Aljabr
             Tensors / operators / compute
                          |
                CPU / accelerator backends</code></pre>
  </div>
  <ul>
    <li><strong>Aljabr</strong> does not depend on AQLI or Tafkir.</li>
    <li><strong>Tafkir</strong> consumes Aljabr for reusable computation and focuses on training and adaptation.</li>
    <li><strong>AQLI</strong> consumes Aljabr for reusable computation and focuses on inference and serving.</li>
  </ul>
</section>

<section class="content-container" style="padding: 32px 0 72px;">
  <p class="eyebrow">Related ecosystem projects</p>
  <h2 class="section-title-alt">From models to applications</h2>
  <div class="project-grid">
    <a class="project-card" href="https://github.com/andalus-ai/andalus-framework">
      <span class="project-card-kicker">Agent framework</span>
      <h2>Andalus Framework</h2>
      <p>Reusable contracts and building blocks for agentic applications and workflows.</p>
      <span class="project-card-link">Explore framework &rarr;</span>
    </a>
    <a class="project-card" href="https://github.com/andalus-ai/andalus">
      <span class="project-card-kicker">Agent runtime</span>
      <h2>Andalus Runtime</h2>
      <p>An executable runtime for agent execution, orchestration, integrations and operational workflows.</p>
      <span class="project-card-link">Explore runtime &rarr;</span>
    </a>
    <a class="project-card" href="https://github.com/andalus-ai/iket">
      <span class="project-card-kicker">API gateway</span>
      <h2>Iket</h2>
      <p>A separate API gateway project for routing and governing service traffic.</p>
      <span class="project-card-link">Explore Iket &rarr;</span>
    </a>
  </div>
</section>

<section class="content-container" style="padding: 32px 0 72px;">
  <p class="eyebrow">Choose your starting point</p>
  <h2 class="section-title-alt">Start building with Java</h2>
  <div class="quick-grid">
    <a class="quick-card" href="https://github.com/andalus-ai/aljabr">
      <h3>Build with Aljabr</h3>
      <p>Start with the framework repository, build instructions and current API documentation.</p>
    </a>
    <a class="quick-card" href="https://github.com/andalus-ai/tafkir">
      <h3>Train with Tafkir</h3>
      <p>Explore training, fine-tuning and adaptation workflows.</p>
    </a>
    <a class="quick-card" href="https://github.com/andalus-ai/aqli">
      <h3>Run with AQLI</h3>
      <p>Explore model execution, inference APIs and serving workflows.</p>
    </a>
  </div>
  <p>For quick experiments, use the examples and JBang material in the project repositories. For application integration, follow each project's current Gradle or Maven instructions.</p>
</section>

<section class="content-container" style="padding: 32px 0 72px;">
  <h2 class="section-title-alt">From Gollek to the current ecosystem</h2>
  <p>These projects previously appeared together under the Gollek name. The architecture has since been separated into Aljabr, Tafkir and AQLI so framework foundations, training workflows and inference serving have clear ownership.</p>
  <p>Existing Gollek documentation, tutorials and release history are being retained as historical material while each guide is reviewed and migrated. Old commands, coordinates and capability statements should not be assumed to describe the current projects.</p>
  <a class="btn btn-ghost" href="/docs/">Browse the retained documentation</a>
</section>

<section class="content-container" style="padding: 24px 0 72px;">
  <h2 class="section-title-alt">Community and contribution</h2>
  <p>Andalus AI is developed in the open. Explore the repositories, review their contribution guidance, report issues and follow project-specific roadmaps.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="https://github.com/andalus-ai">Visit GitHub organization</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/aljabr">Aljabr</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/tafkir">Tafkir</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/aqli">AQLI</a>
  </div>
</section>
