import { test, expect } from '@playwright/test';
import { ConsumerPage } from './pages/ConsumerPage';
import { faker } from '@faker-js/faker';
import { ConsumerProfilePage } from './pages/ConsumerProfilePage';
import { generateConsumerData } from './helpers/testData';

test.describe('Consumer management', () => {

  test('can navigate to Consumer Cockpit', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);
    await consumerPage.goto();
    await expect(page).toHaveURL(/.*consumers\/smart-search-box/);
    await expect(consumerPage.moreActionsButton).toBeVisible();
  });

  test('create consumer form opens', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);
    await consumerPage.goto();
    await consumerPage.openCreateForm();
    await expect(consumerPage.personRadio).toBeVisible();
    await expect(consumerPage.firstNameInput).toBeVisible();
    await expect(consumerPage.lastNameInput).toBeVisible();
    await expect(consumerPage.createButton).toBeVisible();
  });

  test('can create a new consumer with fake data', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);
    const consumer = generateConsumerData();
    await consumerPage.goto();
    await consumerPage.createConsumer(consumer);
    await page.waitForTimeout(2000);
    await expect(consumerPage.firstNameInput).not.toBeVisible();
    console.log(`✓ Created: ${consumer.firstName} ${consumer.lastName} (${consumer.iban})`);
  });

  test('can create multiple consumers', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);

    const consumers = Array.from({ length: 3 }, () => generateConsumerData());

    for (const consumer of consumers) {
      await consumerPage.goto();
      await consumerPage.createConsumer(consumer);
      await expect(consumerPage.firstNameInput).not.toBeVisible({ timeout: 5000 });
      console.log(`✓ Created: ${consumer.firstName} ${consumer.lastName} (${consumer.iban})`);
    }
  });

    test('can search for created consumer', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);

    const consumer = generateConsumerData();

    // Korak 1: Kreiraj konzumera
    await consumerPage.goto();
    await consumerPage.createConsumer(consumer);
    await page.waitForTimeout(2000);

    // Korak 2: Vrati se na listu
    await consumerPage.goto();

    // Korak 3: Pretraži po prezimenu
    await consumerPage.searchConsumer(consumer.lastName);

    // Korak 4: Provjeri da se pojavljuje u rezultatima
    await consumerPage.expectConsumerInResults(consumer.firstName, consumer.lastName);
    
    console.log(`✓ Created and found: ${consumer.firstName} ${consumer.lastName}`);
    });

    test('can open consumer profile and see tabs', async ({ page }) => {
        const consumerPage = new ConsumerPage(page);
        const profilePage = new ConsumerProfilePage(page);

        const consumer = generateConsumerData();

        await consumerPage.goto();
        await consumerPage.createConsumer(consumer);
        await page.waitForTimeout(2000);

        // Korak 2: Pretraži i pronađi konzumera
        await consumerPage.goto();
        await consumerPage.searchConsumer(consumer.lastName);
        await consumerPage.expectConsumerInResults(consumer.firstName, consumer.lastName);
        await page.getByRole('cell', { name: `${consumer.firstName} ${consumer.lastName}` }).click();

        await profilePage.expectProfileLoaded(consumer.firstName, consumer.lastName);
        await profilePage.expectAllTabsVisible();
        await profilePage.clickBankInformation();
        await expect(page).toHaveURL(/.*bank-info/);
        await profilePage.goBack();
        await expect(page).toHaveURL(/.*smart-search-box/);

        console.log(`✓ Profile opened for: ${consumer.firstName} ${consumer.lastName}`);
});
});