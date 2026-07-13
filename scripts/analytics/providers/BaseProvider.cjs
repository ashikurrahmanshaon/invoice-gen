/**
 * Base Provider interface to ensure all API providers return data in a standard format.
 * Future providers (Bing, PageSpeed) should extend this class.
 */
class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  async fetchData(dateRange) {
    throw new Error(`fetchData() must be implemented by ${this.name}`);
  }
}

module.exports = BaseProvider;
