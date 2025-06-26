import { get, post } from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getPatronGroups(paramsWithOptions) {
  return get(`${config.BASE_URL}/groups`, paramsWithOptions);
}

export function createUser(body, paramsWithOptions) {
  return post(`${config.BASE_URL}/users`, body, paramsWithOptions);
}

export function createRequestPreference(body, paramsWithOptions) {
  return post(`${config.BASE_URL}/request-preference-storage/request-preference`, body, paramsWithOptions);
}