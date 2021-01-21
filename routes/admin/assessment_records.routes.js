const router = require('express').Router()

// controllers
const assessmentRecordsController = require('../../controllers/admin/assessment_records.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const subscriptionStatusMiddleware = require('../../middlewares/subscriptionStatus.middleware')

router
  .get('/', authMiddleware, assessmentRecordsController.listAssessmentRecords)
  .get('/:id', authMiddleware, assessmentRecordsController.getAssessmentRecord)

router.post(
  '/',
  authMiddleware,
  assessmentRecordsController.createAssessmentRecord
)

router.patch(
  '/:id',
  authMiddleware,
  subscriptionStatusMiddleware,
  assessmentRecordsController.updateAssessmentRecord
)

router.delete(
  '/:id',
  authMiddleware,
  assessmentRecordsController.deleteAssessmentRecord
)

module.exports = router
