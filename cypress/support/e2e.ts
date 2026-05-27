/**
 * e2e.ts — global support file loaded before every spec.
 *
 * Import custom commands and any global before/after hooks here.
 * Keep this file minimal — heavy logic belongs in page objects or commands.
 */

import './commands';

// Global before-each: clear local/session storage to ensure test isolation.
beforeEach(() => {
  cy.clearLocalStorage();
});
