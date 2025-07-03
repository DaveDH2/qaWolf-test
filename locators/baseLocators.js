export class BaseLocators {
    static asXPath(expr) {
        return `xpath=${expr}`;
    }

    static asCSS(expr) {
        return expr;
    }


}