import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test, allAdmin, admin} from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Leave test', () => {
  for (const bothAdmin of allAdmin) {
  for (const vp of [Desktop]) {
    test(`${bothAdmin}- ${vp.name} Varify the leave create modal component : @regression TC_001  `, async ({ page, loginPage, modalcomponent , useSession}) => {
      await setViewport(page, vp.size);
      await useSession(bothAdmin);
      await loginPage.visit(config.slug.leavepage);
      await modalcomponent.checkModalComponent();
    });
  }
  for (const vp of [Desktop]) {
    test(`${bothAdmin}-${vp.name} Varify the leave create modal's required filed : @regression TC_002  `, async ({ page, loginPage, requiredfiled , useSession}) => {
      await setViewport(page, vp.size);
      await useSession(bothAdmin);
      await loginPage.visit(config.slug.leavepage);
      await requiredfiled.requiredFieldValidation();
    });
  }
  for (const vp of [Desktop]) {
    test(`${bothAdmin}-${vp.name} Create New Leave : @regression TC_003`, async ({ page, loginPage, createleave, useSession}) => {
      await setViewport(page, vp.size);
      await useSession(bothAdmin);
      await loginPage.visit(config.slug.leavepage);
      await createleave.createNewLeave(config.data.emplyeeName, config.data.leaveType, config.data.leaveStartDate, config.data.leaveEndDate, config.data.leavePurpose);
    });
  }
  for (const vp of [Desktop]) {
    test(`${bothAdmin}-${vp.name} Try to Create a Leave Application for an Already Applied Date : @regression TC_004`, async ({ page, loginPage, applyinsamedate, useSession}) => {
      await setViewport(page, vp.size);
      await useSession(bothAdmin);
      await loginPage.visit(config.slug.leavepage);
      await applyinsamedate.applyLeaveInSameDate(config.data.emplyeeName, config.data.leaveType, config.data.leaveStartDate, config.data.leaveEndDate, config.data.leavePurpose);
    });
  }
}
  for (const Admin of admin) {
   for (const vp of [Desktop]) {
    test(`${Admin}-${vp.name} Delete Leave : @regression TC_005`, async ({ page, loginPage, deleteleave, useSession}) => {
      await setViewport(page, vp.size);
      await useSession(Admin);
      await loginPage.visit(config.slug.leavepage);
      await deleteleave.deleteLeave(config.data.deleteEmployeeName);
    });
  }
}
  
});
