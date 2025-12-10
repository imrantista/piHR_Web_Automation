import BasePage from '../BasePage';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { readdirSync } from 'fs';


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
    await this.expectAndClick(this.logoutText, "Logout Text", "logoutApi:POST");
    const loginFrame = await this.page.locator('iframe[title="Login Page"]').contentFrame();
    const loginButton = loginFrame.getByRole('button', { name: 'Login' });

    await this.assert({
      locator: {
        default: loginButton,
      },
      state: 'visible',
      alias: 'Login button visible after logout'
    });
      const PREFIX = 'tokens&cookies_';
        const rootDir = process.cwd();
        const sessionDirs = readdirSync(rootDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory() && dirent.name.startsWith(PREFIX))
            .map(dirent => dirent.name);
        const sessionFiles = ['admin.json', 'employee.json', 'employeeAdmin.json', "supervisor.json"];
        for (const dir of sessionDirs) {
            for (const fileName of sessionFiles) {
                const sessionFilePath = join(rootDir, dir, fileName);
                try {
                    await unlink(sessionFilePath);
                    console.log(`Deleted session file: ${sessionFilePath}`);
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        console.log(`Session file not found (skipping): ${sessionFilePath}`);
                    } else {
                        console.error(`Failed to delete session file ${sessionFilePath}:`, err);
                    }
                }
            }
        }
  }
}