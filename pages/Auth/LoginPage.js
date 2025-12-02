import BasePage from '../BasePage';
import { config } from '../../config/testConfig.js';
import { ensureTokens } from '../../utils/global-setup.js';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
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

  // async verifyLogout() {
  //   await this.page.goto('/dashboard');
  //   await expect(this.page.getByText('Access Denied')).toBeVisible();
  //   await expect(this.page.getByText('Sorry, it seems you are not permitted to see this.')).toBeVisible();
  // }

  async assertCredentialsFilled(expectedEmail, expectedPassword) {
    const emailValue = await this.getEmailInputValue();
    const passwordValue = await this.getPasswordInputValue();
    expect(emailValue).toBe(expectedEmail);
    expect(passwordValue).toBe(expectedPassword);
  }

}

