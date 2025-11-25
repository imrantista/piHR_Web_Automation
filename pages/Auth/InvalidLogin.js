import BasePage from '../BasePage';
import { config } from '../../config/testConfig.js';

export class InvalidLogin extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.loginFrame = page.frameLocator('iframe[title="Login Page"]');
    this.emailTxt = this.loginFrame.getByRole('textbox', { name: 'Username/ Mobile' });
    this.passwordTxt = this.loginFrame.getByRole('textbox', { name: 'Password' });
    this.loginBtn = this.loginFrame.getByRole('button', { name: 'Login' });
    this.errorMsg = this.loginFrame.getByText('Invalid user name or password');
  }
  async invalidLogin(username) {
    await this.waitAndFill(this.emailTxt, username, 'Email');
    await this.waitAndFill(this.passwordTxt, 'Password');
    await this.expectAndClick(this.loginBtn, 'Login Button');
    await this.assert({
      locator: { default: this.errorMsg },
      state: 'visible',
      alias: 'Invalid login error message'
    });
  }
}
