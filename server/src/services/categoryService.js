const mongoose = require('mongoose')
const Category = require('../models/Category')
const Product = require('../models/Product')
const ApiError = require('../utils/ApiError')

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function listCategories() {
  return Category.find({ isActive: true }).sort({ name: 1 }).lean()
}

async function createCategory(data) {
  return Category.create({ ...data, slug: slugify(data.name) })
}

async function archiveCategory(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid category identifier.')
  if (await Product.exists({ category: id, isActive: true })) {
    throw new ApiError(409, 'Archive or move this category’s products before archiving it.')
  }
  const category = await Category.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: { isActive: false } },
    { new: true },
  )
  if (!category) throw new ApiError(404, 'Category not found.')
  return category
}

module.exports = { archiveCategory, createCategory, listCategories }
