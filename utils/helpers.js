// Helper function to handle error
export function handleError(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    console.error(`Expected status ${expectedStatus} but got ${response.status}`);
    console.error(`Response body: ${response.body}`);
    throw new Error(`=========Request failed with status=====> ${response.status}`);
  }
}


// Helper function to generate Random String
export function generateRandomString(length, chars = 'abcdefghijklmnopqrstuvwxyz') {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}



/**
 * Get current date in format 'yyyy-mm-dd hh:MM:ss'
 * @returns {string}
 */
export function getStartDate(){
    const date = new Date().toISOString()
    return date
        .split("T").join(" ")
        .replace("Z", "")
        .substring(0, date.length-5)
}