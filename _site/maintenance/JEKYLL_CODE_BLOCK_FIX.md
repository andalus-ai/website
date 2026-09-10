# Jekyll Code Block Fix - Final

**Date**: April 2026  
**Status**: ✅ Complete - Jekyll/Rouge Compatible

---

## Problem

Code was not displaying properly inside code blocks because:
1. Jekyll uses Rouge highlighter which creates nested div structure
2. CSS was targeting standard `<pre>` blocks only
3. JavaScript copy function wasn't finding Jekyll's generated HTML

---

## Jekyll's HTML Structure

Jekyll generates this structure for code blocks:

```html
<div class="highlighter-rouge">
  <div class="highlight">
    <pre class="language-java"><code class="language-java">
      // code here
    </code></pre>
  </div>
</div>
```

**Not** the standard:
```html
<pre><code class="language-java">// code here</code></pre>
```

---

## Solution

### 1. CSS for Jekyll Blocks ✅

Added specific selectors for Rouge-generated blocks:

```css
/* Target Jekyll/Rouge highlighted blocks */
.content-card .highlighter-rouge,
.content-card div.highlight {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin: 1.25rem 0;
  overflow: auto;
  position: relative;
}

.content-card .highlighter-rouge .highlight,
.content-card div.highlight .highlight {
  background: transparent;
  border: none;
  margin: 0;
  border-radius: 0;
}

.content-card .highlighter-rouge pre,
.content-card div.highlight pre {
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  overflow: visible;
}

.content-card .highlighter-rouge code,
.content-card div.highlight code {
  display: block;
  background: transparent;
  border: none;
  padding: 1rem;
  font-size: 0.813rem;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: var(--text-primary);
  width: 100%;
  box-sizing: border-box;
}
```

---

### 2. JavaScript Enhancement ✅

Updated `initCopyCode()` to handle both Jekyll and standard blocks:

```javascript
function initCopyCode() {
  // Target both Jekyll/Rouge and standard pre blocks
  const codeBlocks = document.querySelectorAll(
    '.highlighter-rouge, div.highlight, pre'
  );

  codeBlocks.forEach(block => {
    // Skip nested pres inside highlighter-rouge
    if (block.closest('.highlighter-rouge') || 
        block.closest('div.highlight')) {
      if (block.tagName === 'PRE') return;
    }

    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';

    // Handle Jekyll's nested structure
    if (block.classList.contains('highlighter-rouge') || 
        block.classList.contains('highlight')) {
      const pre = block.querySelector('pre');
      if (pre) {
        codeElement = pre.querySelector('code');
        pre.parentNode.insertBefore(toolbar, pre);
      }
    }
    
    // ... rest of copy logic
  });
}
```

---

### 3. Toolbar Positioning ✅

```css
/* Code toolbar inside Jekyll blocks */
.content-card .highlighter-rouge .code-toolbar,
.content-card div.highlight .code-toolbar {
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
```

---

## Visual Result

### Before
```
Code might overflow or be clipped
Text outside block
No copy button on Jekyll blocks
```

### After
```
┌─────────────────────────────────────────┐
│ javascript                    [📋 Copy] │
├─────────────────────────────────────────┤
│ const x = 10;    ← Properly contained   │
│ console.log(x);  ← Syntax highlighted   │
└─────────────────────────────────────────┘
```

---

## Files Modified

| File | Changes |
|------|---------|
| `assets/css/site.css` | +60 lines (Jekyll selectors) |
| `assets/js/site.js` | +40 lines (enhanced detection) |

---

## Testing

### Desktop
- [x] Jekyll code blocks display correctly
- [x] Standard pre blocks still work
- [x] Copy button appears on both types
- [x] Code stays inside container
- [x] Horizontal scroll works
- [x] Syntax highlighting visible

### Mobile
- [x] Responsive on both block types
- [x] Font sizes reduced appropriately
- [x] No overflow issues
- [x] Touch-friendly

### Both Block Types
- [x] ` ```java ` markdown blocks (Jekyll)
- [x] `<pre><code>` blocks (standard)
- [x] Copy works on both
- [x] Styling consistent

---

## Supported Markdown Syntax

### Fenced Code Blocks (Recommended)
```markdown
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```
```

**Renders as**: Jekyll highlighter-rouge block

### Indented Code Blocks
```markdown
    public class Main {
        public static void main(String[] args) {
            System.out.println("Hello");
        }
    }
```

**Renders as**: Standard `<pre><code>` block

### HTML Blocks
```html
<pre><code class="language-java">
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
</code></pre>
```

**Renders as**: Standard `<pre><code>` block

---

## Browser Support

All modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Performance

- **CSS**: No performance impact (static selectors)
- **JavaScript**: Minimal impact (runs once on load)
- **Build**: No impact on Jekyll build time

---

## Troubleshooting

### Code Still Overflowing

**Check**: Is it actually a Jekyll block?
```javascript
document.querySelectorAll('.highlighter-rouge').length;
```

### Copy Button Not Appearing

**Check**: JavaScript console for errors
```javascript
// Run in console to test
initCopyCode();
```

### Styling Not Applied

**Check**: CSS loaded correctly
```bash
# Rebuild Jekyll
bundle exec jekyll build

# Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

## Next Steps (Optional)

### Future Enhancements

1. **Line Numbers**
   ```css
   .content-card .highlighter-rouge code {
     counter-reset: line;
   }
   ```

2. **Prism.js Integration**
   - Automatic syntax highlighting
   - More languages
   - Themes

3. **Code Folding**
   - Collapsible blocks
   - Expand/collapse regions

---

**Status**: Production Ready ✅  
**Tested**: Jekyll build successful  
**Compatibility**: Both Jekyll and standard blocks supported
