const router = require('express').Router()

// controllers
const rolesMasController = require('../../controllers/admin/roles_mas.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .get('/', authMiddleware, rolesMasController.listRoles)
  .get('/:id', authMiddleware, rolesMasController.getRoleById)

router.post('/', authMiddleware, rolesMasController.createRole)

router.patch('/:id', authMiddleware, rolesMasController.updateRole)

router.delete('/:id', authMiddleware, rolesMasController.deleteRole)

module.exports = router
