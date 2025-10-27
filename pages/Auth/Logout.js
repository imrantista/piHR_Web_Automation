import BasePage from '../BasePage';

export class Logout extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.profileMenu = page.getByRole('img', { name: 'profile' });
    this.logoutText = page.getByRole('menuitem', { name: 'Logout' });
  }

  async logoutFunc() {
    await this.expectAndClick(this.profileMenu, "Profile Menu");
    await this.expectAndClick(this.logoutText, "Logout Text");
    const loginFrame = await this.page.locator('iframe[title="Login Page"]').contentFrame();
    const loginButton = loginFrame.getByRole('button', { name: 'Login' });

    await this.assert({
      locator: {
        default: loginButton,
      },
      state: 'visible',
      alias: 'Login button visible after logout'
    });
  }
}