import { HomePage } from '../pages/home/homePage.js';
import { LoginPage } from '../pages/login/loginPage.js';
import { MainToolbar } from '../pages/baseComponents/mainToolbar.js';
import { SearchPage } from './search/searchPage.js';

export function pageManager(page) {
  return {
    homePage: new HomePage(page),
    loginPage: new LoginPage(page),
    mainToolbar: new MainToolbar(page),
    searchPage: new SearchPage(page),
  };
}