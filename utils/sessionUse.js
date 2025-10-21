import { test as base } from '../lib/BaseTest.js';
import fs from 'fs';
import path from 'path';
import pwConfig, { ENV } from '../playwright.config.js';

// Helper: get domain host
function getHost() {
  const baseURL = pwConfig?.use?.baseURL;
  if (!baseURL) throw new Error('playwright.config.js → use.baseURL is missing.');
  return { host: new URL(baseURL).host, baseURL }; // 🟢 CHANGED: return baseURL too
}

// Helper: read saved session
function readSession(role) {
  const tokenPath = path.resolve(`./tokens&cookies_${ENV}/${role}.json`);
  if (!fs.existsSync(tokenPath)) {
    throw new Error(`Token file not found for role: ${role}. Run globalSetup first.`);
  }

  // 🟢 CHANGED: read localStorage & sessionStorage too
  const { token, cookies, localStorage, sessionStorage } = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

  if (!cookies || !Array.isArray(cookies)) throw new Error(`Invalid session cookies for role: ${role}.`);
  return { token, cookies, localStorage: localStorage || {}, sessionStorage: sessionStorage || {} };
}

// Fixture
export const test = base.extend({
  useSession: async ({ context, page }, use) => {
    const fn = async (role = 'talent') => {
      const { host, baseURL } = getHost();

      if (role === 'noSession' || role === 'none') {
        await context.clearCookies();
        await page.addInitScript(() => {
          try { localStorage.clear(); sessionStorage.clear(); } catch {}
        });
        console.log(`🚪 Started as guest (no session) on ${host}`);
        return;
      }

      // 🟢 CHANGED: load storage
      const { cookies, localStorage, sessionStorage } = readSession(role);

      await context.clearCookies();
      await context.addCookies(cookies); // `auth` cookie gets restored here

      // 🟢 CHANGED: set **the same** LocalStorage/SessionStorage keys used by the app
      await page.addInitScript((ls, ss) => {
        try {
          for (const [k, v] of Object.entries(ls || {})) localStorage.setItem(k, v);
          for (const [k, v] of Object.entries(ss || {})) sessionStorage.setItem(k, v);
        } catch {}
      }, localStorage, sessionStorage);

      console.log(`✅ Restored session for ${role} on ${host}`);
    };

    await use(fn);
  },
});




