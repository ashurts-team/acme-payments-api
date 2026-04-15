/**
 * feeCalculator.js
 * Calculates transaction fees based on payment method and region.
 * This file is intentionally WELL-WRITTEN to give the agent a PASS section.
 *
 * It has proper input validation, error handling, no console.logs, no TODOs,
 * and full test coverage in tests/unit/feeCalculator.test.js.
 */

/** Supported payment methods and their fee rates */
const FEE_RATES = {
  card:          0.029,
  bank_transfer: 0.008,
  wallet:        0.015,
};

/** Minimum transaction fee in currency minor units (e.g. cents) */
const MINIMUM_FEE = 0.30;

/** Supported ISO 4217 currency codes */
const SUPPORTED_CURRENCIES = new Set(["USD", "EUR", "GBP", "AUD", "CAD"]);

/**
 * Calculates the transaction fee for a payment.
 *
 * @param {number} amount        - Payment amount in major currency units (e.g. dollars)
 * @param {string} paymentMethod - One of: "card", "bank_transfer", "wallet"
 * @param {string} currency      - ISO 4217 currency code
 * @returns {{ fee: number, rate: number, currency: string }}
 * @throws {Error} If amount, paymentMethod, or currency is invalid
 */
export function calculateTransactionFee(amount, paymentMethod, currency) {
  if (typeof amount !== "number" || amount <= 0 || !isFinite(amount)) {
    throw new Error(`Invalid amount: ${amount}. Must be a positive finite number.`);
  }
  if (!FEE_RATES[paymentMethod]) {
    throw new Error(`Unsupported payment method: "${paymentMethod}". Supported: ${Object.keys(FEE_RATES).join(", ")}`);
  }
  if (!SUPPORTED_CURRENCIES.has(currency)) {
    throw new Error(`Unsupported currency: "${currency}". Supported: ${[...SUPPORTED_CURRENCIES].join(", ")}`);
  }

  const rate = FEE_RATES[paymentMethod];
  const calculatedFee = parseFloat((amount * rate).toFixed(2));
  const fee = Math.max(calculatedFee, MINIMUM_FEE);

  return { fee, rate, currency };
}

/**
 * Determines whether a given transaction qualifies for a fee waiver.
 * Qualifying criteria: bank_transfer above $10,000 (large corporate transfers).
 *
 * @param {number} amount
 * @param {string} paymentMethod
 * @returns {boolean}
 */
export function qualifiesForFeeWaiver(amount, paymentMethod) {
  if (typeof amount !== "number" || amount <= 0) return false;
  return paymentMethod === "bank_transfer" && amount >= 10000;
}
