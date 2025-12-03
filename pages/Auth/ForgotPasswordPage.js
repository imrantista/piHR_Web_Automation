import BasePage from '../BasePage';
import { getResetPasswordLinkUnified } from '../../utils/gmailUtils.js';
import { LoginPage } from './LoginPage.js';
import{config} from '../../config/testConfig.js';
import fs from 'fs';
export class ForgotPasswordPage extends BasePage {
  constructor(page, context,request) {
    super(page, context);
    this.page = page;
    this.request = request;
    this.context = context;
    this.forgotPasswordFrame = page.locator('iframe[title="Login Page"]').contentFrame().getByText('Forgot password?');
    this.emailTxt = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('textbox', { name: 'Email' });
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
  }

  async ForgotPassword(email) {
    await this.expectAndClick(this.forgotPasswordFrame,'Forgot Password Link');
    await this.waitAndFill(this.emailTxt, email,'Email');
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
  await this.waitAndFill(this.emailTxt, email,'Email');
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
  await this.waitAndFill(this.emailTxt,'abc$gmail.com');
  await this.expectAndClick(this.submitBtn,'Submit Button');
  await this.assert({
    locator: {default: this.emailFormatValidation},
    state: 'visible',
    toHaveText: 'Please enter a valid email address.'
  })
}

async validateUnregisteredEmail(email){
  await this.expectAndClick(this.forgotPasswordFrame,'Forgot Password Link');
  await this.waitAndFill(this.emailTxt,'shabit@gmail.com');
  await this.expectAndClick(this.submitBtn,'Submit Button');
  await this.assert({
    locator: {default: this.emailFormatValidation},
    state: 'visible',
    toHaveText: 'Email not found.'
  })
}

async validateUnregisteredEmail(email){
  await this.waitAndFill(this.emailTxt,'shabit@gmail.com');
  await this.expectAndClick(this.submitBtn,'Submit Button');
  await this.assert({
    locator: {default: this.emailFormatValidation},
    state: 'visible',
    toHaveText: 'Email not found.'
  })
}
}


