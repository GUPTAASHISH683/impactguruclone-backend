import { Router }               from 'express'
import { testimonialController } from '../controllers/testimonial.controller.js'

const router = Router()
router.get('/', testimonialController.getTestimonials)
export default router
