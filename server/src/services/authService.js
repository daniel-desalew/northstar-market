const User = require('../models/User')
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

async function register({ name, email, password }) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.')
  }
  const normalizedEmail = email.trim().toLowerCase()
  if (await User.exists({ email: normalizedEmail })) {
    throw new ApiError(409, 'An account with this email already exists.')
  }
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
  })
  return { user: publicUser(user), token: generateToken(user._id) }
}

async function login({ email, password }) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.')
  }
  const user = await User.findOne({ email: email.trim().toLowerCase() })
    .select('+passwordHash')
  if (!user || !user.isActive || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Email or password is incorrect.')
  }
  return { user: publicUser(user), token: generateToken(user._id) }
}

module.exports = { login, register }