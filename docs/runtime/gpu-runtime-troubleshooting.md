---
layout: default
title: GPU Runtime Troubleshooting
---

# GPU Runtime Troubleshooting

This page is the shortest practical workflow for the common runtime problem:

“Gollek starts, but GPU acceleration is missing, slow, or clearly using the
wrong device.”

It connects the three main diagnostic layers:

1. native library installation
2. platform auto-detection
3. device placement and responsibility

See also:

- [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs)
- [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection)
- [Native Library Management Guide](/docs/runtime/native-library-guide)
- [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)

## Fast Decision Tree

If the process fails to start because a native library cannot be found or
loaded:

1. go to [Step 1: Verify Native Libraries](#step-1-verify-native-libraries)

If the process starts, but Gollek chooses CPU instead of the GPU you expected:

1. go to [Step 2: Check Platform Auto-Detection](#step-2-check-platform-auto-detection)

If the process reports a GPU platform, but placement still looks wrong or slow:

1. go to [Step 3: Check Device Placement](#step-3-check-device-placement)

If you are on Apple Silicon and safetensor/libtorch output still behaves
unexpectedly:

1. go to [Step 4: Debug Apple Silicon Placement Boundaries](#step-4-debug-apple-silicon-placement-boundaries)

## Step 1: Verify Native Libraries

Start here when Gollek cannot load backend libraries, or when GPU backends are
missing entirely.

Use the install and verify path from
[Native Library Management Guide](/docs/runtime/native-library-guide):

```bash
make -f Makefile.native install-native-libs
make -f Makefile.native verify-libs
```

If needed, confirm the standard location layout under `~/.gollek/libs/`.

Typical symptoms this step addresses:

- `.dylib` / `.so` not found
- backend classes available but runtime native libraries missing
- macOS quarantine and dependency-resolution issues

If this step fails, stay in the native-library guide until the runtime can at
least see the expected backend libraries.

## Step 2: Check Platform Auto-Detection

Once native libraries exist, verify how Gollek is choosing the platform.

Use [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection) to
confirm:

- detection priority order
- supported override flags
- CPU fallback behavior

Questions to answer here:

- should this machine prefer Metal, CUDA, ROCm, or CPU?
- is GPU acceleration disabled by an override?
- is Gollek falling back to CPU because the GPU backend is actually unavailable?

If the chosen platform is wrong, fix this layer before going deeper into device
placement.

## Step 3: Check Device Placement

If the platform selection looks correct but inference still behaves like CPU or
moves tensors to the wrong place, switch to
[Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference).

That page is the fastest place to confirm:

- which layer decides placement
- what the expected logs should look like
- what “correct” Metal placement looks like versus CPU fallback

Typical symptoms this step addresses:

- logs say `cpu` when you expected `mps`
- inference runs, but performance is much slower than expected
- provider/device combinations look inconsistent

## Step 4: Debug Apple Silicon Placement Boundaries

If you are specifically on Apple Silicon, the next useful layer is:

- [Metal GPU Device Placement](/docs/runtime/metal-gpu-device-placement)
- [Device Responsibility Architecture](/docs/runtime/device-responsibility-architecture)

Use these when the issue is no longer:

- “can the runtime see the GPU?”

and has become:

- “which layer is actually responsible for this placement decision?”

That is the right level for bugs involving:

- MPS vs CPU movement
- safetensor/libtorch bridge expectations
- ownership of placement decisions between orchestration and backend layers

## Common Failure Patterns

### Library problem

Symptoms:

- startup failure
- native symbol/load error
- backend never becomes available

Primary page:

- [Native Library Management Guide](/docs/runtime/native-library-guide)

### Detection problem

Symptoms:

- runtime chooses CPU when a GPU should be available
- override flags or environment variables appear ignored

Primary page:

- [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection)

### Placement problem

Symptoms:

- platform says GPU, but logs still show CPU placement
- performance looks like fallback behavior

Primary pages:

- [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)
- [Metal GPU Device Placement](/docs/runtime/metal-gpu-device-placement)

### Ownership/architecture problem

Symptoms:

- you need to know whether the bug belongs in orchestration, runner, or backend
- placement behavior is technically working, but responsibility is unclear

Primary page:

- [Device Responsibility Architecture](/docs/runtime/device-responsibility-architecture)

## Suggested Reading Order

For most runtime failures, this order is the most efficient:

1. [Native Library Management Guide](/docs/runtime/native-library-guide)
2. [Kernel Auto-Detection Guide](/docs/runtime/kernel-auto-detection)
3. [Device Placement Quick Reference](/docs/runtime/device-placement-quick-reference)
4. [Metal GPU Device Placement](/docs/runtime/metal-gpu-device-placement)
5. [Device Responsibility Architecture](/docs/runtime/device-responsibility-architecture)

## When To Stop Here

If you can now answer these three questions, you are probably back in a healthy
state:

- are the required native libraries installed and loadable?
- which platform is Gollek selecting, and why?
- which layer is responsible for the final device placement?

If not, go back to [GPU Runtime Docs](/docs/runtime/gpu-runtime-docs) and pick
the narrower page for the layer that still looks wrong.
