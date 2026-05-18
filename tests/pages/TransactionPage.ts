import { Page, Locator, expect } from '@playwright/test';

export interface TransactionData {
  amount: string;
  description?: string;
}

export class TransactionPage {
  readonly page: Page;

  readonly addTransactionMenuItem: Locator;
  readonly amountInput: Locator;
  readonly descriptionInput: Locator;
  readonly dueDateInput: Locator;
  readonly collectRadio: Locator;
  readonly addButton: Locator;
  readonly sendToReminderRadio: Locator;
  readonly draftRadio: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addTransactionMenuItem = page.getByRole('menuitem', { name: 'Add transaction' });
    this.amountInput = page.getByRole('textbox', { name: 'Transaction amount *' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
    this.dueDateInput = page.getByRole('textbox', { name: 'Payment due date *' });
    this.collectRadio = page.getByRole('radio', { name: 'Collect' });
    this.addButton = page.getByRole('button', { name: ' Add' });
    this.sendToReminderRadio = page.getByRole('radio', { name: 'Send to reminder only' });
    this.draftRadio = page.getByRole('radio', { name: 'Draft' });
  }

  // Otvori Add transaction meni iz row-a konzumera
  async openAddTransactionFromRow(firstName: string, lastName: string) {
    const row = this.page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`) });
    await row.getByLabel('Example icon-button with a').click();
    await this.addTransactionMenuItem.click();
    await expect(this.amountInput).toBeVisible({ timeout: 5000 });
  }

  // Odaberi datum — klikni na day u date pickeru
  async selectDueDate() {
    await this.dueDateInput.click();
    // Klikni na today + neki dan koji postoji (18 je sigurno u svakom mjesecu)
    const today = new Date().getDate().toString();
    await this.page.getByText(today, { exact: true }).first().click();
  }

  // Popuni i submit formu
  async fillAndSubmit(data: TransactionData) {
    await this.amountInput.fill(data.amount);
    
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
    
    await this.selectDueDate();
    await this.collectRadio.check();
    await this.addButton.click();
    
    // Sačekaj da se modal zatvori
    await expect(this.amountInput).not.toBeVisible({ timeout: 5000 });
  }

  // Kompletan flow
  async addTransaction(firstName: string, lastName: string, data: TransactionData) {
    await this.openAddTransactionFromRow(firstName, lastName);
    await this.fillAndSubmit(data);
  }
}