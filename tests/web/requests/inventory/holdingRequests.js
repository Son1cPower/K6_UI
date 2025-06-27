import { get, post, put, del,patch, batch} from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getHoldingsSources(paramsWithOptions) {
  return get(`${config.BASE_URL}/holdings-sources`,paramsWithOptions);
}

export function createNewHolding(body, paramsWithOptions) {
  return post(`${config.BASE_URL}/holdings-storage/holdings`, body, paramsWithOptions);
}