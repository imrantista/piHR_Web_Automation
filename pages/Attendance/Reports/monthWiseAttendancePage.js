import BasePage from "../../BasePage";
import { reportConfig } from "../../../config/testConfig.js";

export class monthWiseAttendancePage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
  }
async downloadMonthWiseAttendancePDF({ month = reportConfig.month, year = reportConfig.year, role } = {}) {
    if (!role) throw new Error("Role must be specified for downloading the attendance report!");
    const fileName = `Attendance_${month}_${year}.pdf`;
    return await this.callAPI({
      apiKey: "monthWiseAttendanceApi",
      role,
      headers: { Accept: "application/pdf" },
      expectFile: true,
      query: { month: Number(month), year, export_as_excel: false },
      outputFileName: fileName,
    });
  }
}
