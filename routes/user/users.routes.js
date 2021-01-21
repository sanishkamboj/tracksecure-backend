const router = require('express').Router()

// controllers
const userController = require('../../controllers/user/users.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const profilePictureMiddleware = require('../../middlewares/profilePircture.middleware')
const subscriptionStatusMiddleware = require('../../middlewares/subscriptionStatus.middleware')

router
  .post('/login', userController.login)
  .post('/login/2fa', userController.login2fa)
  .post('/register', userController.register)
  .post('/logout', authMiddleware, userController.logout)
  .post(
    '/me/profilePicture',
    authMiddleware,
    subscriptionStatusMiddleware,
    profilePictureMiddleware,
    userController.uploadProfilePicture
  )

router
  .get('/me', authMiddleware, userController.getMe)
  .get('/me/profilePicture', authMiddleware, userController.getProfilePicture)
  .get(
    '/plan/:iOrganizationId',
    authMiddleware,
    userController.getPlanDetails
  )

router
  .patch('/me', authMiddleware, userController.updateMe)
  .patch(
    '/plan',
    authMiddleware,
    subscriptionStatusMiddleware,
    userController.upgradePlan
  )

router
  .delete('/me/profilePicture', authMiddleware, userController.deleteProfilePicture)

module.exports = router
