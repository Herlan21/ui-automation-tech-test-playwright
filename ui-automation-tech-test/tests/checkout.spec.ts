import { test } from '@playwright/test';
import { CUSTOMER, PRODUCTS, USERS } from '../data/testData';
import { LoginPage } from '../pages/LoginPage';

test.describe('E2E Checkout Flow', () => {
  test('completes checkout for Sauce Labs Onesie', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Login
    const inventoryPage = await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();

    // Add Sauce Labs Onesie to cart
    await inventoryPage.addToCart(PRODUCTS.sauceLabsOnesie);
    await inventoryPage.expectCartItemCount(1);

    // Go to cart and verify the selected product
    const cartPage = await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItemInCart(PRODUCTS.sauceLabsOnesie);

    // Proceed to checkout and fill customer information
    const checkoutInformationPage = await cartPage.proceedToCheckout();
    await checkoutInformationPage.expectLoaded();
    await checkoutInformationPage.fillCustomerInformation(CUSTOMER);

    const checkoutOverviewPage = await checkoutInformationPage.continueToOverview();
    await checkoutOverviewPage.expectLoaded();
    await checkoutOverviewPage.expectItemInOverview(PRODUCTS.sauceLabsOnesie);

    // Finish checkout and verify completion
    const checkoutCompletePage = await checkoutOverviewPage.finishCheckout();
    await checkoutCompletePage.expectOrderCompleted();
  });
});
