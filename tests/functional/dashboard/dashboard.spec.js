import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';

test.describe('Dashboard component', () => {
  
  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_001:Successful admin login `, async ({ page, loginPage, componentPage, useSession}) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit();
      await componentPage.componentCheckAdmin();
    });
  }
  
});
