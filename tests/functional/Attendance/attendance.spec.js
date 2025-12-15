import { setViewport, Desktop } from '../../../utils/viewports.js';
import { test, supervisor } from '../../../utils/sessionUse.js';
import { reportConfig } from '../../../config/testConfig.js';

test.describe('Dashboard component', () => {
  for (const vp of [Desktop]) {
    test(`${supervisor} - ${vp.name} @Business/Functional Self-1092 : Download & convert Month Wise Attendance PDF to JSON`, 
    async ({ monthWiseAttendancereport }) => {

      // 1️⃣ Download PDF
      const pdfPath = await monthWiseAttendancereport.downloadMonthWiseAttendancePDF({
        month: reportConfig.month,
        year: reportConfig.year,
        role: supervisor,
      });

      // 2️⃣ Convert PDF to JSON immediately
      const jsonPath = await monthWiseAttendancereport.convertPdfToJson(
        pdfPath, // PDF file path
        undefined, // optional output folder (will default)
        `MonthWiseAttendance_${reportConfig.month}_${reportConfig.year}.json` // output JSON file name
      );

      console.log('PDF downloaded at:', pdfPath);
      console.log('Converted JSON saved at:', jsonPath);
    });
  }
});
