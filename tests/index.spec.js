import { test, expect } from '@playwright/test';

test('Loads Hacker News newest page', async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');

  const posts = page.locator('#bigbox tbody tr.athing.submission');
  const count = await posts.count();
  console.log("count", count);

  const start = 0;
  const end = 30;

  const postFromPage = await Promise.all(
    Array.from({ length: end - start }).map(async (_, offset) => {

      const i = start + offset;
      const postRow = posts.nth(i);

      let postObj = {
        title: null,
        postId: null,
        postRank: null,
        time: null
      }


      //Xpath: post id //*[@id="44439280"]
      const postId = await postRow.getAttribute('id');
      if (!postId) return null;
      postObj.postId = postId;

      //Xpath rank: span//*[@id="44439280"]/td[1]/span
      const rankLocator = postRow.locator('xpath=.//td[1]//span[contains(@class,"rank")]');
      const rankRaw = await rankLocator.textContent();
      postObj.postRank = rankRaw ? Number(rankRaw) : null;

      // XPath: next sibling row span.age
      const ageLocator = postRow.locator('xpath=following-sibling::tr[1]//span[@class="age"]');
      const raw = await ageLocator.getAttribute('title');
      if (!raw) return null;

      // Xpath: get title
      const titleLocator = postRow.locator('xpath=.//td[3]//a').first();
      const titleText = await titleLocator.textContent();
      postObj.title = titleText?.trim() ?? null;

      const unixTimeStamp = Number(raw.split(' ')[1]);
      // console.log(`Post ${i + 1} → Unix: ${unixTimeStamp}`);

      postObj.time = unixTimeStamp

      return postObj;
    })
  );



  const sortedPost = [...postFromPage].sort((a, b) => b.time - a.time);
  console.log('All timestamps collected:', postFromPage.length, postFromPage, sortedPost);



  await page.pause();


  const title = await page.title();
  console.log('Page title:', title);
  //expect(title).toContain('Hacker News');
});
