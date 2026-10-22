(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const max = document.documentElement.scrollHeight - window.innerHeight;

  // Walk the page and look for marquee strips.
  const found = [];
  for (let i = 0; i <= 30; i++) {
    window.scrollTo(0, Math.round((max * i) / 30));
    await sleep(110);

    document.querySelectorAll('.animate-marquee').forEach((marquee) => {
      const strip = marquee.parentElement;
      const sr = strip.getBoundingClientRect();
      if (sr.bottom < 0 || sr.top > window.innerHeight) return;
      if (sr.height < 4) return;

      // Look for anything painted over the strip.
      const hits = [];
      document.querySelectorAll('body *').forEach((el) => {
        if (el === strip || strip.contains(el)) return;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        if (parseFloat(cs.opacity) < 0.05) return;
        const r = el.getBoundingClientRect();
        if (r.width < 20 || r.height < 3) return;
        const ovY = Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top);
        const ovX = Math.min(r.right, sr.right) - Math.max(r.left, sr.left);
        if (ovY > 3 && ovX > 20) {
          hits.push({
            tag: el.tagName,
            cls: String(el.className).slice(0, 90),
            bg: cs.backgroundColor,
            pos: cs.position,
            z: cs.zIndex,
            rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          });
        }
      });
      const key = strip.className.slice(0, 40);
      if (found.some((f) => f.strip === key)) return;
      found.push({
        strip: key,
        stripBg: getComputedStyle(strip).backgroundColor,
        stripRect: { y: Math.round(sr.y), h: Math.round(sr.height) },
        hits: hits.slice(0, 6),
      });
    });
  }
  return JSON.stringify(found, null, 1);
})();
