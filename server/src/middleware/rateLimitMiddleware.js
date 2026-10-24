const ApiError = require('../utils/ApiError')

function createRateLimit({ windowMs = 60000, limit = 100 } = {}) {
  const clients = new Map()
  const cleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of clients) {
      if (entry.resetAt <= now) clients.delete(key)
    }
  }, Math.max(windowMs, 60000))
  cleanupInterval.unref()

  return function rateLimit(req, res, next) {
    const key = req.ip || req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    let entry = clients.get(key)

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs }
      clients.set(key, entry)
    }
    entry.count += 1
    res.setHeader('RateLimit-Limit', String(limit))
    res.setHeader('RateLimit-Remaining', String(Math.max(0, limit - entry.count)))
    res.setHeader('RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)))

    if (entry.count > limit) {
      next(new ApiError(429, 'Too many requests. Please try again later.'))
      return
    }
    next()
  }
}

module.exports = createRateLimit