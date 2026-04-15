/**
 * logger.js
 * Centralised structured logging utility.
 * In production this would write to a log aggregation service.
 */

/**
 * Logs a payment transaction record.
 * @param {object} data - Transaction details
 */
export async function logTransaction(data) {
  console.log("[TRANSACTION]", JSON.stringify(data));
}

/**
 * Logs an application error with context.
 * @param {string} context - Where the error occurred
 * @param {Error}  err     - The error object
 */
export function logError(context, err) {
  console.error(`[ERROR][${context}]`, err.message, err.stack);
}
