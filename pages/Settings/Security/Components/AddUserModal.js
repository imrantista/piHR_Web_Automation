import { expect } from "@playwright/test";
import { ManageUserPage } from "../userPage";

export class AddNewUser extends ManageUserPage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.userNameField = page.getByRole('textbox', { name: 'Enter User Name' });
        this.mobileNumberField = page.getByRole('textbox', { name: 'Enter Mobile Number' });
        this.emailField = page.getByRole('textbox', { name: 'Enter Email' });
        this.categoryField = page.getByText('Select Category');
        this.statusField = page.getByText('Select Status');
        this.attendanceField = page.getByText('Select Attendance');
        this.addButton = page.getByRole('button', { name: 'Add', exact: true });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' })
    }

    async verifyAddUserModalElements() {
        const elements =
            [
                { locator: this.userNameField, alias: 'User Name Field' },
                { locator: this.mobileNumberField, alias: 'Mobile Number Field' },
                { locator: this.emailField, alias: 'Email Field' },
                { locator: this.categoryField, alias: 'Category Field' },
                { locator: this.statusField, alias: 'Status Field' },
                { locator: this.attendanceField, alias: 'Attendance Field' },
            ]
        await this.scrollToTop();
        for (const el of elements) {
            await this.assert({ locator: { default: el.locator }, state: 'visible', alias: el.alias });
        }
    }

    async saveUserModal() {
        await this.addButton.click();
    }


    async verifyRequiredFieldValidationMessages() {
        const REQUIRED_MESSAGES = [
            "User name is required",
            "Mobile number is required",
            "Email is required",
            "User category is required",
            "User Status is required",
            "Face Attendance is required"
        ];

        for (const message of REQUIRED_MESSAGES) {
            const messageLocator = this.page.locator(`text="${message}"`);
            await this.assert({
                locator: messageLocator,
                state: 'visible',
                alias: `Validation Message: ${message}`
            });
        }

        console.log("All validation messages are displayed correctly");

    }

    async cancelUserModal() {
        await this.cancelButton.click();
    }

    async enterUserDetails({ userName, mobileNumber, email, category, status, attendance }) {
        await this.userNameField.fill(userName);
        await this.mobileNumberField.fill(mobileNumber);
        await this.emailField.fill(email);
        await this.categoryField.click();
        await this.page.getByRole('list').filter({ hasText: category }).click();
        await this.statusField.click();
        await this.page.getByRole('main').getByText(status, { exact: true }).click();
        await this.attendanceField.click();
        await this.page.getByText(attendance, { exact: true }).click();
    }


    async addUniqueUser(user) {
        await this.OpenAddNewModal();
        await this.enterUserDetails(user);
        await this.saveUserModal();
    }

    async verifyAddUserSuccess() {
        const messageLocator = this.page.locator(`text="User added successfully"`);
        await this.assert({
            locator: messageLocator,
            state: 'visible',
            alias: `Validation Message: User added successfully`
        });
    }

    async verifyUsernameValidation(maxLength = 30) {
        await this.OpenAddNewModal();
        const longUserName = 'a'.repeat(maxLength + 1);
        await this.userNameField.fill(longUserName);
        await this.saveUserModal();
        const validationMessage = this.page.locator('text="User name cannot exceed 30 characters"');
        await this.assert({
            locator: { default: validationMessage },
            state: 'visible',
            alias: 'User Name max length validation'
        });
    }

    async verifyEmailValidation(invalidEmail = "invalidemail") {
        await this.OpenAddNewModal();
        await this.emailField.fill(invalidEmail);
        await this.saveUserModal();
        const validationMessage = this.page.locator('text="Should be a valid email"');
        await this.assert({
            locator: { default: validationMessage },
            state: 'visible',
            alias: 'Email validation message'
        });
        await this.verifyAddNewModal();

    }


    async verifyMobileNumberValidation(invalidMobile = "123") {
        await this.OpenAddNewModal();
        await this.mobileNumberField.fill(invalidMobile);
        await this.saveUserModal();

        const validationMessage = this.page.locator('text="Please enter a valid phone number with 4-13 digits."');
        await this.assert({
            locator: { default: validationMessage },
            state: 'visible',
            alias: 'Mobile number validation message'
        });

        await this.verifyAddNewModal();
    }
}
