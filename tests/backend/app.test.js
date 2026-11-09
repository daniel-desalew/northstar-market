const { after, before, test } = require('node:test')
const assert = require('node:assert/strict')
const app = require('../../server/src/app')
const { createOrderSchema, updateOrderStatusSchema } = require('../../server/src/validators/orderValidator')
const { sendEmail } = require('../../server/src/services/emailService')
const paymentService = require('../../server/src/services/paymentService')
const { getPaymentConfiguration } = require('../../server/src/config/payment')

let server
let baseUrl

before(async () => {
  server = app.listen(0)
  await new Promise((resolve, reject) => {
    server.once('listening', resolve)
    server.once('error', reject)
  })
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  if (!server) return
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
})

test('health endpoint reports the API as available', async () => {
  const response = await fetch(`${baseUrl}/api/health`)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('x-powered-by'), null)
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.deepEqual(await response.json(), {
    status: 'ok',
    service: 'northstar-market-api',
  })
})

test('unknown endpoints return a JSON not-found response', async () => {
  const response = await fetch(`${baseUrl}/api/does-not-exist`)
  assert.equal(response.status, 404)
  assert.match((await response.json()).message, /Route not found/)
})

test('admin product creation requires authentication', async () => {
  const response = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Unauthorized product' }),
  })
  assert.equal(response.status, 401)
  assert.equal((await response.json()).message, 'Authentication is required.')
})

test('invalid registration data is rejected before reaching the database', async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', email: 'not-an-email', password: 'short' }),
  })
  assert.equal(response.status, 400)
  const result = await response.json()
  assert.equal(result.message, 'Request validation failed.')
  assert.ok(result.details.length >= 3)
})

test('email service rejects invalid recipients before contacting a provider', async () => {
  await assert.rejects(
    sendEmail({ to: 'not-an-email', subject: 'Hello', text: 'Message' }),
    { name: 'TypeError', message: 'Recipient must be a valid email address.' },
  )
})

test('email service reports missing provider configuration instead of faking success', async () => {
  const previousApiKey = process.env.RESEND_API_KEY
  const previousFrom = process.env.EMAIL_FROM
  delete process.env.RESEND_API_KEY
  delete process.env.EMAIL_FROM

  try {
    await assert.rejects(
      sendEmail({ to: 'customer@example.com', subject: 'Hello', text: 'Message' }),
      /Email is not configured/,
    )
  } finally {
    if (previousApiKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = previousApiKey
    if (previousFrom === undefined) delete process.env.EMAIL_FROM
    else process.env.EMAIL_FROM = previousFrom
  }
})

test('order request schema accepts Mongo ObjectIds and PostgreSQL UUIDs', () => {
  const shippingAddress = {
    fullName: 'Taylor Customer',
    street: '10 Market Street',
    city: 'Portland',
    postalCode: '97201',
    country: 'United States',
  }
  assert.equal(createOrderSchema.safeParse({
    items: [{ product: '507f1f77bcf86cd799439011', quantity: 2 }],
    shippingAddress,
  }).success, true)
  assert.equal(createOrderSchema.safeParse({
    items: [{ product: '96ab59d8-c707-4c54-9db6-f9ea4c4972ef', quantity: 2 }],
    shippingAddress,
  }).success, true)
  assert.equal(createOrderSchema.safeParse({
    items: [{ product: 'not-an-id', quantity: 0 }],
    shippingAddress: {},
  }).success, false)
  assert.equal(updateOrderStatusSchema.safeParse({ status: 'shipped' }).success, true)
  assert.equal(updateOrderStatusSchema.safeParse({ status: 'paid' }).success, false)
})

test('payment service rejects malformed identifiers without contacting Stripe', async () => {
  await assert.rejects(
    paymentService.createPaymentIntent('not-an-order-id', '507f1f77bcf86cd799439011'),
    { statusCode: 400 },
  )
  await assert.rejects(
    paymentService.confirmPayment('not-a-payment-intent', '507f1f77bcf86cd799439011'),
    { statusCode: 400 },
  )
})

test('payment service reports unconfigured payments instead of simulating a charge', async () => {
  const previousProvider = process.env.PAYMENT_PROVIDER
  const previousSecret = process.env.PAYMENT_SECRET_KEY
  delete process.env.PAYMENT_PROVIDER
  delete process.env.PAYMENT_SECRET_KEY

  try {
    await assert.rejects(
      paymentService.createPaymentIntent(
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
      ),
      { statusCode: 503, message: 'Payments are not configured on this server.' },
    )
  } finally {
    if (previousProvider === undefined) delete process.env.PAYMENT_PROVIDER
    else process.env.PAYMENT_PROVIDER = previousProvider
    if (previousSecret === undefined) delete process.env.PAYMENT_SECRET_KEY
    else process.env.PAYMENT_SECRET_KEY = previousSecret
  }
})

test('payment configuration accepts Stripe keys and rejects unsupported providers', () => {
  const previousProvider = process.env.PAYMENT_PROVIDER
  const previousSecret = process.env.PAYMENT_SECRET_KEY
  const previousCurrency = process.env.PAYMENT_CURRENCY
  process.env.PAYMENT_PROVIDER = 'stripe'
  process.env.PAYMENT_SECRET_KEY = 'sk_test_example_key'
  process.env.PAYMENT_CURRENCY = 'USD'

  try {
    assert.deepEqual(getPaymentConfiguration(), {
      configured: true,
      provider: 'stripe',
      secretKey: 'sk_test_example_key',
      currency: 'usd',
    })
    process.env.PAYMENT_PROVIDER = 'unknown'
    assert.throws(() => getPaymentConfiguration(), /must be "stripe"/)
  } finally {
    if (previousProvider === undefined) delete process.env.PAYMENT_PROVIDER
    else process.env.PAYMENT_PROVIDER = previousProvider
    if (previousSecret === undefined) delete process.env.PAYMENT_SECRET_KEY
    else process.env.PAYMENT_SECRET_KEY = previousSecret
    if (previousCurrency === undefined) delete process.env.PAYMENT_CURRENCY
    else process.env.PAYMENT_CURRENCY = previousCurrency
  }
})
