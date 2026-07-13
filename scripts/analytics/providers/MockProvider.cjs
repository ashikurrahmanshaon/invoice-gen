const BaseProvider = require('./BaseProvider.cjs');

class MockGSCProvider extends BaseProvider {
  constructor() { super('Google Search Console (Mock)'); }

  async fetchData() {
    return {
      seoMetrics: {
        clicks: 4250,
        impressions: 125400,
        ctr: 3.39,
        avgPosition: 14.2,
        indexedPages: 112,
        sitemapStatus: 'Success',
        coverageIssues: 2
      },
      topQueries: [
        { query: 'free invoice generator', clicks: 1200, impressions: 45000, position: 5.1 },
        { query: 'invoice-gen', clicks: 800, impressions: 2100, position: 1.0 },
        { query: 'pdf invoice maker', clicks: 500, impressions: 18000, position: 8.4 }
      ],
      topPages: [
        { url: '/', clicks: 2500 },
        { url: '/templates/freelance/', clicks: 450 },
        { url: '/blog/how-to-write-freelance-invoice/', clicks: 300 }
      ]
    };
  }
}

class MockGA4Provider extends BaseProvider {
  constructor() { super('Google Analytics 4 (Mock)'); }

  async fetchData() {
    return {
      traffic: {
        users: 3800,
        sessions: 4100,
        bounceRate: 42.5,
        engagementRate: 57.5,
        avgSessionDuration: 145 // seconds
      },
      events: {
        downloads: 1850,
        previewClicks: 2100,
        saveDraft: 950,
        funnelCompletion: 68.4 // percentage
      }
    };
  }
}

class MockClarityProvider extends BaseProvider {
  constructor() { super('Microsoft Clarity (Mock)'); }

  async fetchData() {
    return {
      behavior: {
        rageClicks: 45,
        deadClicks: 120,
        quickBacks: 310,
        avgScrollDepth: 68 // percentage
      },
      breakdown: {
        desktop: 55,
        mobile: 42,
        tablet: 3
      }
    };
  }
}

module.exports = { MockGSCProvider, MockGA4Provider, MockClarityProvider };
