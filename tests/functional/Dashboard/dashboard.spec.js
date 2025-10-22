import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
test.describe('Dashboard component', () => {
  
  for (const vp of [Desktop]) {
    test(`${vp.name} Dashboard Component Check : @regression TC_001`, async ({ page, loginPage, componentPage, useSession}) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit();
      await componentPage.componentCheckAdmin();
    });
  }
  
});
