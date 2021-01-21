const router = require('express').Router()

// controllers
const indexController = require('../controllers/index.controller')

// sub routes
const adminRoutes = require('./admin/index.routes')
const userRoutes = require('./user/index.routes')
const settingsRoutes = require('./settings/settings.routes')
const paysimpleRoutes = require('./paysimple/index.routes')

router.get('/', indexController.index)
router.get('/test', indexController.test)

// admin routes
router
  .use('/v1.0/admin_panel', adminRoutes)
  .use('/v1.0/user_panel', userRoutes)
  .use('/v1.0/settings', settingsRoutes)
  .use('/v1.0/paysimple', paysimpleRoutes)

module.exports = router
