---
layout: default
title: Gollek CLI Installation
---

# Gollek CLI Installation

Install Gollek CLI using release artifacts for macOS, Linux, and Windows.

---

## Install Chooser

<div id="install-chooser" class="install-chooser" data-install-chooser>
  <div class="install-chooser-header">
    <div>
      <p class="install-kicker">Recommended command</p>
      <h2>Install for <span data-install-os-label>your system</span></h2>
    </div>
    <span class="install-detected" data-install-detected>Detecting OS...</span>
  </div>

  <div class="install-controls">
    <div class="install-control">
      <label for="install-os">System</label>
      <select id="install-os" data-install-os>
        <option value="macos">macOS</option>
        <option value="linux">Linux</option>
        <option value="windows">Windows</option>
        <option value="mobile">Mobile / edge development</option>
      </select>
    </div>

    <div class="install-control install-control-wide">
      <span class="install-label">Profile</span>
      <div class="install-segments" role="tablist" aria-label="Install profile">
        <button type="button" data-install-profile="auto">Auto</button>
        <button type="button" data-install-profile="cpu">CPU</button>
        <button type="button" data-install-profile="metal">Metal</button>
        <button type="button" data-install-profile="cuda">CUDA</button>
        <button type="button" data-install-profile="mobile">Mobile</button>
        <button type="button" data-install-profile="full">Full</button>
      </div>
      <p class="install-profile-hint" data-install-profile-hint>Profiles are filtered for the selected system.</p>
    </div>

    <div class="install-control install-control-wide">
      <span class="install-label">Install script</span>
      <div class="install-segments" role="tablist" aria-label="Install script">
        <button type="button" data-install-method="release">Release installer</button>
        <button type="button" data-install-method="package">Package manager</button>
        <button type="button" data-install-method="direct">Direct artifact</button>
        <button type="button" data-install-method="source">Source builder</button>
      </div>
    </div>
  </div>

  <div class="install-details" aria-live="polite">
    <div class="install-detail">
      <span class="install-detail-label">Selected profile</span>
      <strong data-install-profile-title>Auto profile</strong>
      <p data-install-profile-description>Let the installer choose the safest runtime defaults for this system.</p>
    </div>
    <div class="install-detail">
      <span class="install-detail-label">Install behavior</span>
      <strong data-install-method-title>Release installer</strong>
      <p data-install-method-description>Downloads the latest Gollek CLI and writes the selected runtime profile.</p>
    </div>
  </div>

  <div class="install-prerequisites">
    <div>
      <span class="install-detail-label">Before you run</span>
      <strong data-install-prereq-title>Install checklist</strong>
    </div>
    <ul data-install-prerequisites>
      <li>Requires curl, bash, tar, and permission to install the Gollek wrapper.</li>
      <li>The release installer writes profile defaults under <code>~/.gollek/config</code>.</li>
    </ul>
  </div>

  <div class="install-command-wrap">
    <div class="install-command-meta">
      <span data-install-title>Release installer</span>
      <div class="install-command-actions">
        <button type="button" data-install-copy-command>Copy command</button>
        <button type="button" data-install-copy-link>Copy link</button>
        <a href="https://github.com/bhangun/gollek/releases/latest" data-install-link target="_blank" rel="noopener">Open release asset</a>
      </div>
    </div>
    <pre><code class="language-bash" data-install-command>curl -fsSL https://github.com/bhangun/gollek/releases/latest/download/install.sh | bash -s -- --profile auto</code></pre>
  </div>

  <div class="install-command-wrap install-verify-wrap">
    <div class="install-command-meta">
      <span data-install-verify-title>Verify install</span>
      <div class="install-command-actions">
        <button type="button" data-install-copy-verify>Copy verify</button>
      </div>
    </div>
    <pre><code class="language-bash" data-install-verify-command>gollek --version
PROFILE_FILE="${GOLLEK_HOME:-$HOME/.gollek}/config/profile.env"
[ -f "$PROFILE_FILE" ] && cat "$PROFILE_FILE"</code></pre>
  </div>

  <div class="install-notes" data-install-notes>
    Release installer writes the selected profile to <code>$GOLLEK_HOME/config/profile.env</code>.
  </div>
</div>

---

## Install Methods

### Release installer (macOS/Linux)

```bash
curl -fsSL https://github.com/bhangun/gollek/releases/latest/download/install.sh | bash -s -- --profile auto
```

### Windows installer

```powershell
Invoke-WebRequest -Uri "https://github.com/bhangun/gollek/releases/latest/download/install.ps1" -OutFile "install.ps1"
.\install.ps1 -Profile auto
```

### Homebrew

```bash
brew tap bhangun/gollek
brew install gollek
```

### Chocolatey

Use the generated release package template (`gollek-chocolatey-template.zip`) and publish it, then:

```powershell
choco install gollek
```

### Direct native artifacts

macOS:

```bash
curl -LO https://github.com/bhangun/gollek/releases/latest/download/gollek-macos-x64.tar.gz
tar -xzf gollek-macos-x64.tar.gz
./gollek-macos-x64 --version
```

Linux:

```bash
curl -LO https://github.com/bhangun/gollek/releases/latest/download/gollek-linux-x64.tar.gz
tar -xzf gollek-linux-x64.tar.gz
./gollek-linux-x64 --version
```

Windows:

```powershell
Invoke-WebRequest -Uri "https://github.com/bhangun/gollek/releases/latest/download/gollek-windows-x64.exe" -OutFile "gollek.exe"
.\gollek.exe --version
```

### JVM fallback (Java 25+)

Download and extract `gollek-jvm.zip`, then:

```powershell
.\bin\gollek.bat --version
```

### Source builder

```bash
git clone https://github.com/bhangun/gollek.git
cd gollek
./create-builder-script.sh
./scripts/run-install-local-macos.sh
```

The source builder asks for a profile first: `custom`, `cpu`, `metal`, `cuda`, `mobile`, or `full`.

---

## Runtime Directories

Gollek defaults to a single local root:

- Default: `~/.gollek/*`

Set `GOLLEK_HOME` to override the root location if needed.

---

## Verify Install

```bash
gollek --version
gollek --help
```

---

## Quick Commands

```bash
# Run inference
gollek run --model Qwen/Qwen2.5-0.5B-Instruct --prompt "Hi"

# Convert a local model to GGUF
gollek convert --input ~/models/llama-2-7b --output ~/conversions --quant q4_k_m

# Dry-run conversion (path resolution only)
gollek convert --input ~/models/llama-2-7b --output ~/conversions --dry-run

# JSON output for scripting
gollek convert --input ~/models/llama-2-7b --output ~/conversions --json

# Pretty JSON output
gollek convert --input ~/models/llama-2-7b --output ~/conversions --json-pretty
```

---

[Back to Getting Started](/docs/) &nbsp; [Storage Layout](/docs/dev-log/storage-layout) &nbsp; [Examples Docs](/docs/setup/examples-docs)
