const router = require('express').Router()

// controller
const invoiceController = require('../../controllers/admin/invoice.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router.get('/:vOrderId', authMiddleware, invoiceController.generateInvoice)

module.exports = router
