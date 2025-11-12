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
    widgetsApi: { url: "https://api.pihr.xyz/api/v2/dashboard/widgets",methods: { ...defaultMethods }},
    userQuickLinksApi: { url: "https://api.pihr.xyz/api/v2/users/user-quick-links",methods: { ...defaultMethods }},
    wingSliApi: { url: "https://api.pihr.xyz/api/v2/wings/wing-sli",methods: { ...defaultMethods }},
    cardWiseSummariesApi: { url: "https://api.pihr.xyz/api/v2/dashboard/card-wise-summaries",methods: { ...defaultMethods }},
    todayAttendancesApi: { url: "https://api.pihr.xyz/api/v2/attendance-dashboards/today-attendances",methods: { ...defaultMethods }},
    monthWiseClaimInformationApi: { url: "https://api.pihr.xyz/api/v2/dashboard/month-wise-claim-information",methods: { ...defaultMethods }},
    attendanceSummariesbyDateRangeApi: { url: "https://api.pihr.xyz/api/v2/attendance-dashboards/attendance-summaries-by-date-range",methods: { ...defaultMethods }},
    noticeApi: { url: "https://api.pihr.xyz/api/v2/dashboard/notices",methods: { ...defaultMethods }},
    branchesDropdownApi: { url: "https://api.pihr.xyz/api/v2/branches/dropdown",methods: { ...defaultMethods }},
    departmentSliApi: { url: "https://api.pihr.xyz/api/v2/departments/department-sli",methods: { ...defaultMethods }},
    employeeCurrentLeaveStatusApi: { url: "https://api.pihr.xyz/api/v2/leave-dashboards/employee-current-leave-status",methods: { ...defaultMethods }},
    missedAttendancesApi: { url: "https://api.pihr.xyz/api/v2/attendance-dashboards/missed-attendances",methods: { ...defaultMethods }},
    leaveTypesDropdownApi: { url: "https://api.pihr.xyz/api/v2/leave-types/dropdown",methods: { ...defaultMethods }},
    dashboardsLeaveCalendarApi: { url: "https://api.pihr.xyz/api/v2/leave-dashboards/leave-calendar",methods: { ...defaultMethods }},
    leaveAddButtonApi: { url: "https://api.pihr.xyz/api/v2/employee",methods: { ...defaultMethods }},
    leaveCreateApi: { url: "https://api.pihr.xyz/api/v2/leave/admin-apply-leave",methods: { ...defaultMethods }},
    leaveDeleteApi: { url: "https://api.pihr.xyz/api/v2/leave",methods: { ...defaultMethods }},
  },
  "PIHR_QA": {
    loginApi: { url: "http://live.pisales.xyz/api/v2/pihr-web/user-screen-permissions",methods: { ...defaultMethods }},
    logoutApi: { url: "http://live.pisales.xyz/v2/api/log-out",methods: { ...defaultMethods }},
    userSessionApi: { url: "http://live.pisales.xyz/api/v2/pihr-web/user-sessions",methods: { ...defaultMethods }},
    leaveAddButtonApi: { url: "http://live.pisales.xyz/api/v2/employee",methods: { ...defaultMethods }},
    leaveCreateApi: { url: "http://live.pisales.xyz/api/v2/leave/admin-apply-leave",methods: { ...defaultMethods }},
    leaveDeleteApi: { url: "http://live.pisales.xyz/api/v2/leave",methods: { ...defaultMethods }},
  }
};

// Export only the current environment APIs
const currentApiMap = apiMap[ENV];
if (!currentApiMap) {
  throw new Error(`No API mapping found for environment: ${ENV}`);
}

export default currentApiMap;
