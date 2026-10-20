import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutCompletePage } from './CheckoutCompletePage';

export class CheckoutOverviewPage extends BasePage {
  readonly finishButton: Locator;
  private readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton = page.getByTestId('finish');
    this.cartItems = page.getByTestId('inventory-item');
  }

  async expectLoaded(): Promise<void> {
    await this.expectPage('/checkout-step-two.html', 'Checkout: Overview');
  }

  async expectItemInOverview(productName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: productName })).toBeVisible();
  }

  async finishCheckout(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();

    return new CheckoutCompletePage(this.page);
  }
}
