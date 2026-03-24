import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { mkdir, writeFile } from "node:fs/promises";

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');

const parseJsonBody = async (req: NodeJS.ReadableStream) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const siteDataWriter = (): Plugin => ({
  name: "site-data-writer",
  configureServer(server) {
    server.middlewares.use('/__site-data', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('Method Not Allowed');
        return;
      }

      try {
        const parsed = await parseJsonBody(req);
        const targetDir = path.resolve(__dirname, 'src', 'data');
        const targetFile = path.join(targetDir, 'site-data.json');

        await mkdir(targetDir, { recursive: true });
        await writeFile(targetFile, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false }));
      }
    });

    server.middlewares.use('/__upload-images', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('Method Not Allowed');
        return;
      }

      try {
        const parsed = await parseJsonBody(req);
        const files = Array.isArray(parsed.files) ? parsed.files : [];
        const uploadsDir = path.resolve(__dirname, 'public', 'uploads');

        await mkdir(uploadsDir, { recursive: true });

        const writtenFiles = await Promise.all(
          files.map(async (file: { name?: string; dataUrl?: string }) => {
            const originalName = sanitizeFileName(file.name || 'image');
            const ext = path.extname(originalName) || '.png';
            const baseName = path.basename(originalName, ext) || 'image';
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}${ext}`;
            const targetFile = path.join(uploadsDir, fileName);
            const match = (file.dataUrl || '').match(/^data:.*?;base64,(.*)$/);

            if (!match) {
              throw new Error('Invalid image payload');
            }

            await writeFile(targetFile, Buffer.from(match[1], 'base64'));

            return { url: `/uploads/${fileName}` };
          })
        );

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true, files: writtenFiles }));
      } catch {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false }));
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), siteDataWriter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
