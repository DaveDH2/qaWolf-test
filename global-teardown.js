import fs from 'fs/promises';
import path from 'path';

export default async () => {
  const dir = path.join(process.cwd(), '.cache');
  await fs.rm(dir, { recursive: true, force: true });
  console.log(`[globalTeardown] Removed ${dir}`);
};
