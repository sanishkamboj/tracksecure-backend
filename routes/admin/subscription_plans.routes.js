const router = require('express').Router()

// controllers
const subscriptionPlansController = require('../../controllers/admin/subscription_plans.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const isSubscriber = require('../../middlewares/isSubscriber.middleware')

router.post(
  '/',
  authMiddleware,
  isSubscriber,
  subscriptionPlansController.createPlan
)

router
  .get('/', subscriptionPlansController.getPlans)
  .get('/:iSPlanId', subscriptionPlansController.getPlan)

router.patch(
  '/:iSPlanId',
  authMiddleware,
  isSubscriber,
  subscriptionPlansController.updatePlan
)

router.delete(
  '/:iSPlanId',
  authMiddleware,
  isSubscriber,
  subscriptionPlansController.deletePlan
)

module.exports = router
