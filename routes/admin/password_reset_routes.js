const router = require('express').Router()

// controllers
const passwordResetController = require('../../controllers/admin/password_reset.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .post('/', authMiddleware, passwordResetController.sendPasswordResetLink)
  .patch('/:token', passwordResetController.resetPassword)

module.exports = router
