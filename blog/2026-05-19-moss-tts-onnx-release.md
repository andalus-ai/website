---
layout: default
title: "MOSS TTS ONNX - Local Voice Generation in Gollek"
date: 2026-05-19
categories: release runtime
tags: [cli, onnx, audio, tts, runtime]
description: "Gollek now supports local MOSS TTS Nano ONNX voice generation with companion codec orchestration, voice selectors, Suling WAV/FLAC/MP3 output, live preview, and audio-native performance metrics."
excerpt: "Gollek now supports local MOSS TTS Nano ONNX voice generation with companion codec orchestration, voice selectors, Suling WAV/FLAC/MP3 output, live preview, and audio-native performance metrics."
---

# MOSS TTS ONNX - Local Voice Generation in Gollek

Gollek now supports local text-to-speech generation with the OpenMOSS MOSS TTS Nano ONNX model. The new runner wires the multi-session audio pipeline end to end: text tokenization, TTS prefill, decode-step generation, local frame sampling, companion codec decode, Suling audio encoding, and streaming output.

## What Changed

- Local MOSS TTS Nano ONNX generation through `gollek run`
- Companion MOSS Audio Tokenizer discovery and optional automatic pull
- Builtin voice listing through `--list-voices`
- Named voice selection with `--voice "en Trump"`
- Separate selector flags with `--voice-lang` and `--voice-gender`
- WAV, FLAC, and MP3 output through Suling, with MP3 backed by the FFmpeg FFM bridge and `libmp3lame`
- Audio quality presets: `compact`, `speech`, `balanced`, `high`, and `lossless`
- Automatic duplicate-channel cleanup, speech polish, peak normalization, gain, fades, and manual channel modes
- Streaming progress, encoded audio chunks, and optional live PCM preview through `--live-audio`
- Prompt, voice, model, seed, stop reason, format, channel, bitrate, and processing metadata
- Audio-native metrics: audio duration, generation duration, realtime speed, RTF, and frames per second

## Quick Start

```bash
gollek pull OpenMOSS-Team/MOSS-TTS-Nano-100M-ONNX
```

```bash
gollek run --model 71e8f7 \
  --prompt "apa kabar dunia" \
  --voice "en Trump" \
  --audio-quality balanced \
  --output ~/Downloads/tes-onnx-id.mp3
```

For lossless output:

```bash
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice "en Trump" \
  --audio-quality lossless \
  --output ~/Downloads/hello.flac
```

For local preview while the file is being generated:

```bash
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice "en Trump" \
  --live-audio \
  --output ~/Downloads/hello.mp3
```

Voice presets can be inspected without generating audio:

```bash
gollek run --model 71e8f7 --list-voices
```

## Voice Selection

The selector is strict enough to avoid surprising fallbacks while still being convenient:

- `--voice "en Trump"` selects the `EN Trump` preset when present.
- `--voice-lang en --voice-gender Trump` is equivalent to `--voice "en Trump"`.
- `--voice-lang en --voice-gender female` selects an English female preset.
- `--voice "jp male"` reports a clear error when no Japanese male preset is available.
- Unknown terms list valid choices for the requested language.

## Output

ONNX TTS writes real audio files in the requested format. Output extension detection works, and you can override the result with `--audio-format`, `--audio-quality`, `--audio-bitrate`, or `--flac-compression`.

A successful run reports both artifact details and synthesis metrics:

```text
Audio details: 2.08s, 48000 Hz, 1ch, 26 frames, 128 kbps, voice EN Trump, seed 1234, mono collapsed, polished peak
[Audio: 2.08s, Generation: 2.91s, Speed: 0.71x realtime, RTF: 1.40, Synthesis: 8.9 frames/s]
```

This makes the CLI output fit the modality: audio runs no longer report token-per-second stats.

## Learn More

- [MOSS TTS ONNX Runtime Guide](/docs/runtime/moss-tts-onnx)
- [CLI Reference](/docs/setup/cli-reference)
- [Features](/features/)
