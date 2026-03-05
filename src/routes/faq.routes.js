import { Router }       from 'express'
import { faqController } from '../controllers/faq.controller.js'

const router = Router()
router.get('/', faqController.getFaqs)
export default router
