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

    test(`${vp.name} Forgot Password Component Check @regression Auth-1024`, async ({page, forgotPasswordPage,loginPage})=>{
      await setViewport(page, vp.size);
      await loginPage.visit();
      await forgotPasswordPage.forgotPasswordPageComponenetCheck();
    });

    test(`${vp.name} Validate Cancel Button on Forgot Password Page @regression Auth-1025`, async ({page, forgotPasswordPage, loginPage})=>{
      await setViewport(page,vp.size);
      await loginPage.visit();
      await forgotPasswordPage.validateCancelButton(config.credentials.employeeEmail);
    });

    test(`${vp.name} Empty field Validation on Forgot Password Page @regression Auth-1026`, async ({page, forgotPasswordPage, loginPage})=>{
      await setViewport(page,vp.size);
      await loginPage.visit();
      await forgotPasswordPage.emptyFieldValidation();
    });

     test(`${vp.name} Wrong Email Format Validation on Forgot Password Page @regression Auth-1027`, async ({page, forgotPasswordPage, loginPage})=>{
      await setViewport(page,vp.size);
      await loginPage.visit();
      await forgotPasswordPage.isInvalidEmailFormat();
    });

    test(`${vp.name} Unregister Email Validation on Forgot Password Page @regression Auth-1028`, async ({page, forgotPasswordPage, loginPage})=>{
      await setViewport(page,vp.size);
      await loginPage.visit();
      await forgotPasswordPage.validateUnregisteredEmail();
    });

     test(`${vp.name} Validate Login with Old Password @regression Auth-1029`, async ({page, forgotPasswordPage, loginPage})=>{
      await setViewport(page,vp.size);
      await forgotPasswordPage.loginWithOldPassword(config.credentials.employeeEmail,config.credentials.employeePassword);
    });

    test(`${vp.name}  Password Reset using Old Password @regression Auth-1030`, async ({ page, forgotPasswordPage,loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await forgotPasswordPage.ForgotPassword(config.credentials.resetPasswordEmail);
      await forgotPasswordPage.validateOldPasswordNotAllowed();
    });
  }
});