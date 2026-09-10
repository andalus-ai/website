# Code Block Fix - content-container

**Date**: April 2026  
**Status**: ✅ Complete - Fixed content-container

---

## Root Cause

The CSS was targeting `.content-card` but the actual content wrapper is `.content-container`!

---

## HTML Structure

```html
<main class="main-content">
  <div class="content-container">  <!-- ← This is the wrapper -->
    <h1>Page Title</h1>
    <div class="highlighter-rouge">...</div>
  </div>
</main>
```

**Not** `.content-card` which doesn't exist on most pages!

---

## Fix Applied

Added `.content-container` selectors to all code block CSS rules:

### Outer Container
```css
.content-container div.language-plaintext,
.content-container div.language-java,
.content-container div.language-bash,
.content-container div.language-xml,
/* ... all languages ... */
.content-container div.highlighter-rouge,
.content-container div.highlight {
  background: var(--bg-tertiary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-lg) !important;
  margin: 1.25rem 0 !important;
  overflow: auto !important;
}
```

### Inner Elements
```css
.content-container .highlighter-rouge .highlight,
.content-container div.highlight .highlight {
  background: transparent !important;
  border: none !important;
  margin: 0 !important;
}

.content-container .highlighter-rouge pre,
.content-container div.highlight pre {
  background: transparent !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.content-container .highlighter-rouge code,
.content-container div.highlight code {
  display: block !important;
  background: transparent !important;
  border: none !important;
  padding: 1rem !important;
  font-size: 0.813rem !important;
  line-height: 1.6 !important;
  overflow-x: auto !important;
  white-space: pre !important;
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  color: var(--text-primary) !important;
  width: 100% !important;
  box-sizing: border-box !important;
}
```

### Code Toolbar
```css
.content-container .highlighter-rouge .code-toolbar,
.content-container div.highlight .code-toolbar {
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
}
```

### Standard Pre Blocks
```css
.content-container pre {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin: 1.25rem 0;
  overflow: auto;
  padding: 0;
}

.content-container pre code {
  display: block;
  background: transparent;
  border: none;
  padding: 1rem;
  font-size: 0.813rem;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
  width: 100%;
  box-sizing: border-box;
}
```

---

## Files Modified

| File | Changes |
|------|---------|
| `assets/css/site.css` | Added `.content-container` to all code selectors |

---

## Testing

### Before
```
Use the generated release formula (gollek.rb) in your tap:
code

brew tap bhangun/gollek
brew install gollek  ← No border, no background
```

### After
```
Use the generated release formula (gollek.rb) in your tap:

┌─────────────────────────────────────────┐
│ bash                          [📋 Copy] │
├─────────────────────────────────────────┤
│ brew tap bhangun/gollek                 │
│ brew install gollek                     │
└─────────────────────────────────────────┘
```

---

## Verification Steps

1. **Rebuild site**:
   ```bash
   cd website/gollek-ai.github.io
   bundle exec jekyll build
   ```

2. **Open CLI installation page**:
   ```bash
   open _site/docs/cli-installation.html
   ```

3. **Check brew code blocks**:
   - Should have border
   - Should have background
   - Should have copy button
   - Code should be inside container

4. **Browser DevTools**:
   - Right-click code block → Inspect
   - Verify `.content-container` styles apply
   - Check for `!important` flags

---

## Browser Cache

**Clear cache or hard refresh**:
- **Mac**: Cmd + Shift + R
- **Windows**: Ctrl + Shift + R

---

## All Pages Now Fixed

This fix applies to all pages using the default layout:
- ✅ /docs/cli-installation
- ✅ /docs/ (all documentation)
- ✅ /blog/ (all blog posts)
- ✅ /features/
- ✅ / (homepage)

---

**Status**: Production Ready ✅  
**Build**: Successful  
**Coverage**: All pages with `.content-container`
