import { chromium } from '@playwright/test';
import { config } from '../config/testConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../pages/Auth/LoginPage.js';
import { ENV, BASE_URL } from '../playwright.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Login page detection
const LOGIN_URL_PATTERN = /\/auth\/login|\/login/i;

async function isSessionValid(context, role) {
  const page = await context.newPage();
  try {
    console.log(`[Check] [${role}] Validating session → ${BASE_URL}`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 }); // 30s max

    const currentUrl = page.url();
    console.log(`[Check] [${role}] Current URL: ${currentUrl}`);

    if (LOGIN_URL_PATTERN.test(currentUrl)) {
      console.warn(`[Check] [${role}] Session expired – at login page.`);
      await page.close();
      return false;
    }

    console.log(`[Check] [${role}] Session valid!`);
    await page.close();
    return true;
  } catch (err) {
    console.error(`[Check] [${role}] Validation failed: ${err.message}`);
    try { await page.close(); } catch {}
    return false;
  }
}

async function loginAndSaveToken(context, role, email, password, tokenPath, lockFilePath, artBase, retries = 3) {
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`[Login] [${role}] Attempt ${attempt}/${retries}`);
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 });
      await loginPage.globalLogin(email, password);

      // Faster auth check
      await page.waitForFunction(() => document.cookie.includes('auth='), { timeout: 10_000 });

      const cookies = await context.cookies();
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
      fs.writeFileSync(
        tokenPath,
        JSON.stringify({ cookies, localStorage: localStorageData, sessionStorage: sessionStorageData }, null, 2)
      );

      fs.mkdirSync(path.dirname(lockFilePath), { recursive: true });
      fs.writeFileSync(lockFilePath, 'done');

      console.log(`[Login] [${role}] Session saved → ${tokenPath}`);
      await page.close();
      return true;
    } catch (err) {
      console.warn(`[Login] [${role}] Attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) {
        console.error(`[Login] [${role}] All attempts failed.`);
        try { await page.close(); } catch {}
        return false;
      }
      await page.waitForTimeout(2000);
    }
  }
  return false;
}

async function ensureValidSession(role) {
  const email = config.credentials[`${role}Email`];
  const password = config.credentials[`${role}Password`];
  const tokenDir = path.resolve(`./tokens&cookies_${ENV}`);
  const tokenPath = path.join(tokenDir, `${role}.json`);
  const lockFilePath = path.resolve(`./locks/setup-${role}.lock`);
  const artBase = path.resolve(`./artifacts/global-setup/${role}`);

  // Clean broken state
  if (!fs.existsSync(tokenPath) && fs.existsSync(lockFilePath)) {
    fs.unlinkSync(lockFilePath);
  }

  // Validate existing session
  if (fs.existsSync(tokenPath) && fs.existsSync(lockFilePath)) {
    console.log(`[Reuse] [${role}] Validating saved session...`);
    const saved = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

    const browser = await chromium.launch({ headless: true, ignoreHTTPSErrors: true });
    const context = await browser.newContext({
      storageState: saved,
      ignoreHTTPSErrors: true,
      recordVideo: { dir: path.join(artBase, 'video') },
    });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

    try {
      if (await isSessionValid(context, role)) {
        console.log(`[Reuse] [${role}] Session valid – reusing.`);
        await context.tracing.stop({ path: path.join(artBase, 'trace.zip') });
        await context.close();
        await browser.close();
        return;
      }
      console.log(`[Reuse] [${role}] Session expired – re-login.`);
    } catch (e) {
      console.error(`[Reuse] [${role}] Validation error: ${e.message}`);
    } finally {
      await context.tracing.stop({ path: path.join(artBase, 'trace.zip') }).catch(() => {});
      await context.close();
      await browser.close();
    }
  }

  // Fresh login
  console.log(`[Fresh] [${role}] Performing fresh login...`);
  const browser = await chromium.launch({ headless: !!process.env.CI, ignoreHTTPSErrors: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    recordVideo: { dir: path.join(artBase, 'video') },
  });
  fs.mkdirSync(artBase, { recursive: true });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  try {
    const ok = await loginAndSaveToken(context, role, email, password, tokenPath, lockFilePath, artBase, 3);
    if (!ok) throw new Error(`Login failed for ${role}`);
    await context.tracing.stop({ path: path.join(artBase, 'trace.zip') });
    await context.close();
    await browser.close();
    console.log(`[Fresh] [${role}] Session saved & locked.`);
  } catch (err) {
    await context.tracing.stop({ path: path.join(artBase, 'trace.zip') }).catch(() => {});
    await context.close();
    await browser.close();
    throw err;
  }
}

async function globalSetup() {
  console.log('=== Global Setup Start ===');
  console.log(`ENV: ${ENV} | BASE_URL: ${BASE_URL}`);

  const usersToLogin = ['admin', 'employee', 'employeeAdmin'];
  for (const role of usersToLogin) {
    console.log(`\n--- ${role.toUpperCase()} ---`);
    await ensureValidSession(role);
  }

  console.log('=== Global Setup Complete ===');
}

export async function ensureTokens() {
  const browser = await chromium.launch({ headless: true, ignoreHTTPSErrors: true });
  const usersToLogin = ['admin', 'employee' ,'employeeAdmin'];

  for (const role of usersToLogin) {
    const email = config.credentials[`${role}Email`];
    const password = config.credentials[`${role}Password`];
    const tokenDir = path.resolve(`./tokens&cookies_${ENV}`);
    const tokenPath = path.join(tokenDir, `${role}.json`);
    const lockFilePath = path.resolve(`./locks/setup-${role}.lock`);

    if (!fs.existsSync(tokenPath)) {
      const context = await browser.newContext({ ignoreHTTPSErrors: true });
      await loginAndSaveToken(context, role, email, password, tokenPath, lockFilePath, null, 3);
      await context.close();
    }
  }
  await browser.close();
}

export default globalSetup;