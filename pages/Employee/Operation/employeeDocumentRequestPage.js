import BasePage from "../../BasePage.js";
import { config } from '../../../config/testConfig.js';

export class DocumentRequest extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;

   //Locators
   this.addNewButton = page.locator('button:has-text("Add New")');
   this.documentPurposeField = page.getByRole('textbox', { name: 'Enter Document Purpose' })
   this.remarksField = page.getByRole('textbox', { name: 'Enter Remarks' });
   this.expectedDateField = page.getByRole('textbox', { name: 'Select date' });
   this.saveButton = page.getByRole('button', { name: 'Save' });
   this.successMessage = this.page.getByText('Data saved successfully.');
   this.editSuccessMessage = this.page.getByText('Data updated successfully.');
   this.clickBody = page.getByText('Remarks*');
   this.searchInput = page.getByPlaceholder('Search', { exact: true })
   this.editbtn = page.locator("//tbody/tr[1]/td[5]/div[1]/div[1]/div[1]/div[1]/div[1]//*[name()='svg']");
   this.status = page.getByRole('cell', { name: 'Pending' }).first();
   this.rejectStatus = page.getByRole('cell', { name:'Rejected'})
   this.expectedStatusText = "Pending"
  
   //Delete Document Application
   this.deleteBtn = page.locator('.cursor-pointer.m-2').first();
   this.confirmDeleteBtn = page.getByRole('button', { name: 'Delete' });
   this.confirmationDialog = page.getByText('Are you sure you want to');
   this.deleteSuccessMessage = page.getByText('Data deleted successfully.');

   //Approve / Reject Document Application
   this.approveBtn = page.locator("//tbody/tr[1]/td[8]/div[1]/button[1]/div[1]//*[name()='svg']");
   this.rejectBtn = page.locator("//tbody/tr[1]/td[8]/div[1]/button[2]/div[1]//*[name()='svg']");
   this.confirmBtn = page.getByRole('button', { name: 'Confirm' });
   this.approveConfirmationDialog = page.getByText('Are you sure you want to approve this item?');
   this.rejectConfirmationDialog = page.getByText('Are you sure you want to reject this item?');
   this.approveSuccessMessage = page.getByText('Application approved successfully.');
   this.rejectSuccessMessage = page.getByText('Application rejected successfully.');
   this.expectedStatusAterApproved = "Approved"
   this.expectedStatusAfterReject = "Rejected"
   this.pendingForAcknowledgementBtn = page.getByRole('button', { name: 'Acknowledge & Complete' })
   this.expectedStatusAterAcknowledgeButtonClik = "Completed"
  }

  //Create Request Document Application
  async createRequestDocument(
              documentPurpose = config.documentRequest.documentPurpose,
              remarks = config.documentRequest.remarks,
              expectedDate = config.documentRequest.expectedDate, 
              saveAfterFill = true) 
  {
    await this.expectAndClick(this.addNewButton, "Add New Visit Button");
    await this.expectAndClick(this.documentPurposeField, "Document Purpose Input");
    await this.waitAndFill(this.documentPurposeField, documentPurpose, "Document Purpose Input");

    await this.expectAndClick(this.remarksField, "Remarks Input");
    await this.waitAndFill(this.remarksField, remarks, "Remarks Input");

    await this.expectAndClick(this.expectedDateField, "Expected Date Input");
    await this.waitAndFill(this.expectedDateField, expectedDate, "Expected Date Input");
    await this.clickBody.click();

     if (saveAfterFill) {
        await this.expectAndClick(this.saveButton, "Save Button");
        await this.assert({
            locator: this.successMessage,
            state: "visible",
            alias: "Document Request creation success message visible"
        });
    }
  }

  //Edit Request Document Application
async editRequestedDocument(
              documentPurpose = config.documentRequest.documentPurpose,
              UpdatedDocumentPurpose = config.documentRequest.updatedDocumentPurpose,
              saveAfterFill = true) 
  {
    await this.expectAndClick(this.searchInput, "Search Input");
    await this.waitAndFill(this.searchInput, documentPurpose, "Searc Input");
    await this.page.waitForTimeout(2000);
    await this.expectAndClick(this.editbtn, "Edit Button Click");
    await this.page.waitForTimeout(2000);
    await this.expectAndClick(this.documentPurposeField, "Updated Document Purpose Input");
    await this.waitAndFill(this.documentPurposeField, UpdatedDocumentPurpose, "Updated Document Purpose Input");

    if (saveAfterFill) {
        await this.expectAndClick(this.saveButton, "Save Button");
        await this.assert({
            locator: this.editSuccessMessage,
            state: "visible",
            alias: "Document Request Updated success message visible"
        });
    }
    await this.expectAndClick(this.searchInput, "Search Input");
    await this.waitAndFill(this.searchInput, UpdatedDocumentPurpose, "Searc Input");
    await this.status.first().waitFor({ state: 'visible', timeout: 10000 });

    const actualStatusText = (await this.status.first().textContent()).trim();

     // Employee console log
    if (actualStatusText === this.expectedStatusText) {
        console.log(`✅ Success: Application Status is "${actualStatusText}" as expected.`);
    } else {
        console.error(`❌ Error: Visit status mismatch. Expected "${this.expectedStatusText}", but got "${actualStatusText}".`);
    }
  }

  //Delete Document Application
  async deleteDocumentApplication(UpdatedDocumentPurpose = config.documentRequest.updatedDocumentPurpose) 
  {
       
    await this.expectAndClick(this.searchInput, "Search Input");
    await this.waitAndFill(this.searchInput, UpdatedDocumentPurpose, "Searc Input");
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
      alias: 'Document Application deletion success message visible'
    })
    
  }

  //Approve Document Application by Admin
   async approveDocument(UpdatedDocumentPurpose = config.documentRequest.updatedDocumentPurpose) 
  {   
    await this.expectAndClick(this.searchInput, "Search Input");
    await this.waitAndFill(this.searchInput, UpdatedDocumentPurpose, "Searc Input");
    await this.page.waitForTimeout(2000);
    await this.expectAndClick(this.approveBtn, "Approve Document Application");
    await this.page.waitForTimeout(2000);

    await this.assert({
      locator: this.approveConfirmationDialog,
      state: 'visible',
      alias: 'Approve confirmation dialog visible'
    });
    await this.expectAndClick(this.confirmBtn, "Confirm Approve Button");
    await this.assert({
      locator: this.approveSuccessMessage,
      state: 'visible',
      alias: 'Document Application Approve success message visible'
    })
  }

   async employeeVerifyDocument(UpdatedDocumentPurpose = config.documentRequest.updatedDocumentPurpose){
    await this.expectAndClick(this.searchInput, "Search Input");
    await this.waitAndFill(this.searchInput, UpdatedDocumentPurpose, "Searc Input");
    await this.status.first().waitFor({ state: 'visible', timeout: 10000 });

    const actualStatusText = (await this.status.first().textContent()).trim();

     
    if (actualStatusText === this.expectedStatusAterApproved) {
        console.log(`✅ Success: Application Status is "${actualStatusText}" as expected.`);
    } else {
        await this.page.waitForTimeout(2000);
        await this.expectAndClick(this.editbtn, "Edit Button Click");
        await this.page.waitForTimeout(2000);
        await this.expectAndClick(this.pendingForAcknowledgementBtn, "CLick on Acknowledge & Complete Button");
        await this.page.waitForTimeout(2000);
        const actualStatusText = (await this.status.first().textContent()).trim();
        if (actualStatusText === this.expectedStatusAterAcknowledgeButtonClik) {
        console.log(`✅ Success: Application Status is "${actualStatusText}" as expected.`);
    } else {
        console.error(`❌ Error: Application status mismatch. Expected "${this.expectedStatusAterAcknowledgeButtonClik}", but got "${actualStatusText}".`);
    }

    }
  }

  //Reject Document Application by Admin
   async rejectDocument(UpdatedDocumentPurpose = config.documentRequest.updatedDocumentPurpose) 
  {   
    await this.expectAndClick(this.searchInput, "Search Input");
    await this.waitAndFill(this.searchInput, UpdatedDocumentPurpose, "Searc Input");
    await this.page.waitForTimeout(2000);
    await this.expectAndClick(this.rejectBtn, "Reject Document Application");
    await this.page.waitForTimeout(2000);

    await this.assert({
      locator: this.rejectConfirmationDialog,
      state: 'visible',
      alias: 'Reject confirmation dialog visible'
    });
    await this.expectAndClick(this.confirmBtn, "Confirm Approve Button");
    await this.assert({
      locator: this.rejectSuccessMessage,
      state: 'visible',
      alias: 'Document Application Reject success message visible'
    })
  }

   async employeeVerifyRejectDocument(UpdatedDocumentPurpose = config.documentRequest.updatedDocumentPurpose){
    await this.expectAndClick(this.searchInput, "Search Input");
    await this.waitAndFill(this.searchInput, UpdatedDocumentPurpose, "Searc Input");
    await this.rejectStatus.first().waitFor({ state: 'visible', timeout: 10000 });

    const actualStatusText = (await this.rejectStatus.first().textContent()).trim();

     
    if (actualStatusText === this.expectedStatusAfterReject) {
        console.log(`✅ Success: Application Status is "${actualStatusText}" as expected.`);
    } else {  
        console.error(`❌ Error: Application status mismatch. Expected "${this.expectedStatusAfterReject}", but got "${actualStatusText}".`);
    }
  
  }
}
export default DocumentRequest;

