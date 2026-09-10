---
layout: default
title: Audio Processing - Speech-to-Text and Text-to-Speech
---

# Audio Processing

For the guided landing page that groups Speech-to-Text, Text-to-Speech, VAD,
and the specialized runtime path in one place, start with
[Audio Processing Docs](/docs/framework/audio-processing-docs).

Gollek SDK provides comprehensive audio processing capabilities including speech-to-text (STT), text-to-speech (TTS), and voice activity detection (VAD).

---

## Overview

The `gollek-safetensor-audio` module provides production-ready audio processing with:

- **Speech-to-Text**: Whisper-based transcription with 99+ language support
- **Text-to-Speech**: SpeechT5 with 8 preset voices and HiFi-GAN vocoder
- **Voice Activity Detection**: Silence removal and utterance segmentation
- **Multi-Format Support**: WAV, MP3, FLAC, OGG, M4A (Pure Java - no ffmpeg required!)
- **Streaming**: Real-time transcription with low latency

**Note:** All audio decoding is done using pure Java libraries - **no ffmpeg or native dependencies required**.

---

## Quick Start

### Speech-to-Text (Transcription)

```java
@Inject
ImprovedWhisperEngine whisperEngine;

public void transcribeAudio() {
    Path audioPath = Paths.get("meeting.wav");
    Path modelPath = Paths.get("/models/whisper-large-v3");
    
    AudioConfig config = AudioConfig.builder()
        .task(AudioConfig.Task.TRANSCRIBE)
        .language("en")
        .autoLanguage(true)
        .wordTimestamps(true)
        .build();
    
    AudioResult result = whisperEngine.transcribe(audioPath, modelPath, config)
        .await().indefinitely();
    
    System.out.println("Transcription: " + result.getText());
    System.out.println("Language: " + result.getLanguage());
    
    for (AudioSegment segment : result.getSegments()) {
        System.out.printf("[%,.2f-%,.2f] %s%n", 
            segment.getStart(), segment.getEnd(), segment.getText());
    }
}
```

### Text-to-Speech (Synthesis)

```java
@Inject
ImprovedSpeechT5Engine ttsEngine;

public void synthesizeSpeech() {
    String text = "Hello, welcome to the Gollek audio platform.";
    String voice = "alloy";
    Path modelPath = Paths.get("/models/speecht5-tts");
    
    AudioConfig config = AudioConfig.builder()
        .voice(voice)
        .temperature(1.0f)
        .build();
    
    byte[] wavAudio = ttsEngine.synthesize(text, voice, modelPath, config)
        .await().indefinitely();
    
    Files.write(Paths.get("output.wav"), wavAudio);
}
```

---

## Speech-to-Text (Whisper)

### Supported Models

| Model | Parameters | Languages | Context | Use Case |
|-------|------------|-----------|---------|----------|
| **tiny** | 39M | 99+ | 30s | Fast transcription, testing |
| **base** | 74M | 99+ | 30s | Balanced speed/quality |
| **small** | 244M | 99+ | 30s | Good quality/speed |
| **medium** | 769M | 99+ | 30s | High quality |
| **large-v3** | 1.55B | 99+ | 30s | Best quality |
| **large-v3-turbo** | 809M | 99+ | 30s | Fast large model |

### Configuration Options

```java
AudioConfig config = AudioConfig.builder()
    .task(AudioConfig.Task.TRANSCRIBE)      // or TRANSLATE
    .sampleRate(16000)                       // Audio sample rate
    .channels(1)                             // Mono audio
    .language("en")                          // ISO-639-1 code
    .autoLanguage(true)                      // Auto-detect language
    .wordTimestamps(true)                    // Word-level timestamps
    .beamSize(5)                             // Beam search width
    .temperature(0.0f)                       // Sampling temperature
    .chunkDurationSec(30)                    // Chunk size
    .vadEnabled(true)                        // Voice activity detection
    .build();
```

### Streaming Transcription

```java
@Inject
ImprovedWhisperEngine whisperEngine;

public void streamTranscription() {
    Multi<byte[]> audioStream = getAudioStream(); // Your audio source
    
    AudioConfig config = AudioConfig.forTranscription();
    Path modelPath = Paths.get("/models/whisper-base");
    
    whisperEngine.transcribeStream(audioStream, modelPath, config)
        .subscribe().with(
            result -> System.out.println("Partial: " + result.getText()),
            error -> System.err.println("Error: " + error.getMessage())
        );
}
```

### Language Detection

```java
public void detectLanguage() {
    Path audioPath = Paths.get("unknown.wav");
    Path modelPath = Paths.get("/models/whisper-base");
    
    String language = whisperEngine.detectLanguage(audioPath, modelPath)
        .await().indefinitely();
    
    System.out.println("Detected: " + language);
}
```

---

## Text-to-Speech (SpeechT5)

### Available Voices

| Voice | Description | Use Case |
|-------|-------------|----------|
| **alloy** | Neutral, balanced | General purpose |
| **echo** | Warm, friendly | Conversational |
| **fable** | Expressive, dynamic | Storytelling |
| **onyx** | Deep, authoritative | Narration |
| **nova** | Clear, professional | Business |
| **shimmer** | Soft, gentle | Meditation |
| **ash** | Neutral, calm | News reading |
| **ballad** | Rich, melodic | Music/poetry |

### Configuration Options

```java
AudioConfig config = AudioConfig.builder()
    .voice("alloy")                // Voice name
    .temperature(1.0f)             // Speed multiplier (0.5-2.0)
    .sampleRate(16000)             // Output sample rate
    .channels(1)                   // Mono output
    .bitsPerSample(16)             // 16-bit audio
    .format(AudioConfig.Format.WAV) // Output format
    .build();
```

### Custom Speaker Embeddings

```java
@Inject
ImprovedSpeechT5Engine ttsEngine;

public void registerCustomVoice() {
    // Load or generate 512-dimensional speaker embedding
    float[] embedding = loadSpeakerEmbedding("path/to/embedding.npy");
    
    ttsEngine.registerSpeaker("my_custom_voice", embedding);
    
    // Use custom voice
    byte[] audio = ttsEngine.synthesize(
        "Hello with my custom voice!",
        "my_custom_voice",
        modelPath,
        config
    ).await().indefinitely();
}

private float[] loadSpeakerEmbedding(String path) {
    // Load from .npy file or generate
    return new float[512]; // Placeholder
}
```

---

## Audio Processing Pipeline

### Feature Extraction

```java
AudioFeatureExtractor extractor = new AudioFeatureExtractor();

// Log-Mel spectrogram (80 mel bins)
float[][] melSpec = extractor.extractLogMelSpectrogram(pcm);

// MFCC features (13 cepstral coefficients)
float[][] mfcc = extractor.extractMFCC(pcm, 13);

// F0 (fundamental frequency)
float[] f0 = extractor.extractF0(pcm, 16000, 80f, 400f);

// Energy contour
float[] energy = extractor.extractEnergy(pcm);
```

### Voice Activity Detection (VAD)

```java
VoiceActivityDetector vad = new VoiceActivityDetector(16000);

// Detect speech segments
List<int[]> segments = vad.detectVoiceActivity(pcm);

// Remove silence
float[] speech = vad.removeSilence(pcm);

// Split into utterances
List<float[]> utterances = vad.splitIntoUtterances(pcm);

// Get speech ratio (percentage of audio that is speech)
float ratio = vad.getSpeechRatio(pcm); // 0.0 to 1.0
```

### Audio Resampling

```java
// Resample from 44.1kHz to 16kHz
AudioResampler resampler = new AudioResampler(44100, 16000);
float[] resampled = resampler.resample(audio44k);

// Convert formats
float[] float32 = AudioResampler.int16ToFloat32(int16Data);
short[] int16 = AudioResampler.float32ToInt16(float32Data);

// Normalize
float[] normalized = AudioResampler.normalize(audio);
float[] normalizedToLevel = AudioResampler.normalizeToLevel(audio, 0.9f);
```

---

## REST API

### Transcribe Audio

```bash
curl -X POST http://localhost:8080/api/v1/audio/transcribe \
  -F "audioFile=@meeting.wav" \
  -F "language=en" \
  -F "task=transcribe"
```

**Response:**
```json
{
  "type": "TRANSCRIPTION",
  "text": "Hello, welcome to our meeting.",
  "language": "en",
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 3.5,
      "text": "Hello, welcome to our meeting.",
      "confidence": 0.95
    }
  ],
  "audioDurationSec": 3.5,
  "durationMs": 1250,
  "confidence": 0.95,
  "success": true
}
```

### Synthesize Speech

```bash
curl -X POST http://localhost:8080/api/v1/audio/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "voice": "alloy",
    "speed": 1.0
  }' \
  --output speech.wav
```

### Detect Language

```bash
curl -X POST http://localhost:8080/api/v1/audio/detect-language \
  -F "audioFile=@unknown.wav"
```

**Response:**
```json
{
  "language": "es"
}
```

### List Voices

```bash
curl http://localhost:8080/api/v1/audio/voices
```

**Response:**
```json
{
  "voices": ["alloy", "echo", "fable", "onyx", "nova", "shimmer", "ash", "ballad"]
}
```

---

## Performance Benchmarks

### Whisper Transcription

| Model | Size | RTF* | WER** |
|-------|------|------|-------|
| tiny | 39M | 0.15x | 8.5% |
| base | 74M | 0.25x | 6.2% |
| small | 244M | 0.5x | 4.8% |
| medium | 769M | 1.0x | 3.5% |
| large-v3 | 1.55B | 1.5x | 2.9% |

*RTF: Real-Time Factor (lower is faster)
**WER: Word Error Rate on LibriSpeech test-clean (lower is better)

### SpeechT5 TTS

| Metric | Value |
|--------|-------|
| Synthesis Speed | ~50x real-time |
| MOS* | 4.2/5.0 |
| Latency (first token) | <100ms |
| Output Quality | 16kHz, 16-bit |

*MOS: Mean Opinion Score

---

## Configuration

### Application Properties

```properties
# Whisper configuration
gollek.audio.whisper.beam-size=5
gollek.audio.whisper.temperature=0.0
gollek.audio.whisper.language=en
gollek.audio.whisper.task=transcribe
gollek.audio.whisper.vad-enabled=true

# SpeechT5 configuration
gollek.audio.tts.default-voice=alloy
gollek.audio.tts.speed=1.0
```

### Environment Variables

```bash
# Model paths
export GOLLEK_WHISPER_MODEL_PATH=/models/whisper-large-v3
export GOLLEK_SPEECHT5_MODEL_PATH=/models/speecht5-tts

# API keys (if using cloud providers)
export OPENAI_API_KEY=sk-...
```

---

## Troubleshooting

### Common Issues

**"Cannot load Whisper model"**
- Ensure model path points to valid SafeTensors checkpoint
- Check model files have correct permissions
- Verify model was downloaded completely

**Poor transcription quality**
- Use larger model (medium or large-v3)
- Ensure audio is 16kHz mono
- Enable VAD to remove silence
- Check audio quality (avoid noisy recordings)

**TTS sounds robotic**
- Verify HiFi-GAN weights are loaded
- Try different voice presets
- Check speaker embedding normalization
- Ensure mel spectrogram is properly scaled

**Out of memory during transcription**
- Reduce chunk duration (default: 30s)
- Use smaller model
- Enable VAD to process only speech segments
- Process audio in smaller batches

---

## Examples

### Transcribe Meeting Recording

```java
public void transcribeMeeting() {
    Path audioPath = Paths.get("meeting-recording.wav");
    Path modelPath = Paths.get("/models/whisper-large-v3");
    
    AudioConfig config = AudioConfig.builder()
        .task(AudioConfig.Task.TRANSCRIBE)
        .autoLanguage(true)
        .wordTimestamps(true)
        .vadEnabled(true)
        .build();
    
    AudioResult result = whisperEngine.transcribe(audioPath, modelPath, config)
        .await().indefinitely();
    
    // Save transcription to file
    Files.writeString(
        Paths.get("meeting-transcript.txt"),
        result.getText()
    );
    
    // Save segments with timestamps
    StringBuilder sb = new StringBuilder();
    for (AudioSegment segment : result.getSegments()) {
        sb.append(String.format("[%,.2f-%,.2f] %s: %s%n",
            segment.getStart(),
            segment.getEnd(),
            segment.getSpeaker(),
            segment.getText()));
    }
    Files.writeString(
        Paths.get("meeting-segments.txt"),
        sb.toString()
    );
}
```

### Create Audiobook

```java
public void createAudiobook() {
    String text = Files.readString(Paths.get("book-chapter-1.txt"));
    Path modelPath = Paths.get("/models/speecht5-tts");
    
    // Split into sentences
    List<String> sentences = Arrays.asList(text.split("(?<=[.!?])\\s+"));
    
    List<byte[]> audioChunks = new ArrayList<>();
    for (String sentence : sentences) {
        byte[] audio = ttsEngine.synthesize(
            sentence.trim(),
            "onyx",  // Deep voice for narration
            modelPath,
            AudioConfig.forTTS("onyx")
        ).await().indefinitely();
        
        audioChunks.add(audio);
    }
    
    // Concatenate audio chunks
    byte[] fullAudio = concatenateWav(audioChunks);
    Files.write(Paths.get("audiobook-chapter-1.wav"), fullAudio);
}

private byte[] concatenateWav(List<byte[]> wavChunks) {
    // Remove WAV headers and concatenate PCM data
    // Implementation depends on your needs
    return new byte[0]; // Placeholder
}
```

---

## Next Steps

- [Quantization Docs](/docs/framework/quantization-docs) - Model compression with GPTQ/FP8
- [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs) - Hardware acceleration
- [Cloud Provider Docs](/docs/runtime/cloud-provider-docs) - Cloud audio APIs
- [Examples Docs](/docs/setup/examples-docs) - More example routes and runnable entrypoints

---

[Back to Docs](/docs/) &nbsp; [Runtime Core API](/docs/runtime/core-api)
