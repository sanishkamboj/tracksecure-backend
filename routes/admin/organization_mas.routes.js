const router = require('express').Router()

// controllers
const organizationMasController = require('../../controllers/admin/organization_mas.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .get('/', authMiddleware, organizationMasController.listOrganizations)
  .get('/:id', authMiddleware, organizationMasController.getOrganizationById)

router.post('/', authMiddleware, organizationMasController.createOrganization)

router.patch(
  '/:id',
  authMiddleware,
  organizationMasController.updateOrganization
)

router.delete(
  '/:id',
  authMiddleware,
  organizationMasController.deleteOrganization
)

module.exports = router
