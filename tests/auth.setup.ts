import { test as setup } from '@playwright/test';
import path from 'path';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.loginAndWaitForDashboard(
    process.env.CC_USERNAME!,
    process.env.CC_PASSWORD!
  );
  
  // Provjera da je dashboard stvarno učitan prije nego što sačuvamo state
  await dashboardPage.expectDashboardLoaded();

  // Sačuvaj auth state
  await page.context().storageState({ path: authFile });
});