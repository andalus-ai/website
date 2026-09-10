---
layout: default
title: Audio Processing Examples
---

# Audio Processing Examples

This page shows the main operational shapes used across Gollek audio
processing workflows.

See also:

- [Audio Processing Docs](/docs/framework/audio-processing-docs)
- [Audio Processing](/docs/framework/audio-processing)
- [Audio Processing Glossary](/docs/framework/audio-processing-glossary)
- [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)

## Related Docs

- [Audio Processing Docs](/docs/framework/audio-processing-docs)
- [Audio Processing Quick Start](/docs/tutorials/advanced/audio-processing-quick-start)
- [Audio Processing Glossary](/docs/framework/audio-processing-glossary)
- [Audio Processing](/docs/framework/audio-processing)
- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)

## Minimal STT Java Flow

```java
Path audioPath = Paths.get("meeting.wav");
Path modelPath = Paths.get("/models/whisper-base");

AudioConfig config = AudioConfig.builder()
    .task(AudioConfig.Task.TRANSCRIBE)
    .language("en")
    .autoLanguage(true)
    .wordTimestamps(true)
    .build();

AudioResult result = whisperEngine.transcribe(audioPath, modelPath, config)
    .await().indefinitely();
```

What to notice:

- one source audio file
- one model path
- one `AudioResult` object containing text and metadata

## Minimal STT Result Shape

```text
AudioResult
  text: "Welcome to the meeting."
  language: "en"
  segments:
    [0.00 - 2.40] "Welcome to the meeting."
```

This is the smallest useful success boundary to look for:

- non-empty text
- plausible detected language
- at least one segment when timestamps are enabled

## Minimal TTS Java Flow

```java
String text = "Hello from Gollek audio processing.";
String voice = "alloy";
Path modelPath = Paths.get("/models/speecht5-tts");

AudioConfig config = AudioConfig.builder()
    .voice(voice)
    .temperature(1.0f)
    .build();

byte[] wavAudio = ttsEngine.synthesize(text, voice, modelPath, config)
    .await().indefinitely();

Files.write(Paths.get("output.wav"), wavAudio);
```

What to notice:

- the framework path returns WAV bytes
- the first operational artifact is usually `output.wav`
- the voice preset is part of the config boundary

## Minimal TTS Output Shape

```text
input text:
  "Hello from Gollek audio processing."

output artifact:
  output.wav
```

The first useful verification step is:

- the file exists
- the file plays correctly
- the generated voice matches the expected preset

## Minimal VAD-Oriented Expectation

```text
input:
  45-second recording with speech and silence

expected effect:
  speech regions kept
  long silence regions removed or segmented
```

Use this mental model when VAD is enabled:

- VAD is not the final feature by itself
- it improves downstream segmentation, transcription, and chunk handling

## Fast Operational Checklist

- STT returns text before you optimize for streaming
- TTS writes one audible WAV file before you optimize voice behavior
- VAD is treated as a support layer for segmentation and cleanup
- the framework page stays the main source when you need deeper API detail
