import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config, deactivatedUsers, invalidCredentials, validUsers } from '../../../config/testConfig.js';


const viewports = [Desktop];
test.describe('Login to PIHR', () => {

  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_001:Successful admin login `, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.adminEmail, config.credentials.adminPassword);
      await loginPage.assertLoginAdmin();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  Successful employee login @regression TC_002:`, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.employeeEmail, config.credentials.employeePassword);
      await loginPage.assertLoginEmployee();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_003:Successful admin login with session`, async ({ page, loginPage, useSession }) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit();
      await loginPage.assertLoginAdmin();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_004:Successful employee login with session`, async ({ page, loginPage, useSession }) => {
      await setViewport(page, vp.size);
      await useSession('employee');
      await loginPage.visit();
      await loginPage.assertLoginEmployee();
    });
  }
});

[Desktop].forEach((vp) => {
    test(`Verify “Remember Me” Functionality on Login Page on ${vp.name}`, async ({ page, loginPage, logout }) => {
      await setViewport(page, vp.size);
      console.log(`Testing on viewport: ${vp.name}`);
      await loginPage.visit();
      await loginPage.clickRememberMe();
      await loginPage.doLogin(config.credentials.adminEmail, config.credentials.adminPassword);
      await logout.logoutFunc();
      await loginPage.assertCredentialsFilled(config.credentials.adminEmail, config.credentials.adminPassword);
      console.log(`"Remember Me" functionality verified on ${vp.name}`);
    });
});

[Desktop].forEach((vp) => {
  validUsers.forEach((user) => {
    test(`Verify Logout Functionality from ${user.name} on ${vp.name}`,
      { tag: '@regression' }
      , async ({ page, loginPage, logout }) => {
        await setViewport(page, vp.size);
        console.log(`Testing logout for ${user.name} on viewport: ${vp.name}`);
        await loginPage.visit();
        await loginPage.doLogin(user.email, user.password);
        await logout.logoutFunc();
        await loginPage.verifyLogout();
      })
  })
});

test.describe('Invalid Login Verification', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
  });

  invalidCredentials.forEach((credentials) => {
    test(`Verify Login Behavior with ${credentials.name}`, async ({ page, loginPage }) => {
      await loginPage.loginAndVerifyError(
        credentials.email,
        credentials.password,
        credentials.expectedError
      );
      console.log(`Verified error message: "${credentials.expectedError}" for ${credentials.name}`);
    });
  });
});

viewports.forEach((vp) => {
  test('Verify Password Masking Functionality on Login Page', async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
    await loginPage.verifyPasswordMasking();

  });

  test('Verify Password Field Accepts Special Characters', async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
    await loginPage.doLogin(config.credentials.adminEmail, config.credentials.adminPassword); //admin password has special characters
    await loginPage.assertLoginAdmin();
  });
});



test.describe('Deactivated User Login Verification', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
  });
  deactivatedUsers.forEach(user => {
    test(`Verify Deactivated ${user.name} Cannot Login`, async ({ page, loginPage }) => {
      await loginPage.doLogin(user.username, user.password);
      await loginPage.assertAccountLockedError();
      console.log('Deactivated user login attempt shows correct error message.');
    });
  });

});