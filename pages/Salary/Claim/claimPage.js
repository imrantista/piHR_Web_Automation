import { expect } from "@playwright/test";
import { generateClaimData } from "../../../utils/claimFormDataGenerator";
import { getRowCount, getTableColumnData } from "../../../utils/tableHelper";
import BasePage from "../../BasePage";
import { testFile } from "../../../config/testFiles";
import path from "path";
import fs from "fs";


export class ClaimPage extends BasePage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;

        //File Path
        this.filePath = testFile;

        //Add New Button
        this.addNewBtn = page.getByRole('button', { name: 'Add New' });

        //Claim Form
        this.advancedAmountField = page.locator('input[name="advanced_amount"]');
        this.advanceDateField = page.getByRole('textbox', { name: 'Select Advance Date' });
        this.claimDateField = page.getByRole('textbox', { name: 'Select Claim Date' });   // Required
        this.descriptionField = page.locator('textarea[name="description"]');
        this.claimCategory = page.getByRole('textbox', { name: 'Select Category' });  // Required
        this.claimAmountField = page.locator('input[name="claim_amount"]'); //Required
        this.fromDateField = page.getByRole('textbox', { name: 'Select From Date' }); //Required
        this.toDateField = page.getByRole('textbox', { name: 'Select To Date' });    //Required
        this.remarkField = page.locator('textarea[name="remark"]');
        this.chooseFileField = page.getByText('Choose File');
        this.addNowBtn = page.getByRole('button', { name: 'Add Now' });
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
        this.saveBtn = page.getByRole('button', { name: 'Save' });
        this.updateBtn = page.getByRole('button', { name: 'Update' });

        this.uploadFileField = page.locator('input[type="file"]');
        this.downloadContainer = page.locator('#download');



        // Admin & Supervisor Only Claim Form
        this.approveBtn = page.getByRole('button', { name: 'Approve' });
        this.rejectBtn = page.getByRole('button', { name: 'Reject' });
        this.confirmBtn = page.getByRole('button', { name: 'Confirm' });

        this.approvedAmountField = page.locator('input[name="approved_amount"]');
        this.selectStatusField = page.getByPlaceholder('Select Status');
        this.disburseBthn = page.getByRole('button', { name: 'Disburse' });

        this.searchField = page.getByRole('textbox', { name: 'Search', exact: true })



        //Table
        this.claimTable = page.getByRole('table');
        //Edit button
        this.editBtn = page.getByRole('button', { name: 'Edit' });

        //Delte Button
        this.deleteBtn = page.getByText('Delete', { exact: true });
        this.confirmDeleteBtn = page.getByRole('button', { name: 'Delete' })

        //Claim Detail Table (In Add and Edit Form)
        this.claimDetailTable = page.getByText('Claim Details').locator('..').locator('table');

    }

    async openClaimForm() {
        await this.addNewBtn.click();
    }

    async fillDateField(field, date) {
        await this.waitAndFill(field, date);
        await this.page.keyboard.press('Escape');
    }

    async fillClaimForm(requiredOnly = true, claimCategoryOption = false) {
        const data = generateClaimData();
        if (!requiredOnly) {
            await this.waitAndFill(this.advancedAmountField, data.advancedAmount);
            await this.fillDateField(this.advanceDateField, data.advanceDate);
            await this.waitAndFill(this.descriptionField, data.description);
            await this.waitAndFill(this.remarkField, data.remark);
        }

        await this.waitAndFill(this.claimDateField, data.claimDate);
        if (!claimCategoryOption) {
            await this.claimCategory.click();
            await this.page.getByRole('listitem').filter({ hasText: /^Advance$/ }).click();
        }
        await this.waitAndFill(this.claimAmountField, data.claimAmount);
        await this.fillDateField(this.fromDateField, data.fromDate);
        await this.fillDateField(this.toDateField, data.toDate);
        return data;
    }


    async submitClaimForm() {
        await this.expectAndClick(this.saveBtn, "Save Button");
    }

    async verifyClaimAdded() {
        const successMessage = this.page.getByText('Data saved successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Data saved successfully."
        });
    }

    async verifyClaimUpdated() {
        const successMessage = this.page.getByText('Data updated successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Data updated successfully."
        });
    }

    async getClaimNo(role = "employee") {
        if (role === "admin") {
            return await getTableColumnData(this.claimTable, 2);
        }
        return await getTableColumnData(this.claimTable, 1);
    }

    async getClaimAmount(role) {
        if (role === "admin") {
            return await getTableColumnData(this.claimTable, 9);
        }
        return await getTableColumnData(this.claimTable, 8);
    }

    async verifyClaimAmount(amount) {
        const claimAmount = await this.getClaimAmount();
        expect(claimAmount).toContain(amount);
    }

    async addNewClaim(requiredOnly) {
        await this.openClaimForm();
        // 1. Fill the claim form
        const data = await this.fillClaimForm(requiredOnly);
        // 2. Add the claim in Claim Details Table
        await this.expectAndClick(this.addNowBtn, "Add Now Button");
        // 3. Submit the claim
        await this.submitClaimForm();
        return data;
    }

    async addAndVerifyClaim(requiredOnly = true) {
        const data = await this.addNewClaim(requiredOnly);
        await this.verifyClaimAdded();
        await this.verifyClaimAmount(data.claimAmount);
    }

    // Open Menu for Status
    async openFirstClaimedRowMenu(expectedStatus, role = "employee") {
        var statusArray = [];
        if (role === "admin") {
            statusArray = await getTableColumnData(this.claimTable, 13, true);
        }
        else {
            statusArray = await getTableColumnData(this.claimTable, 12, true);
        }
        const firstClaimedIndex = statusArray.findIndex(status => status.trim() === expectedStatus);
        if (firstClaimedIndex === -1) {
            throw new Error("No row found for status : " + expectedStatus + ".");
        }
        const firstRow = this.claimTable.locator('tbody tr').nth(firstClaimedIndex);
        await firstRow.getByRole('cell').last().click();
    }

    async openEditModal() {
        await this.openFirstClaimedRowMenu("Claimed");
        await this.expectAndClick(this.editBtn, "Edit Button");
    }

    async getClaimedDetailCount() {
        return await getRowCount(this.claimDetailTable);
    }
    async openPreviousEditForm() {
        const firstClaim = this.claimDetailTable.locator('tbody tr').first();
        await firstClaim.getByRole('cell').locator('svg').first().click();
    }

    async editAndVerifyClaim() {
        await this.openEditModal();
        expect(await this.getClaimedDetailCount()).toBeGreaterThan(0);
        await this.openPreviousEditForm();
        const data = await this.fillClaimForm(true, true);
        await this.expectAndClick(this.updateBtn, "Update Button");
        await this.submitClaimForm();
        await this.verifyClaimUpdated();
        await this.verifyClaimAmount(data.claimAmount);
    }
    async deleteAndVerifyClaim() {
        await this.openFirstClaimedRowMenu("Claimed");
        await this.expectAndClick(this.deleteBtn, "Delete Button");
        await this.expectAndClick(this.confirmDeleteBtn, "Confirm Delete Button");
        const successMessage = this.page.getByText('Data deleted successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Data deleted successfully."
        });
    }

    async approveClaimWithoutAmount() {
        await this.openFirstClaimedRowMenu("Claimed", "admin");
        await this.expectAndClick(this.editBtn, "Edit Button");

        await this.expectAndClick(this.approveBtn, "Approve Button");
        await this.expectAndClick(this.confirmBtn, "Confirm Approve Button");
        const successMessage = this.page.getByText('Application approved successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Application approved successfully."
        });
    }

    async rejectClaim() {
        await this.openFirstClaimedRowMenu("Claimed", "admin");
        await this.expectAndClick(this.editBtn, "Edit Button");

        await this.expectAndClick(this.rejectBtn, "Reject Button");
        const successMessage = this.page.getByText('Application rejected successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Application rejected successfully."
        });
    }

    async editAndApproveClaim() {
        const allRows = this.claimTable.locator('tbody tr');

        // Only rows with more than 1 cell (ignore "No data found" row)
        const dataRowCount = await allRows.filter({ has: allRows.locator('td:nth-child(2)') }).count();

        if (dataRowCount === 0) {
            console.log("Terminating Due to Lack of pending claims.");
            return;
        }
        const statusArray = await getTableColumnData(this.claimTable, 13, true);
        const firstClaimedIndex = statusArray.findIndex(status => status.trim() === "Claimed");
        if (firstClaimedIndex === -1) {
            console.log("Terminating Due to Lack of pending claims.");
            return;
        }
        const firstRow = this.claimTable.locator('tbody tr').nth(firstClaimedIndex);
        const claimNo = await firstRow.locator('td:nth-child(2)').innerText();
        const rawAmountText = await firstRow
            .locator('td:nth-child(9)')
            .innerText();

        const claimAmount = Number(
            rawAmountText.replace(/[^0-9.]/g, "")
        );

        const approvedAmount = Math.max(
            claimAmount * 0.8,
            1
        )

        await firstRow.getByRole('cell').last().click();
        await this.expectAndClick(this.editBtn, "Edit Button");
        await this.openPreviousEditForm();
        await this.waitAndFill(this.approvedAmountField, approvedAmount);
        await this.expectAndClick(this.updateBtn, "Update Button");
        await this.expectAndClick(this.approveBtn, "Approve Button");
        const successMessage = this.page.getByText('Application approved successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Application approved successfully."
        });
        return claimNo;
    }

    async verifyClaimUpdateBySupervisor(requiredClaimNo) {
        const claimArray = await getTableColumnData(this.claimTable, 1, true);
        const index = claimArray.findIndex(claim => claim.trim() === requiredClaimNo.trim());
        if (index === -1) {
            console.log("Terminating as the Claim with claimNo : " + requiredClaimNo + " is not found.");
            return;
        }
        const firstRow = this.claimTable.locator('tbody tr').nth(index);
        const rawApprovedAmount = await firstRow
            .locator('td:nth-child(9)')
            .innerText();

        const approvedAmount = Number(
            rawApprovedAmount.replace(/[^0-9.]/g, "")
        );
        expect(approvedAmount).toBeGreaterThan(0);
    }
    async filterClaimByStatus(status) {
        await this.selectStatusField.click();
        await this.page.getByRole('listitem').filter({ hasText: new RegExp(`^${status}$`) }).click();
        await this.page.waitForTimeout(1000);
    }

    async fillClaimWithFile() {
        await this.openClaimForm();
        await this.uploadFileField.setInputFiles(testFile);
        await this.fillClaimForm(false, false);
        await this.expectAndClick(this.addNowBtn, "Add Now Button");
        await this.submitClaimForm();
        await this.verifyClaimAdded();
        const claimNo = await this.getClaimNo();
        return claimNo;
    }

    async verifyAdminApproveClaim() {
        await this.filterClaimByStatus("Claimed");
        const statusArray = await getTableColumnData(this.claimTable, 13, true);
        const firstClaimedIndex = statusArray.findIndex(status => status.trim() === "Claimed");
        if (firstClaimedIndex === -1) {
            console.log("Terminating Due to Lack of pending claims.");
            return;
        }
        const firstRow = this.claimTable.locator('tbody tr').first();
        await firstRow.locator('input[type="checkbox"]').check();
        await this.expectAndClick(this.disburseBthn, "Disburse Button");
        await this.expectAndClick(this.confirmBtn, "Confirm Disburse Button");
        const successMessage = this.page.getByText('Successfully disbursed 1 claims and 0 claims are failed.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Claim disbursed successfully."
        });
    }

    async verifyAdminRejectClaim() {
        await this.filterClaimByStatus("Claimed");
        await this.openFirstClaimedRowMenu("Claimed", "admin");
        await this.expectAndClick(this.editBtn, "Edit Button");
        await this.page.getByText('Rejected').locator('..')
            .locator('input[type="radio"]').check();

        await this.expectAndClick(this.saveBtn, "Save Button");
        const successMessage = this.page.getByText('Data updated successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Data updated successfully."
        });
    }


    async verifyAdminDeleteClaim() {
        await this.filterClaimByStatus("Claimed");
        await this.openFirstClaimedRowMenu("Claimed", "admin");
        await this.expectAndClick(this.deleteBtn, "Delete Button");
        await this.expectAndClick(this.confirmDeleteBtn, "Confirm Delete Button");
        const successMessage = this.page.getByText('Data deleted successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Data deleted successfully."
        });

    }

    async searchByClaimNo(claimNo) {
        await this.waitAndFill(this.searchField, claimNo, "Search Field");
        await this.page.waitForTimeout(1000);
    }

    async verifyFileDownload(claimNo) {
        await this.searchByClaimNo(claimNo);
        await this.openFirstClaimedRowMenu("Claimed", "admin");
        await this.expectAndClick(this.editBtn, "Edit Button");
        const [download] = await Promise.all([
            this.page.waitForEvent('download'), // Wait for download event
            this.downloadContainer.click(),      // Trigger download
        ]);
        const suggestedFilename = download.suggestedFilename();

        // Save to desired location
        const downloadPath = path.resolve('./downloads', suggestedFilename);
        await download.saveAs(downloadPath);

        // Verify file exists
        const fileExists = fs.existsSync(downloadPath);
        expect(fileExists).toBe(true);

    }

}