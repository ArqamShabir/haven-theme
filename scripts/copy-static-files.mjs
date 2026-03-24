import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const source = path.join(rootDir, 'public', '.htaccess');
const distDir = path.join(rootDir, 'dist');
const target = path.join(distDir, '.htaccess');

await mkdir(distDir, { recursive: true });
await copyFile(source, target);
