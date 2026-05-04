import { test, expect } from '@playwright/test';

test('dashboard is accessible after login', async ({ page }) => {
  await page.goto('/#/admin/entity/1/dashboard');
  
  // Koristi exact: true gdje god je tekst dvosmislen
  await expect(page.getByText('Consumer 360')).toBeVisible();
  await expect(page.getByText('Transactions', { exact: true })).toBeVisible();
  await expect(page.getByText('Bookkeeping')).toBeVisible();
});

test('can navigate to Transactions menu', async ({ page }) => {
  await page.goto('/#/admin/entity/1/dashboard');
  
  // Klikni na Transactions menu (tačno taj tekst)
  await page.getByText('Transactions', { exact: true }).click();
  
  await page.waitForTimeout(500);
});