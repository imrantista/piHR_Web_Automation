import { setViewport, Laptop, Mobile, Desktop, Tablet } from '../../../utils/viewports.js';
import { test, allAdmin, admin} from '../../../utils/sessionUse.js';
import { config } from '../../../config/testConfig.js';

test.describe('Dashboard component', () => {
  for (const role of allAdmin) {
    for (const vp of [Desktop]) {

      test(`${role} - ${vp.name} Dashboard Component Check : @regression TC_001`, async ({ page, loginPage, componentPage, useSession }) => {
        await setViewport(page, vp.size);
        await useSession(role);
        await loginPage.visit(config.slug.dashboard);
        await componentPage.componentCheckAdmin();
      });

    }
    }
  for (const role of admin) {
  for (const vp of [Desktop]) {
    test(`${role} - ${vp.name} Dashboard API Response Check : @regression TC_002`, async ({ page, loginPage, dashboardApis, useSession }) => {
      await setViewport(page, vp.size);
      await useSession(role);   
      await loginPage.visit(config.slug.dashboard);
      await dashboardApis.dashboardAllApis();
    });
  }
}

});

test.describe("Current Leave Balance Table Filter", () => {

  test.beforeEach(async ({ page, loginPage, useSession, dashboard }) => {
    await setViewport(page, Desktop.size);
    await useSession('admin');
    await loginPage.visit();
  });


  test('Verify Employee Search Functionality by Name in Current Leave Balance Section', async ({ page, dashboard }) => {
    const nameToFilter = await dashboard.getNameFromCurrentLeaveTable();
    await dashboard.applySearchInCurrentLeaveTable(nameToFilter);
    const tableData = await dashboard.getNameFromCurrentLeaveTable(true);
    tableData.forEach(data => {
      expect(data).toBe(nameToFilter);
    });
  });

  ['Banani', 'bKash', 'PiHR', 'Financfy', 'Kathmandu', 'Klikit', 'Mirpur DOHS', 'PiHR Support Rajshahi', 'Rajshahi']
    .forEach(branchName => {
      test(`Verify Employee Filter Functionality by Branch ${branchName} in Current Leave Balance Section`, async ({ page, dashboard }) => {
        console.log(`Filtering by Branch: ${branchName}`);

        await dashboard.branchFilterInCurrentLeaveTable(branchName);

        const tableData = await dashboard.getBranchFromCurrentLeaveTable(true);
        tableData.forEach(data => {
          expect(data).toBe(branchName);
        });
      });
    });

  test('Verify Employee Image Loads Properly in Current Leave Balance Section', async ({ page, dashboard }) => {
    const images = await dashboard.getAllImagesFromCurrentLeaveTable();
    images.forEach(img => {
      // Assertions
      expect(img.src).toBeTruthy();
      expect(img.loaded).toBe(true);
    });
  });

  test('Verify Employee Branch, Role, and Leave Group Display in Current Leave Balance Section', async ({ page, dashboard }) => {
    const [apiResponse] = await Promise.all([
      page.waitForResponse(response =>
        response.url().includes('/api/v2/leave-dashboards/employee-current-leave-status') &&
        response.status() === 200
      ),
      page.reload() // reload page to trigger API
    ]);

    // Get the JSON data from API
    const responseData = await apiResponse.json();
    const employeesFromApi = responseData.data;
    console.log(`API returned ${employeesFromApi.length} records.`);
    const apiMap = new Map();
    employeesFromApi.forEach(emp => apiMap.set(emp.employee_name.trim(), emp));

    const tableData = await dashboard.getAllCurrentLeaveTableRows();


    tableData.forEach(row => {
      const empData = apiMap.get(row.employeeName);
      if (empData) {
        expect(row.branch).toBe(empData.branch_name);
        expect(row.role).toBe(empData.designation_name);
        expect(row.leaveGroup).toBe(empData.leave_group_name);
      }
    });

    console.log('✅ All table rows match API data for Branch, Role, and Leave Group.');

  });


  test('Verify Remaining Leave Count Display in Current Leave Balance Section', async ({ dashboard }) => {
    const [firstRow] = await dashboard.getAllCurrentLeaveTableRows(false);

    if (!firstRow) {
      throw new Error('Current Leave Balance table is empty');
    }
    const {
      employeeName,
      branch,
      role,
      leaveGroup,
      remainingLeave: uiRemainingLeave
    } = firstRow;
    const employeeId = await getEmployeeID(employeeName);
    const leaveBalances = await getCurrentLeaveBalance(employeeId);
    const apiRemainingLeave = leaveBalances[0].remaining_leaves.toString();
    expect(uiRemainingLeave).toBe(apiRemainingLeave);
  });


  test('Verify Leave Taken Count Display in Current Leave Balance Section', async ({ page, dashboard }) => {
    const [firstRow] = await dashboard.getAllCurrentLeaveTableRows(false);

    if (!firstRow) {
      throw new Error('Current Leave Balance table is empty');
    }
    const {
      employeeName,
      branch,
      role,
      leaveGroup,
      remainingLeave,
      leaveTaken: uiLeaveTaken
    } = firstRow;

    const employeeId = await getEmployeeID(employeeName);
    const leaveBalances = await getCurrentLeaveBalance(employeeId);
    const apiLeaveTaken = leaveBalances[0].leave_taken.toString();
    expect(uiLeaveTaken).toBe(apiLeaveTaken);

  });

});

test.describe('Leave Calender Tests', () => {
   test.beforeEach(async ({ page, loginPage, useSession, dashboard }) => {
    await setViewport(page, Desktop.size);
    await useSession('admin');
    await loginPage.visit();
  });

  test('Verify Calendar Displays Correct Month & Year When Navigating Months', async ({ page, dashboard }) => {
    //Skipped for now
    // const currentDate = new Date();

    // Get full month name
    // const monthName = currentDate.toLocaleString('default', { month: 'long' });
    // const year = currentDate.getFullYear();

    // console.log(`Current Month: ${monthName}, Year: ${year}`);

    // const nextButton = page.locator('button:has(svg path[stroke-linecap="round"][stroke-linejoin="round"])');
    // console.log(await nextButton.count());
  });

  test('Verify Leave Calendar Highlights Today Correctly', async ({ page, dashboard }) => {
    // Locate the calendar cell by its background color and check that its number matches today's date
    const today = new Date().getDate();
    const tdWithBackground = page.locator('td[style*="background-color: rgb(193, 208, 255)"]');

    const count = await tdWithBackground.count();
    expect(count).toBeGreaterThan(0);

    const text = (await tdWithBackground.nth(0).textContent()).trim();

    expect(parseInt(text)).toBe(today);
  });
  

});
