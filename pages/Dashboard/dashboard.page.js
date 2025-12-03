import { getRowsAsArray, getSplitTableColumnData, getTableColumnData } from '../../utils/tableHelper';
import BasePage from '../BasePage';
export class DashboardPage extends BasePage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.currentLeaveBalanceTable = page.getByRole('cell', { name: 'Remaining Leave' }).locator('xpath=ancestor::table[1]');
        this.searchInputCurrentLeaveTable = this.page.getByRole('textbox', { name: 'Search' }).nth(2);
        this.currentLeaveColumns = [
            { name: 'employeeName', index: 1, splitIndex: 1 },
            { name: 'branch', index: 1, splitIndex: 2 },
            { name: 'designation', index: 2 },
            { name: 'leaveGroup', index: 3 },
            { name: 'remainingLeave', index: 4 },
            { name: 'leaveTaken', index: 5 },
        ];
    }

    async getCurrentLeaveTableData(index, allRows = false) {
        return await getTableColumnData(this.currentLeaveBalanceTable, index, allRows);
    }

    async getNameFromCurrentLeaveTable(allRows = false) {
        return await getSplitTableColumnData(this.currentLeaveBalanceTable, 1, 1, allRows);
    }

    async getBranchFromCurrentLeaveTable(allRows = false) {
        return await getSplitTableColumnData(this.currentLeaveBalanceTable, 1, 2, allRows);
    }

    async getAllCurrentLeaveTableRows(allRows = true) {
        return await getRowsAsArray(this.currentLeaveBalanceTable, this.currentLeaveColumns, allRows);
    }

    async applySearchInCurrentLeaveTable(searchText) {
        await this.searchInputCurrentLeaveTable.fill(searchText);
        await this.page.waitForTimeout(1000); // Wait for table to refresh
        console.log(`Applied search in Current Leave Table: ${searchText}`);
    }

    async branchFilterInCurrentLeaveTable(branchName) {
        await this.page.getByPlaceholder('Branch').first().click();
        await this.page
            .getByRole('listitem')
            .filter({ hasText: new RegExp(`^${branchName}$`) })
            .click();
        await page.waitForTimeout(1000); // wait for table to refresh
        console.log(`Applied branch filter in Current Leave Table: ${branchName}`);
    }

    async getAllImagesFromCurrentLeaveTable() {
        const imageElements = this.currentLeaveBalanceTable.locator('tbody tr td img');
        const imageCount = await imageElements.count();
        // Safe check: if no images, return empty array
        if (imageCount === 0) {
            console.log('⚠️ No employee images found in the table.');
            return [];
        }
        const imagesInfo = [];
        for (let i = 0; i < imageCount; i++) {
            const img = imageElements.nth(i);

            // Evaluate in page context
            const info = await img.evaluate((el) => ({
                outerHTML: el.outerHTML,         // full <img> element HTML
                src: el.src,                      // image src
                alt: el.alt,                      // alt text
                loaded: el.complete && el.naturalWidth > 0, // image loaded successfully
                width: el.naturalWidth,
                height: el.naturalHeight,
            }));

            imagesInfo.push(info);
        }

        return imagesInfo;
    }
}