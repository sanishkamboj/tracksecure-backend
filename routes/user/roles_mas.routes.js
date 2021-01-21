const router = require('express').Router()

// controllers
const rolesMasController = require('../../controllers/user/roles_mas.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')
const subscriptionStatusMiddleware = require('../../middlewares/subscriptionStatus.middleware')
const onlySubscriberMiddleware = require('../../middlewares/onlySubscriber.middleware')

router
  .get(
    '/:iOrganizationId',
    authMiddleware,
    onlySubscriberMiddleware,
    rolesMasController.listRolesByOrgIds
  )
  .get(
    '/:id/:iOrganizationId',
    authMiddleware,
    onlySubscriberMiddleware,
    rolesMasController.getRoleByOrgId
  )

router.post('/', authMiddleware, subscriptionStatusMiddleware, rolesMasController.createRole)

router.patch(
  '/:id/:iOrganizationId',
  authMiddleware,
  subscriptionStatusMiddleware,
  onlySubscriberMiddleware,
  rolesMasController.updateRole
)

router.delete(
  '/:id/:iOrganizationId',
  authMiddleware,
  subscriptionStatusMiddleware,
  onlySubscriberMiddleware,
  rolesMasController.deleteRole
)

module.exports = router
