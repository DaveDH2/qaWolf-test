import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const CACHE_DIR = path.join(process.cwd(), '.cache');

export async function writeJson(filename, data) {
  await writeFile(path.join(CACHE_DIR, filename), JSON.stringify(data, null, 2));
}

export async function readJson(filename) {
  const raw = await readFile(path.join(CACHE_DIR, filename), 'utf8');
  return JSON.parse(raw);
}