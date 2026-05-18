---

## Prerequisites

- Node.js 20+
- npm 11+

---

## Setup

**1. Clone the repository:**
```bash
git clone https://github.com/marko111h/my-factura-playwright.git
cd my-factura-playwright
```

**2. Install dependencies:**
```bash
npm install
npx playwright install
```

**3. Create `.env` file in root:**


CC_BASE_URL=https://dev-cc.dev.gerniks.net
CC_USERNAME=your_username
CC_PASSWORD=your_password
CC_ENTITY_ID=******

---

## Running Tests

**All tests:**
```bash
npx playwright test
```

**Specific file:**
```bash
npx playwright test consumer.spec.ts
```

**Headed mode (see browser):**
```bash
npx playwright test --headed --project=chromium
```

**UI mode (interactive):**
```bash
npx playwright test --ui
```

**HTML report:**
```bash
npx playwright show-report
```

---

## Test Coverage

| File | Tests | Description |
|------|-------|-------------|
| `login.spec.ts` | 3 | Login, failed login, form visibility |
| `dashboard.spec.ts` | 3 | Dashboard load, menu navigation |
| `consumer.spec.ts` | 6 | Create, search, profile, tabs |
| `blacklist.spec.ts` | 2 | Blacklist modal, add to blacklist |
| `transaction.spec.ts` | 5 | Collect, Draft, Send to reminder only |

**Total: 19 tests**

---

## Architecture

### Storage State Authentication
Login is performed once in `auth.setup.ts` and saved to `playwright/.auth/user.json`. All subsequent tests reuse this session — no repeated logins.

### Page Object Model (POM)
UI interactions are encapsulated in page classes under `tests/pages/`. Tests only call high-level methods like `consumerPage.createConsumer(data)`.

### Test Data Generation
`tests/helpers/testData.ts` provides `generateConsumerData()` which creates realistic German consumer data:
- Faker.js names and emails (`@example.com`)
- Valid DE IBAN via `composeIBAN`
- Random German bank names

---

## CI/CD

Tests run automatically on every push to `main` via GitHub Actions.
Manual trigger available via **Actions → Run workflow**.

Artifacts: HTML report saved for 30 days after each run.

---

## Environment

All tests run against the **development environment**: `dev-cc.dev.gerniks.net`

Test data uses `@example.com` emails to avoid sending real emails.