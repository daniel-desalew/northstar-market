const { z } = require('zod')
const authenticate = require('../middleware/authMiddleware')
const validate = require('../middleware/validateMiddleware')
const paymentController = require('../controllers/paymentController')

const express = require('express')
const router = express.Router()

const createIntentSchema = z.object({
  orderId: z.string().regex(/^[a-f\d]{24}$/i, 'Order ID must be a valid identifier.'),
})
const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().regex(/^pi_[A-Za-z0-9]+$/),
})

router.use(authenticate)
router.post('/create-intent', validate(createIntentSchema), paymentController.createPaymentIntent)
router.post('/confirm', validate(confirmPaymentSchema), paymentController.confirmPayment)

module.exports = router