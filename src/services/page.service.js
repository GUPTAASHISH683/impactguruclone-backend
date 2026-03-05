// services/page.service.js
import { prisma } from '../utils/prisma.js'

export const pageService = {
  async getBySlug(slug) {
    const page = await prisma.page.findUnique({
      where:   { slug, isPublished: true },
      include: {
        metadata: true,
        sections: {
          where:   { isVisible: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            contentBlocks: { orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    })
    if (!page) return null

    // Shape sections into a named map + blocks into key/value map
    const shapedSections = page.sections.reduce((acc, section) => {
      const blocks = section.contentBlocks.reduce((bAcc, b) => {
        bAcc[b.blockKey] = b.blockValue
        return bAcc
      }, {})
      acc[section.sectionKey] = {
        id:         section.id,
        sectionKey: section.sectionKey,
        heading:    section.heading,
        subheading: section.subheading,
        body:       section.body,
        tag:        section.tag,
        blocks,
      }
      return acc
    }, {})

    return {
      id:          page.id,
      slug:        page.slug,
      title:       page.title,
      description: page.description,
      metadata:    page.metadata,
      sections:    shapedSections,
    }
  },

  async getSectionByKey(slug, sectionKey) {
    const page = await prisma.page.findUnique({ where: { slug } })
    if (!page) return null

    const section = await prisma.section.findUnique({
      where:   { pageId_sectionKey: { pageId: page.id, sectionKey } },
      include: { contentBlocks: { orderBy: { sortOrder: 'asc' } } },
    })
    if (!section) return null

    const blocks = section.contentBlocks.reduce((acc, b) => {
      acc[b.blockKey] = b.blockValue
      return acc
    }, {})

    return { ...section, blocks }
  },
}
