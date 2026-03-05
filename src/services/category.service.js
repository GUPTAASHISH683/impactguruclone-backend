// services/category.service.js
import { prisma } from '../utils/prisma.js'

export const categoryService = {
  async getAll() {
    return prisma.category.findMany({
      where:   { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  },
}
