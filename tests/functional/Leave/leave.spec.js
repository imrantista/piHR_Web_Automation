import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test, allAdmin, admin} from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Leave test', () => {
  for (const bothAdmin of allAdmin) {
  for (const vp of [Desktop]) {
    test(`${bothAdmin}- ${vp.name} Verify the UI of Leave Create Modal : @regression Leave-1286  `, async ({ page, loginPage, leavepage , useSession}) => {
      await setViewport(page, vp.size);
      await useSession(bothAdmin);
      await loginPage.visit(config.slug.leavepage);
      await leavepage.checkModalComponent();
    });
  }
  for (const vp of [Desktop]) {
    test(`${bothAdmin}-${vp.name} Verify Required Fields Validation in Leave Create Modal When Foreign Leave Is Not Checked : @regression Leave-1304  `, async ({ page, loginPage, leavepage , useSession}) => {
      await setViewport(page, vp.size);
      await useSession(bothAdmin);
      await loginPage.visit(config.slug.leavepage);
      await leavepage.requiredFieldValidation();
    });
  }
  }
  for (const Admin of admin) {
  for (const vp of [Desktop]) {
    test(`${Admin}-${vp.name} Create Leave for an Employee with Pending Status : @regression Leave-1307`, async ({ page, loginPage, leavepage, useSession}) => {
      await setViewport(page, vp.size);
      await useSession(Admin);
      await loginPage.visit(config.slug.leavepage);
      await leavepage.createNewLeave(config.data.emplyeeName, config.data.leaveType, config.data.leaveStartDate, config.data.leaveEndDate, config.data.leavePurpose);
    });
  }
  for (const vp of [Desktop]) {
    test(`${Admin}-${vp.name} Verify System Restriction When Creating Multiple Leaves on the Same Date : @regression Leave-1310`, async ({ page, loginPage, leavepage, useSession}) => {
      await setViewport(page, vp.size);
      await useSession(Admin);
      await loginPage.visit(config.slug.leavepage);
      await leavepage.applyLeaveInSameDate(config.data.emplyeeName, config.data.leaveType, config.data.leaveStartDate, config.data.leaveEndDate, config.data.leavePurpose);
    });
  }
   for (const vp of [Desktop]) {
    test(`${Admin}-${vp.name} Verify Pending Leave Can Be Deleted : @regression Leave-1349`, async ({ page, loginPage, leavepage, useSession}) => {
      await setViewport(page, vp.size);
      await useSession(Admin);
      await loginPage.visit(config.slug.leavepage);
      await leavepage.deleteLeave(config.data.deleteEmployeeName);
    });
  }
   for (const vp of [Desktop]) {
    test(`${Admin}-${vp.name} Verify Calendar Displays Correct Month & Year When Navigating Months : @regression Leave-1002`, async ({ page, loginPage, useSession, leaveDashboard }) => {
      await setViewport(page, vp.size);
      await useSession(Admin);
      await loginPage.visit(config.slug.leavedashboard);
      await leaveDashboard.leaveDashboardMonthYearValidation();
    });
  }
}
  
});
