/**
 * Hovers an element with a real mouse event (CSS :hover needs real pointer
 * state, a synthetic mouseover won't do it) and screenshots the result.
 *
 * Usage: node scripts/qa-hover.mjs <url> <selector> <outfile> [waitMs]
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { existsSync } from 'node:fs';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => existsSync(p));
if (!CHROME) throw new Error('Chrome not found');

const url = process.argv[2];
const selector = process.argv[3];
const outFile = resolve(process.argv[4] || 'tmp/hover.png');
const waitMs = Number(process.argv[5] || 3000);
const PORT = 9334;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const child = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--no-first-run',
    '--disable-extensions',
    `--user-data-dir=${tmpdir()}\\opencode-hover-chrome`,
    `--remote-debugging-port=${PORT}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
);

let client;
try {
  let target;
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, {
        method: 'PUT',
      });
      if (res.ok) {
        target = await res.json();
        break;
      }
    } catch {}
    await sleep(250);
  }
  if (!target) throw new Error('no devtools target');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  client = await new Promise((res, rej) => {
    ws.onopen = () =>
      res({
        send: (method, params = {}) => {
          const msgId = ++id;
          ws.send(JSON.stringify({ id: msgId, method, params }));
          return new Promise((r) => pending.set(msgId, r));
        },
        close: () => ws.close(),
      });
    ws.onerror = () => rej(new Error('ws error'));
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        pending.get(m.id)(m.result);
        pending.delete(m.id);
      }
    };
  });

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Page.navigate', { url });
  await sleep(waitMs);

  const box = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = el.getBoundingClientRect();
      return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height });
    })()`,
    returnByValue: true,
  });
  if (!box.result.value) throw new Error('selector not found: ' + selector);
  const { x, y } = JSON.parse(box.result.value);

  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 });
  await sleep(120);
  const state = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      const cs = getComputedStyle(el);
      return JSON.stringify({
        filter: cs.filter,
        transform: cs.transform,
        scale: cs.scale,
        transition: cs.transition,
        transitionProperty: cs.transitionProperty,
      });
    })()`,
    returnByValue: true,
  });
  console.log('hovered:', state.result.value);
  await sleep(900);

  const shot = await client.send('Page.captureScreenshot', { format: 'png' });
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, Buffer.from(shot.data, 'base64'));
  console.log('OK', outFile);
} catch (e) {
  console.error('failed:', e.message);
  process.exitCode = 1;
} finally {
  client?.close();
  child.kill();
}
