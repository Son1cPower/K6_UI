import { getPatronGroups, createUser, createRequestPreference } from "../requests/user/userRequests.js";
import { extractField } from "../../../utils/extractField.js";
import { handleError, generateRandomString } from "../../../utils/helpers.js";
import config from "../../../config/settings.js";
import { buildParamFactory } from '../../../utils/request-builder.js';

export function createPatronUser(data) {
  const patronGroupName = "Stas"; // Change this to the desired patron group name !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const flowPrefix = "CL";
  const randomStr = generateRandomString(50);
  const requestParams = buildParamFactory({
  accessToken: data.accessToken
});


// ========== STEP 1: Get Patron Groups ==========

  const patronGroupsParams = requestParams({
    query: {
      "cql.allRecords": "1",
      "limit": "2000"
    },
     headers: {
    "X-Okapi-Tenant": config.TENANT_CENTRAL
  },
    tags: { name: "Get Patron Groups" }
  });


  let res = getPatronGroups(patronGroupsParams);
  const patronGroupId = extractField(res, `usergroups[?group=${patronGroupName}].id`);

 // ========== STEP 2: Create User ==========
  const userBody = {
    active: true,
    personal: {
      preferredContactTypeId: "002",
      lastName: `${flowPrefix}_user_lastName_${randomStr}`,
      email: `${flowPrefix}_user_email_${randomStr}.com`,
    },
    username: `${flowPrefix}_user_Name_${randomStr}`,
    type: "patron",
    preferredEmailCommunication: [],
    barcode: `${flowPrefix}_user_barcode_${randomStr}`,
    patronGroup: patronGroupId,
    departments: [],
  };

    const userParams = requestParams({
     headers: {
    "X-Okapi-Tenant": config.TENANT_CENTRAL
  },
    tags: { name: "Create Patron User" }
  });

  res = createUser(userBody, userParams);
  handleError(res, 201);
  const userId = extractField(res, "id");
 
// ========== STEP 3: Create Request Preference ==========
  const prefBody = {
    userId,
    fulfillment: "Hold Shelf",
    holdShelf: true,
    delivery: false,
    defaultServicePointId: null,
    defaultDeliveryAddressTypeId: null,
  };

   const prefParams = requestParams({
    headers: {
    "X-Okapi-Tenant": config.TENANT_CENTRAL
  },
    tags: { name: "Create Request Preference" }
  });

  res = createRequestPreference(prefBody,prefParams);
  handleError(res, 201);
  return { userId };
}
