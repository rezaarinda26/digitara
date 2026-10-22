(async () => {
  // Open the first portfolio project card modal.
  const heading = [...document.querySelectorAll('h3')].find((h) =>
    h.textContent.includes('Atlas') || h.textContent.includes('Aurora')
  );
  let card = heading;
  while (card && !String(card.className || '').includes('cursor-pointer')) {
    card = card.parentElement;
  }
  if (card) card.click();
  await new Promise((r) => setTimeout(r, 1600));
  return 'dialogs=' + document.querySelectorAll('[role=dialog]').length;
})();
