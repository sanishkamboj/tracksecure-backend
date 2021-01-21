const router = require('express').Router()

// sub routes
const dashboardRoutes = require('./dashboard.routes')
const usersRoutes = require('./users.routes')
const assessmentRoutes = require('./assessment_records.routes')
const rolesRoutes = require('./roles_mas.routes')
const customersRoutes = require('./customers.routes')
const sspFileRoutes = require('./sspFile.routes')
const poaRecordsRoutes = require('./poa_records.routes')
const comRecords = require('./checklist_objective_mas.routes')
const momRecords = require('./methods_objects_mas.routes')
const subTxnHistoryRoutes = require('./subscription_transactions_history.routes')
const forgotPasswordRoutes = require('./forgot_password.routes')
const auditorsRoutes = require('./auditors.routes')

router
  .use('/dashboard', dashboardRoutes)
  .use('/users', usersRoutes)
  .use('/assessment_records', assessmentRoutes)
  .use('/roles', rolesRoutes)
  .use('/customers', customersRoutes)
  .use('/ssp_file', sspFileRoutes)
  .use('/poa_records', poaRecordsRoutes)
  .use('/checklist_objective_mas', comRecords)
  .use('/method_objects_mas', momRecords)
  .use('/subscription_txn_history', subTxnHistoryRoutes)
  .use('/forgot_password', forgotPasswordRoutes)
  .use('/auditors', auditorsRoutes)

module.exports = router
