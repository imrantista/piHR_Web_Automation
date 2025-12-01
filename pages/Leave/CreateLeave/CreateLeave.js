import BasePage from "../../BasePage";

export class CreateLeave extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.addNewBtn = page.getByRole("button", { name: "Add New" });
    this.employeeField = page.getByRole('textbox', { name: 'Select Employee by Code or Name' });
    this.leaveTypeDropdown = page.getByText('Select Type');
    this.fromDateInput = page.locator('input[name="from_date"]');
    this.toDateInput = page.locator('input[name="to_date"]');
    this.purposeField = page.getByRole('textbox', { name: 'Type here' });
    this.saveBtn = page.getByRole("button", { name: "Save" });
    this.successMessage = page.getByText('Leave application added successfully');
  }
  async createNewLeave(employeeName, leaveType, leaveStartDate, leaveEndDate, leavePurpose, saveAfterFill = true) {
    await this.expectAndClick(this.addNewBtn, "Add New Button", "leaveAddButtonApi:GET");
    await this.expectAndClick(this.employeeField, "Employee Field");
    await this.waitAndFill(this.employeeField, employeeName, "Employee Field");
    await this.expectAndClick(this.page.getByRole('main').getByText(employeeName), "Select Employee Option");
    await this.expectAndClick(this.leaveTypeDropdown, "Leave Type Dropdown");
    await this.expectAndClick(this.page.locator('div').filter({ hasText: new RegExp(`^${leaveType}$`) }), "Select Leave Type");
    await this.expectAndClick(this.fromDateInput, "From Date Input");
    await this.waitAndFill(this.fromDateInput, leaveStartDate, "From Date Input");
    await this.expectAndClick(this.toDateInput, "To Date Input");
    await this.waitAndFill(this.toDateInput, leaveEndDate, "To Date Input");
    await this.expectAndClick(this.purposeField, "Purpose Field");
    await this.waitAndFill(this.purposeField, leavePurpose, "Purpose Field");
    if (saveAfterFill) {
      await this.clickSaveAndVerifyApi();
      await this.assert({
        locator: this.successMessage,
        state: 'visible',
        alias: 'Leave creation success message visible'
      });
    }
  }
  async clickSaveAndVerifyApi() {
    await this.expectAndClick(this.saveBtn, "Save Button", "leaveCreateApi:POST");
  }
}
