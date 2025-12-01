import { th } from "@faker-js/faker";
import BasePage from "../BasePage";

export class DeleteLeave extends BasePage {
  constructor(page, context,) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.searchField = page.getByRole('textbox', { name: 'Employee Code or Name' });
    this.expandRowBtn = page.locator('.inline-block > span').first();
    this.deleteBtn = page.getByRole("button", { name: "Delete" }).first();
    this.confirmDeleteBtn = page.getByRole('button', { name: 'Delete' });
    this.confirmationDialog = page.getByText('Are you sure you want to');
    this.successMessage = page.getByText('Data deleted successfully.');
  }
  async deleteLeave(deleteEmployeeName) {
    await this.expectAndClick(this.searchField, "Search Field");
    await this.waitAndFill(this.searchField, deleteEmployeeName, "Search Field");
    await this.expectAndClick(this.expandRowBtn, "Expand Row Button");
    const employeeRow = this.page.getByRole('row', { name: new RegExp(deleteEmployeeName, 'i') });
    await employeeRow.locator('path').nth(2).click();
    await this.expectAndClick(this.page.getByText('Delete', { exact: true }), "Delete Button");
    await this.assert({
      locator: this.confirmationDialog ,
      state: 'visible',
      alias: 'Delete confirmation dialog visible'
    });
    await this.expectAndClick(this.confirmDeleteBtn, "Confirm Delete Button", "leaveDeleteApi:DELETE");
    await this.assert({
      locator: this.successMessage,
      state: 'visible',
      alias: 'Leave deletion success message visible'
    });
  }
}
