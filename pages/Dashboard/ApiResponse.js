import BasePage from "../BasePage";

export class DashboardApis extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
  }

  async dashboardAllApis() {
    await Promise.all([
        this.waitForAndVerifyApi('validSubdomainApi', 'GET', /is-valid-subdomain/, null, 'default'),
        this.waitForAndVerifyApi('userSessionApi', 'GET', /user-sessions/, null, 'default'),
        this.waitForAndVerifyApi('notificationsApi', 'GET', /notifications/, null, 'default'),
        this.waitForAndVerifyApi('widgetsApi', 'GET', /dashboard\/widgets/, null, 'default'),
        this.waitForAndVerifyApi('userQuickLinksApi', 'GET', /users\/user-quick-links/, null, 'default'),
        this.waitForAndVerifyApi('wingSliApi', 'GET', /wings\/wing-sli/, null, 'default'),
        this.waitForAndVerifyApi('cardWiseSummariesApi', 'GET', /dashboard\/card-wise-summaries/, null, 'default'),
        this.waitForAndVerifyApi('todayAttendancesApi', 'GET', /attendance-dashboards\/today-attendances/, null, 'default'),
        this.waitForAndVerifyApi('monthWiseClaimInformationApi', 'GET', /dashboard\/month-wise-claim-information/, null, 'default'),
        this.waitForAndVerifyApi('attendanceSummariesbyDateRangeApi', 'GET', /attendance-dashboards\/attendance-summaries-by-date-range/, null, 'default'),
        this.waitForAndVerifyApi('noticeApi', 'GET', /dashboard\/notices/, null, 'default'),
        this.waitForAndVerifyApi('branchesDropdownApi', 'GET', /branches\/dropdown/, null, 'default'),
        this.waitForAndVerifyApi('departmentSliApi', 'GET', /departments\/department-sli/, null, 'default'),
        this.waitForAndVerifyApi('employeeCurrentLeaveStatusApi', 'GET', /leave-dashboards\/employee-current-leave-status/, null, 'default'),
        this.waitForAndVerifyApi('missedAttendancesApi', 'GET', /attendance-dashboards\/missed-attendances/, null, 'default'),
        this.waitForAndVerifyApi('leaveTypesDropdownApi', 'GET', /leave-types\/dropdown/, null, 'default'),
        this.waitForAndVerifyApi('dashboardsLeaveCalendarApi', 'GET', /leave-dashboards\/leave-calendar/, null, 'default'),
        this.page.reload({ waitUntil: 'networkidle' })
    ]);
  }
}
