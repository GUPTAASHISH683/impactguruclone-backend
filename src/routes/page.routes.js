import { Router } from 'express'
import { pageController } from '../controllers/page.controller.js'

const router = Router()
router.get('/:slug',                      pageController.getPage)
router.get('/:slug/sections/:sectionKey', pageController.getSection)
export default router
