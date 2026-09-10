# Three Usage Approaches Update

**Date**: April 2026  
**Status**: ✅ Complete

---

## Overview

Updated the Gollek website to clearly present three distinct usage approaches:

1. **CLI Tool** - Quick inference, model management, conversions from terminal
2. **ML Framework** - PyTorch-like API for building and training neural networks
3. **Inference Runtime** - High-performance production serving with multi-format support

---

## Files Modified

### 1. Homepage (`index.md`)
**Changes**: Complete redesign with three paths section

**New Sections**:
- **Hero**: Updated tagline to "One Platform. Three Ways to Build AI/ML Applications"
- **Three Paths Grid**: Visual cards showing each approach with:
  - Icon and description
  - Feature tags
  - Code examples
  - Action buttons
- **Quick Grid**: Updated to show all three paths
- **Feature Table**: Comparison matrix showing capabilities per approach
- **Quick Start**: Three separate code examples (CLI, Framework, Runtime)

**Key Messaging**:
- "Choose your path or combine them all"
- Framework highlighted as "Most Popular"
- Clear differentiation between use cases

---

### 2. Framework Documentation (`docs/framework.md`)
**Status**: ✅ New file created

**Comprehensive Guide** covering:
- **GradTensor & Autograd**: Tensor operations, automatic differentiation
- **Neural Network Modules**: 36+ components (Linear, Conv2d, Attention, Transformers)
- **Activation Functions**: 8 types (ReLU, GELU, SiLU, Mish, etc.)
- **Loss Functions**: 6 types (CrossEntropy, MSE, Huber, etc.)
- **Optimizers**: Adam, SGD with momentum
- **Learning Rate Schedulers**: StepLR, CosineAnnealingLR
- **Training Loops**: Basic and advanced with early stopping
- **Data Loading**: Dataset and DataLoader abstractions
- **Model Persistence**: SafeTensors save/load
- **LangChain4j Integration**: Chat and streaming models
- **GPU Acceleration**: Metal, CUDA, ROCm auto-detection
- **JBang Examples**: Link to 23+ ready-to-run scripts

**Code Examples**:
- PyTorch-style API demonstrations
- Complete training loops
- Custom module creation
- Model persistence patterns

---

### 3. Sidebar Navigation (`_layouts/default.html`)
**Changes**: Reorganized "Getting Started" section

**New Structure**:
```
Getting Started
├── Home
├── Documentation (index)
├── ML Framework ← NEW
├── CLI Tool
└── Inference Runtime
```

**Removed**:
- Features page (redundant with new structure)

**Icons**:
- Framework: Layers icon (stacked layers)
- CLI: Terminal icon
- Runtime: Play button icon

---

### 4. CSS Styles (`assets/css/site.css`)
**Changes**: Added styles for three paths section

**New CSS Classes**:
```css
.three-paths-section     /* Section container */
.paths-grid             /* 3-column grid */
.path-card              /* Individual card */
.path-card-highlighted  /* Featured card (Framework) */
.path-badge             /* "Most Popular" badge */
.path-icon              /* SVG icon container */
.path-description       /* Card description text */
.path-features          /* Feature tags container */
.feature-tag            /* Individual feature tag */
.feature-tag-highlighted /* Highlighted feature tag */
.path-example           /* Code example box */
.path-actions           /* Button container */
```

**Responsive Design**:
- Desktop: 3-column grid
- Tablet/Mobile: Single column, Framework card moves to top

---

## Visual Design

### Three Paths Grid

```
┌─────────────┬──────────────────────┬─────────────┐
│  CLI Tool   │  ML Framework ⭐     │  Runtime    │
│             │  (Most Popular)      │             │
│ [Terminal]  │  [Layers Icon]       │  [Play]     │
│             │                      │             │
│ Quick       │  PyTorch-like API    │  High-Perf  │
│ inference   │  for Java devs       │  serving    │
│             │                      │             │
│ [Features]  │  [Highlighted Feat]  │  [Features] │
│             │                      │             │
│ [Example]   │  [Code Example]      │  [Example]  │
│             │                      │             │
│ [Install]   │  [Framework Guide]   │  [SDK Guide]│
└─────────────┴──────────────────────┴─────────────┘
```

### Feature Comparison Table

| Feature | CLI | Framework | Runtime |
|---------|-----|-----------|---------|
| Quick Inference | ✅ | ✅ | ✅ |
| Model Training | ❌ | ✅ | ❌ |
| Neural Network API | ❌ | ✅ | ❌ |
| GPU Acceleration | ✅ | ✅ | ✅ |
| Multi-Format | ✅ | ✅ | ✅ |
| JBang/Jupyter | ❌ | ✅ | ❌ |
| LangChain4j | ❌ | ✅ | ❌ |
| Plugin System | ❌ | ✅ | ✅ |

---

## Key Messaging

### Homepage Hero
> **One Platform. Three Ways to Build AI/ML Applications.**
> 
> Gollek is a unified platform that works as a **CLI tool**, a **PyTorch-like ML Framework**, and an **Inference/Serving Runtime**. Choose your path or combine them all.

### Framework Card
> **Build and train neural networks with a PyTorch-like API in pure Java. Tensors, autograd, layers, optimizers—the full toolkit for ML research and development.**

### CLI Card
> **Quick inference, model management, and conversions from your terminal. Perfect for developers who want to use AI models without writing code.**

### Runtime Card
> **Deploy models to production with high-performance inference serving. Support for GGUF, ONNX, SafeTensors, and cloud APIs with GPU acceleration.**

---

## User Journeys

### Journey 1: CLI User
```
1. Lands on homepage
2. Sees three paths, clicks "CLI Tool"
3. Reads brew install instructions
4. Views CLI commands reference
5. Starts using gollek chat
```

### Journey 2: ML Researcher
```
1. Lands on homepage
2. Sees "ML Framework" highlighted as "Most Popular"
3. Clicks "Framework Guide"
4. Reads about tensors, autograd, modules
5. Runs JBang examples
6. Starts building custom models
```

### Journey 3: Production Engineer
```
1. Lands on homepage
2. Sees "Inference Runtime"
3. Clicks "SDK Guide"
4. Reads about multi-format support
5. Integrates into microservice
6. Deploys with GPU acceleration
```

---

## Framework Capabilities Highlighted

### Core Features
- **GradTensor**: Multi-dimensional arrays with autograd
- **36+ NN Modules**: Linear, Conv2d, Attention, Transformers
- **8 Activation Functions**: ReLU, GELU, SiLU, Mish, etc.
- **6 Loss Functions**: CrossEntropy, MSE, Huber, etc.
- **Optimizers**: Adam, SGD with momentum
- **LR Schedulers**: StepLR, CosineAnnealingLR
- **Early Stopping**: Patience-based with weight restoration

### Development Experience
- **JBang**: Single-file Java scripts (like Python)
- **Jupyter**: Interactive notebooks with Java kernel
- **23+ Examples**: Ready-to-run from GitHub
- **LangChain4j**: Direct integration bridge

### Hardware Support
- **Metal**: Apple Silicon (M1-M4) with FA4
- **CUDA**: NVIDIA (A100-H200, RTX 4090) with FA2/3/4
- **ROCm**: AMD GPUs
- **Blackwell**: NVIDIA B100/B200 with FP4

---

## Testing Checklist

### Homepage
- [x] Three paths grid displays correctly
- [x] Framework card highlighted with badge
- [x] Code examples render properly
- [x] Feature tags wrap correctly
- [x] Responsive on mobile (stacks vertically)

### Framework Page
- [x] All code blocks display properly
- [x] Sections navigate via anchor links
- [x] Examples link to JBang catalog
- [x] PyTorch comparisons clear

### Navigation
- [x] Sidebar shows all three paths
- [x] Active highlighting works
- [x] Icons display correctly
- [x] Mobile menu works

---

## Files Created/Modified

| File | Status | Changes |
|------|--------|---------|
| `index.md` | ✅ Modified | Complete redesign with three paths |
| `docs/framework.md` | ✅ New | Comprehensive framework guide |
| `_layouts/default.html` | ✅ Modified | Updated sidebar navigation |
| `assets/css/site.css` | ✅ Modified | Added three paths styles |

---

## Next Steps (Optional)

### Future Enhancements

1. **Interactive Path Selector**
   - Quiz to help users choose their path
   - "Which Gollek path is right for you?"

2. **Path-Specific Landing Pages**
   - `/cli` - Dedicated CLI landing page
   - `/framework` - Dedicated framework landing page
   - `/runtime` - Dedicated runtime landing page

3. **Migration Guides**
   - "From CLI to Framework"
   - "From Framework to Runtime"
   - "Combining All Three"

4. **Video Tutorials**
   - 5-min intro to each path
   - Live coding sessions

---

**Status**: Production Ready ✅  
**Build**: Successful  
**Coverage**: All three approaches documented
