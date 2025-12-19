import { setViewport, Desktop } from '../../../utils/viewports.js';
import { test, employee,admin,supervisor } from '../../../utils/sessionUse.js';
import { reportConfig } from '../../../config/testConfig.js';

test.describe('Dashboard component', () => {
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
