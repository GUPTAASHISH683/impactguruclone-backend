// services/testimonial.service.js
import { prisma } from '../utils/prisma.js'

export const testimonialService = {
  async getAll() {
    return prisma.testimonial.findMany({
      where:   { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  },
}
