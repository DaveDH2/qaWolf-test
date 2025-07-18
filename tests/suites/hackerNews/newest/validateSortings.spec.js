import { test, expect } from '@playwright/test';
import path, { join } from 'path';
import fs from 'fs/promises';
import { logger } from '../../../../tools/logger.js'
import { resolveRootPath } from '../../../../tools/resolveRootPath.js';
import { generateChunks } from '../../../../lib/chunking.js';
import { HackerNewsPage } from '../../../../pages/hackerNewsPage.js'; 


const TOTAL_POSTS = 100;
const CHUNK_SIZE = 30;

// pull out shard index & count
//const { current, total } = testInfo.config.shard!;

test.describe(`@HN:newest | /newest/ | Sharding -- 1/4  |  Validate first 100 posts are sorted by time (newest -> oldest).`, function () {
    test('First 100 posts should be sorted in descending order by time: [1-30]', async ({ page }) => {
        // const shard = testInfo.config.shard;
        // console.log(typeof testInfo);
        // if (!shard) {
        //     throw logger.error("Shard info is missing - did you forget to pass --shard?")
        // }

        // const { current, total } = shard;

        const chunks = generateChunks(TOTAL_POSTS, CHUNK_SIZE, 4);
        const currentChunk = 1;
        const chunkNumber = 1
        const range = [1,30]
        const end = 30;
        const start = 1;
        // const currentChunk = chunks[current-1];
        // const { page: chunkNumber, range: [start, end] } = currentChunk;
        
        //logger.info(`Worker ${testInfo.workerIndex} -> chunk ${chunkNumber} [${start}-${end}]`);

        const HNPage = new HackerNewsPage(page);

        await test.step('Go to Hacker News', async () => {
            await HNPage.goto();
        });

        const pagesToLoad = Math.ceil(end / CHUNK_SIZE) - 1;  
        for (let i = 0; i < pagesToLoad; i++) {
            await test.step(`Click "More" button ${i + 1}/${pagesToLoad}`, async () => {
                const moreLink = await HNPage.waitForPaginationReady();
                await moreLink.click();
                await page.waitForLoadState('domcontentloaded');
            });
        }

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

        const posts = await test.step(`Extract posts from page ${start}–${end}`, async () => {
            const localStart = start - 1;
            const localEnd = Math.min(30 - 1, 30 - 1);
            return await HNPage.getPostsInRange(localStart, localEnd);
        });

        await test.step('Validate fields on each post', async () => {
            for (const post of posts) {
                expect(post.postRank, 'Rank should be defined').toBeDefined();
                expect(post.time, 'Timestamp should be defined').toBeDefined();
                expect(post.title, 'Title should be defined').toBeDefined();
            }
        });

                expect(allPosts.length, 'Expected exactly 100 posts').toBe(100); // check for 100 posts

        const sortedCopy = [...allPosts].sort((a, b) => b.time - a.time); // descending by time

        // await test.step('Save timestamp for final sort validation', async () => {
        //     await writeJson(`posts-${chunkNumber}.json`, {
        //         page: 2,
        //         range: [31, 60],
        //         posts,
        //     });
        // });

        logger.info(`Page: ${chunkNumber}, Posts: ${range}`);

        

    })
})