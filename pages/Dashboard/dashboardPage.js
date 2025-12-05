import { expect } from "@playwright/test";
import BasePage from "../BasePage";
import { 
  getRowsAsArray, 
  getSplitTableColumnData, 
  getTableColumnData 
} from "../../utils/tableHelper";

export class DashboardPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
// TABLE ELEMENTS
    this.currentLeaveBalanceTable = page
      .getByRole("cell", { name: "Remaining Leave" })
      .locator("xpath=ancestor::table[1]");

    this.searchInputCurrentLeaveTable =
      this.page.getByRole("textbox", { name: "Search" }).nth(2);

    this.currentLeaveColumns = [
      { name: "employeeName", index: 1, splitIndex: 1 },
      { name: "branch", index: 1, splitIndex: 2 },
      { name: "designation", index: 2 },
      { name: "leaveGroup", index: 3 },
      { name: "remainingLeave", index: 4 },
      { name: "leaveTaken", index: 5 },
    ];
// COMPONENT LOCATORS
    this.onleaveTodayText = page.getByText("On leave today");
    this.onleaveTomorrowText = page.getByText("On leave tomorrow");
    this.pendingLeaveApplicationText = page.getByText("Pending Leave Application");
    this.pendingBreakTimeRecon = page.getByText("Pending Break Time Recon.");
    this.upcomingBirthdaysText = page.getByText("Upcoming Birthdays");
    this.pendingAttendanceApprovalText = page.getByText("Pending Attendance Approval");
    this.monthlyClaimAmountText = page.getByText("Monthly Claim Amount");
    this.monthlyDisburseAmountText = page.getByText("Monthly Disburse Amount");
    this.pendingAttendanceReconText = page.getByText("Pending Attendance Recon.");
    this.onvisittodayText = page.getByText("On visit today");
    this.onvisittomorrowText = page.getByText("On visit tomorrow");
    this.pendingVisitApplicationText = page.getByText("Pending Visit Application");
    this.onBreakNowText = page.getByText("On Break Now");
    this.statusToBeEffectiveText = page.locator("div").filter({
      hasText: /^Status To Be Effective$/,
    });
    this.pendingAdvanceSalaryText = page.getByText("Pending Advance Salary");
    this.pendingProfileImageText = page.getByText("Pending Profile Image");
    this.quickViewText = page.getByText("Quick View");
    this.claimAmountText = page.locator("text").filter({ hasText: "Claim Amount" });
    this.nameText = page.getByText("Name").nth(1);
    this.designationText = page.getByText("Designation").nth(4);
    this.leaveGroupText = page.getByRole("cell", { name: "Leave Group" }).locator("span");
    this.remainingLeaveText = page.getByText("Remaining Leave");
    this.leaveTakenText = page.getByText("Leave Taken");
    this.attendanceMissedText = page.getByText("Attendance Missed");
    this.dateText = page.getByText("Date", { exact: true });
    this.inTimeText = page.getByText("In Time").nth(1);
    this.outTimeText = page.getByText("Out Time").nth(1);
    this.actionText = page.getByText("Action").nth(1);
    this.leaveCalendarText = page.getByText("Leave Calendar");
  }

  // Api Calls for Dashboard Page
  async dashboardAllApis() {
    await Promise.all([
      this.waitForAndVerifyApi("validSubdomainApi", "GET", /is-valid-subdomain/),
      this.waitForAndVerifyApi("userSessionApi", "GET", /user-sessions/),
      this.waitForAndVerifyApi("notificationsApi", "GET", /notifications/),
      this.waitForAndVerifyApi("widgetsApi", "GET", /dashboard\/widgets/),
      this.waitForAndVerifyApi("userQuickLinksApi", "GET", /users\/user-quick-links/),
      this.waitForAndVerifyApi("wingSliApi", "GET", /wings\/wing-sli/),
      this.waitForAndVerifyApi("cardWiseSummariesApi", "GET", /dashboard\/card-wise-summaries/),
      this.waitForAndVerifyApi("todayAttendancesApi", "GET", /today-attendances/),
      this.waitForAndVerifyApi("monthWiseClaimInformationApi", "GET", /month-wise-claim-information/),
      this.waitForAndVerifyApi("attendanceSummariesbyDateRangeApi", "GET", /attendance-summaries-by-date-range/),
      this.waitForAndVerifyApi("noticeApi", "GET", /dashboard\/notices/),
      this.waitForAndVerifyApi("branchesDropdownApi", "GET", /branches\/dropdown/),
      this.waitForAndVerifyApi("departmentSliApi", "GET", /departments\/department-sli/),
      this.waitForAndVerifyApi("employeeCurrentLeaveStatusApi", "GET", /employee-current-leave-status/),
      this.waitForAndVerifyApi("missedAttendancesApi", "GET", /missed-attendances/),
      this.waitForAndVerifyApi("leaveTypesDropdownApi", "GET", /leave-types\/dropdown/),
      this.waitForAndVerifyApi("dashboardsLeaveCalendarApi", "GET", /leave-calendar/),
      this.page.reload({ waitUntil: "networkidle" }),
    ]);
  }
   // COMPONENT CHECK FUNCTIONS

  async dashboardComponentCheck() {
    await this.scrollToTop();

    const items = [
      { locator: this.onleaveTodayText, alias: "On leave today" },
      { locator: this.onleaveTomorrowText, alias: "On leave tomorrow" },
      { locator: this.pendingLeaveApplicationText, alias: "Pending Leave Application" },
      { locator: this.pendingBreakTimeRecon, alias: "Pending Break Time Recon." },
      { locator: this.upcomingBirthdaysText, alias: "Upcoming Birthdays" },
      { locator: this.pendingAttendanceApprovalText, alias: "Pending Attendance Approval" },
      { locator: this.monthlyClaimAmountText, alias: "Monthly Claim Amount" },
      { locator: this.monthlyDisburseAmountText, alias: "Monthly Disburse Amount" },
      { locator: this.pendingAttendanceReconText, alias: "Pending Attendance Recon." },
      { locator: this.onvisittodayText, alias: "On visit today" },
      { locator: this.onvisittomorrowText, alias: "On visit tomorrow" },
      { locator: this.pendingVisitApplicationText, alias: "Pending Visit Application" },
      { locator: this.onBreakNowText, alias: "On Break Now" },
      { locator: this.statusToBeEffectiveText, alias: "Status To Be Effective" },
      { locator: this.pendingAdvanceSalaryText, alias: "Pending Advance Salary" },
      { locator: this.pendingProfileImageText, alias: "Pending Profile Image" },
      { locator: this.quickViewText, alias: "Quick View" },
      { locator: this.claimAmountText, alias: "Claim Amount" },
      { locator: this.nameText, alias: "Name" },
      { locator: this.designationText, alias: "Designation" },
      { locator: this.inTimeText, alias: "In Time" },
      { locator: this.outTimeText, alias: "Out Time" },
      { locator: this.actionText, alias: "Action" },
      { locator: this.attendanceMissedText, alias: "Attendance Missed" },
      { locator: this.leaveGroupText, alias: "Leave Group" },
      { locator: this.remainingLeaveText, alias: "Remaining Leave" },
      { locator: this.leaveTakenText, alias: "Leave Taken" },
      { locator: this.leaveCalendarText, alias: "Leave Calendar" },
    ];

    for (const el of items) {
      await this.assertWithScroll({
        locator: { default: el.locator },
        state: "visible",
        alias: `${el.alias} visible`,
      });
    }
  }

// TABLE FUNCTIONS
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
    return await getRowsAsArray(
      this.currentLeaveBalanceTable,
      this.currentLeaveColumns,
      allRows
    );
  }

  async applySearchInCurrentLeaveTable(searchText) {
    await this.searchInputCurrentLeaveTable.fill(searchText);
    await this.page.waitForTimeout(1000);
  }

  async branchFilterInCurrentLeaveTable(branchName) {
    await this.page.getByPlaceholder("Branch").first().click();
    await this.page
      .getByRole("listitem")
      .filter({ hasText: new RegExp(`^${branchName}$`) })
      .click();
    await this.page.waitForTimeout(1000);
  }

  async getAllImagesFromCurrentLeaveTable() {
    const images = this.currentLeaveBalanceTable.locator("tbody tr td img");
    const count = await images.count();

    if (count === 0) return [];

    const result = [];
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const info = await img.evaluate((el) => ({
        outerHTML: el.outerHTML,
        src: el.src,
        alt: el.alt,
        loaded: el.complete && el.naturalWidth > 0,
        width: el.naturalWidth,
        height: el.naturalHeight,
      }));
      result.push(info);
    }
    return result;
  }

  async verifyEmployeeLeaveData(responseData) {
    const apiEmployees = responseData.data;
    const apiMap = new Map();

    apiEmployees.forEach((emp) => {
      apiMap.set(emp.employee_name.trim(), emp);
    });

    const tableRows = await this.getAllCurrentLeaveTableRows();

    tableRows.forEach((row) => {
      const apiEmp = apiMap.get(row.employeeName);
      if (apiEmp) {
        expect(row.branch).toBe(apiEmp.branch_name);
        expect(row.designation).toBe(apiEmp.designation_name);
        expect(row.leaveGroup).toBe(apiEmp.leave_group_name);
      }
    });
  }

}
