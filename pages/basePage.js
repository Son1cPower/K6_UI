export class BasePage {
  constructor(page) {
    this.page = page;
  }

   async goto(path) {
    return await this.page.goto(path);
    }

    get locator() {
    return this.page.locator.bind(this.page);
  }

  waitForNavigation(options) {
    return this.page.waitForNavigation(options);
  }
}
