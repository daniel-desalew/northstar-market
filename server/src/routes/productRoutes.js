const express = require('express')
const productController = require('../controllers/productController')
const authenticate = require('../middleware/authMiddleware')
const requireAdmin = require('../middleware/adminMiddleware')
const validate = require('../middleware/validateMiddleware')
const { productSchema } = require('../validators/productValidator')

const router = express.Router()

router.get('/', productController.listProducts)
router.get('/:id', productController.getProduct)
router.post('/', authenticate, requireAdmin, validate(productSchema), productController.createProduct)
router.put('/:id', authenticate, requireAdmin, validate(productSchema.partial()), productController.updateProduct)
router.delete('/:id', authenticate, requireAdmin, productController.deleteProduct)

module.exports = router