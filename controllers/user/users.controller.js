const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uniqid = require('uniqid')
const moment = require('moment')

// utils
const ApiResponse = require('../../utils/ApiResponse')
const globals = require('../../utils/globals')
const IsNull = require('../../utils/isNull')
const validator = require('../../utils/validator')

// helpers
const { encrypt } = require('../../helpers/crypto.helper')
const mailHelper = require('../../helpers/nodemailer/mail.helper')
const paysimpleCustomersHelper = require('../../helpers/paysimple/customers.helper')
const paysimpleAccountsHelper = require('../../helpers/paysimple/accounts.helper')
const paysimplePaymentsHelper = require('../../helpers/paysimple/payments.helper')
const awsHelper = require('../../helpers/aws.helper')

// db queries
const dbUsers = require('../../database/user/users.queries')
const dbLoginLogs = require('../../database/user/login_logs.queries')
const dbOrganizationMas = require('../../database/admin/organization_mas.queries')
const dbAssessmentRecords = require('../../database/user/assessment_records.queries')
const dbRolesMas = require('../../database/admin/role_mas.queries')
const dbSubscriptionPlans = require('../../database/admin/subscription_plans.queries')
const dbSubscriptionTransaction = require('../../database/admin/subscription_plan_transaction.queries')
const dbSubscriptionCC = require('../../database/admin/subscription_cc.queries')
const dbOTPs = require('../../database/admin/otps.queries')

module.exports.logout = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { loginId } = req.body
    if (IsNull(loginId)) {
      apiResponse.message = 'Login id is required'
      return res.status(400).json(apiResponse)
    }

    const log = await dbLoginLogs.getLoginLog(loginId)

    if (IsNull(log)) {
      apiResponse.message = 'Login log not found'
      return res.status(400).json(apiResponse)
    }

    await dbLoginLogs.updateLoginLog(
      { dLogoutDate: moment().format('YYYY-MM-DD hh:mm:ss') },
      loginId
    )
    apiResponse.message = 'Logged out successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.login = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { vEmail, vPassword } = req.body

    if (IsNull(vEmail)) {
      apiResponse.errors.push('Email is required')
    }
    if (IsNull(vPassword)) {
      apiResponse.errors.push('Password is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const user = await dbUsers.findUserByEmail(vEmail)
    if (IsNull(user)) {
      apiResponse.message = 'Email or Password is incorrect'
      return res.status(401).json(apiResponse)
    }

    const passwordMatch = await bcrypt.compare(vPassword, user.vPassword)
    if (!passwordMatch) {
      apiResponse.message = 'Email or Password is incorrect'
      return res.status(401).json(apiResponse)
    }

    if (user.i2FA) {
      const iUserId = user.iUserId
      const vOTPSubject = '2FA'
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
        return res.status(500).json(apiResponse)
      }
      apiResponse.data.mailSent = true
      return res.status(201).json(apiResponse)
    }

    const signedToken = jwt.sign(
      {
        id: user.iUserId,
        email: user.vEmail,
        username: user.vUserName
      },
      globals.JWT_SECRET,
      { expiresIn: '1d' }
    )

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7)
    }

    const loginLog = {
      iID: user.iUserId,
      eType: 2,
      vIP: ip,
      vUserAgent: req.headers['user-agent']
    }
    const log = await dbLoginLogs.saveLoginLog(loginLog)
    const profile = await dbUsers.getProfile(user.iUserId)

    if (IsNull(profile)) {
      apiResponse.message = 'User profile not found'
      return res.status(404).json(apiResponse)
    }

    delete profile.vPassword
    apiResponse.data.token = signedToken
    apiResponse.data.profile = profile
    apiResponse.data.loginId = log.insertId
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.login2fa = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { vEmail, iOTP } = req.body
    if (IsNull(vEmail)) apiResponse.errors.push('Email is required')
    if (IsNull(iOTP)) apiResponse.errors.push('OTP is required')
    if (apiResponse.errors.length > 0) {
      return res.status(400).json(apiResponse)
    }
    const user = await dbUsers.findUserByEmail(vEmail)
    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(200).json(apiResponse)
    }
    const otp = await dbOTPs.findOTP(user.iUserId, '2FA', iOTP)
    if (IsNull(otp) || otp.length === 0) {
      apiResponse.message = 'Could not verify OTP'
      return res.status(400).json(apiResponse)
    }
    let otpVerified = false
    if (otp[0].iOTP === iOTP) otpVerified = true
    if (!otpVerified) {
      apiResponse.message = 'OTP is invalid'
      return res.status(200).json(apiResponse)
    }
    const endTime = moment(otp[0].expireAt)
    const beginTime = moment()
    if (endTime.isBefore(beginTime)) {
      await dbOTPs.deleteOTP(user.iUserId, '2FA', iOTP)
      apiResponse.message = 'OTP is expired'
      return res.status(400).json(apiResponse)
    }
    const signedToken = jwt.sign(
      {
        id: user.iUserId,
        email: user.vEmail,
        username: user.vUserName
      },
      globals.JWT_SECRET,
      { expiresIn: '1d' }
    )

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7)
    }

    const loginLog = {
      iID: user.iUserId,
      eType: 2,
      vIP: ip,
      vUserAgent: req.headers['user-agent']
    }
    const log = await dbLoginLogs.saveLoginLog(loginLog)
    const profile = await dbUsers.getProfile(user.iUserId)

    if (IsNull(profile)) {
      apiResponse.message = 'User profile not found'
      return res.status(404).json(apiResponse)
    }

    delete profile.vPassword
    await dbOTPs.deleteOTP(user.iUserId, '2FA', iOTP)
    apiResponse.data.token = signedToken
    apiResponse.data.profile = profile
    apiResponse.data.loginId = log.insertId
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.register = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      vFirstName,
      vLastName,
      vPassword,
      vEmail,
      vPhone,
      vOrganizationName,
      iSPlanId,
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

    if (IsNull(iSPlanId)) {
      apiResponse.errors.push('Plan is required')
    }
    if (IsNull(vFirstName)) {
      apiResponse.errors.push('First name is required')
    }
    if (IsNull(vLastName)) {
      apiResponse.errors.push('Last name is required')
    }
    if (IsNull(vPassword)) {
      apiResponse.errors.push('Password is required')
    }
    if (IsNull(vEmail)) {
      apiResponse.errors.push('Email is required')
    }
    if (IsNull(vPhone)) {
      apiResponse.errors.push('Phone number is required')
    }
    if (IsNull(vOrganizationName)) {
      apiResponse.errors.push('Organization name is required')
    }
    if (apiResponse.errors.length > 1) {
      return res.status(400).json(apiResponse)
    }

    if (!validator.validateString(vFirstName)) {
      apiResponse.errors.push('First name is not valid')
    }
    if (!validator.validateString(vLastName)) {
      apiResponse.errors.push('Last name is not valid')
    }
    if (!validator.validateString(vPassword)) {
      apiResponse.errors.push('First name is not valid')
    }
    if (!validator.validateEmail(vEmail)) {
      apiResponse.errors.push('Email is not valid')
    }
    if (!validator.validateNumber(vPhone)) {
      apiResponse.errors.push('Phone number is not valid')
    }
    if (!validator.validateString(vOrganizationName)) {
      apiResponse.errors.push('Organization name is not valid')
    }
    if (!validator.validateString(vCCFirstName)) {
      apiResponse.errors.push('Credit Card First name is not valid')
    }
    if (!validator.validateString(vCCLastName)) {
      apiResponse.errors.push('Credit Card Last name is not valid')
    }
    if (!validator.validateString(vCCType)) {
      apiResponse.errors.push('Credit Card Type is not valid')
    }
    if (!validator.validateString(vCCNumber)) {
      apiResponse.errors.push('Credit Card Number is not valid')
    }
    if (!validator.validateNumber(vCCCvv)) {
      apiResponse.errors.push('Credit Card Number is not valid')
    }
    if (!validator.validateString(vCCAddress)) {
      apiResponse.errors.push('Credit Card Address is not valid')
    }
    if (!validator.validateString(vCCCity)) {
      apiResponse.errors.push('Credit Card City is not valid')
    }
    if (!validator.validateString(vCCState)) {
      apiResponse.errors.push('Credit Card State is not valid')
    }
    if (!validator.validateString(vCCZipcode)) {
      apiResponse.errors.push('Credit Card Zipcode is not valid')
    }
    if (!validator.validateString(vCCCity)) {
      apiResponse.errors.push('Credit Card Country is not valid')
    }

    if (apiResponse.errors.length > 1) {
      return res.status(400).json(apiResponse)
    }

    const userExists = await dbUsers.findUserByEmail(vEmail)
    if (!IsNull(userExists)) {
      apiResponse.message = 'User with this email address already exists'
      return res.status(400).json(apiResponse)
    }

    const planExists = await dbSubscriptionPlans.getSubscriptionPlan(iSPlanId)

    if (IsNull(planExists)) {
      apiResponse.message = "Plan doesn't exist"
      return res.status(400).json(apiResponse)
    }

    const hashedPass = await bcrypt.hash(vPassword, 10)
    const organizationData = { vOrganizationName, vOrganizationEmail: vEmail }

    const orgExists = await dbOrganizationMas.getOrganizationByName(
      vOrganizationName
    )
    if (!IsNull(orgExists)) {
      apiResponse.message = 'Organization with this name already exists'
      return res.status(400).json(apiResponse)
    }

    let createdPaysimplePayment = null
    const createdPaysimpleUser = await paysimpleCustomersHelper.createCustomer({
      FirstName: vFirstName,
      LastName: vLastName,
      Company: vOrganizationName,
      BillingAddress: {
        City: vCCCity,
        Country: vCCCountry,
        StreetAddress1: vCCAddress,
        ZipCode: vCCZipcode
      }
    })

    const createdPaysimpleCreditcard = await paysimpleAccountsHelper.newCreditCard(
      {
        CreditCardNumber: vCCNumber,
        CustomerId: createdPaysimpleUser.Id,
        Issuer: vCCType,
        ExpirationDate: vCCExpiry
      }
    )

    if (planExists.fPrice) {
      createdPaysimplePayment = await paysimplePaymentsHelper.newPayment({
        AccountId: createdPaysimpleCreditcard.Id,
        Amount: planExists.fPrice,
        SuccessReceiptOptions: { SendToOtherAddresses: [vEmail] }
      })
      if (createdPaysimplePayment.Status === 'Failed') {
        apiResponse.message = 'Credit Card Payment failed'
        return res.status(400).json(apiResponse)
      }
    }

    const createdOrganization = await dbOrganizationMas.createOrganization(
      organizationData
    )
    const iOrganizationId = createdOrganization.insertId
    const dStartDate = moment().format('YYYY-MM-DD')
    const iTotalDays = planExists.iTotalDays
    const dEndDate = moment(dStartDate, 'YYYY-MM-DD')
      .add(iTotalDays, 'days')
      .format('YYYY-MM-DD')
    const dDate = moment().format('YYYY-MM-DD hh:mm:ss')

    const planData = {
      vOrderId: uniqid(),
      iSPlanId,
      vPlanName: planExists.vPlanName,
      iUserLimit: planExists.iUserLimit,
      iAssessmentLimit: planExists.iAssessmentLimit,
      iOrganizationId,
      vTransactionId: createdPaysimplePayment
        ? createdPaysimplePayment.Id
        : null,
      vPayType: 'CC',
      fAmount: planExists.fPrice,
      dStartDate,
      dEndDate,
      iTotalDays,
      tNotes: 'Plan notes',
      dDate,
      vPaysimplePaymentId: createdPaysimplePayment
        ? createdPaysimplePayment.Id
        : null
    }

    const ccData = {
      iOrganizationId: iOrganizationId,
      vCCFirstName: await encrypt(vCCFirstName),
      vCCLastName: await encrypt(vCCLastName),
      vCCType: await encrypt(vCCType),
      vCCNumber: await encrypt(vCCNumber),
      vCCExpiry: await encrypt(vCCExpiry),
      vCCCvv: await encrypt(vCCCvv),
      vCCAddress: await encrypt(vCCAddress),
      vCCCity: await encrypt(vCCCity),
      vCCState: await encrypt(vCCState),
      vCCZipcode: await encrypt(vCCZipcode),
      vCCCountry: await encrypt(vCCCountry),
      vPaysimpleCCId: createdPaysimpleCreditcard.Id
    }

    const createdTxn = await dbSubscriptionTransaction.createTransaction(
      planData
    )
    ccData.iSTranId = createdTxn.insertId

    await dbSubscriptionCC.createCCTransaction(ccData)

    const createdRole = await dbRolesMas.createRole({
      iOrganizationId,
      vRoleName: 'Subscriber'
    })
    const userData = {
      vFirstName,
      vLastName,
      iOrganizationId,
      iRoleId: createdRole.insertId,
      vUserName: vEmail.split('@')[0],
      vPassword: hashedPass,
      vEmail,
      vPhone,
      iStatus: 1,
      vPaysimpleId: createdPaysimpleUser.Id // its a CustomerID in paysimple
    }

    const createdUser = await dbUsers.createUser(userData)
    apiResponse.message = 'Registered successfully'
    apiResponse.data.createdUser = createdUser.insertId
    res.status(201).json(apiResponse).end()
    await mailHelper.sendRegistrationMail(userData.vEmail, {
      dEndDate: planData.dEndDate,
      dStartDate: planData.dStartDate,
      fAmount: planData.fAmount,
      iAssessmentLimit: planData.iAssessmentLimit,
      iUserLimit: planData.iUserLimit,
      vPlanName: planData.vPlanName
    })
  } catch (error) {
    console.log(error)
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getPlanDetails = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.user
    const { iOrganizationId } = req.params

    const user = dbUsers.findUserByOrg(id, iOrganizationId)

    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(400).json(apiResponse)
    }

    const plan = await dbSubscriptionTransaction.getTransactionByOrgId(
      iOrganizationId
    )

    const orgUserCount = await dbUsers.countUsersByOrgId(iOrganizationId)
    const orgAssessmentCount = await dbAssessmentRecords.countRecordsByOrgId(
      iOrganizationId
    )

    apiResponse.data.plan = plan
    apiResponse.data.usersLeft = plan.iUserLimit - orgUserCount.users
    apiResponse.data.assessmentsLeft =
      plan.iAssessmentLimit - orgAssessmentCount.assessmentRecords
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getMe = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.user

    const me = await dbUsers.findUserById(id)

    if (IsNull(me)) {
      apiResponse.message = 'User not found'
      return res.status(404).json(apiResponse)
    }

    delete me.vPassword
    apiResponse.data.me = me
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getProfilePicture = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.user
    const user = await dbUsers.findUserById(id)
    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(404).json(apiResponse)
    }
    if (IsNull(user.vProfileImg)) {
      apiResponse.message = 'No profile image'
      return res.status(404).json(apiResponse)
    }
    // const url = await awsHelper.getObject(user.vProfileImg)
    // const imgtype = mime.getType(user.vProfileImg)
    // const base64Img = `data:${imgtype};base64, ${Buffer.from(url.Body, 'binary').toString('base64')}`
    // apiResponse.data.profilePicture = base64Img
    const url = await awsHelper.getObjectStream(user.vProfileImg)
    url
      .on('error', (error) => {
        apiResponse.message = error.message
        return res.status(404).json(apiResponse)
      })
      .pipe(res)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.uploadProfilePicture = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const vProfileImg = req.file.key
    const iUserId = req.user.id
    const user = await dbUsers.findUserById(iUserId)
    if (!IsNull(user.vProfileImg)) {
      await awsHelper.deleteObject(user.vProfileImg)
    }
    const updatedUser = await dbUsers.updateUserById({ vProfileImg }, iUserId)
    if (updatedUser.affectedRows === 0) {
      apiResponse.message = 'Could not update profile picture'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Profile picture updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.deleteProfilePicture = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.user
    const user = await dbUsers.findUserById(id)
    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(400).json(apiResponse)
    }

    if (IsNull(user.vProfileImg)) {
      apiResponse.message = 'No profile picture to delete'
      return res.status(404).json(apiResponse)
    }
    await awsHelper.deleteObject(user.vProfileImg)
    await dbUsers.updateUserById({ vProfileImg: null }, id)
    apiResponse.message = 'Profile picture deleted successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.updateMe = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      vFirstName,
      vLastName,
      vPhone,
      vTitle,
      vPassword,
      vUserAddress
    } = req.body
    const { id } = req.user
    const data = {}

    if (IsNull(vPassword)) {
      apiResponse.message = 'Password is required'
      return res.status(400).json(apiResponse)
    }

    const user = await dbUsers.findUserById(id)

    if (IsNull(user)) {
      apiResponse.message = 'User not found'
      return res.status(404).json(apiResponse)
    }

    if (!IsNull(vFirstName)) {
      data.vFirstName = vFirstName
    }
    if (!IsNull(vLastName)) {
      data.vLastName = vLastName
    }
    if (!IsNull(vPhone)) {
      data.vPhone = vPhone
    }
    if (!IsNull(vTitle)) {
      data.vTitle = vTitle
    }
    if (!IsNull(vUserAddress)) {
      data.vUserAddress = vUserAddress
    }

    const pwdMatch = await bcrypt.compare(vPassword, user.vPassword)

    if (!pwdMatch) {
      apiResponse.message = 'Unauthorized'
      return res.status(401).json(apiResponse)
    }

    const updatedUser = await dbUsers.findUserByIdAndUpdate(data, id)

    if (updatedUser.affectedRows === 0) {
      apiResponse.message = 'Could not update profile'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Profile updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.upgradePlan = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iOrganizationId, iSPlanId } = req.body
    const oldPlan = await dbSubscriptionTransaction.getTransactionByOrgId(
      iOrganizationId
    )

    if (IsNull(oldPlan)) {
      apiResponse.message = 'Subscription not found'
      return res.status(404).json(apiResponse)
    }

    const planDetails = await dbSubscriptionPlans.getSubscriptionPlan(iSPlanId)
    const ccDetails = await dbSubscriptionCC.getCCDetails(iOrganizationId)

    if (planDetails.fPrice < oldPlan.fAmount) {
      apiResponse.message = 'You can not downgrade from a current plan.'
      return res.status(400).json(apiResponse)
    }

    if (!ccDetails) {
      apiResponse.message =
        'Credit card details not available for the specific organization'
      return res.status(404).json(apiResponse)
    }

    const createdPayment = await paysimplePaymentsHelper.newPayment({
      AccountId: ccDetails.vPaysimpleCCId,
      Amount: planDetails.fPrice,
      SuccessReceiptOptions: {
        SendToOtherAddresses: ['rahultrivedi180@gmail.com']
      }
    })

    const dStartDate = moment(oldPlan.dStartDate).format('YYYY-MM-DD')
    const newPlanDays = planDetails.iTotalDays
    const today = moment()
    const diff = moment(oldPlan.dEndDate).diff(today, 'days')
    const addDays = newPlanDays + diff
    const dUpgradeDate = moment().add(addDays, 'days').format('YYYY-MM-DD')
    const dDate = moment().format('YYYY-MM-DD hh:mm:ss')
    const {
      fPrice,
      iAssessmentLimit,
      iTotalDays,
      iUserLimit,
      vPlanName
    } = planDetails
    // upgrade txn and done!
    const upgradedPlan = {
      dDate,
      dEndDate: dUpgradeDate,
      dStartDate,
      fAmount: fPrice,
      iAssessmentLimit,
      iSPlanId,
      iTotalDays,
      iUserLimit,
      vPaysimplePaymentId: createdPayment.Id,
      vPlanName,
      vTransactionId: createdPayment.Id
    }
    const upgradePlan = await dbSubscriptionTransaction.updateTransaction(
      upgradedPlan,
      {
        ...upgradedPlan,
        iOrganizationId,
        iStatus: 1,
        tNotes: 'Plan upgraded',
        vOrderId: oldPlan.vOrderId,
        vPayType: 'CC'
      },
      oldPlan.vOrderId
    )

    apiResponse.data.upgradedPlan = upgradePlan
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
