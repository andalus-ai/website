---
layout: default
title: Audio Processing Glossary
---

# Audio Processing Glossary

This page defines the main terms used across Gollek's audio-processing docs.

See also:

- [Audio Processing Docs](/docs/framework/audio-processing-docs)
- [Audio Processing](/docs/framework/audio-processing)
- [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
- [Audio Processing Examples](/docs/framework/audio-processing-examples)
- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)

## Core Terms

**audio processing**
: The broader Java SDK lane for Speech-to-Text, Text-to-Speech, VAD, feature
  extraction, and audio format handling.

**Speech-to-Text (STT)**
: Converting audio input into text.

**Text-to-Speech (TTS)**
: Converting text input into synthesized speech audio.

**Voice Activity Detection (VAD)**
: Detecting speech versus silence so long recordings can be segmented or quiet
  stretches can be removed.

## Speech-to-Text Terms

**Whisper**
: The model family used in the framework audio docs for transcription,
  translation, language detection, and streaming STT work.

**transcription**
: Turning spoken audio into text in the source language.

**translation**
: Turning spoken audio into text in a target language instead of preserving the
  original spoken language.

**word timestamps**
: Time alignment metadata for individual words or fine-grained text spans.

**language detection**
: Automatically determining which language is present in the input audio.

## Text-to-Speech Terms

**SpeechT5**
: The TTS model family used in the framework audio docs for Java-first speech
  synthesis.

**voice preset**
: A named built-in voice profile such as `alloy` or `nova`.

**speaker embedding**
: A numeric representation of a speaker identity or voice style used to drive
  custom-voice synthesis.

**vocoder**
: The component that converts intermediate speech features into audible waveform
  output.

## Streaming And Format Terms

**streaming transcription**
: Receiving partial or progressive STT results while audio is still arriving or
  being processed.

**sample rate**
: How many audio samples are represented per second.

**channels**
: The number of parallel audio channels, such as mono or stereo.

**PCM**
: Raw pulse-code modulation audio samples before container formatting such as
  WAV or other wrappers.

**WAV output**
: A common first output artifact for synthesized speech in the framework audio
  path.

## Integration Terms

**ImprovedWhisperEngine**
: The Java framework entrypoint used for STT-oriented audio tasks.

**ImprovedSpeechT5Engine**
: The Java framework entrypoint used for TTS-oriented audio tasks.

**AudioConfig**
: The main Java configuration object used to select STT/TTS task options,
  voices, timestamps, and related audio-processing behavior.

**AudioResult**
: The result object returned from STT flows, containing text, language, and
  segment data.

## Runtime Boundary Terms

**Java framework path**
: The broader SDK-oriented lane used when STT, TTS, VAD, streaming, and audio
  processing all belong to application code.

**MOSS TTS ONNX**
: The specialized local runtime page for the ONNX-based TTS deployment lane.

**specialized runtime path**
: A narrower operational or deployment-oriented path used when the runtime page
  matters more than the broader framework API story.
