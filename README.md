# cypress-qa-portfolio

End-to-end + API automation framework in Cypress + TypeScript, with CI, reports, and POM.

[![CI](https://github.com/adminbyoss-afk/cypress-qa-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/adminbyoss-afk/cypress-qa-portfolio/actions/workflows/ci.yml)

---

## What's inside

| Layer                    | Coverage                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **UI (Cypress)**         | Login, Inventory, and Checkout flows on [SauceDemo](https://www.saucedemo.com) — happy paths + error states |
| **API (Cypress)**        | ReqRes.in Users CRUD and JSONPlaceholder Posts CRUD — status codes + response schema                        |
| **API (Postman/Newman)** | 8-request collection covering Users + Auth endpoints with pre/post scripts                                  |

---

## Stack

| Tool       | Version              |
| ---------- | -------------------- |
| Node.js    | 20 LTS (`.nvmrc`)    |
| Cypress    | 15.x                 |
| TypeScript | 6.x (`strict: true`) |
| ESLint     | 10.x (flat config)   |
| Prettier   | 3.x                  |
| Newman     | 6.x                  |
| CI         | GitHub Actions       |

---

## How to run

```bash
npm install

# All specs (headless)
npm test

# Only UI specs
npm run cy:ui

# Only API specs
npm run cy:api

# Postman collection via Newman
npm run api:newman

# Open Cypress interactive runner
npm run cy:open
```

---

## Folder layout

```
cypress/
├── e2e/
│   ├── ui/           # login.cy.ts  inventory.cy.ts  checkout.cy.ts
│   └── api/          # users.cy.ts  posts.cy.ts
├── fixtures/         # users.json  products.json
├── selectors/        # *.selectors.ts — centralized data-test selectors
└── support/
    ├── commands.ts   # cy.loginAs(), cy.apiRequest()
    ├── e2e.ts        # global hooks
    └── pages/        # LoginPage  InventoryPage  CheckoutPage
postman/
├── portfolio.postman_collection.json
└── envs/reqres.postman_environment.json
.github/workflows/ci.yml
```

---

## Reports

HTML test reports are generated with **mochawesome** and uploaded as CI artifacts on every run.

To generate locally after a test run:

```bash
npm run report
# → reports/mochawesome/index.html
```

Newman HTML report: `reports/newman/report.html`

---

## Design decisions

- **Page Object Model** — pages expose actions and assertions, never raw selectors. Keeps specs readable and resilient to markup changes.
- **`data-test` selectors** — prefer `[data-test="..."]` attributes over CSS classes or XPath. They survive style refactors.
- **No hard waits** — `cy.wait(<number>)` is banned via ESLint rule. All async coordination uses intercept aliases or retry-ability.
- **`cy.session`** — login state is cached across tests in the same spec, avoiding repetitive UI interactions without losing isolation.
- **Fixtures over hardcoded data** — test data lives in `cypress/fixtures/`, never inline in specs.
- **Retries: `{ runMode: 2, openMode: 0 }`** — CI retries flaky tests twice; dev mode surfaces failures immediately.
- **`strict: true` TypeScript** — no `any`, no silent type casts. Type errors === build failures.
- **CI matrix** — `ui` and `api` suites run in parallel; Newman runs as a separate job. All upload mochawesome HTML artifacts.

---

## About

Built by **Nicolás Martínez**, QA Automation Engineer based in Bogotá.
Connect on [LinkedIn](https://www.linkedin.com/in/nicol%C3%A1s-mart%C3%ADnez-qa/).
