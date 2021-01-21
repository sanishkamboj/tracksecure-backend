const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const moment = require('moment')

// utils
const ApiResponse = require('../../utils/ApiResponse')
const globals = require('../../utils/globals')
const IsNull = require('../../utils/isNull')

// helpers
const awsHelper = require('../../helpers/aws.helper')

// db queries
const dbAdmins = require('../../database/admin/admins.queries')
const dbLoginLogs = require('../../database/user/login_logs.queries')

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

    await dbLoginLogs.updateLoginLog({ dLogoutDate: moment().format('YYYY-MM-DD hh:mm:ss') }, loginId)
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

    const admin = await dbAdmins.findAdminByEmail(vEmail)

    if (IsNull(admin)) {
      apiResponse.message = 'Email or Password is incorrect'
      return res.status(401).json(apiResponse)
    }

    const passwordMatch = await bcrypt.compare(vPassword, admin.vPassword)

    if (!passwordMatch) {
      apiResponse.message = 'Email or Password is incorrect'
      return res.status(401).json(apiResponse)
    }

    let vFromIp = req.ip
    if (vFromIp === '::1' || vFromIp === '127.0.0.1') {
      vFromIp = '127.0.0.1'
    } else if (vFromIp.substr(0, 7) === '::ffff:') {
      vFromIp = vFromIp.substr(7)
    }

    await dbAdmins.incrementLoginCount(admin.iAdminId, vFromIp)

    const signedToken = jwt.sign(
      {
        id: admin.iAdminId,
        email: admin.vEmail,
        username: admin.vUserName,
        isAdmin: true
      },
      globals.JWT_SECRET,
      { expiresIn: '1d' }
    )

    const loginLog = {
      iID: admin.iAdminId,
      eType: 1,
      vIP: vFromIp,
      vUserAgent: req.headers['user-agent']
    }
    const log = await dbLoginLogs.saveLoginLog(loginLog)

    apiResponse.data.token = signedToken
    apiResponse.data.loginId = log.insertId
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.forgot_password = async (req, res) => {
  const apiResponse = new ApiResponse()

  try {
    const { oldPassword, newPassword } = req.body
    const { email } = req.user

    if (IsNull(oldPassword)) {
      apiResponse.errors.push('Old password is required')
    }
    if (IsNull(newPassword)) {
      apiResponse.errors.push('New password is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(200).json(apiResponse)
    }

    const admin = await dbAdmins.findAdminByEmail(email)

    if (IsNull(admin)) {
      apiResponse.message = 'Email or Password is incorrect'
      return res.status(401).json(apiResponse)
    }

    if (admin.vPassword !== oldPassword) {
      apiResponse.message = 'Email Password is incorrect'
      return res.status(401).json(apiResponse)
    }

    const updatedAdmin = await dbAdmins.updatePassword(email, newPassword)

    if (updatedAdmin.affectedRows === 0) {
      apiResponse.message = 'Could not update password'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Password updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.listAdmins = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const admins = await dbAdmins.listAdmins()
    admins.forEach((a) => {
      delete a.vPassword
    })
    apiResponse.data.admin = admins
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.getAdmin = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iAdminId } = req.params

    if (IsNull(iAdminId)) {
      apiResponse.errors.push('Admin id is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const admin = await dbAdmins.findAdminById(iAdminId)

    if (IsNull(admin)) {
      apiResponse.message = 'Admin not found'
      return res.status(404).json(apiResponse)
    }
    delete admin.vPassword
    apiResponse.data.admin = admin
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

    const me = await dbAdmins.findAdminById(id)

    if (IsNull(me)) {
      apiResponse.message = 'Admin not found'
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
    const admin = await dbAdmins.findAdminById(id)
    if (IsNull(admin)) {
      apiResponse.message = 'Admin not found'
      return res.status(404).json(apiResponse)
    }
    if (IsNull(admin.vImage)) {
      apiResponse.message = 'No profile image'
      return res.status(404).json(apiResponse)
    }
    const url = await awsHelper.getObjectStream(admin.vImage)
    url.on('error', (error) => {
      apiResponse.message = error.message
      return res.status(404).json(apiResponse)
    }).pipe(res)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.uploadProfilePicture = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const vProfileImg = req.file.key
    const iAdminId = req.user.id
    const admin = await dbAdmins.findAdminById(iAdminId)
    if (!IsNull(admin.vImage)) {
      await awsHelper.deleteObject(admin.vImage)
    }
    const updateAdmin = await dbAdmins.updateAdmin({ vImage: vProfileImg }, iAdminId)
    if (updateAdmin.affectedRows === 0) {
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
    const admin = await dbAdmins.findAdminById(id)
    if (IsNull(admin)) {
      apiResponse.message = 'User not found'
      return res.status(400).json(apiResponse)
    }

    if (IsNull(admin.vImage)) {
      apiResponse.message = 'No profile picture to delete'
      return res.status(404).json(apiResponse)
    }
    await awsHelper.deleteObject(admin.vImage)
    await dbAdmins.updateAdmin({ vImage: null }, id)
    apiResponse.message = 'Profile picture deleted successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.createAdmin = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { vFirstName, vLastName, vEmail, vPassword, iAGroupId } = req.body

    if (IsNull(vEmail)) {
      apiResponse.errors.push('Email is required')
    }

    const admin = await dbAdmins.findAdminByEmail(vEmail)
    if (!IsNull(admin)) {
      apiResponse.message = 'Admin already exists'
      return res.status(401).json(apiResponse)
    }

    if (IsNull(vFirstName)) {
      apiResponse.errors.push('First Name is required')
    }

    if (IsNull(vLastName)) {
      apiResponse.errors.push('Last Name is required')
    }

    if (IsNull(vPassword)) {
      apiResponse.errors.push('Password is required')
    }

    if (IsNull(iAGroupId)) {
      apiResponse.errors.push('Admin Group ID is required')
    }

    if (apiResponse.errors.length > 0) {
      return res.status(422).json(apiResponse)
    }

    const vUserName = vEmail.split('@')[0]

    const data = {
      vFirstName,
      vLastName,
      vEmail,
      vPassword,
      iAGroupId,
      vUserName
    }

    const hashPass = await bcrypt.hash(data.vPassword, 10)
    data.vPassword = hashPass
    const createdAdmin = await dbAdmins.createAdmin(data)

    if (IsNull(createdAdmin)) {
      apiResponse.message = 'Could not create a new admin'
      return res.status(500).json(apiResponse)
    }

    apiResponse.message = 'Admin created successfully'
    apiResponse.data.createdAdmin = createdAdmin.insertId
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.updateAdmin = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const {
      iAGroupId,
      vFirstName,
      vLastName,
      vPhone,
      vMobile,
      iStatus
    } = req.body
    const { iAdminId } = req.params

    const data = {}

    if (!IsNull(iAGroupId)) {
      data.iAGroupId = iAGroupId
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
    if (!IsNull(vMobile)) {
      data.vMobile = vMobile
    }
    if (!IsNull(iStatus)) {
      data.iStatus = iStatus
    }

    const updatedAdmin = await dbAdmins.updateAdmin(data, iAdminId)

    if (updatedAdmin.affectedRows === 0) {
      apiResponse.message = 'Could not update admin'
      return res.status(500).json(apiResponse)
    }
    apiResponse.message = 'Admin updated successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}

module.exports.updateMe = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { vFirstName, vLastName, vMobile, vPhone, vPassword } = req.body
    const { id } = req.user
    const data = {}

    const admin = await dbAdmins.findAdminById(id)

    if (IsNull(admin)) {
      apiResponse.message = 'Admin Not Found'
      return res.status(404).json(apiResponse)
    }

    if (!IsNull(vFirstName)) {
      data.vFirstName = vFirstName
    }
    if (!IsNull(vLastName)) {
      data.vLastName = vLastName
    }
    if (!IsNull(vMobile)) {
      data.vMobile = vMobile
    }
    if (!IsNull(vPhone)) {
      data.vPhone = vPhone
    }
    if (!IsNull(vPassword)) {
      const hashedPass = await bcrypt.hash(vPassword, 10)
      data.vPassword = hashedPass
    }

    const updatedAdmin = await dbAdmins.updateAdmin(data, id)

    if (updatedAdmin.affectedRows === 0) {
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

module.exports.deleteAdmin = async (req, res) => {
  const apiResponse = new ApiResponse()
  try {
    const { iAdminId } = req.params
    const deletedAdmin = await dbAdmins.deleteAdmin(iAdminId)
    if (deletedAdmin.affectedRows === 0) {
      apiResponse.message = 'Could not delete admin'
    }
    apiResponse.message = 'Admin deleted successfully'
    return res.status(200).json(apiResponse)
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
