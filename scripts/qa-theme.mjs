/**
 * Seeds the CMS localStorage with a chosen theme mode, then screenshots the
 * page. Handy for verifying light/dark variants without clicking around.
 *
 * Usage: node scripts/qa-theme.mjs <mode> <outfile> [scrollY] [w] [h] [wait]
 */
import { execFileSync } from 'node:child_process';

const mode = process.argv[2] || 'light-minimal';
const out = process.argv[3] || 'tmp/theme.png';
const scrollY = process.argv[4] || '0';
const w = process.argv[5] || '1440';
const h = process.argv[6] || '900';
const wait = process.argv[7] || '4000';

const script = `(() => {
  const KEY = 'digitara_headless_cms_v1';
  let data = {};
  try { data = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  data.theme = { ...(data.theme || {}), bgMode: ${JSON.stringify(mode)} };
  localStorage.setItem(KEY, JSON.stringify(data));
  return 'ok';
})()`;

execFileSync(
  process.execPath,
  [
    'scripts/qa.mjs',
    'http://localhost:3000/?noreveal=1',
    out,
    scrollY,
    w,
    h,
    wait,
    script,
  ],
  { stdio: 'inherit' }
);
