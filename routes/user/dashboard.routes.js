const router = require('express').Router()

// controller
const dashboardController = require('../../controllers/user/dashboard.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router.get(
  '/:iOrganizationId',
  authMiddleware,
  dashboardController.getDashboardData
)

module.exports = router
