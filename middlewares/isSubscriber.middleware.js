// utils
const ApiResponse = require('../utils/ApiResponse')

// database
const dbUsers = require('../database/user/users.queries')
const dbAdmins = require('../database/admin/admins.queries')

module.exports = async (req, res, next) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.user
    let isSubscriber = false
    const userProfile = await dbUsers.getProfile(id)
    const admin = await dbAdmins.findAdminById(id)
    if (userProfile) {
      if (userProfile.vRoleName === 'Subscriber') {
        isSubscriber = true
      }
    }
    if (admin) {
      isSubscriber = true
    }
    req.isSubscriber = isSubscriber
    next()
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
