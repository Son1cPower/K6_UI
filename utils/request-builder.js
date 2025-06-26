import config from "../config/settings.js";

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-API-Key': config.API_KEY,
  'Origin': config.ORIGIN,
};

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

export function buildParamFactory(staticParams = {}) {
  return (dynamicParams = {}) => {
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



// HOW TO USE IN STEPS FOLDER
const EXAMPLE = buildRequestParams({
// Auth and environment settings
  accessToken: "your-access-token",     // sets the Authorization cookie
//   tenant: "your-tenant-id",             // sets the X-Okapi-Tenant header

  // Query parameters (will be added to URL like ?limit=10&offset=0)
  query: {
    limit: 10,
    offset: 0,
    "cql.allRecords": "1"
  },

  // Extra or custom headers
  headers: {
    "X-Custom-Header": "value"
  },

  // Tags for k6 checks and metrics
  tags: {
    name: "CreateUser",
    service: "UserService"
  },

  // Disable body presence check in response (default: true)
  checkBodyLength: false,

  // Disable status 2xx check (default: true)
  validateStatus: false
});