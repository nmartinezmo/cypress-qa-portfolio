/**
 * Centralized selectors for the SauceDemo Login page.
 * Prefer `data-test` attributes (exposed by the app) over CSS class selectors.
 */
export const LoginSelectors = {
  usernameInput: '[data-test="username"]',
  passwordInput: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  errorMessage: '[data-test="error"]',
} as const;
