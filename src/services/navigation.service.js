// services/navigation.service.js
import { prisma } from '../utils/prisma.js'

export const navigationService = {
  async getByLocation(location = 'header') {
    return prisma.navigation.findMany({
      where:   { location, isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getAll() {
    return prisma.navigation.findMany({
      where:   { isActive: true },
      orderBy: [{ location: 'asc' }, { sortOrder: 'asc' }],
    })
  },

  async create(data) {
    return prisma.navigation.create({ data })
  },

  async update(id, data) {
    return prisma.navigation.update({ where: { id }, data })
  },

  async remove(id) {
    return prisma.navigation.delete({ where: { id } })
  },
}
