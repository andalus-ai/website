---
layout: default
title: Gollek Extensions
---

# Gollek Extensions

Gollek extensions are installable external packages that add capabilities without pushing every experiment into the core engine.

For Hugging Face style architecture and tokenizer metadata that should be packaged or detached per production build, see [Model Family Plugins](/docs/plugins/model-family-plugins). Model families are plugin-backed metadata modules inside the model farm; extensions remain the preferred shape for external OCR, quantization, training, exporter, dataset, evaluator, or pipeline packages.

## Naming Model

| Term | Meaning |
|------|---------|
| **Extension** | Installable external package. |
| **Plugin** | Low-level runtime or built-in module, such as runner, kernel, backend, or provider plumbing. |
| **Feature** | User-visible capability exposed by an extension or plugin. |
| **Adapter** | Technical SPI implementation inside an extension. |
| **Pipeline** | Inference orchestration adapter for multi-step model execution. |

This split keeps Gollek core focused on runtime, backend, model, and performance foundations while letting domain teams ship OCR, TTS, quantization, training, optimization, exporters, datasets, or evaluators independently.

## CLI

```bash
gollek extensions kinds
gollek extensions init features/gollek-ocr-lab --kind pipeline --pipeline-id ocr-lab --gollek-path gollek
gollek extensions init features/gollek-awq-lab --kind quantization --adapter-id awq-quantizer --input model --output model --target llm --format safetensors,gguf --gollek-path gollek
gollek extensions --details --paths
gollek extensions inspect path/to/extension.jar --strict
gollek extensions install path/to/extension.jar --force
gollek extensions index --output gollek-extensions.index.json
gollek extensions migrate --dry-run
gollek extensions finalize-migration --dry-run
gollek extensions prune-legacy --dry-run
gollek extensions doctor --strict --json
gollek extensions backups --json
gollek extensions rollback extension-id --dry-run
gollek extensions remove extension-id
```

`gollek features` remains a compatibility alias for `gollek extensions`.

Use `gollek modules` when you want to inspect built-in runtime modules, packaged runner plugins, kernel platform detection, and dynamic plugin status.

`gollek extensions init` defaults to `--kind pipeline`. Other kinds such as `training`, `optimization`, `quantization`, `backend`, `exporter`, `dataset`, and `evaluator` generate a `FeatureAdapter` service plus a manifest capability instead of a `ModelPipeline`.

Use `gollek extensions kinds` to list scaffold kinds, generated service type, default inputs/outputs, target hints, and copyable `init` examples. Use `gollek extensions index` to generate a manifest and service inventory for launchers, CI, or GraalVM native-image build inputs.

## Scaffold Types

Use a pipeline scaffold when the extension owns model execution flow: preprocessing, multi-session inference, tokenizer work, audio/image/document postprocessing, or model-specific orchestration.

```bash
gollek extensions init features/gollek-ocr-lab \
  --kind pipeline \
  --pipeline-id ocr-lab \
  --family ocr \
  --input image,text \
  --output text,document \
  --provider onnx \
  --format onnx \
  --gollek-path gollek
```

Pipeline scaffolds generate:

```text
META-INF/services/tech.kayys.gollek.spi.pipeline.ModelPipeline
```

Use an adapter scaffold when the extension exposes a global capability that is not itself an inference pipeline: training, optimization, quantization, backend bridges, conversion/export, datasets, evaluators, or research tooling.

```bash
gollek extensions init features/gollek-awq-lab \
  --kind quantization \
  --adapter-id awq-quantizer \
  --input model \
  --output model \
  --target llm \
  --format safetensors,gguf \
  --gollek-path gollek
```

Adapter scaffolds generate:

```text
META-INF/services/tech.kayys.gollek.spi.feature.FeatureAdapter
```

Both scaffold types write `META-INF/gollek-extension.json`, Gradle build files, a README, and compatibility metadata for `gollek extensions inspect --strict`.

Use `gollek extensions migrate --dry-run` to preview copying legacy `~/.gollek/features` jars into `~/.gollek/extensions`. Dropping `--dry-run` copies readable jars and writes the new `gollek-extensions.lock.json` file. The legacy directory is not a runtime extension path.

After migration, use `gollek extensions finalize-migration --dry-run` to preview legacy jars that are already represented by extension jars. Running it without `--dry-run` archives each matched legacy jar into a rollback backup before removing it from `~/.gollek/features`. `gollek extensions prune-legacy` remains available as the lower-level cleanup command.

`gollek extensions doctor` also checks for collisions across installed and scanned jars: extension ids, feature ids, pipeline ids, adapter ids, provider classes, and implementation classes. Collisions are warnings by default and become failures under `--strict`.

Doctor also includes a migration-only legacy status. It does not scan `~/.gollek/features` as a runtime path, but it can report whether legacy jars can be migrated or finalized with `gollek extensions migrate --dry-run` or `gollek extensions finalize-migration --dry-run`.

## Manifest

New extension jars should publish:

```text
META-INF/gollek-extension.json
```

Gollek still reads the legacy path:

```text
META-INF/gollek-feature.json
```

An extension manifest can declare pipelines, generic capabilities, and adapter-only entries:

```json
{
  "schema_version": 1,
  "id": "gollek-paddleocr",
  "name": "Gollek PaddleOCR Extension",
  "version": "0.1.0",
  "requires": {
    "gollek_spi": ">=0.1.0"
  },
  "loading": {
    "jvm": "service-loader",
    "native_image": "ahead-of-time",
    "native_image_note": "include this extension jar on the native-image build classpath"
  },
  "services": {
    "model_pipelines": ["example.PaddleOcrPipeline"],
    "feature_adapters": ["example.AwqQuantizer"]
  },
  "pipelines": [
    {
      "id": "paddleocr-vl",
      "kind": "pipeline",
      "class": "example.PaddleOcrPipeline",
      "family": "ocr",
      "formats": ["onnx"],
      "inputs": ["image", "text"],
      "outputs": ["text", "document"]
    }
  ],
  "capabilities": [
    {
      "id": "awq-quantizer",
      "kind": "quantization",
      "class": "example.AwqQuantizer",
      "formats": ["safetensors", "gguf"],
      "inputs": ["model"],
      "outputs": ["model"]
    }
  ],
  "adapters": [
    {
      "id": "metal-backend",
      "kind": "backend",
      "provider": "metal"
    }
  ]
}
```

## Runtime Paths

The runtime extension directory is:

```text
~/.gollek/extensions
```

Runtime overrides:

```bash
GOLLEK_EXTENSION_PATH=/path/to/extensions gollek run ...
java -Dgollek.extensions.path=/path/to/extensions -jar ~/.gollek/runtime/gollek.jar run ...
```

Legacy `~/.gollek/features` is only a migration input for `gollek extensions migrate`, `gollek extensions finalize-migration`, and `gollek extensions prune-legacy`. Legacy path configuration such as `GOLLEK_FEATURE_PATH` or `-Dgollek.features.path` is ignored; `gollek extensions doctor` reports it as a warning, and `--strict` treats it as a failure.

## Native and AOT

Gollek keeps two extension loading modes:

- **JVM dynamic**: extension jars in `~/.gollek/extensions`, `GOLLEK_EXTENSION_PATH`, or `gollek.extensions.path` can be loaded dynamically through ServiceLoader.
- **Native AOT**: dynamic jar loading is disabled in GraalVM native image runtime. Extension jars can still be inspected by `gollek extensions doctor`, but executable pipelines/adapters must be included on the classpath and registered ahead of time during the native build.

Doctor JSON exposes runtime loading mode, while `extensions index` writes the jar, service, capability, checksum, validation, and native-image hints needed by launchers or build scripts:

```bash
gollek extensions index --output gollek-extensions.index.json
gollek extensions index --strict --json
```

## Examples

PaddleOCR-VL is an extension because it is an external installable package. It exposes an OCR feature through a pipeline adapter.

MOSS TTS is currently implemented inside the ONNX runner path, but the same extension model can host future audio, OCR, document, video, training, or quantization capabilities without changing the core CLI contract.

An AWQ or GPTQ experiment should usually start as a quantization adapter. A LoRA trainer should usually start as a training adapter. A multi-graph OCR/VL model should start as a pipeline because it owns orchestration above a single backend call.
