import { STAGES } from "../../../config/workloads.js";
import { THRESHOLD } from "../../../config/thresholds.js";
import { group, sleep } from "k6";
import { groupController } from "../../../utils/groupController.js";
import { loginAsAdmin } from '../steps/loginAsAdmin.js';
import { createPatronUser } from '../steps/createPatronUser.js';
import { createInstance } from '../steps/createInstance.js';
import { createHolding } from '../steps/createHolding.js';
import { createItem } from '../steps/createItem.js';

export const options = {
  stages: STAGES.smoke,
  thresholds: THRESHOLD,
};


export function setup() {
  return loginAsAdmin();
};


export default function (data) {
// const { accessToken, refreshToken } = data;
let instance;
let holding;


groupController("01. Create User", function () {
  const user = createPatronUser(data);
   });
sleep(1);

 groupController("02. Create Instance", function () {
     ({instance_UUID: instance }  = createInstance(data));
      }),
sleep(1);

  groupController("03. Create Holdings", function () {
  ({ holding_id: holding } = createHolding(data, instance));
  }),
sleep(1);

 groupController("04. Create Items", function () {
    const item = createItem(data, holding)
      }) 
      sleep(1);
 };



