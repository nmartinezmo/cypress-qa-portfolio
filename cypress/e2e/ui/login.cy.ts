import { LoginPage } from '../../support/pages/LoginPage';

/**
 * Spec: Login — covers happy path, error states, and locked-out user.
 * Target app: https://www.saucedemo.com
 */

describe('Login — happy path', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should redirect to inventory when credentials are valid', () => {
    cy.fixture('users').then((users: { standard: { username: string; password: string } }) => {
      loginPage.loginWith(users.standard.username, users.standard.password);
      loginPage.assertRedirectedToInventory();
    });
  });
});

describe('Login — error states', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should show error when username is missing', () => {
    loginPage.loginWith('', 'secret_sauce');
    loginPage.assertErrorContains('Username is required');
  });

  it('should show error when password is missing', () => {
    loginPage.loginWith('standard_user', '');
    loginPage.assertErrorContains('Password is required');
  });

  it('should show error when credentials are invalid', () => {
    cy.fixture('users').then((users: { invalid: { username: string; password: string } }) => {
      loginPage.loginWith(users.invalid.username, users.invalid.password);
      loginPage.assertErrorContains('Username and password do not match');
    });
  });

  it('should show error when user is locked out', () => {
    cy.fixture('users').then((users: { locked: { username: string; password: string } }) => {
      loginPage.loginWith(users.locked.username, users.locked.password);
      loginPage.assertErrorContains('Sorry, this user has been locked out');
    });
  });
});
