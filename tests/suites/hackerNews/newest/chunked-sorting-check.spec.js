import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import path, { join } from 'path';
import { exec } from 'child_process';
import { logger } from '../../../../tools/logger.js'
import { resolveRootPath } from '../../../../tools/resolveRootPath.js';

const JSON_DIR = resolveRootPath('./.cache');
const DEBUG_DIR = path.resolve('.cache/debug');
const scriptPath = resolveRootPath('tools/generateChunkSpecs.js');
const chunkTestDir = resolveRootPath('tests/hackerNewsChunks');

test.describe('@HN:newest | /newest/ | Validate first 100 posts are sorted by time (newest -> oldest).', () => {
   
    let allPosts = [];

    test.beforeAll(async () => {
  
        // Step 1: Generate chunk specs
        await test.step('Generate chunk spec files.', async () => {
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
        await test.step('Run all chunk test files.', async () => {
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

        // Step 3: Load and collect all JSON results

            const all = [];

            for (const file of jsonFiles) {
                const content = await fs.readFile(path.join(JSON_DIR, file), 'utf-8');
                const parsed = JSON.parse(content);

                for (const post of parsed.posts) {
                    all.push({
                        ...post,
                        fromPage: parsed.page,
                        range: parsed.range,
                        sourceFile: file,
                    });
                }
            }

            return all;
        });
    })

    test('First 100 posts should be sorted in descending order by time', async () => {

        expect(allPosts.length, 'Expected exactly 100 posts').toBe(100); // check for 100 posts

        const sortedCopy = [...allPosts].sort((a, b) => b.time - a.time); // descending by time

        await fs.mkdir(DEBUG_DIR, { recursive: true }); // make sure directory exists

        await fs.writeFile(
            path.join(DEBUG_DIR, 'allPosts.json'),
            JSON.stringify(allPosts, null, 2),
            'utf-8'
        );

        await fs.writeFile(
            path.join(DEBUG_DIR, 'sortedCopy.json'),
            JSON.stringify(sortedCopy, null, 2),
            'utf-8'
        );

        const mismatches = allPosts
            .map((post, i) => ({
                index: i,
                actualTitle: post.title,
                actualTime: post.time,
                expectedTitle: sortedCopy[i].title,
                expectedTime: sortedCopy[i].time
            }))
            .filter(m => m.actualTime !== m.expectedTime);

        expect(mismatches.length, mismatches.length === 0
            ? 'All 100 posts are correctly sorted by time (newest -> oldest).'
            : `Found ${mismatches.length} post(s) out of order in sort check.`
        ).toBe(0);

        if (mismatches.length > 0) {
            console.warn(`Found ${mismatches.length} post(s) out of order:`);
            mismatches.forEach(m => {
                console.info(
                    `Mismatch at index ${m.index}:\n` +
                    `Actual: "${m.actualTitle}" (time: ${m.actualTime})\n` +
                    `Expected: "${m.expectedTitle}" (time: ${m.expectedTime})\n`
                );
            });
        }

    });
});