require('dotenv').config()

const mongoose = require('mongoose')
const Category = require('../models/Category')
const Product = require('../models/Product')
const { categories, products } = require('./sampleProducts')

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Set it in server/.env before seeding.')
  }
  await mongoose.connect(process.env.MONGODB_URI)
  const categoryIds = new Map()

  for (const data of categories) {
    const slug = slugify(data.name)
    const category = await Category.findOneAndUpdate(
      { slug },
      { $set: { ...data, slug, isActive: true } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    )
    categoryIds.set(data.name, category._id)
  }

  for (const data of products) {
    const { category, ...product } = data
    await Product.findOneAndUpdate(
      { name: product.name },
      { $set: { ...product, category: categoryIds.get(category), isActive: true } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    )
  }

  console.info(`Seeded ${categories.length} categories and ${products.length} products. Existing matching records were updated; other records were not deleted.`)
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })