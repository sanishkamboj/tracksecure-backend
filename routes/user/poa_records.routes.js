const router = require('express').Router()

// controllers
const poaRecordsController = require('../../controllers/user/poa_records.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router.get(
  '/:iOrganizationId',
  authMiddleware,
  poaRecordsController.getPoaRecordList
).get('/:iOrganizationId/download', authMiddleware, poaRecordsController.downloadExcel)

module.exports = router
