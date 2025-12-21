import { request, expect } from "@playwright/test";
import { API_BASE_URL } from '../playwright.config.js';
import { getAccessToken } from "./tokenHelper.js";
import apiMap from "../api/apiMap.js";

export async function getDataFromApi(endpoint, role = "admin", params = {}) {
   const token = getAccessToken(role);
   if (!token) {
      throw new Error('No auth token found for admin');
   }

   const apiContext = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
      },
   })

   const response = await apiContext.fetch(endpoint, {
      method: 'GET',
      params: params
   });
   if (!response.ok()) {
      throw new Error(`API request failed with status ${response.status()}: ${response.statusText()}`);
   }
   return await response.json();
}

export async function captureApiJson(page, apiKey, triggerFunc = null) {
   const apiEntry = apiMap[apiKey];
  if (!apiEntry) throw new Error(`API key "${apiKey}" not found in apiMap`);

  const url = apiEntry.url;
  const [apiResponse] = await Promise.all([
    page.waitForResponse(response =>
      response.url().includes(url) && response.status() === 200
    ),
    triggerFunc ? triggerFunc() : page.reload() // default trigger is page reload
  ]);

  const data = await apiResponse.json();
  return data;
}


export async function validateDashboardWithApi(apiLeaveInfo, apiSupervisorInfo) {
  const {
    leave_type_name,
    leave_taken,
    remaining_leaves,
    total_leaves
  } = apiLeaveInfo;

  const {
    supervisor_name,
    designation_name,
    supervisor_code
  } = apiSupervisorInfo;

  // ----------------------------------------
  // 🌿 LEAVE OVERVIEW VALIDATION
  // ----------------------------------------

  await expect(this.leaveOverview_remainingText)
    .toContainText(`${remaining_leaves} Leave Remaining`);

  await expect(this.leaveOverview_takenText)
    .toContainText(`${leave_taken} Leave Taken`);

  // ----------------------------------------
  // 🌿 REMAINING CARD VALIDATION
  // ----------------------------------------

  await expect(this.remaining_header).toBeVisible();

  await expect(this.page.getByText(leave_type_name)).toBeVisible();

  await expect(
    this.page.getByText(`${remaining_leaves}/${total_leaves}`)
  ).toBeVisible();

  // ----------------------------------------
  // 🌿 SUPERVISOR SECTION VALIDATION
  // ----------------------------------------

  await this.hierarchy_section.click();
  await this.hierarchy_supervisorTab.click();

  await expect(this.page.getByText(supervisor_name)).toBeVisible();
  await expect(this.page.getByText(designation_name)).toBeVisible();
  await expect(this.page.getByText(supervisor_code)).toBeVisible();
}
