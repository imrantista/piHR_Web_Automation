import { expect } from '@playwright/test';
import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test, allAdmin, admin,employee, supervisor } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

// Helper function to setup dashboard
async function setupDashboard({ loginPage, leaveDashboard, useSession }, role) {
  const userRole = role || allAdmin[0]; 
  await useSession(userRole);

  // Visit the leave dashboard page
  await loginPage.visit(config.slug.leaveDashboard);

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
          await loginPage.visit(config.slug.leaveDashboard);
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

      // New SMART modal logic
      await leaveDashboard.openRandomEmployeeModal();

      console.log('🎉 PASS: Employee modal opened successfully and content is visible!');
  });*/
});

// //Employee Management Leave page
test.describe('Employee Management Leave Page Tests', () => {
 
    for (const vp of [Desktop]){
      test(`${employee}-${vp.name} Verify Employee Leave Eligibility : @Business/Functional Self-1001`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit();
        await leavepage.verifyLeaveEligibility();
      });

      test(`${employee}-${vp.name} Apply Leave : @Business/Functional Self-1002`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit();
        await leavepage.applyLeave(config.data.leaveStartDate,config.data.leaveEndDate,config.data.leavePurpose);

        
      });
      test(`${supervisor}-${vp.name} Supervisor Reject Leave Request : @Business/Functional Self-1004`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(supervisor);
        await loginPage.visit();
        await leavepage.supervisorRejectLeave();
        await useSession(employee);
        await loginPage.visit();
        await leavepage.verifyLeaveEligibility();
        
      });
      test(`${supervisor,employee}-${vp.name} Supervisor Accept Leave Request : @Business/Functional Self-1003`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit();
        await leavepage.applyLeave(config.data.leaveStartDate,config.data.leaveEndDate,config.data.leavePurpose);
        await useSession(supervisor);
        await loginPage.visit();
        await leavepage.approveLeaveApplication();
      });

     test(`${admin}-${vp.name} Admin Verify Leave Application : @Business/Functional123 Self-1005`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(admin);
        await loginPage.visit();
        await leavepage.adminVerifyLeaveApplication();
    });

     test(`${supervisor,employee}-${vp.name} Supervisor Accept Leave Request, Employee Check Leave Status After Accept and Before Accept : @Business/Functional self-1006`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit('selfservice/mydashboard');
        await leavepage.verifyLeaveEligibility('employeeLeaveInformation.json');
        await leavepage.compareUIAndApiLeaveTakenAndLeaveRemainingValueBreforeApproval();
        await leavepage.applyLeave(config.data.leaveStartDate,config.data.leaveEndDate,config.data.leavePurpose);
        await useSession(supervisor);
        await loginPage.visit();
        await leavepage.approveLeaveApplication();
        await useSession(employee);
        await loginPage.visit('selfservice/mydashboard');
        await leavepage.verifyLeaveEligibility('AfterLeaveEmployeeLeaveInformation.json');
        await leavepage.afterApproveCompareUIAndApiLeaveTakenAndLeaveRemainingValueBreforeApproval();
    });

    test(`${employee}-${vp.name} Update Leave Application : @Business/Functional123 Self-1008`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit();
        await leavepage.updateLeaveApplication(config.data.updateLeaveEndDate);
    });

    test(`${employee}-${vp.name} Delete Leave Application : @Business/Functional123 Self-1009`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit();
        await leavepage.deleteLeaveApplication();
    });

    test(`${supervisor}-${vp.name} Supervisor Edit Leave Application : @Business/Functional123 Self-1011`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(supervisor);
        await loginPage.visit();
        await leavepage.supervisorEditLeaveApplication(config.data.supEditLeaveDate);
    });

    test(`${admin}-${vp.name} Admin Approve Leave Application : @Business/Functional123 Self-1012`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(admin);
        await loginPage.visit();
        await leavepage.adminApproveLeaveApplication();
    });

    test(`${admin}-${vp.name} Admin Delete Leave Application : @Business/Functional123 Self-1013`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(admin);
        await loginPage.visit();
        await leavepage.adminRejectPendingLeaveApplication();
    });

    test(`${admin}-${vp.name} Admin Update and Approve Leave Application : @Business/Functional123 Self-1014`,async({page,leavepage,loginPage,useSession})=>{
        await setViewport(page, vp.size);
        await useSession(admin);
        await loginPage.visit();
        await leavepage.adminEditLeaveApplication();
    });
}
});
for (const vp of [Desktop]) {
    test(`Employee-${vp.name} Verify "Leave Remaining" count and dashboard validations: @Self-1016`,
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

// Visit Application
for (const vp of [Desktop]) {
  test(`Employee-${vp.name} Visit Application Workflow: Create + Supervisor Verify @ Self-1017`,
    async ({ page, loginPage, useSession, visitApplication }) => {

      const visitPurpose = config.visitApplicationData.visitPurpose;

     
      // EMPLOYEE CREATES VISIT
   
      await setViewport(page, vp.size);
      await useSession(employee[0]);
      await loginPage.visit(config.slug.visitApplication);

      await visitApplication.createNewVisit(
        config.visitApplicationData.visitFromtDate,
        config.visitApplicationData.visitEndDate,
        visitPurpose
      );

      // Verify visit for employee
      await visitApplication.verifyVisitStatus(visitPurpose, false);

   
      // SUPERVISOR VALIDATION
   
      await useSession(supervisor[0]);

      await loginPage.visit(config.slug.supervisorVisitApplication);
      await visitApplication.verifySupervisorView(); 
    }
  ); 
} 

  //Edit Visit Application
 for (const vp of [Desktop]) {
  test(`Employee-${vp.name} Visit ApplicationEdit flow: Create + Supervisor Verify @ Self-1018`,
    async ({ page, loginPage, useSession, visitApplication }) => {

      const visitPurpose = config.visitApplicationData.visitPurpose;
      const UpdatedVisitFromDate = config.visitApplicationData.updatedVisitFromDate;
     
      // EMPLOYEE Edits VISIT
   
      await setViewport(page, vp.size);
      await useSession(employee[0]);
      await loginPage.visit(config.slug.visitApplication);
      await page.waitForTimeout(2000);

      await visitApplication.editVisitApplication(
        visitPurpose,
        UpdatedVisitFromDate
      );

      // Verify visit for employee
      await visitApplication.verifyFromDate(visitPurpose, UpdatedVisitFromDate);

      // SUPERVISOR VALIDATION
   
      // await useSession(supervisor[0]);

      // await loginPage.visit(config.slug.supervisorVisitApplication);
      // await visitApplication.verifyEditApplication(UpdatedVisitFromDate); 
    }
   );
  }

// Delete Visit Application
 for (const vp of [Desktop]) {
  test(`Employee-${vp.name} Delete Visit Application @ Self-1019`,
    async ({ page, loginPage, useSession, visitApplication }) => {
   
      await setViewport(page, vp.size);
      await useSession(employee[0]);
      await loginPage.visit(config.slug.visitApplication);

      await visitApplication.deleteLeave(config.deleteApplicationData.visitReason);
});
 };
