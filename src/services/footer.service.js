// services/footer.service.js
import { prisma } from '../utils/prisma.js'

export const footerService = {
  async getFullFooter() {
    const [columns, socials, meta] = await Promise.all([
      prisma.footerColumn.findMany({
        where:   { isVisible: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          links: {
            where:   { isActive: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      prisma.footerSocial.findMany({
        where:   { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.footerMeta.findMany(),
    ])

    // Convert meta array into a key/value object for easy consumption
    const metaObj = meta.reduce((acc, m) => {
      acc[m.metaKey] = m.metaValue
      return acc
    }, {})

    return { columns, socials, meta: metaObj }
  },
}
