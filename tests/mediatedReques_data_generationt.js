import { STAGES } from "../config/workloads.js";
import { THRESHOLD } from "../config/thresholds.js";
import { get, post, put, del,patch} from "../utils/http-requests.js";
import { readRandomUserFromData } from "../utils/data-loader.js";
import { group, sleep } from "k6";
import config from "../config/settings.js";
import { handleError, generateRandomString } from '../utils/helpers.js';



export const options = {
  stages: STAGES.smoke,
  thresholds: THRESHOLD,
};



export function setup() {
    const loginBody = readRandomUserFromData("users");
    let res = post(`${config.BASE_URL}/authn/login-with-expiry`, loginBody, {
      headers: {
        "X-API-Key": config.API_KEY,
        "Origin": config.ORIGIN,
        "X-Okapi-Tenant": config.TENANT_CENTRAL,
      },
    });
    
    handleError(res, 201);
    const accessToken = res.cookies.folioAccessToken?.[0]?.value;
    const refreshToken = res.cookies.folioRefreshToken?.[0]?.value;
  
    res = get(`${config.BASE_URL}/bl-users/_self`, {
      headers: {
        "X-API-Key": config.API_KEY,
        "Origin": config.ORIGIN,
        "X-Okapi-Tenant": config.TENANT_CENTRAL,
        "Cookie": `folioAccessToken=${accessToken}`
      },
    }); 
    return { accessToken, refreshToken };
};








export default function (data) {
  // set the authorization header on the session for the subsequent requests
const requestConfigWithTag = ({ name, extraHeaders = {}, query = {} }) => ({
  headers: {
    "X-API-Key": config.API_KEY,
    "Origin": config.ORIGIN,
    "Cookie": `folioAccessToken=${data.accessToken}`,
    ...extraHeaders,
  },
  query,
  tags: {
    name: 'PrivateRatings',
    ...(name ? { name } : {}),
  },
});
  
  group("01. Create User", function () {
     let res =get(`${config.BASE_URL}/groups`, requestConfigWithTag({
     name: 'Get patronGroup_id',
     extraHeaders: { "X-Okapi-Tenant": config.TENANT_SECURE },
      query: {
        "cql.allRecords": "1",
        "limit": "2000"
     }
  }));

    const patronGroup_id =  JSON.parse(res.body).usergroups?.[0]?.id;
    sleep(1);
 

    const randomStrForBody = generateRandomString(20);
    res = post(`${config.BASE_URL}/users`, 
      {"active":true,"personal":{"preferredContactTypeId":"002",
        "lastName":`CL_user_lastName_${randomStrForBody}`,
        "email":`CL_user_email_${randomStrForBody}.com`},
        "username":`CL_user_Name_${randomStrForBody}`,
        "type":"patron","preferredEmailCommunication":[],
        "barcode":`CL_user_barcode_${randomStrForBody}`,"patronGroup":`${patronGroup_id}`,"departments":[]},
      requestConfigWithTag({
        name: 'Create User',
        extraHeaders: { "X-Okapi-Tenant": config.TENANT_SECURE },
    })); 

    handleError(res, 201);
    const user_id =  JSON.parse(res.body).id;
    sleep(1);
  });
}
