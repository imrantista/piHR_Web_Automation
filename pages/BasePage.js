import { expect } from '@playwright/test';
import { getViewportNameFromPage } from '../utils/viewports.js';
import { allure } from 'allure-playwright';
import apiMap from '../api/apiMap.js';

export default class BasePage {
  constructor(page, context) {
    this.page = page;
    this.context = context;
    this.defaultTimeout = 10000;
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
    Tablet:  this.loginBtnTablet,
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
          // Detect API only on the final click
          try {
            const waitForResponseFn = apiAssertion
              ? (res) =>
                  res.url().startsWith(apiAssertion.url) &&
                  res.request().method().toUpperCase() === apiAssertion.method
              : (res) => {
                  const u = new URL(res.url());
                  const pathIsApi = u.pathname.replace(/^\//, "").toLowerCase().startsWith("api");
                  const firstLabel = u.hostname.split(".")[0].toLowerCase();
                  const hostIsApi = /^api(\d+)?(?:$|-)/.test(firstLabel) || /-api$/.test(firstLabel);
                  return pathIsApi || hostIsApi;
                };

            const results = await Promise.allSettled([
              locator.click(),
              this.page.waitForResponse(waitForResponseFn, { timeout }),
            ]);
            response = results.find((r) => r.status === "fulfilled" && r.value?.url)?.value || null;
          } catch {
            response = null;
          }
        } else {
          await locator.click();
        }

        console.log(`✅ Clicked [${stepAlias} @ ${vp}] → "${text}"`);
      }

      // --- API assertion and Allure logging
      if (response && apiAssertion) {
        const actualStatus = response.status();
        console.log(`🌐 Captured API: ${response.url()} → Method: ${response.request().method()} | Status: ${actualStatus}`); 
        console.log(`🔗 Expected API: ${apiAssertion.url} → Method: ${apiAssertion.method} | Status: ${apiAssertion.expectedStatus}`); 
        const passed = actualStatus === apiAssertion.expectedStatus; 
        console.log(`✅Assertion API: ${passed ? "Passed " : "Failed ❌"}`);
        if (!passed) throw new Error(`API assertion failed for ${apiAssertion.url}`);
      } else if (response) {
        console.log(`🌐 Captured API → ${response.request().method()} ${response.url()} | Status: ${response.status()}`);
      }

      // --- Allure attachments
      if (response) {
        const req = response.request();
        const curl = [
          `curl -X ${req.method()}`,
          ...Object.entries(req.headers()).map(([k, v]) => `-H "${k}: ${v}"`),
          req.postData() ? `-d '${req.postData()}'` : "",
          `'${response.url()}'`,
        ]
          .filter(Boolean)
          .join(" \\\n  ");

        await allure.attachment("API Request (cURL)", Buffer.from(curl, "utf-8"), "text/plain");

        let bodyText = null;
        try { bodyText = await response.text(); } catch {}
        if (bodyText) {
          let pretty;
          try { pretty = JSON.stringify(JSON.parse(bodyText), null, 2); } catch { pretty = bodyText; }
          await allure.attachment("API Response", Buffer.from(pretty, "utf-8"), "application/json");
        }
      }

      return true;
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

async assert(options = {},page = this.page) {
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
}
