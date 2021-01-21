/**
 * @typedef NewCreditCardBodyParams
 * @property {Number} CustomerId Required. The unique identifier of the Customer to add the new card.
 * @property {String} CreditCardNumber Required. 15, 16 or 19 digits
 * @property {String} ExpirationDate Required. A valid date in the format of mm/yyyy
 * @property {String} Issuer Required. Valid values: Visa, Master (MasterCard), Amex (American Express), Discover
 */

const axios = require('axios').default

// helpers
const { getCredentials, getAuthHeader } = require('./paysimple.helper')

const paysimpleEnv = 'TEST'

/**
 * Create new credit card for an existing customer
 * @param {NewCreditCardBodyParams} bodyParams New Credit Card
 * @returns {Promise<Object>}
 */
const newCreditCard = async (bodyParams) => {
  try {
    const { CreditCardNumber, CustomerId, ExpirationDate, Issuer } = bodyParams
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    const authHeader = getAuthHeader(paysimpleEnv)
    const url = `${credentials.url}/account/creditcard`
    const data = {
      CreditCardNumber,
      CustomerId,
      ExpirationDate,
      Issuer,
      IsDefault: true
    }
    const paysimpleResponse = await axios.post(url, data, { headers: { Authorization: authHeader } })
    return paysimpleResponse.data.Response
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log('Error at line 40 - accounts.helper.js')
        throw new Error('Unauthorized')
      } else if (error.response.data) {
        if (error.response.data.Message) {
          console.log('Error at line 44 - accounts.helper.js')
          throw new Error(error.response.data.Message)
        } else if (error.response.data.Meta) {
          const messages = []
          error.response.data.Meta.Errors.ErrorMessages.forEach((m) => {
            messages.push(m.Message)
          })
          const msgs = messages.join(', ')
          console.log('Error at line 52 - accounts.helper.js')
          throw new Error(msgs)
        } else {
          console.log('Error at line 55 - accounts.helper.js')
          throw new Error('Something went wrong')
        }
      } else {
        console.log('Error at line 59 - accounts.helper.js')
        throw new Error('Something went wrong')
      }
    } else {
      console.log('Error at line 63 - accounts.helper.js')
      throw new Error(error.message)
    }
  }
}

/**
 * Returns the Credit Card object for the specified account id.
 * @param {Number} AccountId Required. Id of the specified credit card account to be retrieved.
 * @returns {Promise<Object>}
 */
const getCreditCard = async (AccountId) => {
  try {
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    const authHeader = getAuthHeader(paysimpleEnv)
    const url = `${credentials.url}/account/creditcard/${AccountId}`
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
 * Deletes the credit card object for the specified account.
 * @param {Number} AccountId Required. Id of the credit card to be deleted
 * @returns {Promise<Object>}
 */
const deleteCreditCard = async (AccountId) => {
  try {
    // Get credentials according to environment
    const credentials = getCredentials(paysimpleEnv)
    const authHeader = getAuthHeader(paysimpleEnv)
    const url = `${credentials.url}/account/creditcard/${AccountId}`
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
  newCreditCard,
  getCreditCard,
  deleteCreditCard
}
