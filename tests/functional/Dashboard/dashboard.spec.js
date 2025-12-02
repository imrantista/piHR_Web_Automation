import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test, allAdmin, admin} from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Dashboard component', () => {
  for (const role of allAdmin) {
    for (const vp of [Desktop]) {

      test(`${role} - ${vp.name} Dashboard Component Check : @regression TC_001`, async ({ page, loginPage, componentPage, useSession }) => {
        await setViewport(page, vp.size);
        await useSession(role);
        await loginPage.visit(config.slug.dashboard);
        await componentPage.componentCheckAdmin();
      });

    }
    }
  for (const role of admin) {
  for (const vp of [Desktop]) {
    test(`${role} - ${vp.name} Dashboard API Response Check : @regression TC_002`, async ({ page, loginPage, dashboardApis, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(role);   
      await loginPage.visit(config.slug.dashboard);
      await dashboardApis.dashboardAllApis();
    });
  }
}

});
