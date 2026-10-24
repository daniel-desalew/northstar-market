const mongoose = require('mongoose')
const Category = require('../models/Category')
const Product = require('../models/Product')
const ApiError = require('../utils/ApiError')

const MAX_PAGE_SIZE = 50

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function listProducts(query) {
  const minPrice = query.minPrice === undefined ? undefined : Number(query.minPrice)
  const maxPrice = query.maxPrice === undefined ? undefined : Number(query.maxPrice)
  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
    throw new ApiError(400, 'minPrice must be a non-negative number.')
  }
  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
    throw new ApiError(400, 'maxPrice must be a non-negative number.')
  }
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new ApiError(400, 'minPrice cannot be greater than maxPrice.')
  }

  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const requestedLimit = Number.parseInt(query.limit, 10) || 12
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, requestedLimit))
  const filter = { isActive: true }

  if (query.category) {
    if (mongoose.isValidObjectId(query.category)) {
      filter.category = query.category
    } else {
      const slug = query.category.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const category = await Category.findOne({ slug, isActive: true }).select('_id').lean()
      if (!category) {
        return { products: [], pagination: { page, limit, total: 0, pages: 0 } }
      }
      filter.category = category._id
    }
  }

  if (minPrice !== undefined) filter.price = { ...filter.price, $gte: minPrice }
  if (maxPrice !== undefined) filter.price = { ...filter.price, $lte: maxPrice }
  if (query.search && typeof query.search === 'string') {
    const search = escapeRegex(query.search.trim().slice(0, 100))
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }
  if (query.featured === 'true') filter.featured = true

  const sortOptions = {
    popular: { featured: -1, reviewCount: -1, createdAt: -1 },
    'price-asc': { price: 1, _id: 1 },
    'price-desc': { price: -1, _id: 1 },
    rating: { rating: -1, reviewCount: -1 },
    newest: { createdAt: -1 },
  }
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOptions[query.sort] || sortOptions.popular)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ])

  return { products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
}

async function getProductById(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid product identifier.')
  const product = await Product.findOne({ _id: id, isActive: true })
    .populate('category', 'name slug')
    .lean()
  if (!product) throw new ApiError(404, 'Product not found.')
  return product
}

async function resolveCategory(value) {
  const categoryQuery = mongoose.isValidObjectId(value)
    ? { _id: value }
    : { slug: value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
  const category = await Category.findOne({ ...categoryQuery, isActive: true })
  if (!category) throw new ApiError(400, 'Select an existing active category.')
  return category
}

async function createProduct(data) {
  const category = await resolveCategory(data.category)
  const image = Array.isArray(data.image) ? data.image : data.image ? [data.image] : []
  const product = await Product.create({ ...data, image, category: category._id })
  return product.populate('category', 'name slug')
}

async function updateProduct(id, data) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid product identifier.')
  const update = { ...data }
  if (update.category) {
    const category = await resolveCategory(update.category)
    update.category = category._id
  }
  if (update.image !== undefined && !Array.isArray(update.image)) {
    update.image = update.image ? [update.image] : []
  }
  const product = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: update },
    { new: true, runValidators: true },
  ).populate('category', 'name slug')
  if (!product) throw new ApiError(404, 'Product not found.')
  return product
}

async function archiveProduct(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid product identifier.')
  const product = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: { isActive: false } },
    { new: true },
  )
  if (!product) throw new ApiError(404, 'Product not found.')
  return product
}

module.exports = { archiveProduct, createProduct, getProductById, listProducts, updateProduct }