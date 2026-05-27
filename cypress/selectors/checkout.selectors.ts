/**
 * Centralized selectors for the SauceDemo Checkout flow.
 */
export const CheckoutSelectors = {
  // Cart page
  cartItem: '[data-test="cart-item"]',
  cartItemName: '[data-test="inventory-item-name"]',
  checkoutButton: '[data-test="checkout"]',
  continueShoppingButton: '[data-test="continue-shopping"]',

  // Checkout step one (personal info)
  firstNameInput: '[data-test="firstName"]',
  lastNameInput: '[data-test="lastName"]',
  postalCodeInput: '[data-test="postalCode"]',
  continueButton: '[data-test="continue"]',
  errorMessage: '[data-test="error"]',

  // Checkout step two (overview)
  summarySubtotal: '[data-test="subtotal-label"]',
  summaryTax: '[data-test="tax-label"]',
  summaryTotal: '[data-test="total-label"]',
  finishButton: '[data-test="finish"]',

  // Checkout complete
  completeHeader: '[data-test="complete-header"]',
  completeText: '[data-test="complete-text"]',
  backHomeButton: '[data-test="back-to-products"]',
} as const;
