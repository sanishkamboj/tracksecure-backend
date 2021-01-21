const router = require('express').Router()

// controller
const adminARController = require('../../controllers/admin/assessment_records.controller')
const assessmentRecordsController = require('../../controllers/user/assessment_records.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const subscriptionStatusMiddleware = require('../../middlewares/subscriptionStatus.middleware')

router
  .get(
    '/:iOrganizationId',
    authMiddleware,
    assessmentRecordsController.listAssessmentRecords
  )
  .get(
    '/:iOrganizationId/:iARId',
    authMiddleware,
    assessmentRecordsController.getAssessmentRecord
  )

router.post(
  '/',
  authMiddleware,
  subscriptionStatusMiddleware,
  assessmentRecordsController.createAssessmentRecord
)

router.patch('/:id', authMiddleware, subscriptionStatusMiddleware, adminARController.updateAssessmentRecord)

router.delete(
  '/:iOrganizationId/:iARId',
  authMiddleware,
  subscriptionStatusMiddleware,
  assessmentRecordsController.deleteAssessmentRecord
)

module.exports = router
