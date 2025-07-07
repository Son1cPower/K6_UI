import { BASE_URL, CLOUD } from "../../config/settings.js";
import { STAGES } from "../../config/workloads.js";
import { getRequest } from "../../utils/http-requests.js";
import { validateResponse } from "../../utils/checks.js";
import { group, sleep } from "k6";

export const options = {
  stages: STAGES.smoke,
  thresholds: {
    "http_req_duration{type:API}": ["p(95)<200"],
    checks: ["rate>0.9"],
  },
  cloud: CLOUD,
};

// GET PAGE USING TAGS TO FILTER THRESHOLDS
export default function () {
  group("GetPage", function () {
    const res = getRequest(BASE_URL, { tags: { type: "API" } });
    validateResponse(res);
    sleep(1);
  });
}
