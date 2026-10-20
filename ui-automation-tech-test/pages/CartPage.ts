import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutInformationPage } from './CheckoutInformationPage';

export class CartPage extends BasePage {
  readonly checkoutButton: Locator;
  private readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.getByTestId('checkout');
    this.cartItems = page.getByTestId('inventory-item');
  }

  async expectLoaded(): Promise<void> {
    await this.expectPage('/cart.html', 'Your Cart');
  }

  async expectItemInCart(productName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: productName })).toBeVisible();
  }

  async proceedToCheckout(): Promise<CheckoutInformationPage> {
    await this.checkoutButton.click();

    return new CheckoutInformationPage(this.page);
  }
}
