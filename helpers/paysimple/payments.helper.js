// @ts-check
/**
 * @typedef SuccessReceiptOptions
 * @property {Boolean} [SendToCustomer] If true, send receipt to email of Customer when payment request succeeds.
 * @property {Array<String>} [SendToOtherAddresses] Array of email addresses to send receipt to when payment request succeeds.
 */

/**
 * @typedef NewPaymentBodyParams
 * @property {Number} AccountId Required. The system identifier for the credit card Account. This is the Id attribute from the credit card object.
 * @property {Number} Amount Required. The amount to charge. Enter a number only, do not include the $. You can enter an integer or a decimal. If you use more than 2 decimal places, the system will round to the nearest penny-- i.e. entering 3.129 will result in a payment amount of 3.13. Cannot exceed 2,000,000.00
 * @property {SuccessReceiptOptions} [SuccessReceiptOptions] Receipt options allow setting payment receipt email settings.
 */

/**
 * @typedef ListPaymentsQueryParams
 * @property {String} [sortby] Optional. Valid values: returndate, estimatedsettledate, actualsettleddate, paymentdate, paymenttype, paymentsubtype, amount
 * @property {String} [direction] Optional. Valid values: asc: Ascending, sort low-to-high / A-to-Z. nulls appear first. desc: Descending, sort high-to low / Z-to-A nulls appear last.
 * @property {Number} [page] Optional. The page number of the result set to be returned.
 * @property {Number} [pagesize] Optional. The number of results to be returned.
 * @property {String} [startdate] Optional. Set to filter payments created on or after the given date. Format: yyyy-mm-dd.
 * @property {String} [enddate] Optional. Set to filter payments created on or before the given date. Format: yyyy-mm-dd.
 * @property {String} [status] Optional. Valid values: authorized, chargeback, failed, pending, posted, refundsettled, returned, reversed, reversensf, reverseposted, settled, voided. Accepts comma-separated list for multiple values. Default: all status values.
 * @property {Boolean} [lite] Optional. When true, returns a smaller payload with fewer fields.
 */

const axios = require('axios').default
const qs = require('qs')

// utils
const IsNull = require('../../utils/isNull')

// helpers
const { getCredentials, getAuthHeader } = require('./paysimple.helper')

const paysimpleEnv = 'TEST'

/**
 * Create new payment with credit card
 * @param {NewPaymentBodyParams} bodyParams New Payment parameters
 * @returns {Promise<Object>}
 */
const newPayment = async (bodyParams) => {
  try {
    const { AccountId, Amount, SuccessReceiptOptions } = bodyParams
    const credentials = getCredentials(paysimpleEnv)
    const authHeader = getAuthHeader(paysimpleEnv)
    const url = `${credentials.url}/payment`
    const data = { AccountId, Amount }
    if (!IsNull(SuccessReceiptOptions)) {
      data.SuccessReceiptOptions = {}
      if (!IsNull(SuccessReceiptOptions.SendToCustomer)) {
        data.SuccessReceiptOptions.SendToCustomer =
          SuccessReceiptOptions.SendToCustomer
      }
      if (
        !IsNull(SuccessReceiptOptions.SendToOtherAddresses) &&
        SuccessReceiptOptions.SendToOtherAddresses.length !== 0
      ) {
        data.SuccessReceiptOptions.SendToOtherAddresses =
          SuccessReceiptOptions.SendToOtherAddresses
      }
    }
    const paysimpleResponse = await axios.post(url, data, {
      headers: { Authorization: authHeader }
    })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log('Error at line 71 - paysimple.helper.js')
        throw new Error('Unauthorized')
      } else if (error.response.data) {
        if (error.response.data.Message) {
          console.log('Error at line 75 - paysimple.helper.js')
          throw new Error(error.response.data.Message)
        } else if (error.response.data.Meta) {
          const messages = []
          error.response.data.Meta.Errors.ErrorMessages.forEach((m) => {
            messages.push(m.Message)
          })
          const msgs = messages.join(', ')
          console.log('Error at line 83 - paysimple.helper.js')
          throw new Error(msgs)
        } else {
          console.log('Error at line 86 - paysimple.helper.js')
          throw new Error('Something went wrong')
        }
      } else {
        console.log('Error at line 90 - paysimple.helper.js')
        throw new Error('Something went wrong')
      }
    } else {
      console.log('Error at line 94 - paysimple.helper.js')
      throw new Error(error.message)
    }
  }
}

/**
 * Returns a payment object for the specified Id.
 * @param {Number} PaymentId Id of payment to retrieve.
 * @returns {Promise<Object>}
 */
const getPayment = async (PaymentId) => {
  try {
    const credentials = getCredentials(paysimpleEnv)
    const authHeader = getAuthHeader(paysimpleEnv)
    const url = `${credentials.url}/payment/${PaymentId}`
    const paysimpleResponse = await axios.get(url, {
      headers: { Authorization: authHeader }
    })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach((m) => {
          messages.push(m.Message)
        })
        const msgs = messages.join(', ')
        throw new Error(msgs)
      }
    } else {
      throw new Error(error.message)
    }
  }
}

/**
 * Filterable and sortable list of all payment records.
 * @param {ListPaymentsQueryParams} queryParams
 * @returns {Promise<Object>}
 */
const listPayments = async (queryParams) => {
  try {
    const credentials = getCredentials(paysimpleEnv)
    let url = `${credentials.url}/payment`
    const authHeader = getAuthHeader(paysimpleEnv)
    if (queryParams) {
      url += '?'
      const qsObject = {}
      if (!IsNull(queryParams.direction)) {
        qsObject.direction = queryParams.direction
      }
      if (!IsNull(queryParams.enddate)) {
        qsObject.enddate = queryParams.enddate
      }
      if (!IsNull(queryParams.lite)) {
        qsObject.lite = queryParams.lite
      }
      if (!IsNull(queryParams.page)) {
        qsObject.page = queryParams.page
      }
      if (!IsNull(queryParams.pagesize)) {
        qsObject.pagesize = queryParams.pagesize
      }
      if (!IsNull(queryParams.sortby)) {
        qsObject.sortby = queryParams.sortby
      }
      if (!IsNull(queryParams.startdate)) {
        qsObject.startdate = queryParams.startdate
      }
      if (!IsNull(queryParams.status)) {
        qsObject.status = queryParams.status
      }
      const qsString = qs.stringify(qsObject)
      url += qsString
    }
    const paysimpleResponse = await axios.get(url, {
      headers: { Authorization: authHeader }
    })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach((m) => {
          messages.push(m.Message)
        })
        const msgs = messages.join(', ')
        throw new Error(msgs)
      }
    } else {
      throw new Error(error.message)
    }
  }
}

/**
 * Refunds a settled payment of the specified Id.
 * @param {Number} PaymentId Id of the payment to be refunded.
 * @returns {Promise<Object>}
 */
const refundPayment = async (PaymentId) => {
  try {
    const credentials = getCredentials(paysimpleEnv)
    const authHeader = getAuthHeader(paysimpleEnv)
    const url = `${credentials.url}/payment/${PaymentId}/reverse`
    const paysimpleResponse = await axios.put(
      url,
      {},
      { headers: { Authorization: authHeader } }
    )
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach((m) => {
          messages.push(m.Message)
        })
        const msgs = messages.join(', ')
        throw new Error(msgs)
      }
    } else {
      throw new Error(error.message)
    }
  }
}

/**
 * Voids the payment of the specified id.
 * @param {Number} PaymentId Id of the payment to be voided.
 * @returns {Promise<Object>}
 */
const voidPayment = async (PaymentId) => {
  try {
    const credentials = getCredentials(paysimpleEnv)
    const url = `${credentials.url}/payment/${PaymentId}/void`
    const authHeader = getAuthHeader(paysimpleEnv)
    const paysimpleResponse = await axios.put(
      url,
      {},
      { headers: { Authorization: authHeader } }
    )
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach((m) => {
          messages.push(m.Message)
        })
        const msgs = messages.join(', ')
        throw new Error(msgs)
      }
    } else {
      throw new Error(error.message)
    }
  }
}

module.exports = {
  newPayment,
  getPayment,
  refundPayment,
  listPayments,
  voidPayment
}
