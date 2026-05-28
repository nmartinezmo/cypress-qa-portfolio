import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Base URLs are overridden per spec via Cypress.config() or env vars when needed.
    // SauceDemo (UI) and JSONPlaceholder (API) are the default targets.
    baseUrl: 'https://www.saucedemo.com',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    // Never mask flakes in dev; allow 2 retries in CI
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Mochawesome reporter for HTML reports
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'reports/mochawesome',
      overwrite: false,
      html: false, // merge step generates the final HTML
      json: true,
    },

    setupNodeEvents(on, config) {
      // Node event listeners can be added here as the suite grows
      return config;
    },
  },

  env: {
    // All API specs target JSONPlaceholder (free, stable, no auth required).
    // ReqRes.in was dropped in May 2026 when they introduced mandatory paid API keys.
    JSONPLACEHOLDER_URL: 'https://jsonplaceholder.typicode.com',
  },
});
