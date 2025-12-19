import BasePage from "../../BasePage";
import { expect } from "@playwright/test";

export class AssetPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
  }

  // ---------- Locators ----------
  requestAssetButton = () => this.page.getByRole("button", { name: "Request an asset" });
  fromDateInput = () => this.page.locator('input[name="from_date"]');
  toDateInput = () => this.page.locator('input[name="to_date"]');
  categoryDropdown = () => this.page.getByRole('textbox', { name: 'Please select asset category' });
  descriptionInput = () => this.page.getByRole("textbox", { name: "Type here" });
  saveButton = () => this.page.getByRole("button", { name: "Save" });
  successToaster = () => this.page.getByText("Data saved successfully.");
  modalTitle = () => this.page.getByRole('heading', { name: 'New Asset Request' });
  pendingLabel = () => this.page.getByText('Pending').first();
  tableFirstEditButton = () => this.page.getByRole('table').getByRole('button').first();
  updatedDescriptionCell = (text) => this.page.getByText(text).first();
  searchBox = () => this.page.getByRole('textbox', { name: 'Search', exact: true });
  pendingRequest = () => this.page.getByText('Pending', { exact: true });
  clickoutsidesearchbox = () => this.page.getByText('Employee Code');
  approveSuccessToaster = () => this.page.getByText("Application approved successfully.");
  rejectButton = () => this.page.getByRole('cell', { name: 'Reject' }).locator('rect').nth(1);
  rejectToaster = () => this.page.getByText("Application rejected successfully.");
  assignedAssetBtn = () => this.page.getByText('Asset Assigned');

  // Employee Request Asset
  async requestAssetByEmployee(descriptionText = "test assets") {
    await this.expectAndClick(this.requestAssetButton(), "Request an asset Button");
    const today = new Date().toISOString().split("T")[0];
    await this.fromDateInput().fill(today);
    await this.toDateInput().fill(today);
    await this.expectAndClick(this.modalTitle(), "New Asset Request Modal");
    await this.expectAndClick(this.categoryDropdown(), "Category Dropdown");
    await this.categoryDropdown().fill('Office Accessories');
    await this.categoryDropdown().press('Enter');
    await this.descriptionInput().fill(descriptionText);
    await this.expectAndClick(this.saveButton(), "Save Button");
    await expect(this.successToaster()).toBeVisible();
    await expect(this.successToaster()).toBeHidden({ timeout: 5000 });
    const displayedDate = today.split('-').reverse().join('-');
    const appliedDateCell = this.page.locator('td', { hasText: displayedDate }).first();
    await expect(appliedDateCell).toBeVisible();
  }
  // Employee Edit Asset Request
  async employeeCanEditAssetRequest(updatedDescription = "Updated details") {
    if (!(await this.pendingLabel().isVisible().catch(() => false))) {
      await this.requestAssetByEmployee();
      await expect(this.pendingLabel()).toBeVisible();
    }
    await this.expectAndClick(this.tableFirstEditButton(), "First Edit Button in Asset Table");
    await this.expectAndClick(this.descriptionInput(), "Description Input");
    await this.descriptionInput().fill('');
    await this.descriptionInput().fill(updatedDescription);
    await this.expectAndClick(this.saveButton(), "Save Button");
    await expect(this.successToaster()).toBeVisible();
    await expect(this.successToaster()).toBeHidden({ timeout: 5000 });
    const updatedCell = this.updatedDescriptionCell(updatedDescription);
    await expect(updatedCell).toBeVisible();
  }
// Get Employee Row by Name
  async getEmployeeRow(employeeName) {
  const nameCell = this.page.getByText(new RegExp(employeeName, 'i')).first();
  await expect(nameCell).toBeVisible();
  const employeeRow = nameCell.locator('xpath=ancestor::tr');
  await expect(employeeRow).toBeVisible();
  return employeeRow;
}
  // Supervisor Approve Asset Request
 async approveAssetRequestBySupervisor(employeeName) {
  await this.expectAndClick(this.searchBox(), "Search Box");
  await this.searchBox().fill(employeeName);
  await this.searchBox().press('Enter');
  const employeeRow = await this.getEmployeeRow(employeeName);
  const approveButton = employeeRow.getByRole('img').nth(1);
  await this.expectAndClick(approveButton, "Approve Button");
  await expect(this.approveSuccessToaster()).toBeVisible();
  await expect(this.approveSuccessToaster()).toBeHidden({ timeout: 5000 });
}
  // Supervisor Reject Asset Request
  async rejectAssetRequestBySupervisor(employeeName) {
  await this.expectAndClick(this.searchBox(), "Search Box");
  await this.searchBox().fill(employeeName);
  await this.searchBox().press('Enter');
  const employeeRow = await this.getEmployeeRow(employeeName);
  const rejectButton = employeeRow.getByRole('img').nth(2);
  await this.expectAndClick(rejectButton, "Reject Button");
  await expect(this.rejectToaster()).toBeVisible();
  await expect(this.rejectToaster()).toBeHidden({ timeout: 5000 });
}
// Admin approve asset request
  async approveAssetRequestByAdmin(employeeName) {
  await this.expectAndClick(this.searchBox(), "Search Box");
  await this.searchBox().fill(employeeName);
  await this.searchBox().press('Enter');
  const employeeRow = await this.getEmployeeRow(employeeName);
  const approveButton = employeeRow.getByRole('img').nth(1);
  await this.expectAndClick(approveButton, "Approve Button");
  await expect(this.approveSuccessToaster()).toBeVisible();
  await expect(this.approveSuccessToaster()).toBeHidden({ timeout: 5000 });
}
// Admin reject asset request
  async rejectAssetRequestByAdmin(employeeName) {
  await this.expectAndClick(this.searchBox(), "Search Box");
  await this.searchBox().fill(employeeName);
  await this.searchBox().press('Enter');
  const employeeRow = await this.getEmployeeRow(employeeName);
  const rejectButton = employeeRow.getByRole('img').nth(2);
  await this.expectAndClick(rejectButton, "Reject Button");
  await expect(this.rejectToaster()).toBeVisible();
  await expect(this.rejectToaster()).toBeHidden({ timeout: 5000 });   
}
 // Assigned Asset shows in Asset Assigned Table
  async assignedAssetShowsInAssignedTable() {
  // Click on Asset Assigned
  await this.expectAndClick(this.assignedAssetBtn(), "Asset Assigned Button");

  // Check if "Occupied" status is visible in the table
  const occupiedStatus = this.page.getByText('Occupied', { exact: true });
  await expect(occupiedStatus).toBeVisible();
}
}