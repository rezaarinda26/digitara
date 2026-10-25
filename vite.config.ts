import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/**
 * Dev-only endpoint used by the CMS "Apply to Code" action: writes the current
 * content snapshot into `src/data/appliedCMS.json` so it becomes part of the
 * source (and therefore part of the next build) for every browser.
 */
const cmsApplyPlugin = (): Plugin => ({
  name: 'digitara-cms-apply',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__cms/apply', (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('Method Not Allowed');
        return;
      }
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (!parsed || !parsed.config || !parsed.hero || !parsed.services) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'Invalid CMS payload' }));
            return;
          }
          const target = path.resolve(server.config.root, 'src/data/appliedCMS.json');
          const snapshot = { ...parsed, __appliedAt: new Date().toISOString() };
          fs.writeFileSync(target, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: String(error) }));
        }
      });
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cmsApplyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
