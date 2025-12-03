import BasePage from "../../BasePage.js";

export class LeaveDashboardApis extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
  }

  async leaveDashboardAllApis() {
    await Promise.all([
        this.waitForAndVerifyApi('validSubdomainApi', 'GET', /is-valid-subdomain/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('userSessionApi', 'GET', /user-sessions/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('notificationsApi', 'GET', /my-dashboard\/notifications/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('userQuickLinksApi', 'GET', /users\/user-quick-links/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('wingSliApi', 'GET', /wings\/wing-sli/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('dropDownApiLeaveType', 'GET', /leave-types\/dropdown/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('dropDownApiBranches', 'GET', /branches\/dropdown/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('departmentSliApi', 'GET', /departments\/department-sli/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('dashboardsLeaveCalendarApi', 'GET', /leave-calenda/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('employeeCurrentLeaveStatusApi', 'GET', /leave-dashboards\/employee-current-leave-status/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('monthlyLeaveAPI', 'GET', /monthly-leave-application/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('monthWiseLeaveApi', 'GET', /month-wise-leave-application/, null, 'leaveDashboard'),
        this.waitForAndVerifyApi('yearlyLeaveApi', 'GET', /yearly-leave-approval/, null, 'leaveDashboard'),
        this.page.reload({ waitUntil: 'networkidle' })
    ]);
  }
}
