import { BasePage } from '../basePage.js';


export class MainToolbar extends BasePage {    

  constructor(page) {
    super(page);
    this.searchTab = this.locator("//span[normalize-space()='Search']");
    this.signInBtn = this.locator("//span[normalize-space()='Sign In']");
  }

  async openSignInForm() {
await Promise.all([
       this.signInBtn.click(),
       this.waitForNavigation(),
  ]);  
  }

  getUserLabelSelector(username) {
     return this.locator(`//p[contains(text(),'${username}')]`);
  }

    async openSearch() {
    await this.searchTab.click();
  }
}




