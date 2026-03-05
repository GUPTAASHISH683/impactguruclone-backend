import { Router } from 'express'
import { navigationController } from '../controllers/navigation.controller.js'

const router = Router()

router.get('/',       navigationController.getNavigation)
router.post('/',      navigationController.createLink)
router.put('/:id',    navigationController.updateLink)
router.delete('/:id', navigationController.deleteLink)

export default router
