const router = require('express').Router()

// controllers
const customersController = require('../../controllers/paysimple/customers.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .get('/', authMiddleware, customersController.listCustomers)
  .get('/:customerId', authMiddleware, customersController.getCustomer)
  .get('/:customerId/payments', authMiddleware, customersController.listPayments)

router.post('/', authMiddleware, customersController.createCustomer)

router.delete('/:customerId', authMiddleware, customersController.deleteCustomer)

module.exports = router
