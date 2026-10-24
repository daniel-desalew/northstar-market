const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const authService = require('../services/authService')

const register = asyncHandler(async (req, res) => {
  const session = await authService.register(req.body)
  res.status(201).json(session)
})

const login = asyncHandler(async (req, res) => {
  res.json(await authService.login(req.body))
})

const forgotPassword = asyncHandler(async (req, res) => {
  throw new ApiError(501, 'Password reset email is not configured for this server.')
})

const resetPassword = asyncHandler(async (req, res) => {
  throw new ApiError(501, 'Password reset is not configured for this server.')
})

module.exports = { forgotPassword, login, register, resetPassword }