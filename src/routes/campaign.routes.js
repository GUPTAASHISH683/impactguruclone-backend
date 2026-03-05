import { Router }             from 'express'
import { campaignController } from '../controllers/campaign.controller.js'

const router = Router()

router.get('/',     campaignController.getCampaigns)
router.get('/:id',  campaignController.getCampaign)
router.post('/',    campaignController.createCampaign)
router.put('/:id',  campaignController.updateCampaign)
router.delete('/:id', campaignController.deleteCampaign)

export default router
