// @ts-check
/**
 * @typedef PaysimpleCredentials
 * @property {String} url Paysimple URL
 * @property {String} userId Paysimple UserId
 * @property {String} apiKey Paysimple API Key
 */

const crypto = require('crypto')

// helpers
const paysimpleTest = require('../../utils/globals').PAYSIMPLE_TEST

/**
 * Get credentials
 * @param {String} [environment=TEST] Paysimple environment to use. TEST or PROD
 * @returns {PaysimpleCredentials}
 */
const getCredentials = (environment = 'TEST') => {
  let apiKey = null
  let url = null
  let userId = null
  if (environment === 'TEST') {
    apiKey = paysimpleTest.apiKey
    url = paysimpleTest.url
    userId = paysimpleTest.userId
  }
  return { apiKey, url, userId }
}

/**
 * Get hmac signed auth header
 * @param {String} [environment=TEST] Paysimple environment to use. TEST or PROD
 * @returns {String} Returns hmac signed auth header
 */
const getAuthHeader = (environment = 'TEST') => {
  const credentials = getCredentials(environment)
  const date = new Date().toISOString()
  const preparedHmac = crypto.createHmac('sha256', credentials.apiKey).update(date).digest('base64')
  const accessid = credentials.userId
  const timestamp = date
  const signature = preparedHmac
  const header = `PSSERVER accessid=${accessid}; timestamp=${timestamp}; signature=${signature}`
  return header
}

module.exports = {
  getCredentials,
  getAuthHeader
}
