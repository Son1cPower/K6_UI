import { get, post, put, del,patch, batch} from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getHoldingsSources(headers, query = {}) {
  return get(`${config.BASE_URL}/holdings-sources`, { headers, query });
}

export function createHoldings(body, headers) {
  return post(`${config.BASE_URL}/holdings-storage/holdings`, body, { headers });
}