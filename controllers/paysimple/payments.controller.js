const moment = require('moment')

// utils
const ApiResponse = require('../../utils/ApiResponse')

// helpers
const paysimplePaymentsHelper = require('../../helpers/paysimple/payments.helper')
const isNull = require('../../utils/isNull')

module.exports.newPayment = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { AccountId, Amount, SuccessReceiptOptions } = req.body
    if (isNull(AccountId)) {
      apiResponse.errors.push('Account id is required')
    }
    if (isNull(Amount)) {
      apiResponse.errors.push('Amount is required')
    }
    if (apiResponse.errors.length > 0) {
      return res.status(400).json(apiResponse)
    }
    const createdPayment = await paysimplePaymentsHelper.newPayment({ AccountId, Amount, SuccessReceiptOptions })
    apiResponse.data.createdPayment = createdPayment
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getPayment = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { PaymentId } = req.params
    const payment = await paysimplePaymentsHelper.getPayment(PaymentId)
    apiResponse.data.payment = payment
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.listPayments = async (req, res) => {
  const apiResponse = new ApiResponse()
  const sortbyValids = ['returndate', 'estimatedsettledate', 'actualsettleddate', 'paymentdate', 'paymenttype', 'paymentsubtype', 'amount']
  const directionValids = ['asc', 'desc']
  const statusValids = ['authorized', 'chargeback', 'failed', 'pending', 'posted', 'refundsettled', 'returned', 'reversed', 'reversensf', 'reverseposted', 'settled', 'voided']
  try {
    const { direction, enddate, lite, page, pagesize, sortby, startdate, status } = req.query
    const queryParams = {}
    if (!isNull(sortby) && !sortbyValids.includes(sortby)) {
      apiResponse.errors.push('Sortby should be from one of the following: returndate, estimatedsettledate, actualsettleddate, paymentdate, paymenttype, paymentsubtype, amount')
    } else {
      queryParams.sortby = sortby
    }
    if (!isNull(direction) && !directionValids.includes(direction)) {
      apiResponse.errors.push('Direction should be one of the following properties: asc, desc')
    } else {
      queryParams.direction = direction
    }
    if (!isNull(status) && !statusValids.includes(status)) {
      apiResponse.errors.push('Status should be one of the following: authorized, chargeback, failed, pending, posted, refundsettled, returned, reversed, reversensf, reverseposted, settled, voided')
    } else {
      queryParams.status = status
    }
    if (apiResponse.errors.length > 0) {
      return res.status(400).json(apiResponse)
    }
    if (!isNull(page)) { queryParams.page = page }
    if (!isNull(pagesize)) { queryParams.pagesize = pagesize }
    if (!isNull(startdate)) { queryParams.startdate = startdate }
    if (!isNull(enddate)) { queryParams.enddate = enddate }
    if (!isNull(lite)) { queryParams.lite = lite }
    const paysimpleResponse = await paysimplePaymentsHelper.listPayments(queryParams)
    apiResponse.data.payments = paysimpleResponse
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.refundPayment = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { PaymentId } = req.params
    const paysimpleResponse = await paysimplePaymentsHelper.refundPayment(PaymentId)
    apiResponse.data.payments = paysimpleResponse
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.voidPayment = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { PaymentId } = req.params
    const paysimpleResponse = await paysimplePaymentsHelper.voidPayment(PaymentId)
    apiResponse.data.payments = paysimpleResponse
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
