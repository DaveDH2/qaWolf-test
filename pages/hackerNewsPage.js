import { expect } from '@playwright/test';
import { PostLocators, HackerNewsLocators } from '../locators';
import { PostItem } from '../components/postItem.js';
import { writeJson, readJson } from '../lib/cache.js';

export class HackerNewsPage {
  constructor(page, path = '/newest') {
    this.page = page;
    this.path = path;
    this.postRow = page.locator(PostLocators.ROW_SELECTOR);
  }

  async goto(pathOverride) {
    const path = pathOverride?.trim() || this.path;
    await this.page.goto(path, { waitUntil: 'networkidle' })
  }

  async waitForPaginationReady() {
    const locator = this.page.locator(HackerNewsLocators.PAGINATION.MORE_LINK);
    await expect(locator).toBeVisible();
    await expect(locator).toHaveText(HackerNewsLocators.PAGINATION.MORE_TEXT)
    return locator;
  }

  async getPostAt(index) {
    const rowLocator = this.postRow.nth(index);
    const post = new PostItem(rowLocator);
    return await post.getPostData();
  }

  async getPostsInRange(start, end) {
    return Promise.all(
      Array.from({ length: end - start }).map(async (_, offset) => {
        const i = start + offset;
        return this.getPostAt(i);
      })
    );
  }
}