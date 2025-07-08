import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import { exec } from 'child_process';
import { generateChunks } from '../lib/chunking.js';
import { logger } from '../tools/logger.js';

const TOTAL_POST = 100;
const CHUNK_SIZE = 30;
const MAX_WORKERS = 4;

const OUTPUT_DIR = './tests/hackerNewsChunks';
const TEMPLATE_PATH = './tools/templates/hnChunkTemplate.spec.ejs';

const CHUNKS = generateChunks(TOTAL_POST, CHUNK_SIZE, MAX_WORKERS);

async function ensureDirExistsAndClean(dir, extension = '.spec.js') {
  try {
    await fs.mkdir(dir, { recursive: true });

    const files = await fs.readdir(dir);
    const deletions = files
      .filter(file => file.endsWith(extension))
      .map(file => fs.unlink(path.join(dir, file)));

    if (deletions.length > 0) {
      logger.info(`Cleaning up ${deletions.length} old files in ${dir}...`);
      await Promise.all(deletions);
    }
  } catch (err) {
    logger.error(`Failed to prepare directory: ${dir}`, err);
    throw err;
  }
}

async function generateSpecs() {
  await ensureDirExistsAndClean(OUTPUT_DIR);

  const files = await Promise.all(
    CHUNKS.map(async ({ page: pageIndex, range }, chunkId) => {
      const [globalStart, globalEnd] = range;

      const rendered = await ejs.renderFile(TEMPLATE_PATH, {
        chunkId,
        pageIndex,
        globalStart,
        globalEnd,
        chunkSize: CHUNK_SIZE,
      });

      const outputPath = path.join(OUTPUT_DIR, `chunk-${chunkId}.spec.js`);
      await fs.writeFile(outputPath, rendered);
      logger.info(`Wrote: ${outputPath}`);
      return outputPath;
    })
  );

  return files;
}

function formatWithPrettier(files) {
  const fileList = files.join(' ');
  exec(`npx prettier --write ${fileList}`, (err, stdout, stderr) => {
    if (err) {
      logger.error('Prettier failed:', err);
    }

    if (stdout) {
      logger.info('Prettier output:\n' + stdout);
    }

    if (stderr) {
      logger.warn('Prettier warnings:\n' + stderr);
    }
  });
}

(async () => {
  try {
    logger.info('Starting chunk spec generation...');
    const files = await generateSpecs();
    logger.info(`Generated ${files.length} chunk test files in ${OUTPUT_DIR}`);
    formatWithPrettier(files);
  } catch (err) {
    logger.error('Error during spec generation:', err);
  }
})();
