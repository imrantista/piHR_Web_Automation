import BasePage from "../../BasePage";
export class monthWiseAttendancePage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.monthInput = page.locator('input[placeholder="Select Month"]');
    this.yearInput = page.locator('input[placeholder="Year"]');
    this.pdfReportButton = page.getByRole('button', { name: 'PDF Report' });
  }
  async selectMonth(month) {
    await this.monthInput.click();
    const option = this.page.locator(`li:has-text("${month}")`);
    await option.first().click();
  }
  async enterYear(year) {
    await this.yearInput.fill(year.toString());
  }
  async downloadMonthWiseAttendanceReport(month, year) {
    await this.selectMonth(month);
    await this.enterYear(year);
    await this.expectAndClick(this.pdfReportButton, "PDF Report Button");
}
}