import { test, expect } from '@playwright/test';
import { ConsumerPage } from './pages/ConsumerPage';
import { TransactionPage } from './pages/TransactionPage';
import { generateConsumerData } from './helpers/testData';
import { faker } from '@faker-js/faker';

test.describe('Transaction management', () => {

  test('can add transaction to consumer', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);
    const transactionPage = new TransactionPage(page);

    // Korak 1: Kreiraj konzumera
    const consumer = generateConsumerData();
    await consumerPage.goto();
    await consumerPage.createConsumer(consumer);
    await page.waitForTimeout(2000);

    // Korak 2: Pretraži konzumera
    await consumerPage.goto();
    await consumerPage.searchConsumer(consumer.lastName);
    await consumerPage.expectConsumerInResults(consumer.firstName, consumer.lastName);

    // Korak 3: Dodaj transakciju
    const transactionData = {
      amount: faker.finance.amount({ min: 10, max: 500, dec: 2 }),
      description: `Test transaction - ${consumer.firstName} ${consumer.lastName}`,
    };

    await transactionPage.addTransaction(
      consumer.firstName,
      consumer.lastName,
      transactionData
    );

    // Verifikacija — provjeri u Transactions Overview
    const entityId = process.env.CC_ENTITY_ID || '40261';
    await page.goto(`/#/entity/${entityId}/transactions/in`);
    await page.waitForLoadState('networkidle');

    // Pretraži po imenu konzumera
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill(`${consumer.firstName} ${consumer.lastName}`);
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await page.waitForLoadState('networkidle');

    // Provjeri da se transakcija pojavljuje
    await expect(
        page.getByRole('cell', { name: `${consumer.firstName} ${consumer.lastName}` }).first()
    ).toBeVisible({ timeout: 10000 });


    console.log(`✓ Transaction added: ${transactionData.amount}€ for ${consumer.firstName} ${consumer.lastName}`);
  });

  test('can view consumer transactions', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);
    const transactionPage = new TransactionPage(page);

    // Korak 1: Kreiraj konzumera
    const consumer = generateConsumerData();
    await consumerPage.goto();
    await consumerPage.createConsumer(consumer);
    await page.waitForTimeout(2000);

    // Korak 2: Pretraži i dodaj transakciju
    await consumerPage.goto();
    await consumerPage.searchConsumer(consumer.lastName);
    await consumerPage.expectConsumerInResults(consumer.firstName, consumer.lastName);

    const amount = faker.finance.amount({ min: 10, max: 500, dec: 2 });
    await transactionPage.addTransaction(consumer.firstName, consumer.lastName, {
      amount,
      description: 'Test transaction',
    });

    // Korak 3: Otvori profil i provjeri Transactions tab
    await consumerPage.searchConsumer(consumer.lastName);
    await consumerPage.expectConsumerInResults(consumer.firstName, consumer.lastName);
    await page.getByRole('cell', { name: `${consumer.firstName} ${consumer.lastName}` }).click();

    // Klikni na Contracts tab (gdje se vide transakcije po contractu)
    // ili direktno na Transactions overview
    await expect(page).toHaveURL(/.*consumer-360-tabs.*profile/);

    console.log(`✓ Consumer with transaction viewed: ${consumer.firstName} ${consumer.lastName}`);
  });

  test('can add transaction with Send to reminder only', async ({ page }) => {
  const consumerPage = new ConsumerPage(page);
  const transactionPage = new TransactionPage(page);

  const consumer = generateConsumerData();
  await consumerPage.goto();
  await consumerPage.createConsumer(consumer);
  await page.waitForTimeout(2000);

  await consumerPage.goto();
  await consumerPage.searchConsumer(consumer.lastName);
  await consumerPage.expectConsumerInResults(consumer.firstName, consumer.lastName);

  await transactionPage.openAddTransactionFromRow(consumer.firstName, consumer.lastName);
  await transactionPage.amountInput.fill(faker.finance.amount({ min: 10, max: 500, dec: 2 }));
  await transactionPage.descriptionInput.fill('Test - Send to reminder only');
  await transactionPage.selectDueDate();
  await page.getByRole('radio', { name: 'Send to reminder only' }).check();
  await transactionPage.addButton.click();
  await expect(transactionPage.amountInput).not.toBeVisible({ timeout: 5000 });

    // Verifikacija — provjeri u Transactions Overview
  const entityId = process.env.CC_ENTITY_ID || '40261';
  await page.goto(`/#/entity/${entityId}/transactions/in`);
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill(`${consumer.firstName} ${consumer.lastName}`);
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
  await page.waitForLoadState('networkidle');

  // Provjeri konzumera u listi
  await expect(
    page.getByRole('cell', { name: `${consumer.firstName} ${consumer.lastName}` }).first()
  ).toBeVisible({ timeout: 10000 });

  // Provjeri opis
  await expect(page.getByText('Test - Send to reminder only')).toBeVisible();


  console.log(`✓ Transaction (Send to reminder only) for: ${consumer.firstName} ${consumer.lastName}`);
});

test('can add transaction as Draft', async ({ page }) => {
  const consumerPage = new ConsumerPage(page);
  const transactionPage = new TransactionPage(page);

  const consumer = generateConsumerData();
  await consumerPage.goto();
  await consumerPage.createConsumer(consumer);
  await page.waitForTimeout(2000);

  await consumerPage.goto();
  await consumerPage.searchConsumer(consumer.lastName);
  await consumerPage.expectConsumerInResults(consumer.firstName, consumer.lastName);

  await transactionPage.openAddTransactionFromRow(consumer.firstName, consumer.lastName);
  await transactionPage.amountInput.fill(faker.finance.amount({ min: 10, max: 500, dec: 2 }));
  await transactionPage.descriptionInput.fill('Test - Draft');
  await transactionPage.selectDueDate();
  await page.getByRole('radio', { name: 'Draft' }).check();
  await transactionPage.addButton.click();
  await expect(transactionPage.amountInput).not.toBeVisible({ timeout: 5000 });

  // Verifikacija — provjeri u Transactions Overview
  const entityId = process.env.CC_ENTITY_ID || '40261';
  await page.goto(`/#/entity/${entityId}/transactions/in`);
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill(`${consumer.firstName} ${consumer.lastName}`);
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
  await page.waitForLoadState('networkidle');

  // Provjeri konzumera i opis
  await expect(
    page.getByRole('cell', { name: `${consumer.firstName} ${consumer.lastName}` }).first()
  ).toBeVisible({ timeout: 10000 });

  await expect(page.getByText('Test - Draft')).toBeVisible();

  console.log(`✓ Transaction (Draft) for: ${consumer.firstName} ${consumer.lastName}`);
});

});