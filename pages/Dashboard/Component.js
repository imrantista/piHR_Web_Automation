import BasePage from '../BasePage';
export class ComponentPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.onleaveTodayText = page.getByText("On leave today");
    this.onleaveTomorrowText = page.getByText("On leave tomorrow");
    this.pendingLeaveApplicationText = page.getByText("Pending Leave Application");
    this.pendingBreakTimeRecon = page.getByText('Pending Break Time Recon.');
    this.upcomingBirthdaysText = page.getByText("Upcoming Birthdays");
    this.pendingAttendanceApprovalText = page.getByText("Pending Attendance Approval");
    this.monthlyClaimAmountText = page.getByText("Monthly Claim Amount");
    this.monthlyDisburseAmountText = page.getByText("Monthly Disburse Amount");
    this.pendingAttendanceReconText = page.getByText("Pending Attendance Recon.");
    this.onvisittodayText = page.getByText("On visit today");
    this.onvisittomorrowText = page.getByText("On visit tomorrow");
    this.pendingVisitApplicationText = page.getByText("Pending Visit Application");
    this.onBreakNowText = page.getByText("On Break Now");
    this.statusToBeEffectiveText = page.locator('div').filter({ hasText: /^Status To Be Effective$/ });
    this.pendingAdvanceSalaryText = page.getByText("Pending Advance Salary");
    this.pendingProfileImageText = page.getByText("Pending Profile Image");
    this.quickViewText = page.getByText("Quick View");
    this.claimAmountText = page.locator('text').filter({ hasText: 'Claim Amount' })
    this.nameText = page.getByText('Name').first()
    this.designationText = page.getByText('Designation').nth(3);
    this.inTimeText = page.getByText("In Time").first();
    this.outTimeText = page.getByText("Out Time").first();
    this.statusText = page.getByText('Status', { exact: true });
    this.actionText = page.getByText("Action").first();
    this.attendanceSummaryText = page.getByText('Attendance Summary', { exact: true })
    this.noticeText = page.getByText('Notice', { exact: true });
    this.currentLeaveBalanceText = page.getByText('Current Leave Balance');
    this.nameText = page.getByText('Name').nth(1);
    this.designationText = page.getByText('Designation').nth(4);
    this.leaveGroupText = page.getByRole('cell', { name: 'Leave Group' }).locator('span');
    this.remainingLeaveText = page.getByText('Remaining Leave');
    this.leaveTakenText = page.getByText('Leave Taken');
    this.attendanceMissedText = page.getByText('Attendance Missed');
    this.dateText = page.getByText('Date', { exact: true });
    this.nameText = page.getByText('Name').nth(2);
    this.inTimeText = page.getByText("In Time").nth(1);
    this.outTimeText = page.getByText("Out Time").nth(1);
    this.actionText = page.getByText("Action").nth(1);
    this.currentLeaveBalanceText = page.getByText("Current Leave Balance").nth(1);
    this.leaveCalendarText = page.getByText("Leave Calendar");

  }
async componentCheckAdmin(){
  await this.scrollToTop();
    const elements = [
      { locator: this.onleaveTodayText, alias: 'On leave today Text visible' },
      { locator: this.onleaveTomorrowText, alias: 'On leave tomorrow Text visible' },
      { locator: this.pendingLeaveApplicationText, alias: 'Pending Leave Application Text visible' },
      { locator: this.pendingBreakTimeRecon, alias: 'Pending Break Time Recon. Text visible' },
      { locator: this.upcomingBirthdaysText, alias: 'Upcoming Birthdays Text visible' },
      { locator: this.pendingAttendanceApprovalText, alias: 'Pending Attendance Approval Text visible' },
      { locator: this.monthlyClaimAmountText, alias: 'Monthly Claim Amount Text visible' },
      { locator: this.monthlyDisburseAmountText, alias: 'Monthly Disburse Amount Text visible' },
      { locator: this.pendingAttendanceReconText, alias: 'Pending Attendance Recon. Text visible' },
      { locator: this.onvisittodayText, alias: 'On visit today Text visible' },
      { locator: this.onvisittomorrowText, alias: 'On visit tomorrow Text visible' },
      { locator: this.pendingVisitApplicationText, alias: 'Pending Visit Application Text visible' },
      { locator: this.onBreakNowText, alias: 'On Break Now Text visible' },
      { locator: this.statusToBeEffectiveText, alias: 'Status To Be Effective Text visible' },
      { locator: this.pendingAdvanceSalaryText, alias: 'Pending Advance Salary Text visible' },
      { locator: this.pendingProfileImageText, alias: 'Pending Profile Image Text visible' },
      { locator: this.quickViewText, alias: 'Quick View Text visible' },
      { locator: this.claimAmountText, alias: 'Claim Amount Text visible' },
      { locator: this.nameText, alias: 'Name Text visible' },
      { locator: this.designationText, alias: 'Designation Text visible' },
      { locator: this.inTimeText, alias: 'In Time Text visible' },
      { locator: this.outTimeText, alias: 'Out Time Text visible' },
      { locator: this.statusText, alias: 'Status Text visible' },
      { locator: this.actionText, alias: 'Action Text visible' },
      { locator: this.attendanceSummaryText, alias: 'Attendance Summary Text visible' },
      { locator: this.noticeText, alias: 'Notice Text visible' },
      { locator: this.currentLeaveBalanceText, alias: 'Current Leave Balance Text visible' },
      { locator: this.nameText, alias: 'Name Text visible' },
      { locator: this.designationText, alias: 'Designation Text visible' },
      { locator: this.leaveGroupText, alias: 'Leave Group Text visible' },
      { locator: this.remainingLeaveText, alias: 'Remaining Leave Text visible' },
      { locator: this.leaveTakenText, alias: 'Leave Taken Text visible' },
      { locator: this.attendanceMissedText, alias: 'Attendance Missed Text visible' },
      { locator: this.dateText, alias: 'Date Text visible' },
      { locator: this.nameText, alias: 'Name Text visible' },
      { locator: this.inTimeText, alias: 'In Time Text visible' },
      { locator: this.outTimeText, alias: 'Out Time Text visible' },
      { locator: this.actionText, alias: 'Action Text visible' },
      { locator: this.leaveCalendarText, alias: 'Leave Calendar Text visible' },

    ];
    for (const el of elements) {
      try {
        await this.assertWithScroll(
          { 
            locator: { default: el.locator }, 
            state: 'visible', 
            alias: el.alias 
          },
        );
      } catch (error) {
        console.error(`Failed to find element: ${el.alias}`);
        throw error;
      }
    }
  }
  
}
