const router = require('express').Router()

// controllers
const evidenceController = require('../../controllers/admin/evidence_controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const evidenceFileMiddleware = require('../../middlewares/evidenceFile.middleware')

router.post(
  '/',
  authMiddleware,
  evidenceFileMiddleware,
  evidenceController.uploadEvidence
)

router
  .get('/', authMiddleware, evidenceController.getEvidenceRecords)
  .get('/download/:Key', authMiddleware, evidenceController.downloadFile)

router.delete('/', authMiddleware, evidenceController.deleteEvidenceFileById)

module.exports = router
