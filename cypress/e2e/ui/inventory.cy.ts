import { InventoryPage } from '../../support/pages/InventoryPage';

/**
 * Spec: Inventory — product listing, sorting, and add-to-cart.
 * Target app: https://www.saucedemo.com
 * Relies on cy.loginAs (cy.session) to avoid re-logging in per test.
 */

describe('Inventory — product listing', () => {
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    cy.fixture('users').then((users: { standard: { username: string; password: string } }) => {
      cy.loginAs(users.standard);
    });
  });

  it('should display the Products title when logged in', () => {
    inventoryPage.assertTitleVisible();
  });

  it('should display at least one inventory item', () => {
    inventoryPage.assertItemsLoaded();
  });

  it('should update cart badge count when an item is added', () => {
    inventoryPage.addItemToCart('sauce-labs-backpack');
    inventoryPage.assertCartCount(1);
  });

  it('should remove the cart badge when the added item is removed', () => {
    inventoryPage.addItemToCart('sauce-labs-backpack');
    inventoryPage.assertCartCount(1);
    inventoryPage.removeItemFromCart('sauce-labs-backpack');
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });
});

describe('Inventory — sorting', () => {
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    cy.fixture('users').then((users: { standard: { username: string; password: string } }) => {
      cy.loginAs(users.standard);
    });
  });

  it('should sort items from low to high price when lohi is selected', () => {
    inventoryPage.sortBy('lohi');

    inventoryPage.getItemPrices().then(($prices) => {
      const prices = [...$prices].map((el) => parseFloat((el.textContent ?? '0').replace('$', '')));
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sorted);
    });
  });

  it('should sort items from high to low price when hilo is selected', () => {
    inventoryPage.sortBy('hilo');

    inventoryPage.getItemPrices().then(($prices) => {
      const prices = [...$prices].map((el) => parseFloat((el.textContent ?? '0').replace('$', '')));
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).to.deep.equal(sorted);
    });
  });
});
