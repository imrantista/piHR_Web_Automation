import { defineConfig, devices } from '@playwright/test';
import { config as fallback } from './config/testConfig.js';
import dotenv from 'dotenv';
import os from 'os';
dotenv.config();

const ENV = process.env.ENV || 'PIHR_QA';
const allowed = ['PIHR_PROD', 'PIHR_QA', 'PIHR_DEV', 'ADMIN_PROD', 'ADMIN_QA'];
if (!allowed.includes(ENV)) {
  console.error('Please provide a correct environment value from testConfig');
  process.exit(1);
}

const baseUrlMap = {
  "PIHR_PROD": process.env.BASE_URL_PIHR_PROD,
  "PIHR_QA":   process.env.BASE_URL_PIHR_QA,
  "PIHR_DEV":  process.env.BASE_URL_PIHR_DEV,
  "ADMIN_PROD": process.env.ADMIN_URL_ADMIN_PROD, // if you want admin as primary
  "ADMIN_QA":   process.env.ADMIN_URL_ADMIN_QA,
};

const apiBaseUrlMap = {
  "PIHR_PROD": process.env.API_BASE_URL_PIHR_PROD,
  "PIHR_QA":   process.env.API_BASE_URL_PIHR_QA,
}
const API_BASE_URL = apiBaseUrlMap[ENV];

const BASE_URL = baseUrlMap[ENV] || fallback[ENV];

if (!BASE_URL) throw new Error(`BASE_URL not set for ${ENV} in .env`);
console.log('-----------------' + ENV + '-----------------');
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export { ENV, BASE_URL, API_BASE_URL };
export default defineConfig({
  globalSetup: './utils/global-setup.js',
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 0,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  // retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 5 : Math.min(os.cpus().length - 1, 5),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  reporter: [
    ['list'],
    ['allure-playwright']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
     extraHTTPHeaders: {
      'X-Test-Env': ENV,
      baseURL: process.env.BASE_URL, // optional: handy in debugging
    },
    env: ENV,           // 👈 expose ENV
    baseURL: BASE_URL,
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video:'on',
    trace: 'retain-on-failure',
    geolocation: { latitude: 23.8103, longitude: 90.4125 },
    permissions: ['geolocation'],
    viewport: null,
    launchOptions: {
      args: [
        '--enable-geolocation',
        '--start-maximized',
        '--force-device-scale-factor=1',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--allow-running-insecure-content',
        '--disable-site-isolation-trials',
        '--ignore-certificate-errors',
      ],
    },
  },
  projects: [
    {
      name: 'PIHR Automation',
      use: {
        baseURL: BASE_URL,
        launchOptions: {
          args: ['--disable-web-security',
            '--start-maximized',
          ],
        },
      },
    },
  ],
});

