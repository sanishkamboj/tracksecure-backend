const router = require('express').Router()

// controllers
const adminsController = require('../../controllers/admin/admins.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const profilePictureMiddleware = require('../../middlewares/profilePircture.middleware')

router
  .post('/', authMiddleware, adminsController.createAdmin)
  .post('/login', adminsController.login)
  .post('/logout', authMiddleware, adminsController.logout)
  .post('/forgot_password', authMiddleware, adminsController.forgot_password)
  .post('/me/profilePicture', authMiddleware, profilePictureMiddleware, adminsController.uploadProfilePicture)

router
  .get('/', authMiddleware, adminsController.listAdmins)
  .get('/me', authMiddleware, adminsController.getMe)
  .get('/me/profilePicture', authMiddleware, adminsController.getProfilePicture)
  .get('/:iAdminId', authMiddleware, adminsController.getAdmin)

router
  .patch('/me', authMiddleware, adminsController.updateMe)
  .patch('/:iAdminId', authMiddleware, adminsController.updateAdmin)

router
  .delete('/:iAdminId', authMiddleware, adminsController.deleteAdmin)
  .delete('/me/profilePicture', authMiddleware, adminsController.deleteProfilePicture)

module.exports = router
