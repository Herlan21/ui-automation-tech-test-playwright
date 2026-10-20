import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly title: Locator;

  protected constructor(protected readonly page: Page) {
    this.title = page.getByTestId('title');
  }

  protected async expectPage(path: string, title: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${path}$`));
    await expect(this.title).toHaveText(title);
  }
}
