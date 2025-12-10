import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage.js";
import { DashboardPage } from "../pages/Dashboard/dashboardPage.js";
import { leaveApplicationPage } from "../pages/Leave/Operation/leaveApplicationPage.js";
import { Logout } from "../pages/Auth/Logout.js";
import { leaveDashboardPage } from "../pages/Leave/LeaveDashboard/leaveDashboardPage.js";
import { DashboardApis } from "../pages/Dashboard/ApiResponse.js";
import { DashboardPage } from "../pages/Dashboard/dashboard.page.js";
import { DeleteLeave } from "../pages/Leave/DeleteLeave.js";
import { ApplyInSameDate } from "../pages/Leave/Validation/ApplyInSameDate.js";
import { ManageUserPage } from "../pages/Settings/Security/userPage.js";
import { AddNewUser } from "../pages/Settings/Security/Components/AddUserModal.js";
import { EditUser } from "../pages/Settings/Security/Components/EditUserModal.js";
import { ScreenPermission } from "../pages/Settings/Security/Components/ScreenPermissionModal.js";

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
  },
  manageUser: async({page, context}, use)=>{
    await use(new ManageUserPage(page, context));
  },
  addNewUser: async({page, context}, use)=>{
    await use(new AddNewUser(page, context));
  },
  editUser: async({page, context}, use)=>{
    await use(new EditUser(page, context));
  },
  screenPermission: async({page, context}, use)=>{
    await use(new ScreenPermission(page, context));
  
  }
});

