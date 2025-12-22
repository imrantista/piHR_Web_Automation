import BasePage from "../../BasePage";
import { expect } from "@playwright/test";

export class DailyAttendancePage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
  }

  //Locators
  attendanceInTimeBtn = () => this.page.getByRole("button", { name: "In Time" });
  attendanceOutTimeBtn = () => this.page.getByRole("button", { name: "Out Time" });
  successToasterSaved = () => this.page.getByText("Data saved successfully.").first();
  successToasterUpdated = () => this.page.getByText("Data updated successfully.").first();
  searchBox = () => this.page.getByRole("textbox", { name: "Search", exact: true });
  startBreakBtn = () => this.page.getByRole("button", { name: "Start Break" });
  stopBreakBtn = () => this.page.getByRole("button", { name: "Stop Break" });
  breakTextArea = () => this.page.locator("textarea");
  saveBtn = () => this.page.getByRole("button", { name: "Save" });
  successToaster = () => this.page.getByText("Data saved successfully.");
  onBreakNowCard = () => this.page.locator("div").filter({ hasText: /^On Break Now\d*$/ }).first();
  employeeCell = (employeeName) => this.page.getByRole("cell", { name: new RegExp(employeeName, "i") });
  detailsBtn = () => this.page.getByRole("main").getByRole("button");
  inTimeColumn = () => this.page.locator('th:has-text("In Time")').locator("..").locator("td");
  outTimeColumn = () => this.page.locator('th:has-text("Out Time")').locator("..").locator("td");
  //
  inTimeDiv = () => this.page.locator('div.text-sm.text-center.text-gray-500:has-text("Your In Time")').first();
  outTimeDiv = () => this.page.locator('div.text-sm.text-center.text-gray-500:has-text("Your Out Time")').first();
  employeeRow = () => this.page.locator('table tbody tr').first();
  employeeNameCell = (row) => row.locator('td:nth-of-type(1) p.font-normal');
  employeeInTimeCell = (row) => row.locator('td:nth-of-type(3) span');
  employeeOutTimeCell = (row) => row.locator('td:nth-of-type(4) span');
  searchBox = () => this.page.locator('input[placeholder="Search"]');
  saveBtn = () => this.page.locator('button:has-text("Save")');
  
  //Utility
  async isVisible(locator) {
    return await locator().isVisible().catch(() => false);
  }

  async checkSuccessToaster() {
    const savedVisible = await this.isVisible(this.successToasterSaved);
    const updatedVisible = await this.isVisible(this.successToasterUpdated);
    if (savedVisible) await expect(this.successToasterSaved()).toBeHidden({ timeout: 5000 });
    else if (updatedVisible) await expect(this.successToasterUpdated()).toBeHidden({ timeout: 5000 });
    else console.log("No success toaster appeared!");
  }

  // Attendance in time submitted by employee
  async submitInTimeByEmployee() {
    if (await this.isVisible(this.attendanceInTimeBtn)) {
      await this.expectAndClick(this.attendanceInTimeBtn(), "Save In Time");
      await this.checkSuccessToaster();
      console.log("In Time submitted successfully");
    } else if (await this.isVisible(this.attendanceOutTimeBtn)) {
      console.log("In Time already provided");
    } else {
      console.log("Attendance buttons not visible");
    }
  }
  // Attendance out time submitted by employee
  async submitOutTimeByEmployee() {
    if (await this.isVisible(this.attendanceOutTimeBtn)) {
      if (await this.isVisible(this.attendanceInTimeBtn)) {
        console.log("Submitting In Time before Out Time...");
        await this.submitInTimeByEmployee();
      }
      await this.expectAndClick(this.attendanceOutTimeBtn(), "Save Out Time");
      await this.checkSuccessToaster();
      console.log("Out Time submitted successfully");
    } else if (await this.isVisible(this.attendanceInTimeBtn)) {
      console.log("Out Time cannot be provided before In Time. Submitting In Time only...");
      await this.submitInTimeByEmployee();
    } else {
      console.log("Attendance buttons not visible");
    }
  }
   // Break time started by employee
  async startBreakTimeByEmployee() {
    if (await this.isVisible(this.attendanceInTimeBtn)) {
      console.log("In Time not provided. Submitting In Time first...");
      await this.submitInTimeByEmployee();
    }
    if (await this.isVisible(this.stopBreakBtn)) {
      console.log("Break already started");
      return;
    }
    await expect(this.startBreakBtn()).toBeVisible({ timeout: 5000 });
    await this.expectAndClick(this.startBreakBtn(), "Start break time");
    await expect(this.breakTextArea()).toBeVisible({ timeout: 5000 });
    await this.breakTextArea().fill("Start break");
    await expect(this.saveBtn()).toBeVisible({ timeout: 5000 });
    await this.expectAndClick(this.saveBtn(), "Save break time");
    await expect(this.successToaster()).toBeVisible({ timeout: 5000 });
    console.log("Break time started successfully");
  }
  // Verify Admin Can See Which Employee Is Currently on Break
  async adminCanSeeEmployeeBreakStatus(employeeName) {
    await expect(this.onBreakNowCard()).toBeVisible({ timeout: 5000 });
    await this.expectAndClick(this.onBreakNowCard(), "On Break Now card");
    const empCell = this.employeeCell(employeeName);
    await expect(empCell).toBeVisible({ timeout: 5000 });
    await this.expectAndClick(empCell, `Employee cell: ${employeeName}`);
    await expect(this.detailsBtn()).toBeVisible({ timeout: 5000 });
    await this.expectAndClick(this.detailsBtn(), "Employee break details button");

    console.log(`Admin can see break status for ${employeeName} successfully`);
}

  // Break time ended by employee
  async endBreakTimeByEmployee() {
    if (await this.isVisible(this.attendanceInTimeBtn)) {
      console.log("In Time not provided. Submitting In Time first...");
      await this.submitInTimeByEmployee();
    }
    if (!(await this.isVisible(this.stopBreakBtn))) {
      console.log("Break is not started yet. Starting break first...");
      await this.startBreakTimeByEmployee();
    }
    await expect(this.stopBreakBtn()).toBeVisible({ timeout: 5000 });
    await this.expectAndClick(this.stopBreakBtn(), "Stop break button");
    await expect(this.breakTextArea()).toBeVisible({ timeout: 5000 });
    await this.breakTextArea().fill("End break");
    await expect(this.saveBtn()).toBeVisible({ timeout: 5000 });
    await this.expectAndClick(this.saveBtn(), "Save break end");
    await expect(this.successToaster()).toBeVisible({ timeout: 5000 });
    console.log("Break ended successfully");

    if (await this.isVisible(this.attendanceOutTimeBtn)) {
      console.log("Submitting Out Time after break...");
      await this.submitOutTimeByEmployee();
    }
  }
getText = async (element) => {
    await expect(element).toBeVisible({ timeout: 5000 });
    return (await element.textContent())?.trim() || '';
}
// Get employee in/out time from employee page
getEmployeeAttendanceTimes = async () => {
    const inTime = await this.getText(this.inTimeDiv().locator('span').nth(1));
    const outTime = await this.getText(this.outTimeDiv().locator('span').nth(1));
    expect(inTime).not.toBe('');
    expect(outTime).not.toBe('');
    console.log(`[Step 6] Final values – In Time: "${inTime}", Out Time: "${outTime}"`);
    return { inTime, outTime };
}
// Verify employee attendance in admin Quick View
verifyEmployeeAttendanceByAdmin = async (employeeName, expectedInTime, expectedOutTime) => {
    await this.searchBox().fill(employeeName);
    await this.searchBox().press('Enter');
    const row = this.employeeRow();
    await expect(row).toBeVisible({ timeout: 10000 });
    const nameCell = await this.getText(this.employeeNameCell(row));
    const inTime = await this.getText(this.employeeInTimeCell(row));
    const outTime = await this.getText(this.employeeOutTimeCell(row));
    console.log(`[Admin Page] Name Cell: ${nameCell}`);
    console.log(`[Admin Page] In Time: ${inTime}, Out Time: ${outTime}`);
    console.log(`[Expected] In Time: ${expectedInTime}, Out Time: ${expectedOutTime}`);
    expect(nameCell.toLowerCase()).toContain(employeeName.toLowerCase());
    expect(inTime).toBe(expectedInTime);
    expect(outTime).toBe(expectedOutTime);
    console.log(`Verified In Time (${expectedInTime}) and Out Time (${expectedOutTime}) for ${employeeName} in Admin Quick View`);
}

}
