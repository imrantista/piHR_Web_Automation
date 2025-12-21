import { expect } from '@playwright/test';
import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test, allAdmin, admin ,employee, supervisor} from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

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