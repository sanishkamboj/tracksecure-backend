const router = require('express').Router()

// controllers
const poaRecordsController = require('../../controllers/admin/poa_records.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .get('/:iCRId', authMiddleware, poaRecordsController.getPoaRecordbyCRId)
  .get('/', authMiddleware, poaRecordsController.getPoaRecordList)

router.post('/', authMiddleware, poaRecordsController.createPoaRecord)

router.patch('/:iCRId', authMiddleware, poaRecordsController.updatePoaRecord)

module.exports = router
