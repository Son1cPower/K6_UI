import { STAGES } from "../../../config/workloads.js";
import { THRESHOLD } from "../../../config/thresholds.js";
import { loginAsAdmin } from '../steps/loginAsAdmin.js';


export const options = {
  stages: STAGES.smoke,
  thresholds: THRESHOLD,
   tags: {
    testName: `${__ENV.ENVIRONMENT}-MR_Login`,
  },
};

export default function login() {
   
    return loginAsAdmin();
}
