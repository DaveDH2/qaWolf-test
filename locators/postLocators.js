import { BaseLocator } from "./baseLocators";

export class PostLocators extends BaseLocator {
    static ROW_SELECTOR = 'tr.athing';

    static ATTR = {
        ID: 'id',
    }
    
    static XPATH = {
        RANK: './/td[1]//span[contains(@class, "rank")]',
        TITLE_LINK: './/span[contains(@class, "titleline")]/a',
        TIME_AGE_SPAN: 'following-sibling::tr[1]//span[@class="age"]'
    }

}
