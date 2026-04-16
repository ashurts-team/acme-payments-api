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

  test("returns NaN for unknown payment method (missing input validation)", () => {
    // This demonstrates the missing validation bug in calculateFee —
    // it should throw on unknown method, but instead returns NaN.
    // The agent's code quality analysis flags this as a MEDIUM issue.
    expect(calculateFee(100, "unknown_method")).toBeNaN();
  });
});

// NOTE: No tests for processPayment() — the main function handling AC #1, #2, #3
// NOTE: No tests for refundPayment() — the refund AC is completely uncovered
// NOTE: No integration tests simulating gateway responses
