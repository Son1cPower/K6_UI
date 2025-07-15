import { STAGES } from "../../../config/workloads.js";
import { THRESHOLD } from "../../../config/thresholds.js";
import { group, sleep } from "k6";
import { loginAsAdmin } from '../steps/loginAsAdmin.js';
import { createPatronUser } from '../steps/createPatronUser.js';
import { createInstance } from '../steps/createInstance.js';
import { createHolding } from '../steps/createHolding.js';
import { createItem } from '../steps/createItem.js';

export const options = {
  stages: STAGES.smoke,
  thresholds: THRESHOLD,
   tags: {
    testName: `${__ENV.ENVIRONMENT}-MR_Login`,
  },
};


export function setup() {
  return loginAsAdmin();
};


export default function (data) {
// const { accessToken, refreshToken } = data;
let instance;
let holding;


group("01. Create User", function () {
  const user = createPatronUser(data);
 sleep(1);
  });


 group("02. Create Instance", function () {
     ({instance_UUID: instance }  = createInstance(data));
    sleep(1);
  }),


  group("03. Create Holdings", function () {
  ({ holding_id: holding } = createHolding(data, instance));
sleep(1);
  }),


 group("04. Create Items", function () {
    const item = createItem(data, holding)
    sleep(1);
  }) 
 };



