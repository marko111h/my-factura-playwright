import { faker } from '@faker-js/faker';
import { composeIBAN } from 'ibantools';

// Njemačke banke
export const germanBanks = [
  'Deutsche Bank',
  'Commerzbank',
  'Sparkasse',
  'Volksbank',
  'ING-DiBa',
  'DKB Deutsche Kreditbank',
  'HypoVereinsbank',
  'Postbank',
  'Raiffeisenbank',
  'Santander Bank'
];

// Random njemačka banka
export function randomGermanBank(): string {
  return germanBanks[Math.floor(Math.random() * germanBanks.length)];
}

// Generiraj kompletne test consumer podatke
export function generateConsumerData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(),
    iban: generateTestIBAN(),
    accountOwner: `${firstName} ${lastName}`,
    bankName: randomGermanBank(),
  };
}


function generateTestIBAN(): string {
  // Generiši 18 random cifara za BBAN
  const digits = Array.from({ length: 18 }, () => 
    Math.floor(Math.random() * 10)
  ).join('');
  
  const result = composeIBAN({ countryCode: 'DE', bban: digits });
  
  if (result) {
    return result;
  }
  
  // Fallback sa random brojem da izbjegnemo duplikate
  const random = Math.floor(Math.random() * 900000000) + 100000000;
  return `DE89${random}0000000000`;
}