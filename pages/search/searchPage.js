import { BasePage } from '../basePage.js';

export class SearchPage extends BasePage {

  constructor(page) {
    super(page);
    this.searchInput = this.locator("//input[@placeholder='Search for make, model, or keyword']");
    this.searchHeader = this.locator("//h2[normalize-space()='Find your payment comfort zone']");
  }

  async searchByKeyword(keyword) {
    await this.searchInput.type(keyword);
    await this.searchInput.press('Enter');
  }

    get searchHeaderLocator() {
      return this.searchHeader;
  }

  searchFilter(keyword) {
      return this.locator(`//li[@data-testid='filter-item${keyword}']`);
  }
}