const router = require('express').Router()

// controllers
const momController = require('../../controllers/user/methods_objects_mas.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware.js')

router.get(
  '/:iCMId',
  authMiddleware,
  momController.getChecklistObjectiveMasRecords
)

module.exports = router
