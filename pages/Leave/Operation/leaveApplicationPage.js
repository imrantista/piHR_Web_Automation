import BasePage from "../../BasePage";

export class leaveApplicationPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    // Common Elements
    this.addNewBtn = page.getByRole("button", { name: "Add New" });
    this.saveBtn = page.getByRole("button", { name: "Save" });
    // Modal UI Components
    this.modalTitle = page.locator('div').filter({ hasText: /^New Leave Application$/ });
    this.modal_employeeField = page.getByText('Employee*');
    this.modal_statusField = page.getByRole('main').getByText('Status');
    this.modal_leaveTypeField = page.getByText('Leave Type*');
    this.modal_dayCountField = page.getByText('Day Count');
    this.modal_startDateField = page.getByText('Start Date*');
    this.modal_endDateField = page.getByText('End Date*');
    this.modal_purposeField = page.getByText('Purpose*');
    this.modal_applyDateField = page.getByText('Apply Date:');
    this.modal_foreignLeaveField = page.getByText('Foreign Leave Y/N');
    this.modal_cancelBtn = page.getByRole('button', { name: 'Cancel' });
    // Required Fields
    this.employeeError = page.getByText('Employee is required');
    this.leaveTypeError = page.getByText('Leave type is required');
    this.startDateError = page.getByText('Start date is required');
    this.endDateError = page.getByText('End date is required');
    this.purposeError = page.getByText('Purpose is required');
    // Create Leave
    this.employeeField = page.getByRole('textbox', { name: 'Select Employee by Code or Name' });
    this.leaveTypeDropdown = page.getByText('Select Type');
    this.fromDateInput = page.locator('input[name="from_date"]');
    this.toDateInput = page.locator('input[name="to_date"]');
    this.purposeField = page.getByRole('textbox', { name: 'Type here' });
    this.successMessage = page.getByText('Leave application added successfully');
    // Apply in same date error
    this.errorMessage = page.getByText('Overlaps with another application');
    this.closeModal= page.getByRole('button', { name: 'Cancel' });
    // Delete Leave
    this.searchField = page.getByRole('textbox', { name: 'Employee Code or Name' });
    this.expandRowBtn = page.locator('.inline-block > span').first();
    this.deleteBtn = page.getByRole("button", { name: "Delete" }).first();
    this.confirmDeleteBtn = page.getByRole('button', { name: 'Delete' });
    this.confirmationDialog = page.getByText('Are you sure you want to');
    this.deleteSuccessMessage = page.getByText('Data deleted successfully.');
  }
  // CHECK MODAL UI COMPONENTS
  async checkModalComponent() {
    await this.expectAndClick(this.addNewBtn, "Add New Button");

    await this.assert({
      locator: { default: this.modalTitle },
      state: 'visible',
      alias: 'New Leave Application Modal visible'
    });

    const elements = [
      { locator: this.modal_employeeField, alias: 'Employee Field visible' },
      { locator: this.modal_statusField, alias: 'Status Field visible' },
      { locator: this.modal_leaveTypeField, alias: 'Leave Type Field visible' },
      { locator: this.modal_dayCountField, alias: 'Day Count Field visible' },
      { locator: this.modal_startDateField, alias: 'Start Date Field visible' },
      { locator: this.modal_endDateField, alias: 'End Date Field visible' },
      { locator: this.modal_purposeField, alias: 'Purpose Field visible' },
      { locator: this.modal_applyDateField, alias: 'Apply Date Field visible' },
      { locator: this.modal_foreignLeaveField, alias: 'Foreign Leave Field visible' },
      { locator: this.modal_cancelBtn, alias: 'Cancel Button visible' },
      { locator: this.saveBtn, alias: 'Save Button visible' },
    ];

    for (const el of elements) {
      await this.assert({
        locator: { default: el.locator },
        state: 'visible',
        alias: el.alias
      });
    }
  }
  // REQUIRED FIELD VALIDATION
  async requiredFieldValidation() {
    await this.expectAndClick(this.addNewBtn, "Add New Button");

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
  // CREATE NEW LEAVE
  async createNewLeave(employeeName, leaveType, leaveStartDate, leaveEndDate, leavePurpose, saveAfterFill = true) {
    await this.expectAndClick(this.addNewBtn, "Add New Button", "leaveAddButtonApi:GET");

    await this.expectAndClick(this.employeeField, "Employee Field");
    await this.waitAndFill(this.employeeField, employeeName, "Employee Field");
    await this.expectAndClick(this.page.getByRole('main').getByText(employeeName), "Select Employee Option");

    await this.expectAndClick(this.leaveTypeDropdown, "Leave Type Dropdown");
    await this.expectAndClick(
      this.page.locator('div').filter({ hasText: new RegExp(`^${leaveType}$`) }),
      "Select Leave Type"
    );

    await this.expectAndClick(this.fromDateInput, "From Date Input");
    await this.waitAndFill(this.fromDateInput, leaveStartDate, "From Date Input");

    await this.expectAndClick(this.toDateInput, "To Date Input");
    await this.waitAndFill(this.toDateInput, leaveEndDate, "To Date Input");

    await this.expectAndClick(this.purposeField, "Purpose Field");
    await this.waitAndFill(this.purposeField, leavePurpose, "Purpose Field");

    if (saveAfterFill) {
      await this.expectAndClick(this.saveBtn, "Save Button");
      await this.assert({
        locator: this.successMessage,
        state: "visible",
        alias: "Leave creation success message visible"
      });
    }
  }
  // APPLY LEAVE IN SAME DATE VALIDATION
  async applyLeaveInSameDate(employeeName, leaveType, leaveStartDate, leaveEndDate, leavePurpose) {
    await this.createNewLeave(employeeName, leaveType, leaveStartDate, leaveEndDate, leavePurpose, false);

    await this.expectAndClick(this.saveBtn, "Save Button");

    await this.assert({
      locator: this.errorMessage,
      state: "visible",
      alias: "Leave application in same date error message visible"
    });
    await this.expectAndClick(this.closeModal, "Close Modal Button");
  } 
  // DELETE LEAVE
  async deleteLeave(deleteEmployeeName) {
    await this.expectAndClick(this.searchField, "Search Field");
    await this.waitAndFill(this.searchField, deleteEmployeeName, "Search Field");

    await this.expectAndClick(this.expandRowBtn, "Expand Row Button");

    const employeeRow = this.page.getByRole('row', { name: new RegExp(deleteEmployeeName, 'i') });
    await employeeRow.locator('path').nth(2).click();

    
    await this.expectAndClick(this.page.getByText('Delete', { exact: true }), "Delete Button");
    

    await this.assert({
      locator: this.confirmationDialog,
      state: 'visible',
      alias: 'Delete confirmation dialog visible'
    });

    await this.expectAndClick(this.confirmDeleteBtn, "Confirm Delete Button");

    await this.assert({
      locator: this.deleteSuccessMessage,
      state: 'visible',
      alias: 'Leave deletion success message visible'
    });
  }

 
}
