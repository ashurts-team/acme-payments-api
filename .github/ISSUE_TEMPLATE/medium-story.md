---
name: "⚠️ SAMPLE: Partial Story (Pre-Dev WARN)"
about: Example of a story that produces a WARN — good intent, incomplete execution
title: "[STORY] User can request a refund for a failed payment"
labels: story, pre-dev-test
---

## User Story
As a **customer**, I want to **request a refund for a failed payment**, so that **I get my money back quickly**.

## Background
When a payment fails after the charge has been captured, users need a self-service refund option.

## Acceptance Criteria

**AC 1 — Successful Refund**
Given a payment transaction in "failed" status,
When the customer submits a refund request,
Then the refund is processed within 5 business days and the customer receives a confirmation email.

**AC 2 — Duplicate Refund Prevention**
The system should not allow duplicate refunds.

**AC 3 — Refund Amount Validation**
The refund amount cannot exceed the original transaction amount.

<!-- 
INTENTIONAL PROBLEMS FOR AGENT TESTING:
  1. AC 2 is not Gherkin format — will score Low testability
  2. AC 3 has no Given/When/Then — will score Medium testability
  3. No negative path for what happens when refund fails at gateway
  4. No BRD reference linked
  5. "quickly" is a vague word in the story body
  6. Missing: what error message does the user see if refund is rejected?
  The Pre-Dev agent review should return ⚠️ WARN with specific improvement suggestions.
-->

## Story Points: 3
