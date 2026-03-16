// services/settings.service.js
import { prisma } from '../utils/prisma.js'

export const settingsService = {
  async getAll(group) {
    const where = {}
    if (group) where.settingGroup = group
    const rows = await prisma.setting.findMany({ where, orderBy: [{ settingGroup: 'asc' }, { settingKey: 'asc' }] })
    // Return as nested object: { general: { site_name: 'Funddoo', ... }, ... }
    return rows.reduce((acc, s) => {
      if (!acc[s.settingGroup]) acc[s.settingGroup] = {}
      acc[s.settingGroup][s.settingKey] = castValue(s.settingValue, s.settingType)
      return acc
    }, {})
  },

  async upsert(group, key, value, type = 'string', description = '') {
    return prisma.setting.upsert({
      where:  { settingGroup_settingKey: { settingGroup: group, settingKey: key } },
      update: { settingValue: String(value), settingType: type },
      create: { settingGroup: group, settingKey: key, settingValue: String(value), settingType: type, description },
    })
  },
}

function castValue(value, type) {
  switch (type) {
    case 'number':  return Number(value)
    case 'boolean': return value === 'true'
    case 'json':    try { return JSON.parse(value) } catch { return value }
    default:        return value
  }
}
