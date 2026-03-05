// src/middleware/errorHandler.js - Global error handler

export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err)

  // Prisma known errors
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found' })
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Duplicate entry - unique constraint violated' })
  }

  // Validation errors (manually thrown)
  if (err.status === 400) {
    return res.status(400).json({ success: false, message: err.message })
  }

  // Default 500
  const statusCode = err.status || err.statusCode || 500
  const message    = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : (err.message || 'Something went wrong')

  res.status(statusCode).json({ success: false, message })
}

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` })
}
