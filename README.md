# ACME Payments API — AI Story Review Agent Test Project

This is a **deliberately imperfect** sample Node.js microservice designed to be used as the target project when testing the [AI Story Review Agent](../IMPLEMENTATION.md) built on Atlassian Forge and Rovo.

The codebase contains **intentional quality, security, and coverage issues** spread across its source files. When you link Jira stories to pull requests against this repo and run the agent, you should observe a range of Pre-Dev and Post-Dev scores — from hard BLOCKs to clean PASSes — depending on which story and which files are in the PR.

---

## Repository Structure

```
acme-payments-api/
├── src/
│   ├── auth/
│   │   └── authService.js          ❌ Hardcoded JWT secret, empty catches, PII logging
│   ├── payments/
│   │   ├── paymentProcessor.js     ❌ No input validation, empty catch, card data logged
│   │   └── feeCalculator.js        ✅ Well-written — full validation, no issues
│   ├── users/
│   │   └── userService.js          ❌ SQL injection, no authz checks, GDPR FIXMEs
│   ├── notifications/
│   │   └── notificationService.js  ⚠️  Missing rate limiting, empty catch on SMS
│   └── utils/
│       └── logger.js               ✅ Simple utility — no issues
├── tests/
│   ├── unit/
│   │   ├── feeCalculator.test.js   ✅ Full coverage — positive, negative, edge cases
│   │   └── paymentProcessor.test.js ❌ Incomplete — missing processPayment tests
│   └── integration/                ❌ Empty — no integration tests written
├── .github/
│   ├── workflows/
│   │   ├── codeql.yml              🔍 Triggers GHAS CodeQL on every PR
│   │   └── secret-scanning.yml    🔍 Dependency Review blocks HIGH/CRITICAL vulns
│   ├── ISSUE_TEMPLATE/
│   │   ├── good-story.md          ✅ Well-formed story → Pre-Dev PASS
│   │   ├── medium-story.md        ⚠️  Partially formed → Pre-Dev WARN
│   │   └── bad-story.md           🚫 Vague/unmeasurable → Pre-Dev BLOCK
│   └── pull_request_template.md   📋 PR checklist aligned to the agent's review criteria
└── package.json
```

---

## What the Agent Will Find

### 🔴 GHAS — Expected CodeQL Alerts (after first scan)

| File | Issue | Expected Severity |
|---|---|---|
| `src/users/userService.js` | SQL injection via string interpolation in `searchUsers()` | **CRITICAL** |
| `src/auth/authService.js` | Hardcoded JWT secret `"super-secret-jwt-key-abc123-hardcoded"` | **HIGH** |
| `src/payments/paymentProcessor.js` | Logging of sensitive card data (`cardNumber`, `cvv`) | **HIGH** |
| `src/auth/authService.js` | Empty catch block swallowing database errors | **MEDIUM** |
| `src/payments/paymentProcessor.js` | Missing null check before `gatewayResponse.transactionId` | **MEDIUM** |

### 🔴 GHAS — Expected Secret Scanning Alerts

| File | Secret Type | Line |
|---|---|---|
| `src/auth/authService.js` | Generic high-entropy string / JWT secret | Line 14 |

> **Note:** GitHub's secret scanning uses pattern matching. The string `super-secret-jwt-key-abc123-hardcoded` may not trigger a default secret pattern, but the CodeQL `js/hardcoded-credentials` rule will catch it. To guarantee a secret scanning hit, replace the string with a real (but revoked) credential format such as a GitHub PAT pattern (`ghp_...`).

### 🟡 Code Quality Flags (Static Analysis by Agent)

| File | Flag | Severity |
|---|---|---|
| `src/auth/authService.js` | `console.log` of password | LOW |
| `src/auth/authService.js` | 2× empty catch blocks | HIGH |
| `src/auth/authService.js` | 2× loose null checks (`== null`) | LOW |
| `src/auth/authService.js` | TODO comment | MEDIUM |
| `src/payments/paymentProcessor.js` | `console.log` of card/CVV data | LOW |
| `src/payments/paymentProcessor.js` | Empty catch block | HIGH |
| `src/payments/paymentProcessor.js` | TODO + FIXME comments | MEDIUM |
| `src/users/userService.js` | `console.log` of PII | LOW |
| `src/users/userService.js` | 2× FIXME comments | MEDIUM |
| `src/notifications/notificationService.js` | Empty catch on SMS | HIGH |
| `src/notifications/notificationService.js` | 2× TODO comments | MEDIUM |

### ✅ What the Agent Should Score Positively

| File | Positive Signal |
|---|---|
| `src/payments/feeCalculator.js` | Full input validation, no console.logs, no TODOs |
| `tests/unit/feeCalculator.test.js` | Covers positive paths, negative paths, and 3 edge cases |
| `.github/workflows/codeql.yml` | Signals GHAS is enabled — agent sees alerts via API |

---

## Test Scenarios

Use the following scenarios to exercise specific agent scoring paths:

### Scenario 1 — Pre-Dev BLOCK 🚫
1. Create a new Jira issue using the **"🚫 SAMPLE: Poorly-Formed Story"** template
2. Transition it to **"In Progress"**
3. **Expected agent output:** `🚫 BLOCK` with flags for vague language, missing Gherkin ACs, 13-point size, no BRD reference

### Scenario 2 — Pre-Dev WARN ⚠️
1. Create a new Jira issue using the **"⚠️ SAMPLE: Partial Story"** template
2. Transition it to **"In Progress"**
3. **Expected agent output:** `⚠️ WARN` with suggestions to improve AC #2 and AC #3 to Gherkin format and add a negative-path AC

### Scenario 3 — Pre-Dev PASS ✅
1. Create a new Jira issue using the **"✅ SAMPLE: Well-Formed Story"** template
2. Transition it to **"In Progress"**
3. **Expected agent output:** `✅ PASS` with AC testability rated H for all 5 Gherkin-format ACs

### Scenario 4 — Post-Dev BLOCK (Security Hard Block) 🚫
1. Use the well-formed login story (Scenario 3)
2. Create a PR that modifies **`src/auth/authService.js`** (contains hardcoded secret + empty catches)
3. Link the PR to the Jira story via "Link issue" → remote link
4. Let CodeQL scan complete (~5 min), then transition the issue to **"In Review"**
5. **Expected agent output:** `🚫 BLOCK` — hard block due to CodeQL HIGH alert + security-related AC

### Scenario 5 — Post-Dev WARN (Partial Coverage) ⚠️
1. Use the refund story (Scenario 2)
2. Create a PR that modifies **`src/payments/paymentProcessor.js`** only (no test files)
3. Link the PR to the Jira story, transition to **"In Review"**
4. **Expected agent output:** `⚠️ WARN` — low AC keyword match, no test files detected (−10pts), GHAS alerts present

### Scenario 6 — Post-Dev PASS ✅
1. Create a story for the fee calculator: "As a merchant, I want transaction fees calculated accurately, so that I am charged the correct amount."
2. Add 3 Gherkin ACs covering: valid fee calculation, minimum fee enforcement, unsupported currency rejection
3. Create a PR modifying **only `src/payments/feeCalculator.js`** and **`tests/unit/feeCalculator.test.js`**
4. Link PR, transition to **"In Review"**
5. **Expected agent output:** `✅ PASS` — high AC keyword match, test files present, no GHAS alerts on this file

---

## Setup

### Prerequisites
- Node.js 20+
- A GitHub repository with **GitHub Advanced Security enabled** (free for public repos; requires GHAS licence for private repos)
- The AI Story Review Agent installed and configured on your Jira site ([see main IMPLEMENTATION.md](../IMPLEMENTATION.md))

### Install & Run Tests
```bash
npm install
npm test
```

### Enable GHAS on Your Fork
1. Fork this repository
2. Go to **Settings → Security → Code security and analysis**
3. Enable: **Dependency graph**, **Dependabot alerts**, **Code scanning** (CodeQL), **Secret scanning**
4. Push any commit to trigger the first CodeQL scan — results appear under **Security → Code scanning**

### Configure the Agent to Point at Your Fork
```bash
# In the main Forge app directory:
forge storage set github-repo-config '{"owner":"YOUR-GITHUB-USERNAME","repo":"acme-payments-api"}'
```

---

## Expected Score Ranges by Scenario

| Scenario | Pre-Dev | Post-Dev §1 | Post-Dev §2 | Post-Dev §3 | Total |
|---|---|---|---|---|---|
| Bad Story + authService PR | BLOCK | ~40 | 0 (hard block) | ~60 | **BLOCK** |
| Medium Story + paymentProcessor PR | WARN | ~55 | ~50 | ~65 | **~56 BLOCK** |
| Good Story + feeCalculator PR | PASS | ~90 | ~95 | ~95 | **~93 PASS** |

---

## Contributing New Test Scenarios

To add a new test scenario:
1. Add a source file under `src/` with the intentional issue you want to test
2. Add a corresponding Jira issue template under `.github/ISSUE_TEMPLATE/`
3. Document the expected agent score in the table above
4. Open a PR — the agent will review it automatically when linked to a Jira story!

---

*Sample project for use with the [AI Story Review Agent](../IMPLEMENTATION.md) — Atlassian Forge + Rovo*
