const router = require('express').Router()

// controllers
const checklistController = require('../../controllers/admin/checklist.controller')

// middlewares
const authMiddleware = require('../../middlewares/auth.middleware')

router
  .get('/', authMiddleware, checklistController.listChecklist)
  .get('/:id', authMiddleware, checklistController.getChecklist)

router.post('/', authMiddleware, checklistController.createChecklist)

router.patch('/:id', authMiddleware, checklistController.updateChecklist)

router.delete('/:id', authMiddleware, checklistController.deleteChecklist)

module.exports = router
