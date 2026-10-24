const express = require('express')
const authenticate = require('../middleware/authMiddleware')
const validate = require('../middleware/validateMiddleware')
const userController = require('../controllers/userController')
const { profileSchema } = require('../validators/userValidator')

const router = express.Router()

router.use(authenticate)
router.get('/profile', userController.getProfile)
router.put('/profile', validate(profileSchema), userController.updateProfile)

module.exports = router