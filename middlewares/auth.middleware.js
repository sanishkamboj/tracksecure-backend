const jwt = require('jsonwebtoken')

// utils
const ApiResponse = require('../utils/ApiResponse')
const globals = require('../utils/globals')

module.exports = (req, res, next) => {
  const apiResponse = new ApiResponse()

  try {
    if (!req.headers.authorization) {
      apiResponse.message = 'Unauthorized'
      return res.status(401).json(apiResponse)
    }
    const token = req.headers.authorization
    const decodedToken = jwt.verify(token, globals.JWT_SECRET)
    req.user = decodedToken
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      apiResponse.message = 'Unauthorized'
    } else {
      apiResponse.message = 'Invalid Token'
    }
    return res.status(500).json(apiResponse)
  }
}
