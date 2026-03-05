import { settingsService } from '../services/settings.service.js'
import { success }         from '../utils/response.js'

export const settingsController = {
  async getSettings(req, res, next) {
    try {
      const data = await settingsService.getAll(req.query.group)
      return success(res, data)
    } catch (err) { next(err) }
  },

  async upsertSetting(req, res, next) {
    try {
      const { group, key, value, type, description } = req.body
      const data = await settingsService.upsert(group, key, value, type, description)
      return success(res, data)
    } catch (err) { next(err) }
  },
}
