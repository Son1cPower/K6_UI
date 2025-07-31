import { check } from 'k6';

//  USED SELECTOR
// export async function assertVisible(page, selector, assertName) {
//   try {
//     await page.waitForSelector(selector, { state: 'visible', timeout: 15000 });
//     const isVisible = await page.locator(selector).isVisible();
//     check(page, {
//       [`✅ ${assertName || `Visible: ${selector}`}`]: () => isVisible
//     });
//   } catch (e) {
//     check(page, {
//       [`❌ ${assertName || `Selector not visible: ${selector}`}`]: () => false
//     });
//     console.error(`❌ [assertVisible] Selector "${selector}" is not visible or failed to load. Error:\n`, e);
//   }
// }




//  USED LOCATOR
// export async function assertVisible(locator, assertName) {
//   try {
    
//     await locator.waitFor({ state: 'visible', timeout: 15000 });
//     const isVisible = await locator.isVisible();
//     check(null, {
//       [`✅ ${assertName || 'Element is visible'}`]: () => isVisible
//     });
//   } catch (e) {
//     check(null, {
//       [`❌ ${assertName || 'Element not visible'}`]: () => false
//     });
//     console.error(`❌ [assertVisible] Element is not visible or failed to load. Error:\n`, e);
//   }
// }


// V2
// export async function assertVisible(locator, assertName = 'Element') {
//   try {
//     await locator.waitFor({ state: 'visible', timeout: 15000 });
//     const isVisible = await locator.isVisible();
//     check(null, {
//       [`✅ ${assertName} is visible`]: () => isVisible
//     });
//   } catch (e) {
//     check(null, {
//       [`❌ ${assertName} is NOT visible`]: () => false
//     });
//     console.error(`❌ [assertVisible] '${assertName}' is not visible or failed to load.\nError:`, e);
//   }
// }

// V3
export async function assertVisible(locator, assertName = '') {
  try {
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    const isVisible = await locator.isVisible();
    const nameToShow = assertName || locator._selector || 'Element';

    check(null, {
      [`✅ ${nameToShow} is visible`]: () => isVisible
    });
  } catch (e) {
    const nameToShow = assertName || locator._selector || 'Element';
    check(null, {
      [`❌ ${nameToShow} is NOT visible`]: () => false
    });
    console.error(`❌ [assertVisible] '${nameToShow}' is not visible or failed to load.\nError:`, e);
  }
}