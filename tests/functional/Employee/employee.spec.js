import { Desktop, setViewport } from "../../../utils/viewports.js";
import { test, employee, supervisor, admin } from '../../../utils/sessionUse.js';
import { assetConfig, config } from '../../../config/testConfig.js';


test.describe("Supervisor Task related Tests", () => {
    test.beforeEach(async ({ page, loginPage, useSession }) => {
        await setViewport(page, Desktop.size);
        await useSession('supervisor');
        await loginPage.visit(config.slug.myTask);
    }
    )
    test("Verify Task Assign Functionality : @Business/Functional Self-1063", async ({ page, task }) => {
        await task.addAndVerifyTask();
    });
});


test.describe("Task Business Flow related Tests", () => {
    test.beforeEach(async ({ page }) => {
        await setViewport(page, Desktop.size);

    })

    test("Employee Can Receive Task and Update Status to In-Progress : @Business/Functional Self-1064", async ({ page, useSession, loginPage, task }) => {
        await useSession('supervisor');
        await loginPage.visit(config.slug.myTask);
        const taskData = await task.addAndVerifyTask();
        await useSession('employee');
        await loginPage.visit(config.slug.myTask);
        await task.updateTaskStatusandVerify(taskData.taskTitle, "In Progress");
    });

    test("Verify Supervisor Can See Updated Task Information from Employee : @Business/Functional Self-1065", async ({ page, useSession, loginPage, task }) => {
        // Supervisor assigns task
        await useSession('supervisor');
        await loginPage.visit(config.slug.myTask);
        const taskData = await task.addAndVerifyTask();

        // Employee updates task status to In-Progress
        await useSession('employee');
        await loginPage.visit(config.slug.myTask);
        await task.updateTaskStatusandVerify(taskData.taskTitle, "In Progress");


        // Supervisor verifies the updated status
        await useSession('supervisor');
        await loginPage.visit(config.slug.myTask);
        await task.verifyStatus(taskData.taskTitle, "In Progress");
    });


    test("Verify Chat Functionality Under Task Between Supervisor and Employee : @Business/Functional Self-1066", async ({ page, useSession, loginPage, task }) => {
        // Supervisor assigns task
        await useSession('supervisor');
        await loginPage.visit(config.slug.myTask);
        const taskData = await task.addAndVerifyTask();

        // Employee updates task status to In-Progress
        await useSession('employee');
        await loginPage.visit(config.slug.myTask);
        await task.updateTaskStatusandVerify(taskData.taskTitle, "In Progress");
        await task.sendMessageByRole(taskData.taskTitle, 'employee');

        // Supervisor verifies the message from Employee and replies
        await useSession('supervisor');
        await loginPage.visit(config.slug.myTask);
        await task.sendMessageByRole(taskData.taskTitle, 'supervisor');
        await task.verifyMessageSentBy(taskData.taskTitle, 'supervisor');

        // Employee verifies the message from Supervisor
        await useSession('employee');
        await loginPage.visit(config.slug.myTask);
        await task.verifyMessageSentBy(taskData.taskTitle, 'supervisor');
    });
});

test.describe("Admin Task related Tests", () => {
    test.beforeEach(async ({ page, loginPage, useSession }) => {
        await setViewport(page, Desktop.size);
    });
    test("Verify Admin Can View and Update Task Assigned to Employees : @Business/Functional Self-1067", async ({ page, useSession, loginPage, task }) => {
        // Supervisor assigns task
        await useSession('supervisor');
        await loginPage.visit(config.slug.myTask);
        const taskData = await task.addAndVerifyTask();

        // Admin updates task status to In-Progress
        await useSession('admin');
        await loginPage.visit(config.slug.task);
        await task.updateTaskStatusandVerify(taskData.taskTitle, "In Progress");


        // Employee verifies the updated status
        await useSession('employee');
        await loginPage.visit(config.slug.myTask);
        await task.verifyStatus(taskData.taskTitle, "In Progress");

    });

});


test.describe("Filter Related Tests", () => {
    test.beforeEach(async ({ page, loginPage, useSession }) => {
        await setViewport(page, Desktop.size);
        await useSession('supervisor');
        await loginPage.visit(config.slug.myTask);
    });

    test("Verify Task Filter Functionality : @Business/Functional Self-1069", async ({ page, task }) => {
        await task.verifyStatusFilter();
    });

    test("Verify Task Filter Reset Button Functionality : @Business/Functional Self-1070", async ({ page, task }) => {
        await task.verifyFilterResetFunctionality();
    });
});


test.describe("Employee Asset Module test", () => {
  for (const vp of [Desktop]) {
    test(`${employee} - ${vp.name} Verify Employee Can Apply for a New Asset: @Business/Functional Self-1084`,
      async ({ page, loginPage, employeeasset, useSession }) => {
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
      }
    );
  }
   for (const vp of [Desktop]) {
    test(`${employee} - ${vp.name} Verify Employee Can Edit Pending Asset Request: @Business/Functional Self-1085`,
      async ({ page, loginPage, employeeasset, useSession }) => {
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.employeeCanEditAssetRequest();
      }
    );
  }
for (const vp of [Desktop]) {
  test(`${supervisor} - ${vp.name} Verify Supervisor Can Approve Employee Asset Request: @Business/Functional Self-1086`,
    async ({ page, loginPage, employeeasset, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(supervisor);
      await loginPage.visit(config.slug.assetrequisitionrequest);
      if (!(await employeeasset.pendingRequest().isVisible().catch(() => false))) {
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
        await useSession(supervisor);
        await loginPage.visit(config.slug.assetrequisitionrequest);
       }
      await employeeasset.approveAssetRequestBySupervisor(
        assetConfig.emplyeeName
      );
    }
  );
}
for (const vp of [Desktop]) {
  test(`${supervisor} - ${vp.name} Verify Supervisor Can reject Employee Asset Request: @Business/Functional Self-1087`,
    async ({ page, loginPage, employeeasset, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(supervisor);
      await loginPage.visit(config.slug.assetrequisitionrequest);
      if (!(await employeeasset.pendingRequest().isVisible().catch(() => false))) {
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
        await useSession(supervisor);
        await loginPage.visit(config.slug.assetrequisitionrequest);
       }
      await employeeasset.rejectAssetRequestBySupervisor(
        assetConfig.emplyeeName
      );
    }
  );
}
for (const vp of [Desktop]) {
  test(`${admin} - ${vp.name} Verify that an admin can approve a pending asset request submitted by an employee: @Business/Functional Self-1089`,
    async ({ page, loginPage, employeeasset, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(admin);
      await loginPage.visit(config.slug.assetrequisitionrequest);
      if (!(await employeeasset.pendingRequest().isVisible().catch(() => false))) {
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
        await useSession(admin);
        await loginPage.visit(config.slug.assetrequisitionrequest);
       }
      await employeeasset.approveAssetRequestByAdmin(
        assetConfig.emplyeeName
      );
    }
  );
}
for (const vp of [Desktop]) {
  test(`${admin} - ${vp.name} Verify that an admin can reject a pending asset request submitted by an employee: @Business/Functional Self-1090`,
    async ({ page, loginPage, employeeasset, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(admin);
      await loginPage.visit(config.slug.assetrequisitionrequest);
      if (!(await employeeasset.pendingRequest().isVisible().catch(() => false))) {
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.requestAssetByEmployee();
        await useSession(admin);
        await loginPage.visit(config.slug.assetrequisitionrequest);
       }
      await employeeasset.rejectAssetRequestByAdmin(
        assetConfig.emplyeeName
       );
    }
  );
}
  for (const vp of [Desktop]) {
    test(`${employee} - ${vp.name} Verify Assigned Asset Shows in Assigned Asset Table: @Business/Functional Self-1088`,
      async ({ page, loginPage, employeeasset, useSession }) => {
        await setViewport(page, vp.size);
        await useSession(employee);
        await loginPage.visit(config.slug.employeeasset);
        await employeeasset.assignedAssetShowsInAssignedTable();
        
      }
    );
  }
});


test.describe("Self Dashboard Tests", () => {
    test.beforeEach(async ({ page, loginPage, useSession }) => {
        await setViewport(page, Desktop.size);
        await useSession('employee');
        await loginPage.visit(config.slug.myDashboard);
    });

    test("Verify Employee Can View Task Summary on Dashboard : @Business/Functional Self-1100", async ({ page, selfDashboard }) => {
        await selfDashboard.uploadProfileImageAndVerify();
    });

    test("Verify Profile Information Displays Correct Employee Details : @Business/Functional Self-1101", async ({ page, selfDashboard }) => {
        await selfDashboard.verifyProfileInformation();
    });

    test("Verify Leave Spent Count Displays Correctly : @Business/Functional Self-1102", async ({ page, selfDashboard }) => {
        await selfDashboard.verifyLeaveSpentCount();
    });

    test("Verify Visit Taken Count Displays Correctly : @Business/Functional Self-1103", async ({ page, selfDashboard }) => {
        await selfDashboard.verifyVisitTakenCount();
    });

    test("Verify Missed Attendance Count Displays Correctly : @Business/Functional Self-1104", async ({ page, selfDashboard }) => {
        await selfDashboard.verifyMissedAttendanceCount();
    });

    test("Verify Asset Assigned Count Displays Correctly : @Business/Functional Self-1105", async ({ page, selfDashboard }) => {
        await selfDashboard.verifyAssetAssignedCount();
    });

    test("Verify Pending Approval Displays Correct Subordinate Applications : @Business/Functional Self-1106", async ({ page, selfDashboard }) => {
        await selfDashboard.verifyPendingApprovalSection();
    });

    test("Verify Leave Overview Chart Displays Correct Leave Counts and Types : @Business/Functional Self-1107", async ({ page, selfDashboard }) => {
        await selfDashboard.verifyLeaveOverviewChart();
    });

    test("Verify Supervisor Tab Displays Correct Supervisor List : @Business/Functional Self-1108", async ({ page, selfDashboard }) => {
        await selfDashboard.verifySupervisorTab();
    });

    test("Verify Subordinates Tab Displays All Subordinate Data : @Business/Functional Self-1109", async ({ page, selfDashboard }) => {
        await selfDashboard.verifySubordinateTab();
    });

    test("Verify Attendance Overview Calendar and Graph Displays Correct Data : @Business/Functional Self-1110", async ({ page, selfDashboard }) => {
        await selfDashboard.verifyAttendanceCalendarColors();
    });
});