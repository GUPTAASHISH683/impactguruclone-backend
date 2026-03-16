// src/app.js – Funddoo Express application
import express           from 'express'
import cors              from 'cors'
import helmet            from 'helmet'
import morgan            from 'morgan'
import dotenv            from 'dotenv'

import navigationRoutes  from './routes/navigation.routes.js'
import footerRoutes      from './routes/footer.routes.js'
import pageRoutes        from './routes/page.routes.js'
import campaignRoutes    from './routes/campaign.routes.js'
import categoryRoutes    from './routes/category.routes.js'
import testimonialRoutes from './routes/testimonial.routes.js'
import faqRoutes         from './routes/faq.routes.js'
import settingsRoutes    from './routes/settings.routes.js'

import { errorHandler, notFound } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

// ── CORS ────────────────────────────────────────────
// Configure allowed origins via FRONTEND_URL env var in production.
// Additional origins can be added to EXTRA_ORIGINS (comma-separated).
const buildOriginList = () => {
  const origins = new Set()

  // Always allow localhost dev
  origins.add('http://localhost:5173')
  origins.add('http://localhost:3000')

  // Primary frontend URL from env
  if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL.split(',').map(o => o.trim()).filter(Boolean).forEach(o => origins.add(o))
  }

  // Any extra origins (e.g. preview deployments)
  if (process.env.EXTRA_ORIGINS) {
    process.env.EXTRA_ORIGINS.split(',').map(o => o.trim()).filter(Boolean).forEach(o => origins.add(o))
  }

  return origins
}

const ALLOWED_ORIGINS = buildOriginList()

app.use(helmet())
app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser requests (Postman, Railway healthchecks, etc.)
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.has(origin)) return cb(null, true)
    cb(new Error(`CORS: origin not allowed — ${origin}`))
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ── Health check ───────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success:   true,
    status:    'ok',
    service:   'Funddoo API',
    version:   process.env.npm_package_version || '1.0.0',
    env:       process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

// ── API routes ─────────────────────────────────────
app.use('/api/navigation',   navigationRoutes)
app.use('/api/footer',       footerRoutes)
app.use('/api/pages',        pageRoutes)
app.use('/api/campaigns',    campaignRoutes)
app.use('/api/categories',   categoryRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/faqs',         faqRoutes)
app.use('/api/settings',     settingsRoutes)

// ── 404 + global error handler ─────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
