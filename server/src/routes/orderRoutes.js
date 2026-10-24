const express = require('express')
const authenticate = require('../middleware/authMiddleware')
const validate = require('../middleware/validateMiddleware')
const orderController = require('../controllers/orderController')
const { createOrderSchema } = require('../validators/orderValidator')

const router = express.Router()

router.use(authenticate)
router.post('/', validate(createOrderSchema), orderController.createOrder)
router.get('/my-orders', orderController.getMyOrders)
router.get('/:id', orderController.getMyOrder)

module.exports = router