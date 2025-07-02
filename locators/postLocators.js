export class PostLocators {
    static ATTR = {
        ID: 'id',
    }

    static XPATH = {
        RANK: './/td[1]//span[contains(@class, "rank")]',
        TITLE_LINK: './/span[contains(@class, "titleline")]/a',
        TIME_AGE_SPAN: 'following-sibling::tr[1]//span[@class="age"]'
    }

}
