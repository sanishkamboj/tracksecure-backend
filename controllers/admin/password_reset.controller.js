const uniquid = require('uniqid')
const moment = require('moment')
const bcrypt = require('bcryptjs')

// helpers
const mailHelper = require('../../helpers/nodemailer/mail.helper')

// db queries
const dbUsers = require('../../database/user/users.queries')
const dbCustomers = require('../../database/admin/customers.queries')
const dbPasswordReset = require('../../database/admin/password_reset.queries')

// Utils
const ApiResponse = require('../../utils/ApiResponse')
const isNull = require('../../utils/isNull')

// Password reset link
module.exports.sendPasswordResetLink = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iUserId } = req.body
    const user = await dbCustomers.getCustomerById(iUserId)
    if (isNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(404).json(apiResponse)
    }
    const token = uniquid()
    const expireAt = moment().add(5, 'minute').format('YYYY-MM-DD HH:mm:ss')
    const createdToken = await dbPasswordReset.createToken({ iUserId: iUserId, vToken: token, expireAt })
    let tokenSent = false
    let tokenSaved = false
    if (createdToken.affectedRows === 0) {
      apiResponse.message = 'Something went wrong'
      return res.status(500).json(apiResponse)
    }
    tokenSaved = true
    await mailHelper.sendResetLinkMail(user.vEmail, token)
    tokenSent = true
    if (!tokenSent && !tokenSaved) {
      apiResponse.message = 'Could not process request'
      return res.status(400).json(apiResponse)
    }
    apiResponse.message = 'Link has been sent to your email'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

// Reset password
module.exports.resetPassword = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { token } = req.params
    const { password } = req.body

    const tokenFromDb = await dbPasswordReset.getToken(token)
    if (isNull(tokenFromDb)) {
      apiResponse.message = 'Token is invalid'
      return res.status(401).json(apiResponse)
    }
    const endTime = moment(tokenFromDb.expireAt)
    const beginTime = moment()
    if (endTime.isBefore(beginTime)) {
      await dbPasswordReset.deleteToken(tokenFromDb.iUserId, token)
      apiResponse.message = 'Token is invalid'
      return res.status(401).json(apiResponse)
    }
    const user = await dbUsers.findUserById(tokenFromDb.iUserId)
    if (isNull(user)) {
      apiResponse.message = 'Token is invalid'
      return res.status(401).json(apiResponse)
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const updatedUser = await dbUsers.updateUserById({ vPassword: hashedPassword }, tokenFromDb.iUserId)
    if (updatedUser.affectedRows === 0) {
      apiResponse.message = 'Something went wrong'
      return res.status(500).json(apiResponse)
    }
    await dbPasswordReset.deleteToken(user.iUserId, token)
    apiResponse.message = 'Password reset successfull. Please login.'
    return res.status(200).json(apiResponse)
  } catch (error) {
    console.log(error)
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
