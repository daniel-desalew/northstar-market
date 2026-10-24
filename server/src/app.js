const express = require('express')
const { createCorsMiddleware } = require('./config/cors')
const createRateLimit = require('./middleware/rateLimitMiddleware')
const { errorMiddleware, notFoundMiddleware } = require('./middleware/errorMiddleware')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const ApiError = require('./utils/ApiError')

const app = express()

app.disable('x-powered-by')
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-Frame-Options', 'DENY')
  next()
})
app.use(createCorsMiddleware())
app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: false, limit: '100kb' }))
app.use(createRateLimit({ windowMs: 60_000, limit: 120 }))

app.get('/api/health', (req, res) => {
  const databaseReady = require('mongoose').connection.readyState === 1
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'ok' : 'starting',
    database: databaseReady ? 'connected' : 'disconnected',
    service: 'northstar-market-api',
  })
})
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)
app.use(notFoundMiddleware)
app.use((error, req, res, next) => {
  if (error.message === 'This origin is not allowed by the CORS policy.') {
    next(new ApiError(403, error.message))
    return
  }
  next(error)
})
app.use(errorMiddleware)

module.exports = app
