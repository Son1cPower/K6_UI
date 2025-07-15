import { setup as setupMrFlow, default as mrFlowFn } from '../flows/MR_flow_2.js';
import { default as loginFn } from '../flows/login.js';
import { getStartDate } from "../../../utils/helpers.js";


export const options = {
  
  scenarios: {
    mr_flow_scenario: {
      executor: 'ramping-vus',
      exec: 'mrFlow',
      startVUs: 0,
       tags: {
    // testid: getStartDate(),
    // projectName: "Your project name2",
    testName: `${__ENV.ENVIRONMENT}-MR_Login`,
    // testRunName: getStartDate(),
  },
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
       tags: {
    testid: getStartDate(),
    projectName: "Your project name2",
    testName: `${__ENV.ENVIRONMENT}-${__ENV.TEST_FILE_NAME}`,
    testRunName: getStartDate(),
  },
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
    mrFlowData: setupMrFlow() 
  };
}


export function mrFlow(data) {
  return mrFlowFn(data.mrFlowData);
}


export function login() {
  return loginFn();
}
