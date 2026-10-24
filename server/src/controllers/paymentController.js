const asyncHandler = require('../utils/asyncHandler')
const paymentService = require('../services/paymentService')

const createPaymentIntent = asyncHandler(async (req, res) => {
  const payment = await paymentService.createPaymentIntent(req.body.orderId, req.user._id)
  res.status(201).json(payment)
})

const confirmPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.confirmPayment(
    req.body.paymentIntentId,
    req.user._id,
  )
  res.json(result)
})

module.exports = { confirmPayment, createPaymentIntent }