import { readRandomUserFromData } from "../../../utils/data-loader.js";
import { loginRequest, getCurrentUser } from "../requests/auth/authServiceRequests.js";
import { extractField } from "../../../utils/extractField.js";
import { handleError } from "../../../utils/helpers.js";
import config from "../../../config/settings.js";


export function loginAsAdmin() {
  const loginRequestBody = readRandomUserFromData("users");

  const headers = {
    "X-API-Key": config.API_KEY,
    "Origin": config.ORIGIN,
    "X-Okapi-Tenant": config.TENANT_CENTRAL,
  };

  const loginRequestRes = loginRequest(loginRequestBody, headers);
  handleError(loginRequestRes, 201);

  const accessToken = extractField(loginRequestRes.cookies, "folioAccessToken[1].value");
  const refreshToken = extractField(loginRequestRes.cookies, "folioRefreshToken[1].value");

  const selfHeaders = {
    ...headers,
    "Cookie": `folioAccessToken=${accessToken}`,
  };

  const currentUserRes = getCurrentUser(selfHeaders);
  const currentUser_id = extractField(currentUserRes, "user.id");
  const servicePoint_id = extractField(currentUserRes, "servicePointsUser.defaultServicePointId");

  return { accessToken, refreshToken, currentUser_id, servicePoint_id };
}
