import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Dashboard navigation', () => {
  test('dashboard loads with all menu items', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.goto();
    await dashboardPage.expectDashboardLoaded();
  });

  test('can click Transactions menu and see submenu', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.goto();
    await dashboardPage.clickTransactions();
    
    // Koristi getByRole sa exact: true — najstabilniji pristup
    await expect(page.getByRole('link', { name: 'Overview', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Statements' })).toBeVisible();
  });

  test('can click Consumer 360 menu and see submenu', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.goto();
    await dashboardPage.clickConsumer360();
    
    await expect(page.getByRole('link', { name: 'Consumer Cockpit' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blacklist' })).toBeVisible();
  });
});