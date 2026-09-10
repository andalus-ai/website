---
layout: default
title: Recursive Reasoning Workflow
parent: Advanced Tutorials
nav_order: 36
---

# Recursive Reasoning Workflow

This tutorial walks through the shortest useful recursive-reasoning terminal
workflow:

1. run one GRAM-style recursive-reasoning demo
2. inspect one `recursive-reasoning-report.json`
3. compare two reports directly
4. export and reopen a saved compare result
5. export and reopen a reusable compare bundle
6. run the one-command workflow wrapper

See also:

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
- [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary)
- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)
- [JBang Examples Catalog](/docs/setup/jbang-examples)

## Recommended Local Layout

Keep single-report and comparison artifacts in predictable directories:

```text
artifacts/
  recursive-reasoning-demo/
  recursive-reasoning-baseline/
  recursive-reasoning-current/
  recursive-reasoning-compare-result.json
  recursive-reasoning-compare-bundle/
```

That layout makes it easier to keep one-report inspection separate from
baseline-vs-current compare work.

## Step 1: Produce One Recursive-Reasoning Report

Start with the smallest runnable recursive-reasoning flow:

```bash
jbang trainer/trainer_recursive_reasoning_demo.java \
  sudoku-demo \
  artifacts/recursive-reasoning-demo
```

That demo materializes the main one-run artifact:

- `recursive-reasoning-report.json`

## Step 2: Inspect One Report

Use the single-report inspector first, because it is the smallest stable
entrypoint for one recursive-reasoning run.

Overview and compact CI view:

```bash
jbang trainer/trainer_recursive_reasoning_inspector.java \
  artifacts/recursive-reasoning-demo \
  overview

jbang trainer/trainer_recursive_reasoning_inspector.java \
  artifacts/recursive-reasoning-demo \
  overview:ci
```

Focused selectors:

```bash
jbang trainer/trainer_recursive_reasoning_inspector.java \
  artifacts/recursive-reasoning-demo \
  selectedRewardScore

jbang trainer/trainer_recursive_reasoning_inspector.java \
  artifacts/recursive-reasoning-demo \
  summary json
```

Use this phase when you only care about one run's selected trajectory, reward,
and compact rollout summary.

## Step 3: Compare Two Reports Directly

Once you have a baseline report and a current report, use the compare
inspector as the shortest direct two-report path.

```bash
jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-baseline \
  artifacts/recursive-reasoning-current \
  overview

jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-baseline \
  artifacts/recursive-reasoning-current \
  comparison:ci

jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-baseline \
  artifacts/recursive-reasoning-current \
  delta:selectedRewardScore
```

That gives you:

- one compact two-report overview
- one direct comparison view
- one scalar reward delta

## Step 4: Export And Reopen A Saved Compare Result

Once the direct compare looks useful, export a compact saved result:

```bash
jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-baseline \
  artifacts/recursive-reasoning-current \
  result=standard json artifacts/recursive-reasoning-compare-result.json
```

Then reopen it:

```bash
jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-compare-result.json \
  resultSummary

jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-compare-result.json \
  resultHealth:ci
```

This is the reusable single-file artifact path for compare-side inspection and
sharing.

## Step 5: Export And Reopen A Compare Bundle

If you want a small multi-file compare package, export a bundle:

```bash
jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-baseline \
  artifacts/recursive-reasoning-current \
  bundle=standard json artifacts/recursive-reasoning-compare-bundle
```

Then reopen it with compact bundle selectors:

```bash
jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-compare-bundle \
  bundleSummary

jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-compare-bundle \
  bundleHealth:ci

jbang trainer/trainer_recursive_reasoning_compare_inspector.java \
  artifacts/recursive-reasoning-compare-bundle \
  loadfile:comparison json
```

This is the reusable artifact path when you want separate manifest, overview,
comparison, health, and summary payloads.

## Step 6: Run The One-Command Workflow

If you want the whole baseline/current/result/bundle flow in one command, use:

```bash
./trainer/run_recursive_reasoning_workflow.sh \
  full \
  /tmp/recursive-reasoning
```

That workflow:

- runs the baseline recursive-reasoning demo
- synthesizes a changed current report
- exports a saved compare result
- exports a compare bundle
- prints the exact follow-up inspector commands for every artifact it created

## Next Step

After this tutorial, the best next place to keep nearby is:

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)

Use that page as the stable hub for repo locations, main surfaces, and the
current workflow status of this new training family.

## Related Docs

- [Recursive Reasoning Docs](/docs/framework/recursive-reasoning-docs)
- [Recursive Reasoning Dataset Workflow](/docs/tutorials/advanced/recursive-reasoning-dataset-workflow)
- [Recursive Reasoning Dataset API](/docs/framework/recursive-reasoning-dataset-api)
- [Recursive Reasoning Glossary](/docs/framework/recursive-reasoning-glossary)
- [Recursive Reasoning Artifact Examples](/docs/framework/recursive-reasoning-artifact-examples)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
