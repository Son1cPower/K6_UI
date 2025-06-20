const workloadConfig = {
  load: [
    { duration: "2m", target: 50 },
    { duration: "3m", target: 100 },
    { duration: "1m", target: 0 },
  ],
  stress: [
    { duration: "5m", target: 500 },
    { duration: "3m", target: 1000 },
    { duration: "2m", target: 0 },
  ],
  soak: [
    { duration: "30m", target: 200 },
    { duration: "30m", target: 200 },
    { duration: "30m", target: 0 },
  ],
  spike: [
    { duration: "5s", target: 500 },
    { duration: "20s", target: 2000 },
    { duration: "10s", target: 0 },
  ],
  smoke: [{ target: 1 }],
};

export const STAGES = workloadConfig;
export const TARGET_STAGE =
  workloadConfig[__ENV.WORKLOAD?.toLowerCase()] || workloadConfig["smoke"];
