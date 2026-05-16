import cors from 'cors'
import express from 'express'
import authRoutes    from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import adminRoutes   from './routes/admin.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).json({ name: 'GlowLogic API', version: '1', health: '/api/v1/health' })
})

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/v1/auth',     authRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/admin',    adminRoutes)

export default app