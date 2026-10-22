(async () => {
  // Scroll through the whole page so every reveal fires, then report.
  const max = document.documentElement.scrollHeight - window.innerHeight;
  for (let i = 0; i <= 30; i++) {
    window.scrollTo(0, Math.round((max * i) / 30));
    await new Promise((r) => setTimeout(r, 120));
  }
  await new Promise((r) => setTimeout(r, 1200));

  const report = { masks: [], reveals: [] };
  document.querySelectorAll('.reveal-mask').forEach((el) => {
    report.masks.push({
      ok: el.className.includes('is-visible'),
      text: (el.textContent || '').trim().slice(0, 34),
    });
  });
  document.querySelectorAll('.reveal').forEach((el) => {
    if (!el.className.includes('is-visible')) {
      report.reveals.push((el.textContent || '').trim().slice(0, 34));
    }
  });
  report.stillHiddenMasks = report.masks.filter((m) => !m.ok).length;
  report.stillHiddenReveals = report.reveals.length;
  delete report.masks;
  delete report.reveals;
  return JSON.stringify(report);
})();
