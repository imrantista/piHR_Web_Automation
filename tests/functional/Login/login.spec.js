import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test } from '../../../utils/sessionUse.js';
import { config, deactivatedUsers, invalidCredentials, validUsers } from '../../../config/testConfig.js';


const viewports = [Desktop];
test.describe('Login to PIHR', () => {

  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_001:Successful admin login `, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.adminEmail, config.credentials.adminPassword);
      await loginPage.assertLoginAdmin();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  Successful employee login @regression TC_002:`, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.employeeEmail, config.credentials.employeePassword);
      await loginPage.assertUserDashboard();
    });
  }
   for (const vp of [Desktop]) {
    test(`${vp.name}  Successful employee admin login @regression TC_003:`, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.employeeAdminEmail, config.credentials.employeeAdminPassword);
      await loginPage.assertUserDashboard();
    });
  }

  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_004:Assert Login Page Components `, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.assertLoginPageComponents();
    });
  }

  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_003:Successful admin login with session`, async ({ page, loginPage, useSession }) => {
      await setViewport(page, vp.size);
      await useSession('admin');
      await loginPage.visit();
      await loginPage.assertLoginAdmin();
    });
  }
  for (const vp of [Desktop]) {
    test(`${vp.name}  @regression TC_004:Successful employee login with session`, async ({ page, loginPage, useSession }) => {
      await setViewport(page, vp.size);
      await useSession('employee');
      await loginPage.visit();
      await loginPage.assertLoginEmployee();
    });
  }
});

[Desktop].forEach((vp) => {
    test(`Verify “Remember Me” Functionality on Login Page on ${vp.name}`, async ({ page, loginPage, logout }) => {
      await setViewport(page, vp.size);
      console.log(`Testing on viewport: ${vp.name}`);
      await loginPage.visit();
      await loginPage.clickRememberMe();
      await loginPage.doLogin(config.credentials.adminEmail, config.credentials.adminPassword);
      await logout.logoutFunc();
      await loginPage.assertCredentialsFilled(config.credentials.adminEmail, config.credentials.adminPassword);
      console.log(`"Remember Me" functionality verified on ${vp.name}`);
    });
});

[Desktop].forEach((vp) => {
  validUsers.forEach((user) => {
    test(`Verify Logout Functionality from ${user.name} on ${vp.name}`,
      { tag: '@regression' }
      , async ({ page, loginPage, logout }) => {
        await setViewport(page, vp.size);
        console.log(`Testing logout for ${user.name} on viewport: ${vp.name}`);
        await loginPage.visit();
        await loginPage.doLogin(user.email, user.password);
        await logout.logoutFunc();
        await loginPage.verifyLogout();
      })
  })
});

test.describe('Invalid Login Verification', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
  });

  invalidCredentials.forEach((credentials) => {
    test(`Verify Login Behavior with ${credentials.name}`, async ({ page, loginPage }) => {
      await loginPage.loginAndVerifyError(
        credentials.email,
        credentials.password,
        credentials.expectedError
      );
      console.log(`Verified error message: "${credentials.expectedError}" for ${credentials.name}`);
    });
  });
});

viewports.forEach((vp) => {
  test('Verify Password Masking Functionality on Login Page', async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
    await loginPage.verifyPasswordMasking();

  });

  test('Verify Password Field Accepts Special Characters', async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
    await loginPage.doLogin(config.credentials.adminEmail, config.credentials.adminPassword); //admin password has special characters
    await loginPage.assertLoginAdmin();
  });
});



test.describe('Deactivated User Login Verification', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await setViewport(page, Desktop.size);
    await loginPage.visit();
  });
  deactivatedUsers.forEach(user => {
    test.only(`Verify Deactivated ${user.name} Cannot Login`, async ({ page, loginPage }) => {
      await loginPage.doLogin(user.username, user.password);
      await loginPage.assertAccountLockedError();
      console.log('Deactivated user login attempt shows correct error message.');
    });
  });

});

test.describe('ForgotPassword to PIHR', () => {
  
  for (const vp of [Desktop]) {
    test(`${vp.name}  Password Reset Successful @regression TC_1023`, async ({ page, loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.ForgotPassword(config.credentials.resetPasswordEmail);
      await loginPage.getResetPasswordLink();
      await loginPage.doLoginWithNewPassword(config.credentials.employeeEmail);
    });

    test(`${vp.name} Forgot Password Component Check @regression TC_1024`, async ({page, loginPage})=>{
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.forgotPasswordPageComponenetCheck();
    });

    test(`${vp.name} Validate Cancel Button on Forgot Password Page @regression TC_1025`, async ({page, loginPage})=>{
      await setViewport(page,vp.size);
      await loginPage.visit();
      await loginPage.validateCancelButton(config.credentials.employeeEmail);
    });

    test(`${vp.name} Empty field Validation on Forgot Password Page @regression TC_1026`, async ({page, loginPage})=>{
      await setViewport(page,vp.size);
      await loginPage.visit();
      await loginPage.emptyFieldValidation();
    });

     test(`${vp.name} Wrong Email Format Validation on Forgot Password Page @regression TC_1027`, async ({page, loginPage})=>{
      await setViewport(page,vp.size);
      await loginPage.visit();
      await loginPage.isInvalidEmailFormat();
    });

    test(`${vp.name} Unregister Email Validation on Forgot Password Page @regression TC_1028`, async ({page, loginPage})=>{
      await setViewport(page,vp.size);
      await loginPage.visit();
      await loginPage.validateUnregisteredEmail();
    });

     test(`${vp.name} Validate Login with Old Password @regression TC_1029`, async ({page, loginPage})=>{
      await setViewport(page,vp.size);
      await loginPage.loginWithOldPassword(config.credentials.employeeEmail,config.credentials.employeePassword);
    });

    test(`${vp.name}  Password Reset using Old Password @regression TC_1030`, async ({ page,loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.ForgotPassword(config.credentials.resetPasswordEmail);
      await loginPage.validateOldPasswordNotAllowed();
    });

     test(`${vp.name}  Set new Password after login @regression TC_1031`, async ({ page,loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.handleFirstLoginPasswordReset();
    });

    test(`${vp.name}  Validate Reset Password Link Expiry @regression TC_1034`, async ({ page,loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.validateResetLinkExpiryAndResend();
      // await loginPage.visit();
      // await loginPage.ForgotPassword(config.credentials.resetPasswordEmail);
      // await loginPage.getResetPasswordLink();
      
    });

    test(`${vp.name}  Validate Email Body and Company Branding  @regression TC_1039`, async ({ page,loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.validateEmailBody(config.credentials.resetPasswordEmail);
      
    });

    test(`${vp.name}  @regression TC_1043:Successful Login Using Keyboard Enter Button`, async ({ page, loginPage }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLoginUsingEnterButton(config.credentials.adminEmail, config.credentials.adminPassword);
    });

    test(`${vp.name}  @regression TC_1044:Validate After Logout Browser back button behavior`, async ({ page, loginPage,logout }) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.doLogin(config.credentials.adminEmail, config.credentials.adminPassword);
      await logout.logoutFunc();
      await loginPage.validateNavigateBackAfterLogout();
    });

    test(`${vp.name}  Validate Password strength @regression TC_1047`, async ({ page,loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.ForgotPassword(config.credentials.resetPasswordEmail);
      await loginPage.validatePasswordStrength();
    });

    test(`${vp.name}  Validate Password Match @regression TC_1048`, async ({ page,loginPage}) => {
      await setViewport(page, vp.size);
      await loginPage.visit();
      await loginPage.ForgotPassword(config.credentials.resetPasswordEmail);
      await loginPage.validatePasswordMatch();
    });
  }
});