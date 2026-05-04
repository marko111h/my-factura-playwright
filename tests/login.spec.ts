import { test, expect } from '@playwright/test';

test('successful login to My-Factura', async ({ page }) => {
  await page.goto('/#/auth/login');

  await page.getByPlaceholder('Username*').fill(process.env.CC_USERNAME!);
  await page.getByPlaceholder('Password*').fill(process.env.CC_PASSWORD!);
  await page.getByRole('button', { name: 'Log in' }).click();

  // Sačekaj da se URL promijeni na dashboard (eksplicitno čekanje, bolje od regex assertion)
  await page.waitForURL(/.*\/admin\/.*\/dashboard/, { timeout: 15000 });
  
  // Provjera da je dashboard učitan
  await expect(page.getByText('Consumer 360')).toBeVisible();
});

test('login fails with wrong password', async ({ page }) => {
  await page.goto('/#/auth/login');

  await page.getByPlaceholder('Username*').fill(process.env.CC_USERNAME!);
  await page.getByPlaceholder('Password*').fill('wrong_password_123');
  await page.getByRole('button', { name: 'Log in' }).click();

  // Trebao bi ostati na login stranici - sačekaj 2 sekunde da vidi šta se desi
  await page.waitForTimeout(2000);
  
  // URL sadrži /auth/login
  await expect(page).toHaveURL(/.*auth\/login/);
});