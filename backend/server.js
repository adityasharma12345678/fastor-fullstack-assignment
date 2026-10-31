const path = require('node:path')

require('dotenv').config({ path: path.join(__dirname, '.env') })

const app = require('./app')
const connectDatabase = require('./config/db')

const port = Number(process.env.PORT) || 5000

async function startServer() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a secret of at least 32 characters.')
  }
  await connectDatabase()
  app.listen(port, () => {
    console.log(`CRM API listening on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error('Unable to start the CRM API:', error.message)
  process.exitCode = 1
})