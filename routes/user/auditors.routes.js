const router = require('express').Router()

// controllers
const auditorsController = require('../../controllers/user/auditors.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .get('/', authMiddleware, auditorsController.getAllAuditors)
  .get('/:iAuditorId', authMiddleware, auditorsController.getAuditor)
  .get('/assessment/:iAssessmentId', authMiddleware, auditorsController.getAuditorsByAssessment)

router.post('/', authMiddleware, auditorsController.createAuditor)

router.delete('/:iAuditorId', authMiddleware, auditorsController.deleteAuditor)

router.patch('/:iAuditorId', authMiddleware, auditorsController.updateAuditor)

module.exports = router