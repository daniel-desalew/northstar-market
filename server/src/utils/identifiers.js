const ApiError = require('./ApiError')

const ID_PATTERN = /^(?:[a-f\d]{24}|[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i

function isValidId(value) {
  return typeof value === 'string' && ID_PATTERN.test(value)
}

function requireValidId(value, label) {
  if (!isValidId(value)) throw new ApiError(400, `Invalid ${label} identifier.`)
  return value
}

module.exports = { isValidId, requireValidId }
