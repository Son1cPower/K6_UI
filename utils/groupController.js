import { Trend } from "k6/metrics";

// Custom metric to measure the total execution time of a group
const groupDuration = new Trend("group_duration", true); // `true` ensures metrics are collected for each virtual user (VU)

/**
 * Custom function wrapper for group execution
 *
 * @param {string} groupName - The name of the group
 * @param {function} fn - The function containing the group's logic to execute
 * @param {number} iterations - The number of times to repeat the group (default is 1)
 */
export function groupController(groupName, fn, iterations = 1) {
  const start = Date.now(); // Record the start time of the group

  for (let i = 0; i < iterations; i++) {
    // console.log(`Iteration ${i + 1} of group: ${groupName}`); // Logging for debugging purposes
    fn(); // Execute the provided group's logic
  }

  const duration = Date.now() - start; // Calculate the total execution time of the group
  groupDuration.add(duration, { group_name: groupName }); // Record the total time for the custom metric with the group name as a tag

  // Log the total execution time of the group
  // console.log(`Group "${groupName}" executed in ${duration} ms.`);
}