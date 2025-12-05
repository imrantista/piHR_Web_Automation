import { Desktop } from '../../../utils/viewports.js';
import { test, allAdmin, admin } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

// --------------------------------------------------
// 🔹 Helper: Setup dashboard for role + viewport
// --------------------------------------------------
async function setupDashboard({ page, loginPage, useSession, leaveDashboard }, role = 'admin', vp = Desktop) {
  await page.setViewportSize(vp.size);
  await useSession(role);
  await loginPage.visit(config.slug.leavedashboard);
}

// ===================================================
// 🔹 Leave Page Tests (Leave Create Modal / Leave CRUD)
// ===================================================
test.describe('Leave Page Tests', () => {
  for (const role of allAdmin) {
    test(`${role} - Verify UI of Leave Create Modal : @regression Leave-1286`, 
      async ({ loginPage, leavepage, useSession }) => {
        await useSession(role);
        await loginPage.visit(config.slug.leavepage);
        await leavepage.checkModalComponent();
      }
    );

    test(`${role} - Verify Required Fields Validation in Leave Create Modal : @regression Leave-1304`, 
      async ({ loginPage, leavepage, useSession }) => {
        await useSession(role);
        await loginPage.visit(config.slug.leavepage);
        await leavepage.requiredFieldValidation();
      }
    );
  }

  for (const role of admin) {
    test(`${role} - Create Leave for Employee : @regression Leave-1307`, 
      async ({ loginPage, leavepage, useSession }) => {
        await useSession(role);
        await loginPage.visit(config.slug.leavepage);
        await leavepage.createNewLeave(
          config.data.emplyeeName,
          config.data.leaveType,
          config.data.leaveStartDate,
          config.data.leaveEndDate,
          config.data.leavePurpose
        );
      }
    );

    test(`${role} - Verify System Restriction on Same Date : @regression Leave-1310`, 
      async ({ loginPage, leavepage, useSession }) => {
        await useSession(role);
        await loginPage.visit(config.slug.leavepage);
        await leavepage.applyLeaveInSameDate(
          config.data.emplyeeName,
          config.data.leaveType,
          config.data.leaveStartDate,
          config.data.leaveEndDate,
          config.data.leavePurpose
        );
      }
    );

    test(`${role} - Verify Pending Leave Can Be Deleted : @regression Leave-1349`, 
      async ({ loginPage, leavepage, useSession }) => {
        await useSession(role);
        await loginPage.visit(config.slug.leavepage);
        await leavepage.deleteLeave(config.data.deleteEmployeeName);
      }
    );

    test(`${role} - Verify Calendar Month & Year : @regression Leave-1002`, 
      async ({ loginPage, leaveDashboard, useSession }) => {
        await setupDashboard({ loginPage, leaveDashboard, useSession }, role);
        await leaveDashboard.leaveDashboardMonthYearValidation();
      }
    );
  }
});

// ===================================================
// 🔹 Dashboard Leave Tests (API / Component / Holiday / Modal)
// ===================================================
test.describe('Dashboard Leave Tests', () => {

  // API Validation
  test(`Dashboard API Response Check : @regression TC_002`, 
    async ({ loginPage, leaveDashboard, useSession }) => {
      await setupDashboard({ loginPage, leaveDashboard, useSession });
      await leaveDashboard.leaveDashboardAllApis();
    }
  );

  // Component Validation
  for (const role of allAdmin) {
    test(`${role} - Leave Dashboard Component Check : @regression Leave_1001`, 
      async ({ loginPage, leaveDashboard, useSession }) => {
        await setupDashboard({ loginPage, leaveDashboard, useSession }, role);
        await leaveDashboard.leaveComponentCheck();
      }
    );
  }

  // Holiday & Today Highlight
  test(`Verify Holidays and Today Highlight : @regression Leave_1003 & Leave_1004`, 
    async ({ loginPage, leaveDashboard, useSession }) => {
      await setupDashboard({ loginPage, leaveDashboard, useSession });

      const holidayCount = await leaveDashboard.getHolidayCount();
      const holidayLabels = await leaveDashboard.getHolidayLabels();

      console.log(`📅 Total holidays: ${holidayCount}`);
      console.log(`🏷️ Holiday labels: ${holidayLabels.join(', ')}`);

      test.expect(holidayCount).toBeGreaterThan(0);
      test.expect(holidayLabels.length).toBeGreaterThan(0);

      await leaveDashboard.verifyTodayHighlight();
    }
  );

  // Day-wise Leave Validation
  test(`Verify Day-wise Leave Counts : @regression Leave_1005`, 
    async ({ loginPage, leaveDashboard, useSession }) => {
      await setupDashboard({ loginPage, leaveDashboard, useSession });

      const leaveCounts = await leaveDashboard.getLeaveCountsPerDay();
      leaveCounts.forEach(day => {
        console.log(`📊 ${day.date}: ${day.leaveCount} leave(s)`);
        test.expect(day.leaveCount).toBeGreaterThanOrEqual(0);
      });

      const day5Leave = await leaveDashboard.getLeaveCountForDay(5);
      console.log(`📌 ${day5Leave.date}: ${day5Leave.leaveCount} leave(s)`);
      test.expect(day5Leave.leaveCount).toBeGreaterThanOrEqual(0);
    }
  );

  // Random Employee Modal Validation
  test(`Verify Random Employee Modal Opens : @regression Leave_1010`, 
    async ({ loginPage, leaveDashboard, useSession }) => {
      await setupDashboard({ loginPage, leaveDashboard, useSession });

      await leaveDashboard.openRandomEmployeeModal();
      await leaveDashboard.verifyModalContent();

      console.log('🎉 PASS: Employee modal opened successfully and content is visible!');
    }
  );
});
