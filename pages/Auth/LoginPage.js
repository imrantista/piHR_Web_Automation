import BasePage from '../BasePage';
import { config } from '../../config/testConfig.js';
import { ensureTokens } from '../../utils/global-setup.js';
import { expect } from '@playwright/test';
import { getResetPasswordLinkUnified,waitForEmailSubjectUnified } from '../../utils/gmailUtils.js';
import fs from 'fs';

export class LoginPage extends BasePage {
  constructor(page, context,request) {
    super(page, context);
    this.page = page;
    this.request= request;
    this.context = context;
    this.loginFrame = page.locator('iframe[title="Login Page"]');
    this.emailTxt = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('textbox', { name: 'Username/ Mobile' });
    this.passwordTxt = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('textbox', { name: 'Password' });
    this.loginBtn = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('button', { name: 'Login' });
    this.profileLoggedIn = page.getByRole('img', { name: 'profile' });
    this.welcomeBackTxt = page.getByRole('heading', { name: 'Welcome Back' });
    this.myScreenTxt = page.getByRole('heading', { name: 'My Screen' });
    this.rememberMe = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('checkbox', { name: 'Remember me' })
    this.revealPasswordBtn = page.locator('iframe[title="Login Page"]').contentFrame().locator('#reveal-password');
    this.closePasswordBtn = page.locator('iframe[title="Login Page"]').contentFrame().locator('#close-password');
    this.accountLockedError = page.locator('iframe[title="Login Page"]').contentFrame().getByText('Your account is locked or inactive');
    this.forgotPasswordFrame = page.locator('iframe[title="Login Page"]').contentFrame().getByText('Forgot password?');
    this.resetEmailTxt = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('textbox', { name: 'Email' });
    this.resetPasswordBtn = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('textbox', { name: 'Email' });
    this.submitBtn = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('button', { name: 'Submit' });
    this.resetPasswordTxt = page.locator('iframe[title="Login Page"]').contentFrame().getByText('Your reset password link has been sent to your email address.');
    this.newPassword=page.getByRole('textbox',{name:'Enter New Password'});
    this.confirmNewPassword=page.getByRole('textbox',{name:'Re-type New Password'});
    this.resetBtn=page.getByRole('button',{name:'Reset'});
    this.productImg = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('img', { name: 'Product Logo' });
    this.headingTxt =page.locator('iframe[title="Login Page"]').contentFrame().getByRole('heading', { name: 'Forget Password?' });
    this.loginImg=page.locator('iframe[title="Login Page"]').contentFrame().getByRole('img', { name: 'Login Image' });
    this.cancelBtnTxt=page.locator('iframe[title="Login Page"]').contentFrame().getByRole('button', { name: 'Cancel' });
    this.submitBtnTxt=page.locator('iframe[title="Login Page"]').contentFrame().getByRole('button', { name: 'Submit' });
    this.subTitleTxt = page.locator('iframe[title="Login Page"]').contentFrame().getByText('Enter email to reset your');
    this.loginTxt =page.locator('iframe[title="Login Page"]').contentFrame().getByRole('heading', { name: 'Login To Your Account' });
    this.emailValidationTxt =page.locator('iframe[title="Login Page"]').contentFrame().getByText('Please enter email address.');
    this.emailFormatValidation =page.locator('iframe[title="Login Page"]').contentFrame().getByText('Email not found.');
    this.validateResetPass= page.getByText('New Password is same as');
    this.invalidCredTxt=page.locator('iframe[title="Login Page"]').contentFrame().getByText('Invalid user name or password');
    this.expireToast=page.getByText('Reset Password Link expired.');

  }

  async visit(slugKeyOrPath = '') {
    let path = '';
    if (config.slug[slugKeyOrPath]) {
      path = config.slug[slugKeyOrPath];
    } else {
      path = slugKeyOrPath;
    }
    const finalPath = path.startsWith('/') ? path : `/${path}`;
    await this.page.goto(finalPath, { waitUntil: 'networkidle', ignoreHTTPSErrors: true });
  }

  async globalLogin(username, password) {
    await this.emailTxt.fill(username);
    console.log("Email entered.");
    await this.passwordTxt.fill(password);
    console.log("Password entered.");
    await this.loginBtn.click();
    console.log("Login button clicked.");
  }
  async doLogin(username, password) {
    await this.waitAndFill(this.emailTxt, username, 'Email');
    await this.waitAndFill(this.passwordTxt, password, 'Password');
    await this.expectAndClick(this.loginBtn, 'Login Button', 'loginApi:GET');
  }
  async assertLoginAdmin() {
    await this.assert({
      locator: {
        default: this.welcomeBackTxt,
      },
      state: 'visible',
      alias: 'Welcome back Text visible'
    });
  }
  async assertLoginEmployee() {
    await this.assert({
      locator: {
        default: this.myScreenTxt,
      },
      state: 'visible',
      alias: 'Welcome back Text visible'
    });
  }

  async clickRememberMe() {
    console.log("Attempting to click on Remember Me checkbox.");
    await this.rememberMe.click();
    console.log("Clicked on Remember Me checkbox.");
  }

  async fillPassword(password) {
    console.log("Filling password field.");
    await this.waitAndFill(this.passwordTxt, password, 'Password');
  }

  async getEmailInputValue() {
    console.log("Getting email input value.");
    return await this.emailTxt.inputValue();
  }

  async getPasswordInputValue() {
    console.log("Getting password input value.");
    return await this.passwordTxt.inputValue();
  }

  async assertAccountLockedError() {
    await expect(this.accountLockedError).toBeVisible();
  }

  async verifyPasswordMasking(password = "TestPassword123") {
    // Fill password
    await this.passwordTxt.fill(password);
    await expect(this.passwordTxt).toHaveAttribute('type', 'password');

    // Reveal
    await this.revealPasswordBtn.click();
    await expect(this.passwordTxt).toHaveAttribute('type', 'text');

    // Hide again
    await this.closePasswordBtn.click();
    await expect(this.passwordTxt).toHaveAttribute('type', 'password');
  }

  async verifyLoginError(expectedError) {
    const errorLocator = this.loginFrame.contentFrame().getByText(expectedError);
    await expect(errorLocator).toBeVisible();
  }

  async loginAndVerifyError(email, password, expectedError) {
    await this.doLogin(email, password);
    await this.verifyLoginError(expectedError);
  }

  async verifyLogout() {
    await expect(this.page.locator('iframe[title="Login Page"]').contentFrame().getByRole('heading', { name: 'Login To Your Account' })).toBeVisible();
  }

  async assertCredentialsFilled(expectedEmail, expectedPassword) {
    const emailValue = await this.getEmailInputValue();
    const passwordValue = await this.getPasswordInputValue();
    expect(emailValue).toBe(expectedEmail);
    expect(passwordValue).toBe(expectedPassword);
  }

  async ForgotPassword(email) {
      await this.expectAndClick(this.forgotPasswordFrame,'Forgot Password Link');
      await this.waitAndFill(this.resetEmailTxt, email,'Email');
      await this.expectAndClick(this.submitBtn,'Submit Button');
      await this.assert({
          locator: 
          this.resetPasswordTxt,
          state: 'visible',
          alias: 'Your reset password link has been sent to your email address.'
        });
    }
  
    async setNewPassword(newPassword){
      await this.waitAndFill(this.newPassword,newPassword,'NewPassword');
      await this.waitAndFill(this.confirmNewPassword,newPassword,'NewPassword');
      await this.expectAndClick(this.resetBtn,'Reset Button');
    }
  
    async getResetPasswordLink() {
        const resetLink = await getResetPasswordLinkUnified({
        method: "APP_PASSWORD",          //  "API" or "APP_PASSWORD"
        request: this.request,
        expectedSubject: 'Please Reset Your Password',
      });
      await this.page.goto(resetLink);
      await this.setNewPassword(config.credentials.newPassword);
  
      fs.writeFileSync(
      "SaveData/user.json",
      JSON.stringify({ newPassword: config.credentials.newPassword }, null, 2),
      "utf-8"
    );
  
    console.log("✅ user.json updated with new password");
  }
  
   async validateOldPasswordNotAllowed() {
        const resetLink = await getResetPasswordLinkUnified({
        method: "APP_PASSWORD",          //  "API" or "APP_PASSWORD"
        request: this.request,
        expectedSubject: 'Please Reset Your Password',
      });
      const userData = JSON.parse(fs.readFileSync("SaveData/user.json","utf-8"))
      const newPassword = userData.newPassword;
      await this.page.goto(resetLink);
      await this.setNewPassword(newPassword);
      await this.assert({
        locator: {default: this.validateResetPass},
        state: 'visible',
        toHaveText: 'New Password is same as Current Password',
      })
  }
  
    async loginWithOldPassword(){
    const loginPage = new LoginPage(this.page, this.context);
    await loginPage.visit();
    await loginPage.doLogin(config.credentials.employeeEmail,config.credentials.employeePassword);
      this.assert({
        locator: {default: this.invalidCredTxt},
        state: 'visible',
        toHaveText: 'Invalid user name or password',
      })
    }
  
  async doLoginWithNewPassword(email){
    console.log("Login with new Password");
    
    const userData = JSON.parse(fs.readFileSync("SaveData/user.json","utf-8"))
    const newPassword = userData.newPassword;
    const loginPage = new LoginPage(this.page, this.context);
    await loginPage.visit();
    await loginPage.doLogin(email,newPassword);
  }
  
  async forgotPasswordPageComponenetCheck() {
    await this.assert({
      locator: { default: this.forgotPasswordFrame },
      state: 'visible',
      alias: 'Forgot Password link text',
    });
    await this.expectAndClick(this.forgotPasswordFrame, 'Forgot Password Link');
    const elements = [
      { locator: this.productImg,  alias: 'Product Logo visible' },
      { locator: this.headingTxt,  alias: 'Forget Password? Text visible' },
      {locator: this.subTitleTxt, alias: 'Enter email to reset your Text visible'},
      { locator: this.loginImg,    alias: 'Login Image visible' },
      { locator: this.cancelBtnTxt, alias: 'Cancel Text visible' },
      { locator: this.submitBtnTxt, alias: 'Submit Text visible' },
    ];
  
    for (const el of elements) {
      try {
        await this.assert({
          locator: { default: el.locator },
          state: 'visible',
          alias: el.alias,
        });
      } catch (error) {
        console.error(`Failed to find element: ${el.alias}`);
        throw error;
      }
    }
  }
  
  async validateCancelButton(email){
    await this.expectAndClick(this.forgotPasswordFrame,'Forgot Password Link');
    await this.waitAndFill(this.resetEmailTxt, email,'Email');
    await this.expectAndClick(this.cancelBtnTxt,'Cancel Button')
    await this.assert({
      locator: {default: this.loginTxt},
      state: 'visible',
      toHaveText: 'Login To Your Account'
    });
  }
  
  async emptyFieldValidation(){
    await this.expectAndClick(this.forgotPasswordFrame,'Forgot Password Link');
    await this.expectAndClick(this.submitBtn,'Submit Button')
    await this.assert({
      locator: {default: this.emailValidationTxt},
      state: 'visible',
      toHaveText: 'Please enter email address.'
    });
  }
  
  async isInvalidEmailFormat(email){
    await this.expectAndClick(this.forgotPasswordFrame,'Forgot Password Link');
    await this.waitAndFill(this.resetEmailTxt,'abc$gmail.com');
    await this.expectAndClick(this.submitBtn,'Submit Button');
    await this.assert({
      locator: {default: this.emailFormatValidation},
      state: 'visible',
      toHaveText: 'Please enter a valid email address.'
    })
  }
  
  async validateUnregisteredEmail(email){
    await this.expectAndClick(this.forgotPasswordFrame,'Forgot Password Link');
    await this.waitAndFill(this.resetEmailTxt,'shabit@gmail.com');
    await this.expectAndClick(this.submitBtn,'Submit Button');
    await this.assert({
      locator: {default: this.emailFormatValidation},
      state: 'visible',
      toHaveText: 'Email not found.'
    })
  }
  
  async validateResetLinkExpiryAndResend(){
    const resetLink = await getResetPasswordLinkUnified({method: "APP_PASSWORD",          //  "API" or "APP_PASSWORD"
        request: this.request,
        expectedSubject: 'Please Reset Your Password',
      });
    await this.page.goto(resetLink);
    await this.assert({
      locator: {default: this.expireToast},
      state: 'visible',
      toHaveText: 'Reset Password Link expired.',
    })
  
    // const reset = await getResetPasswordLinkUnified({
    //     method: "APP_PASSWORD",          //  "API" or "APP_PASSWORD"
    //     request: this.request,
    //     expectedSubject: 'Please Reset Your Password',
    //   });
    //   await this.page.goto(reset);
    //   await this.setNewPassword(config.credentials.newPassword);
  }
  
  async validateEmailBody(email){
     await this.expectAndClick(this.forgotPasswordFrame,'Forgot Password Link');
      await this.waitAndFill(this.resetEmailTxt, email,'Email');
      await this.expectAndClick(this.submitBtn,'Submit Button');
      const emailBody= await waitForEmailSubjectUnified({
    method : "APP_PASSWORD",
    request: this.request,
    expectedSubject: 'Please Reset Your Password',
  });
  }
}

