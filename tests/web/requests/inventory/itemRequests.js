import { get, post, put, del,patch, batch} from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getMaterialTypes(paramsWithOptions) {
  return get(`${config.BASE_URL}/material-types`, paramsWithOptions);
}

export function createItem(body, paramsWithOptions) {
  return post(`${config.BASE_URL}/inventory/items`, body, paramsWithOptions);
}
