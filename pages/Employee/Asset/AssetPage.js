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
  approvedCell = () =>  this.page.getByRole('row', { name: '00000276 Tanzim Emon Banani' }).locator('rect').first();
  searchBox = () => this.page.getByRole('textbox', { name: 'Search', exact: true });
  pendingRequest = () => this.page.getByText('Pending', { exact: true });
  clickoutsidesearchbox = () => this.page.getByText('Employee Code');
  approveSuccessToaster = () => this.page.getByText("Application rejected successfully.");

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
  // Supervisor Approve Asset Request
 async approveAssetRequestBySupervisor(employeeName) {
  await this.expectAndClick(this.searchBox(), "Search Box");
  await this.searchBox().fill(employeeName);
  await this.searchBox().press('Enter');
  const employeeRow = this.page.getByRole('row', { name: new RegExp(employeeName, 'i') });
  await expect(employeeRow).toBeVisible();
  const approveButton = employeeRow.getByRole('img').nth(1);
  await this.expectAndClick(approveButton, "Approve Button");
  await expect(this.approveSuccessToaster()).toBeVisible();
  await expect(this.approveSuccessToaster()).toBeHidden({ timeout: 5000 });
}
}