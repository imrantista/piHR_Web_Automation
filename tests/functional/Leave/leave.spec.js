import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Leave test', () => {
  for (const vp of [Desktop]) {
    test(`${vp.name} Varify the leave create modal component : @regression TC_001  `, async ({ page, loginPage, modalcomponent , useSession}) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit(config.slug.leavepage);
      await modalcomponent.checkModalComponent();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name} Varify the leave create modal's required filed : @regression TC_003  `, async ({ page, loginPage, requiredfiled , useSession}) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit(config.slug.leavepage);
      await requiredfiled.requiredFieldValidation();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name} Create New Leave : @regression TC_002`, async ({ page, loginPage, createleave, useSession}) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit(config.slug.leavepage);
      await createleave.createNewLeave(config.data.emplyeeName, config.data.leaveType, config.data.leaveStartDate, config.data.leaveEndDate, config.data.leavePurpose);
    });
  }
  
});
