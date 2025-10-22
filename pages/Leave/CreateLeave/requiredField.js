import BasePage from "../../BasePage";

export class RequiredField extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.addNewBtn = page.getByRole("button", { name: "Add New" });
    this.saveBtn = page.getByRole("button", { name: "Save" });

    this.employeeError = page.getByText('Employee is required');
    this.leaveTypeError = page.getByText('Leave type is required');
    this.startDateError = page.getByText('Start date is required');
    this.endDateError = page.getByText('End date is required');
    this.purposeError = page.getByText('Purpose is required');
  }

  async requiredFieldValidation() {
    await this.expectAndClick(this.addNewBtn, "Add New Button", "leaveApi:GET");
    await this.expectAndClick(this.saveBtn, "Save Button");
    const errors = [
      { locator: this.employeeError, alias: 'Employee required error visible' },
      { locator: this.leaveTypeError, alias: 'Leave Type required error visible' },
      { locator: this.startDateError, alias: 'Start Date required error visible' },
      { locator: this.endDateError, alias: 'End Date required error visible' },
      { locator: this.purposeError, alias: 'Purpose required error visible' },
    ];

    for (const err of errors) {
      await this.assert({
        locator: { default: err.locator },
        state: 'visible',
        alias: err.alias
      });
    }
  }
}
