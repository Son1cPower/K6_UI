import { browser } from 'k6/browser';
import { groupUI } from '../../utils/groupUI.js';
import { pageManager } from '../../pages/pageManager.js';
import {assertVisible} from '../../utils/assertVisible.js';


export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
};

export default async function () {
const page = await browser.newPage();
const pm = pageManager(page);

  try {


    await groupUI('001 - Open Homepage', async () => {
        await pm.homePage.openHomePage();
        await assertVisible(pm.homePage.homePageHeaderLocator, 'Home page loaded');
           });
// sleep(1);
    await groupUI('002 - Open Sign In form', async () => {
                await pm.mainToolbar.openSignInForm();
                 await assertVisible(pm.loginPage.signInHeaderLocator, 'Sign In page is visible');   
    });
// sleep(1);
    await groupUI('003 - Login user', async () => {
      await pm.loginPage.login('eefveeb@mailto.plus', 'Test@2025');
      const userLabel  = pm.mainToolbar.getUserLabelSelector('Testing');
      await assertVisible(userLabel, 'User is authorized');
    });
// sleep(1);
    await groupUI('004 - Open Search page', async () => {
      await pm.mainToolbar.openSearch();
      await assertVisible(pm.searchPage.searchHeaderLocator, 'Search page is visible');
    });
// sleep(1);
    await groupUI('005 - Perform Search', async () => {
      await pm.searchPage.searchByKeyword('BMW');
      await assertVisible(pm.searchPage.searchFilter('BMW'), 'Search was applied');  
    });
// sleep(1);



  } finally {
    await page.close();
  }
}
