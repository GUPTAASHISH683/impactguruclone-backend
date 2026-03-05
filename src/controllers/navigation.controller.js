// controllers/navigation.controller.js
import { navigationService } from '../services/navigation.service.js'
import { success, error }    from '../utils/response.js'

export const navigationController = {
  async getNavigation(req, res, next) {
    try {
      const location = req.query.location || 'header'
      const data = await navigationService.getByLocation(location)
      return success(res, data)
    } catch (err) { next(err) }
  },

  async createLink(req, res, next) {
    try {
      const data = await navigationService.create(req.body)
      return success(res, data, null, 201)
    } catch (err) { next(err) }
  },

  async updateLink(req, res, next) {
    try {
      const data = await navigationService.update(parseInt(req.params.id, 10), req.body)
      return success(res, data)
    } catch (err) { next(err) }
  },

  async deleteLink(req, res, next) {
    try {
      await navigationService.remove(parseInt(req.params.id, 10))
      return success(res, { deleted: true })
    } catch (err) { next(err) }
  },
}
