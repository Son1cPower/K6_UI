import { STAGES } from "../../config/workloads.js";
import { THRESHOLD } from "../../config/thresholds.js";
import { postRequest } from "../../utils/http-requests.js";
import { validateResponse } from "../../utils/checks.js";
import { readRandomUserFromData } from "../../utils/data-loader.js";
import { group, sleep } from "k6";

export const options = {
  stages: STAGES.smoke,
  thresholds: THRESHOLD,
};

const CUSTOM_URL = "http://test.k6.io";
// EACH USER BELONGS TO A VU INSTANCE
const body = readRandomUserFromData("users");

// LOGIN WITH READ JSON DATA
export default function () {
  group("Login", function () {
    const res = postRequest(`${CUSTOM_URL}/login`, body);
    validateResponse(res);
    sleep(1);
  });
}
