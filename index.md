---
layout: default
title: Gollek - One Stop AI/ML Platform for Java
---

<section class="hero">
  <div class="hero-logo-container">
    <img src="https://raw.githubusercontent.com/bhangun/repo-assets/master/gollek03%404x.png" alt="Gollek SDK" class="hero-logo">
  </div>
  <p class="eyebrow">One Platform. Three Ways to Build AI/ML Applications.</p>
  <h1>Build, Train, and Serve AI Models in Java</h1>
  <p class="lead">Gollek is a unified platform that works as a <strong>High-Performance Serving Engine</strong>, a <strong>PyTorch-like ML Framework</strong>, and a <strong>Universal Inference Runtime</strong>. Build, train, and deploy with native Java speed.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="#three-paths">Get Started</a>
    <a class="btn btn-ghost" href="/docs/setup/jbang-examples">Examples</a>
    <a class="btn btn-ghost" href="https://github.com/bhangun/gollek">GitHub</a>
  </div>
  <div class="hero-stats">
    <span>PyTorch-like API</span>
    <span>GPU Accelerated</span>
    <span>Agent Integration APIs</span>
    <span>ONNX Audio/TTS</span>
    <span>WAV/FLAC/MP3</span>
    <span>Native Java ML</span>
  </div>
</section>



<section id="three-paths" class="three-paths-section">
  <div class="content-container">
    <h2>Choose Your Path</h2>
    <p class="lead">Gollek adapts to your needs—whether you're a developer who wants quick CLI commands, a researcher building models, or an enterprise deploying production inference services.</p>
       <div class="paths-grid">
      <!-- Path 1: CLI -->
      <div class="path-card">
        <div class="path-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4,17 10,11 4,5"/>
            <line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
        </div>
        <h3>1. Dual-Mode CLI</h3>
        <p class="path-description">Unified distribution that runs as an interactive CLI or a high-performance REST/Web server. Pull, list, run, and inspect local models, including ONNX image and audio pipelines, from one tool.</p>

        <div class="path-features">
          <span class="feature-tag">Dual-Mode (CLI/REST)</span>
          <span class="feature-tag">GraalVM Native</span>
          <span class="feature-tag">GGUF Quantizer</span>
          <span class="feature-tag">MOSS TTS ONNX</span>
          <span class="feature-tag">Live Audio</span>
        </div>

        <div class="path-example">
          <div class="example-label">Example:</div>
          <pre><code class="language-bash">gollek pull OpenMOSS-Team/MOSS-TTS-Nano-100M-ONNX
gollek run --model 71e8f7 --prompt "hello" \
  --voice "en Trump" --audio-quality balanced \
  --live-audio --output hello.mp3
gollek run --model 71e8f7 --list-voices</code></pre>
        </div>

        <div class="path-actions">
          <a href="/docs/setup/cli-installation#install-chooser" class="btn btn-sm btn-primary">Install CLI</a>
          <a href="/docs/setup/cli-reference" class="btn btn-sm btn-ghost">View Commands</a>
        </div>
      </div>

      <!-- Path 2: Framework -->
      <div class="path-card path-card-highlighted">
        <div class="path-badge">Core Engine</div>
        <div class="path-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h3>2. ML Framework</h3>
        <p class="path-description">Build and train neural networks with a native Java API. Tensors with autograd, 118+ modules, and advanced indexing for complex architectures.</p>

        <div class="path-features">
          <span class="feature-tag feature-tag-highlighted">118+ NN Layers</span>
          <span class="feature-tag feature-tag-highlighted">Autograd v2</span>
          <span class="feature-tag feature-tag-highlighted">Vision/NLP Transforms</span>
          <span class="feature-tag">Metal/CUDA Accelerated</span>
          <span class="feature-tag">JBang/Jupyter Integration</span>
        </div>

        <div class="path-example">
          <div class="example-label">Example (Pure Java):</div>
          <pre><code class="language-java">// Build a Transformer Block
Sequential block = new Sequential(
    new MultiHeadAttention(512, 8),
    new LayerNorm(512),
    new Linear(512, 2048),
    new ReLU(),
    new Linear(2048, 512)
);</code></pre>
        </div>

        <div class="path-actions">
          <a href="/docs/framework/framework" class="btn btn-sm btn-primary">Framework Guide</a>
          <a href="/docs/tutorials/basic/" class="btn btn-sm btn-ghost">Tutorials</a>
        </div>
      </div>

      <!-- Path 3: Serving Runtime -->
      <div class="path-card">
        <div class="path-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--multimodal-primary);">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M12 22l10-5-10-5-10 5 10 5z"/>
          </svg>
        </div>
        <h3>3. Serving Runtime</h3>
        <p class="path-description">High-performance reactive serving engine featuring visual <code>NodePlugin</code> workflow graphs, speculative decoding, semantic cache, continuous batching, and multi-backend support.</p>

        <div class="path-features">
          <span class="feature-tag" style="border-color: var(--multimodal-primary);">Visual Node Workflows</span>
          <span class="feature-tag" style="border-color: var(--multimodal-primary);">Speculative Decoding</span>
          <span class="feature-tag" style="border-color: var(--multimodal-primary);">Semantic Cache</span>
          <span class="feature-tag">PagedAttention & KV Offload</span>
          <span class="feature-tag">Continuous Batching</span>
          <span class="feature-tag">OpenAI-Compatible API</span>
          <span class="feature-tag">MCP + RAG Contracts</span>
        </div>

        <div class="path-example">
          <div class="example-label">Example (Visual Node SPI):</div>
          <pre><code class="language-java">// Execute visual workflow node reactively
NodePlugin node = registry.get("prompt-builder");
node.execute(nodeExecutionContext)
    .subscribe().with(
        success -> System.out.println("Node run complete"),
        failure -> log.error("Execution failed", failure)
    );</code></pre>
        </div>

        <div class="path-actions">
  <a href="/docs/plugins/node-plugins" class="btn btn-sm btn-primary" style="background: var(--multimodal-gradient);">Node Workflows</a>
  <a href="/docs/api/node-plugin" class="btn btn-sm btn-ghost">Workflow API</a>
  <a href="/docs/agent-integration-boundary" class="btn btn-sm btn-ghost">Agent Boundary</a>
</div>
      </div>
    </div>
  </div>
</section>


<section class="content-container" style="padding: 80px 0;">
  <h2 class="section-title-alt">Why Gollek?</h2>
  <div class="feature-grid-v2">
  <!-- CLI -->
  <div class="feature-v2-card">
    <div class="feature-v2-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="4,17 10,11 4,5"/><line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    </div>
    <h3>As a CLI Tool</h3>
    <ul class="feature-v2-list">
      <li><strong>Quick Inference</strong>: Multi-provider chat</li>
      <li><strong>Model Mgmt</strong>: List, pull, and verify</li>
      <li><strong>Audio Generation</strong>: MOSS TTS ONNX to WAV/FLAC/MP3</li>
      <li><strong>Quantization</strong>: GPTQ, AWQ, INT8, FP8</li>
    </ul>
  </div>

  <!-- Framework -->
  <div class="feature-v2-card">
    <div class="feature-v2-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    </div>
    <h3>As an ML Framework</h3>
    <ul class="feature-v2-list">
      <li><strong>GradTensor</strong>: Autograd v2 engine</li>
      <li><strong>118+ Layers</strong>: Linear to Transformers</li>
      <li><strong>Hardware</strong>: CUDA, Metal, ROCm kernels</li>
      <li><strong>Distributed</strong>: Cluster-wide training</li>
    </ul>
  </div>

  <!-- Runtime -->
  <div class="feature-v2-card">
    <div class="feature-v2-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </div>
    <h3>As a Serving Runtime</h3>
    <ul class="feature-v2-list">
      <li><strong>Dual-Mode</strong>: CLI and REST/Web Server</li>
      <li><strong>Optimization</strong>: Continuous Batching</li>
      <li><strong>Enterprise</strong>: Metrics, Health, Tracing</li>
      <li><strong>High Perf</strong>: PagedAttention KV-Cache</li>
    </ul>
  </div>
  </div>
</section>


<section class="quick-grid">
  <a class="quick-card" href="/docs/framework/framework">
    <h3>🧠 ML Framework</h3>
    <p>PyTorch-like API: Tensors, Autograd, 118+ NN modules, Advanced Tensor Ops, and Multimodal layers.</p>
  </a>
  <a class="quick-card" href="/docs/framework/diffusion-opd">
    <h3>🌀 DiffusionOPD</h3>
    <p>Java-first on-policy distillation for diffusion models, integrated as native Gollek training modules.</p>
  </a>
  <a class="quick-card" href="/docs/framework/byte-latent">
    <h3>🔤 Byte-Latent Models</h3>
    <p>Fast Byte Latent Transformer style architecture work, mapped to dedicated Gollek language-model modules.</p>
  </a>
  <a class="quick-card" href="/docs/setup/cli-installation#install-chooser">
    <h3>💻 CLI Tool</h3>
    <p>Install via brew, choco, or curl. Chat, convert, generate audio, and manage models.</p>
  </a>
  <a class="quick-card" href="/docs/runtime/moss-tts-onnx">
    <h3>ONNX Text-to-Speech</h3>
    <p>MOSS TTS Nano support with voice presets, Suling WAV/FLAC/MP3 output, live preview, quality presets, and audio run metrics.</p>
  </a>
  <a class="quick-card" href="/docs/runtime/core-api">
    <h3>🚀 Inference Runtime</h3>
    <p>High-performance serving with GPU acceleration and unified Multimodal SDK.</p>
  </a>
  <a class="quick-card" href="/docs/agent-integration-api">
    <h3>Agent Integration</h3>
    <p>Use Gollek as the serving substrate for Wayang-Gollek with endpoints, validation, MCP tools, embeddings, and RAG context.</p>
  </a>
  <a class="quick-card" href="/docs/extensions/">
    <h3>Extensions</h3>
    <p>Scaffold and install pipeline or adapter packages for OCR, TTS, training, quantization, optimization, backends, datasets, and evaluators.</p>
  </a>
  <a class="quick-card" href="/docs/setup/jbang-examples">
    <h3>📚 Examples</h3>
    <p>23+ ready-to-run scripts: from Hello World to Transformer classifiers.</p>
  </a>
  <a class="quick-card" href="/docs/runtime/gpu-kernels">
    <h3>⚡ GPU Kernels</h3>
    <p>CUDA, Metal, ROCm with FlashAttention 2/3/4 and FP8/FP4 precision.</p>
  </a>
  <a class="quick-card" href="/blog/">
    <h3>📝 Blog</h3>
    <p>Release notes, architecture updates, and implementation progress.</p>
  </a>
</section>

<section class="content-container">
  <div class="milestone-grid">
    <!-- Milestone 1: v0.2 -->
    <div class="milestone-card">
      <div class="milestone-title">
        <span class="milestone-tag">Latest Release</span>
        SDK v0.2 Stable
      </div>
      <p>Achieved 75% PyTorch parity with 118+ NN modules, advanced tensor indexing (broadcasting), and native vision/NLP transforms.</p>
      <a href="/docs/release-notes-v0.2" class="milestone-link">
        View Release Notes
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>

    <!-- Milestone 2: JBang -->
    <div class="milestone-card">
      <div class="milestone-title">
        <span class="milestone-tag">Ecosystem</span>
        JBang Examples
      </div>
      <p>23+ verified scripts covering everything from raw tensor math to complex Transformer training and LangChain4j integrations.</p>
      <a href="/docs/setup/jbang-examples" class="milestone-link">
        Browse Catalog
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>

    <!-- Milestone 3: Quantization -->
    <div class="milestone-card">
      <div class="milestone-title">
        <span class="milestone-tag">Optimization</span>
        Advanced Quantization
      </div>
      <p>Native support for GPTQ, AWQ, and TurboQuant. Achieve 8x model compression with minimal quality loss for edge deployment.</p>
      <a href="/docs/plugins/quantization" class="milestone-link">
        Explore Quantization
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>

    <!-- Milestone 4: ONNX Audio -->
    <div class="milestone-card">
      <div class="milestone-title">
        <span class="milestone-tag">Audio Runtime</span>
        MOSS TTS ONNX
      </div>
      <p>Local text-to-speech now runs through a multi-session ONNX pipeline with voice presets, companion codec discovery, Suling WAV/FLAC/MP3 output, live PCM preview, and realtime-factor reporting.</p>
      <a href="/docs/runtime/moss-tts-onnx" class="milestone-link">
        Read TTS Guide
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>

    <!-- Milestone 5: GGUF -->
    <div class="milestone-card">
      <div class="milestone-title">
        <span class="milestone-tag">Compatibility</span>
        Universal GGUF Engine
      </div>
      <p>Support for 40+ model families including Llama 3.2, DeepSeek, and Grok with optimized K-quantization kernels.</p>
      <a href="/docs/gguf-enhancements" class="milestone-link">
        Learn More
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</section>

<section class="terminal-demo">
  <div class="content-container">
    <h2>Try the CLI Experience</h2>
    <p>Experience the speed of Gollek's automated hardware detection and local inference.</p>
    <div id="terminal" class="terminal-box" role="img" aria-label="Typing demo showing gollek audio generation">
      <div class="terminal-header">
        <div class="terminal-dot red"></div>
        <div class="terminal-dot yellow"></div>
        <div class="terminal-dot green"></div>
        <span class="terminal-title">gollek-cli — zsh</span>
      </div>
      <div class="terminal-body">
        <span class="prompt">$</span>
        <span
          id="typing-effect"
          data-command="gollek run --model 71e8f7 --prompt &quot;hello&quot; --voice &quot;en Trump&quot; --audio-quality balanced --output hello.mp3"
          data-result="Resolved local model index entry: ~/.gollek/models/safetensors/OpenMOSS-Team/MOSS-TTS-Nano-100M-ONNX&#10;Provider: onnx&#10;&#10;✓ Audio saved to: hello.mp3&#10;Audio details: 2.08s, 48000 Hz, 1ch, 26 frames, 128 kbps, voice EN Trump, seed 1234, mono collapsed, polished peak&#10;[Audio: 2.08s, Generation: 2.91s, Speed: 0.71x realtime, RTF: 1.40]"
        >gollek run --model 71e8f7 --prompt "hello" --voice "en Trump" --audio-quality balanced --output hello.mp3</span>
      </div>
    </div>
  </div>
</section>


<section class="content-container" style="padding: 60px 0;" markdown="1">

<h2 class="section-title-alt">Quick Start</h2>

### 1. Install CLI
```bash
# MacOS / Linux / Windows
curl -sSL https://raw.githubusercontent.com/bhangun/gollek/main/scripts/install.sh | bash
```

### 2. Add SDK Dependency
```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-sdk-ml</artifactId>
    <version>0.2.0-SNAPSHOT</version>
</dependency>
```

### 3. Run Inference (Local GGUF)
```java
GollekLocalClient client = GollekSdkFactory.createLocalSdk();
var response = client.generate(InferenceRequest.on("llama-3.2-3b").prompt("Hi!"));
System.out.println(response.text());
```

</section>

<section class="content-container" style="padding: 60px 0; border-top: 1px solid var(--border-color);" markdown="1">

<h2 class="section-title-alt">Key Features</h2>

<div class="table-wrapper" style="margin-top: 30px;" markdown="1">

| Category | CLI | ML/Training | Serving Engine | Wayang-Gollek |
|:---|:---:|:---:|:---:|:---:|
| **Inference** | ✅ | ✅ | ✅ | Consumes |
| **Audio/TTS** | ✅ | ✅ | ✅ | Consumes |
| **Training** | ❌ | ✅ | ❌ | Uses models |
| **GPU Acceleration** | ✅ | ✅ | ✅ | Consumes |
| **Continuous Batching** | ✅ | ❌ | ✅ | Consumes |
| **Embeddings** | ✅ | ✅ | ✅ | Uses for RAG |
| **RAG Context Injection** | ❌ | ❌ | ✅ | Supplies context |
| **MCP / Tool Schemas** | ❌ | ❌ | Exposes contracts | Executes tools |
| **Agent Orchestration** | ❌ | ❌ | ❌ | Owns |
| **Memory, HITL, Workflows** | ❌ | ❌ | ❌ | Owns |

</div>

</section>

<section class="content-container" style="padding: 60px 0; border-top: 1px solid var(--border-color);">
  <h2 class="section-title-alt">Supported Providers & Runtimes</h2>
  <div class="provider-group">
    <h3>Cloud AI</h3>
    <div class="chip-grid">
      <span class="provider-chip">OpenAI (o1/GPT-4)</span>
      <span class="provider-chip">Anthropic (Claude 3.5)</span>
      <span class="provider-chip">Google Gemini 1.5</span>
      <span class="provider-chip">Cerebras (Llama 3.1)</span>
      <span class="provider-chip">Mistral / Mixtral</span>
    </div>
  </div>
  <div class="provider-group">
    <h3>Local Engines & Formats</h3>
    <div class="chip-grid">
      <span class="provider-chip">GGUF (llama.cpp)</span>
      <span class="provider-chip">SafeTensors (LibTorch)</span>
      <span class="provider-chip">ONNX Runtime</span>
      <span class="provider-chip">MOSS TTS ONNX</span>
      <span class="provider-chip">MOSS Audio Tokenizer ONNX</span>
      <span class="provider-chip">Stable Diffusion ONNX</span>
      <span class="provider-chip">PyTorch JIT (.pt)</span>
      <span class="provider-chip">Whisper (STT)</span>
    </div>
  </div>
  <div class="provider-group">
    <h3>Extensions & Plugins</h3>
    <div class="chip-grid">
      <span class="provider-chip">Installable Extensions</span>
      <span class="provider-chip">Feature Adapters</span>
      <span class="provider-chip">Inference Pipelines</span>
      <span class="provider-chip">Built-in Runtime Plugins</span>
      <span class="provider-chip">Training / Quantization / Backend Capabilities</span>
    </div>
  </div>
</section>

<section class="content-container" style="padding: 60px 0; border-top: 1px solid var(--border-color);" markdown="1">

<h2 class="section-title-alt">Architecture Overview</h2>

<div class="arch-diagram">

<div class="mermaid">
graph TD
    Wayang["Wayang-Gollek Agent System"] --> AgentPolicy["Planning, memory, tools, approvals"]
    User["User Application"] --> Unified["Gollek Unified Runtime"]
    AgentPolicy --> SDKAPI["Gollek SDK / OpenAI-compatible API"]
    SDKAPI --> Unified

    subgraph Interface_Layer ["Interface Layer"]
        Unified --> CLI["Dual-Mode CLI (Management/Chat)"]
        Unified --> REST["Production REST / Web API"]
        Unified --> SDK["Native Java SDK"]
        Unified --> AgentAPI["Agent Integration Contracts"]
    end

    subgraph Serving_Layer ["Inference & Serving Engine"]
        Unified --> Engine["Universal Inference Core"]
        Engine --> Batch["Continuous Batching Scheduler"]
        Engine --> Cache["PagedAttention KV-Cache"]
        Engine --> Optim["15+ Optimization Plugins"]
    end

    subgraph Framework_Layer ["ML Framework (Training)"]
        Unified --> FW["PyTorch-like Framework"]
        FW --> Tensor["GradTensor (Autograd v2)"]
        FW --> NN["118+ Neural Network Layers"]
        FW --> Data["Vision/NLP Preprocessing"]
    end

    subgraph Core_Engine ["Compute Backend Layer"]
        Engine --> Backends{"Compute Dispatcher"}
        FW --> Backends

        Backends --> CUDA("CUDA / NV")
        Backends --> Metal("Metal / Apple")
        Backends --> ROCm("ROCm / AMD")
        Backends --> CPU("Pure Java / Vector")
    end
</div>

</div>

</section>

<section class="content-container" style="padding: 80px 0; border-top: 1px solid var(--border-color);" markdown="1">

<h2 class="section-title-alt">🌟 Gollek Platform Roadmap</h2>

<p class="lead" style="text-align: center; margin-bottom: 40px;">Gollek is the AI platform foundation. Wayang-Gollek runs on top as the agentic system engine.</p>

<div class="milestone-grid" markdown="1">

<div class="milestone-card" markdown="1">
<div class="milestone-title">Phases 1-3: Deep Learning</div>
118+ layers, Tensor Autograd v2, Metal/CUDA stabilization. ✨ **COMPLETED**
</div>

<div class="milestone-card" markdown="1">
<div class="milestone-title">Phases 4-7: Wayang-Gollek Agent System</div>
Agent planning, memory, tools, HITL, prompts, RAG policy, MCP execution, and low-code orchestration live above Gollek. ✨ **COMPLETED**
</div>

<div class="milestone-card" markdown="1">
<div class="milestone-title">Phases 8-9: Production</div>
85% size reduction, OpenTelemetry integration, 118+ tests. ✨ **COMPLETED**
</div>

</div>

<div class="hero-actions" style="justify-content: center; margin-top: 60px;">
  <a class="btn btn-primary" href="/docs/setup/cli-installation#install-chooser">Start Building Now</a>
  <a class="btn btn-ghost" href="/docs/tutorials/basic/">View Tutorials</a>
</div>

</section>


---

<section class="content-container" style="padding: 40px 0;" markdown="1">

<h2 class="section-title-alt">Community and Support</h2>

<ul class="milestone-list" style="list-style: none; padding: 0;">
  <li><strong><a href="/docs/">Platform Hub</a></strong> - Access all documentation for Gollek runtime, ML framework, training, and production hardening.</li>
  <li><strong><a href="/docs/agent-integration-api">Agent Integration API</a></strong> - Use Gollek's serving contract from Wayang-Gollek or another agent runtime.</li>
  <li><strong><a href="/docs/agent-integration-boundary">Agent Integration Boundary</a></strong> - Understand how Gollek supports Wayang-Gollek without owning orchestration.</li>
  <li><strong><a href="/docs/phases-overview">9-Phase Roadmap</a></strong> - Detailed look at the Gollek and Wayang-Gollek roadmap.</li>
  <li><strong><a href="/docs/setup/cli-reference">CLI Reference</a></strong> - Complete list of terminal commands.</li>
  <li><strong><a href="/docs/setup/jbang-examples">JBang Examples</a></strong> - 23+ ready-to-run Java scripts.</li>
  <li><strong><a href="https://github.com/bhangun/gollek/discussions">Discussions</a></strong> - Join the community on GitHub.</li>
  <li><strong><a href="https://github.com/bhangun/gollek/issues">Issues</a></strong> - Report bugs or request features.</li>
</ul>

</section>

---

Gollek AI is open source and available under the Apache 2.0 License.
