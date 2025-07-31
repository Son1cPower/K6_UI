import { Trend } from 'k6/metrics';

const groupDuration = new Trend('ui_group_duration', true);

/**
 * UI-safe group controller that tracks duration and logs boundaries.
 * 
 * @param {string} name - Group name.
 * @param {() => Promise<void>} fn - Async function containing UI test actions.
 */
export async function groupUI(name, fn) {
  const start = Date.now();
  //  console.log(`🟡 START UI GROUP: ${name}`);

  try {
    await fn();
  } catch (error) {
    console.error(`❌ Error in UI group "${name}":`, error);
    throw error;
  } finally {
    const duration = Date.now() - start;
    groupDuration.add(duration, { group_name: name });
     console.log(`✅ END UI GROUP: ${name} (${duration} ms)`);
  }
}
