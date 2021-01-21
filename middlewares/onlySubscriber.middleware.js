// utils
const ApiResponse = require('../utils/ApiResponse')

// database
const dbUsers = require('../database/user/users.queries')

module.exports = async (req, res, next) => {
  const apiResponse = new ApiResponse()
  try {
    const { id } = req.user
    const userProfile = await dbUsers.getProfile(id)
    console.log('roleName', userProfile.vRoleName)
    if (userProfile.vRoleName !== 'Subscriber') {
      apiResponse.message = 'You can not access this route'
      return res.status(401).json(apiResponse)
    }
    next()
  } catch (error) {
    apiResponse.message = error.message
    return res.status(500).json(apiResponse)
  }
}
