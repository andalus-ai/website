---
layout: default
title: MOSS TTS ONNX Runtime
---

# MOSS TTS ONNX Runtime

Gollek can run the OpenMOSS MOSS TTS Nano ONNX model locally and write speech output as WAV, plus FLAC or MP3 when the external Suling audio extension is attached. The implementation is a real multi-session pipeline, not a single graph wrapper: Gollek orchestrates text tokenization, TTS prefill, decode-step generation, local frame sampling, companion codec decode, optional Suling audio encoding, streaming events, and metadata reporting.

---

## Quick Start

Pull the TTS model:

```bash
gollek pull OpenMOSS-Team/MOSS-TTS-Nano-100M-ONNX
```

Generate audio with a named voice:

```bash
gollek run --model 71e8f7 \
  --prompt "apa kabar dunia" \
  --voice "en Trump" \
  --audio-quality balanced \
  --output ~/Downloads/tes-onnx-id.mp3
```

Use separate selector flags:

```bash
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice-lang en \
  --voice-gender female \
  --audio-quality lossless \
  --output hello.flac
```

Preview decoded PCM while generating the final file:

```bash
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice "en Trump" \
  --live-audio \
  --output hello.mp3
```

List voices without generating audio:

```bash
gollek run --model 71e8f7 --list-voices
```

If your build reports the Suling fallback or a detached audio extension, use WAV output for smoke tests:

```bash
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice "en Trump" \
  --output hello.wav
```

---

## Companion Codec

MOSS TTS requires the companion codec repository:

```text
OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano-ONNX
```

Gollek resolves the codec from the local model index. If it is missing, the CLI can automatically pull it unless automatic codec pulls are disabled:

```bash
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice-lang en \
  --voice-gender Trump \
  --no-tts-auto-codec
```

You can also pass a codec explicitly:

```bash
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice "en Trump" \
  --tts-codec OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano-ONNX \
  --output hello.mp3
```

---

## Optimized Graph Cache

MOSS TTS can use up to five ONNX Runtime sessions: TTS prefill, TTS decode, local frame sampling, codec full decode, and codec streaming decode. Gollek opens the codec sessions lazily, so a normal run only loads the decode path it actually uses. Gollek caches ORT-optimized graph files for opened sessions so repeated CLI runs can skip most graph optimization work.

Long-lived JVM processes also keep small in-process caches for MOSS sessions and model assets. The first request for a model reports `onnx sessions warmed` and `onnx assets warmed`; later requests for the same model, codec, graph mtimes, CPU architecture, and thread count report `onnx sessions hot` and `onnx assets hot`. Cached sessions are serialized per model for predictable reuse and are closed during provider shutdown. Cached assets cover the MOSS manifest, ONNX metadata JSON, and SentencePiece tokenizer.

The default cache root is:

```text
~/.gollek/cache/onnx/optimized/moss-tts
```

The cache key includes the source graph path, size, modified time, matching ONNX external `.data` sidecars, OS, CPU architecture, and optimization mode. External data sidecars are hard-linked into the cache directory when possible, then copied as a fallback.

The CLI reports cache behavior in `Audio details`, for example `onnx cache 0/4 hit (4 built)` on a fresh normal run and `onnx cache 4/4 hit` on a warm run. Live PCM plus final full decode may open both codec graphs and report up to five sessions. The same counters are included in audio metadata sidecars.

Use `gollek run --model <moss-tts-id> --tts-diagnostics` to inspect the cache root, warm/cold optimized graph files, cache directory size, current, stale, unrelated, and orphan optimized cache inventory, session cache settings, asset cache settings, companion codec status, available voices, and Suling audio-extension state without generating audio.

Use `gollek run --model <moss-tts-id> --tts-warmup` to load MOSS model assets, open all five ONNX sessions, and create or reuse optimized graph cache files without generating audio. This is useful before a demo, benchmark, or long-lived service workload.

Use `gollek run --model <moss-tts-id> --tts-cache-prune` to preview deletion of stale optimized graph files for the resolved MOSS TTS model. Prune only targets stale files that match the resolved model's graph filename families; unrelated optimized graph files in the same cache root are listed separately and left alone. External `.data` sidecars are pruned only when removing stale graphs would leave no current or unrelated optimized graph in the cache root. Diagnostics and prune JSON include `external_data_sidecar_prune_policy`, `pruneable_external_data_sidecar_*`, and `retained_external_data_sidecar_*` fields so scripts can see why sidecars will be deleted or retained. Add `--tts-cache-prune-apply` only when you want Gollek to delete those stale optimized graph files and safe orphan sidecars.

Diagnostics, warmup, and prune support `--json` for automation:

```bash
gollek run --model <moss-tts-id> --tts-diagnostics --json
gollek run --model <moss-tts-id> --tts-warmup --json
gollek run --model <moss-tts-id> --tts-cache-prune --json
```

Controls:

```bash
GOLLEK_ONNX_OPTIMIZED_MODEL_CACHE=false gollek run ...
GOLLEK_ONNX_OPTIMIZED_MODEL_CACHE_DIR=/path/to/cache gollek run ...
GOLLEK_ONNX_MOSS_TTS_SESSION_CACHE=false gollek run ...
GOLLEK_ONNX_MOSS_TTS_SESSION_CACHE_MAX_ENTRIES=4 gollek run ...
GOLLEK_ONNX_MOSS_TTS_ASSET_CACHE=false gollek run ...
GOLLEK_ONNX_MOSS_TTS_ASSET_CACHE_MAX_ENTRIES=8 gollek run ...
GOLLEK_ONNX_LOG_LEVEL=warning gollek run ...
java -Dgollek.onnx.optimized-model-cache.enabled=false -jar ~/.gollek/runtime/gollek.jar run ...
java -Dgollek.onnx.optimized-model-cache.dir=/path/to/cache -jar ~/.gollek/runtime/gollek.jar run ...
java -Dgollek.onnx.moss-tts.session-cache.enabled=false -jar ~/.gollek/runtime/gollek.jar run ...
java -Dgollek.onnx.moss-tts.session-cache.max-entries=4 -jar ~/.gollek/runtime/gollek.jar run ...
java -Dgollek.onnx.moss-tts.asset-cache.enabled=false -jar ~/.gollek/runtime/gollek.jar run ...
java -Dgollek.onnx.moss-tts.asset-cache.max-entries=8 -jar ~/.gollek/runtime/gollek.jar run ...
java -Dgollek.onnx.log-level=warning -jar ~/.gollek/runtime/gollek.jar run ...
```

MOSS TTS defaults ONNX Runtime native logging to `error`, which keeps JSON diagnostics and warmup output parseable while still surfacing ORT failures. Set `GOLLEK_ONNX_LOG_LEVEL=warning` or `-Dgollek.onnx.log-level=warning` when you want ORT native warnings during cache debugging.

---

## Voice Selection

Gollek supports exact voice names, fuzzy unique display-name matches, language aliases, and language/gender selectors.

| Command | Behavior |
|---------|----------|
| `--voice "en Trump"` | Selects the `EN Trump` preset when present |
| `--voice bitter` | Selects a unique display-name match such as `EN The Bitter Lesson` |
| `--voice-lang en --voice-gender Trump` | Combines to the same selector as `--voice "en Trump"` |
| `--voice-lang en --voice-gender female` | Selects an English female preset |
| `--voice jp female` | Selects a Japanese female preset |
| `--voice auto` | Picks a voice from the prompt language when possible |
| `--voice default` | Uses the first builtin preset |

Unknown selector terms fail clearly instead of silently falling back. For example, a fake selector such as `--voice "en zzznotavoice"` reports the unknown term and lists available English voices.

---

## Formats and Quality

Gollek routes TTS PCM through Suling, the local codec-neutral audio adapter:

- WAV works in the packaged fallback and in the external Suling extension.
- FLAC requires the external Suling module with the libFLAC FFM backend.
- MP3 requires the external Suling module with the FFmpeg FFM bridge and `libmp3lame`.

Check the active adapter before relying on FLAC or MP3 in automation:

```bash
gollek modules --json | jq '.extensionAvailability.byId.suling'
gollek modules --json | jq '.audioExtensions.suling'
gollek run --model <moss-tts-id> --tts-diagnostics --json | jq '.suling'
```

`status=fallback` means Gollek has a healthy WAV-only adapter. `productionReady=true` in `gollek modules`
or `production_ready=true` in TTS diagnostics means the external non-fallback Suling module is attached and
suitable for production audio formats.

| Preset | Format | Default Encoding | Use Case |
|--------|--------|------------------|----------|
| `compact` | MP3 | 64 kbps | Small files and quick sharing |
| `speech` | MP3 | 96 kbps | Spoken-word drafts |
| `balanced` | MP3 | 128 kbps | General-purpose output |
| `high` | MP3 | 192 kbps | Higher-quality lossy output |
| `lossless` | FLAC | Compression level 8 | Archival or post-processing |

The output extension, `--audio-format`, and `--audio-quality` all participate in format selection:

```bash
gollek run --model 71e8f7 --prompt "hello" --voice "en Trump" --output hello.wav
gollek run --model 71e8f7 --prompt "hello" --voice "en Trump" --audio-quality compact --output hello.mp3
gollek run --model 71e8f7 --prompt "hello" --voice "en Trump" --audio-format flac --flac-compression 8 --output hello.flac
```

MP3 bitrate can be overridden with `--audio-bitrate` or `--audio-bitrate-kbps`.

---

## Audio Cleanup

MOSS TTS can emit near-duplicate stereo channels. Gollek defaults to `--audio-channels auto`, which collapses duplicate stereo output to cleaner mono. Explicit modes are also available:

| Option | Behavior |
|--------|----------|
| `--audio-channels auto` | Keep native layout unless stereo channels are near-duplicates |
| `--audio-channels mono` | Downmix output to mono |
| `--audio-channels stereo` | Emit dual-mono/stereo output |
| `--audio-channels native` | Preserve decoded codec output |

The TTS path also applies speech polish by default: DC removal, short edge fades, and peak normalization. Use `--no-audio-polish`, `--no-audio-normalize`, `--audio-gain-db`, `--audio-peak-db`, or `--audio-fade-ms` when you need manual control.

---

## Streaming and Live Preview

ONNX TTS streams progress and audio artifacts through the provider stream path. Encoded audio is chunked, written through a hidden `.part` file, then atomically moved to the requested output path when generation completes.

Useful streaming flags:

| Flag | Behavior |
|------|----------|
| `--tts-stream-progress-frames N` | Emit progress every N generated frames |
| `--no-tts-stream-progress` | Hide progress updates |
| `--audio-stream-chunk-kb N` | Control encoded audio chunk size |
| `--tts-stream-pcm` | Emit decoded PCM preview chunks |
| `--live-audio` | Play decoded PCM preview while writing the final artifact |
| `--no-low-latency-audio` | Delay PCM preview until after frame generation |

---

## Output and Metadata

Generated audio includes metadata when the selected container supports it. Gollek also reports metadata in the CLI output and provider response:

- prompt text
- selected voice
- voice selection mode
- model display name
- seed and seed source
- stop reason
- audio format, MIME type, sample rate, channels, bitrate or compression level
- audio processing details such as mono collapse, gain, fades, and peak target

The CLI also prints audio-native details:

```text
Audio details: 2.08s, 48000 Hz, 1ch, 26 frames (natural stop), 128 kbps, voice EN Trump, seed 1234, mono collapsed, polished peak
[Audio: 2.08s, Generation: 2.91s, Speed: 0.71x realtime, RTF: 1.40, Synthesis: 8.9 frames/s]
```

---

## Generation Limits

Use frame or duration caps to make quick smoke tests:

```bash
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice "en Trump" \
  --tts-max-frames 1 \
  --output smoke.mp3
```

```bash
gollek run --model 71e8f7 \
  --prompt "hello" \
  --voice "en Trump" \
  --tts-max-seconds 2 \
  --output capped.mp3
```

Stop reasons are reported as natural stop, frame cap, duration cap, token cap, or model cap.

---

## Troubleshooting

### Unknown voice option

Use one of these forms:

```bash
gollek run --model 71e8f7 --list-voices
gollek run --model 71e8f7 --prompt "hello" --voice "en Trump" --output hello.mp3
gollek run --model 71e8f7 --prompt "hello" --voice-lang en --voice-gender Trump --output hello.mp3
```

### No Japanese male preset

If the model only ships Japanese female voices, `--voice "jp male"` will fail with a targeted message. Use `--voice "jp female"` or a listed preset name.

### Missing space before `--output`

The CLI repairs common TTS typos such as:

```bash
--voice "jp female"--output hello.mp3
```

and interprets them as:

```bash
--voice "jp female" --output hello.mp3
```

### Codec not found

Pull the companion repository or pass it explicitly:

```bash
gollek pull OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano-ONNX
```

### MP3 or FLAC encoder unavailable

Suling reports a targeted codec error when a native backend is missing. Install the required native library or switch formats:

```bash
gollek run --model 71e8f7 --prompt "hello" --voice "en Trump" --audio-format wav --output hello.wav
```

---

[CLI Reference](/docs/setup/cli-reference) | [Inference Runtime](/docs/runtime/inference-serving) | [Features](/features/)
