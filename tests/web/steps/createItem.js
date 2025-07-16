import { getMaterialTypes, createNewItem } from "../requests/inventory/itemRequests.js";
import { getLoanTypes } from "../requests/loan/loanRequests.js";
import { extractField } from "../../../utils/extractField.js";
import { generateRandomString } from "../../../utils/helpers.js";
import { handleError } from "../../../utils/helpers.js";
import config from "../../../config/settings.js";
import { buildParamFactory } from '../../../utils/request-builder.js';


export function createItem(data, holding_id) {
  
    
  const requestParams = buildParamFactory({
  accessToken: data.accessToken,
   headers: { "X-Okapi-Tenant": config.TENANT_MEMBER }
});
 
// ========== STEP 1: Get Material Types ==========  

   let res =getMaterialTypes(
     requestParams({
         query: {
        "cql.allRecords": "1",
        "limit": "2000"
     }
  }));

    const materialTypes_id = extractField(res, 'mtypes[0].id');
   

// ========== STEP 2: Get Loan Types ==========  

      res =getLoanTypes(
     requestParams({
         query: {
        "cql.allRecords": "1",
        "limit": "2000"
     }
  }));

    const loanTypes_id = extractField(res, 'loantypes[0].id');


// ========== STEP 3: Create Holding ========== 
      res = createNewItem( 
      {"status":{"name":"Available"},"holdingsRecordId":`${holding_id}`,
      "barcode":`CL_Item_Barcode_${generateRandomString(50)}`,
      "materialType":{"id":`${materialTypes_id}`},"permanentLoanType":{"id":`${loanTypes_id}`}},
      requestParams(),
    ); 

    const item_id = extractField(res, 'id');
    const itemBarcode = extractField(res, 'barcode');
  
    handleError(res, 201);

    return { item_id, itemBarcode  }
}






  
  
   
  
  
  
  
  
  







