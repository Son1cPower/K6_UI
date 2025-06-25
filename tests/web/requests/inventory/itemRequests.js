import { get, post, put, del,patch, batch} from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getMaterialTypes(headers, query = {}) {
  return get(`${config.BASE_URL}/material-types`, { headers, query });
}

export function createItem(body, headers) {
  return post(`${config.BASE_URL}/inventory/items`, body, { headers });
}
