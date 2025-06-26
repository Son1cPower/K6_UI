import { get, post, put, del,patch, batch} from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function loginRequest(body, paramsWithOptions) {
  return post(`${config.BASE_URL}/authn/login-with-expiry`, body, paramsWithOptions);
}

export function getCurrentUser(paramsWithOptions) {
  return get(`${config.BASE_URL}/bl-users/_self`, paramsWithOptions);
}