/*!
 * No Vertical Web (NVW) v1.0.0
 * Le web n'a pas été créé pour être vu au format vertical.
 * Un projet CTRL+ALT+R — https://ctrlaltr.org
 *
 * Licence : GPL v2 ou ultérieure.
 * Source  : https://github.com/renopointcom/no-vertical-web
 */
(function () {
  'use strict';

  var DEFAULT_MESSAGE =
    '<h1>Le web n\'a pas été créé<br>pour être vu au format vertical.</h1>' +
    '<p>Tourne ton écran. Ou agrandis la fenêtre.</p>' +
    '<p class="nvw-sign">CTRL + ALT + R</p>';

  var DEFAULTS = {
    ratioThreshold: 1.0,
    widthThreshold: 768,
    operator: 'AND',
    message: DEFAULT_MESSAGE,
    bgColor: '#000000',
    textColor: '#ffffff',
    imageUrl: '',
    customCss: '',
    excludeSelectors: []
  };

  var user = (window.NVW_CONFIG && typeof window.NVW_CONFIG === 'object') ? window.NVW_CONFIG : {};
  var cfg = {};
  for (var k in DEFAULTS) cfg[k] = (k in user) ? user[k] : DEFAULTS[k];

  console.log(
    '%c CTRL+ALT+R %c No Vertical Web v1.0.0 ',
    'background:#000;color:#fff;font-weight:bold;padding:2px 6px;',
    'background:#fff;color:#000;padding:2px 6px;'
  );

  function isExcluded() {
    if (!cfg.excludeSelectors || !cfg.excludeSelectors.length) return false;
    for (var i = 0; i < cfg.excludeSelectors.length; i++) {
      try { if (document.querySelector(cfg.excludeSelectors[i])) return true; } catch (e) {}
    }
    return false;
  }

  function shouldShow() {
    if (isExcluded()) return false;
    var w = window.innerWidth, h = window.innerHeight;
    if (w <= 0 || h <= 0) return false;
    var ratioHit = (h / w) >= cfg.ratioThreshold;
    var widthHit = w < cfg.widthThreshold;
    return String(cfg.operator).toUpperCase() === 'OR'
      ? (ratioHit || widthHit)
      : (ratioHit && widthHit);
  }

  var overlay = null, styleEl = null;

  function injectStyle() {
    if (styleEl) return;
    styleEl = document.createElement('style');
    styleEl.setAttribute('data-nvw', '1');
    styleEl.textContent =
      '.nvw-overlay{position:fixed;inset:0;z-index:2147483647;display:none;' +
      'align-items:center;justify-content:center;text-align:center;padding:8vw;' +
      'background:' + cfg.bgColor + ';color:' + cfg.textColor + ';' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'font-size:16px;line-height:1.4;-webkit-font-smoothing:antialiased;}' +
      '.nvw-overlay.is-active{display:flex;}' +
      '.nvw-inner{max-width:680px;margin:auto;}' +
      '.nvw-overlay img{max-width:140px;height:auto;margin:0 auto 1.5em;display:block;}' +
      '.nvw-overlay h1{font-size:clamp(1.4rem,5.5vw,2.4rem);margin:0 0 0.8em;' +
      'font-weight:700;letter-spacing:-0.01em;line-height:1.2;}' +
      '.nvw-overlay p{margin:0 0 0.6em;opacity:0.85;}' +
      '.nvw-overlay .nvw-sign{margin-top:2.4em;font-size:0.78em;opacity:0.5;letter-spacing:0.18em;}' +
      'html.nvw-locked,html.nvw-locked body{overflow:hidden!important;}' +
      (cfg.customCss || '');
    document.head.appendChild(styleEl);
  }

  function buildOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'nvw-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-live', 'polite');
    var inner = document.createElement('div');
    inner.className = 'nvw-inner';
    var html = '';
    if (cfg.imageUrl) {
      html += '<img src="' + String(cfg.imageUrl).replace(/"/g, '&quot;') + '" alt="">';
    }
    html += cfg.message;
    inner.innerHTML = html;
    overlay.appendChild(inner);
    document.body.appendChild(overlay);
    return overlay;
  }

  function apply() {
    if (!document.body) return;
    injectStyle();
    buildOverlay();
    var on = shouldShow();
    overlay.classList.toggle('is-active', on);
    document.documentElement.classList.toggle('nvw-locked', on);
  }

  function boot() {
    apply();
    var t;
    function debounced() { clearTimeout(t); t = setTimeout(apply, 80); }
    window.addEventListener('resize', debounced, { passive: true });
    window.addEventListener('orientationchange', debounced, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.NVW = { check: apply, config: cfg, version: '1.0.0' };
})();
