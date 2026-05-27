import { CheckoutSelectors } from '../../selectors/checkout.selectors';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

/**
 * Page Object for the SauceDemo Checkout flow (cart → info → overview → complete).
 * Exposes high-level **actions** and **assertions** — never raw selectors.
 */
export class CheckoutPage {
  /** Assert a specific item is present in the cart. */
  assertCartContains(itemName: string): void {
    cy.get(CheckoutSelectors.cartItemName).should('contain.text', itemName);
  }

  /** Click the "Checkout" button on the cart page. */
  proceedToCheckout(): void {
    cy.get(CheckoutSelectors.checkoutButton).click();
  }

  /**
   * Fill in customer information on checkout step one.
   * @param info - Customer first name, last name, and zip/postal code.
   */
  fillCustomerInfo(info: CustomerInfo): void {
    cy.get(CheckoutSelectors.firstNameInput).clear().type(info.firstName);
    cy.get(CheckoutSelectors.lastNameInput).clear().type(info.lastName);
    cy.get(CheckoutSelectors.postalCodeInput).clear().type(info.zipCode);
    cy.get(CheckoutSelectors.continueButton).click();
  }

  /** Assert the checkout step-two overview page is visible with a non-empty total. */
  assertOverviewLoaded(): void {
    cy.get(CheckoutSelectors.summarySubtotal).should('be.visible');
    cy.get(CheckoutSelectors.summaryTax).should('be.visible');
    cy.get(CheckoutSelectors.summaryTotal).should('be.visible');
  }

  /** Click the "Finish" button to complete the purchase. */
  finishOrder(): void {
    cy.get(CheckoutSelectors.finishButton).click();
  }

  /** Assert the order confirmation page is displayed. */
  assertOrderComplete(): void {
    cy.get(CheckoutSelectors.completeHeader)
      .should('be.visible')
      .and('contain.text', 'Thank you for your order');
  }

  /** Assert the checkout error banner contains an expected message. */
  assertErrorContains(message: string): void {
    cy.get(CheckoutSelectors.errorMessage).should('be.visible').and('contain.text', message);
  }
}
