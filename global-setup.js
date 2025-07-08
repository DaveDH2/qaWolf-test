import fs from 'fs/promises';
import path from 'path';

export default async () => {
  const CACHE_DIR = path.join(process.cwd(), '.cache');

  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    console.log(`[globalSetup] Ensured .cache/ exists at ${CACHE_DIR}`);
  } catch (err) {
    console.error(`Failed to create .cache folder:`, err);
    process.exit(1);
  }
};