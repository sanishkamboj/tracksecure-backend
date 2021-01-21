const router = require('express').Router()

// controllers
const otpController = require('../../controllers/admin/otps.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router.post('/', authMiddleware, otpController.sendOTP)

module.exports = router
