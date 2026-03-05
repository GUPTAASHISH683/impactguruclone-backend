// src/server.js - HTTP server entry point
import app from './app.js'

const PORT = parseInt(process.env.PORT || '4000', 10)

app.listen(PORT, () => {
  console.log(`\n🚀  ImpactGuru API running`)
  console.log(`   ➜  http://localhost:${PORT}/api/health\n`)
})
