/**
 * Centralized selectors for the SauceDemo Inventory page.
 */
export const InventorySelectors = {
  title: '[data-test="title"]',
  inventoryContainer: '[data-test="inventory-container"]',
  inventoryItem: '[data-test="inventory-item"]',
  itemName: '[data-test="inventory-item-name"]',
  itemPrice: '[data-test="inventory-item-price"]',
  addToCartButton: (itemName: string): string =>
    `[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`,
  removeButton: (itemName: string): string =>
    `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`,
  shoppingCartBadge: '[data-test="shopping-cart-badge"]',
  shoppingCartLink: '[data-test="shopping-cart-link"]',
  sortDropdown: '[data-test="product-sort-container"]',
  burgerMenu: '#react-burger-menu-btn',
  logoutLink: '[data-test="logout-sidebar-link"]',
} as const;
