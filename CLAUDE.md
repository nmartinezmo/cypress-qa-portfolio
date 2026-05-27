# CLAUDE.md — Cypress + TypeScript QA Portfolio

> Move this file to the **root of the new repo** and rename it `CLAUDE.md`.
> Claude Code reads this automatically when invoked in the repo directory.

---

## 1. Project context

This repository is a **portfolio demo** for Nicolás Martínez (QA Automation Engineer based in Bogotá), built to showcase production-quality test automation skills for **senior QA remote roles** (target offer: Proxet Senior QA Engineer — Cypress / JavaScript / TypeScript stack).

The repo must look like a small, real, well-maintained automation framework — not a tutorial scratchpad.

**Audience that will read this code:**

1. Senior QA / SDET reviewing as part of pre-interview screening.
2. Hiring managers scanning the README and CI runs.
3. Future-Nicolás extending it after landing the role.

**Non-goal:** Building a real product. This is the _test suite_, not the application under test.

---

## 2. Scope and constraints

| Item                   | Decision                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Application under test | Public demo apps — **no app code in this repo**. Default targets: SauceDemo (UI), ReqRes + JSONPlaceholder (API). |
| Test layers            | **UI (Cypress)** + **API (Cypress `cy.request` + a separate Postman collection runnable with Newman)**            |
| Language               | **TypeScript** (strict) — required by target offer                                                                |
| Time budget            | **1–2 days** for the v1; stretch goals come after                                                                 |
| Public on GitHub       | **Yes** — repo URL will be added to CV header                                                                     |
| License                | MIT                                                                                                               |

---

## 3. Tech stack (pinned)

- **Node.js**: 20 LTS (use `.nvmrc`)
- **Cypress**: latest stable (14.x at time of writing)
- **TypeScript**: 5.x, `strict: true`
- **ESLint** + **Prettier** + **@typescript-eslint/parser**
- **mochawesome** for HTML reports
- **Newman** (CLI) for running the Postman collection in CI
- **GitHub Actions** for CI
- **husky** + **lint-staged** for pre-commit hooks

Do NOT add: jest, vitest, playwright, webdriverio, or any framework that competes with Cypress. Keep the stack tight.

---

## 4. Repository layout

```
.
├── .github/
│   └── workflows/
│       └── ci.yml                # PR + push to main; matrix: ui, api
├── .husky/
│   └── pre-commit                # runs lint-staged
├── cypress/
│   ├── e2e/
│   │   ├── ui/
│   │   │   ├── login.cy.ts
│   │   │   ├── inventory.cy.ts
│   │   │   └── checkout.cy.ts
│   │   └── api/
│   │       ├── users.cy.ts
│   │       └── posts.cy.ts
│   ├── fixtures/
│   │   ├── users.json
│   │   └── products.json
│   ├── support/
│   │   ├── commands.ts           # custom commands (cy.login, cy.apiRequest)
│   │   ├── e2e.ts                # global hooks, plugin imports
│   │   └── pages/
│   │       ├── LoginPage.ts
│   │       ├── InventoryPage.ts
│   │       └── CheckoutPage.ts
│   └── selectors/
│       └── *.selectors.ts        # centralized data-test selectors per page
├── postman/
│   ├── portfolio.postman_collection.json
│   └── envs/
│       └── reqres.postman_environment.json
├── reports/                      # gitignored — generated only
├── .nvmrc
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── cypress.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. Quality bar (non-negotiable)

These rules are how a senior reviewer separates "junior portfolio" from "senior portfolio". Treat them as hard gates.

- **TypeScript strict** — no `any`, no `@ts-ignore` without a comment explaining why
- **Zero ESLint warnings** on `main`
- **All specs independent** — any spec must pass when run alone (no test-to-test coupling)
- **No hard waits** — `cy.wait(2000)` is banned. Use `cy.intercept()` aliases and `cy.wait('@alias')`
- **Selectors via `data-test` / `data-cy`** when the app exposes them; otherwise use role/text queries. **Never** CSS class selectors that look like `.btn-primary-3` — they break with the next CSS refactor
- **Page Object Model**: pages expose **actions and assertions**, never raw selectors
- **One assertion intent per test**, but multiple `expect`/`should` lines are fine if they describe the same intent
- **Retries**: `retries: { runMode: 2, openMode: 0 }` — never mask flakes in dev
- **Test data**: from fixtures or generators; never hardcoded inside specs
- **CI must be green** on `main` at all times. If a flake is found, fix it or quarantine it with a tracked TODO

---

## 6. Naming conventions

| Item           | Pattern                              | Example                                                     |
| -------------- | ------------------------------------ | ----------------------------------------------------------- |
| Spec file      | `<feature>.cy.ts`                    | `login.cy.ts`                                               |
| Page object    | `<Page>Page.ts` (PascalCase)         | `LoginPage.ts`                                              |
| Selector file  | `<page>.selectors.ts`                | `login.selectors.ts`                                        |
| Custom command | camelCase verb                       | `cy.loginAs(user)`                                          |
| Fixture        | kebab-case                           | `valid-user.json`                                           |
| `describe`     | `Feature — Sub-area`                 | `'Login — happy path'`                                      |
| `it`           | `should <behavior> when <condition>` | `'should redirect to inventory when credentials are valid'` |

---

## 7. Commands (must exist in `package.json`)

```
npm install                # install deps
npm run cy:open            # open Cypress UI for local dev
npm test                   # run ALL cypress specs headless
npm run cy:ui              # only cypress/e2e/ui
npm run cy:api             # only cypress/e2e/api
npm run api:newman         # run Postman collection via newman
npm run lint               # eslint .
npm run lint:fix           # eslint . --fix
npm run typecheck          # tsc --noEmit
npm run format             # prettier --write .
npm run report             # merge + generate mochawesome HTML in reports/
```

A `predev` / `pretest` step should run `typecheck` before tests when reasonable.

---

## 8. CI strategy (`.github/workflows/ci.yml`)

- Trigger: `pull_request` and `push` to `main`
- Single job with **matrix**: `suite: [ui, api]` running in parallel
- Steps: setup node 20 → cache npm → install → typecheck → lint → run matrix suite → upload mochawesome HTML as artifact
- Separate job for Newman: runs the Postman collection and uploads its HTML report
- **Status badge** in README pointing at the workflow

---

## 9. README requirements

The README is the reviewer's first impression. It must contain, in this order:

1. **One-line value prop** ("End-to-end + API automation framework in Cypress + TypeScript, with CI, reports, and POM.")
2. **CI status badge** (green)
3. **What's inside** — 2-line summary of UI, API, Postman layers
4. **Stack table** — Cypress version, TS version, Node version
5. **How to run** — `npm install && npm test`
6. **Folder layout** — short tree
7. **Reports** — link to where mochawesome HTML lives + screenshot
8. **Design decisions** — short bullet list (POM, no hard waits, data-test selectors, etc.) — this is where you signal seniority
9. **About** — one short paragraph linking to Nicolás's LinkedIn

Keep the README under ~150 lines. Reviewers scan, they don't read.

---

## 10. What Claude Code SHOULD do

- Always run `npm run typecheck && npm run lint && npm test` before claiming a task is done
- Add JSDoc comments to **custom commands** and **page objects** (their public methods only) — not to specs
- Prefer adding a small test that proves a fix over describing it in chat
- Open PRs against a feature branch, never push directly to `main`
- When unsure between two approaches, pick the one closer to what a real production framework would do, not the cleverest

---

## 11. What Claude Code MUST NOT do

- ❌ Introduce `any` to silence the type checker
- ❌ Add `cy.wait(<number>)` to "fix" a flake
- ❌ Use CSS class selectors (`.btn`, `#submit-3`) instead of `data-test`/role
- ❌ Create new frameworks or testing libraries beyond what's in section 3
- ❌ Add tests that depend on the order specs run in
- ❌ Commit `node_modules`, `cypress/screenshots`, `cypress/videos`, `reports/`
- ❌ Push secrets — there are none in this repo, keep it that way
- ❌ Refactor everything when adding a small feature; stay scoped

---

## 12. First-run checklist (paste this into the first task)

1. `git init && gh repo create cypress-qa-portfolio --public --source=. --remote=origin`
2. `nvm use 20 && npm init -y`
3. Install: `cypress typescript @types/node eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-cypress mochawesome mochawesome-merge mochawesome-report-generator husky lint-staged newman newman-reporter-htmlextra`
4. Generate `cypress.config.ts`, `tsconfig.json`, `.eslintrc.cjs`, `.prettierrc`
5. Add 1 UI spec (login.cy.ts) targeting SauceDemo + 1 API spec (users.cy.ts) targeting ReqRes
6. Build LoginPage + commands.ts + selectors
7. Postman collection with 3 endpoints + Newman script
8. GitHub Actions workflow with the matrix
9. README per section 9
10. Commit, push, wait for green CI, screenshot the run for the README

If any step in this checklist fails, stop and report rather than improvising — the framework foundations have to be solid.

---

## 13. Stretch goals (only after v1 is green and pushed)

In order of marginal CV value:

1. **`cypress-axe`** — accessibility tests on the login + inventory pages. Cheap, looks senior.
2. **`@cypress/component`** — component testing on a tiny React component (matches Proxet's stack literal). Build a 50-line component locally in `src/components/` just for this.
3. **Visual regression** with `cypress-image-snapshot` — 1 page baseline.
4. **K6 load test** in `perf/` — single scenario hitting a public API. You have the K6 certification; show it.
5. **BDD layer** with `@badeball/cypress-cucumber-preprocessor` — one `.feature` file paralleling the login spec.

Each stretch goal must come with its own README section explaining the _why_, not just the _what_.

---

## 14. Tone for commits, PRs, and code comments

- Commit messages: imperative, scoped — `feat(ui): add checkout happy-path spec`, `fix(api): handle 404 on missing user`
- PRs: short description + screenshot/clip of the test run
- Code comments: only for non-obvious decisions (e.g. _why_ a flaky pattern was avoided). No commentary that just narrates the code.

---

## 15. Definition of done for the whole portfolio

Before adding the repo URL to the CV, the following must be true:

- [ ] CI badge is green on `main`
- [ ] At least 5 UI specs + 3 API specs + 1 Newman collection, all passing
- [ ] mochawesome HTML report renders correctly and is linked from README
- [ ] `npm run typecheck` and `npm run lint` exit 0
- [ ] README sections 1–9 (above) are complete
- [ ] Repo description on GitHub mentions "Cypress + TypeScript + CI"
- [ ] At least 5 thoughtful commits (not a single "initial commit")
- [ ] LinkedIn featured section pinning the repo

When this list is complete, update `CV_NicolasMartinez_Proxet.pdf` to add:
`Portfolio: github.com/<username>/cypress-qa-portfolio` in the header.
