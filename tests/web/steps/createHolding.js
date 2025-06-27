import { getHoldingsSources, createNewHolding } from "../requests/inventory/holdingRequests.js";
import { getLocations } from "../requests/locations/locationsRequests.js";
import { extractField } from "../../../utils/extractField.js";
import { generateRandomString } from "../../../utils/helpers.js";
import { handleError } from "../../../utils/helpers.js";
import config from "../../../config/settings.js";
import { buildParamFactory } from '../../../utils/request-builder.js';


export function createHolding(data) {
  
    
  const requestParams = buildParamFactory({
  accessToken: data.accessToken,
   headers: { "X-Okapi-Tenant": config.TENANT_CENTRAL }
});
 
// ========== STEP 1: Get Location ==========  

let res =getLocations(requestParams({
    tags: { name: "Get permanentLocation_id" },
     headers: { "X-Okapi-Tenant": config.TENANT_MEMBER },
      query: {
        "cql.allRecords": "1",
        "limit": "2000"
     }
  }));

    const permanentLocation_name = 'alex'
    const permanentLocation_id = extractField(res, `locations[?name=${permanentLocation_name}].id`);
   

// ========== STEP 2: Get Holding Records Sources ID ==========  
 res =getHoldingsSources(
     requestParams({
          tags: { name: "Get holdingsRecordsSources_id" },
     headers: { "X-Okapi-Tenant": config.TENANT_MEMBER },
      query: {
        "cql.allRecords": "1",
        "limit": "2000"
     }
  }));

    const holdingsRecordsSources_id_name = 'FOLIO'
    const holdingsRecordsSources_id = extractField(res, `holdingsRecordsSources[?name=${holdingsRecordsSources_id_name}].id`);


// ========== STEP 3: Create Holding ========== 
    res = createNewHolding(
      {"instanceId":`${instance_UUID}`,"sourceId":`${holdingsRecordsSources_id}`,
      "permanentLocationId":`${permanentLocation_id}`},
         requestParams({
        tags: { name: "Create Holdings" },
        extraHeaders: { "X-Okapi-Tenant": config.TENANT_MEMBER }
     }),
    ); 
    handleError(res, 201);
  holdings_id = extractField(res, 'id');

    return { holdings_id }
}













