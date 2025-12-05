import BasePage from '../../BasePage.js';

export class leaveDashboardPage extends BasePage {
    constructor(page, context) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.dateSelector = '//span[contains(@class,"min-w-40") and contains(@class,"text-center") and contains(@class,"font-semibold")]';
    }
    async getDisplayedDate() {
        const text = await this.page.textContent(`xpath=${this.dateSelector}`);
        return text ? text.trim() : '';
    }
    async leaveDashboardMonthYearValidation() {
        const displayedDate = await this.getDisplayedDate();
        const currentDate = new Date();
        const expectedDate = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

        console.log('Displayed Date:', displayedDate);
        console.log('Expected Date:', expectedDate);

        if (displayedDate !== expectedDate) {
            throw new Error(`Displayed date "${displayedDate}" does not match expected date "${expectedDate}"`);
        }
    }
}
