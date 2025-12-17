import { config } from "../../../config/testConfig.js";
import { test } from "../../../utils/sessionUse.js";
import { Desktop, setViewport } from "../../../utils/viewports.js";

test.describe("Employee Self Service Tests", () => {
    test.beforeEach(async ({ page, loginPage, useSession }) => {
        await setViewport(page, Desktop.size);
        await useSession('employee');
        await loginPage.visit(config.slug.myClaim);
    })
    test("Verify Employee Can Submit Claim Application : @Business/Functional Self-1028", async ({ page, claim }) => {
        await claim.addAndVerifyClaim();
    });

    test("Verify Employee Can Edit Pending Claim Application : @Business/Functional Self-1029", async ({ page, claim }) => {
        // Add claim as pre-requisite to have claim to edit
        await claim.addNewClaim(true);
        await claim.editAndVerifyClaim();
    });

    test("Verify Employee Can Delete Pending Claim Application : @Business/Functional Self-1030", async ({ page, claim }) => {
        // Add claim as pre-requisite to have claim to delete
        await claim.addNewClaim(true);
        await claim.deleteAndVerifyClaim();
    });
});

test.describe("Supervisor Self Service Tests", () => {
    test.beforeEach(async ({ page, loginPage, useSession }) => {
        await setViewport(page, Desktop.size);
        await useSession('supervisor');
        await loginPage.visit(config.slug.claimRequest);
    })
    test("Verify Supervisor Can Approve Claim Application : @Business/Functional Self-1031", async ({ page, claim }) => {
        await claim.approveClaimWithoutAmount();
    });

    test("Verify Supervisor Can Reject Claim Application : @Business/Functional Self-1032", async ({ page, claim }) => {
        await claim.rejectClaim();
    });

    test("Verify Supervisor Can Edit and Approve Claim Application Partially : @Business/Functional Self-1033", async ({ page, claim, loginPage, useSession }) => {
        const claimNo = await claim.editAndApproveClaim();
        if (claimNo === undefined) return;
        await useSession('employee');
        await loginPage.visit(config.slug.myClaim);
        await claim.verifyClaimUpdateBySupervisor(claimNo);
    });



});
test.describe("File Download Verification", () => {

    test.beforeEach(async ({ page, loginPage, useSession }) => {
        await setViewport(page, Desktop.size);
        await useSession('employee');
        await loginPage.visit(config.slug.myClaim);
    })
    test("Verify Supervisor Can View and Download Claim Attachment : @Business/Functional Self-1034", async ({ page, claim, loginPage, useSession }) => {
        const claimNo = await claim.fillClaimWithFile();
        await useSession('supervisor');
        await loginPage.visit(config.slug.claimRequest);
        await claim.verifyFileDownload(claimNo);
    });

    test("Verify that the admin can view claim application details along with all uploaded documents/attachments submitted by the employee.", async ({ page, claim, loginPage, useSession }) => {
        const claimNo = await claim.fillClaimWithFile();
        await useSession('admin');
        await loginPage.visit(config.slug.claim);
        await claim.verifyFileDownload(claimNo);

    });
});

test.describe("Admin User Claim", () => {

    test.beforeEach(async ({ page, loginPage, useSession, claim }) => {
        // Being in Safe Side by Adding Claim
        await setViewport(page, Desktop.size);
        await useSession('employee');
        await loginPage.visit(config.slug.myClaim);

        // Add User Claim First
        await claim.addNewClaim(true);
    })
    test("Verify Admin Can Approve Claim Application : @Business/Functional Self-1035", async ({ page, claim, useSession, loginPage }) => {
        await useSession('admin');
        await loginPage.visit(config.slug.claim);
        await claim.verifyAdminApproveClaim();
    });

    test("Verify Admin Can Reject Claim Application : @Business/Functional Self-1036", async ({ page, claim, useSession, loginPage }) => {
        await useSession('admin');
        await loginPage.visit(config.slug.claim);
        await claim.verifyAdminRejectClaim();
    });

    test("Verify Admin Can Delete Claim Application : @Business/Functional Self-1037", async ({ page, claim, useSession, loginPage }) => {
        await useSession('admin');
        await loginPage.visit(config.slug.claim);
        await claim.verifyAdminDeleteClaim();
    });


})


test.describe("Advance Salary Employee Self Service Tests", () => {
    test.beforeEach(async ({ page, loginPage, useSession }) => {
        await setViewport(page, Desktop.size);
        await useSession('employee');
        await loginPage.visit(config.slug.myAdvanceSalary);
    });

    test("Verify Employee Can Submit Advance Salary Application : @Business/Functional Self-1039", async ({ page, advanceSalary }) => {
        await advanceSalary.addAdvanceSalaryAndVerify({});
    });

    test("Verify Employee Can Edit Pending Advance Salary Application : @Business/Functional Self-1040", async ({ page, advanceSalary }) => {
        // Add Advance Salary as pre-requisite to have advance salary to edit
        await advanceSalary.addAdvanceSalaryAndVerify({});
        await advanceSalary.editAndVerifyAdvanceSalary({});
    });

    test("Verify Employee Can Delete Pending Advance Salary Application : @Business/Functional Self-1041", async ({ page, advanceSalary }) => {
        // Add Advance Salary as pre-requisite to have advance salary to delete
        await advanceSalary.addAdvanceSalaryAndVerify({});
        await advanceSalary.deleteAndVerifyAdvanceSalary();
    });
});

test.describe("Advance Salary Supervisor Self Service Tests", () => {
    test.beforeEach(async ({ page, loginPage, useSession, advanceSalary }) => {
        await setViewport(page, Desktop.size);
        // Add Advance Salary as pre-requisite to have advance salary to approve/reject
        await useSession('employee');
        await loginPage.visit(config.slug.myAdvanceSalary);
        await advanceSalary.addAdvanceSalaryAndVerify({});

        // Now Login as Supervisor
        await useSession('supervisor');
        await loginPage.visit(config.slug.approveApplication);
        await advanceSalary.navigateToAdvanceSalaryTab();
    });

    test("Verify Supervisor Can Approve Advance Salary Application : @Business/Functional Self-1042", async ({ page, advanceSalary }) => {
        await advanceSalary.approveAndVerifyAdvanceSalary();
    });

    test("Verify Supervisor Can Reject Advance Salary Application : @Business/Functional Self-1043", async ({ page, advanceSalary }) => {
        await advanceSalary.rejectAndVerifyAdvanceSalary();
    });
});

test.describe("Advance Salary Admin User Tests", () => {

    test.beforeEach(async ({ page, loginPage, useSession, advanceSalary }) => {
        await setViewport(page, Desktop.size);
        // Add Advance Salary as pre-requisite to have advance salary to approve/reject
        await useSession('employee');
        await loginPage.visit(config.slug.myAdvanceSalary);
        await advanceSalary.addAdvanceSalaryAndVerify({});

        // Now Login as Admin
        await useSession('admin');
        await loginPage.visit(config.slug.advanceSalary);
    });

    test("Verify Admin Can Approve Advance Salary Application : @Business/Functional Self-1046", async ({ page, advanceSalary }) => {
        await advanceSalary.approveAndVerifyAdvanceSalaryByAdmin();
    });

    test("Verify Admin Can Edit and Approve Advance Salary Application : @Business/Functional Self-1047", async ({ page, advanceSalary }) => {
        await advanceSalary.updateAndVerifyAdvanceSalaryByAdmin({});
    });

    test("Verify Admin Can Reject Advance Salary Application : @Business/Functional Self-1048", async ({ page, advanceSalary }) => {
        await advanceSalary.rejectAndVerifyAdvanceSalaryByAdmin();
    });

    test("Verify Admin Can Delete Advance Salary Application : @Business/Functional Self-1049", async ({ page, advanceSalary }) => {
        await advanceSalary.deleteAndVerifyAdvanceSalaryByAdmin();
    });
});