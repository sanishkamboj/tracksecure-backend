const router = require('express').Router()

// controllers
const subscriptionCCController = require('../../controllers/admin/subscription_cc.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const isSubscriberMiddleware = require('../../middlewares/isSubscriber.middleware')

router.get(
  '/:iOrganizationId',
  authMiddleware,
  isSubscriberMiddleware,
  subscriptionCCController.getSubscriptionCCRecord
)

router.patch(
  '/:iOrganizationId',
  authMiddleware,
  isSubscriberMiddleware,
  subscriptionCCController.updateSubscriptionCCRecord
)

module.exports = router
