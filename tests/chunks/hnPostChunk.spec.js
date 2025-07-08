import { test, expect } from '@playwright/test';
import { HackerNewsPage } from '../../pages/hackerNewsPage';
import { generateChunks } from '../../lib/chunking';
import { writeJson } from '../../lib/cache';

const TOTAL_POST = 100;
const CHUNK_SIZE = 30;
const MAX_WORKERS = 4;


// generateChunksWithPage(100, 30, 4)
//
// [
//   { page: 1, range: [0, 29] },
//   { page: 2, range: [30, 59] },
//   { page: 3, range: [60, 89] },
//   { page: 4, range: [90, 99] }
// ]

const CHUNKS = generateChunks(TOTAL_POST, CHUNK_SIZE, MAX_WORKERS);

test.describe.parallel('Hacker News Chunk', () => {
  CHUNKS.forEach(({ page: pageIndex, range: [globalStart, globalEnd] }, index) => {
    test(`Chunk ${index + 1}: page: ${pageIndex}, posts ${globalStart}-${globalEnd}`, async ({ page }) => {
      const HNPage = new HackerNewsPage(page);
      await HNPage.goto();

      const clicks = index; // index 0 = no click, index 1 = click once,
      for (let i = 0; i < clicks; i++) {
        const moreLink = await HNPage.waitForPaginationReady();
        await moreLink.click();
        await page.waitForLoadState('networkidle');
      }

      //expect(posts.length).toBe(end - start + 1);
      const localStart = 0;
      const localEnd = Math.min(CHUNK_SIZE - 1, globalEnd - globalStart);
      const posts = await HNPage.getPostsInRange(localStart, localEnd);

      //expect(posts.length).toBe(localEnd - localStart + 1);


      await writeJson(`posts-${index + 1}.json`, {
        page,
        range: [globalStart, globalEnd],
        posts,
      });

      console.log(
        `Chunk ${index + 1} : Page ${pageIndex} | Range ${globalStart}–${globalEnd} | Fetched: ${posts.length} posts`
      );

    });
  });
});
