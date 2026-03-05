// src/utils/response.js - Standardised API response helpers

export const success = (res, data, meta = null, statusCode = 200) => {
  const payload = { success: true, data }
  if (meta) payload.meta = meta
  return res.status(statusCode).json(payload)
}

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

export const error = (res, message, statusCode = 400, details = null) => {
  const payload = { success: false, message }
  if (details) payload.details = details
  return res.status(statusCode).json(payload)
}
