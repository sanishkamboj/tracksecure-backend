const router = require('express').Router()

// controllers
const sspFileController = require('../../controllers/user/sspFile.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware.js')
const subscriptionStatusMiddleware = require('../../middlewares/subscriptionStatus.middleware')

router.get('/', authMiddleware, sspFileController.getDownloadRecords)

router.post(
  '/:iOrganizationId/:iARId',
  subscriptionStatusMiddleware,
  authMiddleware,
  sspFileController.generateFile
)

router.get('/download/:Key', authMiddleware, sspFileController.downloadFile)

router.delete('/', subscriptionStatusMiddleware, authMiddleware, sspFileController.deleteFile)

module.exports = router
