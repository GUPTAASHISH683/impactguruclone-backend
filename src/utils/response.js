// src/utils/response.js — Standardised Funddoo API response helpers

/**
 * 200 success with optional meta
 */
export const success = (res, data, meta = null, statusCode = 200) => {
  const payload = { success: true, data }
  if (meta) payload.meta = meta
  return res.status(statusCode).json(payload)
}

/**
 * Paginated list response
 */
export const paginated = (res, data, { page, limit, total }) => {
  const totalPages = Math.ceil(total / limit)
  return res.status(200).json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  })
}

/**
 * Error response helper (for use inside controllers, not the global handler)
 */
export const error = (res, message, statusCode = 400, details = null) => {
  const payload = { success: false, message }
  if (details) payload.details = details
  return res.status(statusCode).json(payload)
}
