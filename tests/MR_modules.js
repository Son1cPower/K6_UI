import { STAGES } from "../config/workloads.js";
import { THRESHOLD } from "../config/thresholds.js";
import { get, post, put, del,patch, batch} from "../utils/http-requests.js";

import { group, sleep } from "k6";
import config from "../config/settings.js";
import { handleError, generateRandomString } from '../utils/helpers.js';

import { extractField } from '../utils/extractField.js';

import { loginAsAdmin } from '../tests/web/steps/loginAsAdmin.js';
import { createPatronUser } from '../tests/web/steps/createPatronUser.js';
import { createInstance } from '../tests/web/steps/createInstance.js';
import { createHolding } from '../tests/web/steps/createHolding.js';

export const options = {
  stages: STAGES.smoke,
  thresholds: THRESHOLD,
};



export function setup() {
  return loginAsAdmin();
};








export default function (data) {
// const { accessToken, refreshToken } = data;

  // set the authorization header on the session for the subsequent requests
const requestConfigWithTag = ({ name, extraHeaders = {}, query = {} }) => ({
  headers: {
    "X-API-Key": config.API_KEY,
    "Origin": config.ORIGIN,
    "Cookie": `folioAccessToken=${data.accessToken}`,
    ...extraHeaders,
  },
  query,
  tags: {
    name: 'PrivateRatings',
    ...(name ? { name } : {}),
  },
});
  
// const requestConfigWithTag = ({ name, extraHeaders = {}, query = {} }, accessToken) => ({
//   name,  
//   headers: {
//     "X-API-Key": config.API_KEY,
//     "Origin": config.ORIGIN,
//     "Cookie": `folioAccessToken=${data.accessToken}`,
//     ...extraHeaders,
//   },
//   query,
//   tags: {
//     service: 'PrivateRatings', 
//   },
// });



 
  // let instance_UUID;
  // let holdings_id;





// Group 01 Start 
  group("01. Create User", function () {

  const user = createPatronUser(data);
 sleep(1);
  });// Group 01 close 

  // Group 02 Start 
 group("02. Create Instance", function () {
     const instance= createInstance(data);
    sleep(1);
  }),// Group 02 close 

  // Group 03 Start 
  group("03. Create Holdings", function () {
   const holding = createHolding(data);
sleep(1);
  }),// Group 03 close 


  // Group 04 Start 
 group("04. Create Items", function () {
   
  let res =get(`${config.BASE_URL}/material-types`,
     requestConfigWithTag({
     name: 'Get materialTypes_id',
     extraHeaders: { "X-Okapi-Tenant": config.TENANT_MEMBER },
      query: {
        "cql.allRecords": "1",
        "limit": "2000"
     }
  }));

    const materialTypes_id = extractField(res, 'mtypes[0].id');
  
  
    res =get(`${config.BASE_URL}/loan-types`,
     requestConfigWithTag({
     name: 'Get loanTypes_id',
     extraHeaders: { "X-Okapi-Tenant": config.TENANT_MEMBER },
      query: {
        "cql.allRecords": "1",
        "limit": "2000"
     }
  }));

    const loanTypes_id = extractField(res, 'loantypes[0].id');
  
  
  
  
  
  res = post(`${config.BASE_URL}/inventory/items`, 

      {"status":{"name":"Available"},"holdingsRecordId":`${holdings_id}`,
      "barcode":`CL_Item_Barcode_${generateRandomString(50)}`,
      "materialType":{"id":`${materialTypes_id}`},"permanentLoanType":{"id":`${loanTypes_id}`}},
     
      requestConfigWithTag({
        name: 'Create Item',
        extraHeaders: { "X-Okapi-Tenant": config.TENANT_MEMBER }
     }),
    ); 

    const item_id = extractField(res, 'id');
    const itemBarcode = extractField(res, 'barcode');
  
    handleError(res, 201);
    sleep(1);

  }) // Group 04 close  





 };



