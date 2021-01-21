const router = require('express').Router()

// controllers
const settingsController = require('../../controllers/settings/settings.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router.get('/', authMiddleware, settingsController.getSettings)

module.exports = router
