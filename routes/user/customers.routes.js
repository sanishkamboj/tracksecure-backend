const router = require('express').Router()

// controllers
const uCustomersController = require('../../controllers/user/customers.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const subscriptionStatusMiddleware = require('../../middlewares/subscriptionStatus.middleware')
const onlySubscriber = require('../../middlewares/onlySubscriber.middleware')

router.post(
  '/',
  authMiddleware,
  subscriptionStatusMiddleware,
  onlySubscriber,
  uCustomersController.createCustomer
)

router
  .get('/:iOrganizationId', authMiddleware, uCustomersController.listCustomers)
  .get(
    '/:iOrganizationId/:iUserId',
    authMiddleware,
    onlySubscriber,
    uCustomersController.getCustomer
  )

router.patch(
  '/:iUserId',
  authMiddleware,
  subscriptionStatusMiddleware,
  onlySubscriber,
  uCustomersController.updateCustomer
)

router.delete(
  '/:iOrganizationId',
  authMiddleware,
  subscriptionStatusMiddleware,
  onlySubscriber,
  uCustomersController.deleteCustomer
)

module.exports = router
