const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')

async function authenticate(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ')
  if (scheme !== 'Bearer' || !token) {
    next(new ApiError(401, 'Authentication is required.'))
    return
  }
  if (!process.env.JWT_SECRET) {
    next(new Error('JWT_SECRET is not configured.'))
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    const user = await User.findById(payload.sub)
      .select('_id name email role isActive')
      .lean()
    if (!user || !user.isActive) throw new ApiError(401, 'Your session is no longer valid.')
    req.user = user
    next()
  } catch (error) {
    if (error instanceof ApiError) return next(error)
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'The access token is invalid or expired.'))
    }
    return next(error)
  }
}

module.exports = authenticate