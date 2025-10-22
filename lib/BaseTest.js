import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage.js";
import { ComponentPage } from "../pages/Dashboard/Component.js";
import { CreateLeave } from "../pages/Leave/CreateLeave/CreateLeave.js";
import { ModalComponent } from "../pages/Leave/CreateLeave/modalComponent.js";
import { RequiredField } from "../pages/Leave/CreateLeave/requiredField.js";
export const test = baseTest.extend({
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context));
  },
  componentPage: async ({ page, context }, use) => {
    await use(new ComponentPage(page, context));
  },
  createleave: async ({ page, context }, use) => {
    await use(new CreateLeave(page, context));
  },
  modalcomponent: async ({ page, context }, use) => {
    await use(new ModalComponent(page, context));
  },
  requiredfiled: async ({ page, context }, use) => {
    await use(new RequiredField(page, context));
  },
});
