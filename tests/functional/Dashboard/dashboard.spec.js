import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Dashboard component', () => {

  // Loop over viewports if needed, currently only Desktop
  for (const vp of [Desktop]) {
    test.only(`${vp.name} Dashboard Component Check : @regression TC_001`, async ({ page, loginPage, componentPage, useSession }) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit(config.slug.dashboard);
      await componentPage.componentCheckAdmin();
    });

    test(`${vp.name} Dashboard API Response Check : @regression TC_002`, async ({ page, loginPage, dashboardApis, useSession }) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit(config.slug.dashboard);
      await dashboardApis.dashboardAllApis();
    });
  }

});
