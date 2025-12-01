import BasePage from "../../BasePage";
export class ModalComponent extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.addNewBtn = page.getByRole("button", { name: "Add New" });
    this.modalTitle = page.locator('div').filter({ hasText: /^New Leave Application$/ });
    this.employeeField = page.getByText('Employee*');
    this.statusField = page.getByRole('main').getByText('Status');
    this.leaveTypeField = page.getByText('Leave Type*');
    this.dayCountField = page.getByText('Day Count');
    this.startDateField = page.getByText('Start Date*');
    this.endDateField = page.getByText('End Date*');
    this.purposeField = page.getByText('Purpose*');
    this.applyDateField = page.getByText('Apply Date:');
    this.foreignLeaveField = page.getByText('Foreign Leave Y/N');
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.saveBtn = page.getByRole('button', { name: 'Save' });
  }

  async checkModalComponent() {
    await this.expectAndClick(this.addNewBtn, "Add New Button", "leaveAddButtonApi:GET");
    await this.assert({
      locator: { default: this.modalTitle },
      state: 'visible',
      alias: 'New Leave Application Modal visible'
    });
    const elements = [
      { locator: this.employeeField, alias: 'Employee Field visible' },
      { locator: this.statusField, alias: 'Status Field visible' },
      { locator: this.leaveTypeField, alias: 'Leave Type Field visible' },
      { locator: this.dayCountField, alias: 'Day Count Field visible' },
      { locator: this.startDateField, alias: 'Start Date Field visible' },
      { locator: this.endDateField, alias: 'End Date Field visible' },
      { locator: this.purposeField, alias: 'Purpose Field visible' },
      { locator: this.applyDateField, alias: 'Apply Date Field visible' },
      { locator: this.foreignLeaveField, alias: 'Foreign Leave Field visible' },
      { locator: this.cancelBtn, alias: 'Cancel Button visible' },
      { locator: this.saveBtn, alias: 'Save Button visible' },
    ];
    for (const el of elements) {
      await this.assert({ locator: { default: el.locator }, state: 'visible', alias: el.alias });
    }
  }
}
