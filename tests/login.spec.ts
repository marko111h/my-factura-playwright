import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login functionality', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
    
    await loginPage.loginAndWaitForDashboard(
      process.env.CC_USERNAME!,
      process.env.CC_PASSWORD!
    );
    
    // Verifikuj da smo stigli na dashboard
    await expect(page).toHaveURL(/.*\/admin\/.*\/dashboard/);
  });

  test('login fails with wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login(process.env.CC_USERNAME!, 'wrong_password_123');
    
    // Trebao bi ostati na login stranici
    await page.waitForTimeout(2000);
    await loginPage.expectStillOnLoginPage();
  });

  test('login form is visible on page load', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
  });
});