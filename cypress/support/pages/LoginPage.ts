import { LoginSelectors } from '../../selectors/login.selectors';

/**
 * Page Object for the SauceDemo Login page.
 * Exposes high-level **actions** and **assertions** — never raw selectors.
 */
export class LoginPage {
  /** Navigate to the login page. */
  visit(): void {
    cy.visit('/');
  }

  /**
   * Fill in credentials and submit the login form.
   * @param username - The SauceDemo username.
   * @param password - The SauceDemo password.
   */
  loginWith(username: string, password: string): void {
    cy.get(LoginSelectors.usernameInput).clear();
    if (username) cy.get(LoginSelectors.usernameInput).type(username);
    cy.get(LoginSelectors.passwordInput).clear();
    if (password) cy.get(LoginSelectors.passwordInput).type(password);
    cy.get(LoginSelectors.loginButton).click();
  }

  /** Assert that the error banner is visible and contains the expected message. */
  assertErrorContains(message: string): void {
    cy.get(LoginSelectors.errorMessage).should('be.visible').and('contain.text', message);
  }

  /** Assert the user has been redirected to the inventory page. */
  assertRedirectedToInventory(): void {
    cy.url().should('include', '/inventory.html');
  }
}
