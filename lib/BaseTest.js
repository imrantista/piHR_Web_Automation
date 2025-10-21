import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { ComponentPage } from "../pages/Dashboard/ComponentPage.js";

export const test = baseTest.extend({
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context));
  },
  componentPage: async ({ page, context }, use) => {
    await use(new ComponentPage(page, context));
  },
});
