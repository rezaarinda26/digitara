/**
 * Minimal Chrome DevTools Protocol driver for visual QA.
 * Uses Node's built-in WebSocket (Node >= 22) - no extra dependencies.
 *
 * Usage:
 *   node scripts/qa.mjs <url> <outfile> [scrollY] [width] [height] [waitMs]
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chrome/Edge not found');
  process.exit(1);
}

const url = process.argv[2] || 'http://localhost:3000/';
const outFile = resolve(process.argv[3] || 'tmp/qa.png');
const scrollY = Number(process.argv[4] || 0);
const width = Number(process.argv[5] || 1440);
const height = Number(process.argv[6] || 900);
const waitMs = Number(process.argv[7] || 4000);
const preScriptRaw = process.argv[8] && process.argv[8] !== 'none' ? process.argv[8] : '';
const postScriptRaw = process.argv[9] && process.argv[9] !== 'none' ? process.argv[9] : '';
const phase = process.argv[10] || '';
import { readFileSync } from 'node:fs';
const loadScript = (s) => (s.startsWith('@') ? readFileSync(s.slice(1), 'utf8') : s);
const preScript = loadScript(preScriptRaw);
const postScript = phase
  ? `(async () => { window.__QA_PHASE = ${JSON.stringify(phase)}; return await ${loadScript(
      postScriptRaw
    )}; })()`
  : loadScript(postScriptRaw);

const PORT = 9333;
const profile = `${tmpdir()}\\opencode-qa-chrome`;

const child = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${PORT}`,
    'about:blank',
  ],
  { stdio: 'ignore', detached: false }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, {
        method: 'PUT',
      });
      if (res.ok) return await res.json();
    } catch {
      /* not ready yet */
    }
    await sleep(250);
  }
  throw new Error('Could not reach Chrome DevTools endpoint');
}

function connect(wsUrl) {
  return new Promise((resolveConn, reject) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    const events = [];
    let id = 0;

    ws.onopen = () =>
      resolveConn({
        send(method, params = {}) {
          const msgId = ++id;
          ws.send(JSON.stringify({ id: msgId, method, params }));
          return new Promise((res, rej) => pending.set(msgId, { res, rej }));
        },
        events,
        close: () => ws.close(),
      });
    ws.onerror = (e) => reject(new Error(`WS error: ${e?.message || 'unknown'}`));
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? '')})`));
        else res(msg.result);
      } else if (msg.method) {
        events.push(msg);
      }
    };
  });
}

let client;
try {
  const target = await getTarget();
  client = await connect(target.webSocketDebuggerUrl);

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Log.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url });
  await sleep(waitMs);

  if (preScript) {
    // Run a setup snippet (e.g. seed localStorage) then reload.
    await client.send('Runtime.evaluate', { expression: preScript, awaitPromise: true });
    await client.send('Page.reload', {});
    await sleep(waitMs);
  }

  if (scrollY) {
    await client.send('Runtime.evaluate', {
      expression: `
        (async () => {
          document.documentElement.style.scrollBehavior = 'auto';
          const target = ${scrollY};
          const steps = 20;
          for (let i = 1; i <= steps; i++) {
            window.scrollTo(0, Math.round(target * (i / steps)));
            await new Promise(r => setTimeout(r, 40));
          }
          window.scrollTo(0, target);
          await new Promise(r => setTimeout(r, 900));
          return window.scrollY;
        })()
      `,
      awaitPromise: true,
    });
    await sleep(1200);
  }

  if (postScript) {
    const res = await client.send('Runtime.evaluate', {
      expression: postScript,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res?.result?.value !== undefined) console.log(`post: ${res.result.value}`);
    else if (res) console.log(`post(raw): ${JSON.stringify(res).slice(0, 400)}`);
    await sleep(Math.max(200, Math.min(1500, waitMs)));
  }

  // Collect console errors for diagnostics
  const errors = client.events    .filter((e) => e.method === 'Log.entryAdded' && e.params?.entry?.level === 'error')
    .map((e) => e.params.entry.text);

  const scrollInfo = await client.send('Runtime.evaluate', {
    expression: `JSON.stringify({ y: window.scrollY, h: document.documentElement.scrollHeight, title: document.title })`,
    returnByValue: true,
  });

  const shot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, Buffer.from(shot.data, 'base64'));

  console.log(`OK ${outFile}`);
  console.log(`state ${scrollInfo.result.value}`);
  if (errors.length) {
    console.log('--- console errors ---');
    errors.slice(0, 10).forEach((e) => console.log('  ' + e));
  }
} catch (err) {
  console.error('QA failed:', err.message);
  process.exitCode = 1;
} finally {
  client?.close();
  child.kill();
}
