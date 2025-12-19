import BasePage from "../../BasePage";
import fs from 'fs';
import {
  generateLeaveDatesAfter,
  getLatestToDate,
  isConfigRangePresent,
  isPastRange,
  getAdjustedToDateFromLeaveTxt
} from "../../../utils/dateUtils.js";

import path from "path";

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
    // Employee Leave Management Page
    this.selfServiceTab= page.getByRole('paragraph').filter({ hasText: 'Self Service' });
    this.myScreenBtn=page.getByRole('paragraph').filter({ hasText: 'My Screens' });
    this.dashboardBtn=page.getByRole('button', { name: 'Dashboard' });
    this.leaveOverviewTitle = page.getByText('Leave Overview');
    this.remainingHeader = page.getByRole('heading', { name: 'Remaining' });
    this.remainingLeaveCount =page.getByText('15Leave Remaining');
    this.takenLeaveCount =page.getByText('0Leave Taken');
    this.annualLeaveTitle=page.getByText('Annual Leave');
    this.annualLeaveCount=page.getByText('Annual Leave15/');
    this.supervisorInfo=page.locator('div').filter({ hasText: /^Shabit -A -AlahiSQA Engineer L-I00000586$/ }).first();
    this.leaveApplicationBtn = page.getByRole('button', { name: 'Leave Application' });
    this.leaveTypeBtn=page.getByText('×Annual Leave');
    this.leaveTypeOptionBtn=page.locator('div').filter({ hasText: /^Annual Leave$/ });
    this.approvarInfo=page.getByText('Approver*Shabit -A -Alahi');
    this.pendingStatus=page.getByText('Pending').first();
    this.updateLeaveApplicationBtn=page.locator( 'button:has(svg path[d^="M9.34153"])').first();
    // this.updateLeaveApplicationBtn=page.getByRole('row', { name: '15-12-2025 Yes 26-01-2026 27-' }).getByRole('button');
    // this.updateSuccessToast=page.getByText('Leave application updated');
    this.updateSuccessToast= page.getByText('Leave application updated successfully');
    this.deleteLeaveApplicationIcon= page.locator('.group.delete-hover-effect');
    this.deleteBtn=page.getByRole('button', { name: 'Delete' });
    this.deleteSuccessToast=page.getByText('Data deleted successfully.');
    this.approveSuccessToast=page.getByText('Application approved');
    this.noDataFoundTxt=page.getByText('No Data Found');

    // Supervisor 
    this.approvalApplicationBtn=page.getByRole('button', { name: 'Approve Application' });
    this.clickApplication=page.getByRole('cell', { name: 'Tanzim Emon Banani' }).locator('div').first();
    this.rejectBtn=page.getByRole('button', { name: 'Reject' });
    this.confirmRejectBtn=page.getByRole('button', { name: 'Reject' }).nth(1);
    this.rejectionStatus=page.getByText('Application rejected');
    this.acceptLeaveBtn=page.getByRole('button', { name: 'Approve' });
    this.confirmAcceptLeaveBtn=page.getByRole('button', { name: 'Approve' }).nth(1);
    this.supervisorEditLeaveApplicationBtn =page.locator('.flex.items-end');
    this.remarksTxt =page.getByRole('textbox', { name: 'Type here...' });
    this.approveBtn=page.getByRole('button', { name: 'Approve' });
    this.confirmApproveBtn=page.getByRole('button', { name: 'Approve' }).nth(1);
    //Admin locators
    this.leaveBtn= page.getByRole('paragraph').filter({ hasText: 'Leave' }).getByRole('img');
    this.operationBtn=  page.getByRole('paragraph').filter({ hasText: 'Operation' });
    this.adminSearchBox=page.getByRole('textbox', { name: 'Employee Code or Name' });
    this.kebabMenuBtn=page.locator('.group.vertical-dots-hover-effect-wrapper').first();
    this.editLeaveBtn=page.getByText('Edit', { exact: true });
    this.leavePurposeTxt=page.getByText('Purpose*vacation');
    this.leaveTypeTxt=page.getByText('Annual Leave×Annual Leave');
    this.deleteLeaveBtn= page.getByText('Delete', { exact: true });
    this.confirmDeleteLeaveBtn=page.getByRole('button', { name: 'Delete' });
    this.deleteLeaveSuccessToast=page.getByText('Data deleted successfully.');

    // this.checkStatus=page.getByRole('cell', { name: 'Status' }).click();

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

  //Employee Leave Management Page


  async verifyLeaveEligibility(){
  await this.expectAndClick(this.selfServiceTab,"Self Service Tab");
  await this.myScreenBtn.hover();
  await this.expectAndClick(this.dashboardBtn,'DashBoard');
  await this.saveApiResponse("myDashboardApi","employee","employeeLeaveInformation.json");
  await this.saveTextFromDivLocators();            
  await this.saveNumberFromLocatorSpanValue({
                "Leave Remaining": "leave/leaveRemaining.txt",
                "Leave Taken": "leave/leaveTaken.txt",
                });
}

  async checkIfLeavePresentOrNot(){
  await this.expectAndClick(this.selfServiceTab,"Self Service Tab");
  await this.myScreenBtn.hover();
  await this.expectAndClick(this.leaveApplicationBtn,"Leave Application Button");
  await this.page.waitForLoadState('networkidle');

  }

async getLeaveTableRows() {
  const headers = this.page.locator("thead tr th");
  const headerCount = await headers.count();

  const headerIndex = {};
  for (let i = 0; i < headerCount; i++) {
    const text = (await headers.nth(i).innerText()).trim();
    headerIndex[text] = i;
  }

  const rows = this.page.locator("tbody tr");
  const rowCount = await rows.count();

  const data = [];
  for (let r = 0; r < rowCount; r++) {
    const tds = rows.nth(r).locator("td");

    const from = ((await tds.nth(headerIndex["From"]).innerText()) ?? "").trim();
    const to = ((await tds.nth(headerIndex["To"]).innerText()) ?? "").trim();
    const approved = ((await tds.nth(headerIndex["Approved"]).innerText()) ?? "").trim();

    data.push({ From: from, To: to, Approved: approved });
  }

  return data;
}


async storeTableColumnDataToTxt(outputRelativePath, ...headerNames) {
  console.log(`\n📌 Saving table data for headers: ${headerNames.join(", ")}`);

  const outputPath = path.join(
    process.cwd(),
    "SaveData",
    "txt",
    outputRelativePath
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const headers = this.page.locator("thead tr th");
  const headerCount = await headers.count();

  const columnMap = {};
  for (let i = 0; i < headerCount; i++) {
    const text = (await headers.nth(i).innerText()).trim();
    if (headerNames.includes(text)) {
      columnMap[text] = i;
      console.log(`✅ Found header "${text}" at index ${i}`);
    }
  }

  for (const name of headerNames) {
    if (!(name in columnMap)) {
      throw new Error(`❌ Header "${name}" not found in table`);
    }
  }

  const rows = this.page.locator("tbody tr");
  const rowCount = await rows.count();
  console.log(`📊 Total rows: ${rowCount}\n`);

  const lines = [];
  lines.push(`Headers: ${headerNames.join(" | ")}`);
  lines.push(`Total rows: ${rowCount}`);
  lines.push("=".repeat(80));

  for (let i = 0; i < rowCount; i++) {
    lines.push(`Row ${i + 1}:`);

    for (const header of headerNames) {
      const colIndex = columnMap[header];
      const cell = rows.nth(i).locator("td").nth(colIndex);

      const cellText = ((await cell.innerText()) ?? "").trim().replace(/\s+/g, " ");
      lines.push(`${header}: ${cellText}`);
    }

    lines.push("-".repeat(80));
  }

  fs.writeFileSync(outputPath, lines.join("\n"), "utf8");

  console.log(`✅ Saved table info to: ${outputPath}\n`);
  return { outputPath, rowCount };
}
  async applyLeave(leaveStartDate, leaveEndDate, leavePurpose,saveAfterFill = true){
  await this.checkIfLeavePresentOrNot();
  if (await this.noDataFoundTxt.isVisible()) {
    console.log("No data found");
    await this.expectAndClick(this.addNewBtn,"Add New Button");
  await this.expectAndClick(this.leaveTypeBtn,"Leave type drop down");
  await this.expectAndClick(this.leaveTypeOptionBtn,"Annual Leave");
   await this.expectAndClick(this.fromDateInput, "From Date Input");
    await this.waitAndFill(this.fromDateInput, leaveStartDate, "From Date Input");

    await this.expectAndClick(this.toDateInput, "To Date Input");
    await this.waitAndFill(this.toDateInput, leaveEndDate, "To Date Input");

    await this.expectAndClick(this.purposeField, "Purpose Field");
    await this.waitAndFill(this.purposeField, leavePurpose, "Purpose Field");
    await this.assert({
      locator: this.approvarInfo,
      state: 'visible',
      alias:'Shabit-A-Alahi text visible',
    })

    if (saveAfterFill) {
      await this.expectAndClick(this.saveBtn, "Save Button");
      await this.assert({
        locator: this.successMessage,
        state: "visible",
        alias: "Leave creation success message visible"
      });
    }
    await this.assert({
      locator:this.pendingStatus,
      state: 'visible',
      toHaveText: 'Pending'
    });
} else {
  console.log("Leave data is present");
  await this.page.waitForLoadState("networkidle");
  await this.storeTableColumnDataToTxt("Employee/leaveApplicationTableInfo.txt","From","To","Approved");

  const rows = await this.getLeaveTableRows();

  const configStart = leaveStartDate;
  const configEnd = leaveEndDate;

  const matched = isConfigRangePresent(rows, configStart, configEnd);
  const past = isPastRange(configStart, configEnd);

  const latestTo = getLatestToDate(rows);
  if (!latestTo) throw new Error("Could not determine latest To date from table.");

  let finalStart = configStart;
  let finalEnd = configEnd;

  if (matched || past) {
    const generated = generateLeaveDatesAfter(latestTo);
    finalStart = generated.leaveStartDate;
    finalEnd = generated.leaveEndDate;

    console.log("Config matched/past → generating new range after latestTo:", latestTo);
    console.log("Generated:", finalStart, finalEnd);
  } else {
    console.log("Config not matched and not past → using config range:", finalStart, finalEnd);
  }

  await this.expectAndClick(this.addNewBtn, "Add New Button");
  await this.expectAndClick(this.leaveTypeBtn, "Leave type drop down");
  await this.expectAndClick(this.leaveTypeOptionBtn, "Annual Leave");

  await this.expectAndClick(this.fromDateInput, "From Date Input");
  await this.waitAndFill(this.fromDateInput, finalStart, "From Date Input");

  await this.expectAndClick(this.toDateInput, "To Date Input");
  await this.waitAndFill(this.toDateInput, finalEnd, "To Date Input");

  await this.expectAndClick(this.purposeField, "Purpose Field");
  await this.waitAndFill(this.purposeField, leavePurpose, "Purpose Field");


    await this.assert({
      locator: this.approvarInfo,
      state: 'visible',
      alias:'Shabit-A-Alahi text visible',
    })

    if (saveAfterFill) {
      await this.expectAndClick(this.saveBtn, "Save Button");
      await this.assert({
        locator: this.successMessage,
        state: "visible",
        alias: "Leave creation success message visible"
      });
    }
    await this.assert({
      locator:this.pendingStatus,
      state: 'visible',
      toHaveText: 'Pending'
    });
  }
  
  }

  async supervisorRejectLeave(){
    await this.expectAndClick(this.selfServiceTab,"Self Service Tab");
    await this.myScreenBtn.hover();
    await this.expectAndClick(this.approvalApplicationBtn,"Approval Application Dropdown");
    await this.expectAndClick(this.clickApplication,"Click Approval Application");
    await this.expectAndClick(this.rejectBtn, "Reject Application");
    await this.expectAndClick(this.confirmRejectBtn, "Confrim Application Rejection");
    await this.assert({
      locator: this.rejectionStatus,
      state: 'visible',
      alias: 'Application rejected'
    })
  }

  async approveLeaveApplication(){
    await this.expectAndClick(this.selfServiceTab,"Self Service Tab");
    await this.myScreenBtn.hover();
    await this.expectAndClick(this.approvalApplicationBtn,"Approval Application Dropdown");
    await this.expectAndClick(this.clickApplication,"Click Approval Application");
    await this.expectAndClick(this.acceptLeaveBtn,"Accept Leave");
    await this.expectAndClick(this.confirmAcceptLeaveBtn,"Confirm Accept Leave");
  }

  async compareUIAndApiLeaveTakenAndLeaveRemainingValueBreforeApproval(){
    await this.saveNumberFromLocatorSpanValue({
                "Leave Remaining": "leave/leaveRemaining.txt",
                "Leave Taken": "leave/leaveTaken.txt",
                });
    await this.compareApiJsonWithTxtFiles({
            apiJsonSubPath: "employeeLeaveInformation.json",
            apiArrayPath: "body.leave_information",
            comparisons: [
                {
                label: "Leave Remaining",
                apiField: "remaining_leaves",
                txtSubPath: "leave/leaveRemaining.txt",
                },
                {
                label: "Leave Taken",
                apiField: "leave_taken",
                txtSubPath: "leave/leaveTaken.txt",
                },
            ],
            });
  }
  async afterApproveCompareUIAndApiLeaveTakenAndLeaveRemainingValueBreforeApproval(){
    await this.saveApiResponse("myDashboardApi","employee","afterLeaveEmployeeInformation.json");
    await this.saveNumberFromLocatorSpanValue({
                "Leave Remaining": "leave/AfterApproveLeaveRemaining.txt",
                "Leave Taken": "leave/AfterApproveLeaveTaken.txt",
                });
    await this.compareApiJsonWithTxtFiles({
            apiJsonSubPath: "AfterLeaveEmployeeInformation.json",
            apiArrayPath: "body.leave_information",
            comparisons: [
                {
                label: "Leave Remaining",
                apiField: "remaining_leaves",
                txtSubPath: "leave/AfterApproveLeaveRemaining.txt",
                },
                {
                label: "Leave Taken",
                apiField: "leave_taken",
                txtSubPath: "leave/AfterApproveLeaveTaken.txt",
                },
            ],
            });
  }

  async adminVerifyLeaveApplication(){
   await this.expectAndClick(this.leaveBtn,"Leave Button");
   await this.operationBtn.hover();
   await this.expectAndClick(this.leaveApplicationBtn,"Leave Application Button");
   await this.waitAndFill(this.adminSearchBox,"Tanzim");
   await this.assertStatus(
  'Tanzim Emon',
  'Pending'
);
  }

  async updateLeaveApplication(saveAfterFill = true) {
  await this.expectAndClick(this.selfServiceTab, "Self Service Tab");
  await this.myScreenBtn.hover();
  await this.expectAndClick(this.leaveApplicationBtn, "Leave Application Button");
  await this.page.waitForLoadState("networkidle");

  await this.storeTableColumnDataToTxt(
    "Employee/updateLeaveApplicationTableInfo.txt",
    "From",
    "To",
    "Duration",
    "Approved"
  );

  const { adjustedTo } = getAdjustedToDateFromLeaveTxt({
    filePath: path.join(
      process.cwd(),
      "SaveData",
      "txt",
      "Employee",
      "updateLeaveApplicationTableInfo.txt"
    ),
  });

  await this.expectAndClick(this.updateLeaveApplicationBtn, "Update Leave Application Button");
  await this.expectAndClick(this.toDateInput, "To Date Input");
  await this.waitAndFill(this.toDateInput, adjustedTo, "To Date Input");

  if (saveAfterFill) {
    await this.expectAndClick(this.saveBtn, "Save Button");
  }

  await this.assert({
    locator: this.updateSuccessToast,
    state: "visible",
    alias: "Leave application updated successfully",
  });
}

  async deleteLeaveApplication(){
    await this.expectAndClick(this.selfServiceTab,"Self Service Tab");
    await this.myScreenBtn.hover();
    await this.expectAndClick(this.leaveApplicationBtn,"Leave Application Button");
    await this.expectAndClick(this.deleteLeaveApplicationIcon,"Delete Leave Application");
    await this.expectAndClick(this.deleteBtn,"Delete Button");
  }
async supervisorEditLeaveApplication(){
    await this.expectAndClick(this.selfServiceTab,"Self Service Tab");
    await this.myScreenBtn.hover();
    await this.expectAndClick(this.approvalApplicationBtn,"Approval Application Dropdown");
     await this.page.waitForLoadState("networkidle");

  await this.storeTableColumnDataToTxt(
    "Employee/supervisorUpdateLeaveApplicationTableInfo.txt",
    "From Date",
    "To Date",
    "Duration",
  );

  const { adjustedTo } = getAdjustedToDateFromLeaveTxt({
    filePath: path.join(
      process.cwd(),
      "SaveData",
      "txt",
      "Employee",
      "supervisorUpdateLeaveApplicationTableInfo.txt"
    ),
  });

    await this.expectAndClick(this.supervisorEditLeaveApplicationBtn,"Edit leave Application");
    await this.expectAndClick(this.toDateInput, "To Date Input");
    await this.waitAndFill(this.toDateInput, adjustedTo, "To Date Input");
    await this.expectAndClick(this.remarksTxt,'Type Remarks here.');
    await this.waitAndFill(this.remarksTxt,'1 day is avaible for you');
    await this.expectAndClick(this.approveBtn,'Approve Leave Application');
    await this.expectAndClick(this.confirmApproveBtn,'Confirm Approve Leave Application'); 
}

async adminApproveLeaveApplication(){
   await this.expectAndClick(this.leaveBtn,"Leave Button");
   await this.operationBtn.hover();
   await this.expectAndClick(this.leaveApplicationBtn,"Leave Application Button");
   await this.waitAndFill(this.adminSearchBox,"Tanzim");
   await this.page.reload('networkidle'); 
   await this.expectAndClick(this.kebabMenuBtn,"Click Kebab Menu Button");
   await this.expectAndClick(this.editLeaveBtn,"Edit Leave");
   await this.expectAndClick(this.approveBtn,"Click Approve Button");
}

async adminRejectPendingLeaveApplication(){
   await this.expectAndClick(this.leaveBtn,"Leave Button");
   await this.operationBtn.hover();
   await this.expectAndClick(this.leaveApplicationBtn,"Leave Application Button");
   await this.waitAndFill(this.adminSearchBox,"Tanzim");
   await this.page.reload('networkidle');
   await this.expectAndClick(this.kebabMenuBtn,"Click Kebab Menu Button"); 
   await this.expectAndClick(this.deleteLeaveBtn,"Click Delete button");
   await this.expectAndClick(this.confirmDeleteLeaveBtn,"Click Confirm Delete Button");
   await this.assert({
    locator: this.deleteLeaveSuccessToast,
    state: 'visible',
    toHaveText: 'Data deleted successfully.'
   })
  }
  async adminEditLeaveApplication(){
   await this.expectAndClick(this.leaveBtn,"Leave Button");
   await this.operationBtn.hover();
   await this.expectAndClick(this.leaveApplicationBtn,"Leave Application Button");
   await this.waitAndFill(this.adminSearchBox,"Tanzim");
   
   await this.storeTableColumnDataToTxt(
     "Employee/adminUpdateLeaveApplicationTableInfo.txt",
     "From",
     "To",
     "Duration",
     "Status"
    );
    
    const { adjustedTo } = getAdjustedToDateFromLeaveTxt({
      filePath: path.join(
        process.cwd(),
        "SaveData",
        "txt",
        "Employee",
        "adminUpdateLeaveApplicationTableInfo.txt"
      ),
    });
     await this.page.reload('networkidle');
   await this.expectAndClick(this.kebabMenuBtn,"Click Kebab Menu Button");
   await this.expectAndClick(this.editLeaveBtn,"Edit Leave");
   const elements = [
      { locator: this.leavePurposeTxt, alias: 'Vacation' },
      { locator: this.leaveTypeTxt, alias: 'Annual Leave' },
   ]
   for (const el of elements) {
      await this.assert({
        locator: { default: el.locator },
        state: 'visible',
        alias: el.alias
      });
    }
   await this.expectAndClick(this.toDateInput, "To Date Input");
   await this.waitAndFill(this.toDateInput, adjustedTo, "To Date Input"); 
   await this.expectAndClick(this.approveBtn,"Click Approve Button");
   await this.assertStatus("Tanzim Emon", "Approved");
  }  

  async adminDeleteLeaveApplication(){
   await this.expectAndClick(this.leaveBtn,"Leave Button");
   await this.operationBtn.hover();
   await this.expectAndClick(this.leaveApplicationBtn,"Leave Application Button");
   await this.waitAndFill(this.adminSearchBox,"Tanzim");
   await this.expectAndClick(this.kebabMenuBtn,"Click Kebab Menu Button");
  }

}