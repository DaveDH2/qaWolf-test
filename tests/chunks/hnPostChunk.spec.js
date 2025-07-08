import { test, expect } from '@playwright/test';
import { HackerNewsPage } from '../../pages/hackerNewsPage';
import { generateChunks } from '../../lib/chunking';
import { writeJson } from '../../lib/cache';

const TOTAL_POST = 100;
const CHUNK_SIZE = 30;
const MAX_WORKERS = 4;

const CHUNKS = generateChunks(TOTAL_POST, CHUNK_SIZE, MAX_WORKERS);

test.describe.parallel('Hacker News Chunk', () => {
  CHUNKS.forEach(({ page: pageIndex, range: [globalStart, globalEnd] }, index) => {
    test(`Chunk ${index + 1}: Page ${pageIndex}, Posts ${globalStart}-${globalEnd}`, async ({ page }) => {
      const HNPage = new HackerNewsPage(page);

      await test.step('Go to Hacker News', async () => {
        await HNPage.goto();
      });

      // If this chunk requires clicking 'More' button N times to reach the correct page
      const clicks = index; // index 0 = no click, index 1 = click once, etc.
      for (let i = 0; i < clicks; i++) {
        await test.step(`Click 'More' button (${i + 1})`, async () => {
          const moreLink = await HNPage.waitForPaginationReady();
          await moreLink.click();
          await page.waitForLoadState('networkidle');
        });
      }

      const posts = await test.step('Extract posts from page', async () => {
        const localStart = 0;
        const localEnd = Math.min(CHUNK_SIZE - 1, globalEnd - globalStart);
        return await HNPage.getPostsInRange(localStart, localEnd);
      });

      await test.step('Validate fields on each post', async () => {
        for (const post of posts) {
          expect(post.rank, 'Rank should be defined').toBeDefined();
          expect(post.timestamp, 'Timestamp should be defined').toBeDefined();
          expect(post.title, 'Title should be defined').toBeDefined();
        }
      });

      await test.step('Save timestamp for final sort validation', async () => {
        await writeJson(`posts-${index + 1}.json`, {
          page: pageIndex,
          range: [globalStart, globalEnd],
          posts,
        });
      });

      console.log(
        `✅ Chunk ${index + 1} : Page ${pageIndex} | Range ${globalStart}–${globalEnd} | Fetched: ${posts.length} posts`
      );
    });
  });
});
