const router = require('express').Router()

// controllers
const milestoneController = require('../../controllers/admin/milestone_records.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router.get('/', authMiddleware, milestoneController.getMilestoneRecords)

router.post('/', authMiddleware, milestoneController.createMilestoneRecord)

router.patch(
  '/:iMilestoneId',
  authMiddleware,
  milestoneController.updateMilestoneRecord
)

router.delete(
  '/:iMilestoneId',
  authMiddleware,
  milestoneController.deleteMilestoneRecord
)

module.exports = router
