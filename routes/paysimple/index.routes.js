const router = require('express').Router()

// subroutes
const customersRoutes = require('./customers.routes')
const accountsRoutes = require('./accounts.routes')
const paymentsRoutes = require('./payments.routes')

router
  .use('/customers', customersRoutes)
  .use('/accounts', accountsRoutes)
  .use('/payments', paymentsRoutes)

module.exports = router
