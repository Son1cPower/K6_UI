import { get, post } from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getPatronGroups(params) {
  return get(`${config.BASE_URL}/groups`, params);
}

export function createUser(body, params) {
  return post(`${config.BASE_URL}/users`, body, params);
}

export function createRequestPreference(body, params) {
  return post(`${config.BASE_URL}/request-preference-storage/request-preference`, body, params);
}