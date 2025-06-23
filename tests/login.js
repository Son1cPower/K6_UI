import { STAGES } from "../config/workloads.js";
import { THRESHOLD } from "../config/thresholds.js";
import { get, post, put, del,patch, batch} from "../utils/http-requests.js";
import { readRandomUserFromData } from "../utils/data-loader.js";
import { group, sleep } from "k6";
import config from "../config/settings.js";
import { handleError } from '../utils/helpers.js';



export const options = {
  stages: STAGES.smoke,
  thresholds: THRESHOLD,
};

const body = readRandomUserFromData("users");

export default function () {
  group("Login", function () {
    let res = post(`${config.BASE_URL}/authn/login-with-expiry`, body, {
      headers: {
        "X-API-Key": config.API_KEY,
        "Origin": config.ORIGIN,
        "X-Okapi-Tenant": config.TENANT_CENTRAL,
      },
    });
    
    handleError(res, 201);
    const accessToken = res.cookies.folioAccessToken?.[0]?.value;
    const refreshToken = res.cookies.folioRefreshToken?.[0]?.value;
    sleep(1);

 
    res = get(`${config.BASE_URL}/bl-users/_self`, {
      headers: {
        "X-API-Key": config.API_KEY,
        "Origin": config.ORIGIN,
        "X-Okapi-Tenant": config.TENANT_CENTRAL,
        "Cookie": `folioAccessToken=${accessToken}`
      },
    }); 

    sleep(1);
  });
}
