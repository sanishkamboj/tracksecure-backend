const uniqid = require('uniqid')
const bcrypt = require('bcryptjs')

// utils
const ApiResponse = require('../../utils/ApiResponse')
const IsNull = require('../../utils/isNull')

// helpers
const mailHelper = require('../../helpers/nodemailer/mail.helper')

// dbs
const dbForgotPassword = require('../../database/user/forgot_password.queries')
const dbUser = require('../../database/user/users.queries')

module.exports.saveToken = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { email } = req.body

    if (IsNull(email)) {
      apiResponse.message = 'Email is required'
      return res.status(400).json(apiResponse)
    }

    const user = await dbUser.findUserByEmail(email)

    if (IsNull(user)) {
      apiResponse.message = 'This email is not registered with us'
      return res.status(400).json(apiResponse)
    }

    const token = uniqid()
    const otp = Math.floor(Math.random() * Math.floor(99999) - Math.ceil(100000)) + Math.ceil(100000)
    const data = {
      email,
      vOTP: otp,
      vRandomToken: token
    }

    const createdToken = await dbForgotPassword.saveToken(data)
    if (IsNull(createdToken.insertId)) {
      apiResponse.message = 'Something went wrong'
      return res.status(500).json(apiResponse)
    }

    await mailHelper.sendForgotPasswordMail(email, `${user.vFirstName} ${user.vLastName}`, otp)
    apiResponse.message = `OTP has been sent to ${email}`
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.changePassword = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { email, password, otp } = req.body

    const user = await dbUser.findUserByEmail(email)

    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(404).json(apiResponse)
    }

    const otpData = await dbForgotPassword.getToken(email, otp)
    if (IsNull(otpData)) {
      apiResponse.message = 'Could not verify otp'
      return res.status(401).json(apiResponse)
    }

    if (otpData.vOTP != otp) {
      apiResponse.message = 'OTP does not match'
      return res.status(400).json(apiResponse)
    }
    if (otpData.vOTP == otp) {
      const vPassword = await bcrypt.hash(password, 10)
      const updatedPassword = await dbUser.findUserByIdAndUpdate({ vPassword }, user.iUserId)
      if (updatedPassword.affectedRows === 0) {
        apiResponse.message = 'Could not update passoword'
        return res.status(500).json(apiResponse)
      }
      await dbForgotPassword.deleteToken(email, otp)
      apiResponse.message = 'Password has been updated successfully'
      res.status(200).json(apiResponse).end()
    }
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
