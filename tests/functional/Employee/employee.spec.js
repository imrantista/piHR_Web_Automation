import { expect } from '@playwright/test';
import { setViewport, Desktop } from '../../../utils/viewports.js';
import { test, employee, supervisor } from '../../../utils/sessionUse.js';
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
        await employeeasset.approveAssetRequestBySupervisor(assetConfig.emplyeeName);
      }
    );
  }
});
