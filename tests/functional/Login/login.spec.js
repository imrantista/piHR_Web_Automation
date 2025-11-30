import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Login to PIHR', () => {
  
  for (const vp of [Desktop]) {
    test(`${vp.name}  Successful admin login @regression TC_001:`, async ({ page, loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.adminEmail,config.credentials.adminPassword);
      await loginPage.assertLoginAdmin();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  Successful employee login @regression TC_002:`, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.employeeEmail,config.credentials.employeePassword);
      await loginPage.assertLoginEmployee();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  Successful admin login with session @regression TC_003:`, async ({ page, loginPage ,useSession}) => {
      await setViewport(page, vp.size);
       await useSession('admin');
      await loginPage.visit();
      await loginPage.assertLoginAdmin();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  Successful employee login with session @regression TC_004:`, async ({ page, loginPage ,useSession}) => {
      await setViewport(page, vp.size);
       await useSession('employee');
      await loginPage.visit();
      await loginPage.assertLoginEmployee();
    });
  }
  for (const vp of [Desktop]) {
 test(`${vp.name} Successful Admin Logout @regression TC_005 `, async ({ page, loginPage, logout, useSession }, testInfo) => {
        await setViewport(page, vp.size);
        await useSession('admin');
        await loginPage.visit(config.slug.dashboard);
        await logout.logoutFunc();
    });
  }
});
