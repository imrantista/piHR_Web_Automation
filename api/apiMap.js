const ENV = process.env.ENV || 'PIHR_PROD';

const defaultMethods = {
  GET: { expectedStatus: 200 },
  POST: { expectedStatus: 200 },
  PUT: { expectedStatus: 200 },
  PATCH: { expectedStatus: 200 },
  DELETE: { expectedStatus: 200 },
};
const baseUrlMap = {
  PIHR_PROD: 'https://api.pihr.xyz',
  PIHR_QA: 'http://live.pisales.xyz',
};
const subdomianUrlMap = {
  PIHR_PROD: 'https://sso.pihr.xyz',
  PIHR_QA: 'http://accounts.pisales.xyz',
};

const BASE_URL = baseUrlMap[ENV];
const SubDomain_URL = subdomianUrlMap[ENV];

if (!BASE_URL) throw new Error(`BASE_URL not defined for ENV=${ENV}`);

// API map with **endpoint paths only**
const apiPaths = {

  //Dashboard APIs
  loginApi: '/api/v2/pihr-web/user-screen-permissions',
  logoutApi: '/v2/api/log-out',
  validSubdomainApi: '/v2/api/is-valid-subdomain',
  userSessionApi: '/api/v2/pihr-web/user-sessions',
  notificationsApi: '/api/v2/notifications',
  widgetsApi: '/api/v2/dashboard/widgets',
  userQuickLinksApi: '/api/v2/users/user-quick-links',
  wingSliApi: '/api/v2/wings/wing-sli',
  cardWiseSummariesApi: '/api/v2/dashboard/card-wise-summaries',
  todayAttendancesApi: '/api/v2/attendance-dashboards/today-attendances',
  monthWiseClaimInformationApi: '/api/v2/dashboard/month-wise-claim-information',
  attendanceSummariesbyDateRangeApi: '/api/v2/attendance-dashboards/attendance-summaries-by-date-range',
  noticeApi: '/api/v2/dashboard/notices',
  branchesDropdownApi: '/api/v2/branches/dropdown',
  departmentSliApi: '/api/v2/departments/department-sli',
  employeeCurrentLeaveStatusApi: '/api/v2/leave-dashboards/employee-current-leave-status',
  missedAttendancesApi: '/api/v2/attendance-dashboards/missed-attendances',
  leaveTypesDropdownApi: '/api/v2/leave-types/dropdown',
  dashboardsLeaveCalendarApi: '/api/v2/leave-dashboards/leave-calendar',
  leaveAddButtonApi: '/api/v2/employee',
  leaveCreateApi: '/api/v2/leave/admin-apply-leave',
  leaveDeleteApi: '/api/v2/leave',
  manageUserApi: 'api/v2/users',


  //Leave Dashboard APIs
  dropDownApiLeaveType: "/api/v2/leave-types/dropdown",
  dropDownApiBranches: "/api/v2/branches/dropdown",
  monthlyLeaveAPI: "/api/v2/leave-dashboards/monthly-leave-application-status",
  monthWiseLeaveApi: "/api/v2/leave-dashboards/month-wise-leave-application-status",
  yearlyLeaveApi: "/api/v2/leave-dashboards/yearly-leave-approval-status",
  notificationsLeaveDashboardApi: "/api/v2/my-dashboard/notifications",

  // Report APIs
  monthWiseAttendanceApi: '/api/v2/self-service-reports/my-attendance'
};

// Build final API map for current environment
const apiMap = {};
for (const [key, path] of Object.entries(apiPaths)) {
  // Determine which base URL to use (you can customize per API if needed)
  const prefix = key === 'logoutApi' || key === 'validSubdomainApi' ? SubDomain_URL : BASE_URL;
  apiMap[key] = {
    url: `${prefix}${path}`,
    methods: { ...defaultMethods },
  };
}

export default apiMap;