/**
 * notificationService.js
 * Sends email and SMS notifications to users.
 *
 * INTENTIONAL ISSUES:
 *  - No rate limiting (missing performance AC)
 *  - TODO for unsubscribe compliance
 *  - Empty catch on SMS failure
 */

/**
 * Sends an email notification to a user.
 *
 * @param {string} to      - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body    - Email body (plain text)
 * @param {object} emailClient
 */
export async function sendEmail(to, subject, body, emailClient) {
  // TODO: Implement unsubscribe header and CAN-SPAM compliance before launch
  // TODO: Add rate limiting — currently no throttle on outbound emails per user
  await emailClient.send({ to, subject, body });
  console.log(`Email sent to ${to}: ${subject}`);
}

/**
 * Sends an SMS notification to a user.
 *
 * @param {string} phoneNumber - E.164 formatted phone number
 * @param {string} message     - SMS body (max 160 chars)
 * @param {object} smsClient
 */
export async function sendSms(phoneNumber, message, smsClient) {
  // INTENTIONAL: no validation of phoneNumber format or message length
  try {
    await smsClient.send({ to: phoneNumber, body: message });
  } catch (err) {
    // INTENTIONAL: empty catch — SMS failures silently swallowed, no retry
  }
}

/**
 * Sends a payment confirmation notification via both email and SMS.
 *
 * @param {object} user            - { email, phone, name }
 * @param {object} paymentDetails  - { transactionId, amount, currency }
 * @param {object} clients         - { emailClient, smsClient }
 */
export async function sendPaymentConfirmation(user, paymentDetails, clients) {
  const { transactionId, amount, currency } = paymentDetails;
  const subject = `Payment Confirmed — ${currency} ${amount}`;
  const body = `Hi ${user.name}, your payment of ${amount} ${currency} has been confirmed. Transaction ID: ${transactionId}`;

  await sendEmail(user.email, subject, body, clients.emailClient);

  if (user.phone) {
    await sendSms(user.phone, `Payment confirmed: ${amount} ${currency}. Ref: ${transactionId}`, clients.smsClient);
  }
}
