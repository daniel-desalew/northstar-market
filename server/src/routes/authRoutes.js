const express = require('express')
const authController = require('../controllers/authController')
const validate = require('../middleware/validateMiddleware')
const { loginSchema, registerSchema } = require('../validators/authValidator')

const router = express.Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)

module.exports = router