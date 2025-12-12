import BasePage from "../../BasePage";
import path from 'path';
import fs from 'fs';

export class monthWiseAttendancePage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
  }
  static TOKEN_FOLDER = path.join(process.cwd(), 'tokens&cookies_PIHR_PROD');
  static ROLE_FILE_MAP = {
    admin: 'admin',
    employee: 'employee',
    employeeAdmin: 'employeeAdmin',
    supervisor: 'supervisor',
  };
  static getAuthTokenForRole(role) {
    const fileKey = this.ROLE_FILE_MAP[role];
    if (!fileKey) throw new Error(`Unknown role "${role}". Valid roles: ${Object.keys(this.ROLE_FILE_MAP).join(', ')}`);
    const filePath = path.join(this.TOKEN_FOLDER, `${fileKey}.json`);
    if (!fs.existsSync(filePath)) throw new Error(`Token file not found for role "${role}" at path: ${filePath}`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    const authCookie = parsed.cookies?.find(c => c.name === 'auth');
    if (!authCookie?.value) throw new Error(`"auth" cookie not found for role "${role}"`);

    return authCookie.value;
  }
  async downloadMonthWiseAttendancePDF(month, year, role = 'supervisor') {
    const authToken = monthWiseAttendancePage.getAuthTokenForRole(role);
    const monthNum = typeof month === "number" ? month : Number(month);
    const pdfURL = `https://api.pihr.xyz/api/v2/self-service-reports/my-attendance?month=${monthNum}&year=${year}&export_as_excel=false`;
    const res = await this.page.request.get(pdfURL, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/pdf'
      }
    });
    if (res.status() !== 200) {
      const ct = (res.headers()['content-type'] || '').toLowerCase();
      const body = ct.includes('json') || ct.includes('text') ? await res.text() : '[non-text]';
      console.error("Status:", res.status());
      console.error("Body:", body);
      throw new Error(`Failed to download PDF: ${res.status()}`);
    }
    const buf = await res.body();
    const cd = res.headers()['content-disposition'] || '';
    const match = /filename\*?=(?:UTF-8''|")?([^";]+)"?/i.exec(cd);
    const fileName = match ? decodeURIComponent(match[1]) : `Attendance_${monthNum}_${year}.pdf`;
    const filePath = path.join(process.cwd(), fileName.replace(/[\\/:*?"<>|]/g, "_"));
    fs.writeFileSync(filePath, buf);
    console.log(`PDF downloaded via API at: ${filePath} using role: ${role}`);
    return filePath;
  }
}
