const router = require('express').Router()

// controller
const dashboardController = require('../../controllers/admin/dashboard.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router.get('/', authMiddleware, dashboardController.getDashboardData)

module.exports = router
