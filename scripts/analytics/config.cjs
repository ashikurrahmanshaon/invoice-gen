require('dotenv').config({ path: ['.env.local', '.env'] });

/**
 * Validates and exports environment configuration for the Analytics Engine.
 */
const config = {
  // Google Service Account (JSON stringified)
  GOOGLE_APPLICATION_CREDENTIALS_JSON: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
  
  // Google Search Console Site URL (e.g., https://invoice-gen.net/)
  GSC_SITE_URL: process.env.GSC_SITE_URL,

  // Google Analytics 4 Property ID
  GA4_PROPERTY_ID: process.env.GA4_PROPERTY_ID,

  // Microsoft Clarity API Key & Project ID
  CLARITY_API_KEY: process.env.CLARITY_API_KEY,
  CLARITY_PROJECT_ID: process.env.CLARITY_PROJECT_ID,

  // Output configuration
  OUTPUT_DIR: process.env.ANALYTICS_OUTPUT_DIR || './analytics_reports',

  // Feature Flags
  USE_MOCK_DATA: process.env.USE_MOCK_DATA === 'true' || !process.env.GA4_PROPERTY_ID,
};

module.exports = config;
