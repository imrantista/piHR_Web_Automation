import { expect } from "@playwright/test";
import { ManageUserPage } from "../userPage";

export class ScreenPermission extends ManageUserPage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.screenPermissionHeading = page.getByRole('heading', { name: 'Screen permission' });
        this.settingSubHeading = page.getByRole('heading', { name: 'Settings' });
        this.employeeSubHeading = page.getByRole('heading', { name: 'Employee' });
        this.attendanceSubHeading = page.getByRole('heading', { name: 'Attendance' });
        this.leaveSubHeading = page.getByRole('heading', { name: 'Leave' });
        this.salarySubHeading = page.getByRole('heading', { name: 'Salary' });
        this.taxSubHeading = page.getByRole('heading', { name: 'Tax' });   
        this.savePermissionBtn = page.getByRole('button', { name: 'Save Permission' });

    }

    async verifyScreenPermission()
    {
        const elements = [
            { locator: this.screenPermissionHeading, alias: 'Screen Permission Heading visible' },
            { locator: this.settingSubHeading, alias: 'Settings Sub Heading visible' },
            { locator: this.employeeSubHeading, alias: 'Employee Sub Heading visible' },
            { locator: this.attendanceSubHeading, alias: 'Attendance Sub Heading visible' },
            { locator: this.leaveSubHeading, alias: 'Leave Sub Heading visible' },
            { locator: this.salarySubHeading, alias: 'Salary Sub Heading visible' },
            { locator: this.taxSubHeading, alias: 'Tax Sub Heading visible' },
        ]
        for (const el of elements) {
            await this.assert({ locator: { default: el.locator }, state: 'visible', alias: el.alias });
        }
    }



}