import BasePage from "../../BasePage";
import { expect } from "@playwright/test";

export class DailyAttendancePage extends BasePage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;
    }

    // Locators
    attendanceInTimeBtn = () => this.page.getByRole('button', { name: 'In Time' });
    attendanceOutTimeBtn = () => this.page.getByRole('button', { name: 'Out Time' });
    successToasterSaved = () => this.page.getByText('Data saved successfully.').first();
    successToasterUpdated = () => this.page.getByText('Data updated successfully.').first();
    searchBox = () => this.page.getByRole('textbox', { name: 'Search', exact: true });

    get inTimeColumn() {
        return this.page.locator('th:has-text("In Time")').locator('..').locator('td');
    }

    get outTimeColumn() {
        return this.page.locator('th:has-text("Out Time")').locator('..').locator('td');
    }

    async isVisible(locator) {
        return await locator().isVisible().catch(() => false);
    }

    async checkSuccessToaster() {
        const savedVisible = await this.isVisible(this.successToasterSaved);
        const updatedVisible = await this.isVisible(this.successToasterUpdated);

        if (savedVisible) await expect(this.successToasterSaved()).toBeHidden({ timeout: 5000 });
        else if (updatedVisible) await expect(this.successToasterUpdated()).toBeHidden({ timeout: 5000 });
        else console.log("No success toaster appeared!");
    }
    // Employee set in time
    async submitInTimeByEmployee() {
        if (await this.isVisible(this.attendanceInTimeBtn)) {
            await this.attendanceInTimeBtn().click();
            await this.checkSuccessToaster();
            console.log("In Time submitted successfully");
        } else if (await this.isVisible(this.attendanceOutTimeBtn)) {
            console.log("In Time already provided");
        } else {
            console.log("Attendance buttons not visible");
        }
    }
    // Employee set out time
    async submitOutTimeByEmployee() {
        if (await this.isVisible(this.attendanceOutTimeBtn)) {
            if (await this.isVisible(this.attendanceInTimeBtn)) {
                console.log("Submitting In Time before Out Time...");
                await this.submitInTimeByEmployee();
            }
            await this.attendanceOutTimeBtn().click();
            await this.checkSuccessToaster();
            console.log("Out Time submitted successfully");
        } else if (await this.isVisible(this.attendanceInTimeBtn)) {
            console.log("Out Time cannot be provided before In Time. Submitting In Time only...");
            await this.submitInTimeByEmployee();
        } else {
            console.log("Attendance buttons not visible");
        }
    }

    async getEmployeeAttendanceTimes() {
        const inTimeText = await this.page.getByText(/Your In Time- /).textContent().catch(() => null);
        const outTimeText = await this.page.getByText(/Your Out Time- /).textContent().catch(() => null);

        const inTime = inTimeText?.split('Your In Time- ')[1]?.trim() || null;
        const outTime = outTimeText?.split('Your Out Time- ')[1]?.trim() || null;

        console.log(`Fetched In Time: ${inTime}, Out Time: ${outTime}`);
        return { inTime, outTime };
    }

    // Admin verify the employee attendance data
    async verifyEmployeeAttendanceByAdmin(employeeName, expectedInTime, expectedOutTime) {
        await this.searchBox().fill(employeeName);
        await this.searchBox().press('Enter');
        const employeeRow = this.page.getByRole('row', { name: new RegExp(employeeName, 'i') });
        await expect(employeeRow).toBeVisible({ timeout: 5000 });
        await expect(employeeRow.locator('td span', { hasText: expectedInTime })).toHaveText(expectedInTime);
        await expect(employeeRow.locator('td span', { hasText: expectedOutTime })).toHaveText(expectedOutTime);
        console.log(`Verified In Time (${expectedInTime}) and Out Time (${expectedOutTime}) for ${employeeName} in Admin View`);
    }
    async getInTimeData() {
        return await this.inTimeColumn.allTextContents();
    }
    async getOutTimeData() {
        return await this.outTimeColumn.allTextContents();
    }
}
