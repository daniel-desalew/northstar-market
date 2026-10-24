const ApiError = require('../utils/ApiError')

function requireAdmin(req, res, next) {
  if (!req.user) {
    next(new ApiError(401, 'Authentication is required.'))
    return
  }
  if (req.user.role !== 'admin') {
    next(new ApiError(403, 'Administrator access is required.'))
    return
  }
  next()
}

module.exports = requireAdmin