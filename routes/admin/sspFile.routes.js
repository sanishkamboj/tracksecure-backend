const router = require('express').Router()

// controllers
const sspFileController = require('../../controllers/admin/sspFile.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router.get('/', authMiddleware, sspFileController.generateFile)

router.delete('/', authMiddleware, sspFileController.deleteFile)

module.exports = router
