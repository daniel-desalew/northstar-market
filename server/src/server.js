require('dotenv').config()

const app = require('./app')
const mongoose = require('mongoose')
const { connectDatabase } = require('./config/db')

const port = Number(process.env.PORT) || 5000
let server

async function startServer() {
  await connectDatabase()
  server = app.listen(port, () => {
    console.info(`API listening on http://localhost:${port}`)
  })
}

async function shutdown(signal) {
  console.info(`${signal} received; shutting down gracefully.`)
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
  }
  await mongoose.disconnect()
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    shutdown(signal).then(() => process.exit(0)).catch((error) => {
      console.error('Shutdown failed:', error)
      process.exit(1)
    })
  })
}

startServer().catch((error) => {
  console.error('Failed to start API:', error)
  process.exit(1)
})