const router = require('express').Router()

// controllers
const checklistRecordsController = require('../../controllers/admin/checklist_records.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .get('/', authMiddleware, checklistRecordsController.listChecklistRecords)
  .get('/:id', authMiddleware, checklistRecordsController.getChecklistRecord)
  .get('/:iOrganizationId/download', authMiddleware, checklistRecordsController.downloadExcel)

router.patch(
  '/:id',
  authMiddleware,
  checklistRecordsController.updateChecklistRecord
)

module.exports = router
