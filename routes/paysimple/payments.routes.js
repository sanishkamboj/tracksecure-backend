const router = require('express').Router()

// controllers
const paymentsController = require('../../controllers/paysimple/payments.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .post('/', authMiddleware, paymentsController.newPayment)

router
  .get('/', authMiddleware, paymentsController.listPayments)
  .get('/:PaymentId', authMiddleware, paymentsController.getPayment)

router
  .put('/:PaymentId/reverse', authMiddleware, paymentsController.refundPayment)
  .put('/:PaymentId/void', authMiddleware, paymentsController.voidPayment)

module.exports = router
