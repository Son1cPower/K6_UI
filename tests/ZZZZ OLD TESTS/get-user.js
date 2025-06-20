import { STAGES } from "../../config/workloads.js";
import { BASE_URL } from "../../config/settings.js";
import { getRequest } from "../../utils/http-requests.js";
import { Trend, Rate, Counter, Gauge } from "k6/metrics";
import { group, sleep } from "k6";
import { getRandomName } from "../../utils/faker.js";

const TrendRequestTimeDuration = new Trend("RTT");
const RateContentOK = new Rate("ContentOK");
const GaugeContentSize = new Gauge("ContentSize");
const CounterErrors = new Counter("Errors");

export const options = {
  stages: STAGES.smoke,
  thresholds: {
    Errors: ["count<100"],
    ContentSize: ["value<4000"],
    ContentOK: ["rate>0.95"],
    RTT: ["p(99)<300", "p(90)<250", "avg<200", "med<150", "min<130"],
  },
};

const name = getRandomName();

// GET USER USING CUSTOM THRESHOLDS AND FAKER JS
export default function () {
  group("GetUser", function () {
    const res = getRequest(`${BASE_URL}/api/json?name=${name}`);
    const contentOK = res.json("name") === name;

    TrendRequestTimeDuration.add(res.timings.duration);
    RateContentOK.add(contentOK);
    GaugeContentSize.add(res.body.length);
    CounterErrors.add(!contentOK);

    sleep(1);
  });
}
