import { expect } from "@playwright/test";
import { ManageUserPage } from "../userPage";

export class EditUser extends ManageUserPage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.mobileNumberField = page.getByRole('textbox', { name: 'Enter Mobile Number' });
        this.emailField = page.getByRole('textbox', { name: 'Enter Email' });
        this.categoryField = page.locator('label:has-text("Category")').locator('..').locator('..').locator('.modal-select-content');
        this.statusField = page.locator('label:has-text("Status")').locator('..').locator('..').locator('.modal-select-content');
        this.faceAttendanceField = page.locator('label:has-text("Face Attendance")').locator('..').locator('..').locator('.modal-select-content');
        this.qrAttendanceField = page.locator('label:has-text("QR Attendance")').locator('..').locator('..').locator('.modal-select-content');
        this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' })
    }

    async verifyPrefilledData() {
        const mobileNumber = await this.mobileNumberField.inputValue();
        const email = await this.emailField.inputValue();
        const categoryValue = await this.categoryField.getByText(/.*/).first().textContent();
        const statusValue = await this.statusField.getByText(/.*/).first().textContent();
        const faceAttendanceValue = await this.faceAttendanceField.getByText(/.*/).first().textContent();
        const qrAttendanceValue = await this.qrAttendanceField.getByText(/.*/).first().textContent();
        expect(mobileNumber).not.toBe('');
        expect(email).not.toBe('');
        expect(categoryValue?.trim()).not.toBe('');
        expect(statusValue?.trim()).not.toBe('');
        expect(faceAttendanceValue?.trim()).not.toBe('');
        expect(qrAttendanceValue?.trim()).not.toBe('');
    }

    async save() {
        await this.expectAndClick(this.saveButton, "Save Button");
    }

    async updateUserData({ mobileNumber, email, category, status, faceAttendance, qrAttendance }) {
        await this.mobileNumberField.fill(mobileNumber);
        await this.emailField.fill(email);
        await this.categoryField.click();
        await this.page.getByRole('listitem').filter({ hasText: category }).click();
        await this.statusField.click();
        await this.page.getByRole('listitem').filter({ hasText: new RegExp(`^${status}$`) }).click();
        await this.faceAttendanceField.click();
        await this.page.getByRole('listitem').filter({ hasText: faceAttendance }).click();
        await this.qrAttendanceField.click();
        await this.page.getByRole('listitem').filter({ hasText: qrAttendance }).click();
        await this.save();
    }

    async verifyEditUserSuccess() {
        const messageLocator = this.page.locator(`text="User updated successfully"`);
        await this.assert({
            locator: messageLocator,
            state: 'visible',
            alias: `Validation Message: User updated successfully`
        });
    }

    async verifyDuplicateEmail(email) {
        await this.openEditModal();
        await this.emailField.fill(email);
        await this.save();
        const messageLocator = this.page.locator(`text="Email address already exists."`);
        await this.assert({
            locator: messageLocator,
            state: 'visible',
            alias: `Validation Message: Email address already exists.`
        });

    }

    async verifyDuplicateMobileNumber(mobileNumber) {
        await this.openEditModal();
        await this.mobileNumberField.fill(mobileNumber);
        await this.save();
        const messageLocator = this.page.locator(`text="Mobile number already exists."`);
        await this.assert({
            locator: messageLocator,
            state: 'visible',
            alias: `Validation Message: Mobile number already exists.`
        });
    }

    async cancelEditModal() {
        await this.expectAndClick(this.cancelButton, "Cancel Button");
    }

    async verifyEditCancelled() {
        const number = await this.getUserMobileNumber(2);
        await this.openEditModal();
        await this.mobileNumberField.fill(number);
        await this.cancelEditModal();
        await expect(this.editUserHeading).not.toBeVisible();
        const firstNumber = await this.getUserMobileNumber(1);
        expect(firstNumber).not.toBe(number);
    }

    async verifyInvalidMobileNumber(number) {
        await this.mobileNumberField.fill(number);
        await this.save();
        const messageLocator = this.page.locator(`text="Please enter a valid phone number with 4-13 digits."`);
        await this.assert({
            locator: messageLocator,
            state: 'visible',
            alias: `Validation Message: Please enter a valid phone number with 4-13 digits.`
        });
    }

    async getStatus() {
        const data = await this.getRow();
        return data[0].status;
    }
    async verifyStatusChange() {
        const status = await this.getStatus();
        var newStatus = status == "Active" ? "Inactive" : "Active";
        await this.openEditModal();
        await this.statusField.click();
        await this.page.getByRole('listitem').filter({ hasText: newStatus }).click();
        await this.save();
        const updatedStatus = await this.getStatus();
        expect(updatedStatus).toBe(newStatus);
    }


    async verifyInvalidEmail() {
        await this.openEditModal();
        await this.emailField.fill("test");
        await this.save();
        const messageLocator = this.page.locator(`text="Should be a valid email"`);
        await this.assert({
            locator: messageLocator,
            state: 'visible',
            alias: `Validation Message: Should be a valid email`
        });
    }

    async verifyAttendanceChange() {
        await this.openEditModal();
        const faceAttendance = (await this.faceAttendanceField.getByText(/.*/).first().textContent()) == "Yes" ? "No" : "Yes";
        const qrAttendance = (await this.qrAttendanceField.getByText(/.*/).first().textContent()) == "Yes" ? "No" : "Yes";
        await this.faceAttendanceField.click();
        await this.page.getByRole('listitem').filter({ hasText: new RegExp(`^${faceAttendance}`) }).click();
        await this.qrAttendanceField.click();
        await this.page.getByRole('listitem').filter({ hasText: new RegExp(`^${qrAttendance}`) }).click();
        await this.save();
        await this.openEditModal();
        const finalFaceAttendance = await this.faceAttendanceField.getByText(/.*/).first().textContent()
        const finalQrAttendance = await this.qrAttendanceField.getByText(/.*/).first().textContent()
        expect(faceAttendance).toBe(finalFaceAttendance);
        expect(qrAttendance).toBe(finalQrAttendance);
    }

    async clearAllFields()
    {
        await this.mobileNumberField.clear();
        await this.emailField.clear();
        await this.categoryField.getByText('×').click();
        await this.statusField.getByText('×').click();
        await this.faceAttendanceField.getByText('×').click();
        await this.qrAttendanceField.getByText('×').click();
    }

    async verifyEmptyFields()
    {
        const REQUIRED_MESSAGES = [
            "Mobile number is required",
            "Email is required",
            "User category is required",
            "User Status is required",
            "Face Attendance is required",
            "QR Attendance is required"
        ];
        await this.save();
        for (const message of REQUIRED_MESSAGES) {
            const messageLocator = this.page.locator(`text="${message}"`);
            await this.assert({
                locator: messageLocator,
                state: 'visible',
                alias: `Validation Message: ${message}`
            });
        }
    }
}