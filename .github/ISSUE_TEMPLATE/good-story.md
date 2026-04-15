---
name: "✅ SAMPLE: Well-Formed Story (Pre-Dev PASS)"
about: Example of a story that passes Pre-Dev review — use this as a template
title: "[STORY] User can log in with email and password"
labels: story, pre-dev-test
---

## User Story
As a **registered customer**, I want to **log in using my email address and password**, so that **I can access my account dashboard and payment history**.

## Background
This story implements the primary authentication flow for the ACME Payments web application. Users must be able to authenticate securely. Authentication uses JWT tokens with a 1-hour expiry. The flow must comply with OWASP Top 10 authentication guidelines.

BRD Reference: Section 3.2 — User Authentication Requirements

## Acceptance Criteria

**AC 1 — Successful Login**
Given a registered user with valid credentials,
When they submit their email and password via the login form,
Then they receive a JWT access token with a 1-hour expiry and are redirected to the dashboard.

**AC 2 — Invalid Password**
Given a registered user with an incorrect password,
When they submit the login form,
Then they receive an HTTP 401 response with the message "Invalid credentials" and no token is issued.

**AC 3 — Non-existent Email**
Given an email address not registered in the system,
When a login attempt is made with that email,
Then the response is HTTP 401 with a generic "Invalid credentials" message (no user enumeration).

**AC 4 — Rate Limiting**
Given a user who has made 5 failed login attempts within 15 minutes,
When they attempt a 6th login,
Then their account is temporarily locked for 30 minutes and they receive an HTTP 429 response.

**AC 5 — Token Expiry**
Given a user with a JWT token that has expired,
When they make an authenticated API request,
Then the response is HTTP 401 with the message "Token expired. Please log in again."

## Out of Scope
- Social login (OAuth via Google/Apple) — tracked in PROJ-456
- Two-factor authentication — tracked in PROJ-457
- Password reset flow — tracked in PROJ-458

## Story Points: 5

## Definition of Done
- [ ] All 5 ACs have passing unit and integration tests
- [ ] No plaintext passwords or tokens in logs
- [ ] Security review signed off
- [ ] CodeQL scan passes with no new HIGH/CRITICAL alerts
