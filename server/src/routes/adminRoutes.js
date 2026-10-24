const express = require('express')
const authenticate = require('../middleware/authMiddleware')
const requireAdmin = require('../middleware/adminMiddleware')
const userController = require('../controllers/userController')
const orderController = require('../controllers/orderController')
const validate = require('../middleware/validateMiddleware')
const { updateOrderStatusSchema } = require('../validators/orderValidator')

const router = express.Router()

router.use(authenticate, requireAdmin)
router.get('/users', userController.getUsers)
router.get('/orders', orderController.getAdminOrders)
router.patch(
  '/orders/:id',
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus,
)

module.exports = router