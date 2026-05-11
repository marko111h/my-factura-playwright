import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  
  // Sidebar meni stavke
  readonly consumer360Menu: Locator;
  readonly dataMenu: Locator;
  readonly transactionsMenu: Locator;
  readonly articlesMenu: Locator;
  readonly orderManagementMenu: Locator;
  readonly processesMenu: Locator;
  readonly bookkeepingMenu: Locator;
  readonly settingsMenu: Locator;
  
  // Header
  readonly logoutButton: Locator;
  readonly languageSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Sidebar — koristimo exact: true zbog "Transactions Import" submenu-a
    this.consumer360Menu = page.getByText('Consumer 360', { exact: true });
    this.dataMenu = page.getByText('Data', { exact: true });
    this.transactionsMenu = page.getByText('Transactions', { exact: true });
    this.articlesMenu = page.getByText('Articles', { exact: true });
    this.orderManagementMenu = page.getByText('Order Management', { exact: true });
    this.processesMenu = page.getByText('Processes', { exact: true });
    this.bookkeepingMenu = page.getByText('Bookkeeping', { exact: true });
    this.settingsMenu = page.getByText('Settings', { exact: true });
    
    // Header elementi
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    this.languageSelector = page.locator('select').first();
  }

  async goto() {
    const entityId = process.env.CC_ENTITY_ID || '40261';
    await this.page.goto(`/#/admin/entity/${entityId}/dashboard`);
}

  async clickTransactions() {
    await this.transactionsMenu.click();
  }

  async clickConsumer360() {
    await this.consumer360Menu.click();
  }

  // Provjera: dashboard je učitan i sve glavne stavke vidljive
  async expectDashboardLoaded() {
    await expect(this.consumer360Menu).toBeVisible();
    await expect(this.transactionsMenu).toBeVisible();
    await expect(this.bookkeepingMenu).toBeVisible();
  }
}