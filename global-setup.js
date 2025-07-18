import fs from 'fs/promises';
import path from 'path';
import { logger } from './tools/logger.js';

export default async () => {
  const dirs = [
    path.join(process.cwd(), '.cache')
  ];

  try {
    for (const dir of dirs) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
        await fs.mkdir(dir, { recursive: true });
        logger.info(`[globalSetup] Reset and recreated: ${dir}`);
      } catch (err) {
        logger.error(`[globalSetup] Failed to setup ${dir}:`, err);
        process.exit(1);
      }
    }
  } catch (err) {
    logger.error('[globalSetup] Unexpected failure:', err);
    process.exit(1);
  }
};