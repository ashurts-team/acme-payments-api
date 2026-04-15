/**
 * userService.js
 * User profile management: create, update, fetch, delete users.
 *
 * INTENTIONAL ISSUES:
 *  - No authorisation check before returning PII (missing security AC)
 *  - FIXME comment on GDPR data deletion
 *  - Direct SQL string interpolation risk (should use parameterised queries)
 *  - console.log of PII data
 */

/**
 * Fetches a user profile by ID.
 * NOTE: No authorisation check — any authenticated user can fetch any profile.
 *
 * @param {string} userId
 * @param {object} db
 * @returns {Promise<object>} Full user record including PII fields
 */
export async function getUserById(userId, db) {
  // INTENTIONAL: logs PII
  console.log(`Fetching user profile for userId: ${userId}`);

  // INTENTIONAL: No check that the requesting user has permission to view this profile
  const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
  return result.rows[0];
}

/**
 * Updates a user's profile fields.
 *
 * @param {string} userId
 * @param {object} updates - Fields to update
 * @param {object} db
 */
export async function updateUser(userId, updates, db) {
  const { name, email, phone } = updates;

  // INTENTIONAL: No input validation on email format, phone format, or name length
  // FIXME: GDPR Right to Rectification — audit log not written on profile update
  await db.query(
    "UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4",
    [name, email, phone, userId]
  );
}

/**
 * Deletes a user account.
 * FIXME: GDPR Right to Erasure — related data in other tables is NOT deleted.
 * Payments, sessions, and audit logs referencing this user must also be purged.
 *
 * @param {string} userId
 * @param {object} db
 */
export async function deleteUser(userId, db) {
  // INTENTIONAL: Only deletes the user row — orphaned data remains in payments, sessions tables
  await db.query("DELETE FROM users WHERE id = $1", [userId]);
  console.log(`User ${userId} deleted — WARNING: related data not purged`);
}

/**
 * Searches users by email. 
 * INTENTIONAL: Vulnerable to SQL injection via unsanitised search term.
 *
 * @param {string} searchTerm
 * @param {object} db
 */
export async function searchUsers(searchTerm, db) {
  // INTENTIONAL: String interpolation in SQL — SQL injection vulnerability
  // CodeQL should flag this as a critical security alert
  const result = await db.query(
    `SELECT id, name, email FROM users WHERE email LIKE '%${searchTerm}%'`
  );
  return result.rows;
}
