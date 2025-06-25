import { get, post, put, del,patch, batch} from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getLocations(headers, query = {}) {
  return get(`${config.BASE_URL}/locations`, { headers, query });
}
