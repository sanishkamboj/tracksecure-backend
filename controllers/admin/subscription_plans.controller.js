const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')
const validator = require('../../utils/validator')

// db queries
const dbSubscriptionPlans = require('../../database/admin/subscription_plans.queries')

// create subscription plan
module.exports.createPlan = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    if (req.isSubscriber) {
      const {
        vPlanName,
        tDesc,
        iUserLimit,
        iAssessmentLimit,
        iTotalDays,
        fPrice,
        iStatus
      } = req.body

      IsNull(vPlanName) && apiResponse.errors.push('Plan name is required')
      IsNull(tDesc) && apiResponse.errors.push('Plan Description is required')
      IsNull(iUserLimit) && apiResponse.errors.push('User limit is required')
      IsNull(iAssessmentLimit) &&
        apiResponse.errors.push('Assessment Limit is required')
      IsNull(iTotalDays) && apiResponse.errors.push('Total days are required')
      IsNull(fPrice) && apiResponse.errors.push('Plan price is required')

      if (apiResponse.errors.length > 1) {
        return res.status(400).json(apiResponse)
      }

      !validator.validateString(vPlanName) &&
        apiResponse.errors.push('Plan name is not valid')
      !validator.validateString(tDesc) &&
        apiResponse.errors.push('Plan description is not valid')
      !validator.validateNumber(iUserLimit) &&
        apiResponse.errors.push('User limit is not valid')
      !validator.validateNumber(iAssessmentLimit) &&
        apiResponse.errors.push('Assessment limit is not valid')
      !validator.validateNumber(iTotalDays) &&
        apiResponse.errors.push('Total days are not valid')
      !validator.validateNumber(fPrice) &&
        apiResponse.errors.push('Plan price is not valid')

      if (apiResponse.errors.length > 1) {
        return res.status(400).json(apiResponse)
      }

      const createdPlan = await dbSubscriptionPlans.createSubscriptionPlan({
        vPlanName,
        tDesc,
        iUserLimit,
        iAssessmentLimit,
        iTotalDays,
        fPrice,
        iStatus
      })
      apiResponse.message = 'Plan successfully created'
      apiResponse.data.createdPlan = createdPlan.insertId
      return res.status(201).json(apiResponse)
    } else {
      apiResponse.message = 'You are not authorized to create a plan'
      return res.status(401).json(apiResponse)
    }
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// list plans
module.exports.getPlans = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const plans = await dbSubscriptionPlans.getSubscriptionPlans()
    apiResponse.data.plans = plans
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// get a specific plan
module.exports.getPlan = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iSPlanId } = req.params
    const plan = await dbSubscriptionPlans.getSubscriptionPlan(iSPlanId)
    apiResponse.data.plan = plan
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// update a plan
module.exports.updatePlan = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    if (req.isSubscriber) {
      const { iSPlanId } = req.params
      const {
        vPlanName,
        tDesc,
        iUserLimit,
        iAssessmentLimit,
        iTotalDays,
        fPrice,
        iStatus
      } = req.body
      const plan = await dbSubscriptionPlans.getSubscriptionPlan(iSPlanId)
      if (IsNull(plan)) {
        apiResponse.message = 'Plan not found'
        return res.status(422).json(apiResponse)
      }
      const data = {}
      validator.validateString(vPlanName) ? (data.vPlanName = vPlanName) : null
      validator.validateString(tDesc) ? (data.tDesc = tDesc) : null
      validator.validateNumber(iUserLimit)
        ? (data.iUserLimit = iUserLimit)
        : null
      validator.validateNumber(iAssessmentLimit)
        ? (data.iAssessmentLimit = iAssessmentLimit)
        : null
      validator.validateNumber(iTotalDays)
        ? (data.iTotalDays = iTotalDays)
        : null
      validator.validateNumber(fPrice) ? (data.fPrice = fPrice) : null
      validator.validateNumber(iStatus) ? (data.iStatus = iStatus) : null
      const updatedPlan = await dbSubscriptionPlans.updatePlan(iSPlanId, data)

      if (!updatedPlan.affectedRows) {
        apiResponse.message = 'Could not update plan'
        return res.status(500).json(apiResponse)
      }
      apiResponse.message = 'Plan updated successfully'
      return res.status(200).json(apiResponse)
    } else {
      apiResponse.message = 'You are not authorized to update a plan'
      return res.status(401).json(apiResponse)
    }
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// delete a plan
module.exports.deletePlan = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    if (req.isSubscriber) {
      const { iSPlanId } = req.params
      const deletedPlan = await dbSubscriptionPlans.deleteSubscriptionPlan(
        iSPlanId
      )
      if (!deletedPlan.affectedRows) {
        apiResponse.message = 'Could not delete plan'
        return res.status(422).json(apiResponse)
      }
      apiResponse.message = 'Plan deleted successfully'
      return res.status(200).json(apiResponse)
    } else {
      apiResponse.message = 'You are not authorized to delete a plan'
      return res.status(401).json(apiResponse)
    }
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
