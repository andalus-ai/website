/**
 * Gollek SDK - Site JavaScript
 * Handles sidebar navigation, theme switching, and UI interactions
 */

(function() {
  'use strict';

  // ────────────────────────────────────────────────────────
  // DOM Elements
  // ────────────────────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  const themeToggle = document.getElementById('theme-toggle');
  const themeOptions = document.querySelectorAll('.theme-option');
  const html = document.documentElement;

  // ────────────────────────────────────────────────────────
  // Sidebar Management
  // ────────────────────────────────────────────────────────
  
  /**
   * Open sidebar on mobile
   */
  function openSidebar() {
    if (window.innerWidth <= 1024) {
      sidebar.classList.add('active');
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Close sidebar on mobile
   */
  function closeSidebar() {
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Toggle sidebar state
   */
  function toggleSidebar() {
    if (sidebar.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  // Event listeners for sidebar
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });

  // Close sidebar when clicking on a nav item (mobile)
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 1024) {
        closeSidebar();
      }
    }, 250);
  });

  // ────────────────────────────────────────────────────────
  // Theme Management
  // ────────────────────────────────────────────────────────
  
  /**
   * Set theme
   * @param {string} theme - 'dark', 'light', or 'auto'
   */
  function setTheme(theme) {
    // Save to localStorage
    try {
      localStorage.setItem('gollek-theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }

    // Apply theme
    if (theme === 'auto') {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      html.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
    } else {
      html.setAttribute('data-theme', theme);
    }

    // Update active state on theme buttons
    themeOptions.forEach(option => {
      option.classList.toggle('active', option.dataset.theme === theme);
    });
  }

  /**
   * Get current theme from localStorage or default to 'light'
   * @returns {string} Current theme
   */
  function getTheme() {
    try {
      return localStorage.getItem('gollek-theme') || 'light';
    } catch (e) {
      return 'light';
    }
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // Initialize theme options
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      setTheme(option.dataset.theme);
    });
  });

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (getTheme() === 'auto') {
        setTheme('auto');
      }
    });
  }

  // ────────────────────────────────────────────────────────
  // Copy Code Functionality
  // ────────────────────────────────────────────────────────

  /**
   * Add copy buttons to code blocks
   */
  function initCopyCode() {
    // Target both Jekyll/Rouge highlighted blocks and standard pre blocks
    const codeBlocks = document.querySelectorAll('.highlighter-rouge, div.highlight, pre');

    codeBlocks.forEach(block => {
      // Skip if already has copy button
      if (block.querySelector('.copy-button')) return;

      // The install chooser owns its copy controls because the command is dynamic.
      if (block.closest('[data-install-chooser]')) return;
      
      // Skip if this is a nested pre inside highlighter-rouge
      if (block.closest('.highlighter-rouge') || block.closest('div.highlight')) {
        if (block.tagName === 'PRE') return;
      }

      // Create copy button container
      const toolbar = document.createElement('div');
      toolbar.className = 'code-toolbar';

      // Get language from code element or parent
      let codeElement = block.querySelector('code');
      
      // For Jekyll blocks, code might be nested
      if (!codeElement) {
        codeElement = block.querySelector('pre code');
      }
      
      // For highlighter-rouge divs, look for pre > code
      if (block.classList.contains('highlighter-rouge') || block.classList.contains('highlight')) {
        const pre = block.querySelector('pre');
        if (pre) {
          codeElement = pre.querySelector('code');
          // Insert toolbar before the pre element
          if (pre) {
            pre.parentNode.insertBefore(toolbar, pre);
          }
        }
      }
      
      const language = codeElement ? getLanguageFromClass(codeElement.className) : 'code';

      // Language label
      const langLabel = document.createElement('span');
      langLabel.className = 'code-lang';
      langLabel.textContent = language;

      // Copy button with SVG icon
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-button';
      copyBtn.type = 'button';
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
        <span>Copy</span>
      `;

      copyBtn.addEventListener('click', async () => {
        const codeText = codeElement ? codeElement.textContent.trim() : '';

        try {
          await navigator.clipboard.writeText(codeText);
          
          // Change to checkmark icon and "Copied!" text
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            <span>Copied!</span>
          `;

          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              <span>Copy</span>
            `;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          
          // Show error state
          copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Failed</span>
          `;
          
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              <span>Copy</span>
            `;
          }, 2000);
        }
      });

      toolbar.appendChild(langLabel);
      toolbar.appendChild(copyBtn);

      // For standard pre blocks (not Jekyll highlighted)
      if (!block.classList.contains('highlighter-rouge') && !block.classList.contains('highlight')) {
        block.insertBefore(toolbar, block.firstChild);
      }
    });
  }

  /**
   * Extract language from class name
   * @param {string} className - Class string
   * @returns {string} Language name
   */
  function getLanguageFromClass(className) {
    if (!className) return 'code';
    
    const langMatch = className.match(/language-(\w+)/);
    if (langMatch) {
      return langMatch[1];
    }
    
    // Common language classes
    const languages = ['javascript', 'js', 'java', 'python', 'py', 'bash', 'shell', 'json', 'xml', 'html', 'css', 'sql'];
    for (const lang of languages) {
      if (className.includes(lang)) {
        return lang;
      }
    }
    
    return 'code';
  }

  // ────────────────────────────────────────────────────────
  // Active Navigation Highlighting
  // ────────────────────────────────────────────────────────
  
  /**
   * Highlight active navigation item based on current URL
   */
  function initActiveNav() {
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (!href) return;
      
      // Remove existing active class
      item.classList.remove('active');
      
      // Check if this nav item matches current path
      if (href === currentPath) {
        item.classList.add('active');
      } else if (href !== '/' && currentPath.startsWith(href)) {
        item.classList.add('active');
      }
    });
  }

  // ────────────────────────────────────────────────────────
  // Smooth Scroll for Anchor Links
  // ────────────────────────────────────────────────────────
  
  /**
   * Enable smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ────────────────────────────────────────────────────────
  // Typing Effect (for homepage demo)
  // ────────────────────────────────────────────────────────
  
  /**
   * Typing effect for terminal demo
   */
  function initTypingEffect() {
    const typingElement = document.getElementById('typing-effect');
    if (!typingElement) return;
    
    const command = typingElement.dataset.command;
    const result = typingElement.dataset.result;
    
    if (!command) return;
    
    let charIndex = 0;
    let isTyping = true;
    
    function type() {
      if (charIndex < command.length && isTyping) {
        typingElement.textContent = command.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(type, 50 + Math.random() * 50);
      } else if (isTyping) {
        isTyping = false;
        setTimeout(showResult, 500);
      }
    }
    
    function showResult() {
      if (result) {
        typingElement.innerHTML = command + '\n' + result.replace(/\n/g, '<br>');
      }
    }
    
    // Start typing when element is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          type();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(typingElement);
  }

  // ────────────────────────────────────────────────────────
  // Table of Contents (for documentation pages)
  // ────────────────────────────────────────────────────────
  
  /**
   * Generate table of contents from headings
   */
  function initTableOfContents() {
    const tocContainer = document.getElementById('table-of-contents');
    if (!tocContainer) return;
    
    const headings = document.querySelectorAll('.content-card h2, .content-card h3');
    if (headings.length === 0) return;
    
    const toc = document.createElement('nav');
    toc.className = 'table-of-contents';
    toc.setAttribute('aria-label', 'Table of contents');
    
    const tocList = document.createElement('ul');
    
    headings.forEach(heading => {
      const id = heading.id || generateIdFromText(heading.textContent);
      heading.id = id;
      
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = heading.textContent;
      a.className = `toc-link toc-${heading.tagName.toLowerCase()}`;
      
      li.appendChild(a);
      tocList.appendChild(li);
    });
    
    toc.appendChild(tocList);
    tocContainer.appendChild(toc);
  }

  /**
   * Generate ID from text
   * @param {string} text - Heading text
   * @returns {string} Generated ID
   */
  function generateIdFromText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // ────────────────────────────────────────────────────────
  // Search Functionality (placeholder for future implementation)
  // ────────────────────────────────────────────────────────
  
  /**
   * Initialize search functionality
   */
  function initSearch() {
    const searchInput = document.getElementById('site-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      
      // Future: Implement search functionality
      console.log('Search query:', query);
    });
    
    // Keyboard shortcut for search (Ctrl/Cmd + K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // ────────────────────────────────────────────────────────
  // Install Chooser
  // ────────────────────────────────────────────────────────

  function detectInstallOS() {
    const platform = (navigator.userAgentData && navigator.userAgentData.platform
      ? navigator.userAgentData.platform
      : navigator.platform || '').toLowerCase();
    const ua = (navigator.userAgent || '').toLowerCase();

    if (/iphone|ipad|ipod|android/.test(ua)) return 'mobile';
    if (platform.includes('mac') || ua.includes('mac os')) return 'macos';
    if (platform.includes('win') || ua.includes('windows')) return 'windows';
    if (platform.includes('linux') || ua.includes('linux') || ua.includes('x11')) return 'linux';
    return 'linux';
  }

  function defaultInstallProfile(os) {
    if (os === 'macos') return 'metal';
    if (os === 'mobile') return 'mobile';
    return 'auto';
  }

  function installProfilesForOS(os) {
    const profiles = {
      macos: ['auto', 'cpu', 'metal', 'mobile', 'full'],
      linux: ['auto', 'cpu', 'cuda', 'mobile', 'full'],
      windows: ['auto', 'cpu', 'cuda', 'mobile', 'full'],
      mobile: ['mobile']
    };
    return profiles[os] || profiles.linux;
  }

  function coerceInstallProfile(os, profile) {
    const allowed = installProfilesForOS(os);
    return allowed.includes(profile) ? profile : defaultInstallProfile(os);
  }

  function defaultInstallMethod(os) {
    return os === 'mobile' ? 'source' : 'release';
  }

  function normalizeInstallValue(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function installStateFromUrl(fallbackOS) {
    const params = new URLSearchParams(window.location.search || '');
    const os = normalizeInstallValue(params.get('os'), ['macos', 'linux', 'windows', 'mobile'], fallbackOS);
    const profile = coerceInstallProfile(
      os,
      normalizeInstallValue(params.get('profile'), ['auto', 'cpu', 'metal', 'cuda', 'mobile', 'full'], defaultInstallProfile(os))
    );
    const method = normalizeInstallValue(params.get('method'), ['release', 'package', 'direct', 'source'], defaultInstallMethod(os));
    return { os, profile, method };
  }

  function shareableInstallUrl(state) {
    const url = new URL(window.location.href);
    url.searchParams.set('os', state.os);
    url.searchParams.set('profile', state.profile);
    url.searchParams.set('method', state.method);
    url.hash = 'install-chooser';
    return url.toString();
  }

  function updateInstallUrl(state) {
    if (!window.history || !window.history.replaceState) return;
    window.history.replaceState(null, '', shareableInstallUrl(state));
  }

  async function writeClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  function flashInstallButton(button, label) {
    if (!button) return;
    const original = button.textContent;
    button.textContent = label;
    button.classList.add('copied');
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove('copied');
    }, 1600);
  }

  function installCommand(os, profile, method) {
    const releaseBase = 'https://github.com/bhangun/gollek/releases/latest/download';
    const sourceBuilder = [
      'git clone https://github.com/bhangun/gollek.git',
      'cd gollek',
      './create-builder-script.sh',
      os === 'mobile' ? './scripts/run-install-local-mobile.sh' : './scripts/run-install-local-macos.sh'
    ].join('\n');

    const commands = {
      macos: {
        release: `curl -fsSL ${releaseBase}/install.sh | bash -s -- --profile ${profile}`,
        package: 'brew tap bhangun/gollek\nbrew install gollek',
        direct: `curl -LO ${releaseBase}/gollek-macos-x64.tar.gz\ntar -xzf gollek-macos-x64.tar.gz\n./gollek-macos-x64 --version`,
        source: sourceBuilder
      },
      linux: {
        release: `curl -fsSL ${releaseBase}/install.sh | bash -s -- --profile ${profile}`,
        package: `curl -fsSL ${releaseBase}/install.sh | bash -s -- --profile ${profile}`,
        direct: `curl -LO ${releaseBase}/gollek-linux-x64.tar.gz\ntar -xzf gollek-linux-x64.tar.gz\n./gollek-linux-x64 --version`,
        source: sourceBuilder
      },
      windows: {
        release: `Invoke-WebRequest -Uri "${releaseBase}/install.ps1" -OutFile "install.ps1"\n.\\install.ps1 -Profile ${profile}`,
        package: 'choco install gollek',
        direct: `Invoke-WebRequest -Uri "${releaseBase}/gollek-windows-x64.exe" -OutFile "gollek.exe"\n.\\gollek.exe --version`,
        source: 'git clone https://github.com/bhangun/gollek.git\ncd gollek\n.\\gradlew.bat :ui:gollek-cli:quarkusBuild'
      },
      mobile: {
        release: `curl -fsSL ${releaseBase}/install.sh | bash -s -- --profile mobile`,
        package: 'flutter pub add gollek_edge',
        direct: `open ${releaseBase}/gollek-jvm.zip`,
        source: sourceBuilder
      }
    };

    return commands[os][method] || commands[os].release;
  }

  function installVerifyCommand(os, method) {
    const shellProfileVerify = [
      'gollek --version',
      'PROFILE_FILE="${GOLLEK_HOME:-$HOME/.gollek}/config/profile.env"',
      '[ -f "$PROFILE_FILE" ] && cat "$PROFILE_FILE"'
    ].join('\n');
    const powershellProfileVerify = [
      'gollek --version',
      '$profileFile = if ($env:GOLLEK_HOME) { Join-Path $env:GOLLEK_HOME "config\\profile.env" } else { Join-Path $HOME ".gollek\\config\\profile.env" }',
      'if (Test-Path $profileFile) { Get-Content $profileFile }'
    ].join('\n');

    if (method === 'direct') {
      const directCommands = {
        macos: './gollek-macos-x64 --version',
        linux: './gollek-linux-x64 --version',
        windows: '.\\gollek.exe --version',
        mobile: 'unzip -l gollek-jvm.zip | head'
      };
      return directCommands[os] || directCommands.linux;
    }

    if (method === 'source') {
      if (os === 'mobile') {
        return [
          'test -f ../mobile/gollek_edge/assets/gollek_edge_profile.json',
          'cat ../mobile/gollek_edge/assets/gollek_edge_profile.json'
        ].join('\n');
      }
      if (os === 'windows') {
        return [
          'gollek --version',
          'if (Test-Path .\\scripts\\module-selection-current.env) { Get-Content .\\scripts\\module-selection-current.env }'
        ].join('\n');
      }
      return [
        'gollek --version',
        '[ -f scripts/module-selection-current.env ] && cat scripts/module-selection-current.env'
      ].join('\n');
    }

    if (method === 'package' && os === 'mobile') {
      return 'flutter pub deps | grep gollek_edge';
    }

    return os === 'windows' ? powershellProfileVerify : shellProfileVerify;
  }

  function installCommandLanguage(os) {
    return os === 'windows' ? 'language-powershell' : 'language-bash';
  }

  function installLink(os, method) {
    const releaseBase = 'https://github.com/bhangun/gollek/releases/latest/download';
    const links = {
      macos: {
        release: `${releaseBase}/install.sh`,
        package: 'https://github.com/bhangun/gollek/releases/latest',
        direct: `${releaseBase}/gollek-macos-x64.tar.gz`,
        source: 'https://github.com/bhangun/gollek'
      },
      linux: {
        release: `${releaseBase}/install.sh`,
        package: `${releaseBase}/install.sh`,
        direct: `${releaseBase}/gollek-linux-x64.tar.gz`,
        source: 'https://github.com/bhangun/gollek'
      },
      windows: {
        release: `${releaseBase}/install.ps1`,
        package: 'https://community.chocolatey.org/packages/gollek',
        direct: `${releaseBase}/gollek-windows-x64.exe`,
        source: 'https://github.com/bhangun/gollek'
      },
      mobile: {
        release: `${releaseBase}/install.sh`,
        package: 'https://pub.dev/packages/gollek_edge',
        direct: `${releaseBase}/gollek-jvm.zip`,
        source: 'https://github.com/bhangun/gollek'
      }
    };
    return links[os][method] || links[os].release;
  }

  function installTitle(os, method) {
    const osLabel = {
      macos: 'macOS',
      linux: 'Linux',
      windows: 'Windows',
      mobile: 'mobile / edge'
    }[os] || 'your system';
    const methodLabel = {
      release: 'Release installer',
      package: os === 'macos' ? 'Homebrew' : os === 'windows' ? 'Chocolatey' : 'Release installer',
      direct: 'Direct artifact',
      source: 'Source builder'
    }[method] || 'Install command';
    return `${methodLabel} for ${osLabel}`;
  }

  function installNotes(os, profile, method) {
    if (method === 'release') {
      return `Uses profile "${profile}" and writes runtime defaults to $GOLLEK_HOME/config/profile.env.`;
    }
    if (method === 'package') {
      if (os === 'linux') return 'Linux package-manager packaging is not published yet; this uses the release installer.';
      return 'Package-manager installs are convenient, but profile-specific runtime defaults are owned by the release installer.';
    }
    if (method === 'direct') {
      return 'Direct artifacts are useful for inspection or pinned deployments; they do not write a profile file by themselves.';
    }
    return 'Source builder opens the interactive profile selector before generating build and install wrappers.';
  }

  function installProfileGuidance(os, profile) {
    const guidance = {
      auto: {
        title: 'Auto profile',
        description: 'Best first choice for most machines. The installer keeps the runtime portable and lets Gollek choose safe local defaults.'
      },
      cpu: {
        title: 'CPU portable',
        description: 'Smallest dependable profile for servers, CI, containers, and machines without a GPU runtime.'
      },
      metal: {
        title: 'macOS Metal local AI',
        description: 'Optimized for Apple Silicon and macOS GPU acceleration with local model execution.'
      },
      cuda: {
        title: 'NVIDIA CUDA workstation',
        description: 'Targets Linux or Windows machines with NVIDIA drivers and CUDA-capable acceleration.'
      },
      mobile: {
        title: 'Mobile / edge',
        description: 'Prepares LiteRT, ONNX, and edge-oriented runtime defaults for Flutter or embedded use.'
      },
      full: {
        title: 'Full development build',
        description: 'Includes the broadest runtime surface for plugin work, experiments, and local development.'
      }
    };
    const selected = guidance[profile] || guidance.auto;

    if (os === 'mobile') {
      return {
        title: 'Mobile / edge',
        description: 'Focused on Flutter plugin and edge runtime setup, with mobile-compatible model formats first.'
      };
    }

    return selected;
  }

  function installMethodGuidance(os, method) {
    const guidance = {
      release: {
        title: os === 'windows' ? 'PowerShell release installer' : 'Release installer',
        description: 'Downloads the latest release artifact, installs Gollek, and writes the selected profile defaults.'
      },
      package: {
        title: os === 'macos' ? 'Homebrew' : os === 'windows' ? 'Chocolatey' : 'Release installer fallback',
        description: os === 'linux'
          ? 'Linux package-manager packaging is not published yet, so this path currently uses the release installer.'
          : 'Uses the platform package manager when available. Profile defaults may need the release installer or manual config.'
      },
      direct: {
        title: 'Direct artifact',
        description: 'Downloads one release artifact for inspection, pinning, or manual placement without writing a profile file.'
      },
      source: {
        title: 'Source builder',
        description: 'Clones Gollek and opens the interactive builder so advanced users can generate local build wrappers.'
      }
    };
    return guidance[method] || guidance.release;
  }

  function installPrerequisites(os, profile, method) {
    const profileItems = {
      metal: ['Use a Metal-capable Mac; Apple Silicon is the best-supported target for local acceleration.'],
      cuda: ['Install a current NVIDIA driver and CUDA-capable runtime before first accelerated model run.'],
      mobile: ['Have Flutter and the target mobile toolchain ready for edge runtime integration.'],
      full: ['Expect a broader local runtime setup than CPU or auto profiles; this is aimed at development machines.']
    };
    const methodItems = {
      release: {
        macos: [
          'Requires curl, bash, tar, and permission to install the Gollek wrapper.',
          'Writes profile defaults under ~/.gollek/config and sources them when gollek runs.'
        ],
        linux: [
          'Requires curl, bash, tar, and permission to install the Gollek wrapper.',
          'Writes profile defaults under ~/.gollek/config and sources them when gollek runs.'
        ],
        windows: [
          'Run from PowerShell with permission to download the release installer.',
          'The installer adds Gollek to the user PATH; open a new terminal if gollek is not found immediately.'
        ],
        mobile: [
          'Use this when you want the release installer to persist the mobile profile.',
          'For app integration, the source builder gives more control over generated Flutter runtime files.'
        ]
      },
      package: {
        macos: [
          'Requires Homebrew and access to the bhangun/gollek tap.',
          'Use the release installer when you want profile.env written automatically.'
        ],
        linux: [
          'Linux package-manager packaging is not published yet; this currently uses the release installer.',
          'Requires curl, bash, tar, and permission to install the Gollek wrapper.'
        ],
        windows: [
          'Requires Chocolatey; an elevated PowerShell may be needed depending on your machine policy.',
          'Use the PowerShell release installer when you want profile defaults written automatically.'
        ],
        mobile: [
          'Requires Flutter and pub access from the app or package workspace.',
          'This adds the edge package; it does not install the desktop Gollek CLI.'
        ]
      },
      direct: {
        macos: [
          'Downloads only the release artifact; it does not create PATH entries or profile files.',
          'Move the binary somewhere on PATH when you want gollek available globally.'
        ],
        linux: [
          'Downloads only the release artifact; it does not create PATH entries or profile files.',
          'Move the binary somewhere on PATH when you want gollek available globally.'
        ],
        windows: [
          'Downloads only gollek.exe; it does not create PATH entries or profile files.',
          'Move gollek.exe to a directory on PATH for global terminal access.'
        ],
        mobile: [
          'Downloads the JVM fallback archive for manual inspection or embedding.',
          'Use source builder for generated Flutter mobile profile files.'
        ]
      },
      source: {
        macos: [
          'Requires git, an interactive terminal, and a local JDK/Gradle-capable build environment.',
          'The builder writes the resolved selection to scripts/module-selection-current.env.'
        ],
        linux: [
          'Requires git, an interactive terminal, and a local JDK/Gradle-capable build environment.',
          'The builder writes the resolved selection to scripts/module-selection-current.env.'
        ],
        windows: [
          'Requires git, PowerShell or Git Bash, and a local JDK/Gradle-capable build environment.',
          'The builder output should be checked from scripts/module-selection-current.env.'
        ],
        mobile: [
          'Requires git, Flutter, and the mobile target toolchain.',
          'The generated edge profile is written to mobile/gollek_edge/assets/gollek_edge_profile.json.'
        ]
      }
    };
    const items = [...(methodItems[method]?.[os] || methodItems.release.linux)];
    (profileItems[profile] || []).forEach(item => {
      if (!items.includes(item)) items.push(item);
    });
    return {
      title: method === 'direct' ? 'Manual artifact checklist' : method === 'source' ? 'Source build checklist' : 'Install checklist',
      items
    };
  }

  function initInstallChooser() {
    const chooser = document.querySelector('[data-install-chooser]');
    if (!chooser) return;

    const osSelect = chooser.querySelector('[data-install-os]');
    const osLabel = chooser.querySelector('[data-install-os-label]');
    const detected = chooser.querySelector('[data-install-detected]');
    const command = chooser.querySelector('[data-install-command]');
    const title = chooser.querySelector('[data-install-title]');
    const link = chooser.querySelector('[data-install-link]');
    const notes = chooser.querySelector('[data-install-notes]');
    const profileHint = chooser.querySelector('[data-install-profile-hint]');
    const verifyCommand = chooser.querySelector('[data-install-verify-command]');
    const verifyTitle = chooser.querySelector('[data-install-verify-title]');
    const prereqTitle = chooser.querySelector('[data-install-prereq-title]');
    const prereqList = chooser.querySelector('[data-install-prerequisites]');
    const profileTitle = chooser.querySelector('[data-install-profile-title]');
    const profileDescription = chooser.querySelector('[data-install-profile-description]');
    const methodTitle = chooser.querySelector('[data-install-method-title]');
    const methodDescription = chooser.querySelector('[data-install-method-description]');
    const copyCommandButton = chooser.querySelector('[data-install-copy-command]');
    const copyVerifyButton = chooser.querySelector('[data-install-copy-verify]');
    const copyLinkButton = chooser.querySelector('[data-install-copy-link]');
    const profileButtons = Array.from(chooser.querySelectorAll('[data-install-profile]'));
    const methodButtons = Array.from(chooser.querySelectorAll('[data-install-method]'));

    const detectedOS = detectInstallOS();
    const state = installStateFromUrl(detectedOS);

    function setActive(buttons, attr, value) {
      buttons.forEach(button => {
        const isActive = button.getAttribute(attr) === value;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    function setProfileButtons() {
      const labels = {
        macos: 'macOS',
        linux: 'Linux',
        windows: 'Windows',
        mobile: 'mobile / edge development'
      };
      const profileLabels = {
        auto: 'Auto',
        cpu: 'CPU',
        metal: 'Metal',
        cuda: 'CUDA',
        mobile: 'Mobile',
        full: 'Full'
      };
      const allowedProfiles = installProfilesForOS(state.os);

      profileButtons.forEach(button => {
        const profile = button.getAttribute('data-install-profile');
        const isAllowed = allowedProfiles.includes(profile);
        const isActive = profile === state.profile;
        button.disabled = !isAllowed;
        button.classList.toggle('active', isActive);
        button.classList.toggle('disabled', !isAllowed);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        button.setAttribute('aria-disabled', isAllowed ? 'false' : 'true');
        button.title = isAllowed ? '' : `${profileLabels[profile] || profile} is not available for ${labels[state.os] || 'this system'}`;
      });

      if (profileHint) {
        const readableProfiles = allowedProfiles.map(profile => profileLabels[profile] || profile).join(', ');
        profileHint.textContent = `Available for ${labels[state.os] || 'this system'}: ${readableProfiles}.`;
      }
    }

    function setPrerequisites() {
      const prerequisites = installPrerequisites(state.os, state.profile, state.method);
      if (prereqTitle) prereqTitle.textContent = prerequisites.title;
      if (!prereqList) return;
      prereqList.replaceChildren();
      prerequisites.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        prereqList.appendChild(li);
      });
    }

    function render() {
      state.profile = coerceInstallProfile(state.os, state.profile);
      if (osSelect) osSelect.value = state.os;
      const labels = {
        macos: 'macOS',
        linux: 'Linux',
        windows: 'Windows',
        mobile: 'mobile / edge development'
      };
      if (osLabel) osLabel.textContent = labels[state.os] || 'your system';
      if (detected) detected.textContent = `Detected: ${labels[detectedOS] || 'unknown'}`;
      if (command) {
        command.textContent = installCommand(state.os, state.profile, state.method);
        command.className = installCommandLanguage(state.os);
      }
      if (verifyCommand) {
        verifyCommand.textContent = installVerifyCommand(state.os, state.method);
        verifyCommand.className = installCommandLanguage(state.os);
      }
      if (verifyTitle) verifyTitle.textContent = state.method === 'direct' ? 'Verify artifact' : 'Verify install';
      if (title) title.textContent = installTitle(state.os, state.method);
      if (link) link.href = installLink(state.os, state.method);
      if (notes) notes.textContent = installNotes(state.os, state.profile, state.method);
      const profileGuidance = installProfileGuidance(state.os, state.profile);
      const methodGuidance = installMethodGuidance(state.os, state.method);
      if (profileTitle) profileTitle.textContent = profileGuidance.title;
      if (profileDescription) profileDescription.textContent = profileGuidance.description;
      if (methodTitle) methodTitle.textContent = methodGuidance.title;
      if (methodDescription) methodDescription.textContent = methodGuidance.description;

      setProfileButtons();
      setPrerequisites();
      setActive(methodButtons, 'data-install-method', state.method);
      updateInstallUrl(state);
    }

    if (osSelect) {
      osSelect.addEventListener('change', () => {
        state.os = osSelect.value;
        state.profile = defaultInstallProfile(state.os);
        state.method = defaultInstallMethod(state.os);
        render();
      });
    }

    profileButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (button.disabled) return;
        state.profile = button.getAttribute('data-install-profile');
        render();
      });
    });

    methodButtons.forEach(button => {
      button.addEventListener('click', () => {
        state.method = button.getAttribute('data-install-method');
        render();
      });
    });

    if (copyCommandButton) {
      copyCommandButton.addEventListener('click', async () => {
        try {
          await writeClipboard(installCommand(state.os, state.profile, state.method));
          flashInstallButton(copyCommandButton, 'Copied');
        } catch (error) {
          console.error('Failed to copy install command:', error);
          flashInstallButton(copyCommandButton, 'Failed');
        }
      });
    }

    if (copyVerifyButton) {
      copyVerifyButton.addEventListener('click', async () => {
        try {
          await writeClipboard(installVerifyCommand(state.os, state.method));
          flashInstallButton(copyVerifyButton, 'Copied');
        } catch (error) {
          console.error('Failed to copy install verification command:', error);
          flashInstallButton(copyVerifyButton, 'Failed');
        }
      });
    }

    if (copyLinkButton) {
      copyLinkButton.addEventListener('click', async () => {
        try {
          await writeClipboard(shareableInstallUrl(state));
          flashInstallButton(copyLinkButton, 'Copied');
        } catch (error) {
          console.error('Failed to copy install link:', error);
          flashInstallButton(copyLinkButton, 'Failed');
        }
      });
    }

    render();
  }

  // ────────────────────────────────────────────────────────
  // Notification System
  // ────────────────────────────────────────────────────────
  
  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info, warning)
   */
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: 'var(--radius-md)',
      backgroundColor: type === 'success' ? 'var(--success-bg)' :
                       type === 'error' ? 'var(--danger-bg)' :
                       type === 'warning' ? 'var(--warning-bg)' : 'var(--info-bg)',
      border: `1px solid ${type === 'success' ? 'var(--success)' :
                           type === 'error' ? 'var(--danger)' :
                           type === 'warning' ? 'var(--warning)' : 'var(--info)'}`,
      color: 'var(--text-primary)',
      zIndex: '1000',
      animation: 'fadeIn 0.3s ease',
      boxShadow: 'var(--shadow-lg)'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Expose to global scope for external use
  window.gollekUI = {
    showNotification,
    openSidebar,
    closeSidebar,
    setTheme
  };

  // ────────────────────────────────────────────────────────
  // Initialize on DOM Ready
  // ────────────────────────────────────────────────────────
  
  function init() {
    // Initialize theme
    setTheme(getTheme());
    
    // Initialize features
    initCopyCode();
    initActiveNav();
    initSmoothScroll();
    initTypingEffect();
    initTableOfContents();
    initSearch();
    initInstallChooser();
    
    // Add loaded class to body
    document.body.classList.add('loaded');
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ────────────────────────────────────────────────────────
  // Mermaid.js Integration (for diagrams)
  // ────────────────────────────────────────────────────────
  
  /**
   * Initialize Mermaid diagrams
   */
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Space Grotesk, sans-serif'
    });
  }

})();
