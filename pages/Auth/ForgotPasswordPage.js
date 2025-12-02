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
    "user.json",
    JSON.stringify({ newPassword: config.credentials.newPassword }, null, 2),
    "utf-8"
  );

  console.log("✅ user.json updated with new password");
}

async doLoginWithNewPassword(email){
  console.log("Login with new Password");
  
  const userData = JSON.parse(fs.readFileSync("user.json","utf-8"))
  const newPassword = userData.newPassword;
  const loginPage = new LoginPage(this.page, this.context);
  await loginPage.visit();
  await loginPage.doLogin(email,newPassword);
}
};