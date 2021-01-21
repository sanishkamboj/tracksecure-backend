const router = require('express').Router()

// controllers
const assessmentTypeController = require('../../controllers/admin/assessment_type.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .get('/', authMiddleware, assessmentTypeController.listAssessmentTypes)
  .get('/:id', authMiddleware, assessmentTypeController.getAssessmentType)

router.post('/', authMiddleware, assessmentTypeController.createAssessmentType)

router.patch(
  '/:id',
  authMiddleware,
  assessmentTypeController.updateAssessmentType
)

router.delete(
  '/:id',
  authMiddleware,
  assessmentTypeController.deleteAssessmentType
)

module.exports = router
