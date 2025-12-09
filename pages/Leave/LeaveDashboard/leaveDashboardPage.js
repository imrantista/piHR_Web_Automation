import BasePage from "../../BasePage.js";
import { expect } from '@playwright/test'; 

export class leaveDashboardPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;

    // ---- COMPONENT LOCATORS ----
    this.pageTitle = page.getByRole('heading', { name: 'Dashboard' });
    this.leaveCalendarTitle = page.getByText('Leave Calendar');
    this.leaveTypeDropDown = page.getByPlaceholder('Leave Type');
    this.branchDropDown = page.locator('div.relative.w-full:nth-of-type(2)').getByPlaceholder('Branch');
    this.departmentDropDown = page.locator('div.relative.w-full:nth-of-type(3)').getByPlaceholder('Department');
    this.monthYearTitle = page.getByText('December 2025');
    this.previousArrow = page.locator('svg').filter({has: page.locator('path[d="M15.8332 10H4.1665M4.1665 10L9.99984 15.8334M4.1665 10L9.99984 4.16669"]')});
    this.nextArrow = page.locator('svg').filter({has: page.locator('path[d="M4.1665 10H15.8332M15.8332 10L9.99984 4.16669M15.8332 10L9.99984 15.8334"]')});
    this.currentLeaveBalanceText = page.getByText('Current Leave Balance');
    this.monthlyLeaveApplicationStatusText = page.getByText('Monthly Leave Application');
    this.monthWiseLeaveApplicationStatusText = page.getByText('Month Wise Leave Application');
    this.yearlyLeaveApprovalStatusText = page.getByText('Yearly Leave Approval Status');

    // ---- CALENDAR / HOLIDAY LOCATORS ----
    this.holidayCells = page.locator('td[style*="background-color: rgb(152, 162, 179);"]');
    this.holidayLabels = page.locator('.text-sm.text-gray-600');
    this.todayHighlightSelector = 'td[style*="background-color: rgb(193, 208, 255)"]';

    // ---- LEAVE DAYS ----
    this.leaveDays = 'td.relative';

    // ---- EMPLOYEE MODAL ----
    this.employeeImages = 'td div.flex img';
    this.avatarList = 'div.avatar-list';           // popover after first click
    this.avatarListItem = 'div.avatar-list img';  // individual avatars in popover
    this.modal = 'div.w-max.absolute.bg-white.rounded-lg';                     // employee details modal
    this.modalContent = 'div.modal-content';      // content inside modal

    //Month year selector
    this.dateSelector = '//span[contains(@class,"min-w-40") and contains(@class,"text-center") and contains(@class,"font-semibold")]';
  }

  // 📌 API VALIDATION
  async leaveDashboardAllApis() {
    await Promise.all([
        this.waitForAndVerifyApi("validSubdomainApi", "GET", /is-valid-subdomain/),
    this.waitForAndVerifyApi("userSessionApi", "GET", /user-sessions/),
    this.waitForAndVerifyApi("notificationsApi", "GET", /my-dashboard\/notifications/),
    this.waitForAndVerifyApi("userQuickLinksApi", "GET", /users\/user-quick-links/),
    this.waitForAndVerifyApi("wingSliApi", "GET", /wings\/wing-sli/),
    this.waitForAndVerifyApi("dropDownApiLeaveType", "GET", /leave-types\/dropdown/),
    this.waitForAndVerifyApi("dropDownApiBranches", "GET", /branches\/dropdown/),
    this.waitForAndVerifyApi("departmentSliApi", "GET", /departments\/department-sli/),
    this.waitForAndVerifyApi("dashboardsLeaveCalendarApi", "GET", /leave-calendar/),
    this.waitForAndVerifyApi("employeeCurrentLeaveStatusApi", "GET", /leave-dashboards\/employee-current-leave-status/),
    this.waitForAndVerifyApi("monthlyLeaveAPI", "GET", /monthly-leave-application/),
    this.waitForAndVerifyApi("monthWiseLeaveApi", "GET", /month-wise-leave-application/),
    this.waitForAndVerifyApi("yearlyLeaveApi", "GET", /yearly-leave-approval/),
    this.page.reload({ waitUntil: "networkidle" }),
    ]);
  }
  // 📌 COMPONENT VALIDATION
  async leaveComponentCheck() {
    await this.scrollToTop();

    const elements = [
      { locator: this.pageTitle, alias: 'Dashboard Title visible' },
      { locator: this.leaveCalendarTitle, alias: 'Leave Calendar Title visible' },
      { locator: this.leaveTypeDropDown, alias: 'Leave Type dropdown visible' },
      { locator: this.branchDropDown, alias: 'Branch dropdown visible' },
      { locator: this.departmentDropDown, alias: 'Department dropdown visible' },
      { locator: this.monthYearTitle, alias: 'Month-Year title visible' },
      { locator: this.previousArrow, alias: 'Previous Calendar Arrow visible' },
      { locator: this.nextArrow, alias: 'Next Calendar Arrow visible' },
      { locator: this.currentLeaveBalanceText, alias: 'Current Leave Balance visible' },
      { locator: this.monthlyLeaveApplicationStatusText, alias: 'Monthly Leave Application visible' },
      { locator: this.monthWiseLeaveApplicationStatusText, alias: 'Month Wise Leave Application visible' },
      { locator: this.yearlyLeaveApprovalStatusText, alias: 'Yearly Leave Approval Status visible' },
    ];

    for (const el of elements) {
      try {
        await this.assertWithScroll({
          locator: { default: el.locator },
          state: 'visible',
          alias: el.alias,
        });
      } catch (error) {
        console.error(`❌ Failed to find element: ${el.alias}`);
        throw error;
      }
    }
  }

  // 📌 HOLIDAY / CALENDAR ACTIONS
  async getHolidayCount() {
    return await this.holidayCells.count();
  }

  async getHolidayLabels() {
    return await this.holidayLabels.allTextContents();
  }

  // 📌 TODAY HIGHLIGHT VALIDATION
  async verifyTodayHighlight() {
    const today = new Date();
    const todayFormatted = `${today.getDate()} ${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`;

    const todayHighlight = this.page.locator(this.todayHighlightSelector);
    await todayHighlight.waitFor({ state: 'visible' });

    const count = await todayHighlight.count();
    if (count !== 1) throw new Error(`Highlighted cell count mismatch. Found ${count}`);

    const highlightedText = (await todayHighlight.textContent()).trim();
    const highlightedDate = parseInt(highlightedText, 10);

    if (highlightedDate === today.getDate()) {
      console.log(`🎉 PASS: Highlighted date matches today's system date! ${todayFormatted}`);
    } else {
      throw new Error(`❌ FAIL: Highlighted date does NOT match today. Expected ${todayFormatted}, Found ${highlightedText}`);
    }
  }

  // 📌 DAY-WISE LEAVE COUNTS WITH ACTUAL DATES
  async getLeaveCountsPerDay() {
    const dayCells = await this.page.$$(this.leaveDays);
    const leaveCounts = [];

    const monthYearText = await this.monthYearTitle.textContent();
    const [displayMonth, displayYear] = monthYearText.trim().split(' ');

    for (const cell of dayCells) {
      const dayText = (await cell.textContent()).trim();
      if (!dayText) continue;

      const dayNumber = parseInt(dayText, 10);
      const isCurrentMonth = await cell.evaluate(node => !node.classList.contains('text-gray-400'));

      let month = displayMonth;
      let year = parseInt(displayYear, 10);

      if (!isCurrentMonth) {
        if (dayNumber > 15) {
          const prevMonth = new Date(year, new Date(`${displayMonth} 1`).getMonth(), 0);
          month = prevMonth.toLocaleString('default', { month: 'long' });
          year = prevMonth.getFullYear();
        } else {
          const nextMonth = new Date(year, new Date(`${displayMonth} 1`).getMonth() + 1, 1);
          month = nextMonth.toLocaleString('default', { month: 'long' });
          year = nextMonth.getFullYear();
        }
      }

      const leaveCount = await cell.evaluate(node => node.querySelectorAll('img').length);
      leaveCounts.push({ date: `${dayNumber} ${month} ${year}`, leaveCount });
    }

    return leaveCounts;
  }

  async getLeaveCountForDay(index) {
    const dayCells = await this.page.$$(this.leaveDays);
    if (index < 1 || index > dayCells.length) return { date: null, leaveCount: 0 };

    const cell = dayCells[index - 1];
    const dayText = (await cell.textContent()).trim();
    const dayNumber = parseInt(dayText, 10);

    const monthYearText = await this.monthYearTitle.textContent();
    const [displayMonth, displayYear] = monthYearText.trim().split(' ');

    const isCurrentMonth = await cell.evaluate(node => !node.classList.contains('text-gray-400'));

    let month = displayMonth;
    let year = parseInt(displayYear, 10);

    if (!isCurrentMonth) {
      if (dayNumber > 15) {
        const prevMonth = new Date(year, new Date(`${displayMonth} 1`).getMonth(), 0);
        month = prevMonth.toLocaleString('default', { month: 'long' });
        year = prevMonth.getFullYear();
      } else {
        const nextMonth = new Date(year, new Date(`${displayMonth} 1`).getMonth() + 1, 1);
        month = nextMonth.toLocaleString('default', { month: 'long' });
        year = nextMonth.getFullYear();
      }
    }

    const leaveCount = await cell.evaluate(node => node.querySelectorAll('img').length);
    return { date: `${dayNumber} ${month} ${year}`, leaveCount };
  }

  // 📌 RANDOM EMPLOYEE MODAL ACTIONS
  async openRandomEmployeeModal() {
    // Click a random avatar in calendar
    const mainAvatars = this.page.locator(this.employeeImages);
    const count = await mainAvatars.count();
    if (count === 0) throw new Error("No main avatars found!");
    const randomIndex = Math.floor(Math.random() * count);
    await mainAvatars.nth(randomIndex).click({ timeout: 5000 });

    // If popover exists, click a random avatar inside it
    const popover = this.page.locator(this.avatarList);
    if (await popover.isVisible({ timeout: 3000 }).catch(() => false)) {
        const popoverAvatars = this.page.locator(this.avatarListItem);
        const popoverCount = await popoverAvatars.count();
        if (popoverCount > 0) {
            const randomPopoverIndex = Math.floor(Math.random() * popoverCount);
            await popoverAvatars.nth(randomPopoverIndex).click({ timeout: 5000 });
        }
    }

    // Wait for employee details modal
    const modal = this.page.locator(this.modal);
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    await expect(modal).toBeVisible();
}

  // 📌 MONTH-YEAR VALIDATION
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
