// import fs from 'fs/promises';
// import path from 'path';
// import { logger } from './tools/logger.js';

// export default async () => {
//   const dirs = [
//     path.join(process.cwd(), '.cache'),
//     path.join(process.cwd(), 'tests', 'hackerNewsChunks')
//   ];

//   for (const dir of dirs) {
//     try {
//       await fs.rm(dir, { recursive: true, force: true });
//       logger.info(`[globalTeardown] Removed: ${dir}`);
//     } catch (err) {
//       logger.warn(`[globalTeardown] Failed to remove ${dir}:`, err.message || err);
//     }
//   }
// };
