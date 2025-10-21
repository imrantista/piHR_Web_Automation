import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";


export const test = baseTest.extend({
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context));
  },
});


