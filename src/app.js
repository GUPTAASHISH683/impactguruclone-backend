// src/app.js – Express application setup
import express            from 'express'
import cors               from 'cors'
import helmet             from 'helmet'
import morgan             from 'morgan'

import navigationRoutes   from './routes/navigation.routes.js'
import footerRoutes       from './routes/footer.routes.js'
import pageRoutes         from './routes/page.routes.js'
import campaignRoutes     from './routes/campaign.routes.js'
import categoryRoutes     from './routes/category.routes.js'
import testimonialRoutes  from './routes/testimonial.routes.js'
import faqRoutes          from './routes/faq.routes.js'
import settingsRoutes     from './routes/settings.routes.js'

import { errorHandler, notFound } from './middleware/errorHandler.js'

import dotenv from "dotenv";
dotenv.config();

const app = express()

// ── Security & utility middleware ──────────────────
app.use(helmet())
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'http://localhost:5173/',
  'https://impactguruclone.vercel.app',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error('CORS: origin not allowed'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ── Health check ───────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() })
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

// ── 404 & global error handler ─────────────────────
app.use(notFound)
app.use(errorHandler)

export default app