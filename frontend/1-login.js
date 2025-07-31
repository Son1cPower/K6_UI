import { browser, expect  } from 'k6/browser';
import { check, sleep } from 'k6';
import { groupUI } from '../utils/groupUI.js';


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

  try {
    await visitHomepage(page);
    // sleep(1);
    await openSignInForm(page);
    //  sleep(1);
    await submitLogin(page);
    //  sleep(1);
    await clickSearch(page);
    //  sleep(4);
    await doSearch(page);
  } finally {
    await page.close();
  }
}

async function visitHomepage(page) {
 await  groupUI('001 - Visit Homepage', async () => {

  let res = await page.goto('https://awsdripp.drimotors.com/');

//   await page.waitForLoadState('networkidle');
//   console.log('Page loaded:', res.status());
  check(page, {'Page loaded': (p) => p.url() === 'https://awsdripp.drimotors.com/',});
}



  )};


async function openSignInForm(page) {
  await groupUI('002 - Open Sign In form', async () => {

  await page.locator("//span[normalize-space()='Sign In']").click();
//   await page.waitForLoadState('networkidle');

  await page.waitForSelector("//h4[contains(text(),'Sign in to your account')]", {
    state: 'visible',
    timeout: 15000,
  });

  let isVisible = await page.locator("//h4[contains(text(),'Sign in to your account')]").isVisible();
  check(page, {'Sign In page is visible': () => isVisible,});

  //  await expect(page.locator("//h4[contains(text(),'Sign in to your account')]")).toBeVisible('Sign In form is visible');
  // await expect(page.locator("//h4[contains(text(),'Sign in to your account')]")).toHaveText('Sign in to your account', 'Sign In form has correct title');
})}

async function submitLogin(page) {
  await groupUI('003 - Add login credentials', async () => {

  await page.locator("#signin-email").type('eefveeb@mailto.plus');
  await page.locator("#signin-password").type('Test@2025');
  await page.locator('//button[@type="submit"]').click();
//   await page.waitForLoadState('networkidle');

  
//   await page.waitForSelector("//h1[contains(text(),'Let’s verify your insurance')]", {
//     state: 'visible',
//     timeout: 15000,
//   });

//   let isVisible = await page.locator("//h1[contains(text(),'Let’s verify your insurance')]").isVisible();
//   check(page, {'Insurance-verification is visible': () => isVisible,
//   });

// await page.waitForLoadState('networkidle');
  await page.waitForSelector("//p[contains(text(),'Testing')] | //p[contains(text(),'User')]", {
    state: 'visible',
    timeout: 15000,
  });

  let isVisible = await page.locator("//p[contains(text(),'Testing')] | //p[contains(text(),'User')]").isVisible();
  check(page, {'User is authorized': () => isVisible,});
})}


async function clickSearch(page) {
 await  groupUI('004 - Click Search', async () => {
  await page.locator("//span[normalize-space()='Search']").click();


//  await page.waitForLoadState('networkidle');
  await page.waitForSelector("//h2[normalize-space()='Find your payment comfort zone']", {
    state: 'visible',
    timeout: 15000,
  });

  let isVisible = await page.locator("//h2[normalize-space()='Find your payment comfort zone']").isVisible();
  check(page, {'Search page is visible': () => isVisible,});
  
})}




async function doSearch(page) {
 await  groupUI('005 - Do Search', async () => {
  await page.locator("//input[@placeholder='Search for make, model, or keyword']").type('BMW');
  await page.locator("//input[@placeholder='Search for make, model, or keyword']").press('Enter');


//  await page.waitForLoadState('networkidle');
  await page.waitForSelector("//li[@data-testid='filter-itemBMW']", {
    state: 'visible',
    timeout: 15000,
  });

  let isVisible = await page.locator("//li[@data-testid='filter-itemBMW']").isVisible();
  check(page, {'Search filter is applied': () => isVisible,});
  
})}