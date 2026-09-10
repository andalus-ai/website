---
layout: default
title: Audio Processing Docs
---

# Audio Processing Docs

This page groups the main Gollek audio-processing materials into one reader
path.

It is the best entrypoint if you are trying to answer one of these questions:

- how to transcribe audio with Speech-to-Text
- how to synthesize speech with Text-to-Speech
- how voice activity detection fits into the flow
- whether the Java audio path is enough or a specialized runtime page is better

See also:

- [Audio Processing](/docs/framework/audio-processing)
- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)
- [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
- [Audio Processing Glossary](/docs/framework/audio-processing-glossary)
- [Audio Processing Examples](/docs/framework/audio-processing-examples)
- [JBang Examples Catalog](/docs/setup/jbang-examples)

## Do You Want Transcription, Synthesis, Or The Specialized Runtime Path?

If you want transcription first, start with:

- [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
- the Whisper section in [Audio Processing](/docs/framework/audio-processing)

If you want synthesis first, start with:

- [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
- the SpeechT5 section in [Audio Processing](/docs/framework/audio-processing)

If you want the specialized runtime path, start with:

- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)
- [Audio Processing Examples](/docs/framework/audio-processing-examples)

Rule of thumb:

- transcription usually means the broader framework STT path
- synthesis usually starts in the framework TTS path
- the specialized runtime page is the better first stop when the ONNX local
  deployment lane is the actual target

## Which Page Should I Read?

If you want the full Java audio framework guide, start with
[Audio Processing](/docs/framework/audio-processing).

If you want the Java SDK path for transcription, TTS, VAD, and streaming, stay
on [Audio Processing](/docs/framework/audio-processing).

If you specifically want the local runtime path for MOSS TTS ONNX, jump to
[MOSS TTS ONNX](/docs/runtime/moss-tts-onnx).

## Main Surfaces

- [Audio Processing](/docs/framework/audio-processing)
  explains the Java-first STT, TTS, VAD, streaming, and format-support path.
- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)
  covers the specialized local runtime path for the ONNX-based TTS lane.
- [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
  gives the shortest first-run STT/TTS workflow.
- [Audio Processing Glossary](/docs/framework/audio-processing-glossary)
  defines the core STT, TTS, VAD, streaming, and runtime-boundary terms.
- [Audio Processing Examples](/docs/framework/audio-processing-examples)
  shows abbreviated STT result shapes, TTS output flow, and VAD expectations.
- [JBang Examples Catalog](/docs/setup/jbang-examples)
  includes runnable audio-oriented scripts for transcription, synthesis, native
  Whisper, and SIMD audio processing.

## JBang Examples

If you want runnable terminal-first examples, start with:

- `gollek/examples/jbang/multimodal/smart_transcriber.java`
- `gollek/examples/jbang/multimodal/text_to_speech.java`
- `gollek/examples/jbang/multimodal/native_whisper_stt.java`
- `gollek/examples/jbang/machine_learning/simd_audio_processing.java`

The docs entrypoint for those examples is:

- [JBang Examples Catalog](/docs/setup/jbang-examples)

Current local test status for this docs pass:

- `simd_audio_processing.java` was smoke-tested successfully
- `native_whisper_stt.java` was repaired to use the current source paths and
  was then smoke-tested successfully end to end
- `smart_transcriber.java` was repaired to use the current `gollek-ml-*`
  artifacts, forced into plain JBang mode with `//NOINTEGRATIONS`, and
  smoke-tested through its own missing-audio-file validation path
- `text_to_speech.java` was repaired to use the current `SpeechT5Engine` API,
  explicit `--model` path, and plain JBang mode with `//NOINTEGRATIONS`, and
  smoke-tested through its own missing/invalid model-path validation path

The local JBang verification also required publishing the audio-side snapshot
modules to `mavenLocal` first, including the diffusion/core snapshots that the
high-level multimodal example transitively pulls in.

## Starter Paths

### I want Speech-to-Text first

1. start with
   [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
2. use the Whisper section in [Audio Processing](/docs/framework/audio-processing)
3. move to streaming or
   language detection

### I want Text-to-Speech first

1. start with
   [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
2. use the SpeechT5 section in [Audio Processing](/docs/framework/audio-processing)
3. move to custom speaker embeddings only after the preset-voice path works

### I want the local runtime TTS path

1. start with [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)
2. use the framework audio page only when you need the broader Java SDK view

## Where Does This Live In The Repo?

| Path | Role |
|------|------|
| `docs/framework/audio-processing.md` | Main Java audio-processing guide |
| `docs/runtime/moss-tts-onnx.md` | Specialized local ONNX TTS runtime page |
| `gollek-safetensor-audio` | Audio module referenced by the framework docs |

## What’s Stable Vs Evolving?

The current stable-enough surfaces for readers and downstream users are:

- the framework audio-processing entrypoints for STT and TTS
- the documented Whisper and SpeechT5 usage patterns
- the pure-Java audio decoding story and core format support

The more likely-to-evolve areas are:

- voice presets and operational runtime packaging details
- higher-level runtime orchestration examples
- model-family-specific tuning guidance

Rule of thumb:
anchor integrations first on the documented Java framework API or the dedicated
runtime page, then treat model-specific tuning and example flows as a
higher-churn layer.

## Docs Status

Current audio-processing docs coverage includes:

- landing page and starter-path routing
- top-level intent chooser
- audio quick-start tutorial
- glossary coverage
- examples coverage
- JBang example pointers
- Java STT and TTS framework guide
- VAD and streaming coverage
- specialized MOSS TTS ONNX runtime page

Recent additions:

- audio-processing landing page
- audio-processing quick-start tutorial
- audio-processing glossary
- audio-processing examples
- audio JBang examples coverage
- top-level intent chooser

If the hub still is not enough, the fastest follow-up pages are:

- [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
- [Audio Processing Glossary](/docs/framework/audio-processing-glossary)
- [Audio Processing Examples](/docs/framework/audio-processing-examples)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
- [Audio Processing](/docs/framework/audio-processing)
- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)

## Related Docs

- [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
- [Audio Processing Glossary](/docs/framework/audio-processing-glossary)
- [Audio Processing Examples](/docs/framework/audio-processing-examples)
- [JBang Examples Catalog](/docs/setup/jbang-examples)
- [Audio Processing](/docs/framework/audio-processing)
- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)
