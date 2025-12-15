import { setViewport, Desktop } from '../../../utils/viewports.js';
import { test, employee } from '../../../utils/sessionUse.js';
import { reportConfig } from '../../../config/testConfig.js';

test.describe('Dashboard component', () => {
  for (const vp of [Desktop]) {
    test(`Download & Convert Attendance PDF to JSON`, async ({ monthWiseAttendancereport }) => {
      const { pdfPath, jsonPath } = await monthWiseAttendancereport.downloadMonthWiseAttendancePDF({
        month: reportConfig.month,
        year: reportConfig.year,
        role: employee,
        prefix: "Attendance Report" // dynamic prefix
      });

      console.log("PDF Path:", pdfPath);
      console.log("JSON Path:", jsonPath);
    });
  }
});
