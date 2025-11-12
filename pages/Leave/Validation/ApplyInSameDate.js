import { CreateLeave } from "../CreateLeave/CreateLeave";
import BasePage from "../../BasePage";

export class ApplyInSameDate extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.saveBtn = page.getByRole("button", { name: "Save" });
    this.errorMessage = page.getByText('Overlaps with another application');
    this.createLeave = new CreateLeave(page, context);
  }
  async applyLeaveInSameDate(employeeName, leaveType, leaveStartDate, leaveEndDate, leavePurpose) {
    await this.createLeave.createNewLeave(
      employeeName,
      leaveType,
      leaveStartDate,
      leaveEndDate,
      leavePurpose,
      false
    );
    await this.expectAndClick(this.saveBtn, "Save Button");
    await this.assert({
      locator: this.errorMessage,
      state: 'visible',
      alias: 'Leave application in same date error message visible'
    });
  }
}
