import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Login to PIHR', () => {
  
  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_001:Successful admin login `, async ({ page, loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.adminEmail,config.credentials.adminPassword);
      await loginPage.assertLoginAdmin();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_002:Successful employee login`, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.employeeEmail,config.credentials.employeePassword);
      await loginPage.assertLoginEmployee();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_003:Successful admin login with session`, async ({ page, loginPage ,useSession}) => {
      await setViewport(page, vp.size);
       await useSession('admin');
      await loginPage.visit();
      await loginPage.assertLoginAdmin();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_004:Successful employee login with session`, async ({ page, loginPage ,useSession}) => {
      await setViewport(page, vp.size);
       await useSession('employee');
      await loginPage.visit();
      await loginPage.assertLoginEmployee();
    });
  }
});
