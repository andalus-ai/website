---
layout: default
title: JBang Examples Catalog
---

<section class="hero hero-compact">
  <p class="eyebrow">Interactive Examples</p>
  <h1>Gollek SDK JBang Examples Catalog</h1>
  <p class="lead">23+ ready-to-run Java scripts demonstrating everything from basic tensor operations to advanced neural networks and ML library integrations. No build tools required—just run with jbang.</p>
</section>

<section class="quick-grid">
  <a class="quick-card" href="#beginner">
    <h3>🟢 Beginner</h3>
    <p>Hello World, templates, and basic model creation.</p>
  </a>
  <a class="quick-card" href="#neural-networks">
    <h3>🔵 Neural Networks</h3>
    <p>MLP, custom modules, training loops, and persistence.</p>
  </a>
  <a class="quick-card" href="#nlp">
    <h3>🟣 NLP & Text</h3>
    <p>Sentiment analysis, transformers, and chatbots.</p>
  </a>
  <a class="quick-card" href="#machine-learning">
    <h3>🟠 ML Integrations</h3>
    <p>Deeplearning4j, Stanford NLP, Smile, Tribuo.</p>
  </a>
  <a class="quick-card" href="#audio-multimodal">
    <h3>🟡 Audio & Multimodal</h3>
    <p>Transcription, text-to-speech, native Whisper, and SIMD audio demos.</p>
  </a>
</section>

---

## 🚀 Quick Start

### Prerequisites

```bash
# Java 21+ required
java --version

# Install jbang (if not already installed)
curl -Ls https://sh.jbang.dev | bash -s -
```

### Running Examples

All examples can be run directly from GitHub:

```bash
# Basic syntax
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/<path>/<example>.java

# Example: Hello Gollek
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/hello_gollek.java
```

For the current local Gollek trainer examples, a practical byte-latent flow is:

```bash
cd gollek/examples/jbang
./trainer/run_byte_latent_workflow.sh
./trainer/run_byte_latent_workflow.sh full /tmp/gollek-byte-latent
# full mode ends with a compact fresh/resume checkpoint summary
# and writes a workflow manifest JSON for automation
# and materializes a workflow bundle automatically in full mode
# and prints workflow-inspector commands for both manifest and bundle flows
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json overview
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json workflowBundleDir
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleOverview
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleOverview:focus=health
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleOverview:focus=files
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleOverview:focus=health:summary=short
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json status
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json health
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleStatus
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleOverview:ci
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleHealth:ci
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleHealth:summary=short
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json commands
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json commands:summary
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json commands:ci
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json commands:ci:mode=fresh
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json inspectfields
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json inspectfields:summary
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json inspectfields:ci
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json runcommands
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json runcommands:all
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json runcommands:summary
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json runcommands:ci
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json runcommands:fresh
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json runfields
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json runfields:summary
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json runfields:ci
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json runfields:fresh
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json commands:scope=workflow
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json commands:mode=fresh
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleOverview json
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleManifest json
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleFiles json
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundleLoadfile:section=runs json
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json delta:historyRows
jbang trainer/trainer_byte_latent_workflow_inspector.java trainer_checkpoints/byte_latent_workflow_manifest.json bundle=standard json /tmp/byte-latent-workflow-bundle
jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle files:section=runs json
jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle files:section=runs:sort=name json
jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle files:name=overview.json json
jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle filesSummary:by=section json
jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle filesSummary:by=format json
jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle filesSummary:by=section:sort=-count:top=3 json
jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle file:overview.json json
jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle loadfile:section=runs json
jbang trainer/trainer_byte_latent_workflow_inspector.java /tmp/byte-latent-workflow-bundle loadfile:section=runs:index=0 json
jbang trainer/trainer_byte_latent_demo.java
jbang trainer/trainer_byte_latent_infer_demo.java
jbang trainer/trainer_byte_latent_infer_demo.java "hi"
jbang trainer/trainer_byte_latent_infer_demo.java "gollek" 6
jbang trainer/trainer_byte_latent_train_infer_demo.java
jbang trainer/trainer_byte_latent_train_infer_demo.java /tmp/byte-latent-train-infer "hi" 4
./trainer/run_recursive_reasoning_workflow.sh
./trainer/run_recursive_reasoning_workflow.sh full /tmp/recursive-reasoning
jbang trainer/trainer_recursive_reasoning_demo.java
jbang trainer/trainer_recursive_reasoning_demo.java sudoku-demo /tmp/recursive-reasoning-demo
# writes /tmp/recursive-reasoning-demo/recursive-reasoning-report.json
jbang trainer/trainer_recursive_reasoning_checkpoint_demo.java /tmp/recursive-reasoning-checkpoints
# writes sample recursive-reasoning checkpoint sidecars
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady overview
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady restore json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineage json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageChain json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageGraph json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealth json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthSchema json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthValidation json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthValidationSchema json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthSchemaCatalog json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthSchemas json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthSchemaCatalogSchema json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthSchemaLock json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthSchemaLockSchema json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthSchemaLockValidation schemaLock=/tmp/lineage-health-schema-lock.json json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthSchemaLockValidation schemaLock=/tmp/lineage-health-schema-lock.json requireSchemaLockValid=true json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady lineageHealthSchemaLockValidationSchema json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady overview requireLineageHealthy=true
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady preflight currentReport=/tmp/current-plan-report.json json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady explain currentReport=/tmp/current-plan-report.json json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints latestResumeReady explain currentReport=/tmp/current-plan-report.json resumeMode=force json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints strictLatestResumeReady candidates json
jbang trainer/trainer_recursive_reasoning_checkpoint_inspector.java /tmp/recursive-reasoning-checkpoints runId=run-001 selected json
jbang trainer/trainer_recursive_reasoning_inspector.java /tmp/recursive-reasoning-demo overview
jbang trainer/trainer_recursive_reasoning_inspector.java /tmp/recursive-reasoning-demo overview:ci
jbang trainer/trainer_recursive_reasoning_inspector.java /tmp/recursive-reasoning-demo selectedRewardScore
jbang trainer/trainer_recursive_reasoning_inspector.java /tmp/recursive-reasoning-demo summary json
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-demo-a /tmp/recursive-reasoning-demo-b overview
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-demo-a /tmp/recursive-reasoning-demo-b comparison:ci
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-demo-a /tmp/recursive-reasoning-demo-b delta:selectedRewardScore
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-demo-a /tmp/recursive-reasoning-demo-b result=standard json /tmp/recursive-reasoning-compare-result.json
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-compare-result.json resultSummary
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-compare-result.json resultHealth:ci
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-demo-a /tmp/recursive-reasoning-demo-b bundle=standard json /tmp/recursive-reasoning-compare-bundle
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-compare-bundle bundleSummary
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-compare-bundle bundleHealth:ci
jbang trainer/trainer_recursive_reasoning_compare_inspector.java /tmp/recursive-reasoning-compare-bundle loadfile:comparison json
# writes /tmp/byte-latent-train-infer/train-infer-report.json with reportVersion, nextTokens, nextTokensPreview, overview, overviewCi, status, statusSummary, commands, commandsCi, selectors, selectorsCi, inspectfields, inspectfieldsCi, artifactSummary, and artifactSummaryLine
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer reportVersion
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer artifactSummary
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer artifactSummaryLine
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer overview
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer overview:ci
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer commands
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer commands:ci
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer selectors
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer selectors:ci
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer inspectfields
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer statusSummary
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer training
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer nextToken
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer nextTokens
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer nextTokensPreview
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer combinedText
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer health
jbang trainer/trainer_byte_latent_train_infer_inspector.java /tmp/byte-latent-train-infer ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b overview
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b health
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b delta:latestTrainLoss
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b delta:nextTokens
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b delta:nextTokensPreview
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b delta:nextTokensCount
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b delta:combinedText
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b artifactSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b artifactSummaryLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b commands
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b commands:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b selectors
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b selectors:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b inspectfields
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b inspectfields:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b comparison
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b compareSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b compareSummaryLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b result=standard json /tmp/byte-latent-train-infer-compare-result.json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultSummaryLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultCommands
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboard
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboard:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardManifest
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardManifest:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardOverview
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardOverview:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardStatus
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardStatus:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardHealth
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardHealth:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardAliases
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardAliases:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTree
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTree:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeManifest
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeManifest:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeDashboard
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeDashboard:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreePaths
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreePaths:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalog
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalog:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogManifest
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogManifest:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogOverview
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogOverview:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryFields
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryFields:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryCommands
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryCommands:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummarySelectors
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummarySelectors:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryAliases
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryAliases:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryDiscovery
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryDiscovery:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryLineage
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryLineage:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryNavigation
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryNavigation:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryBreadcrumbs
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryBreadcrumbs:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummarySitemap
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummarySitemap:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryIndex
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryIndex:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistry
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistry:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryFields
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryFields:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryCommands
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryCommands:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistrySelectors
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistrySelectors:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryAliases
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryAliases:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryDiscovery
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryDiscovery:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryNavigation
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryNavigation:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryBreadcrumbs
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryBreadcrumbs:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistrySitemap
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistrySitemap:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryIndex
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryIndex:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryOverview
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryOverview:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryStatus
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryStatus:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryHealth
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryHealth:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistrySummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistrySummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryManifest
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryManifest:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryEnvelope
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryEnvelope:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistrySnapshot
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistrySnapshot:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryAudit
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryAudit:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryReport
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryReport:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklist
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklist:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistStatus
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistStatus:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistHealth
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistHealth:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistBadge
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistBadge:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistCard
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistCard:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistPanel
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistPanel:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistWidget
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistWidget:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistTile
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistTile:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistMetric
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistMetric:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistTrend
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistTrend:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistGauge
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistGauge:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummaryCard
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistSummaryCard:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistActionBar
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistActionBar:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboard
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboard:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardManifest
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardManifest:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSnapshot
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSnapshot:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardAudit
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardAudit:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReport
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReport:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardEnvelope
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardEnvelope:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardPackage
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardPackage:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardBundle
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardBundle:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDelivery
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDelivery:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReceipt
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardReceipt:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardArchive
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardArchive:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardLedger
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardLedger:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardHistory
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardHistory:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTimeline
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTimeline:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTrace
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTrace:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTelemetry
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardTelemetry:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardObservation
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardObservation:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSignal
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardSignal:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardInsight
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardInsight:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardRecommendation
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardRecommendation:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDecision
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardDecision:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGate
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGate:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateJson
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateJson:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateEnv
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateEnv:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateMarkdown
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateMarkdown:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateArtifact
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateArtifact:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadManifest
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadManifest:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadScript
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadScript:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadReadme
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadReadme:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadBundle
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadBundle:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadIndex
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadIndex:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesIndex
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesIndex:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesJsonLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesJsonLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesCsvLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesCsvLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesTsvLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesTsvLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesEnv
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesEnv:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesMarkdown
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesMarkdown:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksums
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksums:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsBadge
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsBadge:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCard
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCard:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsPanel
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsPanel:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsWidget
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsWidget:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTile
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTile:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMetric
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMetric:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTrend
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTrend:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsGauge
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsGauge:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummaryCard
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSummaryCard:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsActionBar
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsActionBar:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMenu
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMenu:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToolbar
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToolbar:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCommandPalette
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCommandPalette:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchIndex
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchIndex:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchResults
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsSearchResults:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsFilterState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsFilterState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsViewState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsViewState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEmptyState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEmptyState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLoadingState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLoadingState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsErrorState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsErrorState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToastState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsToastState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationCenter
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationCenter:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationBadge
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationBadge:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanel
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanel:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelJsonLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelJsonLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCsvLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCsvLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelTsvLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelTsvLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMarkdown
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMarkdown:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEnv
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEnv:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSummaryCard
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSummaryCard:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelActionBar
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelActionBar:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMenu
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelMenu:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToolbar
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToolbar:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCommandPalette
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelCommandPalette:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchIndex
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchIndex:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchResults
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelSearchResults:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelFilterState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelFilterState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelViewState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelViewState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEmptyState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelEmptyState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLoadingState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelLoadingState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelErrorState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelErrorState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToastState
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelToastState:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationCenter
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationCenter:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationBadge
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationBadge:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationJsonLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsNotificationPanelNotificationJsonLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsJsonLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsJsonLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCsvLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsCsvLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTsvLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsTsvLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMarkdown
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsMarkdown:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEnv
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadFilesChecksumsEnv:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatus
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatus:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatusLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadStatusLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadEnv
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadEnv:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadJsonLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadJsonLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadCsvLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadCsvLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadTsvLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDashboardGateUploadTsvLine:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDetails
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogTreeSummaryRegistryChecklistDetails:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogFields
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogFields:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogCommands
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogCommands:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogCommandsSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogCommandsSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogSelectors
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogSelectors:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogSelectorsSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogSelectorsSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogAliases
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogAliases:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogAliasesSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogAliasesSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogChildrenSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogChildrenSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogCountsSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCatalogCountsSummary:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeChildren
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeChildren:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCounts
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCounts:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeFields
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeFields:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeAliases
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeAliases:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCommands
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeCommands:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeSelectors
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardTreeSelectors:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardFamilyFields
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardFamilyFields:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardFamilyCommands
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardFamilyCommands:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardFamilySelectors
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardFamilySelectors:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardSelectors
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardSelectors:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardCommands
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardCommands:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardFields
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultDashboardFields:ci

For the DiffusionOPD report-inspection lane, see the dedicated walkthrough:

- [DiffusionOPD JBang Inspector Workflow](/docs/tutorials/advanced/diffusion-opd-jbang-inspector)
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultOverview
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultOverview:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultManifest
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultManifest:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultComparison
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultComparison:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultPayloads
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultPayloads:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultSources
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultSources:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultAliases
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultAliases:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultStatus
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultStatus:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultHealth
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultHealth:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultCommands:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultSelectors:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-result.json resultFields:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-a /tmp/byte-latent-train-infer-b bundle=standard json /tmp/byte-latent-train-infer-compare-bundle
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle reportVersion
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle loadfile:delta-nextTokensCount json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle loadfile:delta-nextTokensPreview json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle loadfile:delta-nextTokens json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle comparisonSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle artifactSummary
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle artifactSummaryLine
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleOverview
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleOverview:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleStatus
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle commands
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle commands:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle selectors
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle selectors:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle inspectfields
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle inspectfields:ci
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=files:top=5
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=files:section=runs:sort=status json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=files:status=missing:top=3 json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=sections:format=json json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=formats:section=runs json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleHealth:focus=sections:sort=-missingCount json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle bundleFiles json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle files:section=runs:sort=name json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle files:format=json:sort=-name:top=2 json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle filesSummary:by=section:sort=-count:top=3
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle filesSummary:by=format:sort=-count json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle loadfile:overview json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle loadfile:section=runs:pick=last json
jbang trainer/trainer_byte_latent_train_infer_compare_inspector.java /tmp/byte-latent-train-infer-compare-bundle loadfile:section=runs:index=0 json
jbang trainer/trainer_byte_latent_history_inspector.java trainer_checkpoints/byte_latent_demo status
jbang trainer/trainer_byte_latent_history_inspector.java trainer_checkpoints/byte_latent_demo health
jbang trainer/trainer_byte_latent_history_inspector.java trainer_checkpoints/byte_latent_demo ci
jbang trainer/trainer_byte_latent_history_inspector.java trainer_checkpoints/byte_latent_demo status:ci
jbang trainer/trainer_byte_latent_history_inspector.java trainer_checkpoints/byte_latent_demo summary json
jbang trainer/trainer_byte_latent_history_inspector.java trainer_checkpoints/byte_latent_demo history:summary
jbang trainer/trainer_byte_latent_resume_demo.java
jbang trainer/trainer_byte_latent_history_inspector.java trainer_checkpoints/byte_latent_resume_demo overview json
./trainer/run_byte_latent_smoke.sh
./trainer/run_byte_latent_resume_smoke.sh
```

### First-Time Setup

```bash
# Clone repository (optional, for local editing)
git clone https://github.com/bhangun/gollek.git
cd gollek/gollek/sdk/integration/jbang-templates

# Build SDK locally (required for first run)
cd ../../../../ && mvn clean install -DskipTests
```

---

## 🟡 Audio & Multimodal {#audio-multimodal}

Runnable audio-oriented scripts for transcription, speech synthesis, native
Whisper experiments, and SIMD audio processing.

Before running the local audio examples that depend on Gollek snapshot modules,
publish the required artifacts to `mavenLocal`:

```bash
cd gollek
./gradlew --no-daemon \
  :ml:gollek-ml-api:publishToMavenLocal \
  :ml:gollek-ml-core:publishToMavenLocal \
  :ml:gollek-ml-data:publishToMavenLocal \
  :ml:gollek-ml-nn:publishToMavenLocal \
  :ml:gollek-ml-autograd:publishToMavenLocal \
  :ml:gollek-ml-audio:publishToMavenLocal \
  :ml:gollek-ml-cnn:publishToMavenLocal \
  :ml:gollek-ml-diffusion-api:publishToMavenLocal \
  :ml:gollek-ml-diffusion-opd:publishToMavenLocal \
  :core:gollek-core:publishToMavenLocal \
  :runner:gollek-diffusion:publishToMavenLocal \
  :runner:safetensor:gollek-runner-stable-diffusion:publishToMavenLocal
```

### Audio & multimodal test status snapshot

| Example | Verified status on 2026-05-21 | What that means |
|---------|-------------------------------|-----------------|
| `simd_audio_processing.java` | ✅ Passed end to end | Local SIMD audio demo runs successfully |
| `native_whisper_stt.java` | ✅ Passed end to end | Native Whisper STT flow builds and transcribes successfully |
| `stable_diffusion_metal.java` | ✅ Passed end to end | Metal dylib, runtime, device detection, and SD graph probe all succeed |
| `sd_generate.sh --help` | ✅ Passed end to end | Shell wrapper usage/help path is verified |
| `sd_generate.sh` | ⚠️ Model-dependent | Wrapper is repaired and boundary-checked, but full image generation still depends on local ONNX model availability |
| `stable_diffusion_generation.java` | ⚠️ Boundary-checked | High-level SDK wrapper now stops cleanly at missing-model preflight |
| `stable_diffusion_batch.java` | ⚠️ Boundary-checked | Batch wrapper now stops cleanly at missing-model preflight |
| `sd_generation.java` | ⚠️ Boundary-checked | Compact SDK wrapper reaches the same clean missing-model boundary |
| `sd_direct.java` | ⚠️ Boundary-checked | Lower-level runner path reaches the same clean missing-model boundary |
| `sd_minimal.java` | ⚠️ Boundary-checked | Pure-JDK ONNX probe builds and reaches the same missing-model boundary |
| `smart_transcriber.java` | ⚠️ Validation boundary | Script now reaches missing-audio-file validation cleanly |
| `text_to_speech.java` | ⚠️ Validation boundary | Script now reaches missing-model or invalid-model-path validation cleanly |
| `vision_storyteller.java` | ⚠️ Validation boundary | Script now reaches missing-image validation cleanly |
| `video_analyst.java` | ⚠️ Validation boundary | Script now reaches missing-video validation cleanly |
| `omni_assistant.java` | ⚠️ Validation boundary | Script now reaches missing image/audio validation cleanly |

### Audio & multimodal quick-start commands

```bash
cd gollek/examples/jbang

# Diffusion: quickest shell-first path
./multimodal/sd_generate.sh --help

# Speech-to-text: verified native Whisper path
jbang multimodal/native_whisper_stt.java

# Text-to-speech: validate the SpeechT5 wrapper boundary
jbang multimodal/text_to_speech.java --model /path/to/speecht5-model-dir

# Vision: validate image-to-text wrapper input handling
jbang multimodal/vision_storyteller.java /path/to/image.jpg

# Video: validate video-analysis wrapper input handling
jbang multimodal/video_analyst.java /path/to/video.mp4
```

### Which diffusion example should I start with?

- Start with `multimodal/sd_generate.sh` if you want the fastest shell-first
  path with built-in cache checks, writable-home fallback, and optional
  `--pull-if-missing` bootstrap.
- Start with `multimodal/stable_diffusion_generation.java` if you want the
  main SDK-backed JBang wrapper and the clearest high-level text-to-image flow.
- Start with `multimodal/stable_diffusion_batch.java` if you want repeated
  seed-driven variations from the same prompt.
- Start with `multimodal/stable_diffusion_metal.java` if you are on Apple
  Silicon and want to confirm that the Metal runtime and Java-side diffusion
  graph are alive before you chase model-weight issues.
- Start with `multimodal/sd_direct.java` if you want the lower-level runner
  path instead of the higher-level SDK wrapper.
- Start with `multimodal/sd_minimal.java` if you want the lightest pure-JDK
  plus ONNX Runtime probe.

### Stable Diffusion Generation
**File**: `multimodal/stable_diffusion_generation.java`

High-level text-to-image generation through the local SDK path.

```bash
cd gollek/examples/jbang
jbang multimodal/stable_diffusion_generation.java \
  --prompt "a cyberpunk cat" \
  --steps 20 \
  --output cyberpunk-cat.png
```

**Key Concepts**:
- local SDK-backed diffusion flow
- text-to-image request shaping
- explicit ONNX model preflight

**What You'll Learn**: The shortest JBang path into the local Stable Diffusion wrapper.

**Local test status**: Repaired and smoke-tested on 2026-05-21 through its
model-availability boundary. It now uses plain JBang mode, the current
`GollekSdkFactory.createLocalSdk()` path, the current `InferenceRequest`
message contract, and cleanly stops with a stable “pull the ONNX model first”
hint when `CompVis/stable-diffusion-v1-4` is not installed locally.

Companion note: `multimodal/sd_generation.java` was refreshed and smoke-tested
in the same pass. It now reaches the same clean missing-model boundary and
serves as the more compact interactive-style variant of this wrapper.

---

### Stable Diffusion Batch
**File**: `multimodal/stable_diffusion_batch.java`

Batch variation generation using multiple seeds.

```bash
cd gollek/examples/jbang
jbang multimodal/stable_diffusion_batch.java \
  --prompt "a cat, digital art" \
  --count 3 \
  --steps 20
```

**Key Concepts**:
- repeated diffusion runs across seed variants
- batch-style wrapper flow
- deterministic seed scheduling

**What You'll Learn**: How the JBang batch wrapper stages repeated Stable Diffusion requests.

**Local test status**: Repaired and smoke-tested on 2026-05-21 through its
model-availability boundary. It now uses the same current local SDK path as the
single-image wrapper, includes the required request-message fix, and no longer
hangs on early streaming errors before reaching its preflight model check.

---

### Stable Diffusion Direct Runner
**File**: `multimodal/sd_direct.java`

Lower-level direct-runner example without the higher-level SDK wrapper.

```bash
cd gollek/examples/jbang
jbang multimodal/sd_direct.java --steps 10
```

**Key Concepts**:
- direct `StableDiffusionOnnxRunner` usage
- manual local-model discovery
- lower-level runner initialization

**What You'll Learn**: The lowest-level JBang diffusion path in this examples set.

**Local test status**: Repaired and smoke-tested on 2026-05-21 through its
model-availability boundary. It now runs in plain JBang mode without the stale
extra local-model-repo dependency and cleanly reaches its “pull the ONNX model
first” hint.

---

### Stable Diffusion Minimal
**File**: `multimodal/sd_minimal.java`

Pure JDK 25 plus ONNX Runtime probe without the higher-level local SDK path.

```bash
cd gollek/examples/jbang
jbang multimodal/sd_minimal.java --steps 10
```

**Key Concepts**:
- pure JDK 25 diffusion experiment
- direct ONNX Runtime wiring
- minimal PNG/output-side probe path

**What You'll Learn**: The lightest low-level diffusion script in the JBang set,
useful when you want to inspect the bare ONNX-oriented path rather than the SDK
or Metal wrapper layers.

**Local test status**: Compile bug repaired and smoke-tested on 2026-05-21
through its model-availability boundary. It now builds successfully and cleanly
reaches its “download the ONNX model first” hint.

---

### Stable Diffusion Metal Probe
**File**: `multimodal/stable_diffusion_metal.java`

Apple-Silicon-focused probe for the maintained Metal binding plus the current
Java-side Stable Diffusion model graph.

```bash
cd gollek/examples/jbang
jbang multimodal/stable_diffusion_metal.java
```

**Key Concepts**:
- Metal dylib discovery and runtime activation
- Apple Silicon device and unified-memory inspection
- maintained Stable Diffusion graph construction without stale SDK-era wiring

**What You'll Learn**: The fastest terminal path for checking whether the local
Metal bridge and Java diffusion graph are both alive before attempting a
heavier real-weight inference flow.

**Local test status**: Repaired and smoke-tested successfully on 2026-05-21.
It now uses the current `gollek-model-common` and `gollek-backend-metal`
artifacts, plain JBang mode, and reaches a real hardware-backed probe boundary:
Metal dylib loaded, runtime active, Apple device detected, unified memory
reported, and the maintained Stable Diffusion graph constructed successfully.

---

### Stable Diffusion Shell Wrapper
**File**: `multimodal/sd_generate.sh`

Shell-first Stable Diffusion helper that wraps the current Quarkus CLI path.

```bash
cd gollek/examples/jbang/multimodal
./sd_generate.sh --help
./sd_generate.sh "a cyberpunk cat" 20 cyberpunk-cat.png
./sd_generate.sh --pull-if-missing "a cyberpunk cat" 20 cyberpunk-cat.png
```

**Key Concepts**:
- current executable CLI jar discovery
- writable runtime-home fallback for restricted environments
- preflight ONNX cache detection and optional auto-pull bootstrap

**What You'll Learn**: The fastest shell-based diffusion route when you want a
single helper script instead of invoking the CLI or JBang Java wrappers
directly.

**Local test status**: Repaired and smoke-tested on 2026-05-21 through its
shell/runtime/model-bootstrap boundaries. It now:
- finds the current Quarkus CLI jar instead of the stale Maven-era path
- enables the required Vector module automatically
- falls back to a writable temporary `GOLLEK_HOME` when `~/.gollek` is not
  usable
- preflights the ONNX cache before launching the full run
- supports `--pull-if-missing` using the current `pull hf:...@onnx` syntax

---

### Smart Transcriber
**File**: `multimodal/smart_transcriber.java`

Terminal-first transcription plus a lightweight follow-up summary flow.

```bash
cd gollek/examples/jbang
jbang multimodal/smart_transcriber.java meeting.wav
```

**Key Concepts**:
- audio-file transcription
- Whisper-backed multimodal flow
- transcript summarization pipeline

**What You'll Learn**: A practical end-to-end JBang transcription path.

**Local test status**: Repaired and smoke-tested on 2026-05-21 through its
script-validation boundary. It now uses the current `gollek-ml-api` and
`gollek-ml-multimodal` artifacts, disables JBang integrations explicitly, and
correctly reaches its own missing-audio-file validation path.

---

### Text To Speech
**File**: `multimodal/text_to_speech.java`

SpeechT5-based speech synthesis that writes a WAV file.

```bash
cd gollek/examples/jbang
jbang multimodal/text_to_speech.java \
  --model /path/to/speecht5-tts \
  --text "Hello World" \
  --output hello.wav
```

**Key Concepts**:
- text-to-speech synthesis
- WAV artifact generation
- preset-voice local flow

**What You'll Learn**: The shortest runnable JBang TTS path.

**Local test status**: Repaired and smoke-tested on 2026-05-21 through its
script-validation boundary. It now uses the current
`tech.kayys.gollek.safetensor.audio.SpeechT5Engine` API, requires an explicit
`--model` path, disables JBang integrations explicitly, and correctly reaches
its missing/invalid model-path validation before synthesis.

---

### Native Whisper STT
**File**: `multimodal/native_whisper_stt.java`

Pure Java Whisper-pipeline demo using Vector API and native-access-enabled Java.

```bash
cd gollek/examples/jbang
jbang multimodal/native_whisper_stt.java
```

**Key Concepts**:
- native Whisper pipeline structure
- SIMD-oriented audio preprocessing
- mel-spectrogram and token generation flow

**What You'll Learn**: How the lower-level native STT demo is shaped.

**Local test status**: Smoke-tested successfully on 2026-05-21 after fixing
stale `//SOURCES` paths and repairing the Whisper positional-embedding shape
handling.

---

### SIMD Audio Processing
**File**: `machine_learning/simd_audio_processing.java`

Performance-oriented audio buffer demo showing SIMD normalization and scaling.

```bash
cd gollek/examples/jbang
jbang machine_learning/simd_audio_processing.java
```

**Key Concepts**:
- SIMD normalization
- SIMD scaling
- audio buffer performance behavior

**What You'll Learn**: The low-level audio performance demo path.

**Local test status**: Smoke-tested successfully on 2026-05-21.

---

### Related Vision / Video / Omni Scripts

The adjacent high-level multimodal scripts were also refreshed on 2026-05-21 to
use the current `gollek-ml-*` artifacts, the current
`tech.kayys.gollek.ml.multimodal.MultimodalResult` package, and explicit plain
JBang mode via `//NOINTEGRATIONS`:

- `multimodal/vision_storyteller.java`
- `multimodal/video_analyst.java`
- `multimodal/omni_assistant.java`

**Local test status**:

- `vision_storyteller.java` now reaches its missing-image-file validation path
- `video_analyst.java` now reaches its missing-video-file validation path
- `omni_assistant.java` now reaches its missing image/audio file validation path

These are wrapper-level smoke checks rather than live model execution checks,
but they confirm the JBang metadata and current imports are now aligned with the
present codebase.

---

## 🟢 Beginner Examples {#beginner}

Fundamental concepts and getting started patterns.

### Hello Gollek
**File**: `common/hello_gollek.java`

The simplest possible introduction to the SDK.

```bash
cd gollek/examples/jbang
jbang common/hello_gollek.java
```

**Key Concepts**:
- Model creation
- Forward pass
- Tensor output

**What You'll Learn**: Basic SDK initialization and model construction.

**Local test status**: Smoke-tested successfully on 2026-05-21 after removing
the leftover GitHub-package repo indirection and keeping only the current local
Maven dependency path.

---

### My Script (Template)
**File**: `common/my_script.java`

A clean template for starting your own Gollek experiments.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/my_script.java
```

**Key Concepts**:
- Project structure
- Dependency management
- Basic imports

**What You'll Learn**: How to structure your own jbang scripts.

---

### Error Handling
**File**: `common/error_handling.java`

Best practices for catching and managing SDK-specific exceptions.

```bash
cd gollek/examples/jbang
jbang common/error_handling.java
```

**Key Concepts**:
- Try-catch patterns
- Exception types
- Graceful degradation

**What You'll Learn**: Production-ready error handling.

**Local test status**: Smoke-tested successfully on 2026-05-21 after removing
the leftover GitHub-package repo indirection and keeping only the current local
Maven dependency path.

---

## 🔵 Neural Networks {#neural-networks}

Build and train neural networks from scratch.

### Neural Network with Gollek
**File**: `neural_network/neural_network_with_gollek.java`

Complete introduction to building neural networks.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/neural_network/neural_network_with_gollek.java
```

**Key Concepts**:
- Sequential models
- Layer composition
- Activation functions

**What You'll Learn**: Core neural network building blocks.

---

### XOR Training (End-to-End)
**File**: `common/xor_training.java`

A complete script that trains a 2-layer MLP to solve the non-linear XOR problem.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/xor_training.java
```

**Key Concepts**:
- Non-linear classification
- BCEWithLogitsLoss
- SGD optimizer
- Training loop
- Backward pass

**What You'll Learn**: Complete training workflow from data to predictions.

---

### MNIST-Style Setup
**File**: `common/mnist_style_setup.java`

Simulates a digit classification network (28x28 inputs).

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/mnist_style_setup.java
```

**Key Concepts**:
- Deep linear layers
- Parameter counting
- `train()` vs `eval()` modes
- Input flattening

**What You'll Learn**: Setting up image classification architectures.

---

### Custom Module Demo
**File**: `common/custom_module_demo.java`

Shows how to extend the `Module` base class to create complex, reusable components like Residual Blocks.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/custom_module_demo.java
```

**Key Concepts**:
- Class inheritance
- Parameter registration
- Skip connections
- Custom architectures

**What You'll Learn**: Building reusable neural network components.

---

### Model Persistence
**File**: `common/model_persistence.java`

Learn how to save and load model weights to/from disk.

```bash
cd gollek/examples/jbang
jbang common/model_persistence.java
```

**Key Concepts**:
- `model.save(path)`
- `model.load(path)`
- Checkpoint management

**What You'll Learn**: Saving and restoring trained models.

**Local test status**: Smoke-tested successfully on 2026-05-21 after removing
the leftover GitHub-package repo indirection and verifying the full
save-then-load flow end to end.

---

### Model Persistence (Safetensors)
**File**: `common/model_persistence_safetensor.java`

Advanced model persistence using the Safetensors format.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/model_persistence_safetensor.java
```

**Key Concepts**:
- Safetensors format
- Safe model serialization
- Cross-framework compatibility

**What You'll Learn**: Modern, safe model persistence.

---

### Batch Processing
**File**: `common/batch_process.java`

Demonstrates how to process multiple data files in a loop.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/batch_process.java
```

**Key Concepts**:
- Batch inference
- File I/O
- Loop processing

**What You'll Learn**: Efficient batch processing patterns.

---

### Train via CLI
**File**: `common/train_cli.java`

A script that accepts command-line arguments for epochs and learning rate.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/train_cli.java 20 0.05
```

**Key Concepts**:
- Command-line arguments
- Hyperparameter configuration
- Flexible training scripts

**What You'll Learn**: Building configurable training tools.

**Usage**:
```bash
jbang train_cli.java 50 0.001
```

---

### Train Model (Complete Example)
**File**: `common/train_model.java`

Full training example with loss tracking and metrics.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/common/train_model.java
```

**Key Concepts**:
- Complete training loop
- Loss monitoring
- Progress reporting

**What You'll Learn**: Professional training workflows.

---

## 🟣 NLP & Text Processing {#nlp}

Natural language processing with transformers and sentiment analysis.

### NLP Sentiment Analysis
**File**: `nlp_sentiment_analysis.java`

Trains a native classifier on real movie reviews using the Gollek SDK.

```bash
cd gollek/examples/jbang
printf 'exit\n' | jbang nlp/nlp_sentiment_analysis.java
```

**Key Concepts**:
- Bag-of-Words features
- Text tokenization
- Binary classification
- Real dataset (100 reviews)

**What You'll Learn**: End-to-end text classification with current local model
save/load persistence.

**Dataset**: 50 positive + 50 negative movie reviews with TF normalization.

**Local test status**: Smoke-tested successfully on 2026-05-21 after
refreshing the script from local `${user.home}/.gollek/jbang/libs/*` paths to
current local Maven artifacts and enabling the Vector API module.

---

### NLP Transformer Classifier
**File**: `nlp_transformer_classifier.java`

A sophisticated sequence model using Transformer architecture.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/nlp_transformer_classifier.java
```

**Key Concepts**:
- Embedding layers
- Positional encoding
- Multi-head attention
- Global pooling
- Safetensor persistence

**What You'll Learn**: Building transformer-based models.

**Workflow**: Tokenization → Training → Persistence → Inference

---

### NLP Chat with Qwen GGUF
**File**: `nlp_chat_qwen_gguf.java`

Interactive chatbot using Qwen model in GGUF format.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/nlp_chat_qwen_gguf.java
```

**Key Concepts**:
- GGUF model loading
- Chat interface
- Streaming responses
- Conversation history

**What You'll Learn**: Building conversational AI applications.

---

## 🟠 Machine Learning Integrations {#machine-learning}

Integration with popular Java ML libraries.

### Computer Vision MLP Classifier
**File**: `machine_learning/cv_mlp_classifier_export.java`

Image classification with current SDK persistence and reload verification.

```bash
cd gollek/examples/jbang
jbang machine_learning/cv_mlp_classifier_export.java
```

**Key Concepts**:
- Image preprocessing
- MLP for vision
- Model save/load persistence
- Classification metrics

**What You'll Learn**: Computer vision with Gollek plus current native module
persistence and reload checks.

**Local test status**: Smoke-tested successfully on 2026-05-21 after
refreshing the script from local `${user.home}/.gollek/jbang/libs/*` paths to
current local Maven artifacts, replacing removed legacy export helpers with the
current `Module.save/load` path, and enabling the Vector API module.

---

## 🔗 External Library Integrations

Advanced integrations with external ML/NLP libraries. All integration examples are located in the `integration/` subdirectory.

### Deeplearning4j Integration
**File**: `integration/deeplearning4j_integration.java`

Integrates Gollek SDK with Deeplearning4j for hybrid workflows.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/integration/deeplearning4j_integration.java
```

**Patterns Demonstrated**:
1. DL4J preprocessing → Gollek inference
2. DL4J feature extraction → Gollek classification
3. Ensemble (DL4J + Gollek)
4. Bidirectional tensor conversion (INDArray ↔ GradTensor)

**Key Classes**:
- `DL4JPreprocessorGollekInference`
- `DL4JFeatureExtractorGollekClassifier`
- `EnsembleDL4JGollek`

**What You'll Learn**: Leveraging DL4J's ecosystem with Gollek inference.

---

### Stanford NLP Integration
**File**: `integration/stanford_nlp_integration.java`

Integrates Gollek SDK with Stanford CoreNLP for advanced NLP.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/integration/stanford_nlp_integration.java
```

**Patterns Demonstrated**:
1. Linguistic feature extraction (POS, NER, sentiment)
2. Text classification with linguistic features
3. Hybrid sentiment analysis (Stanford + Gollek)
4. Multi-stage NLP pipeline

**Features Extracted**:
- Sentence length, avg word length
- POS tag distribution (12 tags)
- Named entity counts (7 categories)
- Stanford sentiment score
- Parse tree depth

**What You'll Learn**: Rich linguistic feature engineering.

---

### Apache OpenNLP Integration
**File**: `integration/opennlp_integration.java`

Integrates Gollek SDK with Apache OpenNLP for text processing.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/integration/opennlp_integration.java
```

**Patterns Demonstrated**:
1. Sentence detection → tokenization → POS tagging
2. Named entity recognition
3. Text classification with OpenNLP features
4. NER-based document categorization

**Features Extracted**:
- Sentence/token counts
- POS ratios (noun, verb, adjective, adverb)
- Named entity distribution
- Vocabulary richness

**What You'll Learn**: Production-ready NLP pipelines.

**Note**: Downloads OpenNLP models on first run (cached in temp directory).

---

### Smile ML Integration
**File**: `integration/smile_ml_integration.java`

Integrates Gollek SDK with Smile (Statistical Machine Intelligence & Learning Engine).

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/integration/smile_ml_integration.java
```

**Patterns Demonstrated**:
1. Smile preprocessing → Gollek inference
2. Smile feature selection → Gollek classification
3. Ensemble (Smile Random Forest + Gollek NN)
4. Statistical feature extraction

**Statistical Features**:
- Mean, variance, standard deviation
- Min, max, skewness, kurtosis

**What You'll Learn**: Combining traditional ML with neural networks.

---

### Oracle Tribuo Integration
**File**: `integration/tribuo_integration.java`

Integrates Gollek SDK with Oracle's Tribuo ML library.

```bash
jbang https://raw.githubusercontent.com/bhangun/gollek/main/gollek/sdk/integration/jbang-templates/examples/integration/tribuo_integration.java
```

**Patterns Demonstrated**:
1. Tribuo feature pipeline → Gollek classification
2. Ensemble (Tribuo XGBoost + Gollek NN)
3. Tribuo text classification → Gollek
4. Tribuo regression + Gollek refinement

**What You'll Learn**: Enterprise ML integration patterns.

---

## 📊 Example Categories Summary

| Category | Files | Difficulty | Topics |
|----------|-------|------------|--------|
| **Beginner** | 3 | 🟢 Easy | Hello World, Templates, Error Handling |
| **Neural Networks** | 8 | 🟡 Medium | MLP, Training, Persistence, Custom Modules |
| **NLP & Text** | 3 | 🟠 Advanced | Sentiment, Transformers, Chatbots |
| **ML Integrations** | 6 | 🔴 Expert | DL4J, Stanford NLP, OpenNLP, Smile, Tribuo |

---

## 🛠 Troubleshooting

### Common Issues

**Problem: Dependencies not found**
```bash
# Solution: Build SDK locally first
cd gollek && mvn clean install -DskipTests
```

**Problem: Out of memory**
```bash
# Solution: Increase heap size
JAVA_OPTS="-Xmx4g" jbang example.java
```

**Problem: First run is slow**
- Normal behavior—jbang downloads and caches dependencies
- Subsequent runs are fast (1-2 seconds)

**Problem: Class not found**
```bash
# Solution: Clear jbang cache
rm -rf ~/.jbang/cache
jbang example.java
```

### Getting Help

- [JBang Setup Guide](https://github.com/bhangun/gollek/blob/main/gollek/sdk/integration/jbang-templates/JBANG_SETUP.md)
- [Jupyter & JBang Integration](/docs/dev-log/jupyter-jbang-integration)
- [ML SDK Documentation](/docs/framework/ml-sdk)
- [Troubleshooting Guide](/docs/setup/troubleshooting)

---

## 📚 Additional Resources

### Documentation
- [JBang & Jupyter Tutorial](/docs/dev-log/jupyter-jbang-integration)
- [ML SDK API Reference](/docs/framework/ml-sdk)
- [Framework Overview](/docs/framework/framework)
- [Examples Docs](/docs/setup/examples-docs)

### External Links
- [jbang Documentation](https://jbang.dev/documentation)
- [Deeplearning4j](https://deeplearning4j.konduit.ai/)
- [Stanford CoreNLP](https://stanfordnlp.github.io/CoreNLP/)
- [Apache OpenNLP](https://opennlp.apache.org/)
- [Smile ML](https://haifengl.github.io/)
- [Oracle Tribuo](https://tribuo.org/)

---

## 🎯 Learning Paths

### Path 1: Complete Beginner
1. Hello Gollek
2. My Script (Template)
3. Error Handling
4. Neural Network with Gollek

### Path 2: Neural Network Developer
1. XOR Training
2. MNIST-Style Setup
3. Custom Module Demo
4. Model Persistence
5. Train Model

### Path 3: NLP Specialist
1. NLP Sentiment Analysis
2. NLP Transformer Classifier
3. Stanford NLP Integration
4. OpenNLP Integration

### Path 4: ML Integration Expert
1. Deeplearning4j Integration
2. Smile ML Integration
3. Oracle Tribuo Integration
4. Computer Vision MLP

---

## 💡 Tips for Success

### Performance
- First execution is slow (dependency download + JIT compilation)
- Subsequent runs use cached dependencies (much faster)
- Use `-o output.jar` for repeated runs

### Development
- Start with templates and modify
- Use IDE with jbang integration for autocomplete
- Test changes incrementally

### Best Practices
- Always handle errors gracefully
- Save model checkpoints during training
- Use `eval()` mode for inference
- Batch process when possible

---

Ready to start? Pick an example above and run it with jbang!

[Back to Documentation](/docs/) · [ML SDK Guide](/docs/framework/ml-sdk) · [Jupyter Tutorial](/docs/dev-log/jupyter-jbang-integration)
