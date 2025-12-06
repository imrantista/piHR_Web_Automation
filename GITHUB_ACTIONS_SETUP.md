# GitHub Actions CI Setup Guide

This project has two GitHub Actions workflows for running Playwright E2E tests:

1. **`CI Playwright (Node)`** — Simpler, faster (runs on Node runner)
2. **`CI_PIHR-docker`** — Uses Docker, generates full Allure HTML reports, publishes to GitHub Pages

## Quick Setup (5 minutes)

### Step 1: Add Repository Variables

Go to: **Settings → Secrets and variables → Actions → Variables** and click "New repository variable"

Add these variables:

| Variable Name | Value | Example |
|---|---|---|
| `BASE_URL_PIHR_PROD` | Your production URL | `https://pihr.example.com` |
| `BASE_URL_PIHR_QA` | Your QA URL | `https://pihr-qa.example.com` |

### Step 2: Add Repository Secrets

Go to: **Settings → Secrets and variables → Actions → Secrets** and click "New repository secret"

Add these secrets:

| Secret Name | Value | Notes |
|---|---|---|
| `ADMIN_EMAIL` | Admin user email | For login tests |
| `ADMIN_PASSWORD` | Admin password | For login tests |
| `EMPLOEE_EMAIL` | Employee email | (Note: typo in current code; we can fix this) |
| `EMPLOYEE_PASSWORD` | Employee password | For login tests |
| `SMTP_USERNAME` | SMTP username | (Only needed if using Docker workflow with email) |
| `SMTP_PASSWORD` | SMTP password | (Only needed if using Docker workflow with email) |

### Step 3: Run the Workflow

**Option A: Automatic (push trigger)**
- Push to `main` branch → workflow runs automatically

**Option B: Manual trigger**
- Go to **Actions** tab
- Choose `CI Playwright (Node)` or `CI_PIHR-docker`
- Click "Run workflow"
- Select `target_env` (PIHR_PROD, PIHR_QA, PIHR_DEV)
- Click "Run workflow"

### Step 4: View Results

Once the workflow completes:

1. Go to **Actions** → click the completed run
2. Scroll down to **Artifacts** section
3. Download:
   - `allure-results-<ID>` — Raw Allure results
   - `playwright-report-<ID>` — Playwright HTML report

### Generate Allure HTML locally

After downloading `allure-results-<ID>`:

```bash
# Install Java (required for Allure CLI)
# On macOS: brew install java
# On Ubuntu: sudo apt-get install openjdk-17-jre
# On Windows: download from openjdk.java.net

# Generate and open Allure report
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## Workflow Comparison

### `CI Playwright (Node)` ✨ (Recommended for quick feedback)
- **Runner:** Ubuntu (GitHub-hosted)
- **Time:** ~5-10 minutes
- **Output:** Allure results + Playwright HTML report (download from Artifacts)
- **Cost:** Minimal (free tier includes 2,000 minutes/month)
- **Best for:** Quick feedback, development, PRs

### `CI_PIHR-docker` 🐳 (Full report + history)
- **Runner:** Ubuntu + Docker
- **Time:** ~10-15 minutes (includes Docker build)
- **Output:** Full Allure HTML published to **GitHub Pages**
- **Cost:** Minimal (includes Docker build time)
- **Features:** 
  - Allure history tracking
  - Email reports
  - Published report URL
- **Best for:** Production runs, final verification, report archiving

## Environment Defaults

- **Push to `main`** → defaults to `PIHR_PROD`
- **Manual run** → you can select environment (PIHR_PROD, PIHR_QA, PIHR_DEV)
- **Override via workflow input** → during manual run

## Troubleshooting

### Error: "BASE_URL not set for PIHR_PROD"
→ Missing `BASE_URL_PIHR_PROD` Variable. Add it in Settings → Variables

### Error: "ADMIN_EMAIL" is empty
→ Missing `ADMIN_EMAIL` Secret. Add it in Settings → Secrets

### Tests timeout or fail to start browser
→ Try the Docker workflow instead (`CI_PIHR-docker`), which has all Playwright dependencies pre-installed

### No test results generated
→ Check the workflow logs for errors. Download Playwright report from Artifacts to see details.

## Advanced: Publishing to GitHub Pages

The Docker workflow (`CI_PIHR-docker`) can auto-publish Allure reports to GitHub Pages:

1. Go to **Settings → Pages**
2. Choose **Deploy from branch** (default) or **GitHub Actions**
3. Select `gh-pages` branch
4. Allure reports will be published at: `https://<username>.github.io/<repo-name>/projects/`

## Next Steps

- [ ] Add repository Variables (BASE_URL_PIHR_PROD, BASE_URL_PIHR_QA)
- [ ] Add repository Secrets (ADMIN_EMAIL, ADMIN_PASSWORD, EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD)
- [ ] Push to `main` or manually trigger workflow
- [ ] Download and verify test results
- [ ] (Optional) Enable GitHub Pages for full Allure reports

---

**Questions?** Check the workflow files:
- `.github/workflows/ci-playwright-node.yml` — Node-based workflow
- `.github/workflows/ci-docker-pipeline.yml` — Docker-based workflow with full Allure publishing
