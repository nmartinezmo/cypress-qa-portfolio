import { InventoryPage } from '../../support/pages/InventoryPage';
import { CheckoutPage } from '../../support/pages/CheckoutPage';

/**
 * Spec: Checkout — happy-path purchase flow and validation errors.
 * Target app: https://www.saucedemo.com
 */

interface ProductFixture {
  checkout: {
    firstName: string;
    lastName: string;
    zipCode: string;
  };
}

describe('Checkout — happy path', () => {
  const inventoryPage = new InventoryPage();
  const checkoutPage = new CheckoutPage();

  beforeEach(() => {
    cy.fixture('users').then((users: { standard: { username: string; password: string } }) => {
      cy.loginAs(users.standard);
    });
    cy.visit('/inventory.html');
  });

  it('should complete purchase when valid item and customer info are provided', () => {
    cy.fixture('products').then((products: ProductFixture) => {
      inventoryPage.addItemToCart('sauce-labs-backpack');
      inventoryPage.goToCart();

      checkoutPage.assertCartContains('Sauce Labs Backpack');
      checkoutPage.proceedToCheckout();

      checkoutPage.fillCustomerInfo({
        firstName: products.checkout.firstName,
        lastName: products.checkout.lastName,
        zipCode: products.checkout.zipCode,
      });

      checkoutPage.assertOverviewLoaded();
      checkoutPage.finishOrder();
      checkoutPage.assertOrderComplete();
    });
  });
});

describe('Checkout — validation errors', () => {
  const inventoryPage = new InventoryPage();
  const checkoutPage = new CheckoutPage();

  beforeEach(() => {
    cy.fixture('users').then((users: { standard: { username: string; password: string } }) => {
      cy.loginAs(users.standard);
    });
    cy.visit('/inventory.html');
    inventoryPage.addItemToCart('sauce-labs-backpack');
    inventoryPage.goToCart();
    checkoutPage.proceedToCheckout();
  });

  it('should show error when first name is missing', () => {
    checkoutPage.fillCustomerInfo({ firstName: '', lastName: 'Martínez', zipCode: '110111' });
    checkoutPage.assertErrorContains('First Name is required');
  });

  it('should show error when last name is missing', () => {
    checkoutPage.fillCustomerInfo({ firstName: 'Nicolás', lastName: '', zipCode: '110111' });
    checkoutPage.assertErrorContains('Last Name is required');
  });

  it('should show error when postal code is missing', () => {
    checkoutPage.fillCustomerInfo({ firstName: 'Nicolás', lastName: 'Martínez', zipCode: '' });
    checkoutPage.assertErrorContains('Postal Code is required');
  });
});
