import { config, invalidMobileNumbers } from "../../../config/testConfig";
import { allAdmin, test } from "../../../utils/sessionUse";
import { generateEditUserData, generateUniqueUser } from "../../../utils/userGenerator";
import { Desktop, setViewport } from "../../../utils/viewports";

const viewports = [Desktop];


test.describe("Manage User", async () => {
    for (const role of allAdmin) {
        test.beforeEach(async ({ page, loginPage, useSession }) => {
            await setViewport(page, Desktop.size);
            await useSession(role);
            await loginPage.visit(config.slug.manageUser);
        })
        test(`${role} - Verify the Manage User list UI elements: @regression Settings-1001`, async ({ page, manageUser }) => {
            await manageUser.verifyManageUserUIElements();
        });

        test(`${role} - Verify the user list loads with all required columns : @regression Settings-1002`, async ({ page, manageUser }) => {
            await manageUser.verifyTableColumns();
        });

        test(`${role} - Verify that searching by user name returns correct results.: @regression Settings-1003`, async ({ page, manageUser }) => {
            const userName = await manageUser.getUserName();
            await manageUser.applySearch(userName);
            await manageUser.verifySearchByName(userName);
        });

        test(`${role} - Verify Search using Email, Employee Code & Mobile Number : @regression Settings-1004`, async ({ page, manageUser }) => {
            await manageUser.verifySearchByEmail();
            await manageUser.verifySearchByMobile();
            await manageUser.verifySearchByEmployeeCode();
        });

        test(`${role} - Verify Pagination functionality : @regression @smoke Settings-1005`, async ({ manageUser }) => {
            await manageUser.verifyPaginationFunctionality();
        });

        test(`${role} - Verify 'Items per page' dropdown : @regression @smoke Settings-1006`, async ({ page, manageUser }) => {
            await manageUser.verifyItemPerPage()
        });

        test(`${role} - Verify Add New User button visibility and navigation : @regression @smoke Settings-1007`, async ({ page, manageUser }) => {
            await manageUser.OpenAddNewModal();
            await manageUser.verifyAddNewModal();
        });

        test(`${role} - Verify Add New User form UI elements : @regression Settings-1008`, async ({ manageUser, addNewUser }) => {
            await addNewUser.OpenAddNewModal();
            await addNewUser.verifyAddUserModalElements();
        });

        test(`${role} - Verify required field validation messages in the Add User popup : @regression Settings-1009`, async ({ page, manageUser, addNewUser }) => {
            await addNewUser.OpenAddNewModal();
            await addNewUser.saveUserModal();
            await addNewUser.verifyRequiredFieldValidationMessages();
        });

        test(`${role} - Verify successful Add User with valid input data : @regression Settings-1010`, async ({ page, addNewUser }) => {
            const newUser = generateUniqueUser();
            await addNewUser.addUniqueUser(newUser);
            await addNewUser.verifyAddUserSuccess();
        });

        test(`${role} - Verify Enter User Name field validation in the Add User popup : @regression Settings-1011`, async ({ page, addNewUser }) => {
            await addNewUser.verifyUsernameValidation();
        });

        test(`${role} - Verify email format validation in the Add User popup : @regression Settings-1012`, async ({ page, addNewUser }) => {
            await addNewUser.verifyEmailValidation();
        });

        test(`${role} - Verify Mobile number validation in the Add User popup : @regression Settings-1013`, async ({ page, addNewUser }) => {
            await addNewUser.verifyMobileNumberValidation();
        });

        test(`${role} - Verify Edit User popup UI elements and preloaded user data : @regression Settings-1014`, async ({ page, manageUser, editUser }) => {
            await manageUser.openEditModal();
            await manageUser.verifyEditModal();
            await editUser.verifyPrefilledData();
        });

        test(`${role} - Verify successful user update with valid input data : @regression Settings-1015`, async ({ page, manageUser, editUser }) => {
            const newUser = generateEditUserData();
            await manageUser.openEditModal();
            await editUser.updateUserData(newUser);
            await editUser.verifyEditUserSuccess();
        });

        test(`${role} - Verify duplicate email restriction during user update : @regression Settings-1016`, async ({ page, manageUser, editUser }) => {
            const email = await manageUser.getUserEmail(2);
            await editUser.verifyDuplicateEmail(email);
        });

        test(`${role} - Verify duplicate mobile number restriction during user update : @regression Settings-1017`, async ({ page, manageUser, editUser }) => {
            const mobileNumber = await manageUser.getUserMobileNumber(2);
            await editUser.verifyDuplicateMobileNumber(mobileNumber);
        });

        test(`${role} - Verify Cancel button functionality on Edit User popup : @regression Settings-1018`, async ({ page, manageUser, editUser }) => {
            await editUser.verifyEditCancelled();
        });

        test(`${role} - Verify Edit User does not allow invalid mobile number : @regression Settings-1019`, async ({ page, manageUser, editUser }) => {
            await editUser.openEditModal();
            for (const number of invalidMobileNumbers) {
                await editUser.verifyInvalidMobileNumber(number);
            }
        });

        test(`${role} - Verify status change (Active ↔ Inactive) through Edit User : @regression Settings-1020`, async ({ page, manageUser, editUser }) => {
            await editUser.verifyStatusChange();
        });

        test(`${role} - Verify Edit User does not allow invalid email format : @regression Settings-1021`, async ({ page, manageUser, editUser }) => {
            await editUser.verifyInvalidEmail();
        });

        test(`${role} - Verify Face Attendance & QR Attendance update functionality : @regression Settings-1022`, async ({ page, manageUser, editUser }) => {
            await editUser.verifyAttendanceChange();
        });

        test(`${role} - Verify Edit User popup does not allow empty required fields : @regression Settings-1023`, async ({ page, manageUser, editUser }) => {
            await editUser.openEditModal();
            await editUser.clearAllFields();
            await editUser.verifyEmptyFields();
        });

        test(`${role} - Verify Screen Permission popup UI elements and module listing : @regression Settings-1024`, async ({ page, screenPermission }) => {
            await screenPermission.openScreenPermission();
            await screenPermission.verifyScreenPermission();
        });
    }
});