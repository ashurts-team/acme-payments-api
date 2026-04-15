/**
 * paymentProcessor.test.js
 * INTENTIONALLY INCOMPLETE — only tests calculateFee, not processPayment or refundPayment.
 * This means the agent's AC traceability for payment processing ACs will score as PARTIAL/MISSING.
 */

import { calculateFee } from "../../src/payments/paymentProcessor.js";

describe("calculateFee", () => {
  test("calculates card fee", () => {
    expect(calculateFee(100, "card")).toBeCloseTo(2.9);
  });

  test("returns 0 for unknown payment method", () => {
    // INTENTIONAL: The function returns NaN for unknown types (undefined * rate)
    // This test incorrectly expects 0 — it will FAIL, demonstrating missing validation
    expect(calculateFee(100, "unknown_method")).toBe(0);
  });
});

// NOTE: No tests for processPayment() — the main function handling AC #1, #2, #3
// NOTE: No tests for refundPayment() — the refund AC is completely uncovered
// NOTE: No integration tests simulating gateway responses
