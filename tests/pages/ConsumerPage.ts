import { Page, Locator, expect } from '@playwright/test';

export interface ConsumerData {
  firstName: string;
  lastName: string;
  email: string;
  iban?: string;
  accountOwner?: string;
  bankName?: string;
}

export class ConsumerPage {
  readonly page: Page;
  
  // Navigacija
  readonly consumer360Menu: Locator;
  readonly consumerCockpitLink: Locator;
  
  // Lista konzumera
  readonly moreActionsButton: Locator;
  readonly createConsumerMenuItem: Locator;
  
  // Forma za kreiranje
  readonly personRadio: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly accountOwnerInput: Locator;
  readonly bankNameInput: Locator;
  readonly ibanInput: Locator;
  readonly emailInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  
  
  // Pretraga
  readonly searchInput: Locator;

  readonly filtersButton: Locator;
  readonly filterButton: Locator;
  readonly clearFiltersButton: Locator;


  constructor(page: Page) {
    this.page = page;
    
    // Navigacija
    this.consumer360Menu = page.getByText('Consumer 360', { exact: true });
    this.consumerCockpitLink = page.getByRole('link', { name: 'Consumer Cockpit' });
    
    // Lista
    this.moreActionsButton = page.locator('lib-more-actions-component').getByRole('button');
    this.createConsumerMenuItem = page.getByRole('menuitem', { name: 'Create consumer' });
    
    // Forma
    // Forma za kreiranje — bez zvjezdica!
    this.personRadio = page.getByRole('radio', { name: 'Person' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.accountOwnerInput = page.getByRole('textbox', { name: 'Account owner' });
    this.bankNameInput = page.getByRole('textbox', { name: 'Bank name' });
    this.ibanInput = page.getByRole('textbox', { name: 'IBAN' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        
   
        // Filters panel dugme (otvara panel):
    this.filtersButton = page.getByRole('button', { name: 'Filters', exact: true });

    // Filter submit dugme (primjenjuje filter):
    this.filterButton = page.getByRole('button', { name: 'Filter', exact: true });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.clearFiltersButton = page.getByText('Clear all filters');
  }

  // Idi na Consumer Cockpit
async goto() {
  const entityId = process.env.CC_ENTITY_ID || '40261';
  await this.page.goto(`/#/entity/${entityId}/consumers/smart-search-box`);
  await this.page.waitForLoadState('networkidle');
  // Sačekaj da se tabela učita
  await expect(this.moreActionsButton).toBeVisible({ timeout: 10000 });
}

  // Navigiraj kroz meni (ako nisi direktno na stranici)
  async navigateViaMenu() {
    await this.consumer360Menu.click();
    await this.consumerCockpitLink.click();
    await this.page.waitForURL(/.*consumer-cockpit/);
  }

  // Otvori formu za kreiranje
  async openCreateForm() {
    await this.moreActionsButton.click();
    await this.createConsumerMenuItem.click();
    
    // Sačekaj da se modal otvori
    await expect(this.firstNameInput).toBeVisible({ timeout: 5000 });
  }
async fillAndSubmitForm(data: ConsumerData) {
  await this.personRadio.check();
  
  // Obavezna polja
  await this.firstNameInput.fill(data.firstName);
  await this.lastNameInput.fill(data.lastName);
  await this.emailInput.fill(data.email);
  
  // Account owner — treba klik na label
  if (data.accountOwner) {
    await this.page.getByText('Account owner').click();
    await this.accountOwnerInput.fill(data.accountOwner);
  }
  
  // Bank name
  if (data.bankName) {
    await this.bankNameInput.click();
    await this.bankNameInput.fill(data.bankName);
  }
  
  // IBAN — treba klik na container
  if (data.iban) {
    await this.page.locator('div:nth-child(17) > mat-form-field:nth-child(3) > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
    await this.ibanInput.fill(data.iban);
  }
  
  await this.createButton.click();
}

  // Kompletan flow: otvori formu + popuni + submit
  async createConsumer(data: ConsumerData) {
    await this.openCreateForm();
    await this.fillAndSubmitForm(data);
  }

  // Provjera da je konzumer kreiran (po imenu u listi)
  async expectConsumerVisible(firstName: string, lastName: string) {
    await expect(
      this.page.getByText(`${firstName} ${lastName}`)
    ).toBeVisible({ timeout: 10000 });
  }

async openFilters() {
  await this.filtersButton.click();
  await expect(this.searchInput).toBeVisible({ timeout: 3000 });
}

async searchConsumer(searchTerm: string) {
  await this.openFilters();
  await this.searchInput.fill(searchTerm);
  await this.filterButton.click();
  // Sačekaj da se rezultati učitaju
  await this.page.waitForLoadState('networkidle');
}

async expectConsumerInResults(firstName: string, lastName: string) {
  await expect(
    this.page.getByRole('cell', { name: `${firstName} ${lastName}` })
  ).toBeVisible({ timeout: 10000 });
}



async clickConsumerInResults(firstName: string, lastName: string) {
  await this.page.getByRole('cell', { name: `${firstName} ${lastName}` }).click();
}



}