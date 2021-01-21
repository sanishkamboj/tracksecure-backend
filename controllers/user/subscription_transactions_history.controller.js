// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// dbs
const dbSubPlanTxn = require('../../database/admin/subscription_plan_transaction.queries')

module.exports.getSubscriptionHistory = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    if (req.isSubscriber) {
      const { iOrganizationId, vOrderId, iSTranId } = req.query
      let history = null

      if (!IsNull(iOrganizationId)) {
        history = await dbSubPlanTxn.getSubscriptionHistoryByOrgId(
          iOrganizationId
        )
      } else if (!IsNull(vOrderId) && !IsNull(iSTranId)) {
        history = await dbSubPlanTxn.getTransactionHistoryByvOrderId(vOrderId, iSTranId)
      } else {
        history = await dbSubPlanTxn.getSubscriptionHistory()
      }

      apiResponse.data.history = history
      return res.status(200).json(apiResponse)
    } else {
      apiResponse.message =
        'You are not authorized to read subscription txn history'
      return res.status(200).json(apiResponse)
    }
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getCurrentSubscription = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    if (req.isSubscriber) {
      const { iOrganizationId } = req.params
      const plan = await dbSubPlanTxn.getTransactionByOrgId(iOrganizationId)

      if (IsNull(plan)) {
        apiResponse.message = 'Current Plan not found'
        return res.status(401).json(apiResponse)
      }
      apiResponse.data.plan = plan
      return res.status(200).json(apiResponse)
    } else {
      apiResponse.message = 'You are not authorized to get current plan details'
      return res.status(401).json(apiResponse)
    }
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
