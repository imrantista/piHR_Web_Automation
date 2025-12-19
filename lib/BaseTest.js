import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/Auth/LoginPage.js";
import { leaveApplicationPage } from "../pages/Leave/Operation/leaveApplicationPage.js";
import { Logout } from "../pages/Auth/Logout.js";
import { leaveDashboardPage } from "../pages/Leave/LeaveDashboard/leaveDashboardPage.js";
import { DashboardPage } from "../pages/Dashboard/dashboardPage.js";
import { ManageUserPage } from "../pages/Settings/Security/userPage.js";
import { AddNewUser } from "../pages/Settings/Security/Components/AddUserModal.js";
import { EditUser } from "../pages/Settings/Security/Components/EditUserModal.js";
import { ScreenPermission } from "../pages/Settings/Security/Components/ScreenPermissionModal.js";
import { monthWiseAttendancePage } from "../pages/Attendance/Reports/monthWiseAttendancePage.js";
import { VisitApplicationPage } from "../pages/Leave/Operation/visitApplicationPage.js";
import { ClaimPage } from "../pages/Salary/Claim/claimPage.js";
import { AttendanceReconciliationPage } from "../pages/Attendance/Reconciliation/AttendanceReconcilitationPage.js";
import { AdvanceSalaryPage } from "../pages/Salary/AdvanceSalary/advanceSalaryPage.js";
import { AssetPage } from "../pages/Employee/Asset/AssetPage.js";
import { DailyAttendancePage } from "../pages/Attendance/Operation/dailyAttendancePage.js";

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
  manageUser: async ({ page, context }, use) => {
    await use(new ManageUserPage(page, context));
  },
  addNewUser: async ({ page, context }, use) => {
    await use(new AddNewUser(page, context));
  },
  editUser: async ({ page, context }, use) => {
    await use(new EditUser(page, context));
  },
  screenPermission: async ({ page, context }, use) => {
    await use(new ScreenPermission(page, context));
  },
  //Month Wise Attendance Reports Page
  monthWiseAttendancereport: async ({ page, context }, use) => {
    await use(new monthWiseAttendancePage(page, context));
  },
  attendanceReconciliationPage: async ({ page, context }, use) => {
    await use(new AttendanceReconciliationPage(page, context));
  },
  visitApplication: async ({ page, context }, use) => {
    await use(new VisitApplicationPage(page, context));
  },
  claim: async ({ page, context }, use) => {
    await use(new ClaimPage(page, context));
  },

  advanceSalary: async ({ page, context }, use) => {
    await use(new AdvanceSalaryPage(page, context));
  },
  employeeasset: async ({ page, context }, use) => {
    await use(new AssetPage(page, context));
  },
  dailyAttendancePage: async ({ page, context }, use) => {
    await use(new DailyAttendancePage(page, context));
  }
});

