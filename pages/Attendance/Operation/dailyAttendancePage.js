import BasePage from "../../BasePage";
import { expect } from "@playwright/test";
export class DailyAttendancePage extends BasePage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;
    }
    // Locators
    attendanceTable = () => this.page.getByRole('table', { name: 'Daily Attendance Table' })
    
    // Employee Submit In-Time Attendance
    async submitInTimeByEmployee() {
        await expect(this.attendanceTable()).toBeVisible();
    }
}