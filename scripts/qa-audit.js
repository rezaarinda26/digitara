(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const issues = [];
  const add = (kind, detail) => issues.push(kind + ': ' + detail);

  // 1. Scroll through the whole page so every observer fires.
  const max = document.documentElement.scrollHeight - window.innerHeight;
  for (let i = 0; i <= 30; i++) {
    window.scrollTo(0, Math.round((max * i) / 30));
    await sleep(110);
  }
  await sleep(1800);

  // 2. Elements stuck hidden (reveal never fired).
  document.querySelectorAll('.reveal').forEach((el) => {
    if (!el.className.includes('is-visible')) {
      add('reveal-hidden', (el.textContent || '').trim().slice(0, 40));
    }
  });

  // 3. Curtain (mask overlay) still covering content.
  document.querySelectorAll('.reveal-mask').forEach((el) => {
    const t = getComputedStyle(el, '::after').transform;
    // matrix(a, b, c, d, e, f) -> d is scaleY
    const m = t && t.match(/matrix\(([^)]+)\)/);
    if (m) {
      const d = parseFloat(m[1].split(',')[3]);
      if (d > 0.02) add('curtain-down', (el.textContent || '').trim().slice(0, 40));
    }
  });

  // 4. Horizontal overflow.
  if (document.documentElement.scrollWidth > window.innerWidth + 2) {
    add('h-overflow', document.documentElement.scrollWidth + ' > ' + window.innerWidth);
  }

  // 5. Broken images.
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
      add('img-broken', (img.getAttribute('src') || '').slice(-50));
    }
  });

  // 6. Zero-size elements that carry text (invisible content).
  document.querySelectorAll('h1, h2, h3, h4, p, span, a, button').forEach((el) => {
    const r = el.getBoundingClientRect();
    const hasText = (el.textContent || '').trim().length > 0;
    const cs = getComputedStyle(el);
    if (hasText && r.width === 0 && r.height === 0 && cs.display !== 'none' && cs.visibility !== 'hidden') {
      // Skip if any ancestor is display:none (offsetParent is null then).
      if (el.offsetParent === null && cs.position !== 'fixed') return;
      if (el.closest('[hidden]')) return;
      add('zero-size', (el.textContent || '').trim().slice(0, 40));
    }
  });

  // 7. Low-contrast text on light backgrounds (WCAG AA spot check).
  // Colours may be in any CSS format (rgb / oklab / color()), so normalise
  // them through a canvas before computing luminance.
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const ctx = cv.getContext('2d');
  const toRgba = (c) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const lum = (rgba) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(rgba[0]) + 0.7152 * f(rgba[1]) + 0.0722 * f(rgba[2]);
  };
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) {
        const rgba = toRgba(c);
        if (rgba[3] > 0.9) return rgba;
      }
      n = n.parentElement;
    }
    return [255, 255, 255, 1];
  };
  const seen = new Set();
  document.querySelectorAll('p, span, a, h1, h2, h3, h4, label, button, li').forEach((el) => {
    if (!el.textContent || !el.textContent.trim()) return;
    if (el.children.length > 0) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.5) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (el.closest('.hidden, .sm\\:hidden, .md\\:hidden, .lg\\:hidden')) return;
    const fg = toRgba(cs.color);
    if (fg[3] < 0.5) return; // transparent text (gradient fill) - skip
    const bg = bgOf(el);
    const l1 = lum(fg);
    const l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const need = large ? 3 : 4.5;
    if (ratio < need) {
      const key = cs.color + '|' + bg.join(',') + '|' + String(el.className).slice(0, 24);
      if (seen.has(key)) return;
      seen.add(key);
      add(
        'contrast',
        ratio.toFixed(2) + ':1 (need ' + need + ') ' + cs.color + ' on rgb(' + bg.slice(0, 3).join(',') + ') :: "' + el.textContent.trim().slice(0, 26) + '"'
      );
    }
  });

  return JSON.stringify({ count: issues.length, issues: issues.slice(0, 25) }, null, 1);
})();
