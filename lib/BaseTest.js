import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage.js";
import { DashboardPage } from "../pages/Dashboard/dashboardPage.js";
import { leaveApplicationPage } from "../pages/Leave/Operation/leaveApplicationPage.js";
import { Logout } from "../pages/Auth/Logout.js";
import { leaveDashboardPage } from "../pages/Leave/LeaveDashboard/leaveDashboardPage.js";

export const test = baseTest.extend({
  // Login Page
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context));
  },
  // Logout Page
  logout: async ({ page, context }, use) => {
    await use(new Logout(page, context));
  },
  // Home Dashboard Page (application dashboard)
  dashboard: async ({ page, context }, use) => {
    await use(new DashboardPage(page, context));
  },
  //Leave operations -> Leave Application Page
  leavepage: async ({ page, context }, use) => {
    await use(new leaveApplicationPage(page, context));
  },
  // Leave Dashboard Page (separate leave dashboard)
  leaveDashboard: async ({ page, context }, use) => {
    await use(new leaveDashboardPage(page, context));
  }
  
});