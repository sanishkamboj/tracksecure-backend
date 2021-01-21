const router = require('express').Router()

// controller
const subTxnHis = require('../../controllers/user/subscription_transactions_history.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const isSubscriberMiddleware = require('../../middlewares/isSubscriber.middleware')

router
  .get(
    '/',
    authMiddleware,
    isSubscriberMiddleware,
    subTxnHis.getSubscriptionHistory
  )
  .get(
    '/:iOrganizationId',
    authMiddleware,
    isSubscriberMiddleware,
    subTxnHis.getCurrentSubscription
  )

module.exports = router
