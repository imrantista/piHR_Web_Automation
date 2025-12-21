import { expect } from '@playwright/test';
import { setViewport, Desktop } from '../../../utils/viewports.js';
import { test, employee, supervisor, admin } from '../../../utils/sessionUse.js';
import { assetConfig, config } from '../../../config/testConfig.js';

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

// Create Document Request
for (const vp of [Desktop]) {
    test(`Employee-${vp.name} Create Document Request Application: @Self-1079`,
    async ({ page, loginPage, useSession, documentRequest }) => {
       
        await setViewport(page, vp.size);
    
        await useSession(employee);
      
        await loginPage.visit(config.slug.documentRequest);
       
        await documentRequest.createRequestDocument()
    });
}

// Edit Document Request
for (const vp of [Desktop]) {
    test(`Employee-${vp.name} Updated Document Request Application: @Self-1080`,
    async ({ page, loginPage, useSession, documentRequest }) => {
       
        await setViewport(page, vp.size);
    
        await useSession(employee);
      
        await loginPage.visit(config.slug.documentRequest);
       
        await documentRequest.editRequestedDocument()
    });
}

// Delete Document Request
for (const vp of [Desktop]) {
    test(`Employee-${vp.name} Delete Document Request Application: @Self-1081`,
    async ({ page, loginPage, useSession, documentRequest }) => {
       
        await setViewport(page, vp.size);
    
        await useSession(employee); // 'employee'
      
        await loginPage.visit(config.slug.documentRequest);
       
        await documentRequest.deleteDocumentApplication()
    });
}

// Approve Document Request by Admin
for (const vp of [Desktop]) {
    test(`Admin-${vp.name} Approve Document Request Application: @Self-1082`,
    async ({ page, loginPage, useSession, documentRequest }) => {
       
        await setViewport(page, vp.size);
        await useSession(admin);
        await loginPage.visit(config.slug.adminDocumentRequest);
        await documentRequest.approveDocument()
        await useSession (employee);
        await loginPage.visit(config.slug.documentRequest);
        await documentRequest.employeeVerifyDocument()
    });
}

// Reject Document Request by Admin
for (const vp of [Desktop]) {
    test(`Admin-${vp.name} Reject Document Request Application: @Self-1083`,
    async ({ page, loginPage, useSession, documentRequest }) => {
       
        await setViewport(page, vp.size);
        await useSession(admin);
        await loginPage.visit(config.slug.adminDocumentRequest);
        await documentRequest.rejectDocument()
        await useSession (employee);
        await loginPage.visit(config.slug.documentRequest);
        await documentRequest.employeeVerifyRejectDocument()
    });
}