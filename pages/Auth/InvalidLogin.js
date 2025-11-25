import BasePage from '../BasePage';
import { LoginPage } from './LoginPage.js';

export class InvalidLogin extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.loginPage = new LoginPage(page, context);
    this.errorMsg = page.locator('iframe[title="Login Page"]').contentFrame().getByText('Invalid user name or password');
  }
  async invalidLogin(username) {
    await this.waitAndFill(this.loginPage.emailTxt, username, 'Email');
    await this.waitAndFill(this.loginPage.passwordTxt, 'invalidpass');
    await this.expectAndClick(this.loginPage.loginBtn, 'Login Button');
    await this.assert({
      locator: { default: this.errorMsg },
      state: 'visible',
      alias: 'Invalid login error message'
    });
  }
}
