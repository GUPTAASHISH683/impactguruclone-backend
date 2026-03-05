// controllers/footer.controller.js
import { footerService } from '../services/footer.service.js'
import { success }       from '../utils/response.js'

export const footerController = {
  async getFooter(req, res, next) {
    try {
      const data = await footerService.getFullFooter()
      return success(res, data)
    } catch (err) { next(err) }
  },
}
