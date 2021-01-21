const router = require('express').Router()

// controllers
const forgotPasswordController = require('../../controllers/user/forgot_password.controller')

router
  .post('/sendMail', forgotPasswordController.saveToken)
  .post('/changePassword', forgotPasswordController.changePassword)

module.exports = router
