import { BasePage } from '../basePage.js';


export class HomePage extends BasePage{

  constructor(page) {
    super(page);
    this.homePageUrl = 'https://awsdripp.drimotors.com/';
    this.homePageHeader = this.locator("//h1[@data-testid='landing-page-hero-title']");
  }

  async openHomePage() {
      await this.goto(this.homePageUrl);
  }

 get homePageHeaderLocator() {
    return this.homePageHeader;
  }
}