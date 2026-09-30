import cors from 'cors'
import express from 'express'

import { config } from './config.js'
import { contactRouter } from './routes/contact.js'

const app = express()

app.use(cors({ origin: config.corsOrigins }))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Backend działa.' })
})

app.use('/api', contactRouter)

app.use((_req, res) => {
  res.status(404).json({ ok: false, message: 'Nie znaleziono zasobu.' })
})

app.listen(config.port, () => {
  console.log(`Backend nasłuchuje na http://localhost:${config.port}`)
  console.log(`Webhook (do podpięcia): ${config.webhook.url}`)
})
