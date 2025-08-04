import { check } from 'k6';

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