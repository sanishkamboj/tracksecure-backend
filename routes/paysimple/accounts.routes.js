const router = require('express').Router()

// controllers
const accountsController = require('../../controllers/paysimple/accounts.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router.post('/', authMiddleware, accountsController.createAccount)

router.get('/:AccountId', accountsController.getAccount)

module.exports = router
