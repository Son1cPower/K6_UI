import { setup as setupMrFlow, default as mrFlowFn } from '../flows/MR_flow_2.js';
import { default as loginFn } from '../flows/login.js';
import { getStartDate } from "../../../utils/helpers.js";
import { Trend, Gauge } from 'k6/metrics';

export const testDuration = new Gauge('test_duration');

export const options = {
    tags: {
    testName: `${__ENV.ENVIRONMENT}-MR_Login`,
  },
  scenarios: {
    mr_flow_scenario: {
      executor: 'ramping-vus',
      exec: 'mrFlow',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '20s', target: 5 },
        { duration: '10s', target: 0 },
      ]
    },
    login_flow_scenario: {
      executor: 'ramping-vus',
      exec: 'login',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 3 },
        { duration: '20s', target: 3 },
        { duration: '10s', target: 0 },
      ]
    }
  }
};


export function setup() {
  return {
     testStart: Date.now(),
    mrFlowData: setupMrFlow() 
  };
}


export function mrFlow(data) {
  return mrFlowFn(data.mrFlowData);
}


export function login() {
  return loginFn();
}


export function teardown(data) {
  const testEnd = Date.now();
  const durationSec = (testEnd - data.testStart) / 1000;
 testDuration.add(durationSec, { testName: `${__ENV.ENVIRONMENT}-MR_Login` });
}