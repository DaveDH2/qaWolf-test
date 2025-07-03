import { PostLocators } from "../locators/postLocators";

export class PostItem {
    constructor(locator) {
        this.locator = locator; // single post from row (tr.athing)
    }

    async getPostData() {
        const postId = await this.locator.getAttribute(PostLocators.ATTR.ID);
        if (!postId) return null;

        const rankRaw = await this.locator.locator(PostLocators.asXPath(`${PostLocators.XPATH.RANK}`)).textContent();
        const postRank = rankRaw ? Number(rankRaw) : null;

        const titleRaw = await this.locator.locator(PostLocators.asXPath(`${PostLocators.XPATH.TITLE_LINK}`)).first().textContent();
        const title = titleRaw?.trim() ?? null;

        const ageLocator = this.locator.locator(PostLocators.asXPath(`${PostLocators.XPATH.TIME_AGE_SPAN}`));
        const ageRaw = await ageLocator.getAttribute('title');
        if (!ageRaw) return null;

        const time = Number(ageRaw.split(" ")[1]);
        if (!time) return null;

        return {
            postId,
            postRank,
            title,
            time
        }
    }
}