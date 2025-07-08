import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { logger } from '../../../tools/logger.js'
import { resolveRootPath } from '../../../tools/resolveRootPath.js';

const JSON_DIR = './tmp'
const scriptPath = resolveRootPath('tools/generateChunkSpecs.js');
const chunkTestDir = resolveRootPath('tests/hackerNewsChunks');

test.describe('@HN @HN:newest @orchestrator HN:newest:posts', () => {
    test('Validate post order across all chunks', async () => {
        // Step 1: Generate chunk specs
        await test.step('Generate chunk spec files', async () => {
            logger.info('Running generator script ...');
            await new Promise((resolve, reject) => {
                exec(`node ${scriptPath}`, (err, stdout, stderr) => {
                    if (err) return reject(err);
                    logger.info(stdout);
                    if (stderr) logger.warn(stderr);
                    resolve();
                });
            });
        });

        // Step 2: Run the chunk test in parallel

        await test.step('Run all chunk test files', async () => {
            logger.info('Running chunk specs ...');
            await new Promise((resolve, reject) => {
                exec(`npx playwright test ${chunkTestDir} --reporter=line --workers=4`, (err, stdout, stderr) => {
                    logger.info(stdout);
                    if (stderr) logger.warn(stderr);
                    if (err) return reject(err);
                    resolve();
                })
            })
        })

    });
});