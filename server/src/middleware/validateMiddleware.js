const ApiError = require('../utils/ApiError')

function validate(schema, property = 'body') {
  return function validateRequest(req, res, next) {
    const result = schema.safeParse(req[property])
    if (!result.success) {
      next(new ApiError(
        400,
        'Request validation failed.',
        result.error.issues.map(({ path, message }) => ({
          field: path.join('.'),
          message,
        })),
      ))
      return
    }
    req[property] = result.data
    next()
  }
}

module.exports = validate