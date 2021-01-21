const ApiResponse = require('../../utils/ApiResponse')
const Validator = require('../../utils/validator')
const IsNull = require('../../utils/isNull')

// db queries
const dbUsers = require('../../database/user/users.queries')
const dbOrganization = require('../../database/admin/organization_mas.queries')
const dbSubscriptionCC = require('../../database/admin/subscription_cc.queries')

// helpers
const crypto = require('../../helpers/crypto.helper')
const isNull = require('../../utils/isNull')
const paysimpleAccountsHelper = require('../../helpers/paysimple/accounts.helper')

// get subscription credit card record
module.exports.getSubscriptionCCRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    if (req.isSubscriber) {
      const { iOrganizationId } = req.params

      const org = await dbOrganization.getOrganization(iOrganizationId)

      if (IsNull(org)) {
        apiResponse.message = 'Organization not found'
        return res.status(404).json(apiResponse)
      }

      const ccrecord = await dbSubscriptionCC.getCCDetails(org.iOrganizationId)

      if (isNull(ccrecord)) {
        apiResponse.message = 'Credit card record not found'
        return res.status(400).json(apiResponse)
      }

      ccrecord.vCCFirstName = await crypto.decrypt(ccrecord.vCCFirstName)
      ccrecord.vCCLastName = await crypto.decrypt(ccrecord.vCCLastName)
      ccrecord.vCCType = await crypto.decrypt(ccrecord.vCCType)
      ccrecord.vCCNumber = await crypto.decrypt(ccrecord.vCCNumber)
      ccrecord.vCCExpiry = await crypto.decrypt(ccrecord.vCCExpiry)
      ccrecord.vCCCvv = await crypto.decrypt(ccrecord.vCCCvv)
      ccrecord.vCCAddress = await crypto.decrypt(ccrecord.vCCAddress)
      ccrecord.vCCCity = await crypto.decrypt(ccrecord.vCCCity)
      ccrecord.vCCState = await crypto.decrypt(ccrecord.vCCState)
      ccrecord.vCCZipcode = await crypto.decrypt(ccrecord.vCCZipcode)
      ccrecord.vCCCountry = await crypto.decrypt(ccrecord.vCCCountry)

      apiResponse.data.ccrecord = ccrecord
      return res.status(200).json(apiResponse)
    } else {
      apiResponse.message =
        'You are not authorized to access credit card records'
      return res.status(401).json(apiResponse)
    }
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// update credit card record
module.exports.updateSubscriptionCCRecord = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    if (req.isSubscriber) {
      const { iOrganizationId } = req.params

      const {
        vCCFirstName,
        vCCLastName,
        vCCType,
        vCCNumber,
        vCCExpiry,
        vCCCvv,
        vCCAddress,
        vCCCity,
        vCCState,
        vCCZipcode,
        vCCCountry
      } = req.body

      const data = {}
      if (Validator.validateString(vCCFirstName)) {
        data.vCCFirstName = await crypto.encrypt(vCCFirstName)
      }

      if (Validator.validateString(vCCLastName)) {
        data.vCCLastName = await crypto.encrypt(vCCLastName)
      }

      if (Validator.validateString(vCCType)) {
        data.vCCType = await crypto.encrypt(vCCType)
      }

      if (Validator.validateNumber(vCCNumber)) {
        data.vCCNumber = await crypto.encrypt(vCCNumber)
      }

      if (Validator.validateString(vCCType)) {
        data.vCCType = await crypto.encrypt(vCCType)
      }

      if (Validator.validateString(vCCExpiry)) {
        data.vCCExpiry = await crypto.encrypt(vCCExpiry)
      }

      if (Validator.validateString(vCCCvv)) {
        data.vCCCvv = await crypto.encrypt(vCCCvv)
      }

      if (Validator.validateString(vCCAddress)) {
        data.vCCAddress = await crypto.encrypt(vCCAddress)
      }

      if (Validator.validateString(vCCCity)) {
        data.vCCCity = await crypto.encrypt(vCCCity)
      }

      if (Validator.validateString(vCCState)) {
        data.vCCState = await crypto.encrypt(vCCState)
      }

      if (Validator.validateString(vCCZipcode)) {
        data.vCCZipcode = await crypto.encrypt(vCCZipcode)
      }

      if (Validator.validateString(vCCCountry)) {
        data.vCCCountry = await crypto.encrypt(vCCCountry)
      }

      const ccDetails = await dbSubscriptionCC.getCCDetails(iOrganizationId)
      if (!ccDetails) {
        apiResponse.message = 'Credit card record not found'
        return res.status(400).json(apiResponse)
      }
      const ccDetailsNumber = await crypto.decrypt(ccDetails.vCCNumber)
      if (!isNull(vCCNumber) && vCCNumber !== ccDetailsNumber) {
        const paysimpleId = await dbUsers.findPaysimpleUserByOrg(iOrganizationId)
        if (isNull(paysimpleId)) {
          apiResponse.message = 'Credit Card not found'
          return res.status(400).json(apiResponse)
        }
        const paysimpleCCUpdate = await paysimpleAccountsHelper.newCreditCard({ CreditCardNumber: vCCNumber, CustomerId: paysimpleId.vPaysimpleId, ExpirationDate: vCCExpiry, Issuer: vCCType })
        data.vPaysimpleCCId = paysimpleCCUpdate.Id
        await paysimpleAccountsHelper.deleteCreditCard(ccDetailsNumber)
      }

      await dbSubscriptionCC.updateCCDetails(data, iOrganizationId)
      apiResponse.message = 'Details updated successfully'
      return res.status(200).json(apiResponse)
    } else {
      apiResponse.message = 'You are not authorized to update these details'
      return res.status(401).json(apiResponse)
    }
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
