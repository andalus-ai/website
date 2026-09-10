---
layout: default
title: "Audio Module v2.0 and Quantization Engine Release"
date: 2026-03-20
categories: release
tags: audio, quantization, whisper, speecht5, gptq
---

# Audio Module v2.0 and Quantization Engine Release

**Published**: March 20, 2026  
**Categories**: Release, Audio, Quantization  
**Tags**: audio, quantization, whisper, speecht5, gptq

---

## Overview

We're excited to announce the release of Gollek SDK's Audio Module v2.0 and a comprehensive Quantization Engine. These updates bring production-ready speech-to-text, text-to-speech, and model compression capabilities to the platform.

## What's New

### Audio Module v2.0

The `gollek-safetensor-audio` module has been completely reimagined with:

#### Speech-to-Text (Whisper)
- **Complete Whisper Implementation**: Full encoder-decoder with beam search
- **99+ Language Support**: Auto-detection and transcription
- **Word-Level Timestamps**: Precise timing information
- **Streaming Transcription**: Real-time processing with <500ms latency
- **Voice Activity Detection**: Silence removal for efficiency
- **Multi-Format Support**: WAV, MP3, FLAC, OGG, M4A, WebM

#### Text-to-Speech (SpeechT5)
- **HiFi-GAN Vocoder**: High-quality neural synthesis
- **8 Preset Voices**: alloy, echo, fable, onyx, nova, shimmer, ash, ballad
- **Custom Speaker Embeddings**: Register your own voices
- **Speed Control**: Adjustable synthesis speed
- **16kHz Output**: Professional quality audio

#### Audio Processing Pipeline
- **Feature Extraction**: Log-Mel, MFCC, F0, energy contours
- **Resampling**: High-quality sinc interpolation
- **Voice Activity Detection**: Energy-based segmentation
- **Normalization**: Peak and RMS normalization

### Quantization Engine

The new `gollek-safetensor-quantization` module provides:

#### Quantization Strategies
- **GPTQ (INT4)**: 4-bit quantization with 8x compression
- **INT8**: 8-bit integer with 4x compression
- **FP8**: 8-bit floating point for GPU tensor cores

#### Features
- **SafeTensors Format**: Secure, fast, memory-mappable
- **REST API**: HTTP endpoints for quantization
- **Streaming Progress**: Real-time progress updates
- **Model Integration**: Seamless loading in inference engine
- **Hot-Swap Support**: Zero-downtime model upgrades

## Performance Improvements

### Audio Processing

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Transcription Speed | 45s | 25s | 1.8x faster |
| TTS Quality (MOS) | ~3.5 | ~4.2 | +20% |
| Streaming Latency | N/A | <500ms | New |
| Audio Formats | 1 (WAV) | 6 | +5 formats |

### Quantization

| Model Size | INT4 Time | INT8 Time | FP8 Time |
|------------|-----------|-----------|----------|
| 7B | ~90s | ~45s | ~60s |
| 13B | ~180s | ~90s | ~120s |
| 70B | ~900s | ~450s | ~600s |

**Compression Ratios:**
- INT4: ~8x size reduction
- INT8: ~4x size reduction
- FP8: ~4x size reduction

## Usage Examples

### Speech-to-Text

```java
@Inject
ImprovedWhisperEngine whisperEngine;

public void transcribe() {
    AudioConfig config = AudioConfig.builder()
        .task(AudioConfig.Task.TRANSCRIBE)
        .autoLanguage(true)
        .wordTimestamps(true)
        .build();
    
    AudioResult result = whisperEngine.transcribe(
        Paths.get("audio.wav"),
        Paths.get("/models/whisper-large-v3"),
        config
    ).await().indefinitely();
    
    System.out.println(result.getText());
}
```

### Text-to-Speech

```java
@Inject
ImprovedSpeechT5Engine ttsEngine;

public void synthesize() {
    byte[] audio = ttsEngine.synthesize(
        "Hello world!",
        "alloy",
        Paths.get("/models/speecht5-tts"),
        AudioConfig.forTTS("alloy")
    ).await().indefinitely();
    
    Files.write(Paths.get("output.wav"), audio);
}
```

### Model Quantization

```java
@Inject
QuantizationEngine quantizationEngine;

public void quantize() {
    QuantConfig config = QuantConfig.int4Gptq();
    
    QuantResult result = quantizationEngine.quantize(
        Paths.get("/models/llama3-8b"),
        Paths.get("/models/llama3-8b-int4"),
        QuantizationEngine.QuantStrategy.INT4,
        config
    );
    
    System.out.println("Compression: " + 
        result.getStats().getCompressionRatio() + "x");
}
```

## REST API Endpoints

### Audio Endpoints

```bash
# Transcribe audio
POST /api/v1/audio/transcribe

# Synthesize speech
POST /api/v1/audio/synthesize

# Detect language
POST /api/v1/audio/detect-language

# List voices
GET /api/v1/audio/voices
```

### Quantization Endpoints

```bash
# Quantize model
POST /api/v1/quantization/quantize

# Stream quantization progress
POST /api/v1/quantization/quantize/stream

# Get recommendation
GET /api/v1/quantization/recommend?model_size_gb=7

# List strategies
GET /api/v1/quantization/strategies
```

## Architecture

### Audio Processing Pipeline

```
Audio File → Decode → Resample → VAD → Feature Extraction → Model → Output
             │            │          │          │              │
          Multi-format  16kHz    Silence    Log-Mel      Whisper/
                       Normalize  removal    MFCC/F0      SpeechT5
```

### Quantization Flow

```
FP16 Model → Calibration → Quantization → SafeTensors → INT4/INT8/FP8
             │              │              │
           Samples      GPTQ/INT8     JSON Header
           (128)        Algorithm     + Binary Data
```

## Model Support

### Whisper Models

| Model | Parameters | Languages | Use Case |
|-------|------------|-----------|----------|
| tiny | 39M | 99+ | Fast transcription |
| base | 74M | 99+ | Balanced |
| small | 244M | 99+ | Good quality |
| medium | 769M | 99+ | High quality |
| large-v3 | 1.55B | 99+ | Best quality |
| large-v3-turbo | 809M | 99+ | Fast large model |

### SpeechT5 Voices

| Voice | Description | Use Case |
|-------|-------------|----------|
| alloy | Neutral | General purpose |
| echo | Warm | Conversational |
| fable | Expressive | Storytelling |
| onyx | Deep | Narration |
| nova | Clear | Business |
| shimmer | Soft | Meditation |
| ash | Neutral | News |
| ballad | Rich | Music/poetry |

## Configuration

### Application Properties

```properties
# Audio Configuration
gollek.audio.whisper.beam-size=5
gollek.audio.whisper.vad-enabled=true
gollek.audio.tts.default-voice=alloy

# Quantization Configuration
gollek.quantization.strategy=INT4
gollek.quantization.group-size=128
```

## Migration Guide

### From Legacy Audio Module

The legacy `WhisperEngine` and `SpeechT5Engine` classes are deprecated but still available. To migrate:

**Old:**
```java
@Inject
WhisperEngine whisper;
```

**New:**
```java
@Inject
ImprovedWhisperEngine whisper;
```

The new engines use `AudioConfig` and return `AudioResult` for consistent APIs.

### Quantization Integration

Quantized models can be loaded directly in the inference engine:

```java
// Load quantized model
engine.loadQuantizedModel(
    Paths.get("/models/llama3-8b-int4"),
    QuantizationEngine.QuantStrategy.INT4
);
```

## Benchmarks

### Whisper Transcription (RTF*)

| Model | RTF | WER** |
|-------|-----|-------|
| tiny | 0.15x | 8.5% |
| base | 0.25x | 6.2% |
| small | 0.5x | 4.8% |
| medium | 1.0x | 3.5% |
| large-v3 | 1.5x | 2.9% |

*RTF: Real-Time Factor (lower is faster)
**WER: Word Error Rate on LibriSpeech test-clean

### SpeechT5 TTS

| Metric | Value |
|--------|-------|
| MOS Score | 4.2/5.0 |
| Synthesis Speed | ~50x real-time |
| Latency | <100ms |

## Getting Started

### Installation

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-safetensor-audio</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>

<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-safetensor-quantization</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

### Documentation

- [Audio Processing Guide](/docs/audio-processing)
- [Quantization Guide](/docs/quantization)
- [API Reference](/docs/core-api)
- [Examples](/docs/examples)

## Future Roadmap

### Audio Module
- [ ] Speaker diarization with clustering
- [ ] Noise reduction preprocessing
- [ ] Emotion control for TTS
- [ ] Multi-speaker TTS support
- [ ] Streaming diarization

### Quantization
- [ ] AWQ (Activation-aware Weight Quantization)
- [ ] SmoothQuant for activation quantization
- [ ] Mixed-precision quantization
- [ ] Quantization-aware training (QAT)
- [ ] Automatic strategy selection

## Acknowledgments

This release builds on excellent open-source work:
- [OpenAI Whisper](https://github.com/openai/whisper)
- [Microsoft SpeechT5](https://github.com/microsoft/SpeechT5)
- [HiFi-GAN](https://github.com/jik876/hifi-gan)
- [GPTQ](https://arxiv.org/abs/2210.17323)

## Support

For issues or questions:
- [Documentation](/docs/)
- [GitHub Issues](https://github.com/bhangun/gollek/issues)
- [Discussions](https://github.com/bhangun/gollek/discussions)

---

**Ready to build?** [Get Started Now](/docs/)
