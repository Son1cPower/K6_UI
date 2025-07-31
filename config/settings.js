const envConfig = {
  dev: {
    BASE_URL: "http://localhost:3333",
    MY_FLAG: true,
    TIMEOUT: 5000,
  },
  relc: {
    BASE_URL: "https://kong-relc-central-tenant.int.aws.folio.org",
    ORIGIN: "relc-central-tenant.int.aws.folio.org",
    TENANT_CENTRAL: "cs00000int",
    TENANT_SECURE: "cs00000int_0005",
    TENANT_MEMBER: "cs00000int_0001",
    MY_FLAG: true,
    TIMEOUT: 6000,
  },
   relctls2: {
    BASE_URL: "https://kong-relctls2-central-tenant.int.aws.folio.org",
    ORIGIN: "relctls2-central-tenant.int.aws.folio.org",
    TENANT_CENTRAL: "cs00000int",
    TENANT_SECURE: "cs00000int_0005",
    TENANT_MEMBER: "cs00000int_0001",
    MY_FLAG: true,
    TIMEOUT: 6000,
  },
   bugfest: {
    BASE_URL: "https://kong-eureka-bugfest-ramsons-consortium.int.aws.folio.org",
    ORIGIN: "https://eureka-bugfest-ramsons-consortium.int.aws.folio.org",
    TENANT_CENTRAL: "cs00000int",
    TENANT_SECURE: "cs00000int_0013",
    TENANT_MEMBER: "cs00000int_0002",
    MY_FLAG: true,
    TIMEOUT: 6000,
  },
};
const config = envConfig[__ENV.ENVIRONMENT] || envConfig["bugfest"];


export const BASE_URL = config.BASE_URL;

// export const CLOUD = {
//   projectID: __ENV.PROJECT_ID || "default_project",
//   name: __ENV.TEST_NAME || "default_test",
// };

export default config;
