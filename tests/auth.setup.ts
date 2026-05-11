import { test as setup } from '@playwright/test';
import path from 'path';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.loginAndWaitForDashboard(
    process.env.CC_USERNAME!,
    process.env.CC_PASSWORD!
  );

  // 2. Switch na MarkoGym1 entity
  await page.locator('#entityToggleBtn').click();
  await page.getByText('MarkoGym1').dblclick();
  
  // 3. Sačekaj da se entity promijeni (URL treba da postane /entity/40261/)
  await page.waitForURL(/.*\/entity\/40261\/.*/);
  
  // 4. Provjeri dashboard
  await dashboardPage.expectDashboardLoaded();

  // 5. Sačuvaj auth state (sa entity 40261 kontekstom)
  await page.context().storageState({ path: authFile });
});