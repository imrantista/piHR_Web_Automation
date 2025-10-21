## ✅ Project Highlights

### 🚀 Environment-Specific Test Execution
- Supported execution across **Staging**, and **Production** environments.

### 🧩 Scalable Test Design
- Followed the **Page Object Model (POM)** for maintainable and modular test architecture.
- Enabled **tag-based test execution** using annotations like `@Smoke`, `@Sanity`, and `@Regression`.
- Implemented **priority-based execution** for test control.

### 🛠️ Test Enhancements
- Efficient **session handling** for login/auth workflows.
- Added **retry logic** and **soft assertions** to manage flaky tests and ensure test continuity.

### 📸 Reporting & Debugging
- Integrated with **Allure Reports**:
  - Captures **video recordings** and **screenshots** on test failures.
  - Provides interactive, visual reports for easier debugging.

### ⚙️ CI/CD Integration with GitHub Actions
- Configured CI/CD pipelines for **Dev**, **Staging**, and **Production** environments.
- Enabled **dependency caching** for faster pipeline runs.
- Sends **automated email reports** with allure and playwright report:
  - Test summaries
  - Failure details
  - Attached videos and screenshots for failed tests

### 🐳 Dockerized Playwright + Allure Setup
- Prebuilt Playwright image (mcr.microsoft.com/playwright) with Chromium, Firefox, WebKit, and all dependencies included.
- Allure integration:
  - Test results automatically saved into a shared volume (allure-results).
  - Allure report generated and viewable via Docker (allure + allure-ui services).
- Cross-platform environment switching:
  - Easily run tests against PROD, QA, or DEV by setting ENV.
-Lightweight & reproducible:
  - No need to install Playwright browsers or Allure locally — everything runs inside Docker.

## Code-Coverage

- Implemented using c8, nyc, and Istanbul to measure test coverage. It tracks which parts of the codebase are executed during automated tests, providing detailed reports on statements, branches, functions, and lines to ensure better test quality and maintainability.

# Testcase-Automation-plan-you-can-find-here
```
Add the testcases doc

```

## Pre-requisites

* Playwright requires Node.js version 18 or above. If you are using node version less than 18 then you can download Node.js version 18 or above from nvm (nvm allows you to easily switch between node versions depending on the project)

  * If you are not using nvm already, you can download it and install Node.js from [here](https://catalins.tech/node-version-manager-macos/)

## Setup

* Clone e2e-tests repository 
* `cd` into `tests/functional` and run the below commmands:
```
npm ci
npx playwright install
```
## .env Setup

* create a .env file in project root with this variable and give desired value:
```
ENV=PIHR_PROD
BASE_URL_PIHR_PROD=
BASE_URL_PIHR_QA=
ADMIN_EMAIL=
ADMIN_PASSWORD=''
```

## Playwright Commands

* To run all tests use `npx cross-env ENV=PIHR_QA playwright test` This would run all tests on PIHR staging environment
* To run all tests use `npx cross-env ENV=PIHR_PROD playwright test` This would run all tests on PIHR production environment

* You can change environment as per the requirement. Following are the configured environment values:

  * `PIHR_PROD`, `PIHR_QA`, `ADMIN_PROD`, `ADMIN_QA`, `PIHR_DEV`
  * `PIHR_PROD`, `PIHR_QA` point to one domain and `ADMIN_PROD`, `ADMIN_QA`, `PIHR_DEV` point to different domain


* To run a single test spec file use `npx cross-env ENV=PIHR_PROD playwright test 1_Login/login.spec.js`

* To run multiple test spec files use `npx cross-env ENV=PIHR_PROD playwright test 1_Login/login.spec.js addTemplate.spec.js`

* To run a single test inside spec file use test title `npx cross-env ENV=PIHR_PROD playwright test -g "Unsuccessful login"`

* By default tests run in headless mode if you want to run in headed browser add `--headed` at the end on your command
  * For example use `npx cross-env ENV=PIHR_PROD playwright test --headed`

* To run a specific test file with a tag filter (e.g., `@smoke`) in a headed browser, use:  
  `npx cross-env ENV=PIHR_QA playwright test 2_addProduct.spec.js --grep="@smoke" --headed`

* To debug a specific test file with a tag filter  in a headed browser, use:  
  `npx cross-env ENV=PIHR_QA playwright test 2_addProduct.spec.js --headed --debug`


#### Allure Reports
```
npx allure generate ./allure-results --clean -o ./allure-report
npx allure open ./allure-report
```
## Code-Coverage
```
npm run test:coverage
npm run coverage:report
start coverage/index.html
npx serve coverage
```
## Running Tests with Docker

* Install **Docker** and **Docker Compose**  on your machine.
* Build the containers:
```
docker compose build
```
Run the tests
Windows powershell
```
$env:ENV="PIHR_PROD"; docker compose run --rm e2e
```
Linux / macOS
```
ENV=PIHR_PROD docker compose run --rm e2e
```
windows cmd
```
set ENV=PIHR_PROD && docker compose run --rm e2e
```
👉 Replace PIHR_PROD with PIHR_QA or PIHR_DEV as needed & By default, if ENV is not provided, it runs against PROD.

* View the Allure report locally
```
docker compose up -d allure allure-ui
```
- Open:
  - API (service): http://localhost:5252/allure-docker-service
  - UI (Docker Allure web interface): http://localhost:5253/allure-docker-service-ui/projects/default
  - Full static report:http://localhost:5252/allure-docker-service/projects/default/reports/latest/index.html

## 📂 Project Folder Structure

    PIHR.WEBAUTOMATION/
    ├── .github/
    │ └── workflows/
    │     └── ci-automation-pipeline.yml # GitHub Actions CI/CD pipeline
    ├── config/ 
    | └── testConfig.js # # Config files (env/test setup)
    ├── lib/
    │ └── BaseTest.js # Base test class
    ├── pages/
    │ ├── BasePage.js # Page object base class
    │ └── LoginPage.js # Login page object
    ├── tests/
    │ └── functional/
    |       └── 1_Login/
    |           └── login.spec.js # Login test spec
    ├── utils/
    │ ├── global-setup.js # Global setup logic
    │ ├── sessionUse.js # Session handling
    │ └── viewports.js # Viewport configs
    ├── .babelrc # Babel config
    ├── .gitattributes # Git attributes
    ├── .gitignore # Git ignore rules
    ├── eslint.config.mjs # ESLint config
    ├── LICENSE # Project license
    ├── package-lock.json
    ├── package.json # Dependencies & scripts
    ├── playwright.config.js # Playwright config
    └── README.md # Project documentation

## How to Add a New Test Case

Follow the steps below to create and organize a new test case in this project:

* **Create a Page Object**

If the feature requires a new page, add a file inside the pages/ directory.

Example: pages/TestPage.js

This file should contain the locators and actions for that page.

* **Register the Page in BaseTest**

Go to lib/BaseTest.js.

Extend the base test by adding the new page so that it can be injected into your test cases.

This ensures the page is reusable across different specs.

📌 Name for this addition: Page Extension Setup

* **Write the Test Case**

Create a new test file under tests/functional/.

Example: tests/functional/test.spec.js

Write your test scenarios using the page objects you created and registered.

* **Use Helpers** (if needed)

Place any reusable functions, utilities, or custom logic inside the utils/ folder.

Example: session handling, viewport setup, API utilities, etc.

* **Keep Test Data Organized**

Store all test data, environment values, or constants in config/testConfig.js.

This helps keep test scripts clean and maintainable.

## Key Findings

* **Speed Comparison:** Playwright took ~28s, ~31s, ~33s  to run all 3 tests and averaged ~31 seconds. It was even more faster with paralell execution

* **Test Framework:** Playwright is more flexible and gives you more control over the test runner framework you choose

* **Additional Downloads:** Playwright has a native API for handling iframes or mobile device emulations without requiring any additional downloads or plugins.   

* **Test Recording:** Playwright uses codegen command to run the test generator followed by the URL of the website you want to generate tests for.
```npx playwright codegen```

* **Navigating to new Domain:** Playwright provides built-in support for cross-domain testing, making it easier to test scenarios that involve interactions between different domains or origins.

## Why Using Playwright in this Project

 Playwright has proven to be the most suitable choice. The selection between Playwright and Cypress depends on the system's requirements, considering factors such as browser support and the complexity of testing scenarios. Playwright's versatility and comprehensive browser compatibility make it ideal for diverse testing needs, while Cypress offers simplicity and ease of use for straightforward scenarios. It is crucial to evaluate these frameworks in relation to your project's unique demands to make an informed decision.

 Based on the specific scope of my web application, my application opens multipletab instance so playwright can handle that seamlessly. 