import { chromium } from '@playwright/test';
import { config } from '../config/testConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../pages/Auth/LoginPage.js';
import pwConfig, { ENV, BASE_URL } from '../playwright.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loginAndSaveToken(context, role, email, password, tokenPath, lockFilePath, artBase, retries = 3) {
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`🔐 [${role}] Attempt ${attempt}/${retries}`);

    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await loginPage.globalLogin(email, password);

      await page.waitForFunction(() => document.cookie.includes('auth='), { timeout: 10000 });

      const cookies = await context.cookies();
      const tokenCookie = cookies.find(c => c.name === 'auth');
      if (!tokenCookie) {
        if (attempt === retries) throw new Error(`❌ Token cookie not found for ${role} after ${retries} retries`);
        console.warn(`⚠️ Token not found, retrying in 2s...`);
        await page.waitForTimeout(2000);
        continue;
      }

      const token = tokenCookie.value;

      // 🟢 CHANGED: capture LocalStorage & SessionStorage used by the app
      const localStorageData = await page.evaluate(() => {
        const out = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          out[k] = localStorage.getItem(k);
        }
        return out;
      });

      const sessionStorageData = await page.evaluate(() => {
        const out = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          out[k] = sessionStorage.getItem(k);
        }
        return out;
      });

      fs.mkdirSync(path.dirname(tokenPath), { recursive: true });

      // 🟢 CHANGED: store cookie + LS + SS
      fs.writeFileSync(
        tokenPath,
        JSON.stringify({ token, cookies, localStorage: localStorageData, sessionStorage: sessionStorageData }, null, 2)
      );

      fs.mkdirSync(path.dirname(lockFilePath), { recursive: true });
      fs.writeFileSync(lockFilePath, 'done');

      console.log(`✅ Token, cookies, storage saved for ${role}`);
      await page.close();
      return;
    } catch (err) {
      if (attempt === retries) {
        console.error(`❌ Failed after ${retries} attempts: ${err.message}`);
        throw err;
      }
      console.warn(`⚠️ Login attempt ${attempt} failed for ${role}, retrying...`);
      await page.waitForTimeout(2000);
    }
  }
}
async function globalSetup() {
  console.log('Global setup---------');
  console.log(`🌍 Using ENV: ${ENV}, baseURL: ${BASE_URL}`);

  const browser = await chromium.launch({
    headless: !!process.env.CI,
    ignoreHTTPSErrors: true,
  });

  const usersToLogin = ['admin', 'employee'];

  for (const role of usersToLogin) {
    const email = config.credentials[`${role}Email`];
    const password = config.credentials[`${role}Password`];

    const tokenDir = path.resolve(`./tokens&cookies_${ENV}`);
    const tokenPath = path.join(tokenDir, `${role}.json`);
    const lockFilePath = path.resolve(`./locks/setup-${role}.lock`);

    if (fs.existsSync(tokenPath) && fs.existsSync(lockFilePath)) {
      console.log(`✅ ${role}: Token already exists. Skipping.`);
      continue;
    }

    console.log(`🔐 Logging in as ${role}: ${email}`);

    // per-role artifact folders
    const artBase = path.resolve(`./artifacts/global-setup/${role}`);
    fs.mkdirSync(artBase, { recursive: true });

    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      recordVideo: { dir: path.join(artBase, 'video') },
    });

    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

    try {
      // 🔄 changed: wrapped login + cookie handling in retry function
      await loginAndSaveToken(context, role, email, password, tokenPath, lockFilePath, artBase, 3);

      try {
        await context.tracing.stop({ path: path.join(artBase, 'trace.zip') });
      } catch {}
      await context.close();
    } catch (err) {
      console.error(`❌ Global setup failed for ${role}:`, err?.message || err);

      try {
        const page = await context.newPage();
        await page.screenshot({ path: path.join(artBase, 'page.png'), fullPage: true });
        fs.writeFileSync(path.join(artBase, 'page.html'), await page.content());
      } catch {}
      try {
        await context.tracing.stop({ path: path.join(artBase, 'trace.zip') });
      } catch {}
      await context.close();
      throw err;
    }
  }

  await browser.close();
}

export default globalSetup;

