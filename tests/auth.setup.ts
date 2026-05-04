import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Idi na login
  await page.goto('https://dev-cc.dev.gerniks.net/#/auth/login');

  // Login
  await page.getByPlaceholder('Username*').fill(process.env.CC_USERNAME!);
  await page.getByPlaceholder('Password*').fill(process.env.CC_PASSWORD!);
  await page.getByRole('button', { name: 'Log in' }).click();

  // Sačekaj da se login završi (URL se promijeni na dashboard)
  await page.waitForURL(/.*\/admin\/.*\/dashboard/);
  
  // Bonus provjera da je dashboard stvarno učitan
  await expect(page.getByText('Consumer 360')).toBeVisible();

  // Sačuvaj auth state (cookies + localStorage)
  await page.context().storageState({ path: authFile });
});