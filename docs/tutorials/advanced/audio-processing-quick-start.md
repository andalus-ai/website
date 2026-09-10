---
layout: default
title: Audio Processing Quick Start
parent: Advanced Tutorials
nav_order: 39
---

# Audio Processing Quick Start

This tutorial walks through the shortest useful Gollek audio path:

1. choose Speech-to-Text or Text-to-Speech first
2. run one Java framework example
3. verify one concrete output
4. decide whether the broader framework page or the specialized runtime page is
   the next stop

See also:

- [Audio Processing Docs](/docs/framework/audio-processing-docs)
- [Audio Processing](/docs/framework/audio-processing)
- [Audio Processing Glossary](/docs/framework/audio-processing-glossary)
- [Audio Processing Examples](/docs/framework/audio-processing-examples)
- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)

## Path A: Speech-to-Text First

Use the Java framework path when you want transcription, timestamps, language
detection, or streaming work in the SDK layer:

```java
@Inject
ImprovedWhisperEngine whisperEngine;

public void transcribeAudio() {
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

    System.out.println(result.getText());
}
```

The first useful verification step is simple:

- the call returns a non-empty transcription
- the detected language or segments look reasonable for the source audio

## Path B: Text-to-Speech First

Use the Java framework path when you want preset voices, generated WAV output,
or later expansion into custom speaker embeddings:

```java
@Inject
ImprovedSpeechT5Engine ttsEngine;

public void synthesizeSpeech() throws Exception {
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
}
```

The first useful verification step is:

- `output.wav` is written successfully
- the generated speech matches the expected voice and text

## When To Use The Specialized Runtime Page

Use [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx) when:

- the local ONNX runtime path is the actual deployment target
- the operational runtime details matter more than the broader framework API
- you are not starting from the general Java STT/TTS module view

Use the framework [Audio Processing](/docs/framework/audio-processing) page
when:

- you want the broader Java SDK story
- you need STT, TTS, VAD, streaming, or format handling in one place

## Fast Decision Rule

- choose framework audio:
  when Java SDK integration is the main goal
- choose MOSS TTS ONNX:
  when the specialized local ONNX TTS runtime is the real target

## Related Docs

- [Audio Processing Docs](/docs/framework/audio-processing-docs)
- [Audio Processing](/docs/framework/audio-processing)
- [Audio Processing Glossary](/docs/framework/audio-processing-glossary)
- [Audio Processing Examples](/docs/framework/audio-processing-examples)
- [MOSS TTS ONNX](/docs/runtime/moss-tts-onnx)
