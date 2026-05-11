import { test, expect } from '@playwright/test';
import { ConsumerPage } from './pages/ConsumerPage';
import { faker } from '@faker-js/faker';

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

    // Faker generiše realistična Njemačka/Evropska data
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    const consumerData = {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(),
      accountOwner: `${firstName} ${lastName}`,
      bankName: faker.company.name(),
      iban: 'DE89370400440532013000', // Validan test IBAN
    };

    console.log(`Creating consumer: ${firstName} ${lastName} (${consumerData.email})`);

    await consumerPage.goto();
    await consumerPage.createConsumer(consumerData);
    
    await page.waitForTimeout(2000);
    await expect(consumerPage.firstNameInput).not.toBeVisible();
  });

  test('can create multiple consumers', async ({ page }) => {
    const consumerPage = new ConsumerPage(page);

    // Kreiraj 3 konzumera u jednom testu
    const consumers = Array.from({ length: 3 }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(),
      };
    });

    for (const consumer of consumers) {
      await consumerPage.goto();
      await consumerPage.createConsumer(consumer);
      await page.waitForTimeout(1500);
      console.log(`✓ Created: ${consumer.firstName} ${consumer.lastName}`);
    }
  });

});