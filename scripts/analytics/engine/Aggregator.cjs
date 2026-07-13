const { MockGSCProvider, MockGA4Provider, MockClarityProvider } = require('../providers/MockProvider.cjs');
const { generateInsights } = require('./InsightsGenerator.cjs');


/**
 * Orchestrates fetching data from all providers and combining it into a normalized dataset.
 */
class Aggregator {
  constructor() {
    // For now, always use mocks to verify architecture as requested.
    // In the future, this will check config.USE_MOCK_DATA and load real providers.
    this.gsc = new MockGSCProvider();
    this.ga4 = new MockGA4Provider();
    this.clarity = new MockClarityProvider();
  }

  async run(dateRange = 'last_7_days') {
    console.log(`[Aggregator] Fetching data for ${dateRange}...`);
    
    // Fetch in parallel for speed
    const [gscData, ga4Data, clarityData] = await Promise.all([
      this.gsc.fetchData(dateRange),
      this.ga4.fetchData(dateRange),
      this.clarity.fetchData(dateRange)
    ]);

    const rawData = {
      timestamp: new Date().toISOString(),
      dateRange,
      gsc: gscData,
      ga4: ga4Data,
      clarity: clarityData
    };

    const insights = generateInsights(rawData);

    return {
      ...rawData,
      insights
    };
  }
}

module.exports = Aggregator;
