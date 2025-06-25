import { STAGES } from "../config/workloads.js";
import { THRESHOLD } from "../config/thresholds.js";
import { get, post, put, del,patch, batch} from "../utils/http-requests.js";
import { readRandomUserFromData } from "../utils/data-loader.js";
import { group, sleep } from "k6";
import config from "../config/settings.js";
import { handleError } from '../utils/helpers.js';
import { extractField } from '../utils/extractField.js';



export const options = {
  stages: STAGES.smoke,
  thresholds: THRESHOLD,
};

const body = readRandomUserFromData("users");

export function login() {
    const loginBody = readRandomUserFromData("users");
    let res = post(`${config.BASE_URL}/authn/login-with-expiry`, loginBody, {
      headers: {
        "X-API-Key": config.API_KEY,
        "Origin": config.ORIGIN,
        "X-Okapi-Tenant": config.TENANT_CENTRAL,
      },
    });
    
    handleError(res, 201);
    
    const accessToken = extractField(res.cookies, 'folioAccessToken[1].value');
    const refreshToken = extractField(res.cookies, 'folioRefreshToken[1].value');

    res = get(`${config.BASE_URL}/bl-users/_self`, {
      headers: {
        "X-API-Key": config.API_KEY,
        "Origin": config.ORIGIN,
        "X-Okapi-Tenant": config.TENANT_CENTRAL,
        "Cookie": `folioAccessToken=${accessToken}`
      },
    }); 
    
    sleep(1);
    return { accessToken, refreshToken };
}
