// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// helpers
const paysimpleAccountsHelper = require('../../helpers/paysimple/accounts.helper')
const accountsHelper = require('../../helpers/paysimple/accounts.helper')

module.exports.createAccount = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { CreditCardNumber, CustomerId, ExpirationDate, Issuer } = req.body

    if (IsNull(CreditCardNumber)) apiResponse.errors.push('Credit Card Number is missing')
    if (IsNull(CustomerId)) apiResponse.errors.push('Customer Id is missing')
    if (IsNull(ExpirationDate)) apiResponse.errors.push('Expiration Date is missing')
    if (IsNull(Issuer)) apiResponse.errors.push('Issuer is missing')

    if (apiResponse.errors.length > 0) {
      return res.status(400).json(apiResponse)
    }

    const createdCreditCard = await paysimpleAccountsHelper.newCreditCard({ CreditCardNumber, CustomerId, ExpirationDate, Issuer })
    apiResponse.data = createdCreditCard
    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getAccount = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { AccountId } = req.params
    const acDetails = await accountsHelper.getCreditCard(AccountId)
    apiResponse.data.card = acDetails
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
