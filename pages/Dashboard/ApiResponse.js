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
        this.page.reload({ waitUntil: 'networkidle' })
    ]);
  }
}
