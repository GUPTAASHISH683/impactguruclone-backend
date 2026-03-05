import { testimonialService } from '../services/testimonial.service.js'
import { success }            from '../utils/response.js'

export const testimonialController = {
  async getTestimonials(req, res, next) {
    try {
      const data = await testimonialService.getAll()
      return success(res, data)
    } catch (err) { next(err) }
  },
}
