// src/middleware/validate.js - Simple request validation helper

export function requireQuery(fields) {
  return (req, res, next) => {
    for (const field of fields) {
      if (!req.query[field]) {
        const err = new Error(`Missing required query param: ${field}`)
        err.status = 400
        return next(err)
      }
    }
    next()
  }
}

export function requireBody(fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => req.body[f] === undefined || req.body[f] === '')
    if (missing.length > 0) {
      const err = new Error(`Missing required fields: ${missing.join(', ')}`)
      err.status = 400
      return next(err)
    }
    next()
  }
}
