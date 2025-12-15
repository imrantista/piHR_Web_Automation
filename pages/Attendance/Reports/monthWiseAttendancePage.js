import BasePage from "../../BasePage";
import { reportConfig } from "../../../config/testConfig.js";

export class monthWiseAttendancePage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
  }
  async downloadMonthWiseAttendancePDF({ month = reportConfig.month, year = reportConfig.year, role, prefix = "Attendance Report" } = {}) {
    if (!role) throw new Error("Role must be specified for downloading the attendance report!");
    return await this.downloadAndConvertPDF({
      apiKey: "monthWiseAttendanceApi",
      role,
      prefix,
      month,
      year,
      outputFolder: this.context.outputFolder // optional, can define folder per page
    });
  }
}
