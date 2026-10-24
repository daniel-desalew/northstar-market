const mongoose = require('mongoose')
const Order = require('../models/Order')
const ApiError = require('../utils/ApiError')
const { getPaymentConfiguration } = require('../config/payment')

const STRIPE_API_URL = 'https://api.stripe.com/v1'
const REQUEST_TIMEOUT_MS = 12000

function requirePaymentConfiguration() {
  const configuration = getPaymentConfiguration()
  if (!configuration.configured) {
    throw new ApiError(503, 'Payments are not configured on this server.')
  }
  return configuration
}

function toMinorUnits(amount) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new ApiError(400, 'Order total is invalid.')
  }
  const minorUnits = Math.round(amount * 100)
  if (!Number.isSafeInteger(minorUnits) || minorUnits < 1) {
    throw new ApiError(400, 'Order total must be at least one cent.')
  }
  return minorUnits
}

async function stripeRequest(path, { secretKey, method = 'GET', form, idempotencyKey } = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const headers = { Authorization: `Bearer ${secretKey}` }
  const options = { method, headers, signal: controller.signal }

  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    options.body = new URLSearchParams(form).toString()
  }
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey

  try {
    const response = await fetch(`${STRIPE_API_URL}${path}`, options)
    const body = await response.json().catch(() => null)
    if (!response.ok) {
      const code = body?.error?.code
      if (response.status === 404 || code === 'resource_missing') {
        throw new ApiError(404, 'Payment record was not found by the payment provider.')
      }
      console.error('Stripe request failed:', {
        status: response.status,
        type: body?.error?.type,
        code,
      })
      throw new ApiError(502, 'The payment provider could not complete the request.')
    }
    if (!body || typeof body.id !== 'string') {
      throw new ApiError(502, 'The payment provider returned an invalid response.')
    }
    return body
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error.name === 'AbortError') {
      throw new ApiError(504, 'The payment provider request timed out.')
    }
    console.error('Stripe connection failed:', error.message)
    throw new ApiError(502, 'Could not connect to the payment provider.')
  } finally {
    clearTimeout(timeout)
  }
}

async function createPaymentIntent(orderId, userId) {
  if (!mongoose.isValidObjectId(orderId)) throw new ApiError(400, 'Invalid order identifier.')
  const { secretKey, currency } = requirePaymentConfiguration()
  const order = await Order.findOne({ _id: orderId, user: userId })
  if (!order) throw new ApiError(404, 'Order not found.')
  if (order.paymentStatus === 'paid') throw new ApiError(409, 'This order has already been paid.')
  if (order.status === 'cancelled') throw new ApiError(409, 'A cancelled order cannot be paid.')

  const amount = toMinorUnits(order.totalPrice)

  if (order.paymentIntentId) {
    const existingIntent = await stripeRequest(
      `/payment_intents/${encodeURIComponent(order.paymentIntentId)}`,
      { secretKey },
    )
    if (
      existingIntent.status !== 'canceled' &&
      existingIntent.amount === amount &&
      existingIntent.currency === currency &&
      existingIntent.metadata?.orderId === String(order._id) &&
      existingIntent.metadata?.userId === String(userId)
    ) {
      return {
        id: existingIntent.id,
        clientSecret: existingIntent.client_secret,
        amount: existingIntent.amount,
        currency: existingIntent.currency,
      }
    }
  }

  const intent = await stripeRequest('/payment_intents', {
    secretKey,
    method: 'POST',
    idempotencyKey: `order-${order._id}-${order.updatedAt.getTime()}`,
    form: {
      amount: String(amount),
      currency,
      'automatic_payment_methods[enabled]': 'true',
      'metadata[orderId]': String(order._id),
      'metadata[userId]': String(userId),
    },
  })
  if (typeof intent.client_secret !== 'string' || !intent.client_secret) {
    throw new ApiError(502, 'The payment provider did not return a payment session.')
  }

  order.paymentProvider = 'stripe'
  order.paymentIntentId = intent.id
  order.paymentStatus = 'pending'
  await order.save()

  return {
    id: intent.id,
    clientSecret: intent.client_secret,
    amount: intent.amount,
    currency: intent.currency,
  }
}

async function confirmPayment(paymentIntentId, userId) {
  if (
    typeof paymentIntentId !== 'string' ||
    !/^pi_[A-Za-z0-9]+$/.test(paymentIntentId)
  ) {
    throw new ApiError(400, 'Invalid payment intent identifier.')
  }
  const { secretKey, currency } = requirePaymentConfiguration()
  const order = await Order.findOne({
    paymentIntentId,
    user: userId,
  })
  if (!order) throw new ApiError(404, 'Payment record not found for this account.')

  const intent = await stripeRequest(
    `/payment_intents/${encodeURIComponent(paymentIntentId)}`,
    { secretKey },
  )
  if (
    intent.metadata?.orderId !== String(order._id) ||
    intent.metadata?.userId !== String(userId) ||
    intent.amount !== toMinorUnits(order.totalPrice) ||
    intent.currency !== currency
  ) {
    throw new ApiError(409, 'Payment details do not match this order.')
  }

  if (intent.status !== 'succeeded') {
    return {
      confirmed: false,
      status: intent.status,
      orderId: String(order._id),
    }
  }

  if (order.paymentStatus !== 'paid') {
    order.paymentStatus = 'paid'
    await order.save()
  }

  return {
    confirmed: true,
    status: intent.status,
    orderId: String(order._id),
    paymentStatus: order.paymentStatus,
  }
}

module.exports = { confirmPayment, createPaymentIntent }