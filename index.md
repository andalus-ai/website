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
  <p class="lead">Andalus AI connects Java machine-learning foundations with agent runtimes and automation platforms. Its projects are modular: use the foundations you need, then compose them into end-user applications.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="#projects">Explore the projects</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai">GitHub organization</a>
    <a class="btn btn-ghost" href="/docs/">Historical documentation</a>
  </div>
  <div class="hero-stats">
    <span>Java-first foundations</span>
    <span>Open source</span>
    <span>Composable projects</span>
    <span>Independent repositories</span>
  </div>
</section>

<section id="projects" class="content-container" style="padding: 64px 0;">
  <p class="eyebrow">Machine-learning foundation</p>
  <h2 class="section-title-alt">Build, train and run models</h2>
  <p class="lead">These projects provide the ML capabilities that can be embedded into larger systems.</p>
  <div class="project-grid">
    <a class="project-card project-card-featured" href="https://github.com/andalus-ai/aljabr">
      <span class="project-card-kicker">ML framework</span>
      <h2>Aljabr</h2>
      <p>A Java-first ML framework for tensors, operators, model abstractions, compute backends and reusable numerical foundations.</p>
      <span class="project-card-link">Explore Aljabr &rarr;</span>
    </a>
    <a class="project-card" href="https://github.com/andalus-ai/tafkir">
      <span class="project-card-kicker">Training &amp; adaptation</span>
      <h2>Tafkir</h2>
      <p>Training, fine-tuning, evaluation and model-adaptation workflows built on Aljabr.</p>
      <span class="project-card-link">Explore Tafkir &rarr;</span>
    </a>
    <a class="project-card" href="https://github.com/andalus-ai/aqli">
      <span class="project-card-kicker">Inference runtime</span>
      <h2>AQLI</h2>
      <p>A Java-first inference runtime for model execution, generation, scheduling, streaming, serving and deployment operations.</p>
      <span class="project-card-link">Explore AQLI &rarr;</span>
    </a>
  </div>
</section>

<section class="content-container" style="padding: 24px 0 64px;">
  <p class="eyebrow">Application and product layer</p>
  <h2 class="section-title-alt">Turn AI capabilities into working systems</h2>
  <p class="lead">The application layer builds on reusable frameworks and runtimes. Andalus provides agent execution; Wayang provides a low-code environment for defining business processes, decisions, integrations and agent tasks.</p>
  <div class="project-grid">
    <a class="project-card project-card-featured" href="/projects/andalus/">
      <span class="project-card-kicker">Agent runtime · executable product</span>
      <h2>Andalus</h2>
      <p>An executable runtime for agent execution, orchestration, integrations, governance and operational workflows, built on Andalus Framework.</p>
      <span class="project-card-link">Explore Andalus &rarr;</span>
    </a>
    <a class="project-card" href="/projects/wayang/">
      <span class="project-card-kicker">Low-code automation platform</span>
      <h2>Wayang</h2>
      <p>Model BPMN-style processes, DMN decisions, enterprise integration flows and agent tasks; delegate durable workflow execution to Gamelan and agent execution to Andalus.</p>
      <span class="project-card-link">Explore Wayang &rarr;</span>
    </a>
    <a class="project-card" href="/projects/andalus-framework/">
      <span class="project-card-kicker">Reusable agent framework</span>
      <h2>Andalus Framework</h2>
      <p>Protocol-neutral contracts, SPIs and reusable libraries for building custom agentic systems and runtimes.</p>
      <span class="project-card-link">Explore the framework &rarr;</span>
    </a>
  </div>
</section>

<section class="content-container" style="padding: 24px 0 64px;">
  <p class="eyebrow">Architecture</p>
  <h2 class="section-title-alt">Separate foundations, clear ownership</h2>
  <div class="path-example">
    <pre><code class="language-text">                    Applications &amp; products
                      /             \
                 Andalus           Wayang
              Agent runtime     Low-code process platform
                   |             /             \
          Andalus Framework  Andalus       Gamelan
             Agent SPIs     Agent execution  Durable workflows
                   |
          Aljabr / AQLI integrations
             ML compute / inference

       Aljabr  &lt;--  Tafkir training workflows
          |
     CPU / accelerator backends</code></pre>
  </div>
  <ul>
    <li><strong>Aljabr</strong> owns general-purpose ML and compute foundations.</li>
    <li><strong>Tafkir</strong> owns training and adaptation workflows built on Aljabr.</li>
    <li><strong>AQLI</strong> owns model inference and serving, also built on Aljabr.</li>
    <li><strong>Andalus Framework</strong> provides reusable agent contracts and libraries; <strong>Andalus</strong> provides the executable runtime.</li>
    <li><strong>Wayang</strong> owns process, decision and integration definitions; <strong>Gamelan</strong> owns durable workflow execution.</li>
  </ul>
  <p>These are architectural relationships, not a claim that every product requires every project at runtime. Integrations are used where the application needs them.</p>
</section>

<section class="content-container" style="padding: 24px 0 64px;">
  <p class="eyebrow">Infrastructure and integration</p>
  <h2 class="section-title-alt">Connect the ecosystem</h2>
  <div class="project-grid">
    <a class="project-card project-card-featured" href="/projects/gamelan/">
      <span class="project-card-kicker">Durable workflow engine</span>
      <h2>Gamelan</h2>
      <p>Workflow definitions and runs, DAG scheduling, execution dispatch, recovery, executor registration and workflow lifecycle management.</p>
      <span class="project-card-link">Explore Gamelan &rarr;</span>
    </a>
    <a class="project-card" href="https://github.com/andalus-ai/iket">
      <span class="project-card-kicker">API gateway</span>
      <h2>Iket</h2>
      <p>A separate gateway project for routing and governing service traffic.</p>
      <span class="project-card-link">Explore Iket &rarr;</span>
    </a>
  </div>
</section>

<section class="content-container" style="padding: 24px 0 64px;">
  <h2 class="section-title-alt">Choose a starting point</h2>
  <div class="quick-grid">
    <a class="quick-card" href="https://github.com/andalus-ai/aljabr"><h3>Build ML foundations</h3><p>Start with Aljabr's framework and current API documentation.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/tafkir"><h3>Train and adapt</h3><p>Explore Tafkir's training and evaluation workflows.</p></a>
    <a class="quick-card" href="https://github.com/andalus-ai/aqli"><h3>Serve models</h3><p>Explore AQLI's inference APIs and deployment workflows.</p></a>
    <a class="quick-card" href="/projects/andalus/"><h3>Build agent applications</h3><p>Use Andalus Framework or run the Andalus agent runtime.</p></a>
    <a class="quick-card" href="/projects/wayang/"><h3>Automate business processes</h3><p>Model decisions, integrations and agentic workflows with Wayang.</p></a>
    <a class="quick-card" href="/projects/gamelan/"><h3>Execute durable workflows</h3><p>Run, schedule, recover and monitor long-lived workflows with Gamelan.</p></a>
  </div>
</section>

<section class="content-container" style="padding: 24px 0 64px;">
  <h2 class="section-title-alt">From Gollek to the current ecosystem</h2>
  <p>Aljabr, Tafkir and AQLI were separated from the former unified Gollek ML platform so framework foundations, training workflows and inference serving have clear ownership. Andalus and Wayang are related application-layer projects with their own repositories and responsibilities.</p>
  <p>Existing Gollek documentation, tutorials and release history are retained as historical material while each guide is reviewed and migrated. Old commands, coordinates and capability statements should not be assumed to describe current projects.</p>
  <a class="btn btn-ghost" href="/docs/">Browse historical documentation</a>
</section>

<section class="content-container" style="padding: 24px 0 72px;">
  <h2 class="section-title-alt">Community and contribution</h2>
  <p>Andalus AI is developed in the open. Explore the repositories, review their contribution guidance, report issues and follow project-specific roadmaps.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="https://github.com/andalus-ai">Visit GitHub organization</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/andalus">Andalus</a>
    <a class="btn btn-ghost" href="https://github.com/andalus-ai/wayang">Wayang</a>
  </div>
</section>
