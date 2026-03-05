import { categoryService } from '../services/category.service.js'
import { success }         from '../utils/response.js'

export const categoryController = {
  async getCategories(req, res, next) {
    try {
      const data = await categoryService.getAll()
      return success(res, data)
    } catch (err) { next(err) }
  },
}
