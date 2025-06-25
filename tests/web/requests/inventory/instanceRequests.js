import { get, post } from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getInstanceTypes(headers, query = {}) {
  return get(`${config.BASE_URL}/instance-types`, { headers, query });
}

export function createInstance(body, headers) {
  return post(`${config.BASE_URL}/inventory/instances`, body, { headers });
}
