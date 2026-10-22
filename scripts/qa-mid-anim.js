(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  document.documentElement.style.scrollBehavior = 'auto';

  const TARGET = window.__QA_TARGET || 'Selected Work';
  const mask = [...document.querySelectorAll('.reveal-mask')].find((el) =>
    (el.textContent || '').includes(TARGET)
  );
  if (!mask) return 'mask not found: ' + TARGET;

  const top = mask.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, Math.max(0, top - window.innerHeight - 60));
  await sleep(500);
  window.scrollTo(0, Math.max(0, top - window.innerHeight * 0.6));
  await sleep(80);
  window.scrollTo(0, Math.max(0, top - window.innerHeight * 0.42));
  await sleep(170); // curtain mid-animation
  return 'triggered ' + TARGET + ' at y=' + window.scrollY;
})();
