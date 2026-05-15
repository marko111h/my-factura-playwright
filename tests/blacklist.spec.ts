import { test, expect } from '@playwright/test';
import { ConsumerPage } from './pages/ConsumerPage';
import { BlacklistPage } from './pages/BlacklistPage';
import { generateConsumerData } from './helpers/testData';

test.describe('Blacklist functionality', () => {
  test.setTimeout(90000); // 90 sekundi
  test('can open blacklist modal from consumer profile', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);
    const blacklistPage = new BlacklistPage(page);

    const consumer = generateConsumerData();

    // Kreiraj konzumera
    await consumerPage.goto();
    await consumerPage.createConsumer(consumer);
    await page.waitForTimeout(2000);

    // Pretraži i otvori profil
    await consumerPage.goto();
    await consumerPage.searchConsumer(consumer.lastName);
    await consumerPage.expectConsumerInResults(consumer.firstName, consumer.lastName);
    await page.getByRole('cell', { name: `${consumer.firstName} ${consumer.lastName}` }).click();

    await expect(page).toHaveURL(/.*consumer-360-tabs.*profile/);

    await blacklistPage.openBlacklistModal();
    await blacklistPage.expectBlacklistModalVisible();

    console.log(`✓ Blacklist modal opened for: ${consumer.firstName} ${consumer.lastName}`);
  });

  test('can add consumer to blacklist', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);
    const blacklistPage = new BlacklistPage(page);

    const consumer = generateConsumerData();

    // Kreiraj konzumera sa IBAN-om
    await consumerPage.goto();
    await consumerPage.createConsumer(consumer);
    await page.waitForTimeout(2000);

    // Pretraži i otvori profil
    await consumerPage.goto();
    await consumerPage.searchConsumer(consumer.lastName);
    await consumerPage.expectConsumerInResults(consumer.firstName, consumer.lastName);
    await page.getByRole('cell', { name: `${consumer.firstName} ${consumer.lastName}` }).click();

    // Dodaj na blacklist
    await blacklistPage.addToBlacklist('Test blacklist reason - Playwright');

    // Provjeri na Blacklist stranici
    const entityId = process.env.CC_ENTITY_ID || '40261';
    await page.goto(`/#/entity/${entityId}/out-factoring/blacklist`);
    await page.waitForLoadState('networkidle');

    // Filtriraj po emailu
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill(consumer.email);
    await page.getByRole('button', { name: 'Filter', exact: true }).click();
    await page.waitForLoadState('networkidle');


    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.getByText(consumer.email)).toBeVisible({ timeout: 10000 });

    console.log(`✓ Consumer blacklisted: ${consumer.firstName} ${consumer.lastName}`);
  });

});