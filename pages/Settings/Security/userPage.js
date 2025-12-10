import { expect } from "@playwright/test";
import BasePage from "../../BasePage";
import { getRowsAsArray } from "../../../utils/tableHelper";

export class ManageUserPage extends BasePage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.searchField = page.getByRole('textbox', { name: 'Search', exact: true });
        this.addNewUserButton = page.getByRole('button', { name: 'Add new' });
        this.manageUserHeading = page.getByRole('heading', { name: 'Manage User' });
        this.itemsPerPage = page.getByText('Items per page');
        this.userTable = page.getByRole('table');
        this.paginationWrapper = page.locator('.paginationWrapper');
        this.paginationPreviousBtn = this.paginationWrapper.locator('.paginationPrevBtn button');
        this.paginationNextBtn = this.paginationWrapper.locator('.paginationNextBtn button');
        this.perPageDropDownWrapper = this.page.locator('.perPageDropDownWrapper');
        this.addUserHeading = page.getByRole('heading', { name: 'Add User' });
        this.editBtn = page.getByRole('listitem').filter({ hasText: 'Edit' })
        this.screenPermission = page.getByText('Screen permission', { exact: true })
        this.editUserHeading = page.getByRole('heading', { name: 'Update User' });
        this.columns = [
            { name: 'userName', index: 1 },
            { name: 'category', index: 2 },
            { name: 'employeeCode', index: 3 },
            { name: 'email', index: 4 },
            { name: 'mobile', index: 5 },
            { name: 'branch', index: 6 },
            { name: 'status', index: 7 },
        ]
    }

    async verifyManageUserUIElements() {
        const elements =
            [
                { locator: this.searchField, alias: 'Search Field visible' },
                { locator: this.addNewUserButton, alias: 'Add New User Button visible' },
                { locator: this.manageUserHeading, alias: 'Manage User Heading visible' },
                { locator: this.itemsPerPage, alias: 'Items Per Page visible' },

            ]
        await this.scrollToTop();
        for (const el of elements) {
            await this.assert({ locator: { default: el.locator }, state: 'visible', alias: el.alias });
        }
    }

    async verifyTableColumns() {
        const REQUIRED_COLUMNS = [
            "User Name",
            "Category",
            "Employee Code",
            "Email",
            "Mobile",
            "Branch",
            "Status",
            "Action"
        ];
        await this.assert({ locator: this.userTable, state: 'visible', alias: 'User Table' })
        for (const column of REQUIRED_COLUMNS) {
            const headerLocator = this.userTable.locator('th', { hasText: column });
            await this.assert({ locator: headerLocator, state: 'visible', alias: `Table Column: ${column}` });
        }
    }

    async applySearch(searchText) {
        await this.waitAndFill(this.searchField, searchText, "Search Field");
        await this.page.waitForTimeout(1000);
    }


    async verifyPaginationFunctionality() {
        const firstPageRows = await this.userTable.locator('tbody tr').allTextContents();
        await this.expectAndClick(this.paginationNextBtn, "Next Button", "manageUserApi:GET");
        const secondPageRows = await this.userTable.locator('tbody tr').allTextContents();
        if (JSON.stringify(firstPageRows) === JSON.stringify(secondPageRows)) {
            throw new Error('Table content did not change after clicking Next page');
        }
        await this.expectAndClick(this.paginationPreviousBtn, "Previous Button")

        const backToFirstPageRows = await this.userTable.locator('tbody tr').allTextContents();
        if (JSON.stringify(firstPageRows) !== JSON.stringify(backToFirstPageRows)) {
            throw new Error('Table content did not restore after clicking Previous page');
        }
        console.log("Next and Previous buttons are working correctly");
    }

    async changeItemsPerPage(row) {
        await this.perPageDropDownWrapper.click();
        await this.page.getByRole('listitem')
            .filter({ hasText: new RegExp(`^${row}$`) })
            .click();
    }

    async verifyItemPerPage() {
        const itemsPerPage = [5, 10, 20, 50, 100];
        for (const item of itemsPerPage) {
            await this.changeItemsPerPage(item);
            await this.page.screenshot({ path: `./test_${item}.png` })
            await this.page.waitForTimeout(1000)
            const count = await this.userTable.locator('tbody tr').count();
            expect(count).toBe(item)
        }
    }

    async OpenAddNewModal() {
        await this.addNewUserButton.click();
    }

    async verifyAddNewModal() {
        await this.assert({ locator: { default: this.addUserHeading }, state: 'visible', alias: "Add User Heading" });
    }


    async getUserTableCount() {
        return await this.userTable.locator('tbody tr').count();
    }

    async openEditModal() {
        const rowCount = await this.getUserTableCount();
        if (rowCount < 1) {
            throw new Error("No user to edit");
        }

        // Get the first row
        const firstRow = this.userTable.locator('tbody tr').first();
        await firstRow.getByRole('cell').last().click();

        await this.expectAndClick(this.editBtn, "Edit Button");
    }

    async verifyEditModal() {
        await this.assert({ locator: { default: this.editUserHeading }, state: 'visible', alias: "Edit User Heading" });
    }

    async getUserEmail(index = 1) {
        const rowCount = await this.getUserTableCount();
        if (rowCount < index) {
            throw new Error("No data found");
        }

        const row = this.userTable.locator('tbody tr').nth(index - 1);
        const email = await row.getByRole('cell').nth(3).textContent();
        return email;

    }

    async getUserMobileNumber(index = 1) {
        const rowCount = await this.getUserTableCount();
        if (rowCount < index) {
            throw new Error("No data found");
        }
        const row = this.userTable.locator('tbody tr').nth(index - 1);
        const mobile = await row.getByRole('cell').nth(4).textContent();
        return mobile;
    }

    async getRow(allRows = false) {
        const rows = await getRowsAsArray(this.userTable, this.columns, allRows);
        if (rows.length === 0) {
            throw new Error("No data found");
        }
        return rows;
    }


    async openScreenPermission() {
        const rowCount = await this.getUserTableCount();
        if (rowCount < 1) {
            throw new Error("No user to edit");
        }

        // Get the first row
        const firstRow = this.userTable.locator('tbody tr').first();
        await firstRow.getByRole('cell').last().click();

        await this.expectAndClick(this.screenPermission, "Screen Permission");
    }

    async getUserName(index = 1) {
        const rowCount = await this.getUserTableCount();
        if (rowCount < index) {
            throw new Error("No data found");
        }
        const row = this.userTable.locator('tbody tr').nth(index - 1);
        const userName = await row.getByRole('cell').nth(0).textContent();
        return userName;
    }

    async verifySearchByName(searchedName) {
        const rows = await this.getRow(true);
        for (const row of rows) {
            expect(row.userName).toBe(searchedName);
        }
    }


    async verifySearchByEmail() {
        const searchedEmail = await this.getUserEmail();
        await this.applySearch(searchedEmail);
        const rows = await this.getRow(true);
        for (const row of rows) {
            expect(row.email).toBe(searchedEmail);
        }
    }

    async verifySearchByMobile() {
        await this.applySearch('');
        const searchedMobile = await this.getUserMobileNumber();
        await this.applySearch(searchedMobile);
        const rows = await this.getRow(true);
        for (const row of rows) {
            expect(row.mobile).toBe(searchedMobile);
        }
    }
    async verifySearchByEmployeeCode() {
        await this.applySearch('');
        await this.changeItemsPerPage(100);
        await this.page.waitForTimeout(1000);
        const rows = await this.getRow(true); 

        let searchedCode = null;

        for (const row of rows) {
            if (row.employeeCode.trim() !== '-') {
                searchedCode = row.employeeCode;
                break;
            }
        }

        if (!searchedCode) {
            throw new Error('No valid employee code found to search');
        }
        await this.applySearch(searchedCode);

        const filteredRows = await this.getRow(true);
        expect(filteredRows.length).toBe(1);
        for (const row of filteredRows) {
            expect(row.employeeCode).toBe(searchedCode);
        }
    }

}