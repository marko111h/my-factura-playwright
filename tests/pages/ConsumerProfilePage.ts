import { Page, Locator, expect } from '@playwright/test';

export class ConsumerProfilePage {
  readonly page: Page;

  // Header
  readonly consumerName: Locator;
  readonly backButton: Locator;
  readonly moreActionsButton: Locator;

  // Tabovi
  readonly profileTab: Locator;
  readonly bankInformationTab: Locator;
  readonly additionalInformationTab: Locator;
  readonly contractsTab: Locator;
  readonly invoicesTab: Locator;

  // Status informacije
  readonly typeValue: Locator;
  readonly dunningValue: Locator;
  readonly inkassoValue: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.consumerName = page.locator('h1, .consumer-name, [class*="title"]').first();
    this.backButton = page.locator('.back-icon > svg');
    this.moreActionsButton = page.locator('lib-more-actions-component').getByRole('button');

    // Tabovi
    this.profileTab = page.getByRole('link', { name: 'Profile' });
    this.bankInformationTab = page.getByRole('link', { name: 'Bank information' });
    this.additionalInformationTab = page.getByRole('link', { name: 'Additional information' });
    this.contractsTab = page.getByRole('link', { name: 'Contracts', exact: true });
    this.invoicesTab = page.locator('#consumer_360_edit_consumer-list_item-selectedTab4')
      .getByRole('link', { name: 'Invoices' });

    // Status
    this.typeValue = page.getByText('PERSON');
    this.dunningValue = page.locator('text=Dunning').locator('..').getByText('Yes').first();
    this.inkassoValue = page.locator('text=Inkasso').locator('..').getByText('Yes').first();
  }

  async expectProfileLoaded(firstName: string, lastName: string) {
    // Provjeri URL
    await expect(this.page).toHaveURL(/.*consumer-360-tabs.*profile/);
    
    // Provjeri da se ime vidi u headeru
    const fullName = `${firstName} ${lastName}`.toUpperCase();
    await expect(this.page.getByText(fullName)).toBeVisible({ timeout: 10000 });
  }

  async expectAllTabsVisible() {
    await expect(this.bankInformationTab).toBeVisible();
    await expect(this.additionalInformationTab).toBeVisible();
    await expect(this.contractsTab).toBeVisible();
    await expect(this.invoicesTab).toBeVisible();
  }

  async clickBankInformation() {
    await this.bankInformationTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickContracts() {
    await this.contractsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goBack() {
    await this.backButton.click();
    await this.page.waitForURL(/.*smart-search-box/);
  }
}