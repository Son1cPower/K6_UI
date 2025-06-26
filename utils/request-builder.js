import config from "../config/settings.js";

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-API-Key': config.API_KEY,
  'Origin': config.ORIGIN,
};



/**
 * Builds request parameters for HTTP requests
 * @param {Object} params
 * @param {string} [params.accessToken] - Access token to set in Cookie header
 * @param {Object} [params.query] - Query parameters
 * @param {Object} [params.tags] - Tags for K6 metrics
 * @param {Object} [params.headers] - Additional headers
 * @param {number} [params.timeout] - Request timeout
 * @param {boolean} [params.checkBodyLength] - Check response body length
 * @param {boolean} [params.validateStatus] - Check if status is 2xx
 * @param {string} [params.name] - Request name for K6 check
 * @returns {Object}
 */
function buildRequestParams({
  accessToken,
  query = {},
  tags = {},
  headers = {},
  timeout = 30000,
  checkBodyLength = true,
  validateStatus = true,
  name = ''
} = {}) {
  const allHeaders = {
    ...DEFAULT_HEADERS,
    ...headers,
  };

  if (accessToken) {
    allHeaders['Cookie'] = `folioAccessToken=${accessToken}`;
  }

  return {
    timeout,
    query,
    headers: allHeaders,
    tags,
    options: {
      checkBodyLength,
      validateStatus,
      name,
      tags,
    }
  };
}


/**
 * Returns a reusable parameter factory function
 * @param {Object} staticParams - Parameters that are always applied
 * @returns {(dynamicParams: {
 *   query?: Object,
 *   tags?: Object,
 *   headers?: Object,
 *   timeout?: number,
 *   checkBodyLength?: boolean,
 *   validateStatus?: boolean,
 *   name?: string
 * }) => Object} Function to merge dynamic params with static ones
 */
export function buildParamFactory(staticParams = {}) {
  return (
     /**
     * @param {Object} dynamicParams
     * @param {Object} [dynamicParams.query]
     * @param {Object} [dynamicParams.tags]
     * @param {Object} [dynamicParams.headers]
     * @param {number} [dynamicParams.timeout]
     * @param {boolean} [dynamicParams.checkBodyLength]
     * @param {boolean} [dynamicParams.validateStatus]
     * @param {string} [dynamicParams.name]
     */
    dynamicParams = {}) => {
    return buildRequestParams({
      ...staticParams,
      ...dynamicParams,
      headers: {
        ...(staticParams.headers || {}),
        ...(dynamicParams.headers || {})
      }
    });
  };
}









/* ============================================================================
   📘 HOW TO USE buildParamFactory IN STEPS FILE
   ============================================================================

   ✅ Suppose you already have an `accessToken` from the login step.
   ✅ You can build a reusable `requestParams` function using buildParamFactory.
   ✅ Then, pass dynamic per-request values to it.

   Example:
============================================================================ */

/* eslint-disable no-unused-vars */
if (false) {
  const accessToken = "your-access-token";

  // 🔧 Step 1: Create a reusable factory for request parameters
  const requestParams = buildParamFactory({
    accessToken,  // Automatically adds `Cookie: folioAccessToken=...`
    headers: {
      "X-Okapi-Tenant": config.TENANT_CENTRAL  // Applied to every request
    }
  });

  // 🔁 Step 2: Create request params for a specific HTTP call
  const listUsersParams = requestParams({
    query: {
      "cql.allRecords": "1",  // Will be added to URL like ?cql.allRecords=1
      "limit": "1000"
    },
    tags: {
      name: "List Users",     // Used in k6 metrics/checks
      service: "UserService"
    },
    name: "GET /users",        // Will show up in check messages
    validateStatus: true,      // Adds a check: response status is 2xx
    checkBodyLength: true      // Adds a check: response body is not empty
  });

  // Example usage:
  // const res = get(`${config.BASE_URL}/users`, listUsersParams);
}
/* eslint-enable no-unused-vars */

