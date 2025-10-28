import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { readdirSync } from 'fs';

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
  for (const vp of [Desktop]) {
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
