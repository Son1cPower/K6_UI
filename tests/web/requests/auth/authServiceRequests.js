import { get, post, put, del,patch, batch} from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function loginRequest(body, headers) {
  return post(`${config.BASE_URL}/authn/login-with-expiry`, body, { headers });
}

export function getCurrentUser(headers) {
  return get(`${config.BASE_URL}/bl-users/_self`, { headers });
}