// utils
const ApiResponse = require('../utils/ApiResponse')
const isNull = require('../utils/isNull')

// db queries
const dbUsers = require('../database/user/users.queries')
const dbTxns = require('../database/admin/subscription_plan_transaction.queries')

// helpers
const paysimplePaymentsHelper = require('../helpers/paysimple/payments.helper')

module.exports = async (req, res, next) => {
  const apiResponse = new ApiResponse()
  try {
    let email = null
    let isAdmin = false

    // when we have token
    if (!isNull(req.user)) {
      email = req.user.email
      if (req.user.isAdmin) { isAdmin = true }
    }
    // when we have token and body
    if (!isNull(req.user) && !isNull(req.body)) {
      email = req.user.email
    }
    // when we have no token but body
    if (isNull(req.user) && !isNull(req.body)) {
      if (!isNull(req.body.vEmail)) {
        email = req.body.vEmail
      }
    }
    if (isAdmin) {
      req.activeSubscription = true
    } else {
      const user = await dbUsers.findUserByEmail(email)
      if (isNull(user)) {
        req.activeSubscription = false
      } else {
        const txn = await dbTxns.getTransactionByOrgId(user.iOrganizationId)
        if (isNull(txn)) {
          req.activeSubscription = false
        } else {
          if (txn.fAmount === 0) {
            req.activeSubscription = true
          } else {
            const paymentData = await paysimplePaymentsHelper.getPayment(txn.vPaysimplePaymentId)
            if (paymentData.Status === 'Authorized' || paymentData.Status === 'Settled') {
              req.activeSubscription = true
            } else {
              req.activeSubscription = false
            }
          }
        }
      }
    }
    next()
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
