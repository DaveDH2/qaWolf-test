import { test, expect } from '@playwright/test';
import { HackerNewsPage } from '../pages/hackerNewsPage.js';

test('Loads Hacker News newest page', async ({ page }) => {

  const HNPage = new HackerNewsPage(page)
  await HNPage.goto()
  
  const moreLink = await HNPage.waitForPaginationReady();

  await page.pause();
  const posts = await HNPage.getPostsInRange(0, 30);

  console.log(`Posts collected: ${posts.length}`);
  console.log(`Post:\n${JSON.stringify(posts, null, 2)}`);


});
