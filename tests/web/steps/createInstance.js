import { getInstanceTypes, createNewInstance } from "../requests/inventory/instanceRequests.js";
import { extractField } from "../../../utils/extractField.js";
import { generateRandomString } from "../../../utils/helpers.js";
import { handleError } from "../../../utils/helpers.js";
import config from "../../../config/settings.js";
import { buildParamFactory } from '../../../utils/request-builder.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';




  export function createInstance(data) {
  
  const requestParams = buildParamFactory({
  accessToken: data.accessToken,
   headers: { "X-Okapi-Tenant": config.TENANT_CENTRAL }
});
const instance_UUID = uuidv4();


// ========== STEP 1: Get Instance Types ==========  
  let res =getInstanceTypes(requestParams({
    tags: { name: "Get instanceTypes_id" },
      query: {
        "cql.allRecords": "1",
        "limit": "2000"
     }
  }));

    const instanceTypes_id = extractField(res, 'instanceTypes[0].id');



// ========== STEP 2: Create Instance ==========  
    
    res = createNewInstance( 

      {"discoverySuppress":false,"staffSuppress":false,"previouslyHeld":false,"source":"FOLIO",
      "title":`CL_instance_${generateRandomString(50)}`,
      "instanceTypeId":`${instanceTypes_id}`,
        "precedingTitles":[],"succeedingTitles":[],"parentInstances":[],"childInstances":[],
        "id": `${instance_UUID}`},
     
      requestParams({
        tags: { name: "Create Instance" },
         checkBodyLength: false 
     })
    );

    handleError(res, 201);
    return { instance_UUID }
    }