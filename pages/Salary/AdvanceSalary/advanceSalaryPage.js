import { generateAdvanceSalaryData } from "../../../utils/advanceSalaryDataGenerator";
import { getTableColumnData } from "../../../utils/tableHelper";
import BasePage from "../../BasePage";

export class AdvanceSalaryPage extends BasePage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;

        // Add New Button
        this.addNewBtn = page.getByRole('button', { name: 'Add New' });

        // Search Field
        this.searchField = page.getByRole('textbox', { name: 'Search', exact: true });

        // Table Locator
        this.advanceSalaryTable = page.locator('table');

        // Advance Salary Form 
        this.advanceAmountField = page.locator('input[name="advance_salary_amount"]');
        this.paymentMethodField = page.getByRole('textbox', { name: 'Select Method' });
        this.paymentDurationField = page.locator('input[name="duration_month"]');
        this.startMonthField = page.getByRole('textbox', { name: 'Select Month' });
        this.yearField = page.getByRole('textbox', { name: 'Select Year' });
        this.remarksField = page.locator('textarea[name="remarks"]');
        this.saveBtn = page.getByRole('button', { name: 'Save' });
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' });

        // Admin Only Advance Salary Form
        this.employeeField = page.getByRole('textbox', { name: 'Select Employee' });
        this.fileUploadField = page.locator('input[type="file"]');

        // Delete Confirmation Dialog
        this.confirmDeleteBtn = page.getByRole('button', { name: 'Delete' });

        // Supervisor Section
        this.advanceSalaryTab = page.getByRole('tab', { name: 'Advance Salary' });
        this.approveBtn = page.getByRole('button', { name: 'Approve' });
        this.confirmApproveBtn = page.getByRole('button', { name: 'Approve' }).nth(1);
        this.rejectBtn = page.getByRole('button', { name: 'Reject' });
        this.confirmRejectBtn = page.getByRole('button', { name: 'Reject' }).nth(1);

        // Admin Section
        this.editOption = page.getByText('Edit');
        this.viewDetailsOption = page.getByText('View Details');
        this.deleteOption = page.getByText('Delete', { exact: true });


    }

    async clickAddNewButton() {
        await this.expectAndClick(this.addNewBtn, 'Add New Button');
    }

    async fillAdvanceSalaryForm(dataOverrides = {}) {
        const data = generateAdvanceSalaryData(dataOverrides);
        await this.waitAndFill(this.advanceAmountField, data.advanceAmount, 'Advance Amount Field');
        await this.expectAndClick(this.paymentMethodField, 'Payment Method Field');
        await this.expectAndClick(this.page.getByRole('listitem').filter({ hasText: new RegExp(`^${data.paymentMethod}$`) }), `Payment Method Option: ${data.paymentMethod}`);
        await this.waitAndFill(this.paymentDurationField, data.paymentDuration, 'Payment Duration Field');
        await this.expectAndClick(this.startMonthField, 'Start Month Field');
        await this.expectAndClick(this.page.getByRole('listitem').filter({ hasText: new RegExp(`^${data.startMonth}$`) }), `Start Month Option: ${data.startMonth}`);
        await this.expectAndClick(this.yearField, 'Year Field');
        await this.expectAndClick(this.page.getByRole('listitem').filter({ hasText: new RegExp(`^${data.year}$`) }), `Year Option: ${data.year}`);
        await this.waitAndFill(this.remarksField, data.remarks, 'Remarks Field');
    }

    async submitAdvanceSalaryForm() {
        await this.expectAndClick(this.saveBtn, 'Save Button');
    }

    async cancelAdvanceSalaryForm() {
        await this.expectAndClick(this.cancelBtn, 'Cancel Button');
    }

    async addAdvanceSalary(dataOverrides = {}) {
        await this.clickAddNewButton();
        await this.fillAdvanceSalaryForm(dataOverrides);
        await this.submitAdvanceSalaryForm();
    }

    async addAdvanceSalaryAndVerify(dataOverrides = {}) {
        await this.addAdvanceSalary(dataOverrides);
        const successMessage = this.page.getByText('Data saved successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Data saved successfully."
        });
    }

    async openEditModal() {
        const statusArray = await getTableColumnData(this.advanceSalaryTable, 7, true);
        const firstPendingIndex = statusArray.findIndex(status => status.trim() === 'Pending');
        if (firstPendingIndex === -1) {
            throw new Error('No pending advance salary application found to edit.');
        }
        const firstRow = this.advanceSalaryTable.locator('tbody tr').nth(firstPendingIndex);
        await firstRow.getByRole('cell').last().locator('svg').first().click();
    }

    async editAdvanceSalary(dataOverrides = {}) {
        await this.openEditModal();
        const data = generateAdvanceSalaryData(dataOverrides);
        await this.waitAndFill(this.advanceAmountField, data.advanceAmount, 'Advance Amount Field');
        await this.waitAndFill(this.paymentDurationField, data.paymentDuration, 'Payment Duration Field');
        await this.waitAndFill(this.remarksField, data.remarks, 'Remarks Field');
        await this.submitAdvanceSalaryForm();
    }

    async editAndVerifyAdvanceSalary(dataOverrides = {}) {
        await this.editAdvanceSalary(dataOverrides);
        const successMessage = this.page.getByText('Data saved successfully.');
        await this.assert({
            locator: successMessage.last(),
            state: "visible",
            alias: "Data saved successfully."
        });
    }

    async openDeleteDialog() {
        const statusArray = await getTableColumnData(this.advanceSalaryTable, 7, true);
        const firstPendingIndex = statusArray.findIndex(status => status.trim() === 'Pending');
        if (firstPendingIndex === -1) {
            throw new Error('No pending advance salary application found to delete.');
        }
        const firstRow = this.advanceSalaryTable.locator('tbody tr').nth(firstPendingIndex);
        await firstRow.getByRole('cell').last().locator('svg').last().click();
    }

    async deleteAdvanceSalary() {
        await this.openDeleteDialog();
        await this.expectAndClick(this.confirmDeleteBtn, 'Confirm Delete Button');
    }

    async deleteAndVerifyAdvanceSalary() {
        await this.deleteAdvanceSalary();
        const successMessage = this.page.getByText('Data deleted successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Data deleted successfully."
        });
    }

    // Function to navigate to Advance Salary Tab in Supervisor Section
    async navigateToAdvanceSalaryTab() {
        await this.expectAndClick(this.advanceSalaryTab, 'Advance Salary Tab');
    }

    // Approve Advance Salary Application By Supervisor
    async OpenApproveModal() {
        const statusArray = await getTableColumnData(this.advanceSalaryTable, 11, true);
        const firstPendingIndex = statusArray.findIndex(status => status.trim() === 'Pending');
        if (firstPendingIndex === -1) {
            throw new Error('No pending advance salary application found to edit.');
        }
        const firstRow = this.advanceSalaryTable.locator('tbody tr').nth(firstPendingIndex);
        await firstRow.getByRole('cell').last().locator('svg').first().click();
    }

    async approveAdvanceSalary() {
        await this.OpenApproveModal();
        await this.expectAndClick(this.approveBtn, 'Approve Button');
        await this.expectAndClick(this.confirmApproveBtn, 'Confirm Approve Button');
    }

    async approveAndVerifyAdvanceSalary() {
        await this.approveAdvanceSalary();
        const successMessage = this.page.getByText('Application approved successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Application approved successfully."
        });
    }

    async openRejectDialog() {
        const statusArray = await getTableColumnData(this.advanceSalaryTable, 11, true);
        const firstPendingIndex = statusArray.findIndex(status => status.trim() === 'Pending');
        if (firstPendingIndex === -1) {
            throw new Error('No pending advance salary application found to delete.');
        }
        const firstRow = this.advanceSalaryTable.locator('tbody tr').nth(firstPendingIndex);
        await firstRow.getByRole('cell').last().locator('svg').last().click();
    }

    async rejectAdvanceSalary() {
        await this.openRejectDialog();
        await this.expectAndClick(this.rejectBtn, 'Reject Button');
        await this.expectAndClick(this.confirmRejectBtn, 'Confirm Reject Button');
    }

    async rejectAndVerifyAdvanceSalary() {
        await this.rejectAdvanceSalary();
        const successMessage = this.page.getByText('Application rejected successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Application rejected successfully."
        });
    };


    // Admin Specific Functions 
    async openMenu()
    {
        const firstRow = this.advanceSalaryTable.locator('tbody tr').first();
        await firstRow.getByRole('cell').last().click();
    }
    async openMenuForPendingApplication() {
        const statusArray = await getTableColumnData(this.advanceSalaryTable, 8, true);
        const firstPendingIndex = statusArray.findIndex(status => status.trim() === 'Pending');
        if (firstPendingIndex === -1) {
            throw new Error('No pending advance salary application found to edit.');
        }
        const firstRow = this.advanceSalaryTable.locator('tbody tr').nth(firstPendingIndex);
        await firstRow.getByRole('cell').last().click();
    }

    async approveAdvanceSalaryByAdmin() {
        await this.openMenuForPendingApplication();
        await this.expectAndClick(this.viewDetailsOption, 'View Details Option');
        await this.expectAndClick(this.approveBtn, 'Approve Button');   
    }

    async approveAndVerifyAdvanceSalaryByAdmin() {
        await this.approveAdvanceSalaryByAdmin();
        const successMessage = this.page.getByText('Advance salary request approved successfully');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Advance salary request approved successfully"
        });
    };

    async updateAdvanceSalaryByAdmin(dataOverrides = {}) {
        await this.openMenuForPendingApplication();
        await this.expectAndClick(this.editOption, 'Edit Option');
        const data = generateAdvanceSalaryData(dataOverrides);
        await this.waitAndFill(this.advanceAmountField, data.advanceAmount, 'Advance Amount Field');
        await this.waitAndFill(this.paymentDurationField, data.paymentDuration, 'Payment Duration Field');
        await this.waitAndFill(this.remarksField, data.remarks, 'Remarks Field');
        await this.submitAdvanceSalaryForm();
    }

    async updateAndVerifyAdvanceSalaryByAdmin(dataOverrides = {}) {
        await this.updateAdvanceSalaryByAdmin(dataOverrides);
        const successMessage = this.page.getByText('Data updated successfully.');
        await this.assert({
            locator: successMessage.last(),
            state: "visible",
            alias: "Data updated successfully."
        });
    }

    async rejectAdvanceSalaryByAdmin() {
        await this.openMenuForPendingApplication();
        await this.expectAndClick(this.viewDetailsOption, 'View Details Option');
        await this.expectAndClick(this.rejectBtn, 'Reject Button');   
    }

    async rejectAndVerifyAdvanceSalaryByAdmin() {
        await this.rejectAdvanceSalaryByAdmin();
        const successMessage = this.page.getByText('Advance salary request rejected successfully');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Advance salary request rejected successfully"
        });
    }

    async deleteAdvanceSalaryByAdmin() {
        await this.openMenuForPendingApplication();
        await this.expectAndClick(this.deleteOption, 'Delete Option');
        await this.expectAndClick(this.confirmDeleteBtn, 'Confirm Delete Option');
    }

    async deleteAndVerifyAdvanceSalaryByAdmin() {
        await this.deleteAdvanceSalaryByAdmin();
        const successMessage = this.page.getByText('Data deleted successfully.');
        await this.assert({
            locator: successMessage,
            state: "visible",
            alias: "Data deleted successfully."
        });
    }

}