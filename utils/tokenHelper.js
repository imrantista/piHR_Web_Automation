import fs from 'fs';
import path from 'path';
import { ENV } from '../playwright.config.js';

export function getAccessToken(role) {
  const tokenDir = path.resolve(`./tokens&cookies_${ENV}`);
  const tokenPath = path.join(tokenDir, `${role}.json`);

  if (!fs.existsSync(tokenPath)) {
    console.warn(`[Token] No saved session for role: ${role}`);
    return null;
  }

  const saved = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

  // Try cookies (update to 'auth')
  if (saved.cookies) {
    const authCookie = saved.cookies.find((c) => c.name === 'auth');
    if (authCookie) return authCookie.value;
  }

  console.warn(`[Token] No access token found for role: ${role}`);
  return null;
}
