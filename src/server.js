// src/server.js - Funddoo API entry point
import app from './app.js'

const PORT = parseInt(process.env.PORT || '4000', 10)
const ENV  = process.env.NODE_ENV || 'development'

const server = app.listen(PORT, () => {
  console.log(`\n🚀  Funddoo API — ${ENV}`)
  console.log(`   ➜  http://localhost:${PORT}/api/health\n`)
})

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully…`)
  server.close(() => {
    console.log('HTTP server closed.\n')
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000)
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))
