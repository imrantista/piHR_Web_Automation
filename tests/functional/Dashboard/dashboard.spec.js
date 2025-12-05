import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test, allAdmin, admin } from '../../../utils/sessionUse.js';
import { branches, config } from '../../../config/testConfig.js';
import { getEmployeeID } from '../../../api/employeeApi.js';
import { getCurrentLeaveBalance } from '../../../api/leaveApi.js';
import { expect } from '@playwright/test';
import { captureApiJson } from '../../../utils/apiUtils.js';

test.describe('Dashboard component', () => {
  for (const role of allAdmin) {
    for (const vp of [Desktop]) {
      test(`${role} - ${vp.name} Verify the dashboard UI elements : @regression Dash-1001`, async ({ page, loginPage, dashboard, useSession }) => {
        await setViewport(page, vp.size);
        await useSession(role);
        await loginPage.visit(config.slug.dashboard);
        await dashboard.dashboardComponentCheck();
      });
    }
  }
  for (const role of admin) {
  for (const vp of [Desktop]) {
    test(`${role} - ${vp.name} Dashboard API Response Check : @regression TC_002`, async ({ page, loginPage, dashboardApis, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(role);   
      await loginPage.visit(config.slug.dashboard);
      await dashboardApis.dashboardAllApis("default");
    });
  }
}

});