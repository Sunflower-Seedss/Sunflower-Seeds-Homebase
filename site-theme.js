(function () {
  'use strict';
  var root = document.documentElement;
  var paletteKey = 'ss-site-theme';
  var modeKey = 'ss-theme';
  var paletteButton;
  var modeButton;
  var savedMode;
  function read(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  function validMode(value) { return value === 'light' || value === 'dark'; }
  function defaultMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  }
  var palette = read(paletteKey) === 'everquill' ? 'everquill' : 'sunflower';
  savedMode = read(modeKey);
  var mode = validMode(savedMode) ? savedMode : defaultMode();
  function render() {
    root.setAttribute('data-site-theme', palette);
    root.setAttribute('data-theme', mode);
    if (paletteButton) paletteButton.setAttribute('aria-checked', String(palette === 'everquill'));
    if (!modeButton) return;
    modeButton.setAttribute('aria-label', 'Toggle dark mode');
    modeButton.setAttribute('aria-pressed', String(mode === 'dark'));
    var icon = modeButton.querySelector('.toggle-icon');
    var label = modeButton.querySelector('.toggle-label');
    if (icon) icon.textContent = mode === 'dark' ? '\u{1f319}' : '\u2600\ufe0f';
    if (label) label.textContent = mode === 'dark' ? 'Dark' : 'Light';
    if (!icon && !label) modeButton.textContent = mode === 'dark' ? '\u{1f319}' : '\u2600\ufe0f';
  }
  function setMode(value, persist) {
    if (!validMode(value)) return;
    mode = value;
    if (persist) { savedMode = value; write(modeKey, value); write('djt-help-theme', value); }
    render();
  }
  function setPalette(value, persist) {
    palette = value === 'everquill' ? 'everquill' : 'sunflower';
    if (persist) write(paletteKey, palette);
    render();
  }
  render();
  function mount() {
    modeButton = document.getElementById('themeToggle') || document.getElementById('theme-toggle');
    var controls = document.createElement('div');
    controls.className = 'site-theme-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Appearance');
    if (modeButton) {
      if (modeButton.id === 'theme-toggle') controls.classList.add('site-theme-controls--local');
      modeButton.parentNode.insertBefore(controls, modeButton);
    } else {
      modeButton = document.createElement('button');
      modeButton.type = 'button';
      modeButton.className = 'site-mode-toggle';
      document.body.insertBefore(controls, document.body.firstChild);
    }
    paletteButton = document.createElement('button');
    paletteButton.type = 'button';
    paletteButton.className = 'palette-toggle';
    paletteButton.setAttribute('role', 'switch');
    paletteButton.setAttribute('aria-label', 'Everquill theme');
    paletteButton.innerHTML = '<span aria-hidden="true">\u{1f49c}</span><span class="palette-track" aria-hidden="true"><span class="palette-thumb"></span></span><span aria-hidden="true">\u{1f49a}</span>';
    paletteButton.addEventListener('click', function () { setPalette(palette === 'everquill' ? 'sunflower' : 'everquill', true); });
    paletteButton.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        setPalette(event.key === 'ArrowLeft' ? 'everquill' : 'sunflower', true);
      }
    });
    controls.appendChild(paletteButton);
    controls.appendChild(modeButton);
    modeButton.type = 'button';
    // Capture owns the click while existing page scripts retain their other behavior.
    modeButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setMode(mode === 'dark' ? 'light' : 'dark', true);
    }, true);
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
  window.addEventListener('storage', function (event) {
    if (event.key === paletteKey || event.key === null) setPalette(read(paletteKey), false);
    if (event.key === modeKey || event.key === null) {
      savedMode = read(modeKey);
      setMode(validMode(savedMode) ? savedMode : defaultMode(), false);
    }
  });
  if (window.matchMedia) {
    var media = window.matchMedia('(prefers-color-scheme:dark)');
    if (media.addEventListener) media.addEventListener('change', function () {
      if (!validMode(savedMode)) setMode(defaultMode(), false);
    });
  }
})();
