import { expect } from '@playwright/test';
import fs from "fs";
import path from "path";
import pdfParse from 'pdf-parse';
import { getViewportNameFromPage } from '../utils/viewports.js';
import { allure } from 'allure-playwright';
import apiMap from '../api/apiMap.js';
import { getAuthTokenForRole } from '../utils/fetchApiRoleUtils.js';
import fs from 'fs';
import path from "path";
const ENV = process.env.ENV || "PIHR_PROD";

export default class BasePage {
  constructor(page, context) {
    this.page = page;
    this.context = context;
    this.defaultTimeout = 20000;
  }
// verify API response against expected values from apiMap
  async verifyApiResponse(apiEndpoint, method, actualResponse, requestBody = null) {
    const env = process.env.ENV || 'PIHR_PROD';
    //const expectedApi = apiMap[env][apiEndpoint];
    const expectedApi = apiMap[apiEndpoint];
    
    if (!expectedApi) {
      throw new Error(`API endpoint "${apiEndpoint}" not found in apiMap for environment ${env}`);
    }

    if (!method || !expectedApi.methods[method]) {
      throw new Error(`Method "${method}" not supported for API endpoint "${apiEndpoint}"`);
    }

    const expectedStatus = expectedApi.methods[method].expectedStatus;
    let actualResponseBody;
    
    try {
      actualResponseBody = await actualResponse.json();
    } catch (e) {
      actualResponseBody = await actualResponse.text();
    }

    // Prepare detailed response information
    const responseDetails = {
      request: {
        endpoint: expectedApi.url,
        method: method,
        body: requestBody
      },
      expected: {
        status: expectedStatus,
        ...expectedApi.methods[method]
      },
      actual: {
        status: actualResponse.status(),
        headers: actualResponse.headers(),
        body: actualResponseBody
      },
      timestamp: new Date().toISOString()
    };

    console.log(`\n🔍 API Response Comparison:`);
    console.log(`🌐 Captured API: ${actualResponse.url()} → Method: ${method}`);
    console.log(`🔗 Expected API: ${expectedApi.url} → Method: ${method}`);
    console.log('📌 Expected Status:', expectedStatus);
    console.log('📌 Actual Status:', actualResponse.status());

    // Method-specific status code validation
    expect(actualResponse.status(), `Expected ${expectedStatus} but got ${actualResponse.status()} for ${method} ${expectedApi.url}`)
      .toBe(expectedStatus);

    // Add detailed report to Allure
    await allure.attachment(
      `API Response Details - ${method} ${apiEndpoint}`,
      JSON.stringify(responseDetails, null, 2),
      'application/json'
    );

    // Return the response details for any additional custom validations
    return responseDetails;
  }

  // Helper method to wait for and verify API response
  async waitForAndVerifyApi(apiEndpoint, method, urlPattern, requestBody = null) {
    console.log(` Waiting for API response → ${apiEndpoint} (${method})`);

    let response;
    try {
      response = await this.page.waitForResponse(
        res => res.url().match(urlPattern) && res.request().method() === method,
        { timeout: this.defaultTimeout }
      );
    } catch {
      throw new Error(`⏱ Timeout waiting for API "${apiEndpoint}" after ${this.defaultTimeout}ms.`);
    }

    console.log(` API Captured → ${response.url()} (${response.status()})`);
    return this.verifyApiResponse(apiEndpoint, method, response, requestBody);
  }

// 🔹 Get the friendly viewport name using the shared util
 #_viewportName() {
  return getViewportNameFromPage(this.page); // 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile'
}

  // 🔹 Accepts:
  //   - a single locator
  //   - a map { default, Desktop, Laptop, Tablet, Mobile }
  //   - or a map where any entry is an array of locators
  #_resolveLocator(locatorOrMap) {
    // Case 1: direct single locator
    if (locatorOrMap && typeof locatorOrMap.click === 'function' && typeof locatorOrMap.waitFor === 'function') {
      return [locatorOrMap]; // normalize to array
    }

    // Case 2: map-based locator
    const vp = this.#_viewportName();
    const map = locatorOrMap || {};

    // Resolve viewport-specific locator(s)
    const resolved =
      map[vp] ||
      map.default ||
      map.Desktop ||
      map.Laptop ||
      map.Tablet ||
      map.Mobile;

    if (!resolved) return null;

    // Normalize to array
    return Array.isArray(resolved) ? resolved : [resolved];
  }

  /* ---------------------------
   * 🔹 Core Actions
   * --------------------------- */
/*await this.expectAndClick(
  {
    default: this.loginBtnDesktop,
    Tablet: this.threedot, this.loginBtnTablet,
    Mobile:  this.loginBtnMobile,
  },
  'Login Button'
);*/

  async expectAndClick(
    locatorOrMap,
    alias = "element",
    apiKeyWithMethod = null, // optional: 'loginApi:POST'
    {
      maxAttempts = 1,
      delay = 500,
      detectApi = true,   // auto-detect API calls
      timeout = 5000      // configurable timeout
    } = {}
  ) {
    const locators = this.#_resolveLocator(locatorOrMap);
    if (!locators || !locators.length) {
      throw new Error(`expectAndClick: no locator(s) resolved for [${alias}]`);
    }

    const vp = this.#_viewportName();

    // --- Parse apiKeyWithMethod (optional API assertion)
    let apiAssertion = null;
    if (apiKeyWithMethod) {
      const [apiKey, methodOverride] = apiKeyWithMethod.split(":");
      if (!apiMap[apiKey]) throw new Error(`API key '${apiKey}' not found in apiMap`);

      const apiEntry = apiMap[apiKey];
      const method = methodOverride
        ? methodOverride.toUpperCase()
        : Object.keys(apiEntry.methods)[0];
      const expectedStatus = apiEntry.methods[method]?.expectedStatus || 200;
      apiAssertion = { url: apiEntry.url, method, expectedStatus };
    }

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        let response = null;

        // Sequentially click all locators (if multiple)
        for (let i = 0; i < locators.length; i++) {
          const locator = locators[i];
          const stepAlias = locators.length > 1 ? `${alias} (Step ${i + 1})` : alias;

          await locator.waitFor({ state: "visible", timeout: this.defaultTimeout });

          const text =
            (await locator.innerText().catch(() => ""))?.trim() ||
            (await locator.getAttribute("aria-label").catch(() => "")) ||
            (await locator.getAttribute("alt").catch(() => "")) ||
            stepAlias;

          if (detectApi && i === locators.length - 1) {
            try {
              if (apiAssertion) {
                // Keep single API logic for apiAssertion
                const waitForResponseFn = (response) =>
                  response.url().startsWith(apiAssertion.url) &&
                  response.request().method().toUpperCase() === apiAssertion.method;

                const results = await Promise.allSettled([
                  locator.click(),
                  this.page.waitForResponse(waitForResponseFn, { timeout }),
                ]);
                response = results.find((r) => r.status === "fulfilled" && r.value?.url)?.value || null;

              } else {
                // --- CHANGE: capture ALL APIs
                const collectedResponses = [];
                const listener = (response) => {
                  const u = new URL(response.url());
                  if (u.hostname.includes("cdn.80.lv")) return;
                  if (u.hostname.includes("consent-api.xsolla.com")) return;
                  if (u.href.includes("/api/updpromos")) return;
                  if (u.href.includes("/upload/promo")) return;
                  if (u.href.includes("/upload/post")) return;
                  if (u.href.includes("/upload/vendor")) return;
                  if (u.href.includes("/updpromos")) return;
                  if (u.href.includes("/upload")) return;
                  const pathIsApi = u.pathname.replace(/^\//, "").toLowerCase().startsWith("api");
                  const firstLabel = u.hostname.split(".")[0].toLowerCase();
                  const hostIsApi = /^api(\d+)?(?:$|-)/.test(firstLabel) || /-api$/.test(firstLabel);
                  if (pathIsApi || hostIsApi) collectedResponses.push(response);
                };

                this.page.on("response", listener);
                await locator.click();
                await this.page.waitForTimeout(1000); // small wait to catch all APIs
                this.page.off("response", listener);

                response = collectedResponses;
              }
            } catch {
              response = null;
            }
          } else {
            await locator.click();
          }


          console.log(`✅ Clicked [${stepAlias} @ ${vp}] → "${text}"`);
        }

        if (response && apiAssertion) {
          // single API assertion
          const actualStatus = response.status();
          console.log(`🌐 Captured API: ${response.url()} → Method: ${response.request().method()} | Status: ${actualStatus}`);
          console.log(`🔗 Expected API: ${apiAssertion.url} → Method: ${apiAssertion.method} | Status: ${apiAssertion.expectedStatus}`);
          const passed = actualStatus === apiAssertion.expectedStatus;
          console.log(`✅Assertion API: ${passed ? "Passed " : "Failed ❌"}`);
          if (!passed) throw new Error(`API assertion failed for ${apiAssertion.url}`);
        } else if (response) {
          // --- FIX: handle array of responses
          const responses = Array.isArray(response) ? response : [response];
          responses.forEach((res) => {
            console.log(`🌐 Captured API → ${res.request().method()} ${res.url()} | Status: ${res.status()}`);
          });
        }

        // --- Allure attachments
        if (response) {
          const responses = Array.isArray(response) ? response : [response];

          for (const res of responses) {
            if (!res) continue;

            const req = res.request();
            const curl = [
              `curl -X ${req.method()}`,
              ...Object.entries(req.headers()).map(([k, v]) => `-H "${k}: ${v}"`),
              req.postData() ? `-d '${req.postData()}'` : "",
              `'${res.url()}'`,
            ]
              .filter(Boolean)
              .join(" \\\n  ");

            await allure.attachment("API Request (cURL)", Buffer.from(curl, "utf-8"), "text/plain");

            try {
              const bodyText = await res.text();
              let pretty;
              try {
                pretty = JSON.stringify(JSON.parse(bodyText), null, 2);
              } catch {
                pretty = bodyText;
              }
              await allure.attachment("API Response", Buffer.from(pretty, "utf-8"), "application/json");
            } catch (e) {
              console.warn("Failed to attach response body:", e.message);
            }
          }
        }

        // RETURN CAPTURED RESPONSES
        if (response) {
          const finalResponses = Array.isArray(response) ? response : [response];
          return finalResponses.filter(r => r && r.url);
        }

        return []; // no API captured
      } catch (err) {
        if (attempt === maxAttempts) throw err;
        console.warn(`Retrying click (${attempt}/${maxAttempts}) for [${alias} @ ${vp}]...`);
        await this.page.waitForTimeout(delay);
      }
    }
  }
  async waitAndFill(locatorOrMap, value, alias = 'element', timeout = this.defaultTimeout) {
    const locators = this.#_resolveLocator(locatorOrMap);

    // ✅ Handle case where locator isn't provided — just type directly
    if (!locators || !locators.length) {
      console.warn(`⚠️ No locator resolved for [${alias}], typing directly...`);
      const fillValue =
        typeof value === 'object' && value !== null
          ? (value.text || value.value || '')
          : String(value);
      await this.page.keyboard.type(fillValue);
      console.log(`✅ Typed directly [${alias}] → "${fillValue}"`);
      return;
    }

    const vp = this.#_viewportName();
    const lastLocator = locators[locators.length - 1];

    // Handle multistep locators
    for (let i = 0; i < locators.length - 1; i++) {
      const stepAlias = `${alias} (Step ${i + 1})`;
      await locators[i].waitFor({ state: 'visible', timeout });
      await locators[i].click();
      console.log(`✅ Clicked [${stepAlias} @ ${vp}] to reach input`);
    }

    await lastLocator.waitFor({ state: 'visible', timeout });

    const label =
      (await lastLocator.getAttribute('name').catch(() => '')) ||
      (await lastLocator.getAttribute('placeholder').catch(() => '')) ||
      (await lastLocator.innerText().catch(() => '')).trim();

    // 🧠 Handle value smartly
    let fillValue;

    if (typeof value === 'string' || typeof value === 'number') {
      fillValue = String(value);
    }
    else if (typeof value === 'object' && value !== null) {
      // 👇 Infer field from alias if userModel is passed
      const key = alias.toLowerCase();
      if (key in value) {
        fillValue = String(value[key]);
      }
      else if ('text' in value) {
        fillValue = String(value.text);
      }
      else if ('value' in value) {
        fillValue = String(value.value);
      }
      else {
        throw new Error(`waitAndFill: alias "${alias}" not found in provided object.`);
      }
    }
    else {
      throw new Error(
        `waitAndFill: Unsupported value type for [${alias}] → ${typeof value}`
      );
    }

    await lastLocator.fill(fillValue);
    console.log(`✅ Filled [${alias} @ ${vp}] → "${label || 'Unnamed field'}" with: "${fillValue}"`);
  }




  /* ---------------------------
   * 🔹 Assertions
   * --------------------------- */

  /*await this.assert({
  locator: this.loginBtn,
  state: 'visible',
  toHaveText: 'Log In'
});

await this.assert({
  locator: this.loginBtn,
  toHaveText: 'Log In',
  alias: 'Login Button'
});

await this.assert({
  toHaveURL: 'https://example.com/dashboard',
  alias: 'Dashboard Page'
});*/

  async assert(options = {}, page = this.page) {
    const {
      locator: locatorOrMap,
      state,
      toHaveText,
      toContainText,
      toHaveURL,
      count,
      toHaveValue,
      toHaveAttribute,
      alias = 'locator',
    } = options;

    const locators = this.#_resolveLocator(locatorOrMap); // resolves viewport-specific
    if (!(locators && locators.length) && !toHaveURL) {
      throw new Error(`❌ assert: no locator(s) resolved for [${alias}]`);
    }

    const vp = this.#_viewportName();
    // const target = locators[locators.length - 1]; // always last element for assertion
    const target = (locators && locators.length) ? locators[locators.length - 1] : null;
    // Click intermediate steps if more than 1
    // if (locators.length > 1) {
    if (locators && locators.length > 1) {
      for (let i = 0; i < locators.length - 1; i++) {
        const stepLocator = locators[i];
        const stepAlias = `${alias} (Step ${i + 1})`;

        if (await stepLocator.isVisible()) {
          await stepLocator.scrollIntoViewIfNeeded();
          await stepLocator.click();
          console.log(`✅ Clicked [${stepAlias} @ ${vp}]`);
          await this.page.waitForTimeout(300); // small delay for UI
        }
      }
    }
    // --- Perform assertions on final target ---
    if (target && state) {
      await target.waitFor({ state: 'visible', timeout: this.defaultTimeout });
      await expect(target).toBeVisible({ timeout: this.defaultTimeout });
      console.log(`✅ Assert: element is visible [${alias} @ ${vp}]`);
    }

    if (target && toHaveText) {
      await expect(target).toHaveText(toHaveText);
      console.log(`✅ Assert: element [${alias} @ ${vp}] has exact text "${toHaveText}"`);
    }

    if (target && toContainText) {
      await expect(target).toContainText(toContainText);
      console.log(`✅ Assert: element [${alias} @ ${vp}] contains text "${toContainText}"`);
    }

    if (target && typeof count === 'number') {
      await expect(target).toHaveCount(count);
      console.log(`✅ Assert: element [${alias} @ ${vp}] count is ${count}`);
    }

    if (target && toHaveValue) {
      await expect(target).toHaveValue(toHaveValue);
      console.log(`✅ Assert: element [${alias} @ ${vp}] has value "${toHaveValue}"`);
    }

    if (target && toHaveAttribute) {
      const [attr, value] = Object.entries(toHaveAttribute)[0];
      await expect(target).toHaveAttribute(attr, value);
      console.log(`✅ Assert: element [${alias} @ ${vp}] has attribute [${attr}] = "${value}"`);
    }

    if (toHaveURL) {
      await expect(page).toHaveURL(toHaveURL);
      console.log(`✅ Assert: page URL is "${toHaveURL}"`);
    }
  }
  // Automatically scrolls until element is visible or reaches page bottom

  async scrollUntilVisible(locator, alias, options = {}) {
    const {
      maxScrollAttempts = 10,
      scrollPixels = 300,
      scrollWaitTime = 200
    } = options;

    for (let i = 0; i < maxScrollAttempts; i++) {
      // Check if element is already visible
      const isVisible = await locator.isVisible({ timeout: 1000 }).catch(() => false);
      if (isVisible) {
        return true;
      }

      // Scroll down
      await this.page.evaluate((pixels) => {
        window.scrollBy(0, pixels);
      }, scrollPixels);

      await this.page.waitForTimeout(scrollWaitTime);

      // Check if we've hit bottom of page
      const isAtBottom = await this.page.evaluate(() => {
        return window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight;
      });

      if (isAtBottom && !isVisible) {
        throw new Error(`Element "${alias}" not found after scrolling entire page`);
      }
    }
    throw new Error(`Element "${alias}" not found after ${maxScrollAttempts} scroll attempts`);
  }

  //Asserts element visibility with auto-scrolling
  async assertWithScroll(params, scrollOptions = {}) {
    await this.scrollUntilVisible(params.locator.default, params.alias, scrollOptions);
    await this.assert(params);
  }

  //Reset page scroll to top
  async scrollToTop() {
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  /////

  async saveNumberFromLocatorSpanValue(labelToSubPathMap) {
    const baseDir = path.resolve(process.cwd(), "saveData/txt");
    const results = {};
  
    for (const [labelText, subPath] of Object.entries(labelToSubPathMap)) {
      const labelSpan = this.page.getByText(labelText, { exact: true });
      const numberSpan = labelSpan.locator("xpath=preceding-sibling::span");
  
      const text = (await numberSpan.textContent())?.trim();
  
      if (!text || isNaN(text)) {
        throw new Error(`Invalid value for "${labelText}": "${text}"`);
      }
  
      const value = Number(text);
  
      const filePath = path.join(baseDir, subPath);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, String(value), "utf8");
  
      results[labelText] = value;
      // console.log(results);  
      console.log("Final collected values:", results);
    }
      // ✅ Eligibility check (AFTER all values are collected)
  if (results["Leave Remaining"] > 0) {
    console.log("✅ Eligible for Leave");
  } else {
    console.log("❌ Not Eligible for Leave");
  }

  
    return results;
  }

async saveTextFromDivLocators() {
  const filePath = path.resolve(
    process.cwd(),
    "saveData",
    "txt",
    "supervisor",
    "supervisorinfo.txt"
  );

  // auto create folder
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const supervisorContainer = this.page.locator("div.flex.flex-col.items-start");
  const infoLines = await supervisorContainer.locator("> div").allTextContents();

  if (infoLines.length < 3) {
    throw new Error(
      `❌ Supervisor info incomplete. Expected 3 lines but got ${infoLines.length}`
    );
  }

  const [supervisor_name, designation_name, supervisor_code] = infoLines.map(t =>
    (t ?? "").trim()
  );

  const payload = {
    supervisor_name,
    designation_name,
    supervisor_code,
  };

  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");

  console.log("✅ Supervisor info saved (JSON) at:", filePath);
  console.log(supervisor_name);
  console.log(designation_name);
  console.log(supervisor_code);
  
  return payload;
}

async compareApiJsonWithTxtFiles({
  apiJsonSubPath,
  apiArrayPath = null,
  apiDataPath = null,
  apiIndex = 0,
  comparisons = [],
}) {
  const apiBaseDir = path.resolve(process.cwd(), "SaveData/apiResponse");
  const txtBaseDir = path.resolve(process.cwd(), "SaveData/txt");

  const apiFilePath = path.join(apiBaseDir, apiJsonSubPath);

  // ---------- Read API JSON ----------
  const apiRaw = fs.readFileSync(apiFilePath, "utf8");
  const apiData = JSON.parse(apiRaw);

  let apiItem;

  // ---------- Resolve API SOURCE ----------
  if (apiArrayPath) {
    const apiArray = apiArrayPath
      .split(".")
      .reduce((obj, key) => (obj ? obj[key] : undefined), apiData);

    if (!Array.isArray(apiArray)) {
      throw new Error(`❌ API path "${apiArrayPath}" is not an array`);
    }

    if (!apiArray[apiIndex]) {
      throw new Error(
        `❌ API array index ${apiIndex} invalid at "${apiArrayPath}"`
      );
    }

    apiItem = apiArray[apiIndex];
  } else if (apiDataPath) {
    apiItem = apiDataPath
      .split(".")
      .reduce((obj, key) => (obj ? obj[key] : undefined), apiData);

    if (!apiItem || typeof apiItem !== "object") {
      throw new Error(`❌ API object not found at "${apiDataPath}"`);
    }
  } else {
    throw new Error("❌ Either apiArrayPath or apiDataPath must be provided");
  }

  console.log("\n========== API vs TXT/JSON COMPARISON ==========");

  for (const { label, apiField, txtSubPath, txtLineIndex = 0 } of comparisons) {
    const apiValue = String(apiItem?.[apiField] ?? "").trim();

    const txtPath = path.join(txtBaseDir, txtSubPath);

    if (!fs.existsSync(txtPath)) {
      throw new Error(`❌ TXT file not found: ${txtPath}`);
    }

    const raw = fs.readFileSync(txtPath, "utf8").trim();

    let uiValue = "";

    // ✅ If file content is JSON (even if extension is .txt)
    if (raw.startsWith("{") || raw.startsWith("[")) {
      const txtJson = JSON.parse(raw);
      uiValue = String(txtJson?.[apiField] ?? "").trim();
    } else {
      // ✅ Fallback: old line-based TXT
      const lines = raw
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);

      uiValue = String(lines[txtLineIndex] ?? "").trim();
    }

    if (!uiValue) {
      throw new Error(
        `❌ UI value not found for "${label}" (apiField="${apiField}") in ${txtSubPath}`
      );
    }

    console.log(
      `[${label}] UI: ${uiValue} | API: ${apiValue} | ${
        uiValue === apiValue ? "✅ MATCH" : "❌ MISMATCH"
      }`
    );

    expect(uiValue, `Mismatch for "${label}" → UI vs API.${apiField}`).toBe(apiValue);
  }

  console.log("===============================================");
  console.log("✅ All compared values MATCH (UI vs API)\n");
}
/* ---------------------------
   * 🔹 saveApiResponse
   * --------------------------- */

  /*
await this.saveApiResponse(
"myDashboardApi",//apiread from apimap
  "employee",//role
  path); //saveDestination file name
*/
async saveApiResponse(apiKey, role, outputFileName) {
  // 🔎 Validate API key
  const apiConfig = apiMap[apiKey];
  if (!apiConfig) {
    throw new Error(`❌ API key "${apiKey}" not found in apiMap`);
  }

  const url = apiConfig.url;

  // 🔑 Get role-based token
  const token = await getAuthTokenForRole(role);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    console.error("HTTP Error:", response.status, response.statusText);
    return;
  }

  const data = await response.json();

  const finalOutput = {
    apiKey,
    url,
    body: data,
  };

  // 📁 FIXED OUTPUT PATH
  const outputFolder = path.join(process.cwd(), "SaveData", "apiResponse");

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const outFilePath = path.join(outputFolder, outputFileName);

  fs.writeFileSync(outFilePath, JSON.stringify(finalOutput, null, 2));

  console.log(`✅ Saved API response: ${outFilePath}`);
}

// /* ---------------------------
//    * 🔹 assertStatus
//    * --------------------------- */

//   /*
// // await this.assertStatus(
// // "Tanzim Emon", [Employee Name]
// //  "Pending",//status ["Pending","Approved","Rejected"]
// // ); 


async assertStatus(employeeName, expectedStatus) {
  console.log(`🔍 Verifying status for employee: "${employeeName}"`);
  console.log(`📌 Expected status: "${expectedStatus}"`);

  const row = this.page.getByRole('row', { name: employeeName });

  // log if row exists
  const rowCount = await row.count();
  console.log(`🧾 Rows found for "${employeeName}": ${rowCount}`);

  const statusCell = row.getByRole('cell', { name: expectedStatus });

  // log status cell count
  const statusCount = await statusCell.count();
  console.log(`📊 Status cells found with "${expectedStatus}": ${statusCount}`);

  await expect(
    statusCell.first(),
    `❌ Status "${expectedStatus}" not found for ${employeeName}`
  ).toBeVisible();

  console.log(`✅ Status "${expectedStatus}" is visible for employee "${employeeName}"`);
}    

  // Download file from API response
  // Usage: await this.callAPI({ apiKey: 'downloadFileApi', method: 'GET', role: 'supervisor', expectFile: true, outputFileName: 'myfile.pdf' });
  // Note: Ensure the API is configured to return a file in the response
static TOKEN_FOLDER_MAP = {
    PIHR_PROD: "tokens&cookies_PIHR_PROD",
    PIHR_QA: "tokens&cookies_PIHR_QA",
  };

  static ROLE_FILE_MAP = {
    admin: "admin",
    employee: "employee",
    employeeAdmin: "employeeAdmin",
    supervisor: "supervisor",
  };

  static getTokenFolder() {
    const folder = this.TOKEN_FOLDER_MAP[process.env.ENV];
    if (!folder) throw new Error(`No token folder defined for ENV=${process.env.ENV}`);
    return path.join(process.cwd(), folder);
  }

  static getAuthTokenForRole(role) {
    const fileKey = this.ROLE_FILE_MAP[role];
    if (!fileKey)
      throw new Error(
        `Unknown role "${role}". Valid roles: ${Object.keys(this.ROLE_FILE_MAP).join(", ")}`
      );

    const tokenFolder = this.getTokenFolder();
    const filePath = path.join(tokenFolder, `${fileKey}.json`);
    if (!fs.existsSync(filePath)) throw new Error(`Token file not found: ${filePath}`);

    const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const authCookie = parsed.cookies?.find((c) => c.name === "auth");
    if (!authCookie?.value) throw new Error(`"auth" cookie not found for role "${role}"`);

    return authCookie.value;
  }

  // Delete all PDFs and JSONs in a folder
  static clearPDFandJSON(folder) {
    if (!fs.existsSync(folder)) return;
    const files = fs.readdirSync(folder);
    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      if (ext === ".pdf" || ext === ".json") {
        fs.unlinkSync(path.join(folder, file));
      }
    });
  }

  // Generic API call
  async callAPI({ apiKey, method = "GET", role, query = {}, headers = {}, expectFile = false, outputFileName }) {
    const api = apiMap[apiKey];
    if (!api) throw new Error(`API key "${apiKey}" not found in apiMap`);

    const token = BasePage.getAuthTokenForRole(role);
    const queryString = new URLSearchParams(query).toString();
    const url = queryString ? `${api.url}?${queryString}` : api.url;

    const response = await this.page.request.fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...headers },
    });

    const expected = api.methods[method]?.expectedStatus ?? 200;
    if (response.status() !== expected) {
      const ct = (response.headers()["content-type"] || "").toLowerCase();
      const body = ct.includes("json") || ct.includes("text") ? await response.text() : "[binary]";
      throw new Error(`API ${apiKey} failed with status ${response.status()}:\n${body}`);
    }

    if (expectFile) {
      const buffer = await response.body();
      const filePath = path.join(process.cwd(), outputFileName.replace(/[\\/:*?"<>|]/g, "_"));
      fs.writeFileSync(filePath, buffer);
      console.log(`File saved: ${filePath}`);
      return filePath;
    }

    return await response.json();
  }

  // Download PDF and convert to JSON (deletes all previous PDFs/JSONs)
  async downloadAndConvertPDF({ apiKey, role, prefix = "Report", month, year, outputFolder }) {
    if (!role) throw new Error("Role must be specified!");

    const folder = outputFolder || path.join(process.cwd(), "SaveData", "PDFtoJSON");
    fs.mkdirSync(folder, { recursive: true });

    // Delete all previous PDFs and JSONs
    BasePage.clearPDFandJSON(folder);

    const pdfFileName = `${prefix}_${month}_${year}.pdf`;
    const jsonFileName = `${prefix}_${month}_${year}.json`;

    // Download PDF
    const pdfPath = await this.callAPI({
      apiKey,
      role,
      headers: { Accept: "application/pdf" },
      expectFile: true,
      query: { month: Number(month), year, export_as_excel: false },
      outputFileName: pdfFileName,
    });

    // Convert PDF to JSON
    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(pdfBuffer);
    const lines = data.text.split("\n").map((l) => l.trim()).filter(Boolean);

    const jsonPath = path.join(folder, jsonFileName);
    fs.writeFileSync(jsonPath, JSON.stringify({ lines }, null, 2));

    console.log(`PDF downloaded at: ${pdfPath}`);
    console.log(`Converted JSON saved at: ${jsonPath}`);

    return { pdfPath, jsonPath };
  }
}
