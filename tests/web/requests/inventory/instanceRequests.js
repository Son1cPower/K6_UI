import { get, post } from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getInstanceTypes(paramsWithOptions) {
  return get(`${config.BASE_URL}/instance-types`, paramsWithOptions);
}

export function createNewInstance(body, paramsWithOptions) {
  return post(`${config.BASE_URL}/inventory/instances`, body, paramsWithOptions);
}