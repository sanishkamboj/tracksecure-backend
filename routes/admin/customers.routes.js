const router = require('express').Router()

// controllers
const customersController = require('../../controllers/admin/customers.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .post('/', authMiddleware, customersController.createCustomer)

router
  .get('/', authMiddleware, customersController.listCustomers)
  .get('/:iUserId', authMiddleware, customersController.getCustomer)

router.patch(
  '/:iCustomerId',
  authMiddleware,
  customersController.updateCustomer
).patch(
  '/:iUserId/2fa',
  authMiddleware,
  customersController.toggle2fa
)

router.delete('/:iUserId', authMiddleware, customersController.deleteCustomer)

module.exports = router
