import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';
import { config, invalidCredentials } from '../../../config/testConfig.js';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { readdirSync } from 'fs';
import { expect } from '@playwright/test';
import { LoginPage } from '../../../pages/Auth/LoginPage.js';


const viewports = [Desktop];
test.describe('Login to PIHR', () => {

  for (const vp of [Desktop]) {
    test(`${vp.name}  Successful admin login @regression TC_001:`, async ({ page, loginPage}) => {
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
    test(`${vp.name}  Successful admin login with session @regression TC_003:`, async ({ page, loginPage ,useSession}) => {
    test(`${vp.name}  @regression TC_003:Successful admin login with session`, async ({ page, loginPage, useSession }) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit();
      await loginPage.assertLoginAdmin();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  Successful employee login with session @regression TC_004:`, async ({ page, loginPage ,useSession}) => {
    test(`${vp.name}  @regression TC_004:Successful employee login with session`, async ({ page, loginPage, useSession }) => {
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
    test(`${vp.name} Successful Admin Logout @regression TC_005 `, async ({ page, loginPage, logout, useSession }, testInfo) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit(config.slug.dashboard);
      await logout.logoutFunc();
      const PREFIX = 'tokens&cookies_';
      const rootDir = process.cwd();
      const sessionDirs = readdirSync(rootDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name.startsWith(PREFIX))
        .map(dirent => dirent.name);
      const sessionFiles = ['admin.json', 'employee.json'];
      for (const dir of sessionDirs) {
        for (const fileName of sessionFiles) {
          const sessionFilePath = join(rootDir, dir, fileName);
          try {
            await unlink(sessionFilePath);
            console.log(`Deleted session file: ${sessionFilePath}`);
          } catch (err) {
            if (err.code === 'ENOENT') {
              console.log(`Session file not found (skipping): ${sessionFilePath}`);
            } else {
              console.error(`Failed to delete session file ${sessionFilePath}:`, err);
            }
          }
        }
      }
    });
  }
});

const users = [
  { name: 'Admin', email: config.credentials.adminEmail, password: config.credentials.adminPassword },
  { name: 'Employee', email: config.credentials.employeeEmail, password: config.credentials.employeePassword },
  { name: 'System Admin', email: config.credentials.systemAdmin, password: config.credentials.systemAdminPassword },
];

[Desktop].forEach((vp) => {
  users.forEach((user) => {
    test(`Verify “Remember Me” Functionality on Login Page for ${user.name} on ${vp.name}`, async ({ page, loginPage, logout }) => {
      await setViewport(page, vp.size);
      console.log(`Testing ${user.name} on viewport: ${vp.name}`);
      await loginPage.visit();
      await loginPage.clickRememberMe();
      await loginPage.doLogin(user.email, user.password);
      await logout.logoutFunc();
      const isEmailFilled = await loginPage.emailTxt.inputValue();
      const isPasswordFilled = await loginPage.passwordTxt.inputValue();
      expect(isEmailFilled).toBe(user.email);
      expect(isPasswordFilled).toBe(user.password);
      console.log(`"Remember Me" functionality verified for ${user.name} on ${vp.name}`);
    });
  });
});

[Desktop].forEach((vp) => {
  users.forEach((user) => {
    test(`Verify Logout Functionality from ${user.name} on ${vp.name}`, 
      {tag: '@regression'}
      ,async ({ page, loginPage, logout }) => {
      await setViewport(page, vp.size);
      console.log(`Testing logout for ${user.name} on viewport: ${vp.name}`);
      await loginPage.visit();
      await loginPage.doLogin(user.email, user.password);
      await logout.logoutFunc();
      await page.goto('/dashboard');
      await expect(page.getByText('Access Denied')).toBeVisible();
      await expect(page.getByText('Sorry, it seems you are not permitted to see this.')).toBeVisible();
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
      console.log(`Testing with ${credentials.name}`);
      await loginPage.doLogin(credentials.email, credentials.password);
      const errorLocator = page.locator('iframe[title="Login Page"]').contentFrame().getByText(credentials.expectedError);
      await expect(errorLocator).toBeVisible();
      console.log(`Verified error message: "${credentials.expectedError}" for ${credentials.name}`);
    });
  });
});

viewports.forEach((vp) => {
  test('Verify Password Masking Functionality on Login Page', async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
    await loginPage.fillPassword('TestPassword123');
    await expect(loginPage.passwordTxt).toHaveAttribute('type', 'password');
    console.log('Password is masked by default.');
    await loginPage.revealPasswordBtn.click();
    await expect(loginPage.passwordTxt).toHaveAttribute('type', 'text');
    console.log('Password is revealed after clicking reveal button.');
    await loginPage.closePasswordBtn.click();
    await expect(loginPage.passwordTxt).toHaveAttribute('type', 'password');
    console.log('Password is masked again after clicking close button.');

  });

  test('Verify Password Field Accepts Special Characters', async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
    await loginPage.doLogin(config.credentials.adminEmail, config.credentials.adminPassword); //admin password has special characters
    await loginPage.assertLoginAdmin();
  });
});


const deactivatedUsers = [
  { name: 'Admin', username: config.credentials.deactivatedAdmin, password: config.credentials.deactivatedPassword },
];

test.describe('Deactivated User Login Verification', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
  });
  deactivatedUsers.forEach(user => {
    test(`Verify Deactivated ${user.name} Cannot Login`, async ({ page, loginPage }) => {
      await loginPage.doLogin(user.username, user.password);
      const errorLocator = page.locator('iframe[title="Login Page"]').contentFrame().getByText('Your account is locked or inactive');
      await expect(errorLocator).toBeVisible();
      console.log('Deactivated user login attempt shows correct error message.');
    });
  });

});