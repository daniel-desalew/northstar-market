const express = require('express')
const categoryController = require('../controllers/categoryController')
const authenticate = require('../middleware/authMiddleware')
const requireAdmin = require('../middleware/adminMiddleware')
const validate = require('../middleware/validateMiddleware')
const { categorySchema } = require('../validators/categoryValidator')

const router = express.Router()

router.get('/', categoryController.listCategories)
router.post('/', authenticate, requireAdmin, validate(categorySchema), categoryController.createCategory)
router.delete('/:id', authenticate, requireAdmin, categoryController.deleteCategory)

module.exports = router