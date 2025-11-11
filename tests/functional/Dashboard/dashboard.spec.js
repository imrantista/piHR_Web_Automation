import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
test.describe('Dashboard component', () => {
  
  for (const vp of [Desktop]) {
    test.only(`${vp.name} Dashboard Component Check : @regression TC_001`, async ({ page, loginPage, componentPage, useSession}) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit();
      await componentPage.componentCheckAdmin();
    });
  }
   for (const vp of [Desktop]) {
    test(`${vp.name} Dashboard Api response Check : @regression TC_002`, async ({ page, loginPage, dashboardApis, useSession}) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit();
      await dashboardApis.dashboardAllApis();
    });
  }
  
});
