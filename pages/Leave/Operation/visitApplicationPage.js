import BasePage from "../../BasePage.js";

export class VisitApplicationPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;

    // Common Components
    this.addNewButton = page.locator('button:has-text("Add New")');
    this.saveBtn = page.locator('button[type="submit"]');
    this.successMessage = this.page.getByText('Data saved successfully.');
    this.searchInput = page.getByPlaceholder('Search', { exact: true })
    this.editSuccessMessage = this.page.getByText('Data updated successfully.');

    // ---- COMPONENT LOCATORS ----
    this.leaveOverviewGraph = page.locator('div.flex.gap-1 > span.text-xs.font-bold.text-gray-400').first();
    this.supervisorName = page.locator('div.flex.flex-col > div.text-gray-900').first();
    this.expectedSupervisorName = 'Shabit -A -Alahi';

    //Visit Application Page Locators
    this.fromDate =  page.locator('input[name="visit_from"]');
    this.endDate = page.locator('input[name="visit_to"]');
    this.visitPurposeField = page.locator('textarea[name="notes"][placeholder="Type here"]');;
    this.clickBody = page.getByText('Visit Purpose');
    
    //Search Input and Status
    this.status = page.locator('td:has(span.text-warning-500)');
    this.expectedStatusText = 'Pending';

    //Supervisor View Locators
    this.supervisorRow = page.locator('tbody tr:has(div.font-medium:text("Tanzim Emon"))');
    this.employeeName = "Tanzim Emon";
    this.visitTab = page.getByRole('tab', { name: 'Visit' });
    this.employeeLocator = page.locator(`div.flex:has-text("${this.employeeName}")`).first();

    //Edit Application Locators
    this.editButton = page.locator("//div[contains(@class,'group') and contains(@class,'edit-hover-effect')]//*[name()='svg']");
    this.remarksField = page.locator('tbody tr td:nth-child(5) span');
    this.updatedFromDateField = page.locator("//tbody//tr//td[2]");
    this.supervisorFromDate = page.getByRole('cell', { name: '18-12-' })
    this.expectedRemarks = 'Client Visit';
    this.expectedFromDate = '18-12-2025 12:00 AM';

    //Delete Application Locators
    this.expandRowBtn = page.locator('.inline-block > span').first();
    this.deleteBtn = page.locator('.cursor-pointer.m-2').first();
    this.confirmDeleteBtn = page.getByRole('button', { name: 'Delete' });
    this.confirmationDialog = page.getByText('Are you sure you want to');
    this.deleteSuccessMessage = page.getByText('Data deleted successfully.');

    //Common Approve/Reject Visit Application Locators
    this.findEmployee = page.locator(`div.flex:has-text("${this.employeeName}")`).first();
    this.approveButton = page.getByRole('button', { name: 'Approve' });
    this.rejectButton = page.getByRole('button', { name: 'Reject' });
    this.confirmationModalApproveBtn = page.getByRole('button', { name: 'Approve' }).nth(1);
    this.confirmationModalRejectBtn = page.getByRole('button', { name: 'Reject' }).nth(1);
    this.approveSuccessMessage = page.getByText('Application approved successfully.');
    this.rejectSuccessMessage = page.getByText('Application rejected successfully.');

    //Edit Visit Application form Supervisor Locators
    this.editbtn = page.locator('.flex > .cursor-pointer > svg').first();
    this.approveRemarksField = page.getByRole('textbox', { name: 'Type here...' });
    this.approveButtonInEditForm = page.getByRole('button', { name: 'Approve' });
    this.editConfirmationModalApproveBtn = page.getByRole('button', { name: 'Approve' }).nth(1);

    //Visit Application Details Modal Locators.
    // this.employeeName = page.locator("//div[contains(@class,'bg-gray-50')]//p[contains(@class,'font-medium')]");
    // this.employeeId = page.locator("//div[contains(@class,'bg-gray-50')]//p[@class='text-xs text-gray-500'][1]");
    // this.designation = page.locator("//div[contains(@class,'bg-gray-50')]//p[@class='text-xs text-gray-500'][2]");
    // this.joinDate = page.locator("//p[normalize-space()='Join Date']/following-sibling::p");
    // this.jobStatus = page.locator("//p[normalize-space()='Job Status']/following-sibling::p");
    // this.branch = page.locator("//p[normalize-space()='Branch']/following-sibling::p");
    // this.department = page.locator("//p[normalize-space()='Department']/following-sibling::p");
    this.employeeName = page.locator("//div[contains(@class,'bg-gray-50')]//p[contains(@class,'font-medium')]");
    this.employeeId = page.locator("//p[normalize-space()='00000276']");
    this.designation = page.locator("//p[normalize-space()='SQA Engineer L-II']");
    this.joinDate = page.locator("//p[normalize-space()='Join Date']/following-sibling::p");
    this.jobStatus = page.locator("//p[normalize-space()='Job Status']/following-sibling::p");
    this.branch = page.locator("//p[normalize-space()='Branch']/following-sibling::p");
    this.department = page.locator("//p[normalize-space()='Department']/following-sibling::p");
    this.adminFromDate = page.locator('//p[text()="From Date"]/following-sibling::div/p');
    this.adminEndDate = page.locator('p:text("End Date") + div > p');
    this.dayCount = page.locator('p:text("Day Count") + div');
    this.adminVisitPurpose = page.locator('p:text("Visit Purpose") + div');




    //Approve/Reject Visit application form Admin View
    this.findEmployeeInVisitList= page.locator(`tbody tr:has(p.font-medium:text("Tanzim  Emon"))`);
    this.editButtonForAdmin = page.locator('.space-x-2').first();
    this.visitApproveMessageForAdmin = page.getByText('Visit application approved successfully');
    this.visitRejectMessageForAdmin = page.getByText('Visit application rejected successfully');

    //Update Visit Application by Admin
    this.updateVisitPurpose = page.getByRole('textbox', { name: 'Type here' })




  }
  // Get Leave Remaining Count
  async getLeaveRemainingCount() {
    await this.leaveOverviewGraph.waitFor({ state: 'visible', timeout: 5000 });
    return await this.leaveOverviewGraph.innerText();
  }

  // Get Supervisor Name Text
  async getSupervisorName() {
    await this.supervisorName.waitFor({ state: 'visible', timeout: 5000 });
    return await this.supervisorName.innerText();
  }

    // Validate Supervisor Name
  async validateSupervisorName() {
    const actualName = await this.getSupervisorName();
    return actualName === this.expectedSupervisorName;
  }

  // Get Supervisor Name and log matched message
  async logSupervisorName() {
    const actualName = await this.getSupervisorName();
    if (actualName === this.expectedSupervisorName) {
      console.log(`✅ Supervisor Name matched: ${actualName}`);
    } else {
      console.log(`❌ Supervisor Name mismatch. Expected: ${this.expectedSupervisorName}, Actual: ${actualName}`);
    }
    return actualName;
  }

  // CREATE NEW VISIT APPLICATION
  async createNewVisit(visitFromDate, visitEndDate, visitPurpose, saveAfterFill = true) {
    
    await this.expectAndClick(this.addNewButton, "Add New Visit Button");
   
    await this.expectAndClick(this.fromDate, "Visit From Date Input");
    await this.waitAndFill(this.fromDate, visitFromDate, "Visit From Date Input");
   
    await this.expectAndClick(this.endDate, "Visit End Date Input");
    await this.waitAndFill(this.endDate, visitEndDate, "Visit End Date Input");
    await this.clickBody.click();
    
    await this.expectAndClick(this.visitPurposeField, "Visit Purpose Field");
    await this.waitAndFill(this.visitPurposeField, visitPurpose, "Visit Purpose Field");
       
    if (saveAfterFill) {
        await this.expectAndClick(this.saveBtn, "Save Button");
        await this.assert({
            locator: this.successMessage,
            state: "visible",
            alias: "Visit application creation success message visible"
        });
    }
  }

  //Check visit Status in the list
  async verifyVisitStatus(visitPurpose) {
    // Select correct search field
    const searchField = this.searchInput;

    await searchField.fill(visitPurpose);
    await searchField.press('Enter');
    await this.status.first().waitFor({ state: 'visible', timeout: 10000 });

    const actualStatusText = (await this.status.first().textContent()).trim();

     // Employee console log
    if (actualStatusText === this.expectedStatusText) {
        console.log(`✅ Success: Visit status for "${visitPurpose}" is "${actualStatusText}" as expected.`);
    } else {
        console.error(`❌ Error: Visit status mismatch for "${visitPurpose}". Expected "${this.expectedStatusText}", but got "${actualStatusText}".`);
    }
  }

  // SUPERVISOR VALIDATION — CHECK IF EMPLOYEE NAME EXISTS
 
  async verifySupervisorView() {
    await this.visitTab.waitFor({ state: "visible", timeout: 8000 });
    await this.visitTab.click();
     await this.page.waitForResponse(res =>
        res.url().includes('/approver-pending-visits') && res.status() === 200
    );
    await this.supervisorRow.first().waitFor({ state: "visible", timeout: 10000 });
    const isVisible = await this.supervisorRow.first().isVisible();

    if (isVisible) {
      console.log(`✅ Success: "${this.employeeName}" found in Supervisor Visit List.`);
    } else {
      console.error(`❌ Error: "${this.employeeName}" NOT found in Supervisor Visit List.`);
    }
  }

  // EDIT VISIT APPLICATION
  async editVisitApplication(visitPurpose, updatedVisitFromDate, saveAfterEdit = true) {
    
    // Search for the existing visit application
    const searchField = this.searchInput;
    await searchField.fill(visitPurpose);
    await searchField.press('Enter');
    await this.page.waitForTimeout(2000);

    //Edit From Date
    await this.expectAndClick(this.editButton, "Edit Button");
    await this.page.waitForTimeout(2000);
    await this.expectAndClick(this.fromDate, "Visit From Date Input");
    await this.page.waitForTimeout(2000);
    await this.waitAndFill(this.fromDate, updatedVisitFromDate, "Visit From Date Input");
  
    if (saveAfterEdit) {
        await this.expectAndClick(this.saveBtn, "Save Button after Edit");
        await this.assert({
            locator: this.editSuccessMessage,
            state: "visible",
            alias: "Visit application edit success message visible"
        });
           
 }
}
//Check Updated visit Application in the list

async verifyFromDate(visitPurpose, expectedFromDate) {
   
    await this.updatedFromDateField.waitFor({ state: 'visible', timeout: 10000 });

    const actualFromDateText = (await this.updatedFromDateField.textContent()).trim();
     console.log("🔹 Expected From Date:", expectedFromDate);
    console.log("🔹 Actual From Date  :", actualFromDateText);

    if (actualFromDateText === this.expectedFromDate) {
        console.log(`✅ Success: Visit From Date for "${visitPurpose}" is "${actualFromDateText}" as expected.`);
    } else {
        console.error(`❌ Error: Visit From Date mismatch for "${visitPurpose}". Expected "${expectedFromDate}", but got "${actualFromDateText}".`);
    }
 
}

// SUPERVISOR VALIDATION — CHECK IF Updated application EXISTS

async verifyEditApplication(expectedFromDate) {
  
    await this.visitTab.waitFor({ state: "visible", timeout: 10000 });
    await this.visitTab.click();
    await this.page.waitForResponse(res =>
        res.url().includes('/approver-pending-visits') && res.status() === 200,
        { timeout: 20000 }
    );

    // Wait for the table rows to be rendered
    await this.supervisorRow.first().waitFor({ state: "visible", timeout: 15000 });
    const isVisible = await this.employeeLocator.isVisible();
    await this.supervisorFromDate.waitFor({ state: 'visible', timeout: 10000 });
    const actualFromDateText = (await this.supervisorFromDate.textContent()).trim();
    console.log("🔹 Expected From Date:", expectedFromDate);
    console.log("🔹 Actual From Date  :", actualFromDateText);

    if (isVisible) {
        console.log(`✅ Success: "${this.employeeName}" found in Supervisor Visit List.`);
    } else {
        console.error(`❌ Error: "${this.employeeName}" NOT found in Supervisor Visit List.`);
    }
    if (actualFromDateText === expectedFromDate) {
        console.log(`✅ Success: Visit From Date is "${actualFromDateText}" as expected.`);
    } else {
        console.error(`❌ Error: Visit From Date mismatch. Expected "${expectedFromDate}", but got "${actualFromDateText}".`);
    }
}
  // DELETE VISIT APPLICATION
   async deleteLeave(visitReason) {
    await this.expectAndClick(this.searchInput, "Search Field");
    await this.waitAndFill(this.searchInput, visitReason, "Search Field");
    await this.expectAndClick(this.deleteBtn, "Delete Button");
    await this.page.waitForTimeout(2000);

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
//Approve Visit Application
  async approveVisitApplication() {
    await this.visitTab.waitFor({ state: "visible", timeout: 10000 });
    await this.visitTab.click();
    await this.page.waitForResponse(res =>
        res.url().includes('/approver-pending-visits') && res.status() === 200,
        { timeout: 20000 } 
    );
    await this.supervisorRow.first().waitFor({ state: "visible", timeout: 15000 });
    await this.findEmployee.click();
    await this.page.waitForTimeout(2000);
    await this.approveButton.click();
    await this.expectAndClick(this.confirmationModalApproveBtn, "Confirm Approve Button");
    await this.assert({
      locator: this.approveSuccessMessage,
      state: 'visible',
      alias: 'Visit approval success message visible'
    });
}

//Reject Visit Application
  async rejectVisitApplication() {
    // Wait for the Visit tab and click it
    await this.visitTab.waitFor({ state: "visible", timeout: 10000 });
    await this.visitTab.click();
    await this.page.waitForResponse(res =>
        res.url().includes('/approver-pending-visits') && res.status() === 200,
        { timeout: 20000 }
    );
    await this.supervisorRow.first().waitFor({ state: "visible", timeout: 15000 });
    await this.findEmployee.click();
    await this.page.waitForTimeout(2000);
    await this.rejectButton.click();
    await this.expectAndClick(this.confirmationModalRejectBtn, "Confirm Reject Button");
    await this.assert({
      locator: this.rejectSuccessMessage,
      state: 'visible',
      alias: 'Visit rejection success message visible'
    });
}

//Edit Visit Application as Supervisor
  async editVisitApplicationAsSupervisor() {
    await this.visitTab.waitFor({ state: "visible", timeout: 10000 });
    await this.visitTab.click();
    await this.page.waitForResponse(res =>
        res.url().includes('/approver-pending-visits') && res.status() === 200,
        { timeout: 20000 } 
    );
    await this.supervisorRow.first().waitFor({ state: "visible", timeout: 15000 });
    await this.findEmployee
    await this.page.waitForTimeout(2000);
    await this.editbtn.click();
    await this.page.waitForTimeout(2000);
    await this.expectAndClick(this.approveRemarksField, "Approve Remarks Field");
    await this.waitAndFill(this.approveRemarksField, 'Approved by Supervisor', "Approve Remarks Field");
    await this.approveButton.click({ timeout: 5000 });
    await this.expectAndClick(this.confirmationModalApproveBtn, "Confirm Approve Button");
    await this.assert({
      locator: this.approveSuccessMessage,
      state: 'visible',
      alias: 'Visit approval success message visible'
    });
}
// View Visit Details as Admin
async visitDetails() {
    
    await this.findEmployee
    await this.page.waitForTimeout(2000);
    await this.editButtonForAdmin.click();
      const name = (await this.employeeName.textContent())?.trim();
      const id = (await this.employeeId.textContent())?.trim();
      // const designation = (await this.employeeDesignation.textContent())?.trim();
      const joinDate = (await this.joinDate.textContent())?.trim();
      const jobStatus = (await this.jobStatus.textContent())?.trim();
      const branch = (await this.branch.textContent())?.trim();
      const department = (await this.department.textContent())?.trim();
      const fromDate = (await this.adminFromDate.textContent())?.trim();
      const endDate = (await this.adminEndDate.textContent())?.trim();
      const dayCount = (await this.dayCount.textContent())?.trim();
      const visitPurpose = (await this.adminVisitPurpose.textContent())?.trim();
   return {
    name,id,joinDate,jobStatus,branch,department,fromDate, endDate, dayCount, visitPurpose 
  };

}
// Approve Visit Application as Admin
async visitApproveAsAdmin() {
   
    await this.findEmployee
    await this.page.waitForTimeout(2000);
    await this.editButtonForAdmin.click();
    await this.expectAndClick(this.approveButton, "Confirm Approve Button");
    await this.assert({
      locator: this.visitApproveMessageForAdmin,
      state: 'visible',
      alias: 'Visit approval success message visible'
    });
}

// Reject Visit Application as Admin
async visitRejectAsAdmin() {
   
    await this.findEmployee
    await this.page.waitForTimeout(2000);
    await this.editButtonForAdmin.click();
    await this.expectAndClick(this.rejectButton, "Confirm Reject Button");
    await this.assert({
      locator: this.visitRejectMessageForAdmin,
      state: 'visible',
      alias: 'Visit rejection success message visible',
    });
}

//Edit & Approve Visit Application by Admin
async visitEditAsAdmin() {
   
    await this.findEmployee
    await this.page.waitForTimeout(2000);
    await this.editButtonForAdmin.click();
    await this.updateVisitPurpose.click();
     await this.waitAndFill(this.updateVisitPurpose, 'Client Visit', "Visit Purpose");
    await this.expectAndClick(this.approveButton, "Confirm Approve Button");
    await this.assert({
      locator: this.visitApproveMessageForAdmin,
      state: 'visible',
      alias: 'Visit Approve success message visible',
    });
}

//Delete Visit Application by Admin
async visitDeleteAsAdmin() {
   
    await this.findEmployee
    await this.page.waitForTimeout(2000);
   await this.expectAndClick(this.deleteBtn, "Delete Button");
    await this.page.waitForTimeout(2000);

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
export default VisitApplicationPage;

