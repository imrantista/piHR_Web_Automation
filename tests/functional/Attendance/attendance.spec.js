import { setViewport, Desktop } from '../../../utils/viewports.js';
import { test, employee,admin,supervisor } from '../../../utils/sessionUse.js';
import { breakTimeConfig, reportConfig } from '../../../config/testConfig.js';
import { config } from '../../../config/testConfig.js';
import { attendanceConfig } from '../../../config/testConfig.js';

test.describe('Attendance Report', () => {
  for (const vp of [Desktop]) {
    test(`Download & Convert Attendance PDF to JSON`, async ({ monthWiseAttendancereport }) => {
      const { pdfPath, jsonPath } = await monthWiseAttendancereport.downloadMonthWiseAttendancePDF({
        month: reportConfig.month,
        year: reportConfig.year,
        role: employee
      });

      console.log("PDF Path:", pdfPath);
      console.log("JSON Path:", jsonPath);
    });
  }
});

test.describe('Employee Daily Attendance', () => {
  for (const vp of [Desktop]) {
    test(`${employee} Verify Submit Functionality of In-Time @Business/Functional Self-1050`, 
    async ({ page, dailyAttendancePage, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await useSession(employee);
      await loginPage.visit(config.slug.employeeInTimeOutTime);
      await dailyAttendancePage.submitInTimeByEmployee();
  });
  } 
  for (const vp of [Desktop]) {
    test(`${employee} Verify Submit Functionality of Out-Time @Business/Functional Self-1051`, 
    async ({ page, dailyAttendancePage, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await useSession(employee);
      await loginPage.visit(config.slug.employeeInTimeOutTime);
      await dailyAttendancePage.submitOutTimeByEmployee();
  });
  } 
  
 for (const vp of [Desktop]) {
  test(`${employee,admin} Employee attendance reflected in admin view @Business/Functional Self-1052`, 
    async ({ page, dailyAttendancePage, loginPage, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(employee);
      await loginPage.visit(config.slug.employeeInTimeOutTime);
      const { inTime, outTime } = await dailyAttendancePage.getEmployeeAttendanceTimes();
      await useSession(admin);
      await loginPage.visit(config.slug.attendanceDashboard);
      await dailyAttendancePage.verifyEmployeeAttendanceByAdmin(attendanceConfig.emplyeeName, inTime, outTime);
    }
  );
 }
 for (const vp of [Desktop]) {
    test(`${employee} Verify User Can Start Break Time @Business/Functional Self-1053`, 
    async ({ page, dailyAttendancePage, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await useSession(employee);
      await loginPage.visit(config.slug.employeeInTimeOutTime);
      await dailyAttendancePage.startBreakTimeByEmployee();
  });
  }
   for (const vp of [Desktop]) {
    test(`${employee,admin} Verify Admin Can See Which Employee Is Currently on Break @Business/Functional Self-1054`, 
    async ({ page, dailyAttendancePage, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await useSession(employee);
      await loginPage.visit(config.slug.employeeInTimeOutTime);
      await dailyAttendancePage.startBreakTimeByEmployee();
      await useSession(admin);
      await loginPage.visit(config.slug.attendancedashboardAdmin);
      await dailyAttendancePage.adminCanSeeEmployeeBreakStatus(breakTimeConfig.emplyeeName);
  });
  }
  for (const vp of [Desktop]) {
    test(`${employee} Verify User Can End Break Time @Business/Functional Self-1055`, 
    async ({ page, dailyAttendancePage, useSession, loginPage }) => {
      await setViewport(page, vp.size);
      await useSession(employee);
      await loginPage.visit(config.slug.employeeInTimeOutTime);
      await dailyAttendancePage.endBreakTimeByEmployee();
  });
  }

});


// Attendance Reconciliation
test.describe('Attendance Reconciliation', () => {
  for (const vp of [Desktop]) {
    test(`${employee}-${vp.name}Employee can submit Attendance Reconciliation Business/Functional Self-1057`, async ({page, monthWiseAttendancereport,attendanceReconciliationPage,useSession,loginPage }) => {
      await setViewport(page, vp.size);
      await useSession(employee);
      await loginPage.visit();
      await attendanceReconciliationPage.employeeSubmitNewAttendanceReconciliation();

  });
    test(`${employee}-${vp.name}Employee can Edit Attendance Reconciliation Business/Functional Self-1058`, async ({page, monthWiseAttendancereport,attendanceReconciliationPage,useSession,loginPage }) => {
      await setViewport(page, vp.size);
      await useSession(employee);
      await loginPage.visit();
      await attendanceReconciliationPage.employeeUpdateAttendanceReconciliation();

  });
  }
});
