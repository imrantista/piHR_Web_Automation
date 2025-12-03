import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../../utils/viewports.js';
import { test } from '../../../../utils/sessionUse.js';
import { config } from '../../../../config/testConfig.js';


test.describe('Dashboard component', () => {

  // Loop over viewports (only Desktop for now)
  for (const vp of [Desktop]) {

    test(`${vp.name} Dashboard API Response Check : @regression TC_002`, 
    async ({ page, loginPage, useSession,leaveDashboardAllApis }) => {

      await setViewport(page, vp.size);

      await useSession('admin');

      await loginPage.visit(config.slug.leaveDashboard);

      await leaveDashboardAllApis.leaveDashboardAllApis();
    });

  }

});
