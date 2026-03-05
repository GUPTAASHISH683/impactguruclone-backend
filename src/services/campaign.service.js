// services/campaign.service.js
import { prisma } from '../utils/prisma.js'
import { parsePagination } from '../utils/pagination.js'

export const campaignService = {
  async getAll({ page, limit, skip, category, urgent }) {
    const where = { isActive: true }
    if (category && category !== 'all') where.category = category
    if (urgent === 'true') where.isUrgent = true

    const [data, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        orderBy: [{ isUrgent: 'desc' }, { sortOrder: 'asc' }],
        skip,
        take:  limit,
      }),
      prisma.campaign.count({ where }),
    ])

    // Serialize BigInt for JSON
    const serialised = data.map(serializeCampaign)
    return { data: serialised, total }
  },

  async getById(id) {
    const c = await prisma.campaign.findUnique({ where: { id: parseInt(id, 10) } })
    return c ? serializeCampaign(c) : null
  },

  async getBySlug(slug) {
    const c = await prisma.campaign.findUnique({ where: { slug } })
    return c ? serializeCampaign(c) : null
  },

  async create(data) {
    const c = await prisma.campaign.create({
      data: {
        ...data,
        raised: BigInt(data.raised || 0),
        goal:   BigInt(data.goal),
      },
    })
    return serializeCampaign(c)
  },

  async update(id, data) {
    const updateData = { ...data }
    if (data.raised !== undefined) updateData.raised = BigInt(data.raised)
    if (data.goal   !== undefined) updateData.goal   = BigInt(data.goal)

    const c = await prisma.campaign.update({ where: { id: parseInt(id, 10) }, data: updateData })
    return serializeCampaign(c)
  },

  async remove(id) {
    return prisma.campaign.delete({ where: { id: parseInt(id, 10) } })
  },
}

function serializeCampaign(c) {
  return {
    ...c,
    raised: Number(c.raised),
    goal:   Number(c.goal),
    pct:    Math.min(Math.round((Number(c.raised) / Number(c.goal)) * 100), 100),
  }
}
