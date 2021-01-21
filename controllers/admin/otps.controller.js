const moment = require('moment')

// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// helpers
const mailHelper = require('../../helpers/nodemailer/mail.helper')

// db queries
const dbOTPs = require('../../database/admin/otps.queries')
const dbCustomers = require('../../database/admin/customers.queries')

module.exports.sendOTP = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iUserId, vOTPSubject, vEmail } = req.body
    if (IsNull(iUserId)) {
      apiResponse.errors.push('User id is required')
    }
    if (IsNull(vOTPSubject)) {
      apiResponse.errors.push('OTP subject is required')
    }
    if (IsNull(vEmail)) {
      apiResponse.errors.push('Email is required')
    }
    if (apiResponse.errors.length > 0) {
      return res.status(400).json(apiResponse)
    }

    const customer = await dbCustomers.getCustomerByEmail(vEmail)
    if (IsNull(customer)) {
      apiResponse.message = 'User not found with this email id'
      return res.status(400).json(apiResponse)
    }

    let otpSent = false
    let otpSaved = false

    const iOTP = Math.floor(100000 + Math.random() * 900000)
    const expireAt = moment().add(5, 'minute').format('YYYY-MM-DD HH:mm:ss')
    const data = { iUserId, vOTPSubject, iOTP, expireAt }
    const createdOTP = await dbOTPs.createOTP(data)
    if (createdOTP.insertId && createdOTP.affectedRows === 1) {
      otpSaved = true
      apiResponse.message = 'OTP has been sent to your email id'
    }

    await mailHelper.send2FAOTPMail(vEmail, { OTP: iOTP })
    otpSent = true
    if (!otpSaved || !otpSent) {
      apiResponse.message = 'Could not process OTP'
      return res.status(200).json(apiResponse)
    }

    return res.status(201).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
