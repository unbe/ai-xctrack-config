import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function localXcfgPlugin(): Plugin {
  return {
    name: 'local-xcfg-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url || '';
        const url = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);

        if (url.pathname === '/api/local-examples') {
          try {
            const rootDir = process.cwd();
            const entries = await fs.promises.readdir(rootDir, { withFileTypes: true });
            const xcfgNames = entries
              .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.xcfg'))
              .map((e) => e.name);

            const files = [];
            for (const name of xcfgNames) {
              const fullPath = path.join(rootDir, name);
              const stat = await fs.promises.stat(fullPath);
              let portraitPages = 0;
              let landscapePages = 0;
              let deviceName: string | null = null;
              let exportType: string | null = null;

              try {
                const content = await fs.promises.readFile(fullPath, 'utf-8');
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed.pages)) {
                  portraitPages = parsed.pages.length;
                } else if (parsed.layout) {
                  if (Array.isArray(parsed.layout.portrait)) {
                    portraitPages = parsed.layout.portrait.length;
                  }
                  if (Array.isArray(parsed.layout.landscape)) {
                    landscapePages = parsed.layout.landscape.length;
                  }
                }
                if (parsed.info?.device) {
                  deviceName = parsed.info.device;
                }
                if (parsed.info?.exportType) {
                  exportType = parsed.info.exportType;
                }
              } catch {
                // Ignore parse errors for metadata preview
              }

              files.push({
                name,
                size: stat.size,
                mtime: stat.mtimeMs,
                portraitPages,
                landscapePages,
                totalPages: portraitPages + landscapePages,
                deviceName,
                exportType,
              });
            }

            // Sort most recently modified first
            files.sort((a, b) => b.mtime - a.mtime);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, files }));
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message || String(err) }));
            return;
          }
        }

        if (url.pathname === '/api/local-examples/file') {
          const filename = url.searchParams.get('name');
          if (!filename || filename.includes('/') || filename.includes('\\') || !filename.toLowerCase().endsWith('.xcfg')) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Invalid or prohibited filename' }));
            return;
          }

          const fullPath = path.join(process.cwd(), filename);
          try {
            const content = await fs.promises.readFile(fullPath, 'utf-8');
            const data = JSON.parse(content);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, filename, data }));
            return;
          } catch (err: any) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message || 'File not found' }));
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localXcfgPlugin()],
  server: {
    port: 3000,
    host: true,
  },
});
