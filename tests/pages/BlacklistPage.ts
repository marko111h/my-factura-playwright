import { Page, Locator, expect } from '@playwright/test';

export class BlacklistPage {
  readonly page: Page;

  readonly moreActionsButton: Locator;
  readonly addToBlacklistMenuItem: Locator;
  readonly reasonInput: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.moreActionsButton = page.locator('lib-more-actions-component').getByRole('button');
    this.addToBlacklistMenuItem = page.getByRole('menuitem', { name: 'Add to the Blacklist' });
    this.reasonInput = page.getByRole('textbox', { name: 'Reason for blacklisting*' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async openBlacklistModal() {
    await this.moreActionsButton.click();
    await this.addToBlacklistMenuItem.click();
    await expect(this.reasonInput).toBeVisible({ timeout: 5000 });
  }

  async addToBlacklist(reason: string) {
    await this.openBlacklistModal();
    await this.reasonInput.fill(reason);
    await this.confirmButton.click();
    // Sačekaj da se modal zatvori
    await expect(this.reasonInput).not.toBeVisible({ timeout: 5000 });
  }

  async expectBlacklistModalVisible() {
    await expect(this.reasonInput).toBeVisible();
    await expect(this.confirmButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }
}