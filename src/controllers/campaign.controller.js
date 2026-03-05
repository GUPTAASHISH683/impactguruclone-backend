// controllers/campaign.controller.js
import { campaignService }  from '../services/campaign.service.js'
import { success, paginated } from '../utils/response.js'
import { parsePagination }  from '../utils/pagination.js'

export const campaignController = {
  async getCampaigns(req, res, next) {
    try {
      const { page, limit, skip } = parsePagination(req.query)
      const { category, urgent }  = req.query
      const { data, total }       = await campaignService.getAll({ page, limit, skip, category, urgent })
      return paginated(res, data, { page, limit, total })
    } catch (err) { next(err) }
  },

  async getCampaign(req, res, next) {
    try {
      const campaign = await campaignService.getById(req.params.id)
      if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' })
      return success(res, campaign)
    } catch (err) { next(err) }
  },

  async createCampaign(req, res, next) {
    try {
      const campaign = await campaignService.create(req.body)
      return success(res, campaign, null, 201)
    } catch (err) { next(err) }
  },

  async updateCampaign(req, res, next) {
    try {
      const campaign = await campaignService.update(req.params.id, req.body)
      return success(res, campaign)
    } catch (err) { next(err) }
  },

  async deleteCampaign(req, res, next) {
    try {
      await campaignService.remove(req.params.id)
      return success(res, { deleted: true })
    } catch (err) { next(err) }
  },
}
