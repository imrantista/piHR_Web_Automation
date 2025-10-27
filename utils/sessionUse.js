import { test as base } from '../lib/BaseTest.js';
import fs from 'fs';
import path from 'path';
import pwConfig, { ENV } from '../playwright.config.js';
import { ensureTokens } from './global-setup.js'; // ✅ import token helper

// Helper: get domain host
function getHost() {
  const baseURL = pwConfig?.use?.baseURL;
  if (!baseURL) throw new Error('playwright.config.js → use.baseURL is missing.');
  return { host: new URL(baseURL).host, baseURL };
}

// Helper: read saved session
export async function readSession(role) {
  const tokenPath = path.resolve(`./tokens&cookies_${ENV}/${role}.json`);

  if (!fs.existsSync(tokenPath)) {
    console.warn(`⚠️ Token file not found for role: ${role}. Creating it...`);
    await ensureTokens(); // ✅ create missing token without tracing
  }

  if (!fs.existsSync(tokenPath)) {
    throw new Error(`❌ Token file still not found for role: ${role} after running ensureTokens.`);
  }

  const { token, cookies, localStorage, sessionStorage } = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  if (!cookies || !Array.isArray(cookies)) throw new Error(`Invalid session cookies for role: ${role}.`);
  return { token, cookies, localStorage: localStorage || {}, sessionStorage: sessionStorage || {} };
}

// Fixture
export const test = base.extend({
  useSession: async ({ context, page }, use) => {
    const fn = async (role = 'talent') => {
      const { host } = getHost();

      if (role === 'noSession' || role === 'none') {
        await context.clearCookies();
        await page.addInitScript(() => { try { localStorage.clear(); sessionStorage.clear(); } catch {} });
        console.log(`🚪 Started as guest (no session) on ${host}`);
        return;
      }

      const { cookies, localStorage, sessionStorage } = await readSession(role);

      await context.clearCookies();
      await context.addCookies(cookies);

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