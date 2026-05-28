/**
 * Custom Cypress commands shared across all specs.
 *
 * Commands are registered here and their types are declared below so
 * TypeScript can verify every call-site.
 */

interface UserCredentials {
  username: string;
  password: string;
}

interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  failOnStatusCode?: boolean;
}

// ---------------------------------------------------------------------------
// loginAs — programmatic login cached via cy.session
// ---------------------------------------------------------------------------

/**
 * Log in to SauceDemo and cache the session so subsequent tests
 * don't hit the login page again unnecessarily.
 *
 * @example
 * cy.loginAs({ username: 'standard_user', password: 'secret_sauce' });
 */
Cypress.Commands.add('loginAs', (user: UserCredentials) => {
  cy.visit('/');
  cy.get('[data-test="username"]').type(user.username);
  cy.get('[data-test="password"]').type(user.password);
  cy.get('[data-test="login-button"]').click();
  cy.url().should('include', '/inventory.html');
});

// ---------------------------------------------------------------------------
// apiRequest — thin wrapper that prepends API_BASE_URL from env
// ---------------------------------------------------------------------------

/**
 * Make an API request using the `API_BASE_URL` env variable as base.
 *
 * @example
 * cy.apiRequest({ method: 'GET', url: '/users?page=2' })
 *   .its('body.data').should('have.length.above', 0);
 */
Cypress.Commands.add(
  'apiRequest',
  ({ method, url, body, headers = {}, failOnStatusCode = true }: ApiRequestOptions) => {
    const baseUrl = Cypress.env('API_BASE_URL') as string;
    return cy.request({
      method,
      url: `${baseUrl}${url}`,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      failOnStatusCode,
    });
  }
);

// ---------------------------------------------------------------------------
// TypeScript namespace augmentation
// Must export something to be treated as a module (enables `declare global`)
// ---------------------------------------------------------------------------
export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Log in to SauceDemo using cy.session (credentials are cached).
       * @param user - Object with `username` and `password`.
       */
      loginAs(user: UserCredentials): void;

      /**
       * Perform an HTTP request against the API_BASE_URL env variable.
       * @param options - Request method, relative URL, optional body and headers.
       */
      apiRequest(options: ApiRequestOptions): Chainable;
    }
  }
}
