import { faqService } from '../services/faq.service.js'
import { success }    from '../utils/response.js'

export const faqController = {
  async getFaqs(req, res, next) {
    try {
      const data = await faqService.getAll(req.query.category)
      return success(res, data)
    } catch (err) { next(err) }
  },
}
