const mongoose = require('mongoose')

async function connectDatabase() {
  const { MONGODB_URI } = process.env
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Configure server/.env before starting the API.')
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  console.info(`MongoDB connected: ${mongoose.connection.name}`)
  return mongoose.connection
}

module.exports = { connectDatabase }