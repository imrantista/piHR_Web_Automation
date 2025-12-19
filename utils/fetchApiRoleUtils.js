import fs from 'fs';
import path from 'path';
import { ENV } from '../playwright.config.js';

// Folder where your token files live
const TOKEN_FOLDER = path.join(process.cwd(), `tokens&cookies_${ENV}`);

// Map role → file name (without .json)
const ROLE_FILE_MAP = {
  admin: 'admin',
  employee: 'employee',
  employeeAdmin: 'employeeAdmin',
  supervisor: 'supervisor',
};

export async function getAuthTokenForRole(role) {
  const fileKey = ROLE_FILE_MAP[role];

  if (!fileKey) {
    throw new Error(
      `Unknown role "${role}". Valid roles: ${Object.keys(ROLE_FILE_MAP).join(', ')}`
    );
  }

  const filePath = path.join(TOKEN_FOLDER, `${fileKey}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Token file not found for role "${role}" at path: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);

  const authCookie = parsed.cookies?.find((c) => c.name === 'auth');

  if (!authCookie?.value) {
    throw new Error(`"auth" cookie not found for role "${role}"`);
  }

  return authCookie.value;
}

