/**
 * @typedef ListCustomersQueryParams
 * @property {String} [sortby] Field name to sort by.
 * @property {String} [direction] Valid values: asc: Ascending, sort low-to-high / A-to-Z. nulls appear first. desc: Descending, sort high-to low / Z-to-A nulls appear last.
 * @property {Number} [page] The page number of the result set to be returned.
 * @property {Number} [pagesize] The number of results to be returned.
 * @property {Boolean} [lite]  When set to true only a small subset of fields will be returned in the response.
 */

/**
 * @typedef ListPaymentsQueryParams
 * @property {String} [sortby] Field name to sort by.
 * @property {String} [direction] Valid values: asc: Ascending, sort low-to-high / A-to-Z. nulls appear first. desc: Descending, sort high-to low / Z-to-A nulls appear last.
 * @property {Number} [page] The page number of the result set to be returned.
 * @property {Number} [pagesize] The number of results to be returned.
 * @property {String} [startdate] Earliest payment creation date to retrieve. Format: yyyy-mm-dd.
 * @property {String} [enddate] Last payment creation date to retrieve. Format: yyyy-mm-dd.
 * @property {String} [status] Payment status
 */

/**
 * @typedef BillingAddress
 * @property {String} StreetAddress1 250 characters max
 * @property {String} City 100 characters max
 * @property {String} ZipCode 10 characters max
 * @property {String} Country Valid 2 character country code. Defaults to "US".
 */

/**
 * @typedef NewCustomerBodyParams
 * @property {String} FirstName Required. 100 characters max.
 * @property {String} LastName Required. 100 characters max.
 * @property {BillingAddress} BillingAddress Billing address of a user
 * @property {String} Company Organization. 50 charaters max
 */

const axios = require('axios').default
const qs = require('qs')

// utils
const IsNull = require('../../utils/isNull')

// helpers
const { getCredentials, getAuthHeader } = require('./paysimple.helper')

const paysimpleEnv = 'TEST'

/**
 * Filterable and sortable list of all customers.
 * @param {ListCustomersQueryParams} queryParams
 * @returns {Promise<Object>}
 */
const listCustomers = async (queryParams) => {
  try {
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    // Variables for axios request
    let url = `${credentials.url}/customer`
    const authHeader = getAuthHeader(paysimpleEnv)

    // prepare query string if any
    if (queryParams) {
      url += '?'
      const qsObj = {}
      if (!IsNull(queryParams.lite)) { qsObj.lite = true }
      if (!IsNull(queryParams.direction)) { qsObj.direction = queryParams.direction }
      if (!IsNull(queryParams.page)) { qsObj.page = queryParams.page }
      if (!IsNull(queryParams.pagesize)) { qsObj.pagesize = queryParams.pagesize }
      if (!IsNull(queryParams.sortby)) { qsObj.sortby = queryParams.sortby }
      const qsString = qs.stringify(qsObj)
      url += qsString
    }
    const paysimpleResponse = await axios.get(url, { headers: { Authorization: authHeader } })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach(m => {
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
 * Returns a Customer object for the specified Id.
 * @param {Number} CustomerId Id of customer to retrieve
 */
const getCustomer = async (CustomerId) => {
  try {
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    // Variables for axios request
    const url = `${credentials.url}/customer/${CustomerId}`
    const authHeader = getAuthHeader(paysimpleEnv)
    const paysimpleResponse = await axios.get(url, { headers: { Authorization: authHeader } })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach(m => {
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
 * Returns a list of all Credit Card accounts associated with the specified customer.
 * @param {Number} CustomerId Id of specific customer to retrieve list of payment accounts
 */
const getAccounts = async (CustomerId) => {
  try {
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    // Variables for axios request
    const url = `${credentials.url}/customer/${CustomerId}/creditcardaccounts`
    const authHeader = getAuthHeader(paysimpleEnv)
    const paysimpleResponse = await axios.get(url, { headers: { Authorization: authHeader } })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach(m => {
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
 * Returns the default credit card account associated with the specified customer.
 * @param {Number} CustomerId Id of the Customer whose default credit card account you want to retrieve
 */
const getDefaultAccount = async (CustomerId) => {
  try {
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    // Variables for axios request
    const url = `${credentials.url}/customer/${CustomerId}/defaultcreditcard`
    const authHeader = getAuthHeader(paysimpleEnv)
    const paysimpleResponse = await axios.get(url, { headers: { Authorization: authHeader } })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach(m => {
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
 * Returns a list of payment records for the specified customer.
 * @param {Number} CustomerId Id of specific customer to retrieve list of payment records
 * @param {ListPaymentsQueryParams} queryParams Query parameters for filtered list of payments
 */
const listPayments = async (CustomerId, queryParams) => {
  try {
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    // Variables for axios request
    let url = `${credentials.url}/customer/${CustomerId}/payments`
    const authHeader = getAuthHeader(paysimpleEnv)

    // prepar query string if any
    if (queryParams) {
      url += '?'
      const qsObj = {}
      if (!IsNull(queryParams.sortby)) { qsObj.sortby = queryParams.sortby }
      if (!IsNull(queryParams.direction)) { qsObj.direction = queryParams.direction }
      if (!IsNull(queryParams.page)) { qsObj.page = queryParams.page }
      if (!IsNull(queryParams.pagesize)) { qsObj.pagesize = queryParams.pagesize }
      if (!IsNull(queryParams.startdate)) { qsObj.startdate = queryParams.startdate }
      if (!IsNull(queryParams.enddate)) { qsObj.enddate = queryParams.enddate }
      if (!IsNull(queryParams.status)) { qsObj.status = queryParams.status }
      const qsString = qs.stringify(qsObj)
      url += qsString
    }

    const paysimpleResponse = await axios.get(url, { headers: { Authorization: authHeader } })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach(m => {
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
 * Create new customer
 * @param {NewCustomerBodyParams} bodyParams New customer
 * @returns {Promise<Object>}
 */
const createCustomer = async (bodyParams) => {
  try {
    const { FirstName, LastName, Company, BillingAddress } = bodyParams
    const { City, Country, StreetAddress1, ZipCode } = BillingAddress
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    const authHeader = getAuthHeader(paysimpleEnv)
    const url = `${credentials.url}/customer`
    const data = {
      FirstName,
      LastName,
      Company,
      ShippingSameAsBilling: true,
      BillingAddress: {
        City,
        Country,
        StreetAddress1,
        ZipCode
      }
    }

    const paysimpleResponse = await axios.post(url, data, { headers: { Authorization: authHeader } })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log('Error at line 270 - customers.helpers.js')
        throw new Error('Unauthorized')
      } else if (error.response.data) {
        if (error.response.data.Message) {
          console.log('Error at line 274 - customers.helpers.js')
          throw new Error(error.response.data.Message)
        } else if (error.response.data.Meta) {
          const messages = []
          error.response.data.Meta.Errors.ErrorMessages.forEach((m) => {
            messages.push(m.Message)
          })
          const msgs = messages.join(', ')
          console.log('Error at line 282 - customers.helpers.js')
          throw new Error(msgs)
        } else {
          console.log('Error at line 285 - customers.helpers.js')
          throw new Error('Something went wrong')
        }
      } else {
        console.log('Error at line 289 - customers.helpers.js')
        throw new Error('Something went wrong')
      }
    } else {
      console.log('Error at line 293 - customers.helpers.js')
      throw new Error(error.message)
    }
  }
}

/**
 * Delete a customer from paysimple
 * @param {String} customerId Paysimple customer id
 * @returns {Promise<Object>}
 */
const deleteCustomer = async (customerId) => {
  try {
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    const authHeader = getAuthHeader(paysimpleEnv)
    const url = `${credentials.url}/customer/${customerId}`
    const paysimpleResponse = await axios.delete(url, { headers: { Authorization: authHeader } })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.data.Message) {
        throw new Error(error.response.data.Message)
      }
      if (error.response.data.Meta.Errors) {
        const messages = []
        error.response.data.Meta.Errors.ErrorMessages.forEach(m => {
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
  listCustomers,
  getCustomer,
  getAccounts,
  getDefaultAccount,
  listPayments,
  createCustomer,
  deleteCustomer
}
