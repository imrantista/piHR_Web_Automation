import { expect } from "@playwright/test";
import { getAttendanceCalender, getEmployeeDashboard, getEmployeeHierarchy, getEmployeeInformation } from "../../../api/employeeApi";
import { testFile } from "../../../config/testFiles";
import BasePage from "../../BasePage";

export class SelfDashboardPage extends BasePage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.fileUploadField = page.locator('input[type="file"]');
        this.image = testFile;
        this.saveImageBtn = page.getByRole('button', { name: 'Save Image' });
    }

    async uploadProfileImage() {
        await this.fileUploadField.setInputFiles(this.image);
        await this.saveImageBtn.click();
    }

    async uploadProfileImageAndVerify() {
        await this.uploadProfileImage();
        const successMessage = this.page.getByText('Your profile image update request is waiting for approval.');
        await this.assert({
            locator: successMessage,
            state: 'visible',
            message: 'Profile image upload success message is not visible'
        })
    }

    async verifyProfileInformation() {
        const apiData = await getEmployeeInformation();

        const profile = apiData.profile_information;
        const official = apiData.official_information;

        // Verify Employee Name
        await this.assert({
            locator: this.page.getByText(profile.employee_name, { exact: true }),
            state: 'visible',
            message: `Employee name "${profile.employee_name}" from API matches dashboard`
        });

        // Verify Designation
        await this.assert({
            locator: this.page.getByText(profile.designation, { exact: true }),
            state: 'visible',
            message: `Designation "${profile.designation}" from API matches dashboard`
        });

        // Verify Employee ID (uses employee_code from official_information)
        await this.assert({
            locator: this.page.getByText(official.employee_code, { exact: true }),
            state: 'visible',
            message: `Employee ID "${official.employee_code}" from API matches dashboard`
        });

        // Verify Branch
        await this.assert({
            locator: this.page.getByText('Branch'),
            state: 'visible',
            message: 'Branch label is visible'
        });
        await this.assert({
            locator: this.page.getByText(official.branch_name, { exact: true }),
            state: 'visible',
            message: `Branch "${official.branch_name}" from API matches dashboard`
        });

        // Verify Department
        await this.assert({
            locator: this.page.getByText('Department'),
            state: 'visible',
            message: 'Department label is visible'
        });
        await this.assert({
            locator: this.page.getByText(official.department_name, { exact: true }),
            state: 'visible',
            message: `Department "${official.department_name}" from API matches dashboard`
        });

        // Verify Joining Date - format API date to match UI format
        const apiJoinDate = official.join_date; // e.g., "06-10-2022"
        const [day, month, year] = apiJoinDate.split('-');
        const monthNames = [
            '', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const formattedJoinDate = `${monthNames[parseInt(month)]} ${parseInt(day)}, ${year}`;

        await this.assert({
            locator: this.page.getByText('Joining Date'),
            state: 'visible',
            message: 'Joining Date label is visible'
        });
        await this.assert({
            locator: this.page.getByText(formattedJoinDate, { exact: true }),
            state: 'visible',
            message: `Joining Date "${formattedJoinDate}" (derived from API "${apiJoinDate}") matches dashboard`
        });
    }
    async getLeaveSpentCountFromUI() {
        const container = this.page.getByText('Leave Spent', { exact: true }).locator('..');
        const text = await container.innerText();
        const match = text.match(/\d+/);
        const leaveSpent = match?.[0];
        return leaveSpent;
    }


    async verifyLeaveSpentCount() {
        const apiData = await getEmployeeDashboard();
        const apiLeaveSpent = apiData.summaries.find(
            item => item.title === 'Leave Spent'
        )?.count;
        console.log(`API Leave Spent: ${apiLeaveSpent}`);

        const uiLeaveSpent = await this.getLeaveSpentCountFromUI();
        console.log(`UI Leave Spent: ${uiLeaveSpent}`);

        expect(uiLeaveSpent).toBeDefined();
        expect(apiLeaveSpent).toBeDefined();
        expect(uiLeaveSpent).toMatch(/^\d+$/);
        expect(Number(uiLeaveSpent)).toEqual(apiLeaveSpent);
    }
    async getVisitTakenCountFromUI() {
        const container = this.page.getByText('Visit Taken', { exact: true }).locator('..');
        const text = await container.innerText();
        const match = text.match(/\d+/);
        const visitTaken = match?.[0];
        return visitTaken;
    }

    async verifyVisitTakenCount() {
        const apiData = await getEmployeeDashboard();
        const apiVisitTaken = apiData.summaries.find(
            item => item.title === 'Visit Taken'
        )?.count;
        console.log(`API Visit Taken: ${apiVisitTaken}`);
        const uiVisitTaken = await this.getVisitTakenCountFromUI();
        console.log(`UI Visit Taken: ${uiVisitTaken}`);

        expect(uiVisitTaken).toBeDefined();
        expect(apiVisitTaken).toBeDefined();
        expect(uiVisitTaken).toMatch(/^\d+$/);
        expect(Number(uiVisitTaken)).toEqual(apiVisitTaken);
        console.log("Visit Taken count matches between UI and API.");
    }

    async getMissedAttendanceCountFromUI() {
        const container = this.page.getByText('Missed Attendance', { exact: true }).locator('..');
        const text = await container.innerText();
        const match = text.match(/\d+/);
        const missedAttendance = match?.[0];
        return missedAttendance;
    }

    async verifyMissedAttendanceCount() {
        const apiData = await getEmployeeDashboard();
        const apiMissedAttendance = apiData.summaries.find(
            item => item.title === 'Missed Attendance'
        )?.count;
        console.log(`API Missed Attendance: ${apiMissedAttendance}`);
        const uiMissedAttendance = await this.getMissedAttendanceCountFromUI();
        console.log(`UI Missed Attendance: ${uiMissedAttendance}`);

        expect(uiMissedAttendance).toBeDefined();
        expect(apiMissedAttendance).toBeDefined();
        expect(uiMissedAttendance).toMatch(/^\d+$/);
        expect(Number(uiMissedAttendance)).toEqual(apiMissedAttendance);
        console.log("Missed Attendance count matches between UI and API.");
    }

    async getAssetAssignedCountFromUI() {
        const container = this.page.getByText('Asset Assigned', { exact: true }).locator('..');
        const text = await container.innerText();
        const match = text.match(/\d+/);
        const assetAssigned = match?.[0];
        return assetAssigned;
    }

    async verifyAssetAssignedCount() {
        const apiData = await getEmployeeDashboard();
        const apiAssetAssigned = apiData.summaries.find(
            item => item.title === 'Asset Assigned'
        )?.count;
        console.log(`API Asset Assigned: ${apiAssetAssigned}`);
        const uiAssetAssigned = await this.getAssetAssignedCountFromUI();
        console.log(`UI Asset Assigned: ${uiAssetAssigned}`);
        expect(uiAssetAssigned).toBeDefined();
        expect(apiAssetAssigned).toBeDefined();
        expect(uiAssetAssigned).toMatch(/^\d+$/);
        expect(Number(uiAssetAssigned)).toEqual(apiAssetAssigned);
        console.log("Asset Assigned count matches between UI and API.");
    }

    async getPendingApprovalCountFromUI() {
        const container = this.page.getByText('Pending Approval', { exact: true }).locator('..');
        const text = await container.innerText();
        const match = text.match(/\d+/);
        const pendingApproval = match?.[0];
        return pendingApproval;
    }

    async verifyPendingApprovalSection() {
        const apiData = await getEmployeeDashboard();
        const apiPendingApproval = apiData.summaries.find(
            item => item.title === 'Pending Approval'
        )?.count;
        console.log(`API Pending Approval: ${apiPendingApproval}`);
        const uiPendingApproval = await this.getPendingApprovalCountFromUI();
        console.log(`UI Pending Approval: ${uiPendingApproval}`);
        expect(uiPendingApproval).toBeDefined();
        expect(apiPendingApproval).toBeDefined();
        expect(uiPendingApproval).toMatch(/^\d+$/);
        expect(Number(uiPendingApproval)).toEqual(apiPendingApproval);
        console.log("Pending Approval count matches between UI and API.");
    }

    async verifyLeaveOverviewChart() {
        // Get API data
        const apiData = await getEmployeeDashboard();
        const leaveInfo = apiData.leave_information[0];
        expect(leaveInfo).toBeDefined();

        const apiLeaveTaken = leaveInfo.leave_taken;
        const apiLeaveRemaining = leaveInfo.remaining_leaves;

        console.log(`API Leave Taken: ${apiLeaveTaken}`);
        console.log(`API Leave Remaining: ${apiLeaveRemaining}`);

        // Get UI Leave Taken from Highcharts 
        const leaveTakenSpan = this.page.getByText('Leave Taken', { exact: true });
        const uiLeaveTaken = await leaveTakenSpan
            .locator('xpath=preceding-sibling::span[1]')
            .innerText();
        expect(uiLeaveTaken).toBeDefined();
        expect(uiLeaveTaken).toMatch(/^\d+$/);
        console.log(`UI Leave Taken: ${uiLeaveTaken}`);

        // Get UI Leave Remaining from Highcharts 
        const leaveRemainingSpan = this.page.getByText('Leave Remaining', { exact: true });
        const uiLeaveRemaining = await leaveRemainingSpan
            .locator('xpath=preceding-sibling::span[1]')
            .innerText();
        expect(uiLeaveRemaining).toBeDefined();
        expect(uiLeaveRemaining).toMatch(/^\d+$/);
        console.log(`UI Leave Remaining: ${uiLeaveRemaining}`);

        // Assertions: UI vs API
        expect(Number(uiLeaveTaken)).toBe(leaveInfo.leave_taken);
        expect(Number(uiLeaveRemaining)).toBe(leaveInfo.remaining_leaves);
    }

    async verifySupervisorTab() {
        const apiData = await getEmployeeHierarchy();
        const supervisor = apiData.supervisor;
        if (!supervisor || supervisor.length === 0) {
            console.log("No supervisor found in API response.");
            return;
        }
        expect(supervisor).toBeDefined();
        const supervisorTab = this.page.getByText('Supervisor', { exact: true }).locator('xpath=ancestor::div[1]');
        const innerText = await supervisorTab.innerText();
        const lines = innerText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const uiName = lines[lines.length - 3];
        const uiDesignation = lines[lines.length - 2];
        const uiCode = lines[lines.length - 1];

        expect(uiName).toBeDefined();
        expect(uiDesignation).toBeDefined();
        expect(uiCode).toBeDefined();

        expect(uiName).toEqual(supervisor.supervisor_name);
        expect(uiDesignation).toEqual(supervisor.designation_name);
        expect(uiCode).toEqual(supervisor.supervisor_code);
        console.log("Supervisor information matches between UI and API.");
    }


    async verifySubordinateTab() {
        const apiData = await getEmployeeHierarchy();
        const subordinates = apiData.subordinates;
        if (subordinates.length === 0) {
            console.log("No subordinates found in API response.");
            return;
        }
        expect(subordinates).toBeDefined();
        // Switch to Subordinate tab
        await this.page.getByText('Subordinates').click();
        const subordinateTab = this.page.getByText('Subordinates', { exact: true }).locator('xpath=ancestor::div[1]');
        const innerText = await subordinateTab.innerText();
        const lines = innerText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const uiName = lines[lines.length - 3];
        const uiDesignation = lines[lines.length - 2];
        const uiCode = lines[lines.length - 1];
        expect(uiName).toBeDefined();
        expect(uiDesignation).toBeDefined();
        expect(uiCode).toBeDefined();

        const firstSubordinate = subordinates[0];
        expect(uiName).toEqual(firstSubordinate.name);
        expect(uiDesignation).toEqual(firstSubordinate.designation_name);
        expect(uiCode).toEqual(firstSubordinate.employee_code);
        console.log("Subordinate information matches between UI and API.");
    }


    async verifyAttendanceCalendarColors(page) {
        const data = await getAttendanceCalender();

        // Loop through each calendar date
        for (const dateStr in data.calendar) {
            const colorFromResponse = data.calendar[dateStr];

            if (colorFromResponse !== "") { // skip empty values
                const [day, month, year] = dateStr.split("-");
                const date = new Date(year, month - 1, day);
                const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                // Locate elements with aria-label
                const elements = this.page.locator(`[aria-label="${formattedDate}"]`);

                // Count of elements
                const count = await elements.count();

                // Loop through each element
                for (let i = 0; i < count; i++) {
                    const elementHandle = elements.nth(i);

                    // Get computed color in RGB
                    const elementColor = await elementHandle.evaluate(el => {
                        return window.getComputedStyle(el).backgroundColor;
                    });

                    // Convert response hex to RGB
                    function hexToRgb(hex) {
                        const bigint = parseInt(hex.slice(1), 16);
                        const r = (bigint >> 16) & 255;
                        const g = (bigint >> 8) & 255;
                        const b = bigint & 255;
                        return `rgb(${r}, ${g}, ${b})`;
                    }

                    const expectedColor = hexToRgb(colorFromResponse);
                    expect(elementColor).toBe(expectedColor);
                }
            }
        }
    }


}