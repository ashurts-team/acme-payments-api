/**
 * feeCalculator.test.js
 * Unit tests for the fee calculation logic.
 * These tests cover positive paths, negative paths, and edge cases.
 */

import { calculateTransactionFee, qualifiesForFeeWaiver } from "../../src/payments/feeCalculator.js";

describe("calculateTransactionFee", () => {
  // Positive path tests
  describe("valid inputs", () => {
    test("calculates card fee correctly for small amount", () => {
      const result = calculateTransactionFee(100, "card", "USD");
      expect(result.fee).toBe(2.90);
      expect(result.rate).toBe(0.029);
      expect(result.currency).toBe("USD");
    });

    test("calculates bank_transfer fee correctly", () => {
      const result = calculateTransactionFee(500, "bank_transfer", "GBP");
      expect(result.fee).toBe(4.00);
    });

    test("calculates wallet fee correctly", () => {
      const result = calculateTransactionFee(200, "wallet", "EUR");
      expect(result.fee).toBe(3.00);
    });

    test("applies minimum fee of 0.30 for very small amounts", () => {
      const result = calculateTransactionFee(0.01, "card", "USD");
      expect(result.fee).toBe(0.30);
    });

    test("rounds fee to 2 decimal places", () => {
      const result = calculateTransactionFee(33.33, "card", "USD");
      expect(result.fee).toBeCloseTo(0.97, 2);
    });
  });

  // Negative path tests
  describe("invalid inputs", () => {
    test("throws on zero amount", () => {
      expect(() => calculateTransactionFee(0, "card", "USD")).toThrow("Invalid amount");
    });

    test("throws on negative amount", () => {
      expect(() => calculateTransactionFee(-50, "card", "USD")).toThrow("Invalid amount");
    });

    test("throws on non-finite amount", () => {
      expect(() => calculateTransactionFee(Infinity, "card", "USD")).toThrow("Invalid amount");
    });

    test("throws on unsupported payment method", () => {
      expect(() => calculateTransactionFee(100, "crypto", "USD")).toThrow("Unsupported payment method");
    });

    test("throws on unsupported currency", () => {
      expect(() => calculateTransactionFee(100, "card", "JPY")).toThrow("Unsupported currency");
    });

    test("throws on non-numeric amount", () => {
      expect(() => calculateTransactionFee("100", "card", "USD")).toThrow("Invalid amount");
    });
  });
});

describe("qualifiesForFeeWaiver", () => {
  test("returns true for large bank transfer", () => {
    expect(qualifiesForFeeWaiver(15000, "bank_transfer")).toBe(true);
  });

  test("returns false for card payment regardless of amount", () => {
    expect(qualifiesForFeeWaiver(50000, "card")).toBe(false);
  });

  test("returns false for bank_transfer below threshold", () => {
    expect(qualifiesForFeeWaiver(9999, "bank_transfer")).toBe(false);
  });

  test("returns false for invalid amount", () => {
    expect(qualifiesForFeeWaiver(-100, "bank_transfer")).toBe(false);
  });

  test("returns true exactly at threshold", () => {
    expect(qualifiesForFeeWaiver(10000, "bank_transfer")).toBe(true);
  });
});
