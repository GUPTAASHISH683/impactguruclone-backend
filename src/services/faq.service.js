// services/faq.service.js
import { prisma } from '../utils/prisma.js'

export const faqService = {
  async getAll(category) {
    const where = { isActive: true }
    if (category) where.category = category
    return prisma.faq.findMany({ where, orderBy: { sortOrder: 'asc' } })
  },
}
