const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const leadRoutes = require('./routes/leadRoutes')
const { errorHandler, notFound } = require('./middleware/errorHandler')

const app = express()
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : true

app.disable('x-powered-by')
app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '20kb' }))
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)
app.use(notFound)
app.use(errorHandler)

module.exports = app
