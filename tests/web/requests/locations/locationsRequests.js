import { get, post, put, del,patch, batch} from "../../../../utils/http-requests.js";
import config from "../../../../config/settings.js";

export function getLocations(paramsWithOptions) {
  return get(`${config.BASE_URL}/locations`, paramsWithOptions);
}
