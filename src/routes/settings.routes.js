import { Router }            from 'express'
import { settingsController } from '../controllers/settings.controller.js'

const router = Router()
router.get('/',  settingsController.getSettings)
router.post('/', settingsController.upsertSetting)
export default router
