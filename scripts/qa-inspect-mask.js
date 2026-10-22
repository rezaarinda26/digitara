(async () => {
  const masks = [...document.querySelectorAll('.reveal-mask')].map((el) => {
    const cs = getComputedStyle(el);
    return {
      cls: el.className.includes('is-visible') ? 'visible' : 'HIDDEN',
      clip: cs.clipPath,
      h: Math.round(el.getBoundingClientRect().height),
      text: (el.textContent || '').trim().slice(0, 32),
    };
  });
  return JSON.stringify(masks, null, 1);
})();
