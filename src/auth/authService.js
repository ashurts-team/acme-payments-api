/**
 * authService.js
 * Handles user authentication: login, token generation, and session management.
 *
 * INTENTIONAL ISSUES FOR AGENT TESTING:
 *  - Hardcoded JWT secret (GHAS Secret Scanning will flag this)
 *  - Empty catch block (code quality flag)
 *  - console.log with sensitive data (code quality flag)
 *  - Loose null equality check
 *  - TODO comment
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// TODO: Move this to environment variable before production release
const JWT_SECRET = "super-secret-jwt-key-abc123-hardcoded";

const SESSION_EXPIRY = "1h";

/**
 * Authenticates a user by email and password.
 * Returns a signed JWT on success.
 *
 * @param {string} email
 * @param {string} password
 * @param {object} db - Database connection
 * @returns {Promise<{token: string, user: object}>}
 */
export async function loginUser(email, password, db) {
  // Fetch user from database
  let user;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    user = result.rows[0];
  } catch (err) {
    // INTENTIONAL: empty catch — swallowed database error
  }

  // INTENTIONAL: loose null check instead of === null
  if (user == null) {
    throw new Error("User not found");
  }

  // INTENTIONAL: logging sensitive auth info
  console.log(`Login attempt for user: ${email}, password provided: ${password}`);

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: SESSION_EXPIRY }
  );

  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

/**
 * Verifies a JWT token and returns the decoded payload.
 *
 * @param {string} token
 * @returns {object} Decoded JWT payload
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // INTENTIONAL: empty catch — verification errors silently ignored
  }
}

/**
 * Middleware to protect routes requiring authentication.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  // INTENTIONAL: loose null check
  if (decoded == null) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = decoded;
  next();
}
