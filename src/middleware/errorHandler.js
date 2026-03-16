// src/middleware/errorHandler.js — Funddoo global error handler

export function errorHandler(err, req, res, _next) {
  // Only log unexpected errors — not Prisma not-found, which are routine
  if (!['P2025'].includes(err.code)) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
      message: err.message,
      code:    err.code,
      status:  err.status || err.statusCode,
    })
  }

  // Prisma: record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found' })
  }

  // Prisma: unique constraint
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Duplicate entry — unique constraint violated' })
  }

  // Prisma: foreign key constraint
  if (err.code === 'P2003') {
    return res.status(400).json({ success: false, message: 'Related record not found' })
  }

  // Manually thrown validation errors
  if (err.status === 400) {
    return res.status(400).json({ success: false, message: err.message })
  }

  // CORS errors
  if (err.message?.startsWith('CORS:')) {
    return res.status(403).json({ success: false, message: err.message })
  }

  const statusCode = err.status || err.statusCode || 500
  const message    = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : (err.message || 'Something went wrong')

  res.status(statusCode).json({ success: false, message })
}

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}
