const thresholdsConfig = {
  common: {
    http_req_duration: ["p(99)<2000"],
    http_req_failed: ["rate<0.01"],
  },
  custom: {
    http_req_duration: ["p(99)<300"],
  },
};

export const THRESHOLD =
  thresholdsConfig[__ENV.THRESHOLD?.toLowerCase()] ||
  thresholdsConfig["common"];
