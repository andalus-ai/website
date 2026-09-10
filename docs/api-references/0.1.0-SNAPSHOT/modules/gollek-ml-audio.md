---
layout: default
title: gollek-ml-audio
parent: API REferences
nav_order: 110
---

# gollek-ml-audio

The `gollek-ml-audio` module provides essential signal processing tools and feature extraction algorithms for audio-based machine learning tasks. It is designed to transform raw waveforms into spectral representations suitable for neural network input.

## 🌟 Overview

Audio signals are complex time-series data. To be processed by most deep learning models, they must be converted into frequency-domain representations. This module provides high-performance implementations of the Short-Time Fourier Transform (STFT) and Mel-Spectrogram extraction.

## 🚀 Key Features

- **Spectral Transformation**: High-speed implementation of STFT (Short-Time Fourier Transform).
- **Mel-Scale Processing**: Conversion of spectrograms to Mel-Spectrograms, optimized for human speech and music perception.
- **Audio Buffering**: Specialized `AudioBuffer` for managing multi-channel audio data.
- **Windowing Functions**: Built-in support for Hann, Hamming, and Blackman windows.
- **Hardware Acceleration**: Computationally intensive signal processing tasks are accelerated via the underlying Gollek kernels.

## 📦 Installation

Add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-ml-audio</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 🛠️ Usage Examples

### Extracting a Mel-Spectrogram

```java
import tech.kayys.gollek.ml.audio.AudioBuffer;
import tech.kayys.gollek.ml.audio.MelSpectrogram;
import tech.kayys.gollek.ml.tensor.Tensor;

// Create audio buffer from raw samples
float[] samples = loadAudioSamples("audio.wav");
AudioBuffer buffer = new AudioBuffer(samples, 16000); // 16kHz mono

// Configure Mel-Spectrogram extractor
MelSpectrogram melExtractor = MelSpectrogram.builder()
    .sampleRate(16000)
    .nFft(1024)
    .nMels(80)
    .hopLength(512)
    .build();

// Convert to spectral representation
Tensor spectrogram = melExtractor.forward(buffer.toTensor());
```

### Performing STFT

```java
import tech.kayys.gollek.ml.audio.STFT;

STFT stft = new STFT(1024, 512, "hann");
Tensor complexSpectrogram = stft.forward(buffer.toTensor());
```

## 📖 API Highlights

### `tech.kayys.gollek.ml.audio.MelSpectrogram`

Transfers audio signals into a log-Mel spectrogram.

| Method | Description |
|:-------|:------------|
| `builder()` | Returns a builder for configuring the Mel extraction parameters. |
| `forward(Tensor waveform)` | Transforms a raw waveform tensor into a Mel-spectrogram tensor. |
| `getMelFilterBank()` | Returns the computed Mel filter bank as a raw tensor for inspection. |

### `tech.kayys.gollek.ml.audio.STFT`

Computes the Short-Time Fourier Transform.

- `forward(Tensor waveform)`: Returns a complex-valued tensor (magnitude and phase or real/imaginary).
- `inverse(Tensor spectrogram)`: Performs the Inverse STFT to reconstruct the waveform.

### `tech.kayys.gollek.ml.audio.AudioBuffer`

A utility for managing raw audio data.

- `toTensor()`: Converts internal buffer to a normalized float tensor.
- `resample(int newRate)`: Basic resampling utility.

---

[Back to API Hub](../)
