import BasePage from '../BasePage';
import {config} from '../../config/testConfig.js';    

export class LoginPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.loginFrame = page.locator('iframe[title="Login Page"]');
    this.emailTxt = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('textbox', { name: 'Username/ Mobile' });
    this.passwordTxt = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('textbox', { name: 'Password' });
    this.loginBtn = page.locator('iframe[title="Login Page"]').contentFrame().getByRole('button', { name: 'Login' });
    this.profileLoggedIn= page.getByRole('img', { name: 'profile' });
    this.welcomeBackTxt= page.getByRole('heading', { name: 'Welcome Back' });
    this.myScreenTxt= page.getByRole('heading', { name: 'My Screen' });
  }

  async visit(slugKeyOrPath = '') {
    let path = '';
    if (config.slug[slugKeyOrPath]) {
      path = config.slug[slugKeyOrPath];
    } else {
      path = slugKeyOrPath;
    }
    const finalPath = path.startsWith('/') ? path : `/${path}`;
    await this.page.goto(finalPath, { waitUntil: 'networkidle' });
  }

  async globalLogin(username,password) {
    await this.emailTxt.fill(username);
    console.log("Email entered.");
    await this.passwordTxt.fill(password);
    console.log("Password entered.");
    await this.loginBtn.click();
    console.log("Login button clicked.");
  }
  async doLogin(username,password) {
    await this.waitAndFill(this.emailTxt,username,'Email');
    await this.waitAndFill(this.passwordTxt, password,'Password');
    await this.expectAndClick(this.loginBtn,'Login Button','loginApi:GET');
  }
  async assertLoginAdmin(){
    await this.assert({
        locator: {
          default: this.welcomeBackTxt,
        },
        state: 'visible',
        alias: 'Welcome back Text visible'
      });
  }
    async assertLoginEmployee(){
    await this.assert({
        locator: {
          default: this.myScreenTxt,
        },
        state: 'visible',
        alias: 'Welcome back Text visible'
      });
  }
}
