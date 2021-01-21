// utils
const ApiResponse = require('../../utils/ApiResponse')

// helpers
const subscriptionRenewalCronHelper = require('../../helpers/crons/subscriptionRenewal.cron')

module.exports.startCron = (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    subscriptionRenewalCronHelper.start()
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
