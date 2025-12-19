import BasePage from "../../BasePage";
import {generateAttendanceReconciliationData} from "../../../utils/dateUtils.js";
export class AttendanceReconciliationPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    //Employee
    this.selfServiceTab= page.getByRole('paragraph').filter({ hasText: 'Self Service' });
    this.myScreenBtn=page.getByRole('paragraph').filter({ hasText: 'My Screens' });
    this.attendanceReconciliationBtn=page.getByRole('button', { name: 'Attendance Reconciliation' });
    this.addNewBtn=page.getByRole('button', { name: 'Add New' });
    this.attendanceReconciliationDate= page.locator('input[name="attendance_reconciliation_date"]');
    this.reconciliationOutTimeDate= page.locator('input[name="reconciled_out_time_date"]');
    this.inTimeReconciliation= page.getByRole('textbox', { name: 'To' }).first();
    this.outTimeReconciliation= page.getByRole('textbox', { name: 'To' }).nth(1);
    this.inTimeRemarks= page.locator('textarea[name="in_time_remarks"]');
    this.outTimeRemarks= page.locator('textarea[name="out_time_remarks"]');
    this.saveBtn= page.getByRole('button', { name: 'Save' });
    this.cancelBtn=page.getByRole('button', { name: 'Cancel' });
    this.editBtn=page.locator('.flex.justify-center.gap-x-3').first();

  }

  async employeeSubmitNewAttendanceReconciliation(){
    await this.expectAndClick(this.selfServiceTab,"Self Service Tab");
    await this.myScreenBtn.hover();
    await this.expectAndClick(this.attendanceReconciliationBtn,"Click Attendance Reconciliation Button");
    await this.expectAndClick(this.addNewBtn,"Click Add New Button");
    const { attendanceDate, outTimeDate, inTime, outTime } =generateAttendanceReconciliationData()
    await this.expectAndClick(this.attendanceReconciliationDate,"Attendance Reconciliation Date");
    await this.waitAndFill(this.attendanceReconciliationDate,attendanceDate,"Fill Attendance Date");
    await this.expectAndClick(this.reconciliationOutTimeDate,"Attendance Reconciliation Date");
    await this.waitAndFill(this.reconciliationOutTimeDate,outTimeDate,"Fill Attendance Date");
    await this.expectAndClick(this.inTimeReconciliation,"Attendance Reconciliation Date");
    await this.waitAndFill(this.inTimeReconciliation,inTime,"Fill Attendance Date");
    await this.expectAndClick(this.outTimeReconciliation,"Attendance Reconciliation Date");
    await this.waitAndFill(this.outTimeReconciliation,outTime,"Fill Attendance Date");
    await this.expectAndClick(this.inTimeRemarks);
    await this.waitAndFill(this.inTimeRemarks,"Test");
    await this.expectAndClick(this.outTimeRemarks);
    await this.waitAndFill(this.outTimeRemarks,"Test");
    await this.expectAndClick(this.saveBtn,"Save Button");
  }

  async employeeUpdateAttendanceReconciliation(){
    await this.expectAndClick(this.selfServiceTab,"Self Service Tab");
    await this.myScreenBtn.hover();
    await this.expectAndClick(this.attendanceReconciliationBtn,"Click Attendance Reconciliation Button");
    await this.expectAndClick(this.editBtn,"Edit Button");
    const { attendanceDate, outTimeDate, inTime, outTime } =generateAttendanceReconciliationData()
    await this.expectAndClick(this.attendanceReconciliationDate,"Attendance Reconciliation Date");
    await this.waitAndFill(this.attendanceReconciliationDate,attendanceDate,"Fill Attendance Date");
    await this.expectAndClick(this.reconciliationOutTimeDate,"Attendance Reconciliation Date");
    await this.waitAndFill(this.reconciliationOutTimeDate,outTimeDate,"Fill Attendance Date");
    await this.expectAndClick(this.inTimeReconciliation,"Attendance Reconciliation Date");
    await this.waitAndFill(this.inTimeReconciliation,inTime,"Fill Attendance Date");
    await this.expectAndClick(this.outTimeReconciliation,"Attendance Reconciliation Date");
    await this.waitAndFill(this.outTimeReconciliation,outTime,"Fill Attendance Date");
    await this.expectAndClick(this.inTimeRemarks);
    await this.waitAndFill(this.inTimeRemarks,"Test");
    await this.expectAndClick(this.outTimeRemarks);
    await this.waitAndFill(this.outTimeRemarks,"Test");
    await this.expectAndClick(this.saveBtn,"Save Button");
  }
}    