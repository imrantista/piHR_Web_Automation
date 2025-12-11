import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test, employee , supervisor } from '../../../utils/sessionUse.js';
import { config , reportConfig } from '../../../config/testConfig.js';

test.describe('Dashboard component', () => {
    for (const vp of [Desktop]) {
        test(`${employee} - ${vp.name} @Business/Functional Self-1092 : Verify Monthly Attendance Report page loads and user can generate report using Month Wise and Date Wise filters`,
    async ({ page, loginPage, monthWiseAttendancereport , useSession, context }) => {
    await setViewport(page, vp.size);
    await useSession(employee);
    await loginPage.visit(config.slug.monthWiseAttendanceReport);
    await monthWiseAttendancereport.downloadMonthWiseAttendanceReport(reportConfig.month, reportConfig.year);
});
}
});
