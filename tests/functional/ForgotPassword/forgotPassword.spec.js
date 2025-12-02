import { setViewport, Laptop, Mobile,Desktop,Tablet } from '../../../utils/viewports.js';
import { config } from '../../../config/testConfig.js';
import { test } from '../../../utils/sessionUse.js';


test.describe('ForgotPassword to PIHR', () => {
  
  for (const vp of [Desktop]) {
    test(`${vp.name}  Password Reset Successful @regression Auth-1023`, async ({ page, forgotPasswordPage,loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await forgotPasswordPage.ForgotPassword(config.credentials.resetPasswordEmail);
      await forgotPasswordPage.getResetPasswordLink();
      await forgotPasswordPage.doLoginWithNewPassword(config.credentials.employeeEmail);
    });
}
});