const ApiError = require('../utils/ApiError')

function notFoundMiddleware(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error)
    return
  }

  const statusCode =
    Number.isInteger(error.statusCode) ? error.statusCode :
      error.name === 'ValidationError' || error.name === 'CastError' ? 400 :
        error.code === 11000 ? 409 : 500
  const message =
    error.name === 'ValidationError' ? 'The submitted data is invalid.' :
      error.name === 'CastError' ? 'The requested resource identifier is invalid.' :
        error.code === 11000 ? 'A record with that value already exists.' :
          statusCode === 500 ? 'An unexpected server error occurred.' : error.message

  if (statusCode >= 500) {
    console.error(error)
  }

  const body = { message }
  if (error.details && statusCode < 500) body.details = error.details
  if (process.env.NODE_ENV !== 'production' && statusCode >= 500) {
    body.debug = error.message
  }
  res.status(statusCode).json(body)
}

module.exports = { errorMiddleware, notFoundMiddleware }