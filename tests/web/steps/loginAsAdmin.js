import { readRandomUserFromData } from "../../../utils/data-loader.js";
import { loginRequest, getCurrentUser } from "../requests/auth/authServiceRequests.js";
import { extractField } from "../../../utils/extractField.js";
import { handleError } from "../../../utils/helpers.js";
import config from "../../../config/settings.js";
import { buildParamFactory } from '../../../utils/request-builder.js';


export function loginAsAdmin() {
  const requestParams = buildParamFactory({headers: {
    "X-API-Key": config.API_KEY,
    "Origin": config.ORIGIN,
    "X-Okapi-Tenant": config.TENANT_CENTRAL,
  }});

  // ========== STEP 1: Log In ==========
  const loginRequestBody = readRandomUserFromData();
  const loginRequestParams = requestParams()

  const loginRequestRes = loginRequest(loginRequestBody, loginRequestParams);
  handleError(loginRequestRes, 201);

  const accessToken = extractField(loginRequestRes.cookies, "folioAccessToken[1].value");
  const refreshToken = extractField(loginRequestRes.cookies, "folioRefreshToken[1].value");

   // ========== STEP 2: Get Current User ==========
  const currentUserParams =requestParams( {
    headers: {
      "Cookie": `folioAccessToken=${accessToken}`,
  }});

  const currentUserRes = getCurrentUser(currentUserParams);
  const currentUser_id = extractField(currentUserRes, "user.id");
  const servicePoint_id = extractField(currentUserRes, "servicePointsUser.defaultServicePointId");

  return { accessToken, refreshToken, currentUser_id, servicePoint_id };
}
