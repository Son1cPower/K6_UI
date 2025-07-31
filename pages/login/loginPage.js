import { BasePage } from '../basePage.js';

export class LoginPage extends BasePage {

  constructor(page) {
    super(page);
    this.emailInput = this.locator('#signin-email');
    this.passwordInput = this.locator('#signin-password');
    this.submitButton = this.locator("//button[@type='submit']");
    this.signInHeader = this.locator("//h4[contains(text(),'Sign in to your account')]");
  }

  async login(username, password) {
    await this.emailInput.type(username);
    await this.passwordInput.type(password);
    
    await Promise.all([
    this.submitButton.click(),
    this.waitForNavigation(),
  ]);   
  }

  get signInHeaderLocator() {
    return this.signInHeader;
  }
}
