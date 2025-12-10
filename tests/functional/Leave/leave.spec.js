import { expect } from '@playwright/test';
import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test, allAdmin, admin,employee,supervisor } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';


// Helper function to setup dashboard
async function setupDashboard({ loginPage, leaveDashboard, useSession }, role) {
  const userRole = role || allAdmin[0]; 
  await useSession(userRole);

  // Visit the leave dashboard page
  await loginPage.visit(config.slug.leavedashboard);

  // Wait for dashboard title to be visible
  await leaveDashboard.pageTitle.waitFor({ state: 'visible' });
}

// Leave Test Suite
test.describe('Leave test', () => {
  for (const bothAdmin of allAdmin) {
    for (const vp of [Desktop]) {
      test(`${bothAdmin}- ${vp.name} Verify the UI of Leave Create Modal : @regression Leave-1286`, 
        async ({ page, loginPage, leavepage, useSession }) => {
          await setViewport(page, vp.size);
          await useSession(bothAdmin);
          await loginPage.visit(config.slug.leavepage);
          await leavepage.checkModalComponent();
      });
    }

    for (const vp of [Desktop]) {
      test(`${bothAdmin}-${vp.name} Verify Required Fields Validation in Leave Create Modal When Foreign Leave Is Not Checked : @regression Leave-1304`,
        async ({ page, loginPage, leavepage, useSession }) => {
          await setViewport(page, vp.size);
          await useSession(bothAdmin);
          await loginPage.visit(config.slug.leavepage);
          await leavepage.requiredFieldValidation();
      });
    }
  }

  for (const Admin of admin) {
  for (const vp of [Desktop]) {
    test(`${Admin}-${vp.name} Leave Management Workflow: Create, Restrict Multiple Same Date, and Delete : @regression Leave-1307-1310-1349`  , async ({ page, loginPage, leavepage, useSession}) => {
      await setViewport(page, vp.size);
      await useSession(Admin);
      await loginPage.visit(config.slug.leavepage);

      // Step 1: Create Leave for an Employee with Pending Status (Leave-1307)
      await leavepage.createNewLeave(config.data.emplyeeName, config.data.leaveType, config.data.leaveStartDate, config.data.leaveEndDate, config.data.leavePurpose);
      console.log("Leave created successfully for employee:", config.data.emplyeeName);

      // Step 2: Verify System Restriction When Creating Multiple Leaves on the Same Date (Leave-1310)
      await leavepage.applyLeaveInSameDate(config.data.emplyeeName, config.data.leaveType, config.data.leaveStartDate, config.data.leaveEndDate, config.data.leavePurpose);
      console.log("System restriction verified for multiple leaves on the same date for employee:", config.data.emplyeeName);
      
      // Step 3: Verify Pending Leave Can Be Deleted (Leave-1349)
      await leavepage.deleteLeave(config.data.deleteEmployeeName);
      console.log("Leave deleted successfully for employee:", config.data.deleteEmployeeName);
    });
  }
     
    for (const vp of [Desktop]) {
      test(`${Admin}-${vp.name} Verify Calendar Displays Correct Month & Year When Navigating Months : @regression Leave-1002`,
        async ({ page, loginPage, useSession, leaveDashboard }) => {
          await setViewport(page, vp.size);
          await useSession(Admin);
          await loginPage.visit(config.slug.leavedashboard);
          await leaveDashboard.leaveDashboardMonthYearValidation();
      });
    }
  }
});

// Dashboard Leave Tests

test.describe('Dashboard Leave Tests', () => {

  // API Validation
  test(`Dashboard API Response Check : @regression TC_002`, 
    async ({ loginPage, leaveDashboard, useSession }) => {
      await setupDashboard({ loginPage, leaveDashboard, useSession });
      await leaveDashboard.leaveDashboardAllApis();
  });

  // Component Validation
  for (const role of allAdmin) {
    test(`${role} - Leave Dashboard Component Check : @regression Leave_1001`, 
      async ({ loginPage, leaveDashboard, useSession }) => {
        await setupDashboard({ loginPage, leaveDashboard, useSession }, role);
        await leaveDashboard.leaveComponentCheck();
    });
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
  });

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
  });

  /*// Random Employee Modal Validation
  test(`Verify Random Employee Modal Opens : @regression Leave_1010`, 
    async ({ loginPage, leaveDashboard, useSession }) => {
      await setupDashboard({ loginPage, leaveDashboard, useSession });

      // New SMART method TO OPEN RANDOM EMPLOYEE MODAL
      await leaveDashboard.openRandomEmployeeModal();

      console.log('🎉 PASS: Employee modal opened successfully and content is visible!');
  });*/
});

for (const vp of [Desktop]) {
    test(`Employee-${vp.name} Verify "Leave Remaining" count and dashboard validations: @regression Leave-XXXX`,
    async ({ page, loginPage, useSession, visitApplication }) => {
       
        await setViewport(page, vp.size);
    
        await useSession(employee); // 'employee'
      
        await loginPage.visit(config.slug.employeeDashboard);
       
         const leaveRemainingCount = await visitApplication.getLeaveRemainingCount();
        //expect(leaveRemainingCount).toBe('15');
      
          const actualSupervisorName = await visitApplication.logSupervisorName();

        // Assertion to fail test if name doesn't match
        expect(actualSupervisorName).toBe(visitApplication.expectedSupervisorName);

        console.log("✅ Leave Remaining count:", leaveRemainingCount);
    });
}

