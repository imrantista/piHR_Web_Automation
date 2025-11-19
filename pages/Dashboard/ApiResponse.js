import BasePage from "../BasePage";

export class DashboardApis extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
  }

  async dashboardAllApis() {
    await Promise.all([
        this.waitForAndVerifyApi('validSubdomainApi', 'GET', /is-valid-subdomain/),
        this.waitForAndVerifyApi('userSessionApi', 'GET', /user-sessions/),
        this.waitForAndVerifyApi('notificationsApi', 'GET', /notifications/),
        this.waitForAndVerifyApi('widgetsApi', 'GET', /dashboard\/widgets/),
        this.waitForAndVerifyApi('userQuickLinksApi', 'GET', /users\/user-quick-links/),
        this.waitForAndVerifyApi('wingSliApi', 'GET', /wings\/wing-sli/),
        this.waitForAndVerifyApi('cardWiseSummariesApi', 'GET', /dashboard\/card-wise-summaries/),
        this.waitForAndVerifyApi('todayAttendancesApi', 'GET', /attendance-dashboards\/today-attendances/),
        this.waitForAndVerifyApi('monthWiseClaimInformationApi', 'GET', /dashboard\/month-wise-claim-information/),
        this.waitForAndVerifyApi('attendanceSummariesbyDateRangeApi', 'GET', /attendance-dashboards\/attendance-summaries-by-date-range/),
        this.waitForAndVerifyApi('noticeApi', 'GET', /dashboard\/notices/),
        this.waitForAndVerifyApi('branchesDropdownApi', 'GET', /branches\/dropdown/),
        this.waitForAndVerifyApi('departmentSliApi', 'GET', /departments\/department-sli/),
        this.waitForAndVerifyApi('employeeCurrentLeaveStatusApi', 'GET', /leave-dashboards\/employee-current-leave-status/),
        this.waitForAndVerifyApi('missedAttendancesApi', 'GET', /attendance-dashboards\/missed-attendances/),
        this.waitForAndVerifyApi('leaveTypesDropdownApi', 'GET', /leave-types\/dropdown/),
        this.waitForAndVerifyApi('dashboardsLeaveCalendarApi', 'GET', /leave-dashboards\/leave-calendar/),
        this.page.reload({ waitUntil: 'networkidle' })
    ]);
  }
}
