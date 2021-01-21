const router = require('express').Router()

// controllers
const comController = require('../../controllers/user/checklist_objective_mas.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware.js')

router.get(
  '/:iCMId',
  authMiddleware,
  comController.getChecklistObjectiveMasRecords
)

module.exports = router
