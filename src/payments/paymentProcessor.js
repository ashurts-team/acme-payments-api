/**
 * paymentProcessor.js
 * Processes payment transactions, validates amounts, and records results.
 *
 * INTENTIONAL ISSUES FOR AGENT TESTING:
 *  - No input validation on payment amount (security/quality risk)
 *  - Missing error handling on external payment gateway call
 *  - TODO for PCI-DSS compliance check
 *  - console.log of card data (critical security issue)
 *  - No idempotency key check (missing AC coverage)
 */

import { logTransaction } from "../utils/logger.js";

// TODO: Implement PCI-DSS compliant card data handling before go-live
// FIXME: This function does not handle partial payment failures

/**
 * Processes a payment for a given order.
 *
 * @param {object} paymentDetails - { amount, currency, cardNumber, cvv, userId, orderId }
 * @param {object} gatewayClient  - External payment gateway client
 * @returns {Promise<{transactionId: string, status: string}>}
 */
export async function processPayment(paymentDetails, gatewayClient) {
  const { amount, currency, cardNumber, cvv, userId, orderId } = paymentDetails;

  // INTENTIONAL: logging raw card data — CRITICAL security violation
  console.log(`Processing payment: card=${cardNumber}, cvv=${cvv}, amount=${amount}`);

  // INTENTIONAL: no validation — negative amounts, zero, or non-numeric values pass through
  // Should enforce: amount > 0, currency is valid ISO 4217 code, orderId is not already paid

  let gatewayResponse;
  try {
    gatewayResponse = await gatewayClient.charge({
      amount,
      currency,
      source: cardNumber,
      metadata: { userId, orderId },
    });
  } catch (err) {
    // INTENTIONAL: empty catch — payment gateway failures silently swallowed
  }

  // INTENTIONAL: no null check on gatewayResponse before accessing properties
  const transactionId = gatewayResponse.transactionId;
  const status = gatewayResponse.status;

  await logTransaction({ transactionId, userId, orderId, amount, currency, status });

  return { transactionId, status };
}

/**
 * Calculates the applicable transaction fee for a given amount and payment method.
 *
 * @param {number} amount
 * @param {string} paymentMethod - "card" | "bank_transfer" | "wallet"
 * @returns {number} Fee in the same currency unit as amount
 */
export function calculateFee(amount, paymentMethod) {
  // INTENTIONAL: no validation on paymentMethod — falls through to 0 for unknown types
  // INTENTIONAL: no handling of floating point precision issues for currency amounts
  const feeRates = {
    card: 0.029,
    bank_transfer: 0.008,
    wallet: 0.015,
  };

  const rate = feeRates[paymentMethod];
  return amount * rate;
}

/**
 * Refunds a previous transaction.
 *
 * @param {string} transactionId
 * @param {number} refundAmount
 * @param {object} gatewayClient
 * @returns {Promise<{refundId: string, status: string}>}
 */
export async function refundPayment(transactionId, refundAmount, gatewayClient) {
  // INTENTIONAL: no check that refundAmount <= original transaction amount
  // INTENTIONAL: no check that the transaction exists or is refundable
  const result = await gatewayClient.refund({ transactionId, amount: refundAmount });
  return result;
}
