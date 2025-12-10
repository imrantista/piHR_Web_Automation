import BasePage from "../../BasePage.js";

export class VisitApplicationPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;

    // ---- COMPONENT LOCATORS ----
    this.leaveOverviewGraph = page.locator('div.flex.gap-1 > span.text-xs.font-bold.text-gray-400').first();
    this.supervisorName = page.locator('div.flex.flex-col > div.text-gray-900').first();
    this.expectedSupervisorName = 'Shabit -A -Alahi';
  }
  // Get Leave Remaining Count
  async getLeaveRemainingCount() {
    await this.leaveOverviewGraph.waitFor({ state: 'visible', timeout: 5000 });
    return await this.leaveOverviewGraph.innerText();
  }

  // Get Supervisor Name Text
  async getSupervisorName() {
    await this.supervisorName.waitFor({ state: 'visible', timeout: 5000 });
    return await this.supervisorName.innerText();
  }

    // Validate Supervisor Name
  async validateSupervisorName() {
    const actualName = await this.getSupervisorName();
    return actualName === this.expectedSupervisorName;
  }

  // Get Supervisor Name and log matched message
  async logSupervisorName() {
    const actualName = await this.getSupervisorName();
    if (actualName === this.expectedSupervisorName) {
      console.log(`✅ Supervisor Name matched: ${actualName}`);
    } else {
      console.log(`❌ Supervisor Name mismatch. Expected: ${this.expectedSupervisorName}, Actual: ${actualName}`);
    }
    return actualName;
  }
}

export default VisitApplicationPage;
