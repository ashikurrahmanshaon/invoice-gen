# Invoice-Gen.net Analytics Engine

This is a secure, server-side reporting engine that aggregates data from Google Search Console, Google Analytics 4, and Microsoft Clarity into weekly/monthly Markdown, CSV, and JSON reports.

## Local Dashboard
You can view a local visual dashboard of the latest exported JSON data by opening:
`scripts/analytics/dashboard/index.html` in your browser.

## Required API Credentials

Because Invoice-Gen.net is a purely client-side static site, fetching analytics data directly in the browser is a massive security risk. This reporting engine is entirely server-side.

To connect the real APIs, you must provide the following credentials via `.env.local` or GitHub Secrets:

### 1. Google Cloud Setup (GSC & GA4)
You need a Google Service Account to programmatically fetch data.
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `invoice-gen-analytics`).
3. Enable the **Google Search Console API** and **Google Analytics Data API**.
4. Go to **IAM & Admin > Service Accounts** and create a new Service Account.
5. Create and download a **JSON Key**.
6. Stringify the JSON and add it to your `.env` file as `GOOGLE_APPLICATION_CREDENTIALS_JSON`.

### 2. Search Console Permissions
1. Open Google Search Console.
2. Go to **Settings > Users and Permissions**.
3. Add the email address of your new Service Account (e.g., `analytics@...iam.gserviceaccount.com`) and grant it **Restricted** or **Full** read access.
4. Set `GSC_SITE_URL` in your `.env` to your exact property URL (e.g., `https://invoice-gen.net/`).

### 3. GA4 Permissions
1. Open Google Analytics.
2. Go to **Admin > Property Access Management**.
3. Add the Service Account email as a **Viewer**.
4. Set `GA4_PROPERTY_ID` in your `.env` to your GA4 Property ID (found in Property Settings).

### 4. Clarity API Configuration
1. Open Microsoft Clarity.
2. Go to **Settings > API Tokens**.
3. Generate a new token and set it as `CLARITY_API_KEY` in your `.env`.
4. Set `CLARITY_PROJECT_ID` to your project's ID.

---

## Running the Engine

### Locally
```bash
npm run analytics
```
By default, this runs the `weekly` report. To run a monthly report:
```bash
node scripts/analytics/index.cjs monthly
```

### Automation
A GitHub Actions workflow is provided in `.github/workflows/analytics.yml`. It runs automatically every Monday at 08:00 UTC. Ensure you add the required secrets to your GitHub repository.
