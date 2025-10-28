// api/apiMap.js
const ENV = process.env.ENV || 'PIHR_PROD';

// Default methods with expectedStatus
const defaultMethods = {
  GET:    { expectedStatus: 200 },
  POST:   { expectedStatus: 200 },
  PUT:    { expectedStatus: 200 },
  PATCH:  { expectedStatus: 200 },
  DELETE: { expectedStatus: 200 },
};

const apiMap = {
  "PIHR_PROD": {
    loginApi: { url: "https://api.pihr.xyz/api/v2/pihr-web/user-screen-permissions",methods: { ...defaultMethods }},
    logoutApi: { url: "https://sso.pihr.xyz/v2/api/log-out",methods: { ...defaultMethods }},
    validSubdomainApi: { url: "https://sso.pihr.xyz/v2/api/is-valid-subdomain",methods: { ...defaultMethods }},
    userSessionApi: { url: "https://api.pihr.xyz/api/v2/pihr-web/user-sessions",methods: { ...defaultMethods }},
    notificationsApi: { url: "https://api.pihr.xyz/api/v2/notifications",methods: { ...defaultMethods }},
    leaveAddButtonApi: { url: "https://api.pihr.xyz/api/v2/employee",methods: { ...defaultMethods }},
    leaveCreateApi: { url: "https://api.pihr.xyz/api/v2/leave/admin-apply-leave",methods: { ...defaultMethods }}},
  "PIHR_QA": {
    loginApi: { url: "https://api.pihr.xyz/api/v2/pihr-web/user-screen-permissions",methods: { ...defaultMethods }}
  }
};

// Export only the current environment APIs
const currentApiMap = apiMap[ENV];
if (!currentApiMap) {
  throw new Error(`No API mapping found for environment: ${ENV}`);
}

export default currentApiMap;
