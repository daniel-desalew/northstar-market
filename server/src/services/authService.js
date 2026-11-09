const bcrypt = require('bcryptjs')
const { query } = require('../config/db')
const ApiError = require('../utils/ApiError')
const generateToken = require('../utils/generateToken')

function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function requireJwtSecret() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.')
  }
}

async function register({ name, email, password }) {
  requireJwtSecret()
  const normalizedEmail = email.trim().toLowerCase()
  const passwordHash = await bcrypt.hash(password, 12)
  let result
  try {
    result = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id AS "_id", name, email, role`,
      [name.trim(), normalizedEmail, passwordHash],
    )
  } catch (error) {
    if (error.code === '23505') {
      throw new ApiError(409, 'An account with this email already exists.')
    }
    throw error
  }
  const user = result.rows[0]
  return { user: publicUser(user), token: generateToken(user._id) }
}

async function login({ email, password }) {
  requireJwtSecret()
  const result = await query(
    `SELECT id AS "_id", name, email, role, is_active AS "isActive", password_hash
     FROM users WHERE email = $1`,
    [email.trim().toLowerCase()],
  )
  const user = result.rows[0]
  if (!user || !user.isActive || !(await bcrypt.compare(password, user.password_hash))) {
    throw new ApiError(401, 'Email or password is incorrect.')
  }
  return { user: publicUser(user), token: generateToken(user._id) }
}

module.exports = { login, register }
