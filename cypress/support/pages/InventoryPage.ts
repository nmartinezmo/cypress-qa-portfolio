import { InventorySelectors } from '../../selectors/inventory.selectors';

/**
 * Page Object for the SauceDemo Inventory page.
 * Exposes high-level **actions** and **assertions** — never raw selectors.
 */
export class InventoryPage {
  /** Assert the inventory page title is visible and correct. */
  assertTitleVisible(): void {
    cy.get(InventorySelectors.title).should('be.visible').and('have.text', 'Products');
  }

  /** Assert that the inventory list contains at least one item. */
  assertItemsLoaded(): void {
    cy.get(InventorySelectors.inventoryItem).should('have.length.greaterThan', 0);
  }

  /**
   * Add an item to the cart by its display name.
   * The item name must match exactly the `data-test` slug SauceDemo uses.
   * @param itemName - Display name as shown in the UI (e.g. "Sauce Labs Backpack").
   */
  addItemToCart(itemName: string): void {
    cy.get(InventorySelectors.addToCartButton(itemName)).click();
  }

  /**
   * Remove an item from the cart (on the inventory page).
   * @param itemName - Display name as shown in the UI.
   */
  removeItemFromCart(itemName: string): void {
    cy.get(InventorySelectors.removeButton(itemName)).click();
  }

  /** Assert the cart badge shows the expected item count. */
  assertCartCount(count: number): void {
    cy.get(InventorySelectors.shoppingCartBadge)
      .should('be.visible')
      .and('have.text', String(count));
  }

  /** Navigate to the shopping cart. */
  goToCart(): void {
    cy.get(InventorySelectors.shoppingCartLink).click();
  }

  /** Open the burger menu and click logout. */
  logout(): void {
    cy.get(InventorySelectors.burgerMenu).click();
    cy.get(InventorySelectors.logoutLink).click();
  }

  /**
   * Sort inventory items using the dropdown.
   * @param option - One of the sort option values: 'az', 'za', 'lohi', 'hilo'.
   */
  sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): void {
    cy.get(InventorySelectors.sortDropdown).select(option);
  }

  /** Return a chainable reference to all item name elements. */
  getItemNames(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(InventorySelectors.itemName);
  }

  /** Return a chainable reference to all item price elements. */
  getItemPrices(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(InventorySelectors.itemPrice);
  }
}
