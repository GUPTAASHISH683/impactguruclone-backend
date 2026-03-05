// controllers/page.controller.js
import { pageService } from '../services/page.service.js'
import { success }     from '../utils/response.js'

export const pageController = {
  async getPage(req, res, next) {
    try {
      const page = await pageService.getBySlug(req.params.slug)
      if (!page) return res.status(404).json({ success: false, message: 'Page not found' })
      return success(res, page)
    } catch (err) { next(err) }
  },

  async getSection(req, res, next) {
    try {
      const section = await pageService.getSectionByKey(req.params.slug, req.params.sectionKey)
      if (!section) return res.status(404).json({ success: false, message: 'Section not found' })
      return success(res, section)
    } catch (err) { next(err) }
  },
}
