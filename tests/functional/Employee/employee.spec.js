import { expect } from '@playwright/test';
import { setViewport, Desktop } from '../../../utils/viewports.js';
import { test, employee, supervisor, admin } from '../../../utils/sessionUse.js';
import { assetConfig, config } from '../../../config/testConfig.js';

test.describe("Employee Asset Module test", () => {
  for (const vp of [Desktop]) {
    test(`${employee} - ${vp.name} Verify Employee Can Apply for a New Asset: @Business/Functional Self-1084`,
      async ({ page, loginPage, employeeasset, useSession }) => {
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
      }
    );
  }
   for (const vp of [Desktop]) {
    test(`${employee} - ${vp.name} Verify Employee Can Edit Pending Asset Request: @Business/Functional Self-1085`,
      async ({ page, loginPage, employeeasset, useSession }) => {
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.employeeCanEditAssetRequest();
      }
    );
  }
for (const vp of [Desktop]) {
  test(`${supervisor} - ${vp.name} Verify Supervisor Can Approve Employee Asset Request: @Business/Functional Self-1086`,
    async ({ page, loginPage, employeeasset, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(supervisor);
      await loginPage.visit(config.slug.assetrequisitionrequest);
      if (!(await employeeasset.pendingRequest().isVisible().catch(() => false))) {
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
        await useSession(supervisor);
        await loginPage.visit(config.slug.assetrequisitionrequest);
       }
      await employeeasset.approveAssetRequestBySupervisor(
        assetConfig.emplyeeName
      );
    }
  );
}
for (const vp of [Desktop]) {
  test(`${supervisor} - ${vp.name} Verify Supervisor Can reject Employee Asset Request: @Business/Functional Self-1087`,
    async ({ page, loginPage, employeeasset, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(supervisor);
      await loginPage.visit(config.slug.assetrequisitionrequest);
      if (!(await employeeasset.pendingRequest().isVisible().catch(() => false))) {
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
        await useSession(supervisor);
        await loginPage.visit(config.slug.assetrequisitionrequest);
       }
      await employeeasset.rejectAssetRequestBySupervisor(
        assetConfig.emplyeeName
      );
    }
  );
}
for (const vp of [Desktop]) {
  test(`${admin} - ${vp.name} Verify that an admin can approve a pending asset request submitted by an employee: @Business/Functional Self-1089`,
    async ({ page, loginPage, employeeasset, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(admin);
      await loginPage.visit(config.slug.assetrequisitionrequest);
      if (!(await employeeasset.pendingRequest().isVisible().catch(() => false))) {
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
        await useSession(admin);
        await loginPage.visit(config.slug.assetrequisitionrequest);
       }
      await employeeasset.approveAssetRequestByAdmin(
        assetConfig.emplyeeName
      );
    }
  );
}
for (const vp of [Desktop]) {
  test(`${admin} - ${vp.name} Verify that an admin can reject a pending asset request submitted by an employee: @Business/Functional Self-1090`,
    async ({ page, loginPage, employeeasset, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(admin);
      await loginPage.visit(config.slug.assetrequisitionrequest);
      if (!(await employeeasset.pendingRequest().isVisible().catch(() => false))) {
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
        await useSession(admin);
        await loginPage.visit(config.slug.assetrequisitionrequest);
       }
      await employeeasset.rejectAssetRequestByAdmin(
        assetConfig.emplyeeName
       );
    }
  );
}
  for (const vp of [Desktop]) {
    test(`${employee} - ${vp.name} Verify Assigned Asset Shows in Assigned Asset Table: @Business/Functional Self-1088`,
      async ({ page, loginPage, employeeasset, useSession }) => {
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.assignedAssetShowsInAssignedTable();
        
      }
    );
  }
});
