import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';

export class InventoryPage extends BasePage {
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  private readonly inventoryItems: Locator;

  constructor(page: Page) {
    super(page);
    this.shoppingCartLink = page.getByTestId('shopping-cart-link');
    this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
    this.inventoryItems = page.getByTestId('inventory-item');
  }

  async expectLoaded(): Promise<void> {
    await this.expectPage('/inventory.html', 'Products');
  }

  async addToCart(productName: string): Promise<void> {
    const product = this.inventoryItems.filter({ hasText: productName });

    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async expectCartItemCount(count: number): Promise<void> {
    await expect(this.shoppingCartBadge).toHaveText(String(count));
  }

  async openCart(): Promise<CartPage> {
    await this.shoppingCartLink.click();

    return new CartPage(this.page);
  }
}
